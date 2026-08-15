import './world-map-explorer.css'

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v))
const rand=(a,b)=>Math.random()*(b-a)+a
const monsterColor=rank=>rank==='goldboss'?'gold':rank==='subboss'?'blue':'red'

function makeMonster(area,index){
  const data=area.monsters[index%area.monsters.length]
  const edge=Math.floor(Math.random()*4)
  const m={id:`wm-${Math.random().toString(36).slice(2)}`,name:data[0],level:Math.floor(rand(data[1],Number(data[2])+1)),x:50,y:50,hp:100,mp:100,vx:0,vy:0,wander:0,speed:rand(.012,.024),rank:'normal'}
  if(Math.random()<.035)m.rank='goldboss';else if(Math.random()<.12)m.rank='subboss'
  if(edge===0){m.x=rand(5,95);m.y=rand(7,16)}
  if(edge===1){m.x=rand(5,95);m.y=rand(84,94)}
  if(edge===2){m.x=rand(7,16);m.y=rand(8,92)}
  if(edge===3){m.x=rand(84,94);m.y=rand(8,92)}
  return m
}

function createDecoration(seed){
  const items=[]
  for(let i=0;i<26;i++)items.push({x:rand(3,97),y:rand(4,96),kind:i%3===0?'tree':i%3===1?'bush':'rock',s:rand(.7,1.25),seed:seed+i})
  return items
}

export function mountWorldMapExplorer(){
  const start=e=>openExplorer(e.detail?.area||null)
  window.addEventListener('game:start-exploration',start)
  return ()=>window.removeEventListener('game:start-exploration',start)
}

