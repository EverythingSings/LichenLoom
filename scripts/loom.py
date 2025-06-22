"""We weave markdown into static pages with our own minimalist touch."""

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
  <script src='{script}' defer></script>
</head>
<body>
<article>
{body}
</article>
</body>
</html>"""

STYLE = """body{font-family:'Helvetica Neue',sans-serif;background:#f0f0f0;color:#222;margin:2rem;line-height:1.6;}article{max-width:65ch;margin:auto;}h1,h2,h3{font-family:'Georgia',serif;color:#003b30;}a{color:#00584d;text-decoration:none;}a:hover{text-decoration:underline;}ul{list-style:none;padding-left:1rem;margin:0;}li{margin:.25rem 0;} .branch>ul{margin-left:1rem;border-left:1px dotted #ccc;padding-left:.5rem;}span.toggle{cursor:pointer;margin-right:.25rem;color:#003b30;transition:transform .2s;display:inline-block;}li.open>span.toggle{transform:rotate(90deg);}ul.hidden{display:none;}"""

JS = """document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('li.branch').forEach(li=>{const sub=li.querySelector('ul');const b=document.createElement('span');b.textContent='▸';b.className='toggle';li.prepend(b);b.addEventListener('click',e=>{e.stopPropagation();li.classList.toggle('open');sub.classList.toggle('hidden');});});});"""

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


def treeify(files):
    tree = {}
    for path in files:
        parts = path.relative_to(ROOT).with_suffix('').parts
        node = tree
        for part in parts[:-1]:
            node = node.setdefault(part, {})
        node[parts[-1]] = path
    return tree


def tree_to_lines(node, parent=None):
    lines = ["<ul class='{}'>".format('hidden' if parent else '')]
    for key in sorted(node):
        val = node[key]
        if isinstance(val, dict):
            lines.append(f"<li class='branch'>{key}")
            lines.extend(tree_to_lines(val, parent=key))
            lines.append("</li>")
        else:
            link = (OUTPUT_DIR / val.relative_to(ROOT).with_suffix('.html')).relative_to(OUTPUT_DIR)
            title = key.replace('_', ' ').title()
            lines.append(f"<li><a href='{link}'>{title}</a></li>")
    lines.append("</ul>")
    return lines


def build():
    OUTPUT_DIR.mkdir(exist_ok=True)
    (OUTPUT_DIR / "style.css").write_text(STYLE)
    (OUTPUT_DIR / "main.js").write_text(JS)

    files = gather_markdown_files()
    tree = treeify(files)

    for md_file in files:
        rel = md_file.relative_to(ROOT)
        out_path = OUTPUT_DIR / rel.with_suffix('.html')
        out_path.parent.mkdir(parents=True, exist_ok=True)
        body = md_to_html(md_file.read_text())
        title = md_file.stem.replace('_', ' ').title()
        style = os.path.relpath(OUTPUT_DIR / "style.css", start=out_path.parent)
        script = os.path.relpath(OUTPUT_DIR / "main.js", start=out_path.parent)
        out_path.write_text(
            TEMPLATE.format(title=title, body=body, style=style, script=script)
        )

    index_body = ["<h1>LichenLoom</h1>"] + tree_to_lines(tree)
    (OUTPUT_DIR / "index.html").write_text(
        TEMPLATE.format(
            title="LichenLoom",
            body="\n".join(index_body),
            style="style.css",
            script="main.js",
        )
    )

if __name__ == "__main__":
    build()
