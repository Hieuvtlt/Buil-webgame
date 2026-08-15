import './combat.css'
import { player, getPlayerStats, syncDerivedStats, gainExperience } from '../data/character.js'
import { getCharacterImageSrc } from './screens/CharacterScreen.js'

const QUEST_STATE_KEY = 'game.quest.state.v1'
const COMBAT_ASSET_ROOT = '/Buil-webgame/assets/combat/'

function loadQuestState(){try{return JSON.parse(localStorage.getItem(QUEST_STATE_KEY))||{monster:[],monsterProgress:{},wanted:null,wantedCount:0}}catch{return{monster:[],monsterProgress:{},wanted:null,wantedCount:0}}}
function saveQuestState(state){localStorage.setItem(QUEST_STATE_KEY,JSON.stringify(state))}
function addLog(message,type='system'){window.dispatchEvent(new CustomEvent('game:log',{detail:{message,type}}))}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function createMonster(area){const entry=area.monsters[randomInt(0,area.monsters.length-1)];const level=randomInt(Number(entry[1]),Number(entry[2]));const elite=Math.random()<0.1;const hpBase=80+level*45;const maxHp=Math.round(hpBase*(elite?2.2:1));return{name:entry[0],level,maxHp,hp:maxHp,attack:Math.round((8+level*4)*(elite?1.35:1)),defense:Math.round((3+level*2)*(elite?1.3:1)),elite}}

function updateMonsterQuest(mapName,targetName){const state=loadQuestState();state.monster=Array.isArray(state.monster)?state.monster:[];state.monsterProgress=state.monsterProgress&&typeof state.monsterProgress==='object'?state.monsterProgress:{};const questTemplates=[
  ['Rừng Rậm Ven Hồ','Huyết Lang',30],['Bạch Thủy Động','Động Quật Xà',36],['Hắc Hổ Lâm','Hắc Hổ',40],['Thanh Xà Cốc','Thanh Xà',45],['Vũ Lăng Sơn','Hắc Hùng',55],['Dược Vương Cốc','Sơn Tặc Đầu Mục',70],['Tần Lăng','Huyết Sát Ác Tặc',80],['Phù Dung Động','Xích Viêm Ác Tặc',90],['Thiên Sơn Tuyết Cốc','Thiên Sơn Tuyết Yêu',200],['Vạn Độc Cốc','Vạn Độc Ma Tu',240]
];let completed=[];for(const index of state.monster){const q=questTemplates[index];if(!q||q[0]!==mapName||q[1]!==targetName)continue;const current=Number(state.monsterProgress[index]||0)+1;state.monsterProgress[index]=Math.min(q[2],current);if(current>=q[2])completed.push(index)}saveQuestState(state);if(completed.length)window.dispatchEvent(new CustomEvent('game:quest-completed',{detail:{type:'monster',indexes:completed}}));window.dispatchEvent(new CustomEvent('game:quest-progress-changed'));return completed.length>0}

function completeWanted(mapName,targetName){const state=loadQuestState();if(state.wanted===null||state.wanted===undefined)return false;const wanted=[['Hắc Phong Đao Khách','Đường Môn Cổ Địa'],['Huyết Ảnh Ma Nhân','Dược Vương Cốc'],['Thiết Diện Quỷ','Lão Hổ Động'],['Bạch Cốt Khách','Phù Dung Động'],['Xích Viêm Cuồng Đồ','Huyết Sa Mạc']];const q=wanted[Number(state.wanted)];if(!q||q[0]!==targetName||q[1]!==mapName)return false;state.wanted=null;saveQuestState(state);window.dispatchEvent(new CustomEvent('game:wanted-completed',{detail:{target:targetName,map:mapName}}));window.dispatchEvent(new CustomEvent('game:quest-progress-changed'));return true}

