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

STYLE = """body{font-family:'Helvetica Neue',sans-serif;background:#f0f0f0;color:#222;margin:2rem;line-height:1.6;}article{max-width:65ch;margin:auto;text-align:center;}h1,h2,h3{font-family:'Georgia',serif;color:#003b30;}a{color:#00584d;text-decoration:none;}a:hover{text-decoration:underline;}#story-tree{display:none;}#nav{position:relative;width:600px;height:600px;margin:2rem auto;}#nav canvas{position:absolute;left:0;top:0;width:100%;height:100%;}#nav a.node{position:absolute;width:8px;height:8px;border-radius:50%;background:#003b30;text-indent:-9999px;}#nav a.node:hover{background:#00584d;}#nav a.node::after{content:attr(data-label);position:absolute;top:-1.5em;left:.5em;font-size:.8rem;background:#f0f0f0;color:#222;padding:2px 4px;border-radius:4px;white-space:nowrap;display:none;}#nav a.node:hover::after{display:block;}"""

JS = """document.addEventListener('DOMContentLoaded',()=>{const tree=document.getElementById('story-tree');const nav=document.getElementById('nav');const canvas=document.getElementById('mycelial');const ctx=canvas.getContext('2d');const center={x:canvas.width/2,y:canvas.height/2};const counts=[];function count(ul,d=0){counts[d]=(counts[d]||0)+ul.children.length;for(const li of ul.children){const sub=li.querySelector(':scope>ul');if(sub)count(sub,d+1);}}count(tree);const idx=[];function place(li,d,parent){idx[d]=idx[d]||0;const angle=(idx[d]/counts[d])*2*Math.PI;idx[d]++;const r=80*d;const x=center.x+r*Math.cos(angle);const y=center.y+r*Math.sin(angle);const link=li.querySelector('a');const node=document.createElement('a');node.className='node';if(link){node.href=link.getAttribute('href');node.dataset.label=link.textContent;}else{node.dataset.label=li.firstChild.textContent.trim();}nav.appendChild(node);node.style.left=(x-4)+'px';node.style.top=(y-4)+'px';ctx.beginPath();ctx.moveTo(parent.x,parent.y);ctx.lineTo(x,y);ctx.stroke();const sub=li.querySelector(':scope>ul');if(sub)for(const child of sub.children)place(child,d+1,{x,y});}ctx.strokeStyle='#ccc';const rootNode=document.createElement('a');rootNode.className='node';rootNode.dataset.label='LichenLoom';nav.appendChild(rootNode);rootNode.style.left=(center.x-4)+'px';rootNode.style.top=(center.y-4)+'px';for(const child of tree.children)place(child,1,center);});"""

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
    if parent is None:
        lines = ["<ul id='story-tree'>"]
    else:
        lines = ["<ul class='hidden'>"]
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

    index_body = [
        "<h1>LichenLoom</h1>",
        "<div id='nav'><canvas id='mycelial' width='600' height='600'></canvas></div>"
    ] + tree_to_lines(tree)
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
