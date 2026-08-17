import { CombatEngine } from './CombatEngine.js'
import { player } from '../data/character.js'
import { getActiveCombatMap, setActiveCombatEngine } from './combatSession.js'
import './CombatScreen.css'

const esc = value => String(value ?? '').replace(/[&<>\"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]))

function enemyCard(enemy, selected) {
  const hpPct = enemy.maxHp ? Math.max(0, enemy.hp / enemy.maxHp * 100) : 0
  return `<button type="button" class="combat-enemy ${enemy.dead ? 'is-dead' : ''} ${selected ? 'is-selected' : ''}" data-target="${enemy.id}" ${enemy.dead ? 'disabled' : ''} style="left:${enemy.x}%;top:${enemy.y}%">
    <span class="enemy-glow ${enemy.color}"></span><span class="enemy-avatar">${enemy.color === 'ice' ? '❄' : enemy.color === 'poison' ? '☠' : enemy.color === 'mythic' ? '✦' : '◆'}</span>
    <span class="enemy-name">${esc(enemy.name)} <b>Lv.${enemy.level}</b></span>
    <span class="combat-mini-hp"><i style="width:${hpPct}%"></i></span>
  </button>`
}

function skillButton(entry, index) {
  const skill = entry.skill
  const level = entry.level
  return `<button type="button" class="combat-skill" data-skill="${skill.id}" title="${esc(skill.description)}"><span class="combat-skill-key">${index + 1}</span><img src="${skill.icon}" alt="" onerror="this.style.display='none'"/><b>${esc(skill.name)}</b><small>Lv.${level} • ${skill.manaCost} MP</small></button>`
}

export function CombatScreen() {
  const map = getActiveCombatMap()
  if (!map) return `<section class="combat-screen combat-empty"><div class="combat-empty-box"><h3>CHƯA CÓ CHIẾN TRƯỜNG</h3><p>Hãy chọn một bản đồ trong Ngoại cảnh và bấm TIẾN VÀO.</p></div></section>`
  return `<section class="combat-screen">
    <header class="combat-topbar"><div><span class="eyebrow">CHIẾN TRƯỜNG • ${esc(map.key)}</span><h2>${esc(map.name)}</h2></div><div class="combat-wave"><span>WAVE</span><strong id="combat-wave">1</strong></div><button class="combat-leave" type="button" data-leave>RỜI CHIẾN TRƯỜNG</button></header>
    <div class="combat-layout">
      <aside class="combat-left-panel">
        <div class="combat-player-card"><div class="combat-player-avatar">♙</div><div><strong>${esc(player.name)}</strong><small>Lv.${player.level} • ${esc(player.sect)}</small></div></div>
        <div class="combat-resource"><span>HP</span><b id="combat-hp-text"></b><div><i id="combat-hp-bar"></i></div></div>
        <div class="combat-resource mana"><span>MP</span><b id="combat-mp-text"></b><div><i id="combat-mp-bar"></i></div></div>
        <div class="combat-stats" id="combat-stats"></div>
        <div class="combat-mode"><span>TỰ ĐỘNG ĐÁNH</span><button type="button" data-auto class="is-on">BẬT</button></div>
      </aside>
      <main class="combat-arena-wrap"><div class="combat-arena" id="combat-arena"><div class="arena-runes"></div><div class="combat-center"><div class="player-ring"><span>♙</span></div><small>BẠN</small></div><div id="combat-enemies"></div><div class="combat-target-hint" id="combat-target-hint">Chọn mục tiêu để đánh</div></div></main>
      <aside class="combat-right-panel"><div class="combat-target-panel"><span class="panel-label">MỤC TIÊU</span><div id="combat-target-detail">Chưa chọn</div></div><div class="combat-log" id="combat-log"></div></aside>
    </div>
    <footer class="combat-bottom"><div class="combat-skills" id="combat-skills"></div><button class="combat-basic" type="button" data-basic>ĐÁNH<br><small>SPACE</small></button></footer>
  </section>`
}

export function mountCombatScreen() {
  const screen = document.querySelector('.combat-screen')
  const map = getActiveCombatMap()
  if (!screen || !map) return () => {}

  const arena = screen.querySelector('#combat-arena')
  const enemiesRoot = screen.querySelector('#combat-enemies')
  const logRoot = screen.querySelector('#combat-log')
  const targetDetail = screen.querySelector('#combat-target-detail')
  const hpText = screen.querySelector('#combat-hp-text')
  const mpText = screen.querySelector('#combat-mp-text')
  const hpBar = screen.querySelector('#combat-hp-bar')
  const mpBar = screen.querySelector('#combat-mp-bar')
  const wave = screen.querySelector('#combat-wave')
  const skillsRoot = screen.querySelector('#combat-skills')
  const autoButton = screen.querySelector('[data-auto]')
  const statsRoot = screen.querySelector('#combat-stats')
  let ended = false

  const log = (message, type = 'system') => {
    const line = document.createElement('div')
    line.className = `combat-log-line ${type}`
    line.textContent = message
    logRoot.appendChild(line)
    while (logRoot.children.length > 70) logRoot.removeChild(logRoot.firstElementChild)
    logRoot.scrollTop = logRoot.scrollHeight
  }

  const engine = new CombatEngine(map, { onChange: render, onLog: log, onEnd: result => { ended = true; render(); showEnd(result) } })
  setActiveCombatEngine(engine)

  function showEnd(result) {
    const box = document.createElement('div')
    box.className = `combat-result ${result}`
    box.innerHTML = `<div><span>${result === 'victory' ? '✦' : '☠'}</span><h3>${result === 'victory' ? 'CHIẾN THẮNG' : 'THẤT BẠI'}</h3><p>${result === 'victory' ? `Đã hoàn thành chiến trường ${esc(map.name)}.` : 'Bạn cần hồi phục và chuẩn bị lại.'}</p><button type="button" data-result-leave>RỜI CHIẾN TRƯỜNG</button></div>`
    arena.appendChild(box)
  }

  function render() {
    const state = engine.snapshot()
    wave.textContent = state.wave
    hpText.textContent = `${Math.round(state.player.hp)} / ${Math.round(state.player.maxHp)}`
    mpText.textContent = `${Math.round(state.player.mp)} / ${Math.round(state.player.maxMp)}`
    hpBar.style.width = `${Math.max(0, state.player.hp / state.player.maxHp * 100)}%`
    mpBar.style.width = `${Math.max(0, state.player.mp / state.player.maxMp * 100)}%`
    autoButton.textContent = state.autoAttack ? 'BẬT' : 'TẮT'
    autoButton.classList.toggle('is-on', state.autoAttack)
    enemiesRoot.innerHTML = state.enemies.map(enemy => enemyCard(enemy, enemy.id === state.selectedEnemyId)).join('')
    const target = state.enemies.find(enemy => enemy.id === state.selectedEnemyId && !enemy.dead)
    targetDetail.innerHTML = target ? `<strong>${esc(target.name)}</strong><small>Lv.${target.level}</small><div class="target-hp"><i style="width:${target.hp / target.maxHp * 100}%"></i></div><span>${Math.round(target.hp)} / ${target.maxHp} HP</span>` : 'Chưa chọn'
    const stats = engine.playerStats
    statsRoot.innerHTML = `<span>Công: ${stats.attackMin}–${stats.attackMax}</span><span>Thủ: ${stats.defense}</span><span>Chính xác: ${stats.accuracy}</span><span>Né: ${stats.dodge}</span>`
    skillsRoot.innerHTML = state.skills.length ? state.skills.slice(0, 6).map(skillButton).join('') : '<div class="combat-no-skill">Chưa học võ kỹ • dùng ĐÁNH cơ bản</div>'
  }

  const onClick = event => {
    const target = event.target.closest('[data-target]')
    if (target) { engine.selectEnemy(target.dataset.target); return }
    const skill = event.target.closest('[data-skill]')
    if (skill) { engine.useSkill(skill.dataset.skill); return }
    if (event.target.closest('[data-basic]')) engine.basicAttack()
    if (event.target.closest('[data-auto]')) engine.toggleAutoAttack()
    if (event.target.closest('[data-leave]') || event.target.closest('[data-result-leave]')) leave()
  }
  const onKey = event => { if (event.code === 'Space') { event.preventDefault(); engine.basicAttack() } }
  const leave = () => { window.dispatchEvent(new CustomEvent('game:combat-leave')) }

  screen.addEventListener('click', onClick)
  window.addEventListener('keydown', onKey)
  log(`Tiến vào ${map.name}.`, 'system')
  log('Chiến đấu thời gian thực đã bắt đầu. Chọn mục tiêu hoặc để TỰ ĐỘNG ĐÁNH xử lý.', 'combat')
  render()

  return () => {
    screen.removeEventListener('click', onClick)
    window.removeEventListener('keydown', onKey)
    engine.stop()
    if (!ended) setActiveCombatEngine(null)
  }
}
