import { test } from 'node:test';
import assert from 'node:assert/strict';
import vercelEntry, { createMiddleware, prefersMarkdown, config, PAGES, NOT_FOUND_MD } from '../middleware.js';

const req = (path, accept, method = 'GET') =>
  new Request('https://rushishirkar.com' + path, { method, headers: accept ? { accept } : {} });

// Stand-in for the deployment serving its own static .md files.
const staticFetch = async (url) => {
  const name = new URL(url).pathname;
  return name.endsWith('.md') && Object.values(PAGES).includes(name)
    ? new Response(`# twin of ${name}\n`, { status: 200 })
    : new Response('missing', { status: 404 });
};

const middleware = (request, fetchImpl) => createMiddleware(fetchImpl)(request);

test('prefersMarkdown follows Accept and q-values', () => {
  assert.equal(prefersMarkdown('text/markdown'), true);
  assert.equal(prefersMarkdown('text/markdown, text/html;q=0.9'), true);
  assert.equal(prefersMarkdown('text/x-markdown'), true);
  assert.equal(prefersMarkdown('text/html, text/markdown;q=0.5'), false);
  assert.equal(prefersMarkdown('text/html,application/xhtml+xml,*/*;q=0.8'), false);
  assert.equal(prefersMarkdown('*/*'), false);
  assert.equal(prefersMarkdown('text/markdown;q=0'), false);
  assert.equal(prefersMarkdown(''), false);
  assert.equal(prefersMarkdown(null), false);
});

test('matcher covers extensionless page paths only', () => {
  const re = new RegExp('^' + config.matcher[0] + '$');
  for (const p of ['/', '/about', '/contact', '/privacy', '/__ora-404-probe-x', '/a/b']) assert.ok(re.test(p), p);
  for (const p of ['/index.md', '/llms.txt', '/styles.css', '/og-image.png', '/about.html']) assert.ok(!re.test(p), p);
});

test('browsers and HTML clients fall through to the static site', async () => {
  assert.equal(await middleware(req('/', 'text/html,*/*;q=0.8'), staticFetch), undefined);
  assert.equal(await middleware(req('/nope', 'text/html'), staticFetch), undefined);
  assert.equal(await middleware(req('/about'), staticFetch), undefined);
});

for (const [path, twin] of Object.entries(PAGES)) {
  test(`markdown request for ${path} returns ${twin}`, async () => {
    const res = await middleware(req(path, 'text/markdown'), staticFetch);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /^text\/markdown/);
    assert.equal(res.headers.get('vary'), 'Accept');
    assert.match(res.headers.get('link'), /rel="canonical"/);
    assert.equal(await res.text(), `# twin of ${twin}\n`);
  });
}

test('trailing slash is normalised', async () => {
  const res = await middleware(req('/about/', 'text/markdown'), staticFetch);
  assert.equal(await res.text(), '# twin of /about.md\n');
});

test('unknown path returns a Markdown 404 body', async () => {
  const res = await middleware(req('/__ora-404-probe-tv3bduj5', 'text/markdown'), staticFetch);
  assert.equal(res.status, 404);
  assert.match(res.headers.get('content-type'), /^text\/markdown/);
  assert.equal(res.headers.get('vary'), 'Accept');
  const body = await res.text();
  assert.equal(body, NOT_FOUND_MD);
  assert.ok(body.length >= 20);
  assert.match(body, /\]\(https:\/\/rushishirkar\.com\/llms\.txt\)/);
  assert.match(body, /\]\(https:\/\/rushishirkar\.com\/sitemap\.xml\)/);
});

test('HEAD returns headers without a body', async () => {
  const res = await middleware(req('/', 'text/markdown', 'HEAD'), staticFetch);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), '');
});

test('falls back to HTML if the Markdown twin cannot be fetched', async () => {
  const broken = async () => new Response('err', { status: 500 });
  assert.equal(await middleware(req('/', 'text/markdown'), broken), undefined);
});

test('default export works with the (request, context) signature Vercel uses', async (t) => {
  const context = { waitUntil() {} };
  const realFetch = globalThis.fetch;
  globalThis.fetch = staticFetch;
  t.after(() => { globalThis.fetch = realFetch; });
  assert.equal(await vercelEntry(req('/', 'text/html'), context), undefined);
  const md = await vercelEntry(req('/', 'text/markdown'), context);
  assert.equal(md.status, 200);
  assert.equal(await md.text(), '# twin of /index.md\n');
  const missing = await vercelEntry(req('/nope', 'text/markdown'), context);
  assert.equal(missing.status, 404);
});
