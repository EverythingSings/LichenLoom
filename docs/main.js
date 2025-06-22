const NAV_TREE = {name:'LichenLoom',link:'index.html',children:[
  {name:'genesis',link:'genesis/index.html',children:[
    {name:'seed',link:'genesis/seed/index.html'},
    {name:'spore',link:'genesis/spore/index.html'}]},
  {name:'odyssey',link:'odyssey/index.html',children:[
    {name:'whispers',link:'odyssey/whispers/index.html'}]}
]};

function setupDarkMode(){
  const toggle = document.getElementById('dark-toggle');
  if(!toggle) return;
  if(localStorage.getItem('dark') !== 'false'){
    document.documentElement.classList.add('dark');
  }
  toggle.addEventListener('click',function(){
    const on = document.documentElement.classList.toggle('dark');
    localStorage.setItem('dark',on);
  });
}

function buildBreadcrumb(){
  const bc = document.getElementById('breadcrumb');
  if(!bc) return;
  const parts = window.location.pathname.replace(/(^\/|$)/g,'').split('/');
  const indices = [];
  for(let i=0;i<parts.length;i++){
    if(parts[i] !== 'index.html') indices.push(i);
  }
  const last = indices[indices.length-1];
  const crumbs = [];
  const prefix = '../'.repeat(parts.length-1);
  if(parts.length>1){
    crumbs.push(`<span><a href="${prefix}index.html">Home</a></span>`);
  }else{
    crumbs.push('<span>Home</span>');
  }
  for(const idx of indices){
    const label = parts[idx].replace('.html','');
    const pre = '../'.repeat(parts.length-idx-1)+parts.slice(0,idx+1).join('/');
    if(idx === last){
      crumbs.push(`<span>${label}</span>`);
    }else{
      crumbs.push(`<span><a href="${pre}/index.html">${label}</a></span>`);
    }
  }
  bc.innerHTML = crumbs.join('');
}

function drawNav(){
  const svg = document.getElementById('nav');
  if(!svg) return;
  const parts = window.location.pathname.replace(/(^\/|$)/g,'').split('/');
  const prefix = '../'.repeat(parts.length-1);
  const size = 600;
  svg.setAttribute('viewBox',`0 0 ${size} ${size}`);
  const center = {x:size/2,y:size/2};
  const counts = [];
  (function count(nodes,d=1){
    counts[d]=(counts[d]||0)+nodes.length;
    nodes.forEach(n=>n.children&&count(n.children,d+1));
  })(NAV_TREE.children);
  const idx = {};
  function place(node,d,parent){
    let pos = parent;
    if(d){
      const angle=((idx[d]||0)/counts[d])*2*Math.PI;
      idx[d]=(idx[d]||0)+1;
      const r=80*d;
      pos={x:center.x+r*Math.cos(angle),y:center.y+r*Math.sin(angle)};
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',parent.x);
      line.setAttribute('y1',parent.y);
      line.setAttribute('x2',pos.x);
      line.setAttribute('y2',pos.y);
      svg.appendChild(line);
    }
    const link=document.createElementNS('http://www.w3.org/2000/svg','a');
    link.setAttribute('href',prefix+node.link);
    const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx',pos.x);
    circle.setAttribute('cy',pos.y);
    circle.setAttribute('r',d?5:6);
    const title=document.createElementNS('http://www.w3.org/2000/svg','title');
    title.textContent=node.name;
    link.appendChild(circle);
    link.appendChild(title);
    svg.appendChild(link);
    if(node.children) node.children.forEach(n=>place(n,d+1,pos));
  }
  place(NAV_TREE,0,center);
}

document.addEventListener('DOMContentLoaded',function(){
  setupDarkMode();
  buildBreadcrumb();
  drawNav();
});
