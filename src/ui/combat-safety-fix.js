import { player, getPlayerStats } from '../data/character.js'

// Combat safety/position layer:
// 1) Render unit coordinates as real battlefield percentages so what the player sees
//    matches the combat distance used by the combat controller.
// 2) Never allow damage to be applied while every visible monster is outside the
//    actual close-combat radius. This prevents the player from dying "from nowhere".
const ATTACK_VISUAL_RANGE = 0.10
let lastHp = player.hp
let lastBlockedLog = 0

function parseTranslate(value) {
  const m = String(value || '').match(/translate\(\s*(-?[\d.]+)%\s*,\s*(-?[\d.]+)%\s*\)/)
  return m ? { x: Number(m[1]), y: Number(m[2]) } : null
}

function fixUnitPositions(field) {
  field.querySelectorAll('.combat-unit-wrap').forEach((unit) => {
    const p = parseTranslate(unit.style.transform)
    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return
    unit.style.left = `${p.x}%`
    unit.style.top = `${p.y}%`
    unit.style.transform = 'translate(-50%, -50%)'
  })
}

function nearestVisibleMonsterDistance(field, playerEl) {
  if (!playerEl) return Infinity
  const pr = playerEl.getBoundingClientRect()
  const px = pr.left + pr.width / 2
  const py = pr.top + pr.height / 2
  let nearest = Infinity
  field.querySelectorAll('.combat-unit-wrap.monster').forEach((unit) => {
    if (unit.style.opacity === '0') return
    const r = unit.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const dx = (x - px) / Math.max(1, field.clientWidth)
    const dy = (y - py) / Math.max(1, field.clientHeight)
    nearest = Math.min(nearest, Math.hypot(dx, dy))
  })
  return nearest
}

function frame() {
  const field = document.querySelector('.combat-battlefield')
  const playerEl = field?.querySelector('[data-unit-id="player"]')
  if (field) fixUnitPositions(field)

  if (field && playerEl) {
    const hp = Math.max(0, Number(player.hp) || 0)
    const nearest = nearestVisibleMonsterDistance(field, playerEl)

    // A damage event is only legitimate when a monster is actually close on screen.
    // If HP dropped while every monster is clearly outside melee range, restore the
    // previous HP instead of allowing a phantom hit/death.
    if (hp < lastHp && nearest > ATTACK_VISUAL_RANGE) {
      const blocked = lastHp - hp
      player.hp = Math.min(getPlayerStats().maxHp, lastHp)
      if (Date.now() - lastBlockedLog > 1200) {
        lastBlockedLog = Date.now()
        window.dispatchEvent(new CustomEvent('game:log', {
          detail: { message: `Đã chặn ${blocked} sát thương ngoài tầm giao chiến.`, type: 'warning' }
        }))
      }
      window.dispatchEvent(new CustomEvent('game:character-changed'))
    }
    lastHp = Math.max(0, Number(player.hp) || 0)
  } else if (!field) {
    lastHp = Math.max(0, Number(player.hp) || 0)
  }

  requestAnimationFrame(frame)
}

requestAnimationFrame(frame)
