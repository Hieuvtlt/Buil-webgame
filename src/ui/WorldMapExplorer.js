import './world-map-explorer.css'

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v))
const rand=(a,b)=>Math.random()*(b-a)+a
const WORLD_W=3000
const WORLD_H=1800
const ROAD_NETWORK=[
  [[-120,1080],[360,900],[820,940],[1250,760],[1700,820],[2200,620],[3120,720]],
  [[720,-120],[780,250],[980,560],[1250,760],[1390,1040],[1450,1390],[1580,1920]],
  [[1680,820],[1980,900],[2360,1010],[2700,930],[3120,980]],
  [[-120,1500],[360,1420],[700,1240],[1030,1120],[1390,1040],[1880,1160],[2260,1370],[3120,1450]],
  [[2050,-100],[1940,260],[1840,520],[1680,820],[1590,1080],[1750,1320],[2040,1530],[2240,1910]],
]
const roadPath=points=>points.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' ')
const roadPaths=()=>ROAD_NETWORK.map(roadPath).join(' ')
const monsterColor=rank=>rank==='goldboss'?'gold':rank==='subboss'?'blue':'red'
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)

function nearestRoadPoint(x,y){
  let best={x,y,d:Infinity}
  for(const road of ROAD_NETWORK){
    for(let i=0;i<road.length-1;i++){
      const [ax,ay]=road[i],[bx,by]=road[i+1]
      const dx=bx-ax,dy=by-ay,len2=dx*dx+dy*dy||1
      const t=clamp(((x-ax)*dx+(y-ay)*dy)/len2,0,1)
      const px=ax+dx*t,py=ay+dy*t,d=Math.hypot(x-px,y-py)
      if(d<best.d)best={x:px,y:py,d}
    }
  }
  return best
}

function makeMonster(area,index,player){
  const list=area?.monsters?.length?area.monsters:[['Huyết Lang',5,7]]
  const data=list[index%list.length]
  let x,y,tries=0
  do{x=rand(80,WORLD_W-80);y=rand(80,WORLD_H-80);tries++}while(player&&Math.hypot(x-player.x,y-player.y)<560&&tries<80)
  const m={id:`wm-${Math.random().toString(36).slice(2)}`,name:data[0],level:Math.floor(rand(Number(data[1]),Number(data[2])+1)),x,y,hp:100,mp:100,vx:0,vy:0,wander:0,speed:rand(.22,.38),rank:'normal'}
  if(Math.random()<.07)m.rank='subboss'
  return m
}

