import './NgoaiCanhScreen.css'
import { player } from '../../data/character.js'

// Mỗi khu vực có đúng 3 loại quái. Phân tầng theo cấp khu vực:
// Lv.1–50: thú hoang / yêu thú sơ cấp
// Lv.51–100: thổ phỉ / sơn tặc / ác tặc / đạo tặc
// Lv.101–150: thủy quái / yêu quái / Rolin và các dị thú trung-cao cấp
// Lv.151–200: cao nhân sa đọa / ma tu / thần thú
const areas = [
  {name:'Rừng Rậm Ven Hồ',min:1,max:10,icon:'🌲',terrain:'Rừng hồ',monsters:[['Huyết Lang',5,7],['Linh Hầu',6,8],['Thanh Mao Hùng',8,10]]},
  {name:'Bạch Thủy Động',min:6,max:15,icon:'💧',terrain:'Hang động',monsters:[['Động Quật Xà',8,10],['Hắc Nha Lang',10,13],['Thạch Giáp Thú',12,15]]},
  {name:'Hắc Hổ Lâm',min:11,max:20,icon:'🐯',terrain:'Rừng sâu',monsters:[['Hắc Hổ',12,15],['Sơn Viên',14,18],['Cuồng Nộ Dã Trư',17,20]]},
  {name:'Thanh Xà Cốc',min:16,max:25,icon:'🐍',terrain:'Thung lũng',monsters:[['Thanh Xà',17,20],['Xích Luyện Xà',19,23],['Xà Vương Thủ Vệ',22,25]]},
  {name:'Vũ Lăng Sơn',min:21,max:30,icon:'⛰️',terrain:'Núi rừng',monsters:[['Hắc Hùng',22,25],['Thiết Bối Sơn Miêu',24,28],['Vũ Lăng Hổ Yêu',27,30]]},
  {name:'Thiên Nhẫn Cốc',min:31,max:40,icon:'🦂',terrain:'Cốc địa',monsters:[['Độc Hạt',32,35],['Huyết Nhãn Lang',35,38],['Thiên Nhẫn Yêu Thú',37,40]]},
  {name:'Võ Đang Sơn',min:41,max:50,icon:'☯️',terrain:'Đạo sơn',monsters:[['Thanh Phong Linh Lộc',42,45],['Huyền Vũ Thú',45,48],['Kim Sí Điêu',48,50]]},

  {name:'Đường Môn Cổ Địa',min:51,max:60,icon:'🎯',terrain:'Cổ địa',monsters:[['Đường Môn Thổ Phỉ',52,55],['Hắc Y Sơn Tặc',55,58],['Độc Tiễn Ác Tặc',58,60]]},
  {name:'Dược Vương Cốc',min:61,max:70,icon:'🌿',terrain:'Linh cốc',monsters:[['Sơn Tặc Đầu Mục',62,65],['Huyết Đao Thổ Phỉ',65,68],['Ác Tặc Dược Cốc',68,70]]},
  {name:'Lão Hổ Động',min:71,max:80,icon:'🐯',terrain:'Sơn động',monsters:[['Hắc Phong Đạo Tặc',72,75],['Cuồng Đao Ác Tặc',75,78],['Sơn Trại Đại Đầu Mục',78,80]]},
  {name:'Tần Lăng',min:81,max:90,icon:'🏛️',terrain:'Cổ lăng',monsters:[['Tần Lăng Thổ Phỉ',82,85],['Đoạt Mệnh Sơn Tặc',85,88],['Huyết Sát Ác Tặc',88,90]]},
  {name:'Phù Dung Động',min:91,max:100,icon:'🔥',terrain:'Địa huyệt',monsters:[['Phù Dung Đạo Tặc',92,95],['Xích Viêm Ác Tặc',95,98],['Ma Đao Sơn Tặc',98,100]]},

  {name:'Phong Lăng Độ',min:101,max:115,icon:'⛵',terrain:'Bến nước',monsters:[['Phong Lăng Thủy Quái',103,107],['Hắc Phong Yêu',107,111],['Rolin Thủy Vệ',111,115]]},
  {name:'Huyết Sa Mạc',min:116,max:130,icon:'🏜️',terrain:'Sa mạc',monsters:[['Huyết Sa Thủy Yêu',118,122],['Xích Viêm Yêu Quái',122,126],['Rolin Huyết Giáp',126,130]]},
  {name:'Thiên Sơn Tuyết Cốc',min:131,max:150,icon:'❄️',terrain:'Tuyết vực',monsters:[['Băng Hải Thủy Quái',133,138],['Thiên Sơn Tuyết Yêu',138,144],['Rolin Huyền Băng',144,150]]},

  {name:'Côn Lôn Sơn',min:151,max:175,icon:'🏔️',terrain:'Côn Lôn',monsters:[['Côn Lôn Ma Tu',153,160],['Huyết Kiếm Cao Nhân',160,168],['Thanh Lân Thần Thú',168,175]]},
  {name:'Vạn Độc Cốc',min:176,max:200,icon:'☠️',terrain:'Độc cốc',monsters:[['Vạn Độc Ma Tu',178,185],['Thiên Diện Ác Nhân',185,192],['Cửu Thiên Thần Thú',192,200]]},
]

