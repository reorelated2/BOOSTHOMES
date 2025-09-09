// Mobile nav + fade reveals + year + chat widget + listings stub
const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

const btn = document.getElementById('menuBtn');
const drawer = document.getElementById('nav-drawer');
if (btn && drawer) {
  btn.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Intersection observer for fades
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
},{threshold:.15});
document.querySelectorAll('.fade').forEach(el=>io.observe(el));

// Chat widget logic
const chatToggle = document.getElementById('chat-toggle');
const chatPanel = document.getElementById('chat-panel');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatLog = document.getElementById('chat-log');

function addMsg(text, who='ai'){
  const div = document.createElement('div');
  div.className = 'chat-msg ' + (who === 'me' ? 'me' : 'ai');
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

if (chatToggle && chatPanel){
  chatToggle.addEventListener('click', ()=>{
    const open = chatPanel.classList.toggle('open');
    chatToggle.setAttribute('aria-expanded', open?'true':'false');
    if(open){ chatInput?.focus(); }
  });
}
chatClose?.addEventListener('click', ()=>chatPanel.classList.remove('open'));

chatForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const q = chatInput.value.trim();
  if(!q) return;
  addMsg(q, 'me');
  chatInput.value = '';
  try{
    const r = await fetch('/api/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: q })});
    const data = await r.json();
    addMsg(data.reply || 'No reply.');
  }catch(err){
    addMsg('Error reaching AI. Try again in a bit.');
  }
});

// Placeholder listings loader (will work once /api/listings is live)
async function loadListings(){
  const grid = document.getElementById('listing-grid');
  if(!grid) return;
  try{
    const r = await fetch('/api/listings?city=Miami&limit=9');
    if(!r.ok) return;
    const { items } = await r.json();
    if(!items?.length) return;
    grid.innerHTML='';
    items.forEach(it=>{
      const el = document.createElement('article');
      el.className='card fade visible';
      el.innerHTML = \`
        <img src="\${it.photo || 'assets/img/avatar.svg'}" alt="" style="border-radius:12px;margin-bottom:10px;max-height:180px;object-fit:cover;width:100%;">
        <h3>\$ \${Number(it.price).toLocaleString()}</h3>
        <p>\${it.address || '—'}</p>
        <p>\${it.beds||'–'} bd • \${it.baths||'–'} ba • \${it.sqft?it.sqft.toLocaleString()+' sf':'—'}</p>
        <small class="muted">Courtesy of \${it.attribution||'—'}</small>
      \`;
      grid.appendChild(el);
    });
  }catch(e){ /* ignore for now */ }
}
document.addEventListener('DOMContentLoaded', loadListings);
