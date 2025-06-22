document.addEventListener('DOMContentLoaded',()=>{
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
