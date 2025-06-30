function collectNodes(ul, canvas, parent = null, nodes = []) {
  for (const li of ul.children) {
    const link = li.querySelector('a');
    const node = {
      label: link ? link.textContent : li.firstChild.textContent.trim(),
      href: link ? link.getAttribute('href') : null,
      parent: parent,
      x: canvas.width / 2 + (Math.random() - 0.5) * 20,
      y: canvas.height / 2 + (Math.random() - 0.5) * 20,
      vx: 0,
      vy: 0
    };
    nodes.push(node);
    const sub = li.querySelector(':scope>ul');
    if (sub) collectNodes(sub, canvas, node, nodes);
  }
  return nodes;
}

function setupAnchors(nodes, nav) {
  return nodes.map(n => {
    const a = document.createElement('a');
    a.className = 'node';
    if (n.href) a.href = n.href;
    a.dataset.label = n.label;
    nav.appendChild(a);
    return a;
  });
}

function buildLinks(nodes) {
  return nodes
    .filter(n => n.parent)
    .map(n => ({ source: n.parent, target: n }));
}

function attachControls(canvas, offset, scale) {
  let dragging = false;
  let last = { x: 0, y: 0 };

  canvas.addEventListener('mousedown', e => {
    dragging = true;
    last = { x: e.clientX, y: e.clientY };
    canvas.classList.add('dragging');
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
    canvas.classList.remove('dragging');
  });

  window.addEventListener('mousemove', e => {
    if (dragging) {
      offset.x += e.clientX - last.x;
      offset.y += e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
    }
  });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    scale.value *= e.deltaY < 0 ? 1.1 : 0.9;
  });
}

function navigation() {
  const tree = document.getElementById('story-tree');
  const nav = document.getElementById('nav');
  const canvas = document.getElementById('mycelial');
  if (!tree || !nav || !canvas) return;

  const ctx = canvas.getContext('2d');
  const nodes = collectNodes(tree, canvas);
  const anchors = setupAnchors(nodes, nav);
  const links = buildLinks(nodes);

  const offset = { x: 0, y: 0 };
  const scale = { value: 1 };
  attachControls(canvas, offset, scale);

  const k = 0.01;
  const rep = 2000;
  const damp = 0.6;
  const margin = 100;

  function tick() {
    for (const n of nodes) {
      if (n.parent) {
        const dx = n.x - n.parent.x;
        const dy = n.y - n.parent.y;
        const dist = Math.hypot(dx, dy) || 1;
        const force = (dist - 80) * k;
        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;
        n.vx -= fx;
        n.vy -= fy;
        n.parent.vx += fx;
        n.parent.vy += fy;
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy) || 1;
        const force = rep / (dist * dist);
        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
    }

    for (const n of nodes) {
      n.vx *= damp;
      n.vy *= damp;
      n.x += n.vx;
      n.y += n.vy;
      n.x = Math.max(-margin, Math.min(canvas.width + margin, n.x));
      n.y = Math.max(-margin, Math.min(canvas.height + margin, n.y));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale.value, scale.value);
    ctx.strokeStyle = '#ccc';
    for (const l of links) {
      ctx.beginPath();
      ctx.moveTo(l.source.x, l.source.y);
      ctx.lineTo(l.target.x, l.target.y);
      ctx.stroke();
    }
    ctx.restore();
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const a = anchors[i];
      a.style.left = n.x * scale.value + offset.x - 4 + 'px';
      a.style.top = n.y * scale.value + offset.y - 4 + 'px';
    }
  }

  function animate() {
    tick();
    draw();
    requestAnimationFrame(animate);
  }


  animate();
}

document.addEventListener('DOMContentLoaded', navigation);
