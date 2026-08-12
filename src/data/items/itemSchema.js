import { getVltkIcon } from '../vltkIconCatalog.js'

// Schema chung cho Item.
// Hoàng/Huyền/Địa/Thiên chỉ áp dụng cho TRANG BỊ.
// Đan dược dùng hệ cấp riêng 1-10.

export const EQUIPMENT_TIERS = {
  hoang: { minLevel: 1, maxLevel: 30, color: '#ffffff', label: 'Hoàng cấp', attributeRange: [0, 2] },
  huyen: { minLevel: 31, maxLevel: 60, color: '#4da6ff', label: 'Huyền cấp', attributeRange: [3, 5] },
  dia: { minLevel: 61, maxLevel: 90, color: '#ffd54a', label: 'Địa cấp', attributeRange: [6, 8] },
  thien: { minLevel: 91, maxLevel: 120, color: '#ff4d4d', label: 'Thiên cấp', attributeRange: [8, 10] },
}

export const QUALITY_MULTIPLIERS = {
  haPham: [0, 0.2],
  trungPham: [0.4, 0.5],
  thuongPham: [0.6, 0.8],
  cucPham: [0.8, 1.2],
}

export function getEquipmentTier(level) {
  if (level <= 30) return 'hoang'
  if (level <= 60) return 'huyen'
  if (level <= 90) return 'dia'
  return 'thien'
}

export function getEquipmentTierMeta(level) {
  return EQUIPMENT_TIERS[getEquipmentTier(level)]
}

export function getPotionLevelRange(level) {
  if (level < 1 || level > 10) throw new Error('Cấp đan dược phải từ 1 đến 10')
  if (level === 10) return { min: 100, max: 200 }
  return { min: level * 10 - 9, max: level * 10 }
}

function getDefaultIcon(data, isEquipment) {
  const vltkIcon = getVltkIcon(data)
  if (vltkIcon) return vltkIcon
  if (data.icon) return data.icon
  // Trang bị không có asset do người dùng tạo thì không được tự chèn icon mẫu.
  if (isEquipment) return null
  if (data.type === 'consumable') return '/assets/icons/potion.svg'
  if (data.type === 'material') return '/assets/icons/material.svg'
  return '/assets/icons/material.svg'
}

function roundPositive(value) {
  return Math.max(1, Math.round(value))
}

// Một số bộ trang bị hiện mới khai báo 3-4 dòng cơ bản. Bổ sung các dòng
// phù hợp để hệ thống có thể thực sự đạt đúng 6-8 dòng ở Địa cấp và 8-10 dòng ở Thiên cấp.
// Giá trị HP/MP cố ý giữ thấp để tránh phình chỉ số nhân vật.
function enrichEquipmentStats(stats, data, tier) {
  const result = { ...stats }
  const scale = { hoang: 1, huyen: 1.7, dia: 2.6, thien: 3.5 }[tier]
  const attackBase = result.attackMax || result.attackMin || 10
  const defenseBase = result.defense || 5
  const accuracyBase = result.accuracy || 4

  const extras = {
    defense: roundPositive(defenseBase * (result.defense ? 1 : 0.9)),
    dexterity: roundPositive((result.dexterity || accuracyBase / 3) * scale),
    vitality: roundPositive((result.vitality || 2) * scale),
    energy: roundPositive((result.energy || 2) * scale),
    dodge: roundPositive((result.dodge || accuracyBase / 3) * scale),
    hp: result.hp || roundPositive(35 * scale),
    mp: result.mp || roundPositive(30 * scale),
    externalAttack: result.externalAttack || roundPositive(attackBase * 0.08),
    poisonResist: result.poisonResist || 0,
    fireResist: result.fireResist || 0,
    iceResist: result.iceResist || 0,
    lightningResist: result.lightningResist || 0,
  }

  // Không thêm Kháng tất cả hoặc Tốc độ đánh.
  for (const [key, value] of Object.entries(extras)) {
    if (!result[key] && value > 0) result[key] = value
  }

  return result
}

// Số lượng thuộc tính ổn định theo ID, không thay đổi mỗi lần mở game.
function getAttributeCount(itemId, tierMeta, availableCount) {
  const [min, max] = tierMeta.attributeRange
  if (availableCount <= 0) return 0
  const span = max - min + 1
  const seed = Math.abs(Number(itemId) || 0)
  const wanted = min + (seed % span)
  return Math.min(wanted, availableCount)
}

function buildDisplayedStats(stats, itemId, tierMeta) {
  const entries = Object.entries(stats ?? {}).filter(([, value]) => Number(value) > 0)
  const count = getAttributeCount(itemId, tierMeta, entries.length)
  return Object.fromEntries(entries.slice(0, count))
}

export function createItem(data) {
  const isEquipment = data.type === 'equipment' || data.type === 'weapon' || data.type === 'armor' || data.type === 'accessory'
  const itemLevel = isEquipment ? Math.max(1, Math.min(120, data.level ?? 1)) : data.level ?? 1
  const tier = isEquipment ? getEquipmentTier(itemLevel) : null
  const tierMeta = isEquipment ? getEquipmentTierMeta(itemLevel) : null
  const potionRange = data.potionLevel ? getPotionLevelRange(data.potionLevel) : null

  let stats = {
    attackMin: data.stats?.attackMin ?? 0,
    attackMax: data.stats?.attackMax ?? 0,
    defense: data.stats?.defense ?? 0,
    strength: data.stats?.strength ?? 0,
    dexterity: data.stats?.dexterity ?? 0,
    vitality: data.stats?.vitality ?? 0,
    energy: data.stats?.energy ?? 0,
    accuracy: data.stats?.accuracy ?? 0,
    dodge: data.stats?.dodge ?? 0,
    hp: data.stats?.hp ?? 0,
    mp: data.stats?.mp ?? 0,
    externalAttack: data.stats?.externalAttack ?? 0,
    poisonResist: data.stats?.poisonResist ?? 0,
    fireResist: data.stats?.fireResist ?? 0,
    iceResist: data.stats?.iceResist ?? 0,
    lightningResist: data.stats?.lightningResist ?? 0,
  }

  if (isEquipment) stats = enrichEquipmentStats(stats, data, tier)

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    category: data.category ?? null,
    level: itemLevel,
    tier,
    tierMeta,
    attributeRange: tierMeta?.attributeRange ?? null,
    displayedStats: isEquipment ? buildDisplayedStats(stats, data.id, tierMeta) : stats,
    quality: data.quality ?? null,
    icon: getDefaultIcon(data, isEquipment),
    stackable: isEquipment ? false : (data.stackable ?? false),
    maxStack: isEquipment ? 1 : (data.type === 'consumable' ? 99 : (data.maxStack ?? 1)),
    potionLevel: data.potionLevel ?? null,
    usableLevelRange: potionRange,
    requirements: {
      level: data.requirements?.level ?? potionRange?.min ?? 1,
      strength: data.requirements?.strength ?? 0,
      dexterity: data.requirements?.dexterity ?? 0,
      vitality: data.requirements?.vitality ?? 0,
      energy: data.requirements?.energy ?? 0,
      rebirth: data.requirements?.rebirth ?? 0,
    },
    stats,
    effects: data.effects ?? [],
    effect: data.effect ?? null,
    price: {
      buy: data.price?.buy ?? 0,
      sell: data.price?.sell ?? 0,
    },
    description: data.description ?? '',
  }
}
