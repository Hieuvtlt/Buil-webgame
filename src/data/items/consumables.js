import { createItem } from './itemSchema.js'

const potionNames = {
  hp: 'Hồi Khí Đan',
  mp: 'Hồi Linh Đan',
  exp: 'Tụ Linh Đan',
  skillExp: 'Ngộ Đạo Đan',
}

const potionBaseValues = {
  hp: 100,
  mp: 60,
  exp: 100,
  skillExp: 50,
}

function createLevelledPills(type) {
  return Array.from({ length: 10 }, (_, index) => {
    const level = index + 1
    const multiplier = Math.pow(2, index)
    const name = `${potionNames[type]} Lv${level}`
    const value = potionBaseValues[type] * multiplier
    const rangeMax = level === 10 ? 200 : level * 10

    const effect = type === 'hp'
      ? { hp: value }
      : type === 'mp'
        ? { mp: value }
        : type === 'exp'
          ? { characterExp: value }
          : { skillExp: value }

    return createItem({
      id: `${type}_pill_${String(level).padStart(2, '0')}`,
      name,
      type: 'consumable',
      category: `${type}_pill`,
      level,
      potionLevel: level,
      stackable: true,
      maxStack: 99,
      price: { buy: value, sell: Math.floor(value / 2) },
      description: `Đan dược cấp ${level}, sử dụng cho nhân vật Lv${level === 10 ? '91-200' : `${level * 10 - 9}-${rangeMax}`}.`,
      effect,
    })
  })
}

const rebirthPills = Array.from({ length: 6 }, (_, index) => {
  const rebirth = index + 1
  const requiredLevel = rebirth === 1 ? 100 : Math.min(200, 100 + (rebirth - 1) * 20)
  return createItem({
    id: `rebirth_${rebirth}`,
    name: `Trùng Sinh Đan ${['I', 'II', 'III', 'IV', 'V', 'VI'][index]}`,
    type: 'consumable',
    category: 'rebirth_pill',
    level: rebirth,
    stackable: true,
    maxStack: 20,
    requirements: { level: requiredLevel },
    price: { buy: 0, sell: 0 },
    description: `Đan dược dùng để thực hiện Trùng Sinh ${rebirth}. Yêu cầu nhân vật đạt Lv${requiredLevel}.`,
    effect: { rebirth },
  })
})

export const consumables = [
  ...createLevelledPills('hp'),
  ...createLevelledPills('mp'),
  ...createLevelledPills('exp'),
  ...createLevelledPills('skillExp'),
  ...rebirthPills,
]