function makeDecoration(){
  const items=[]
  for(let i=0;i<125;i++){
    const p={x:rand(35,WORLD_W-35),y:rand(35,WORLD_H-35)}
    const road=nearestRoadPoint(p.x,p.y)
    if(road.d<115&&Math.random()<.82)continue
    const roll=Math.random()
    items.push({x:p.x,y:p.y,kind:roll<.52?'tree':roll<.72?'pine':roll<.9?'bush':roll<.97?'rock':'flower',s:rand(.72,1.2),flip:Math.random()<.5})
  }
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
  const player={x:1390,y:1040,target:null,moving:false,moved:0}
  const state={player,monsters:[],running:true,lastSpawn:0,spawnUnlocked:false,lastEncounter:0,lastFrame:performance.now(),wantedSpawned:false}
  const wanted=area?.wantedTarget||null
  const decorations=makeDecoration()
  const pathD=roadPaths()

  root.innerHTML=`<div class="world-explorer-overlay"><section class="world-explorer-window"><header><div><b>⚔ ${area?.name||'Rừng Rậm Ven Hồ'}</b><small>Khám phá · ${area?`Lv.${area.min}–${area.max}`:'Lv.1–10'} · ${area?.terrain||'Rừng hồ'}</small></div><button id="world-exit" type="button">×</button></header><main class="world-explorer-main"><div class="world-hud"><div class="world-resource-label">HP <strong>100 / 100</strong></div><div class="world-player-hp"><span style="width:100%"></span></div><div class="world-resource-label">MP <strong>100 / 100</strong></div><div class="world-player-mp"><span style="width:100%"></span></div></div><div id="world-field" class="world-field ${theme}-theme"><div class="world-camera" id="world-camera"><div class="world-ground"><svg class="world-roads" viewBox="0 0 ${WORLD_W} ${WORLD_H}" preserveAspectRatio="none"><path d="${pathD}" fill="none" stroke="#76583e" stroke-width="150" stroke-linecap="round" stroke-linejoin="round"/><path d="${pathD}" fill="none" stroke="#c79b72" stroke-width="126" stroke-linecap="round" stroke-linejoin="round"/><path d="${pathD}" fill="none" stroke="rgba(245,211,169,.42)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="18 22"/></svg><div class="world-scenery" id="world-scenery"></div><div class="world-units" id="world-units"></div><div class="world-player" id="world-player"><i></i><b>Nhân vật</b></div></div></div><div class="world-camera-vignette"></div><div class="world-minimap"><svg viewBox="0 0 ${WORLD_W} ${WORLD_H}" preserveAspectRatio="none"><rect width="${WORLD_W}" height="${WORLD_H}" fill="#5caa4e"/><path d="${pathD}" fill="none" stroke="#6c513b" stroke-width="150" stroke-linecap="round" stroke-linejoin="round"/><path d="${pathD}" fill="none" stroke="#bd926b" stroke-width="126" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="mini-viewport" id="mini-viewport"></div><div class="mini-player-dot" id="mini-player"></div><div id="mini-monsters"></div><span>THẾ GIỚI</span></div><div class="world-hint">🖱 Click lên đường hoặc vị trí trên bản đồ để nhân vật từ từ di chuyển.</div></div><div class="world-log" id="world-log"><div>[Hệ thống] ${area?.name||'Rừng Rậm Ven Hồ'} đã mở.</div><div>[Khám phá] Chưa có quái trong khu vực. Nhân vật đang bắt đầu tìm kiếm.</div>${wanted?`<div class="wanted-line">[Truy nã] ${wanted.name} sẽ có thể xuất hiện khi nhân vật khám phá đủ xa.</div>`:''}</div></main></section></div>`

  const field=root.querySelector('#world-field'),camera=root.querySelector('#world-camera'),playerEl=root.querySelector('#world-player'),units=root.querySelector('#world-units'),scenery=root.querySelector('#world-scenery'),miniPlayer=root.querySelector('#mini-player'),miniMonsters=root.querySelector('#mini-monsters'),miniViewport=root.querySelector('#mini-viewport')
  scenery.innerHTML=decorations.map(d=>`<span class="terrain-object ${d.kind}" style="left:${d.x}px;top:${d.y}px;--scale:${d.s};--flip:${d.flip?-1:1}"><i></i><b></b></span>`).join('')
  const log=text=>{const el=root.querySelector('#world-log');if(!el)return;const d=document.createElement('div');d.textContent=text;el.appendChild(d);while(el.children.length>70)el.removeChild(el.firstElementChild);el.scrollTop=el.scrollHeight}
  const worldToMini=(x,y)=>({left:x/WORLD_W*100,top:y/WORLD_H*100})
  const getCamera=()=>{const w=field.clientWidth,h=field.clientHeight;const tx=clamp(w/2-player.x,-(WORLD_W-w),0);const ty=clamp(h/2-player.y,-(WORLD_H-h),0);return{w,h,tx,ty}}
  const render=()=>{
    const cam=getCamera();camera.style.transform=`translate3d(${cam.tx}px,${cam.ty}px,0)`
    playerEl.style.left=player.x+'px';playerEl.style.top=player.y+'px'
    units.innerHTML=state.monsters.map(m=>`<div class="world-monster-node ${monsterColor(m.rank)}" style="left:${m.x}px;top:${m.y}px"><div class="monster-bars"><span style="width:${m.hp}%"></span><em style="width:${m.mp}%"></em></div><i></i><b>${m.name} · Lv.${m.level}</b><small>${m.rank==='goldboss'?'BOSS HOÀNG KIM':m.rank==='subboss'?'TIỂU BOSS':'QUÁI THƯỜNG'}</small></div>`).join('')
    const mp=worldToMini(player.x,player.y);miniPlayer.style.left=mp.left+'%';miniPlayer.style.top=mp.top+'%'
    miniMonsters.innerHTML=state.monsters.map(m=>{const p=worldToMini(m.x,m.y);return `<i class="mini-monster ${monsterColor(m.rank)}" style="left:${p.left}%;top:${p.top}%"></i>`}).join('')
    const vw=Math.min(cam.w/WORLD_W*100,100),vh=Math.min(cam.h/WORLD_H*100,100);const vx=clamp(-cam.tx/WORLD_W*100,0,100-vw),vy=clamp(-cam.ty/WORLD_H*100,0,100-vh);miniViewport.style.left=vx+'%';miniViewport.style.top=vy+'%';miniViewport.style.width=vw+'%';miniViewport.style.height=vh+'%'
  }
  const spawnMonster=()=>{const m=makeMonster(area,state.monsters.length,player);state.monsters.push(m);state.lastSpawn=performance.now();log(`[Quái] ${m.name} - Lv.${m.level} vừa xuất hiện ở một khu vực xa.`)}
  const maybeSpawn=now=>{if(!player.moving)return;if(!state.spawnUnlocked&&player.moved>180){state.spawnUnlocked=true;state.lastSpawn=now-2500;log('[Khám phá] Bạn đã đi đủ xa. Quái bắt đầu xuất hiện ngẫu nhiên trên bản đồ.')}if(!state.spawnUnlocked||state.monsters.length>=6||now-state.lastSpawn<4200)return;if(wanted&&player.moved>850&&!state.wantedSpawned&&Math.random()<.18){const m=makeMonster({monsters:[[wanted.name,wanted.level,wanted.level]]},0,player);m.rank='goldboss';state.monsters.push(m);state.wantedSpawned=true;state.lastSpawn=now;log(`[Truy nã] ${wanted.name} - Lv.${wanted.level} đã xuất hiện trên bản đồ.`);return}spawnMonster()}
  field.addEventListener('click',e=>{if(e.target.closest('.world-minimap'))return;const r=field.getBoundingClientRect(),sx=e.clientX-r.left,sy=e.clientY-r.top,cam=getCamera();let x=clamp(sx-cam.tx,35,WORLD_W-35),y=clamp(sy-cam.ty,35,WORLD_H-35);const road=nearestRoadPoint(x,y);if(road.d<210){x=road.x;y=road.y;log('[Di chuyển] Nhân vật chọn đường và bắt đầu tiến về phía trước.')}else log('[Di chuyển] Nhân vật rời đường và đi tới vị trí đã chọn.');player.target={x,y};player.moving=true})
  const leave=()=>{state.running=false;root.remove()};root.querySelector('#world-exit').addEventListener('click',leave)
  const tick=now=>{if(!state.running)return;const dt=Math.min(32,now-state.lastFrame);state.lastFrame=now;if(player.target){const dx=player.target.x-player.x,dy=player.target.y-player.y,d=Math.hypot(dx,dy)||1,step=dt*.115;if(d<=step){player.moved+=d;player.x=player.target.x;player.y=player.target.y;player.target=null;player.moving=false}else{player.x+=dx/d*step;player.y+=dy/d*step;player.moved+=step}}state.monsters.forEach(m=>{if(now>m.wander){const toward=distance(m,player)<360,ang=toward?Math.atan2(player.y-m.y,player.x-m.x):rand(0,Math.PI*2),spread=toward?rand(-.35,.35):0;m.vx=Math.cos(ang+spread);m.vy=Math.sin(ang+spread);m.wander=now+rand(900,2300)}const chase=distance(m,player)<330?1:.38;m.x=clamp(m.x+m.vx*m.speed*dt*chase,35,WORLD_W-35);m.y=clamp(m.y+m.vy*m.speed*dt*chase,35,WORLD_H-35)});maybeSpawn(now);const near=state.monsters.filter(m=>!m.dead&&distance(m,player)<92);if(near.length&&now-state.lastEncounter>1500){const target=near[0];state.lastEncounter=now;state.running=false;root.remove();window.dispatchEvent(new CustomEvent('game:start-combat',{detail:{area,monster:target}}));return}render();requestAnimationFrame(tick)}
  render();requestAnimationFrame(tick)
}
