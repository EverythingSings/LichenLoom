const NODE_RADIUS = 7;
const SPORE_COUNT = 30;

function createSpores(canvas) {
  const spores = [];
  for (let i = 0; i < SPORE_COUNT; i++) {
    spores.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.2,
      phase: Math.random() * Math.PI * 2,
      attached: null,
      attachTime: 0
    });
  }
  return spores;
}

function updateSpores(spores, nodes, canvas) {
  spores.forEach(spore => {
    // Check if attached to a node
    if (spore.attached) {
      spore.x = spore.attached.x;
      spore.y = spore.attached.y;
      spore.attachTime--;
      if (spore.attachTime <= 0) {
        // Release with a gentle push
        const angle = Math.random() * Math.PI * 2;
        spore.vx = Math.cos(angle) * 0.5;
        spore.vy = Math.sin(angle) * 0.5;
        spore.attached = null;
      }
      spore.phase += 0.04; // Pulse faster when attached
      spore.opacity = 0.3 + Math.sin(spore.phase) * 0.2;
      return;
    }

    // Drift motion
    spore.x += spore.vx;
    spore.y += spore.vy;

    // Gentle attraction to nearest node and possible attachment
    if (nodes.length > 0) {
      let nearest = nodes[0];
      let minDist = Infinity;
      nodes.forEach(n => {
        const dist = Math.hypot(n.x - spore.x, n.y - spore.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = n;
        }
      });

      // Attach if very close
      if (minDist < NODE_RADIUS + 2 && Math.random() < 0.02) {
        spore.attached = nearest;
        spore.attachTime = 60 + Math.random() * 120; // Attach for 1-3 seconds
        spore.vx = 0;
        spore.vy = 0;
      } else if (minDist < 150) {
        // Otherwise just attract
        const dx = nearest.x - spore.x;
        const dy = nearest.y - spore.y;
        spore.vx += dx * 0.00005;
        spore.vy += dy * 0.00005;
      }
    }

    // Damping
    spore.vx *= 0.99;
    spore.vy *= 0.99;

    // Pulsing opacity
    spore.phase += 0.02;
    spore.opacity = 0.2 + Math.sin(spore.phase) * 0.15;

    // Wrap around edges
    if (spore.x < -50) spore.x = canvas.width + 50;
    if (spore.x > canvas.width + 50) spore.x = -50;
    if (spore.y < -50) spore.y = canvas.height + 50;
    if (spore.y > canvas.height + 50) spore.y = -50;
  });
}

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

function loadPositions(nodes) {
  try {
    const saved = JSON.parse(localStorage.getItem('nav-pos') || '{}');
    nodes.forEach(n => {
      const key = n.href || n.label;
      if (saved[key]) {
        n.x = saved[key].x;
        n.y = saved[key].y;
      }
    });
  } catch (_) {}
}

function savePositions(nodes) {
  const map = {};
  nodes.forEach(n => {
    const key = n.href || n.label;
    map[key] = { x: n.x, y: n.y };
  });
  try { localStorage.setItem('nav-pos', JSON.stringify(map)); } catch (_) {}
}

function attachNodeDragging(anchors, nodes, scale, wake) {
  let active = null;
  anchors.forEach((a, i) => {
    a.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      active = { i, x: e.clientX, y: e.clientY };
      if (wake) wake();
      e.preventDefault();
      e.stopPropagation();
    });
  });
  window.addEventListener('mousemove', e => {
    if (!active) return;
    const n = nodes[active.i];
    n.x += (e.clientX - active.x) / scale.value;
    n.y += (e.clientY - active.y) / scale.value;
    active.x = e.clientX;
    active.y = e.clientY;
  });
  window.addEventListener('mouseup', () => {
    if (active) {
      savePositions(nodes);
    }
    active = null;
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
  loadPositions(nodes);
  const anchors = setupAnchors(nodes, nav);
  const links = buildLinks(nodes);

  const offset = { x: 0, y: 0 };
  const scale = { value: 1 };
  let settle = 300;
  const spores = createSpores(canvas);
  attachControls(canvas, offset, scale);
  attachNodeDragging(anchors, nodes, scale, () => { settle = 300; });

  const reset = document.getElementById('reset-view');
  if (reset) {
    reset.addEventListener('click', () => {
      offset.x = 0;
      offset.y = 0;
      scale.value = 1;
    });
  }

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

    // Draw spores
    spores.forEach(spore => {
      ctx.beginPath();
      ctx.arc(spore.x, spore.y, spore.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 59, 48, ${spore.opacity})`;
      ctx.fill();
    });

    // Draw links
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    for (const l of links) {
      ctx.beginPath();
      ctx.moveTo(l.source.x, l.source.y);
      ctx.lineTo(l.target.x, l.target.y);
      ctx.stroke();
    }

    // Draw node glow
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, NODE_RADIUS + 3, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, NODE_RADIUS + 3);
      gradient.addColorStop(0, 'rgba(0, 88, 77, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 88, 77, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    ctx.restore();
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const a = anchors[i];
      a.style.left = n.x * scale.value + offset.x - NODE_RADIUS + 'px';
      a.style.top = n.y * scale.value + offset.y - NODE_RADIUS + 'px';
    }
  }

  function animate() {
    if (settle > 0) {
      tick();
      settle--;
    }
    updateSpores(spores, nodes, canvas);
    draw();
    requestAnimationFrame(animate);
  }


  animate();
}

document.addEventListener('DOMContentLoaded', navigation);
