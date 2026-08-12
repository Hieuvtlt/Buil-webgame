import { getItemById } from '../../data/items/index.js'

const STAT_LABELS = {
  attackMin: 'Ngoại công thấp',
  attackMax: 'Ngoại công cao',
  defense: 'Ngoại phòng',
  strength: 'Sức mạnh',
  dexterity: 'Thân pháp',
  vitality: 'Sinh khí',
  energy: 'Nội lực',
  accuracy: 'Chính xác',
  dodge: 'Né tránh',
  hp: 'HP',
  mp: 'MP',
  externalAttack: 'Ngoại công cộng thêm',
  poisonResist: 'Kháng độc',
  fireResist: 'Kháng hỏa',
  iceResist: 'Kháng băng',
  lightningResist: 'Kháng lôi',
}

const QUALITY_LABELS = {
  haPham: 'Hạ phẩm',
  trungPham: 'Trung phẩm',
  thuongPham: 'Thượng phẩm',
  cucPham: 'Cực phẩm',
}

const RESIST_KEYS = new Set(['poisonResist', 'fireResist', 'iceResist', 'lightningResist'])

function formatStat(key, value) {
  if (!value) return ''
  return `${STAT_LABELS[key] ?? key}: ${value}${RESIST_KEYS.has(key) ? '%' : ''}`
}

function getEffectText(item) {
  if (item.effect?.hp) return `Phục hồi HP ${item.effect.hp}`
  if (item.effect?.mp) return `Phục hồi MP ${item.effect.mp}`
  if (item.effect?.characterExp) return `Nhận ${item.effect.characterExp} EXP`
  if (item.effect?.skillExp) return `Nhận ${item.effect.skillExp} EXP võ kỹ`
  if (item.effect?.rebirth) return `Dùng cho Trùng Sinh ${item.effect.rebirth}`
  return ''
}

function getItemStatsText(item) {
  const statSource = item.displayedStats ?? item.stats ?? {}
  const lines = []

  Object.entries(statSource).forEach(([key, value]) => {
    const text = formatStat(key, value)
    if (text) lines.push(`<div class="item-stat-line" style="color:${item.tierMeta?.color ?? 'inherit'}">${text}</div>`)
  })

  const effectText = getEffectText(item)
  if (effectText) lines.push(`<div class="item-stat-line">${effectText}</div>`)

  return lines.length ? lines.join('') : '<div class="item-stat-line">-</div>'
}

function findItemFromSlot(slot) {
  const rawId = slot?.dataset?.itemId
  if (!rawId) return null
  const numericId = Number(rawId)
  return getItemById(Number.isNaN(numericId) ? rawId : numericId)
}

export function mountInventoryScreen() {
  const grid = document.getElementById('inventory-screen-grid')
  const icon = document.getElementById('inv-info-icon')
  const title = document.getElementById('inv-info-title')
  const meta = document.getElementById('inv-info-meta')
  const stats = document.getElementById('inv-info-stats')
  const desc = document.getElementById('inv-info-desc')
  if (!grid || !icon || !title || !meta || !stats || !desc) return

  const slots = Array.from(grid.querySelectorAll('.inv-slot2'))
  const select = (slot) => {
    slots.forEach((item) => item.classList.remove('is-selected'))
    slot.classList.add('is-selected')

    const item = findItemFromSlot(slot)
    if (!item) return

    const color = item.tierMeta?.color ?? '#00ff66'
    icon.src = item.icon || '/assets/icons/potion.svg'
    icon.alt = item.name
    icon.style.borderColor = color
    title.textContent = item.name
    title.style.color = color

    if (item.potionLevel) {
      const range = item.usableLevelRange
      meta.textContent = `Đẳng cấp yêu cầu: ${range.min}-${range.max}`
      stats.innerHTML = getEffectText(item) ? `<div class="item-stat-line">${getEffectText(item)}</div>` : '<div class="item-stat-line">-</div>'
      desc.textContent = item.description || '-'
      return
    }

    if (item.tierMeta) {
      const quality = item.quality ? ` - ${QUALITY_LABELS[item.quality] ?? item.quality}` : ''
      meta.textContent = `${item.tierMeta.label}${quality} | Đẳng cấp yêu cầu: ${item.requirements.level}`
    } else {
      meta.textContent = `Loại: ${item.type} | Đẳng cấp yêu cầu: ${item.requirements?.level ?? item.level ?? '-'}`
    }

    stats.innerHTML = getItemStatsText(item)
    desc.textContent = ''
  }

  slots.forEach((slot) => slot.addEventListener('click', () => select(slot)))
  const firstItem = slots.find((slot) => slot.dataset.itemId)
  if (firstItem) select(firstItem)
}
