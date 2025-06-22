document.addEventListener('DOMContentLoaded',()=>{
  const tree=document.getElementById('story-tree');
  const nav=document.getElementById('nav');
  const counts=[];
  if(tree && nav){
    const svgNS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(svgNS,'svg');
    svg.setAttribute('width','600');
    svg.setAttribute('height','600');
    svg.id='constellation';
    nav.appendChild(svg);
    const center={x:300,y:300};
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
      const href=link?link.getAttribute('href'):null;
      const label=link?link.textContent:li.firstChild.textContent.trim();
      const line=document.createElementNS(svgNS,'line');
      line.setAttribute('x1',parent.x);
      line.setAttribute('y1',parent.y);
      line.setAttribute('x2',x);
      line.setAttribute('y2',y);
      svg.appendChild(line);
      const anchor=document.createElementNS(svgNS,'a');
      if(href)anchor.setAttribute('href',href);
      const circle=document.createElementNS(svgNS,'circle');
      circle.setAttribute('cx',x);
      circle.setAttribute('cy',y);
      circle.setAttribute('r',4);
      const title=document.createElementNS(svgNS,'title');
      title.textContent=label;
      circle.appendChild(title);
      anchor.appendChild(circle);
      svg.appendChild(anchor);
      const sub=li.querySelector(':scope>ul');
      if(sub)for(const child of sub.children)place(child,d+1,{x,y});
    }
    const rootAnchor=document.createElementNS(svgNS,'a');
    rootAnchor.setAttribute('href',`${'../'.repeat(window.location.pathname.replace(/(^\/|$)/g,'').split('/').length-1)}index.html`);
    const rootCircle=document.createElementNS(svgNS,'circle');
    rootCircle.setAttribute('cx',center.x);
    rootCircle.setAttribute('cy',center.y);
    rootCircle.setAttribute('r',4);
    const rootTitle=document.createElementNS(svgNS,'title');
    rootTitle.textContent='LichenLoom';
    rootCircle.appendChild(rootTitle);
    rootAnchor.appendChild(rootCircle);
    svg.appendChild(rootAnchor);
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
