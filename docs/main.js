document.addEventListener('DOMContentLoaded',()=>{
  const tree=document.getElementById('story-tree');
  const nav=document.getElementById('nav');
  const canvas=document.getElementById('mycelial');
  let ctx,center;
  const counts=[];
  if(tree && nav && canvas){
    ctx=canvas.getContext('2d');
    center={x:canvas.width/2,y:canvas.height/2};
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
    rootNode.href=`${'../'.repeat(window.location.pathname.replace(/(^\/|$)/g,'').split('/').length-1)}index.html`;
    nav.appendChild(rootNode);
    rootNode.style.left=(center.x-4)+'px';
    rootNode.style.top=(center.y-4)+'px';
    for(const child of tree.children)place(child,1,center);
  }

  const toggle=document.getElementById('dark-toggle');
  if(toggle){
    if(localStorage.getItem('dark') !== 'false'){
      document.documentElement.classList.add('dark');
    }
    toggle.addEventListener('click',()=>{
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('dark',document.documentElement.classList.contains('dark'));
    });
  }

  const bc=document.getElementById('breadcrumb');
  if(bc){
    const parts=window.location.pathname.replace(/(^\/|$)/g,'').split('/');
    const indices=parts.map((p,i)=>p==='index.html'?null:i).filter(i=>i!==null);
    const last=indices[indices.length-1];
    const crumbs=[];
    const homeLink=`${'../'.repeat(parts.length-1)}index.html`;
    crumbs.push(parts.length>1?`<span><a href="${homeLink}">Home</a></span>`:`<span>Home</span>`);
    for(const i of indices){
      const label=parts[i].replace('.html','');
      const pre=`${'../'.repeat(parts.length-i-1)}${parts.slice(0,i+1).join('/')}`;
      if(i===last){
        crumbs.push(`<span>${label}</span>`);
      }else{
        crumbs.push(`<span><a href="${pre}/index.html">${label}</a></span>`);
      }
    }
    bc.innerHTML=crumbs.join('');
  }
});
