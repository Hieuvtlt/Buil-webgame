// Schema chung cho Item.
// Hoàng/Huyền/Địa/Thiên chỉ áp dụng cho TRANG BỊ.
// Đan dược dùng hệ cấp riêng 1-10.

export const EQUIPMENT_TIERS = {
  hoang: { minLevel: 1, maxLevel: 30, color: '#ffffff', label: 'Hoàng cấp' },
  huyen: { minLevel: 31, maxLevel: 60, color: '#4da6ff', label: 'Huyền cấp' },
  dia: { minLevel: 61, maxLevel: 90, color: '#ffd54a', label: 'Địa cấp' },
  thien: { minLevel: 91, maxLevel: 120, color: '#ff4d4d', label: 'Thiên cấp' },
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
  if (level === 10) return { min: 91, max: 200 }
  return { min: level * 10 - 9, max: level * 10 }
}

export function createItem(data) {
  const isEquipment = data.type === 'equipment' || data.type === 'weapon' || data.type === 'armor' || data.type === 'accessory'
  const equipmentLevel = isEquipment ? Math.max(1, Math.min(120, data.level ?? 1)) : data.level ?? 1
  const potionRange = data.potionLevel ? getPotionLevelRange(data.potionLevel) : null

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    category: data.category ?? null,
    level: equipmentLevel,
    tier: isEquipment ? getEquipmentTier(equipmentLevel) : null,
    tierMeta: isEquipment ? getEquipmentTierMeta(equipmentLevel) : null,
    quality: data.quality ?? null,
    icon: data.icon ?? null,
    stackable: data.stackable ?? false,
    maxStack: data.maxStack ?? 1,
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
    stats: {
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
    },
    effect: data.effect ?? null,
    price: {
      buy: data.price?.buy ?? 0,
      sell: data.price?.sell ?? 0,
    },
    description: data.description ?? '',
  }
}
