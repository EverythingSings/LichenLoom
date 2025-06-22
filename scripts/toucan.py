import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIRS = [ROOT / "genesis", ROOT / "odyssey"]
OUTPUT_DIR = ROOT / "docs"
TEMPLATE = """<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <title>{title}</title>
  <link rel='stylesheet' href='{style}'>
</head>
<body>
<article>
{body}
</article>
</body>
</html>"""

STYLE = """body{font-family:sans-serif;background:#fdfdfd;color:#222;margin:2rem;}article{max-width:60ch;margin:auto;}h1,h2,h3{font-family:serif;color:#00524f;}"""

# simple markdown to html

def md_to_html(text: str) -> str:
    lines = text.splitlines()
    html_lines = []
    for line in lines:
        if line.startswith('voice=') or line.startswith('time='):
            continue
        if line.startswith('### '):
            html_lines.append(f"<h3>{line[4:]}</h3>")
        elif line.startswith('## '):
            html_lines.append(f"<h2>{line[3:]}</h2>")
        elif line.startswith('# '):
            html_lines.append(f"<h1>{line[2:]}</h1>")
        elif line.strip() == '':
            html_lines.append('')
        else:
            html_lines.append(f"<p>{line}</p>")
    return "\n".join(html_lines)


def gather_markdown_files():
    files = []
    for base in CONTENT_DIRS:
        for root, _, filenames in os.walk(base):
            for name in filenames:
                if name.endswith('.md'):
                    files.append(Path(root) / name)
    return files


def build():
    OUTPUT_DIR.mkdir(exist_ok=True)
    (OUTPUT_DIR / "style.css").write_text(STYLE)

    index_lines = ["<h1>LichenLoom</h1>", "<ul>"]
    for md_file in gather_markdown_files():
        rel = md_file.relative_to(ROOT)
        out_path = OUTPUT_DIR / rel.with_suffix('.html')
        out_path.parent.mkdir(parents=True, exist_ok=True)
        body = md_to_html(md_file.read_text())
        title = md_file.stem.replace('_', ' ').title()
        style = os.path.relpath(OUTPUT_DIR / "style.css", start=out_path.parent)
        out_path.write_text(TEMPLATE.format(title=title, body=body, style=style))
        link = out_path.relative_to(OUTPUT_DIR)
        index_lines.append(f"<li><a href='{link}'>{title}</a></li>")
    index_lines.append("</ul>")
    style_root = "style.css"
    (OUTPUT_DIR / "index.html").write_text(
        TEMPLATE.format(title="LichenLoom", body="\n".join(index_lines), style=style_root)
    )

if __name__ == "__main__":
    build()
