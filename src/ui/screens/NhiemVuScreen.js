import './NhiemVuScreen.css'
import { player } from '../../data/character.js'

const monsterTemplates = [
  { name:'Săn Huyết Lang', map:'Rừng Huyết Lang', target:'Huyết Lang', min:1, max:30, baseCount:30 },
  { name:'Dẹp Sơn Tặc', map:'Sơn Tặc Sơn', target:'Sơn Tặc', min:11, max:40, baseCount:36 },
  { name:'Trừ Yêu Xà', map:'Thanh Xà Cốc', target:'Thanh Xà Yêu', min:21, max:50, baseCount:42 },
  { name:'Quét Địa Huyệt', map:'Địa Huyệt', target:'Địa Huyệt Trùng', min:31, max:60, baseCount:48 },
  { name:'Dẹp Ma Binh', map:'Ma Binh Cốc', target:'Ma Binh', min:41, max:70, baseCount:55 },
  { name:'Săn Hắc Hổ', map:'Hắc Hổ Lâm', target:'Hắc Hổ', min:51, max:90, baseCount:70 },
  { name:'Thanh Trừ Quỷ Tướng', map:'U Minh Cốc', target:'Quỷ Tướng', min:61, max:100, baseCount:80 },
  { name:'Diệt Huyết Ma', map:'Huyết Ma Sơn', target:'Huyết Ma', min:71, max:120, baseCount:90 },
  { name:'Quét Thiên Yêu', map:'Thiên Yêu Lĩnh', target:'Thiên Yêu', min:81, max:160, baseCount:200 },
  { name:'Đại Trừ Yêu', map:'Vạn Yêu Cốc', target:'Yêu Vương Tộc Binh', min:91, max:200, baseCount:240 },
]

const wanted = [
  {name:'Hắc Phong Đao Khách',level:'Lv.43',map:'Rừng Hắc Phong',reward:'2.500 EXP · 3.000 vàng · Đan dược ×2 · Linh dược ×8'},
  {name:'Huyết Ảnh Ma Nhân',level:'Lv.51',map:'Huyết Ảnh Cốc',reward:'3.200 EXP · 4.500 vàng · Đan dược ×2 · Linh dược ×10'},
  {name:'Thiết Diện Quỷ',level:'Lv.68',map:'Thiết Sơn',reward:'5.000 EXP · 7.000 vàng · Đan dược ×3 · Linh dược ×12'},
  {name:'Bạch Cốt Khách',level:'Lv.82',map:'Bạch Cốt Lâm',reward:'7.500 EXP · 10.000 vàng · Đan dược ×3 · Linh dược ×15'},
  {name:'Xích Viêm Cuồng Đồ',level:'Lv.96',map:'Xích Viêm Sơn',reward:'10.000 EXP · 15.000 vàng · Đan dược ×4 · Linh dược ×18'},
]

const QUEST_STATE_KEY='game.quest.state.v1'
function loadState(){try{return JSON.parse(localStorage.getItem(QUEST_STATE_KEY))||{monster:[],wanted:null,wantedCount:0}}catch{return{monster:[],wanted:null,wantedCount:0}}}
function saveState(state){localStorage.setItem(QUEST_STATE_KEY,JSON.stringify(state))}
function countForLevel(template){const level=Number(player.level)||1;if(level>=90)return Math.max(200,Math.min(300,template.baseCount+Math.floor((level-90)/10)*5));if(level>50)return Math.max(60,Math.min(100,template.baseCount));return Math.max(30,Math.min(60,template.baseCount))}
function levelDistance(template){const level=Number(player.level)||1;return level>=template.min-5&&level<=template.max+5}
function monsterQuests(){return monsterTemplates.map((q,i)=>({...q,count:countForLevel(q),suitable:levelDistance(q),reward:`${(800+i*350).toLocaleString('vi-VN')} vàng · Linh dược ×${Math.max(3,Math.floor((i+3)/2))}`}))}

