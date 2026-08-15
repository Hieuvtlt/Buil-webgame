// World-map exploration prototype
export function mountWorldMapExplorer() {
  if (document.querySelector('#world-explorer-root')) return
  const root = document.createElement('div')
  root.id = 'world-explorer-root'
  document.body.appendChild(root)
  const state = { x: 50, y: 50, target: null, monsters: [], lastSpawn: 0, running: true }
  const monsterNames = ['Huyết Lang','Linh Hầu','Thanh Mao Hùng','Hắc Hổ','Sơn Viên']
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v))
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)
  const rand=(a,b)=>Math.random()*(b-a)+a
  const spawn = () => {
    const edge = Math.floor(Math.random()*4), m={id:Math.random().toString(36).slice(2),x:50,y:50,hp:100,maxHp:100,mp:100,maxMp:100,name:monsterNames[Math.floor(Math.random()*monsterNames.length)],speed:rand(.018,.032),vx:0,vy:0,wander:0}
    if(edge===0){m.x=rand(5,95);m.y=rand(8,18)}
    if(edge===1){m.x=rand(5,95);m.y=rand(82,94)}
    if(edge===2){m.x=rand(8,18);m.y=rand(5,95)}
    if(edge===3){m.x=rand(82,94);m.y=rand(5,95)}
    state.monsters.push(m)
  }
  for(let i=0;i<7;i++)spawn()
  root.innerHTML=`<div class="world-explorer-overlay"><section class="world-explorer-window"><header><div><b>⚔ Rừng Rậm Ven Hồ</b><small>Khám phá · Lv.1–10</small></div><button id="world-exit">×</button></header><main class="world-explorer-main"><div class="world-hud"><div class="world-player-hp"><span></span></div><div>HP 100 / 100</div><div class="world-player-mp"><span></span></div><div>MP 100 / 100</div></div><div id="world-field" class="world-field forest-theme"><div class="world-path path-a"></div><div class="world-path path-b"></div><div class="world-path path-c"></div><div class="world-decor trees-a">🌲 🌳 🌲</div><div class="world-decor trees-b">🌳 🌲 🌳</div><div class="world-decor trees-c">🌲 🌲 🌳</div><div class="world-player" id="world-player"><i></i><b>Nhân vật</b></div><div class="world-units" id="world-units"></div><div class="world-minimap"><div class="mini-map-land"></div><div class="mini-map-path"></div><div class="mini-map-dot player-dot" id="mini-player"></div><div class="mini-map-dot monster-dot" id="mini-monsters"></div><span>MINI MAP</span></div><div class="world-hint">Click vị trí trên bản đồ để nhân vật di chuyển tới đó</div></div><div class="world-log" id="world-log"><div>[Hệ thống] Đã vào khu vực. Quái xuất hiện rải rác trên bản đồ.</div><div>[Hướng dẫn] Nhân vật sẽ từ từ tìm quái khi di chuyển.</div></div></main></section></div>`
  const field=root.querySelector('#world-field'), playerEl=root.querySelector('#world-player'), units=root.querySelector('#world-units'), mini=root.querySelector('#mini-player'), miniMonsters=root.querySelector('#mini-monsters')
  const log=(text)=>{const el=root.querySelector('#world-log');const d=document.createElement('div');d.textContent=text;el.appendChild(d);el.scrollTop=el.scrollHeight}
  const render=()=>{playerEl.style.left=state.x+'%';playerEl.style.top=state.y+'%';mini.style.left=state.x+'%';mini.style.top=state.y+'%';units.innerHTML=state.monsters.map(m=>`<div class="world-monster-node" style="left:${m.x}%;top:${m.y}%"><div class="monster-bars"><span style="width:${m.hp}%"></span></div><i></i><b>${m.name}</b></div>`).join('');miniMonsters.style.left=(state.monsters[0]?.x||50)+'%';miniMonsters.style.top=(state.monsters[0]?.y||50)+'%'}
  field.addEventListener('click',e=>{const r=field.getBoundingClientRect();state.target={x:clamp((e.clientX-r.left)/r.width*100,4,96),y:clamp((e.clientY-r.top)/r.height*100,6,94)};log(`[Di chuyển] Nhân vật đang đi tới vị trí mới.`)})
  root.querySelector('#world-exit').addEventListener('click',()=>{state.running=false;root.remove()})
  const tick=()=>{if(!state.running)return;const now=performance.now();if(state.target){const dx=state.target.x-state.x,dy=state.target.y-state.y,d=Math.hypot(dx,dy);if(d<.25)state.target=null;else{state.x+=dx/d*.11;state.y+=dy/d*.11}}
    state.monsters.forEach(m=>{if(now>m.wander){m.vx=rand(-1,1);m.vy=rand(-1,1);m.wander=now+rand(900,2200)}m.x=clamp(m.x+m.vx*m.speed,3,97);m.y=clamp(m.y+m.vy*m.speed,5,95)})
    if(now-state.lastSpawn>7000&&state.monsters.length<9){spawn();state.lastSpawn=now;log('[Quái] Một quái vật mới xuất hiện ở rìa bản đồ.')}
    render();requestAnimationFrame(tick)}
  render();requestAnimationFrame(tick)
}
