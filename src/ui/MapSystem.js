import './map-system.css'
import { WORLD_AREAS } from '../data/worldAreas.js'
import { player } from '../data/character.js'
import { getAreaArt } from './WorldMapArt.js'

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v))
const rand=(a,b)=>Math.random()*(b-a)+a
let root=null
let cleanup=null

function canEnter(area){ const lv=Number(player.level)||1; return lv>=area.min-5 && lv<=area.max+5 }
function spawnMonsters(area){
  return area.monsters.map((entry,index)=>({ id:`${area.id}-${index}`,name:entry[0],level:Math.floor(rand(entry[1],entry[2]+1)),x:12+rand(0,76),y:18+rand(0,62),dead:false }))
}
function closeMap(){ cleanup?.(); cleanup=null; if(root){root.remove();root=null} }
function openMap(area){
  closeMap();
  root=document.createElement('div'); root.id='new-map-root'; document.body.appendChild(root)
  const monsters=spawnMonsters(area)
  const state={area,monsters,player:{x:50,y:55},explored:0,selected:null}
  root.innerHTML=`<div class="new-map-overlay"><section class="new-map-window">
    <header class="new-map-header"><div><b>⚔ ${area.name}</b><small>Khám phá · Lv.${area.min}–${area.max} · ${area.terrain}</small></div><button id="new-map-close" type="button">×</button></header>
    <main class="new-map-main"><div class="new-map-field" id="new-map-field" style="background-image:${getAreaArt(area)}"><div class="new-map-vignette"></div><div id="new-map-units"></div><div class="new-map-player" id="new-map-player"><span>◆</span><b>Nhân vật</b></div><div class="new-map-menu" id="new-map-menu"></div><div class="new-map-status">KHÁM PHÁ: <b id="new-map-distance">0m</b></div><div class="new-map-minimap"><div class="mini-label">TOÀN BẢN ĐỒ</div><div class="mini-player" id="mini-player"></div><div id="mini-monsters"></div></div></div></main>
    <footer class="new-map-footer"><span>Click nền bản đồ để di chuyển</span><span>${area.monsters.length} loại quái · Chọn quái để mở <b>TIẾN VÀO</b></span></footer>
  </section></div>`
  const field=root.querySelector('#new-map-field'), units=root.querySelector('#new-map-units'), playerEl=root.querySelector('#new-map-player'), menu=root.querySelector('#new-map-menu'), miniPlayer=root.querySelector('#mini-player'), miniMonsters=root.querySelector('#mini-monsters'), distanceEl=root.querySelector('#new-map-distance')
  const log=text=>window.dispatchEvent(new CustomEvent('game:log',{detail:{message:`${area.name}: ${text}`,type:'system'}}))
  function render(){
    playerEl.style.left=`${state.player.x}%`;playerEl.style.top=`${state.player.y}%`
    units.innerHTML=state.monsters.filter(m=>!m.dead).map(m=>`<button class="new-map-monster ${state.selected===m.id?'selected':''}" data-monster="${m.id}" style="left:${m.x}%;top:${m.y}%" type="button"><i></i><b>${m.name}</b><small>Lv.${m.level}</small></button>`).join('')
    miniPlayer.style.left=`${state.player.x}%`;miniPlayer.style.top=`${state.player.y}%`
    miniMonsters.innerHTML=state.monsters.filter(m=>!m.dead).map(m=>`<i style="left:${m.x}%;top:${m.y}%"></i>`).join('')
    distanceEl.textContent=`${Math.floor(state.explored)}m`
    units.querySelectorAll('[data-monster]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();const m=state.monsters.find(x=>x.id===btn.dataset.monster);if(m)selectMonster(m)})
  }
  function selectMonster(monster){
    state.selected=monster.id
    menu.innerHTML=`<div class="new-map-action"><strong>${monster.name}</strong><small>Lv.${monster.level}</small><button id="new-enter-combat" type="button">TIẾN VÀO</button></div>`
    menu.style.left=`${clamp(monster.x,18,82)}%`;menu.style.top=`${clamp(monster.y,20,72)}%`;render()
    menu.querySelector('#new-enter-combat').onclick=e=>{e.stopPropagation();window.dispatchEvent(new CustomEvent('game:start-combat',{detail:{area,monster}}));closeMap()}
  }
  const onFieldClick=e=>{
    if(e.target.closest('.new-map-monster,.new-map-action,.new-map-minimap')) return
    const r=field.getBoundingClientRect();state.player.x=clamp((e.clientX-r.left)/r.width*100,5,95);state.player.y=clamp((e.clientY-r.top)/r.height*100,8,90);state.explored+=Math.round(rand(20,70));state.selected=null;menu.innerHTML='';log(`Nhân vật di chuyển đến điểm mới.`);render()
  }
  field.addEventListener('click',onFieldClick); root.querySelector('#new-map-close').onclick=closeMap; render()
  cleanup=()=>field.removeEventListener('click',onFieldClick)
}
export function mountMapSystem(){
  const handler=e=>{const area=e.detail?.area;if(area && canEnter(area))openMap(area)}
  window.addEventListener('game:start-exploration',handler)
  return()=>{window.removeEventListener('game:start-exploration',handler);closeMap()}
}
export { closeMap }
