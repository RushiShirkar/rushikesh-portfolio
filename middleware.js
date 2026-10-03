// Vercel Routing Middleware: Markdown content negotiation for agents.
// Requests that prefer text/markdown get the Markdown twin of a page,
// or a Markdown 404 for unknown paths. Everything else falls through
// to the static site unchanged.

export const config = {
  // Page paths only (no file extension), so assets and the .md files
  // themselves never pass through here.
  matcher: ['/((?!.*\\.).*)'],
};

export const SITE = 'https://rushishirkar.com';

export const PAGES = {
  '/': '/index.md',
  '/index': '/index.md',
  '/about': '/about.md',
  '/contact': '/contact.md',
  '/privacy': '/privacy.md',
};

export const NOT_FOUND_MD = `# 404: Page not found

The page you requested does not exist on rushishirkar.com, the portfolio of Rushikesh Shirkar, Senior Software Engineer.

Useful starting points:

- [Home](${SITE}/): Full profile
- [About](${SITE}/about): Biography and career summary
- [Contact](${SITE}/contact): Email, phone and profiles
- [llms.txt](${SITE}/llms.txt): Guide for AI assistants
- [Sitemap](${SITE}/sitemap.xml): All public pages
`;

const MD_TYPES = ['text/markdown', 'text/x-markdown'];

// Parse an Accept header into [{type, q}] entries.
function parseAccept(accept) {
  return String(accept || '')
    .split(',')
    .map((part) => {
      const [type, ...params] = part.trim().toLowerCase().split(';').map((s) => s.trim());
      const qp = params.find((p) => p.startsWith('q='));
      const q = qp ? Number(qp.slice(2)) : 1;
      return { type, q: Number.isFinite(q) ? q : 0 };
    })
    .filter((e) => e.type);
}

// True when the client asks for Markdown at least as strongly as HTML.
export function prefersMarkdown(accept) {
  const entries = parseAccept(accept);
  const qOf = (types) => Math.max(0, ...entries.filter((e) => types.includes(e.type)).map((e) => e.q));
  const md = qOf(MD_TYPES);
  if (md <= 0) return false;
  return md >= qOf(['text/html', 'application/xhtml+xml']);
}

function markdownResponse(body, status, method, canonical) {
  const headers = {
    'Content-Type': 'text/markdown; charset=utf-8',
    Vary: 'Accept',
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'X-Robots-Tag': status === 404 ? 'noindex' : 'all',
  };
  if (canonical) headers.Link = `<${canonical}>; rel="canonical"`;
  return new Response(method === 'HEAD' ? null : body, { status, headers });
}

export default async function middleware(request, fetchImpl = fetch) {
  if (!prefersMarkdown(request.headers.get('accept'))) return undefined;

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const twin = PAGES[path];

  if (!twin) return markdownResponse(NOT_FOUND_MD, 404, request.method);

  const res = await fetchImpl(new URL(twin, url), { headers: { accept: 'text/markdown' } });
  if (!res.ok) return undefined; // fall back to the HTML page
  const canonical = SITE + (path === '/' || path === '/index' ? '/' : path);
  return markdownResponse(await res.text(), 200, request.method, canonical);
}