const WORLD_STATE_KEY='game.world.state.v1'
function loadState(){try{return JSON.parse(localStorage.getItem(WORLD_STATE_KEY))||{area:0}}catch{return{area:0}}}
function saveState(state){localStorage.setItem(WORLD_STATE_KEY,JSON.stringify(state))}
function canEnter(area){const level=Number(player.level)||1;return level>=area.min-5&&level<=area.max+5}
function recommended(area){const level=Number(player.level)||1;if(level<area.min-5)return `Cần khoảng Lv.${area.min-5} trở lên`;if(level>area.max+5)return `Khu vực thấp hơn Lv.${level}`;if(level<area.min)return `Hơi cao hơn cấp đề nghị · Lv.${area.min}–${area.max}`;if(level>area.max)return `Hơi thấp hơn cấp đề nghị · Lv.${area.min}–${area.max}`;return `Phù hợp Lv.${level}`}
function mapMarkup(selected){return `<div class="world-map"><div class="world-map-title">BẢN ĐỒ NGOẠI CẢNH</div><div class="world-map-subtitle">Các khu vực luyện công phân bố theo cấp độ nhân vật</div><div class="world-route"></div>${areas.map((area,i)=>{const x=10+(i%5)*20,y=25+Math.floor(i/5)*22,ok=canEnter(area);return `<button class="world-node${i===selected?' active':''}${ok?'':' locked'}" style="left:${x}%;top:${y}%" type="button" data-area="${i}" ${ok?'':'disabled'}><span class="world-node-icon">${area.icon}</span><span class="world-node-name">${area.name}</span><span class="world-node-level">Lv.${area.min}–${area.max}</span></button>`}).join('')}<div class="world-legend">🟢 Có thể vào · 🔒 Chưa đủ cấp · Chênh lệch tối đa ±5 Lv.</div></div>`}
function detailMarkup(area,state){const ok=canEnter(area),index=areas.indexOf(area);return `<aside class="world-detail"><div class="world-detail-head"><div class="world-detail-name">${area.icon} ${area.name}</div><div class="world-detail-level">Cấp khu vực Lv.${area.min}–${area.max} · ${area.terrain}</div></div><div class="world-detail-body"><section class="world-section"><div class="world-section-title">THÔNG TIN KHU VỰC</div><div class="world-current">Cấp nhân vật: <b>Lv.${player.level}</b></div><div class="world-current" style="margin-top:5px">Trạng thái: <b>${recommended(area)}</b></div><div class="world-current" style="margin-top:5px">Khu vực dùng để <b>luyện công</b> và là điểm đến cho các <b>nhiệm vụ</b>.</div></section><section class="world-section"><div class="world-section-title">QUÁI VẬT KHU VỰC · 3 LOẠI</div>${area.monsters.map((m,i)=>`<div class="world-monster"><span class="world-monster-name">${i+1}. ${m[0]}</span><span class="world-monster-level">Lv.${m[1]}–${m[2]}</span></div>`).join('')}</section><section class="world-section"><div class="world-section-title">HOẠT ĐỘNG</div><div class="world-current">• Luyện công và săn quái</div><div class="world-current" style="margin-top:5px">• Nhiệm vụ quái vật có thể yêu cầu đến khu vực này</div><div class="world-current" style="margin-top:5px">• Có thể phát sinh mục tiêu truy nã tại khu vực</div></section><div class="world-detail-actions"><button class="world-action" type="button" data-action="enter" ${ok?'':'disabled'}>${state.area===index?'ĐANG Ở ĐÂY':'ĐI TỚI KHU VỰC'}</button><button class="world-action secondary" type="button" data-action="train" ${ok?'':'disabled'}>LUYỆN CÔNG</button></div></div></aside>`}
export function NgoaiCanhScreen(){return `<div class="world-screen"><div class="world-toolbar"><span class="world-toolbar-title">◆ NGOẠI CẢNH</span><span class="world-toolbar-info">Chọn khu vực phù hợp để luyện công, làm nhiệm vụ và săn quái</span></div><div id="world-content" class="world-layout"></div></div>`}
export function mountNgoaiCanhScreen(){const root=document.querySelector('.world-screen');if(!root)return;const content=root.querySelector('#world-content'),state=loadState();let selected=Math.min(Math.max(Number(state.area)||0,0),areas.length-1);function render(){content.innerHTML=mapMarkup(selected)+detailMarkup(areas[selected],state);bind()}function bind(){root.querySelectorAll('.world-node:not(:disabled)').forEach(btn=>btn.addEventListener('click',()=>{selected=Number(btn.dataset.area);render()}));root.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',()=>{const area=areas[selected];if(!canEnter(area))return;state.area=selected;saveState(state);const action=btn.dataset.action;window.dispatchEvent(new CustomEvent('game:world-changed',{detail:{name:area.name,level:`Lv.${area.min}-${area.max}`,monsters:area.monsters}}));window.dispatchEvent(new CustomEvent('game:log',{detail:{message:action==='train'?`Bắt đầu luyện công tại ${area.name}.`:`Đã di chuyển đến ${area.name}.`,type:'item'}}));render()}))}render()}