export function mountCombatOverlay(){
  let root=document.querySelector('#combat-root');if(root)return
  root=document.createElement('div');root.id='combat-root';document.body.appendChild(root)
  let state=null
  let timer=null
  let nextTimer=null

  function close(){if(timer)clearInterval(timer);if(nextTimer)clearTimeout(nextTimer);timer=null;nextTimer=null;root.innerHTML='';state=null;window.dispatchEvent(new CustomEvent('game:combat-closed'))}

  function returnToCharacter(){
    if(!state||player.hp>0)return
    const stats=getPlayerStats()
    player.hp=stats.maxHp
    player.mp=stats.maxMp
    syncDerivedStats()
    window.dispatchEvent(new CustomEvent('game:character-changed'))
    addLog('Nhân vật đã về thành dưỡng sức.','system')
    close()
    document.querySelector('#left-menu .menu-item[data-screen="Nhân vật"]')?.click()
  }

  function render(){
    if(!state)return
    const stats=getPlayerStats();
    const hpPct=clamp(player.hp/stats.maxHp*100,0,100)
    const mpPct=clamp(player.mp/stats.maxMp*100,0,100)
    const mhpPct=state.monster?clamp(state.monster.hp/state.monster.maxHp*100,0,100):0
    const defeated=state.defeated
    const dead=player.hp<=0
    const skills=[
      {slot:1,icon:'⚔',name:'Công kích',type:'attack'},
      {slot:2,icon:'✦',name:'Liên kích',type:'attack'},
      {slot:3,icon:'✚',name:'Hồi phục',type:'support'},
      {slot:4,icon:'◈',name:'Hộ thể',type:'support'},
      {slot:5,icon:'☯',name:'Tụ khí',type:'support'}
    ]
    root.innerHTML=`<div class="combat-overlay"><section class="combat-window" role="dialog" aria-modal="true"><header class="combat-header"><div><div class="combat-title">⚔ ${state.area.name}</div><div class="combat-header-meta">Lv.${state.area.min}–${state.area.max} · ${state.area.terrain} · Quái đã hạ: ${state.kills}</div></div><button class="combat-close" type="button" id="combat-close">×</button></header><main class="combat-arena"><div class="combat-fighters"><section class="fighter fighter-side"><div class="combat-bars"><div class="combat-bar hp"><span style="width:${hpPct}%"></span></div><div class="combat-bar-label">HP ${Math.max(0,Math.floor(player.hp)).toLocaleString('vi-VN')} / ${stats.maxHp.toLocaleString('vi-VN')}</div><div class="combat-bar mp"><span style="width:${mpPct}%"></span></div><div class="combat-bar-label">MP ${Math.max(0,Math.floor(player.mp)).toLocaleString('vi-VN')} / ${stats.maxMp.toLocaleString('vi-VN')}</div></div><div class="fighter-image-frame"><img class="fighter-image" src="${getCharacterImageSrc()}" alt="Nhân vật"/></div><div class="fighter-name fighter-name-left">${player.name}</div><div class="fighter-level">Lv.${player.level}</div><div class="fighter-tag">NHÂN VẬT</div><div class="combat-stats"><span>⚔ <b>${stats.attackMin}–${stats.attackMax}</b></span><span>🛡 <b>${stats.defense}</b></span></div></section><div class="combat-vs">VS</div><section class="fighter fighter-side"><div class="combat-bars monster-bars"><div class="combat-bar hp"><span style="width:${mhpPct}%"></span></div><div class="combat-bar-label">HP ${Math.max(0,Math.floor(state.monster?.hp||0)).toLocaleString('vi-VN')} / ${(state.monster?.maxHp||0).toLocaleString('vi-VN')}</div></div><div class="fighter-image-frame"><img class="monster-image" src="${COMBAT_ASSET_ROOT}monster-common.svg" alt="${state.monster?.name||'Quái vật'}"/></div><div class="fighter-name">${state.monster?.name||'Quái vật'}</div><div class="fighter-level">Lv.${state.monster?.level||0}</div><div class="fighter-tag">${state.monster?.elite?'TINH ANH':'QUÁI THƯỜNG'}</div><div class="combat-stats"><span>⚔ <b>${state.monster?.attack||0}</b></span><span>🛡 <b>${state.monster?.defense||0}</b></span></div></section></div><div class="combat-log" id="combat-log">${state.logs.map(x=>`<div class="combat-log-line ${x.type||''}">${x.text}</div>`).join('')}</div><div class="combat-controls"><div class="combat-skill-row">${skills.map(s=>`<button class="combat-skill combat-skill-${s.type}" type="button" data-skill-slot="${s.slot}" ${defeated||dead?'disabled':''}><strong>${s.icon}</strong><small>${s.name}</small></button>`).join('')}</div><div class="combat-item-row"><button class="combat-item-slot" type="button" title="Đan dược hồi HP" ${dead?'disabled':''}>❤️<small>HP</small></button><button class="combat-item-slot" type="button" title="Đan dược hồi MP" ${dead?'disabled':''}>💧<small>MP</small></button><button class="combat-toggle ${state.auto?'active':''}" type="button" id="combat-auto">${state.auto?'✓ AUTO':'AUTO'}</button>${defeated?`<button class="combat-action" type="button" id="combat-next">TÌM QUÁI TIẾP</button>`:dead?'':`<button class="combat-action danger" type="button" id="combat-leave">RỜI KHU VỰC</button>`}</div>${state.autoMenu?`<div class="combat-auto-menu"><b>CÀI ĐẶT AUTO</b><label><input type="checkbox" data-auto="attack" ${state.autoSettings.attack?'checked':''}/> Tự động đánh thường</label><label><input type="checkbox" data-auto="skill" ${state.autoSettings.skill?'checked':''}/> Tự động dùng kỹ năng</label><label><input type="checkbox" data-auto="hp" ${state.autoSettings.hp?'checked':''}/> Tự dùng đan HP</label><label><input type="checkbox" data-auto="mp" ${state.autoSettings.mp?'checked':''}/> Tự dùng đan MP</label><button type="button" class="combat-auto-close" id="combat-auto-close">ĐÓNG</button></div>`:''}</div></main>${dead?`<div class="combat-defeat-overlay"><button class="combat-defeat-title" type="button" id="combat-return-character">VỀ THÀNH DƯỠNG SỨC</button><div class="combat-defeat-sub">Nhấn vào để trở về menu nhân vật</div></div>`:''}<footer class="combat-footer"><span class="combat-target">🎯 Mục tiêu: ${state.monster?.name||'—'}</span><span>${dead?'<b class="combat-defeat">Đang chờ về thành...</b>':defeated?'<b class="combat-complete">Đã hạ quái.</b>':'Đang giao chiến...'}</span></footer></section></div>`

    root.querySelector('#combat-close')?.addEventListener('click',close)
    root.querySelector('#combat-leave')?.addEventListener('click',close)
    root.querySelector('#combat-return-character')?.addEventListener('click',returnToCharacter)
    root.querySelector('#combat-auto')?.addEventListener('click',()=>{state.autoMenu=!state.autoMenu;render()})
    root.querySelector('#combat-auto-close')?.addEventListener('click',()=>{state.autoMenu=false;render()})
    root.querySelectorAll('[data-auto]').forEach(el=>el.addEventListener('change',()=>{state.autoSettings[el.dataset.auto]=el.checked}))
    root.querySelectorAll('[data-skill-slot]').forEach(btn=>btn.addEventListener('click',()=>useSkill(Number(btn.dataset.skillSlot))))
    root.querySelector('#combat-next')?.addEventListener('click',nextMonster)
    root.querySelectorAll('.combat-item-slot').forEach((btn,index)=>btn.addEventListener('click',()=>useRecoveryItem(index)))
    const log=root.querySelector('#combat-log');if(log)log.scrollTop=log.scrollHeight
  }

  function stopLoop(){if(timer)clearInterval(timer);timer=null}
  function startLoop(){stopLoop();if(!state?.auto||state.defeated||player.hp<=0)return;timer=setInterval(()=>playerAttack(),1200)}

  function useRecoveryItem(index){
    if(!state||player.hp<=0)return
    const stats=getPlayerStats()
    if(index===0){player.hp=Math.min(stats.maxHp,player.hp+Math.round(stats.maxHp*.2));state.logs.push({text:'💊 Sử dụng đan dược hồi HP.',type:'reward'})}
    else {player.mp=Math.min(stats.maxMp,player.mp+Math.round(stats.maxMp*.2));state.logs.push({text:'💧 Sử dụng đan dược hồi MP.',type:'reward'})}
    render()
  }

  function useSkill(slot){
    if(!state||state.defeated||player.hp<=0||!state.monster)return
    const stats=getPlayerStats()
    if(slot===1){playerAttack();return}
    if(slot===2){const damage=randomInt(stats.attackMax,Math.max(stats.attackMax,stats.attackMax+Math.round(stats.attackMax*.35)));state.monster.hp=Math.max(0,state.monster.hp-damage);state.logs.push({text:`✦ Liên kích gây ${damage} sát thương.`,type:'hit'})}
    if(slot===3){player.hp=Math.min(stats.maxHp,player.hp+Math.round(stats.maxHp*.2));state.logs.push({text:'✚ Hồi phục chủ động: HP +20%.',type:'reward'})}
    if(slot===4){state.logs.push({text:'◈ Hộ thể chủ động: hiệu ứng phòng thủ sẽ được mở rộng sau.',type:'system'})}
    if(slot===5){player.mp=Math.min(stats.maxMp,player.mp+Math.round(stats.maxMp*.2));state.logs.push({text:'☯ Tụ khí chủ động: MP +20%.',type:'reward'})}
    if(state.monster.hp<=0)finishMonster();else render()
  }

  function playerAttack(){if(!state||state.defeated||player.hp<=0||!state.monster)return;const stats=getPlayerStats();const damage=randomInt(stats.attackMin,Math.max(stats.attackMin,stats.attackMax));state.monster.hp=Math.max(0,state.monster.hp-damage);state.logs.push({text:`Bạn gây ${damage} sát thương lên ${state.monster.name}.`,type:'hit'});if(state.logs.length>40)state.logs.shift();if(state.monster.hp<=0){finishMonster();return}const monsterDamage=Math.max(1,state.monster.attack-stats.defense);player.hp=Math.max(0,player.hp-monsterDamage);state.logs.push({text:`${state.monster.name} gây ${monsterDamage} sát thương.`,type:'damage'});if(player.hp<=0){stopLoop();state.logs.push({text:'Nhân vật đã gục ngã.',type:'damage'});render();return}render()}

  function finishMonster(){stopLoop();state.defeated=true;state.kills+=1;const exp=10+state.monster.level*4+(state.monster.elite?Math.round(state.monster.level*3):0);const gold=5+state.monster.level*3+(state.monster.elite?state.monster.level*2:0);const oldLevel=player.level;gainExperience(exp);player.gold+=gold;syncDerivedStats();const questDone=updateMonsterQuest(state.area.name,state.monster.name);const wantedDone=completeWanted(state.area.name,state.monster.name);state.logs.push({text:`🎁 +${exp} EXP · +${gold} vàng${state.monster.elite?' · Tinh anh':''}`,type:'reward'});if(questDone)state.logs.push({text:'✓ Một nhiệm vụ quái vật đã hoàn thành.',type:'reward'});if(wantedDone)state.logs.push({text:'☠ Truy nã hoàn thành! Nhận thưởng truy nã.',type:'reward'});if(player.level>oldLevel)state.logs.push({text:`★ Nhân vật lên Lv.${player.level}!`,type:'reward'});window.dispatchEvent(new CustomEvent('game:character-changed'));addLog(`Hạ ${state.monster.name} Lv.${state.monster.level}: +${exp} EXP, +${gold} vàng.`,'item');render()}
  function nextMonster(){if(!state)return;state.defeated=false;state.monster=createMonster(state.area);state.logs.push({text:`Bạn tiếp tục tìm quái trong ${state.area.name}.`,type:'system'});render();startLoop()}

  function start(detail){close();const area=detail?.area;if(!area?.monsters?.length)return;syncDerivedStats();state={area,kills:0,auto:true,autoMenu:false,autoSettings:{attack:true,skill:false,hp:false,mp:false},monster:createMonster(area),defeated:false,logs:[{text:`Đã tiến vào ${area.name}. Mục tiêu đầu tiên: ${area.monsters[0][0]}.`,type:'system'}]};render();startLoop()}
  window.addEventListener('game:start-combat',event=>start(event.detail));window.addEventListener('game:close-combat',close)
}
