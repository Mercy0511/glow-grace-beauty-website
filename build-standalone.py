"""
build-standalone.py
-------------------
Creates ONE self-contained file: glow-and-grace-standalone.html
It has the CSS, JavaScript and all images embedded inside it, so it looks
correct even if you send it on its own (WhatsApp, email, Instagram preview)
or open it from outside the project folder.

Run it again after every change you make to index.html, style.css or script.js:

    python build-standalone.py

(On some computers the command is:  python3 build-standalone.py  or  py build-standalone.py)
"""
import base64
import mimetypes
import re
from pathlib import Path

ROOT = Path(__file__).parent


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "image/svg+xml"
    if path.suffix == ".svg":
        mime = "image/svg+xml"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


html = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
js = (ROOT / "js" / "script.js").read_text(encoding="utf-8")

# Images used inside the CSS, e.g. url("../images/hero.svg")
css = re.sub(
    r'url\("\.\./(images/[^"]+)"\)',
    lambda m: f'url("{data_uri(ROOT / m.group(1))}")',
    css,
)

# Images used inside the HTML (src="images/..." and data-full="images/...")
html = re.sub(
    r'(src|data-full|href)="(images/[^"]+)"',
    lambda m: f'{m.group(1)}="{data_uri(ROOT / m.group(2))}"',
    html,
)

# Inline the stylesheet and script
html = html.replace(
    '<link rel="stylesheet" href="css/style.css">', f"<style>\n{css}\n</style>"
)
html = html.replace(
    '<script src="js/script.js"></script>', f"<script>\n{js}\n</script>"
)

out = ROOT / "glow-and-grace-standalone.html"
out.write_text(html, encoding="utf-8")
print(f"Created {out.name} ({out.stat().st_size // 1024} KB)")
