import './world-map-explorer.css'
import { getAreaArtV3 as getAreaArt, getAreaThemeV3 as getAreaTheme } from './WorldMapArtV3.js'
import { player, getPlayerStats } from '../data/character.js'

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v))
const WORLD_W=3000,WORLD_H=1800
const ROAD_NETWORK=[
  [[-120,1100],[390,760],[780,760],[1240,1010],[1590,890],[2070,470],[2410,500],[3120,630]],
  [[-120,1430],[260,1260],[500,910],[900,960],[1390,600],[1680,620],[2200,950],[2520,1040],[3120,900]],
  [[-120,720],[390,740],[890,500],[1330,930],[1700,980],[2280,710],[2640,730],[3120,850]],
]
const roadPath=points=>points.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' ')
const roadPaths=()=>ROAD_NETWORK.map(roadPath).join(' ')
const nearestRoadPoint=(x,y)=>{let best={x,y,d:Infinity};for(const road of ROAD_NETWORK){for(let i=0;i<road.length-1;i++){const [ax,ay]=road[i],[bx,by]=road[i+1],dx=bx-ax,dy=by-ay,len2=dx*dx+dy*dy||1,t=clamp(((x-ax)*dx+(y-ay)*dy)/len2,0,1),px=ax+dx*t,py=ay+dy*t,d=Math.hypot(x-px,y-py);if(d<best.d)best={x:px,y:py,d}}}return best}

export function mountWorldMapExplorer(){
  const start=e=>openExplorer(e.detail?.area||null)
  window.addEventListener('game:start-exploration',start)
  return()=>window.removeEventListener('game:start-exploration',start)
}

