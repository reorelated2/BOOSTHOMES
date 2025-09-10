// Year, mobile nav, tiny slider
document.getElementById('year')?.append(new Date().getFullYear());
const btn = document.getElementById('menuBtn'), list = document.getElementById('navList');
btn?.addEventListener('click', ()=>{ const open = list.classList.toggle('open'); btn.setAttribute('aria-expanded', open?'true':'false'); });

const slides = Array.from(document.querySelectorAll('.slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
let idx = 0;
function show(i){ slides.forEach((s,k)=>s.classList.toggle('active', k===i)); dots.forEach((d,k)=>d.classList.toggle('active', k===i)); }
dots.forEach((d,i)=>d.addEventListener('click', ()=>{ idx=i; show(idx);}));
setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 6000);
show(0);
