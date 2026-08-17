import { WORLD_MAPS } from '../../data/worldMaps.js'
import './NgoaiCanhScreen.css'

export function NgoaiCanhScreen(){
  return `<section class="new-world-screen"><div class="world-intro"><div><div class="eyebrow">THẾ GIỚI</div><h2>NGOẠI CẢNH</h2><p>Chọn một khu vực để xem bản đồ và thông tin khu vực. Combat chưa được gắn vào hệ thống map.</p></div><div class="world-count"><strong>17</strong><span>KHU VỰC</span></div></div><div class="world-map-grid">${WORLD_MAPS.map((map,index)=>`<article class="world-map-card" data-map-id="${map.id}"><div class="world-map-image-wrap"><img src="${map.image}" alt="${map.name}" loading="lazy"/><span class="world-map-number">${String(index+1).padStart(2,'0')}</span><button class="world-map-enter" type="button" data-map-id="${map.id}">XEM BẢN ĐỒ</button></div><div class="world-map-card-body"><div><h3>${map.name}</h3><small>${map.key.replaceAll('_',' ')}</small></div><span class="world-map-arrow">›</span></div></article>`).join('')}</div><div id="world-map-modal" class="world-map-modal" hidden></div></section>`
}

export function mountNgoaiCanhScreen(){
  const screen=document.querySelector('.new-world-screen')
  if(!screen)return()=>{}
  const modal=screen.querySelector('#world-map-modal')
  const close=()=>{modal.hidden=true;modal.innerHTML=''}
  const open=id=>{const map=WORLD_MAPS.find(item=>item.id===id);if(!map)return;modal.hidden=false;modal.innerHTML=`<div class="world-map-dialog-backdrop" data-close="1"><div class="world-map-dialog" role="dialog" aria-modal="true"><button class="world-map-dialog-close" type="button" data-close="1">×</button><div class="world-map-dialog-image"><img src="${map.image}" alt="${map.name}"/></div><div class="world-map-dialog-content"><div class="eyebrow">KHU VỰC ${map.id}</div><h3>${map.name}</h3><p>${map.name} đang ở trạng thái bản đồ độc lập. Nút <b>TIẾN VÀO</b> hiện chỉ mở khu vực bản đồ; hệ thống combat sẽ được xây dựng riêng sau.</p><div class="world-map-dialog-actions"><button class="map-cancel" type="button" data-close="1">ĐÓNG</button><button class="map-enter" type="button" data-enter="${map.id}">TIẾN VÀO</button></div></div></div></div>`}
  const onClick=e=>{const enter=e.target.closest('[data-map-id]');if(enter)open(enter.dataset.mapId);if(e.target.closest('[data-close]'))close();const go=e.target.closest('[data-enter]');if(go){const map=WORLD_MAPS.find(item=>item.id===go.dataset.enter);if(map){close();window.dispatchEvent(new CustomEvent('game:log',{detail:{message:`Tiến vào ${map.name}. Combat chưa được kích hoạt.`}}));window.dispatchEvent(new CustomEvent('game:map-entered',{detail:{map}}))}}}
  screen.addEventListener('click',onClick)
  return()=>screen.removeEventListener('click',onClick)
}