function openExplorer(area){
  if(!area||document.querySelector('#world-explorer-root'))return
  const root=document.createElement('div');root.id='world-explorer-root';document.body.appendChild(root)
  const theme=getAreaTheme(area)
  const stats=getPlayerStats()
  const playerState={x:1390,y:1040,target:null,moving:false,explored:0}
  const state={running:true,lastFrame:performance.now(),keyHandler:null}
  const pathD=roadPaths()

  root.innerHTML=`<div class="world-explorer-overlay"><section class="world-explorer-window"><header><div><b>◆ ${area.name}</b><small>Khám phá · Lv.${area.min}–${area.max} · ${area.terrain}</small></div><button id="world-exit" type="button" aria-label="Đóng">×</button></header><main class="world-explorer-main"><div id="world-field" class="world-field theme-${theme}"><div class="world-camera" id="world-camera"><div class="world-ground"><div class="world-art" id="world-art"></div><svg class="world-roads" viewBox="0 0 ${WORLD_W} ${WORLD_H}" preserveAspectRatio="none"><path d="${pathD}" fill="none" stroke="#6b4c35" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity=".12"/></svg><div class="world-units" id="world-units"></div><div class="world-player" id="world-player"><i></i><b>Nhân vật</b></div></div></div><div class="world-camera-vignette"></div><div class="world-minimap"><div class="world-mini-art" id="world-mini-art"></div><div class="mini-road-glow"></div><div class="mini-viewport" id="mini-viewport"></div><div class="mini-player-dot" id="mini-player"></div><span>TOÀN BẢN ĐỒ</span></div><div class="world-exploration-status" id="world-exploration-status">KHÁM PHÁ: 0m</div><div class="world-hint" id="world-hint">🖱 Chọn đường hoặc điểm đến · Nhân vật tự di chuyển.</div><div class="world-log" id="world-log"><div>[Hệ thống] ${area.name} đã mở.</div><div>[Khám phá] Combat đã được tháo bỏ. Đây là bản đồ khám phá thuần túy.</div></div></div></main></section></div>`

  const field=root.querySelector('#world-field')
  const camera=root.querySelector('#world-camera')
  const playerEl=root.querySelector('#world-player')
  const miniPlayer=root.querySelector('#mini-player')
  const miniViewport=root.querySelector('#mini-viewport')
  const exploreStatus=root.querySelector('#world-exploration-status')
  const hint=root.querySelector('#world-hint')
  root.querySelector('#world-art').style.backgroundImage=getAreaArt(area)
  root.querySelector('#world-mini-art').style.backgroundImage=getAreaArt(area)

  const log=text=>{const el=root.querySelector('#world-log');if(!el)return;const d=document.createElement('div');d.textContent=text;el.appendChild(d);while(el.children.length>60)el.removeChild(el.firstElementChild);el.scrollTop=el.scrollHeight}
  const syncHud=()=>{const s=getPlayerStats();exploreStatus.textContent=`KHÁM PHÁ: ${Math.floor(playerState.explored)}m · HP ${Math.max(0,Math.floor(player.hp))}/${s.maxHp} · MP ${Math.max(0,Math.floor(player.mp))}/${s.maxMp}`}
  const worldToMini=(x,y)=>({left:x/WORLD_W*100,top:y/WORLD_H*100})
  const getCamera=()=>{const w=field.clientWidth,h=field.clientHeight;return{w,h,tx:clamp(w/2-playerState.x,-(WORLD_W-w),0),ty:clamp(h/2-playerState.y,-(WORLD_H-h),0)}}
  const render=()=>{const cam=getCamera();camera.style.transform=`translate3d(${cam.tx}px,${cam.ty}px,0)`;playerEl.style.left=playerState.x+'px';playerEl.style.top=playerState.y+'px';const mp=worldToMini(playerState.x,playerState.y);miniPlayer.style.left=mp.left+'%';miniPlayer.style.top=mp.top+'%';const vw=Math.min(cam.w/WORLD_W*100,100),vh=Math.min(cam.h/WORLD_H*100,100),vx=clamp(-cam.tx/WORLD_W*100,0,100-vw),vy=clamp(-cam.ty/WORLD_H*100,0,100-vh);miniViewport.style.left=vx+'%';miniViewport.style.top=vy+'%';miniViewport.style.width=vw+'%';miniViewport.style.height=vh+'%';syncHud()}

  field.addEventListener('click',e=>{if(e.target.closest('.world-minimap'))return;const r=field.getBoundingClientRect(),cam=getCamera();let x=clamp(e.clientX-r.left-cam.tx,35,WORLD_W-35),y=clamp(e.clientY-r.top-cam.ty,35,WORLD_H-35);const road=nearestRoadPoint(x,y);if(road.d<190){x=road.x;y=road.y;log('[Di chuyển] Nhân vật bám theo đường.')}else log('[Di chuyển] Nhân vật đi tới điểm đã chọn.');playerState.target={x,y};playerState.moving=true;hint.textContent='🖱 Đang di chuyển đến điểm đã chọn.'})

  const leave=()=>{state.running=false;if(state.keyHandler)document.removeEventListener('keydown',state.keyHandler);root.remove()}
  root.querySelector('#world-exit').addEventListener('click',leave)
  state.keyHandler=e=>{if(e.key==='Escape')leave()}
  document.addEventListener('keydown',state.keyHandler)

  function tick(now){if(!state.running||!document.body.contains(root))return;const dt=Math.min(32,now-state.lastFrame);state.lastFrame=now;if(playerState.target){const dx=playerState.target.x-playerState.x,dy=playerState.target.y-playerState.y,d=Math.hypot(dx,dy)||1,step=dt*.115;if(d<=step){playerState.x=playerState.target.x;playerState.y=playerState.target.y;playerState.target=null;playerState.moving=false;log('[Khám phá] Đã tới điểm đến.')}else{playerState.x+=dx/d*step;playerState.y+=dy/d*step;playerState.explored+=step}}else{playerState.moving=false}hint.textContent=playerState.moving?'🖱 Đang di chuyển đến điểm đã chọn.':'🖱 Chọn đường hoặc điểm đến · Nhân vật tự di chuyển.';render();requestAnimationFrame(tick)}
  render();requestAnimationFrame(tick)
}