function monsterView(state){
  const quests=monsterQuests(),activeIds=new Set(state.monster||[])
  return `<div class="quest-summary"><span>⚔ Đang nhận: <b>${activeIds.size}/2</b></span><span>Nhận nhiệm vụ cả ngày · Không giới hạn số lần nhận</span></div><div class="quest-list" role="list">${quests.map((q,i)=>{const active=activeIds.has(i),disabled=active||activeIds.size>=2||!q.suitable;return `<article class="quest-card${!q.suitable?' quest-not-suitable':''}" role="listitem"><div class="quest-avatar">⚔</div><div class="quest-body"><div class="quest-name">${q.name}</div><div class="quest-meta">📍 ${q.map} · Lv.${q.min}–${q.max}<br>🎯 ${q.target} · <b>${q.count} con</b></div><div class="quest-progress">Tiêu diệt: <strong>0/${q.count}</strong></div><div class="quest-reward">🎁 ${q.reward}</div></div><div class="quest-choice">${q.suitable?`<span class="quest-suitable">Phù hợp Lv. ${player.level}</span>`:'<span class="quest-unsuitable">Ngoài cấp độ</span>'}<button class="quest-action" type="button" data-type="monster" data-index="${i}" ${disabled?'disabled':''}>${active?'ĐANG NHẬN':'NHẬN NHIỆM VỤ'}</button></div></article>`}).join('')}</div>`
}
function wantedView(state){return `<div class="quest-summary"><span>☠ Truy nã hôm nay: <b>${state.wantedCount||0}/10</b></span><span>🔄 Làm mới sau: <b id="wanted-timer">01:00:00</b></span></div><div class="wanted-grid" role="list">${wanted.map((q,i)=>`<article class="wanted-card" role="listitem"><div class="wanted-head"><div class="quest-avatar">☠</div><div><div class="wanted-name">${q.name}</div><div class="wanted-badge">Boss nhỏ · ${q.level}</div></div></div><div class="wanted-map">📍 ${q.map}<br>🔎 Khả năng gặp: <b>Thấp</b></div><div class="wanted-rewards">🎁 ${q.reward}</div><div class="wanted-status">Mục tiêu chưa được phát hiện...</div><button class="quest-action" type="button" data-type="wanted" data-index="${i}" ${state.wanted||state.wantedCount>=10?'disabled':''}>${state.wanted?'ĐANG TRUY NÃ':'NHẬN TRUY NÃ'}</button></article>`).join('')}</div>`}

export function NhiemVuScreen(){return `<div class="quest-screen"><div class="quest-tabs"><button class="quest-tab active" data-tab="monster">⚔ NHIỆM VỤ QUÁI VẬT</button><button class="quest-tab" data-tab="wanted">☠ TRUY NÃ</button></div><div id="quest-content"></div></div>`}

export function mountNhiemVuScreen(){
  const root=document.querySelector('.quest-screen');if(!root)return
  const content=root.querySelector('#quest-content'),state=loadState();let seconds=3600,currentTab='monster'
  function render(){content.innerHTML=currentTab==='wanted'?wantedView(state):monsterView(state);bindActions()}
  function bindActions(){root.querySelectorAll('.quest-action').forEach(btn=>btn.addEventListener('click',()=>{const type=btn.dataset.type,index=Number(btn.dataset.index);if(type==='monster'){state.monster=Array.isArray(state.monster)?state.monster:[];if(state.monster.length>=2||state.monster.includes(index))return;state.monster.push(index);saveState(state);window.dispatchEvent(new CustomEvent('game:log',{detail:{message:`Đã nhận nhiệm vụ quái vật: ${monsterTemplates[index].name}.`,type:'item'}}))}else{if(state.wanted||(state.wantedCount||0)>=10)return;state.wanted=index;state.wantedCount=(state.wantedCount||0)+1;saveState(state);window.dispatchEvent(new CustomEvent('game:log',{detail:{message:`Đã nhận truy nã: ${wanted[index].name}.`,type:'item'}}))}render()}))}
  root.querySelectorAll('.quest-tab').forEach(tab=>tab.addEventListener('click',()=>{currentTab=tab.dataset.tab;root.querySelectorAll('.quest-tab').forEach(t=>t.classList.toggle('active',t===tab));render()}))
  const timer=setInterval(()=>{if(!document.body.contains(root)){clearInterval(timer);return}seconds=Math.max(0,seconds-1);const el=root.querySelector('#wanted-timer');if(el){const h=String(Math.floor(seconds/3600)).padStart(2,'0'),m=String(Math.floor(seconds%3600/60)).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');el.textContent=`${h}:${m}:${s}`}if(seconds===0){seconds=3600;state.wanted=null;saveState(state);if(currentTab==='wanted')render()}},1000)
  render()
}
