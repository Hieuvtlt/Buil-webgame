import './NgoaiCanhScreen.css'
import { player } from '../../data/character.js'
import { WORLD_AREAS } from '../../data/worldAreas.js'
import { getAreaArt } from '../WorldMapArt.js'

const canEnter = area => {
  const lv=Number(player.level)||1
  return lv>=area.min-5 && lv<=area.max+5
}

export function NgoaiCanhScreen(){
  return `<div class="new-world-screen"><div class="new-world-title"><div><b>◆ NGOẠI CẢNH</b><small>17 bản đồ · chọn bản đồ rồi TIẾN VÀO</small></div><span>Lv.${player.level}</span></div><div class="new-world-grid">${WORLD_AREAS.map((area,index)=>{const ok=canEnter(area);return `<button class="new-world-card ${ok?'':'locked'}" type="button" data-area-index="${index}"><span class="new-world-art" style="background-image:${getAreaArt(area)}"></span><span class="new-world-shade"></span><span class="new-world-name">${area.name}</span><span class="new-world-level">Lv.${area.min}–${area.max}</span><span class="new-world-terrain">${area.terrain}${ok?'':' · 🔒'}</span></button>`}).join('')}</div><div class="new-world-note">Bản đồ chỉ quản lý việc khám phá và xuất hiện quái. Combat là một hệ thống riêng, mở bằng nút <b>TIẾN VÀO</b>.</div><div id="new-world-modal"></div></div>`
}

export function mountNgoaiCanhScreen(){
  const root=document.querySelector('.new-world-screen'); if(!root)return
  const modal=root.querySelector('#new-world-modal')
  root.querySelectorAll('[data-area-index]').forEach(card=>card.addEventListener('click',()=>{
    const area=WORLD_AREAS[Number(card.dataset.areaIndex)], ok=canEnter(area)
    modal.innerHTML=`<div class="new-world-modal-backdrop"><section class="new-world-modal"><button class="new-world-modal-close" type="button">×</button><div class="new-world-modal-art" style="background-image:${getAreaArt(area)}"></div><div class="new-world-modal-body"><b>${area.name}</b><small>Lv.${area.min}–${area.max} · ${area.terrain}</small><p>Quái: ${area.monsters.map(m=>`${m[0]} Lv.${m[1]}–${m[2]}`).join(' · ')}</p><button id="new-world-enter" type="button" ${ok?'':'disabled'}>${ok?'TIẾN VÀO':'CHƯA ĐỦ CẤP'}</button></div></section></div>`
    modal.querySelector('.new-world-modal-backdrop').onclick=e=>{if(e.target===e.currentTarget)modal.innerHTML=''}
    modal.querySelector('.new-world-modal-close').onclick=()=>modal.innerHTML=''
    modal.querySelector('#new-world-enter')?.addEventListener('click',()=>{window.dispatchEvent(new CustomEvent('game:start-exploration',{detail:{area}}));window.dispatchEvent(new CustomEvent('game:world-changed',{detail:{name:area.name}}));modal.innerHTML=''})
  }))
}
