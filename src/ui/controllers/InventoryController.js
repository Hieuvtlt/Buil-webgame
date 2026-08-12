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
  externalAttack: 'Ngoại công %',
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
  const lines = []

  if (item.tierMeta) {
    lines.push(`${item.tierMeta.label} • ${item.quality ?? 'phẩm chất chưa xác định'}`)
  }

  Object.entries(item.stats ?? {}).forEach(([key, value]) => {
    if (value) lines.push(`${STAT_LABELS[key] ?? key}: ${value}`)
  })

  const effectText = getEffectText(item)
  if (effectText) lines.push(effectText)

  return lines.length ? lines.join(' • ') : '-'
}

function findItemFromSlot(slot) {
  // data-* attributes are always strings, while the item Map uses numeric IDs.
  // Convert numeric IDs back before lookup so clicking an item always opens its data.
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
    icon.src = item.icon
    icon.alt = item.name
    icon.style.borderColor = color
    title.textContent = item.name
    title.style.color = color

    if (item.potionLevel) {
      const range = item.usableLevelRange
      meta.textContent = `Đẳng cấp yêu cầu ${range.min}-${range.max}`
      stats.textContent = getEffectText(item) || '-'
      desc.textContent = item.description || '-'
      return
    }

    if (item.tierMeta) {
      meta.textContent = `${item.tierMeta.label} | Lv ${item.level}`
    } else {
      meta.textContent = `Loại: ${item.type} | Cấp: ${item.level ?? '-'}`
    }

    stats.textContent = getItemStatsText(item)
    desc.textContent = item.description || '-'
  }

  slots.forEach((slot) => slot.addEventListener('click', () => select(slot)))
  const firstItem = slots.find((slot) => slot.dataset.itemId)
  if (firstItem) select(firstItem)
}