function openExplorer(area){
  if(document.querySelector('#world-explorer-root'))return
  const root=document.createElement('div');root.id='world-explorer-root';document.body.appendChild(root)
  const terrain=(area?.terrain||'Rừng hồ').toLowerCase()
  const theme=terrain.includes('tuyết')?'snow':terrain.includes('sa mạc')?'desert':terrain.includes('hang')||terrain.includes('động')||terrain.includes('lăng')||terrain.includes('huyệt')?'cave':terrain.includes('núi')||terrain.includes('đạo sơn')||terrain.includes('côn lôn')?'mountain':terrain.includes('độc')?'poison':'forest'
  const state={x:50,y:50,target:null,monsters:[],running:true,lastSpawn:performance.now(),lastEncounter:0}
  const decorations=createDecoration(Math.random()*1000)
  for(let i=0;i<7;i++)state.monsters.push(makeMonster(area||{monsters:[['Huyết Lang',5,7]]},i))
  const wanted=area?.wantedTarget
  if(wanted){const boss=makeMonster({monsters:[[wanted.name,wanted.level,wanted.level]]},0);boss.rank='goldboss';boss.x=rand(15,85);boss.y=rand(15,85);state.monsters.push(boss)}

  root.innerHTML=`<div class="world-explorer-overlay"><section class="world-explorer-window"><header><div><b>⚔ ${area?.name||'Rừng Rậm Ven Hồ'}</b><small>Khám phá · ${area?`Lv.${area.min}–${area.max}`:'Lv.1–10'} · ${area?.terrain||'Rừng hồ'}</small></div><button id="world-exit" type="button">×</button></header><main class="world-explorer-main"><div class="world-hud"><div class="world-player-hp"><span style="width:100%"></span></div><div>HP 100 / 100</div><div class="world-player-mp"><span style="width:100%"></span></div><div>MP 100 / 100</div></div><div id="world-field" class="world-field ${theme}-theme"><div class="world-path path-a"></div><div class="world-path path-b"></div><div class="world-path path-c"></div><div class="world-decoration-layer"></div><div class="world-player" id="world-player"><i></i><b>Nhân vật</b></div><div class="world-units" id="world-units"></div><div class="world-minimap"><div class="mini-map-land"></div><div class="mini-map-path"></div><div class="mini-map-dot player-dot" id="mini-player"></div><div class="mini-map-monsters" id="mini-monsters"></div><span>MINI MAP</span></div><div class="world-hint">Click vào vị trí để nhân vật từ từ di chuyển tới đó</div></div><div class="world-log" id="world-log"><div>[Hệ thống] ${area?.name||'Rừng Rậm Ven Hồ'} đã mở. Quái xuất hiện rải rác ở các khu vực xa.</div><div>[Hướng dẫn] Nhân vật di chuyển chậm; quái chỉ bắt đầu áp sát khi ở gần.</div>${wanted?`<div class="wanted-line">[Truy nã] ${wanted.name} có thể xuất hiện ngẫu nhiên trong khu vực.</div>`:''}</div></main></section></div>`

  const field=root.querySelector('#world-field'),playerEl=root.querySelector('#world-player'),units=root.querySelector('#world-units'),mini=root.querySelector('#mini-player'),miniMonsters=root.querySelector('#mini-monsters'),decor=root.querySelector('.world-decoration-layer')
  decor.innerHTML=decorations.map(d=>`<span class="world-decoration ${d.kind}" style="left:${d.x}%;top:${d.y}%;transform:translate(-50%,-50%) scale(${d.s})">${d.kind==='tree'?'🌳':d.kind==='bush'?'🌿':'🪨'}</span>`).join('')
  const log=text=>{const el=root.querySelector('#world-log');const d=document.createElement('div');d.textContent=text;el.appendChild(d);el.scrollTop=el.scrollHeight}
  const render=()=>{
    playerEl.style.left=state.x+'%';playerEl.style.top=state.y+'%';mini.style.left=state.x+'%';mini.style.top=state.y+'%'
    units.innerHTML=state.monsters.map(m=>`<div class="world-monster-node ${monsterColor(m.rank)}" style="left:${m.x}%;top:${m.y}%"><div class="monster-bars"><span style="width:${m.hp}%"></span><em style="width:${m.mp}%"></em></div><i></i><b>${m.name} · Lv.${m.level}</b><small>${m.rank==='goldboss'?'BOSS HOÀNG KIM':m.rank==='subboss'?'TIỂU BOSS':'QUÁI THƯỜNG'}</small></div>`).join('')
    miniMonsters.innerHTML=state.monsters.map(m=>`<i class="mini-monster ${monsterColor(m.rank)}" style="left:${m.x}%;top:${m.y}%"></i>`).join('')
  }
  field.addEventListener('click',e=>{const r=field.getBoundingClientRect();state.target={x:clamp((e.clientX-r.left)/r.width*100,4,96),y:clamp((e.clientY-r.top)/r.height*100,6,94)};log('[Di chuyển] Nhân vật bắt đầu đi tới vị trí đã chọn.')})
  const leave=()=>{state.running=false;root.remove()}
  root.querySelector('#world-exit').addEventListener('click',leave)
  const tick=()=>{
    if(!state.running)return
    const now=performance.now()
    if(state.target){const dx=state.target.x-state.x,dy=state.target.y-state.y,d=Math.hypot(dx,dy)||1;if(d<.3)state.target=null;else{state.x+=dx/d*.095;state.y+=dy/d*.095}}
    state.monsters.forEach(m=>{if(now>m.wander){m.vx=rand(-1,1);m.vy=rand(-1,1);m.wander=now+rand(1200,3000)}m.x=clamp(m.x+m.vx*m.speed,3,97);m.y=clamp(m.y+m.vy*m.speed,4,96)})
    if(now-state.lastSpawn>6500&&state.monsters.length<10){state.monsters.push(makeMonster(area||{monsters:[['Huyết Lang',5,7]]},Math.floor(Math.random()*10)));state.lastSpawn=now;log('[Quái] Một quái mới xuất hiện ở rìa khu vực.')}
    const near=state.monsters.filter(m=>Math.hypot(m.x-state.x,m.y-state.y)<5&&!m.dead)
    if(near.length&&now-state.lastEncounter>1200){const target=near[0];state.lastEncounter=now;state.running=false;root.remove();log('[Giao tranh] Đã gặp '+target.name+'.');window.dispatchEvent(new CustomEvent('game:start-combat',{detail:{area,monster:target}}));return}
    render();requestAnimationFrame(tick)
  }
  render();requestAnimationFrame(tick)
}
