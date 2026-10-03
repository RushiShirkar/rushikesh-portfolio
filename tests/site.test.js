import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { PAGES } from '../middleware.js';

const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const SITE = 'https://rushishirkar.com';
const TRUST = ['about', 'contact', 'privacy'];
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const jsonLd = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1].replace(/<\\\//g, '</'));

test('vercel.json enables clean URLs and Vary: Accept on pages', () => {
  const v = JSON.parse(read('vercel.json'));
  assert.equal(v.cleanUrls, true);
  const page = v.headers.find((h) => h.source === '/((?!.*\\.).*)');
  assert.deepEqual(page.headers, [{ key: 'Vary', value: 'Accept' }]);
  const md = v.headers.find((h) => h.source === '/(.*)\\.md');
  assert.ok(md.headers.some((h) => h.key === 'Content-Type' && h.value.startsWith('text/markdown')));
});

test('every negotiated page has a non-empty Markdown twin and an HTML page', () => {
  for (const [path, twin] of Object.entries(PAGES)) {
    const md = read(twin.slice(1));
    assert.match(md, /^# \S/, twin);
    assert.ok(md.length > 300, twin);
    const html = path === '/' || path === '/index' ? 'index.html' : path.slice(1) + '.html';
    assert.ok(existsSync(new URL('../' + html, import.meta.url)), html);
  }
});

test('trust pages have real content, canonical URLs and structured data', () => {
  for (const p of TRUST) {
    const html = read(p + '.html');
    const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
    assert.ok(text(main).length >= 500, `${p} main text is ${text(main).length} chars`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${SITE}/${p}">`));
    assert.match(html, new RegExp(`<link rel="alternate" type="text/markdown" href="/${p}.md"`));
    assert.equal(jsonLd(html)['@id'], `${SITE}/${p}#page`);
    assert.ok(read(p + '.md').length >= 500, `${p}.md`);
  }
});

test('homepage links to the trust pages and Markdown version', () => {
  const html = read('index.html');
  for (const p of TRUST) assert.match(html, new RegExp(`<a href="/${p}">`));
  assert.match(html, /<link rel="alternate" type="text\/markdown" href="\/index\.md"/);
});

test('Person schema has contactPoint and a postal address', () => {
  const graph = jsonLd(read('index.html'))['@graph'];
  const person = graph.find((n) => n['@type'] === 'Person');
  assert.equal(person.address['@type'], 'PostalAddress');
  assert.equal(person.contactPoint['@type'], 'ContactPoint');
  assert.ok(person.contactPoint.email && person.contactPoint.telephone && person.contactPoint.contactType);
  const faq = graph.find((n) => n['@type'] === 'FAQPage');
  const visible = text(read('index.html'));
  for (const q of faq.mainEntity) assert.ok(visible.includes(q.acceptedAnswer.text), q.name);
});

test('llms.txt follows the llmstxt.org structure and gives when-to-use guidance', () => {
  const t = read('llms.txt');
  const lines = t.split('\n');
  assert.match(lines[0], /^# \S/, 'starts with a single H1');
  assert.equal(lines.filter((l) => /^# /.test(l)).length, 1);
  assert.match(t, /^> \S/m, 'has a summary blockquote');
  const firstH2 = t.indexOf('\n## ');
  assert.ok(!/^#{3,} /m.test(t), 'no H3+ headings');
  assert.match(t.slice(0, firstH2), /\*\*When to use this site\.\*\*/);
  assert.match(t.slice(0, firstH2), /Accept: text\/markdown/);
  for (const section of t.slice(firstH2).split('\n## ').slice(1)) {
    const items = section.split('\n').slice(1).filter(Boolean);
    assert.ok(items.length > 0, 'section has entries');
    for (const i of items) assert.match(i, /^- \[[^\]]+\]\(https?:\/\/[^)]+\)(: .+)?$/, i);
  }
});

test('sitemap lists every indexable page and robots.txt points to it', () => {
  const sm = read('sitemap.xml');
  for (const u of [`${SITE}/`, ...TRUST.map((p) => `${SITE}/${p}`)]) assert.ok(sm.includes(`<loc>${u}</loc>`), u);
  assert.match(read('robots.txt'), new RegExp(`^Sitemap: ${SITE}/sitemap.xml$`, 'm'));
});

test('public copy uses no em-dashes', () => {
  for (const f of ['index.html', 'index.md', 'llms.txt', '404.html', 'middleware.js', ...TRUST.flatMap((p) => [p + '.html', p + '.md'])]) {
    assert.ok(!read(f).includes('—'), f);
  }
});
