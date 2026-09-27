"""Set deployed metadata and validate local assets using only the standard library."""
import os
import re
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote

root = Path(__file__).parent / 'site'
base = os.environ.get('SITE_URL', '').rstrip('/')
class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attrs):
        self.urls.extend(v for k, v in attrs if k in ('href', 'src') and v)

pages = sorted(root.rglob('*.html'))
for page in pages:
    text = page.read_text(encoding='utf-8')
    scan = Links()
    scan.feed(text)
    for raw in scan.urls:
        url = urlsplit(raw)
        if not url.scheme and not url.netloc and url.path:
            target = (page.parent / unquote(url.path)).resolve()
            assert target.is_relative_to(root.resolve()) and target.is_file(), (page, raw)
    if base:
        address = base + '/' + page.relative_to(root).as_posix()
        text = re.sub(r'<meta property="og:url"[^>]*>|<link rel="canonical"[^>]*>', '', text)
        text = re.sub(r'(<meta property="og:image" content=")([^"]+)', lambda m: m[1] + escape(urljoin(address, m[2]), quote=True), text)
        text = text.replace('</head>', f'<link rel="canonical" href="{escape(address)}"><meta property="og:url" content="{escape(address)}"></head>')
        page.write_text(text, encoding='utf-8')
assert len(pages) == 21
assert not list(root.rglob('*.pdf'))
if base:
    urls = ''.join('<url><loc>' + escape(base + '/' + p.relative_to(root).as_posix()) + '</loc></url>' for p in pages)
    (root / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls + '</urlset>', encoding='utf-8')
print('Validated 21 pages and local assets; original PDFs excluded.')
