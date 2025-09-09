const yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();
const btn = document.getElementById('menuBtn'); const list = document.getElementById('navList');
btn?.addEventListener('click', ()=>{ const open = list.classList.toggle('open'); btn.setAttribute('aria-expanded', open?'true':'false'); });
