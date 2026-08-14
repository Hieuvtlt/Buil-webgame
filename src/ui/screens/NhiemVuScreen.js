import './NhiemVuScreen.css'

const monsterQuests = [
  {name:'Săn Huyết Lang', map:'Rừng Huyết Lang', level:'Lv. 26–35', target:'Huyết Lang', count:48, reward:'1.200 vàng · Huyết Linh Chi ×5'},
  {name:'Dẹp Sơn Tặc', map:'Sơn Tặc Sơn', level:'Lv. 31–40', target:'Sơn Tặc', count:55, reward:'1.500 vàng · Nhân Sâm ×5'},
]
const wanted = [
  {name:'Hắc Phong Đao Khách',level:'Lv.43',map:'Rừng Hắc Phong',reward:'2.500 EXP · 3.000 vàng · Đan dược ×2 · Linh dược ×8'},
  {name:'Huyết Ảnh Ma Nhân',level:'Lv.51',map:'Huyết Ảnh Cốc',reward:'3.200 EXP · 4.500 vàng · Đan dược ×2 · Linh dược ×10'},
  {name:'Thiết Diện Quỷ',level:'Lv.68',map:'Thiết Sơn',reward:'5.000 EXP · 7.000 vàng · Đan dược ×3 · Linh dược ×12'},
  {name:'Bạch Cốt Khách',level:'Lv.82',map:'Bạch Cốt Lâm',reward:'7.500 EXP · 10.000 vàng · Đan dược ×3 · Linh dược ×15'},
  {name:'Xích Viêm Cuồng Đồ',level:'Lv.96',map:'Xích Viêm Sơn',reward:'10.000 EXP · 15.000 vàng · Đan dược ×4 · Linh dược ×18'},
]

function monsterView(){return `<div class="quest-summary"><span>⚔ Đang nhận: <b>0/2</b></span><span>Không giới hạn số nhiệm vụ trong ngày</span></div><div class="quest-list">${monsterQuests.map((q,i)=>`<article class="quest-card"><div class="quest-avatar">⚔</div><div><div class="quest-name">${q.name}</div><div class="quest-meta">📍 ${q.map} · ${q.level}<br>🎯 ${q.target}</div><div class="quest-progress">Tiến độ: <strong>0/${q.count}</strong></div><div class="quest-reward">🎁 ${q.reward}</div></div><button class="quest-action" data-quest="monster-${i}">NHẬN NHIỆM VỤ</button></article>`).join('')}</div>`}
function wantedView(){return `<div class="quest-summary"><span>☠ Truy nã hôm nay: <b>0/10</b></span><span>🔄 Làm mới sau: <b id="wanted-timer">01:00:00</b></span></div><div class="wanted-grid">${wanted.map((q,i)=>`<article class="wanted-card"><div class="wanted-head"><div class="quest-avatar">☠</div><div><div class="wanted-name">${q.name}</div><div class="wanted-badge">Boss nhỏ · ${q.level}</div></div></div><div class="wanted-map">📍 ${q.map}<br>🔎 Khả năng gặp: <b>Thấp</b></div><div class="wanted-rewards">🎁 ${q.reward}</div><div class="wanted-status">Mục tiêu chưa được phát hiện...</div><button class="quest-action" data-quest="wanted-${i}">NHẬN TRUY NÃ</button></article>`).join('')}</div>`}

export function NhiemVuScreen(){return `<div class="quest-screen"><div class="quest-tabs"><button class="quest-tab active" data-tab="monster">⚔ NHIỆM VỤ QUÁI VẬT</button><button class="quest-tab" data-tab="wanted">☠ TRUY NÃ</button></div><div id="quest-content">${monsterView()}</div></div>`}

export function mountNhiemVuScreen(){
  const root=document.querySelector('.quest-screen'); if(!root)return
  const content=root.querySelector('#quest-content')
  root.querySelectorAll('.quest-tab').forEach(tab=>tab.addEventListener('click',()=>{root.querySelectorAll('.quest-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');content.innerHTML=tab.dataset.tab==='wanted'?wantedView():monsterView();bindActions()}))
  let seconds=3600
  const timer=setInterval(()=>{if(!document.body.contains(root)){clearInterval(timer);return} seconds=Math.max(0,seconds-1);const el=root.querySelector('#wanted-timer');if(el){const h=String(Math.floor(seconds/3600)).padStart(2,'0'),m=String(Math.floor(seconds%3600/60)).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');el.textContent=`${h}:${m}:${s}`}},1000)
  function bindActions(){root.querySelectorAll('.quest-action').forEach(btn=>btn.addEventListener('click',()=>{btn.disabled=true;btn.textContent=btn.dataset.quest.startsWith('wanted')?'ĐANG TRUY NÃ':'ĐANG THỰC HIỆN';window.dispatchEvent(new CustomEvent('game:log',{detail:{message:btn.dataset.quest.startsWith('wanted')?'Đã nhận nhiệm vụ truy nã.':'Đã nhận nhiệm vụ tiêu diệt quái vật.',type:'item'}}))}))}
  bindActions()
}
