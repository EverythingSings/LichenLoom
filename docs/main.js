document.addEventListener('DOMContentLoaded',()=>{
  const tree=document.getElementById('story-tree');
  const nav=document.getElementById('nav');
  const canvas=document.getElementById('mycelial');
  const ctx=canvas.getContext('2d');
  const center={x:canvas.width/2,y:canvas.height/2};
  const counts=[];
  function count(ul,d=0){
    counts[d]=(counts[d]||0)+ul.children.length;
    for(const li of ul.children){
      const sub=li.querySelector(':scope>ul');
      if(sub)count(sub,d+1);
    }
  }
  count(tree);
  const idx=[];
  function place(li,d,parent){
    idx[d]=idx[d]||0;
    const angle=(idx[d]/counts[d])*2*Math.PI;
    idx[d]++;
    const r=80*d;
    const x=center.x+r*Math.cos(angle);
    const y=center.y+r*Math.sin(angle);
    const link=li.querySelector('a');
    const node=document.createElement('a');
    node.className='node';
    if(link){
      node.href=link.getAttribute('href');
      node.dataset.label=link.textContent;
    }else{
      node.dataset.label=li.firstChild.textContent.trim();
    }
    nav.appendChild(node);
    node.style.left=(x-4)+'px';
    node.style.top=(y-4)+'px';
    ctx.beginPath();
    ctx.moveTo(parent.x,parent.y);
    ctx.lineTo(x,y);
    ctx.stroke();
    const sub=li.querySelector(':scope>ul');
    if(sub)for(const child of sub.children)place(child,d+1,{x,y});
  }
  ctx.strokeStyle='#ccc';
  const rootNode=document.createElement('a');
  rootNode.className='node';
  rootNode.dataset.label='LichenLoom';
  nav.appendChild(rootNode);
  rootNode.style.left=(center.x-4)+'px';
  rootNode.style.top=(center.y-4)+'px';
  for(const child of tree.children)place(child,1,center);

  const toggle=document.getElementById('dark-toggle');
  if(toggle){
    if(localStorage.getItem('dark')==='true') document.documentElement.classList.add('dark');
    toggle.addEventListener('click',()=>{
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('dark',document.documentElement.classList.contains('dark'));
    });
  }

  const bc=document.getElementById('breadcrumb');
  if(bc){
    const parts=window.location.pathname.replace(/(^\/|$)/g,'').split('/');
    const spans=[];
    spans.push(`<span><a href="${'../'.repeat(parts.length-1)}index.html">Home</a></span>`);
    for(let i=0;i<parts.length;i++){
      let label=parts[i].replace('.html','');
      if(label==='index') continue;
      spans.push(`<span>${label}</span>`);
    }
    bc.innerHTML=spans.join('');
  }
});
