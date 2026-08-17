import './NgoaiCanhScreen.css'
import './world-map-cards.css'
import { player } from '../../data/character.js'

const areas = [
  {name:'Rừng Rậm Ven Hồ',min:1,max:10,icon:'forest.svg',terrain:'Rừng hồ'},
  {name:'Bạch Thủy Động',min:6,max:15,icon:'cave.svg',terrain:'Hang động'},
  {name:'Hắc Hổ Lâm',min:11,max:20,icon:'forest.svg',terrain:'Rừng sâu'},
  {name:'Thanh Xà Cốc',min:16,max:25,icon:'cave.svg',terrain:'Thung lũng'},
  {name:'Vũ Lăng Sơn',min:21,max:30,icon:'mountain.svg',terrain:'Núi rừng'},
  {name:'Thiên Nhẫn Cốc',min:31,max:40,icon:'forest.svg',terrain:'Cốc địa'},
  {name:'Võ Đang Sơn',min:41,max:50,icon:'mountain.svg',terrain:'Đạo sơn'},
  {name:'Đường Môn Cổ Địa',min:51,max:60,icon:'bandit.svg',terrain:'Cổ địa'},
  {name:'Dược Vương Cốc',min:61,max:70,icon:'forest.svg',terrain:'Linh cốc'},
  {name:'Lão Hổ Động',min:71,max:80,icon:'cave.svg',terrain:'Sơn động'},
  {name:'Tần Lăng',min:81,max:90,icon:'cave.svg',terrain:'Cổ lăng'},
  {name:'Phù Dung Động',min:91,max:100,icon:'cave.svg',terrain:'Địa huyệt'},
  {name:'Phong Lăng Độ',min:101,max:115,icon:'water.svg',terrain:'Bến nước'},
  {name:'Huyết Sa Mạc',min:116,max:130,icon:'desert.svg',terrain:'Sa mạc'},
  {name:'Thiên Sơn Tuyết Cốc',min:131,max:150,icon:'snow.svg',terrain:'Tuyết vực'},
  {name:'Côn Lôn Sơn',min:151,max:175,icon:'mountain.svg',terrain:'Côn Lôn'},
  {name:'Vạn Độc Cốc',min:176,max:200,icon:'demon.svg',terrain:'Độc cốc'},
]

const WORLD_STATE_KEY='game.world.state.v1'
const iconSrc=area=>`/Buil-webgame/assets/world/${area.icon}`
function loadState(){try{return JSON.parse(localStorage.getItem(WORLD_STATE_KEY))||{area:0}}catch{return{area:0}}}
function saveState(state){localStorage.setItem(WORLD_STATE_KEY,JSON.stringify(state))}
function canEnter(area){const level=Number(player.level)||1;return level>=area.min-5&&level<=area.max+5}
function recommended(area){const level=Number(player.level)||1;if(level<area.min-5)return`Cần khoảng Lv.${area.min-5} trở lên`;if(level>area.max+5)return`Khu vực thấp hơn Lv.${level}`;if(level<area.min)return`Hơi cao hơn cấp đề nghị · Lv.${area.min}–${area.max}`;if(level>area.max)return`Hơi thấp hơn cấp đề nghị · Lv.${area.min}–${area.max}`;return`Phù hợp Lv.${level}`}
function mapMarkup(selected){return`<section class="world-map"><div class="world-map-heading"><div><div class="world-map-title">BẢN ĐỒ NGOẠI CẢNH</div><div class="world-map-subtitle">17 bản đồ · chọn bản đồ rồi TIẾN VÀO để mở bản đồ khám phá.</div></div><div class="world-map-status">Lv.${player.level}</div></div><div class="world-area-grid">${areas.map((area,i)=>{const ok=canEnter(area);return`<button class="world-area-card${i===selected?' active':''}${ok?'':' locked'}" type="button" data-area="${i}"><span class="world-card-map"><img class="world-area-icon" src="${iconSrc(area)}" alt="${area.name}" loading="lazy"></span><span class="world-card-shade"></span><span class="world-area-name">${area.name}</span><span class="world-area-level">Lv.${area.min}–${area.max}</span><span class="world-area-terrain">${area.terrain}${ok?'':' · 🔒'}</span><span class="world-card-map-label">MAP</span></button>`}).join('')}</div><div class="world-legend">● Có thể vào · 🔒 Chưa đủ cấp · Click bản đồ để xem thông tin rồi chọn <b>TIẾN VÀO</b>.</div></section>`}
function modalMarkup(area,state){const ok=canEnter(area);const index=areas.indexOf(area);const here=state.area===index;return`<div class="world-modal-backdrop"><section class="world-modal" role="dialog" aria-modal="true"><button class="world-modal-close" type="button">×</button><div class="world-modal-head"><img class="world-modal-icon" src="${iconSrc(area)}" alt="${area.name}"><div><div class="world-modal-name">${area.name}</div><div class="world-modal-meta">Lv.${area.min}–${area.max} · ${area.terrain}</div></div></div><div class="world-modal-scroll"><section class="world-section"><div class="world-section-title">THÔNG TIN KHU VỰC</div><div class="world-current">Cấp nhân vật: <b>Lv.${player.level}</b></div><div class="world-current world-status-text">Trạng thái: <b>${recommended(area)}</b></div><div class="world-current">Bước này chỉ mở bản đồ khám phá. Hệ thống combat đã được tháo bỏ hoàn toàn để xây dựng lại từ đầu ở bước tiếp theo.</div></section></div><div class="world-modal-actions"><button class="world-action" type="button" data-action="enter" ${ok?'':'disabled'}>${here?'TIẾN VÀO LẠI':'TIẾN VÀO'}</button><button class="world-action secondary" type="button" data-action="explore" ${ok?'':'disabled'}>KHÁM PHÁ</button></div></section></div>`}
export function NgoaiCanhScreen(){return`<div class="world-screen"><div class="world-toolbar"><span class="world-toolbar-title">◆ NGOẠI CẢNH</span><span class="world-toolbar-info">17 bản đồ · chọn bản đồ rồi TIẾN VÀO</span></div><div id="world-content" class="world-layout"></div></div>`}
export function mountNgoaiCanhScreen(){const root=document.querySelector('.world-screen');if(!root)return;const content=root.querySelector('#world-content'),state=loadState();let selected=Math.min(Math.max(Number(state.area)||0,0),areas.length-1);const closeModal=()=>root.querySelector('.world-modal-backdrop')?.remove();const render=()=>{content.innerHTML=mapMarkup(selected);content.querySelectorAll('.world-area-card').forEach(button=>button.addEventListener('click',()=>openModal(Number(button.dataset.area))))};function openModal(index){selected=index;content.insertAdjacentHTML('beforeend',modalMarkup(areas[index],state));const backdrop=root.querySelector('.world-modal-backdrop');if(!backdrop)return;backdrop.addEventListener('click',event=>{if(event.target===backdrop)closeModal()});backdrop.querySelector('.world-modal-close')?.addEventListener('click',closeModal);backdrop.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{const area=areas[selected];if(!canEnter(area))return;state.area=selected;saveState(state);window.dispatchEvent(new CustomEvent('game:world-changed',{detail:{name:area.name,level:`Lv.${area.min}-${area.max}`}}));window.dispatchEvent(new CustomEvent('game:log',{detail:{message:button.dataset.action==='explore'?`Bắt đầu khám phá ${area.name}.`:`Tiến vào ${area.name}.`,type:'item'}}));closeModal();window.dispatchEvent(new CustomEvent('game:start-exploration',{detail:{area}}))}))}render()}
export { areas }
