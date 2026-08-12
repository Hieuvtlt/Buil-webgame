import { createItem } from './itemSchema.js'

// Chỉ tạo vũ khí tương ứng với các thư mục icon người dùng đã chuẩn bị.
// Không còn Kiếm/Đao/Côn/Thương Tân Thủ mẫu.

const TIERS = [
  { label: 'Hoàng cấp', level: 1 },
  { label: 'Huyền cấp', level: 31 },
  { label: 'Địa cấp', level: 61 },
  { label: 'Thiên cấp', level: 91 },
]

const WEAPONS = [
  ['sword', 'Kiếm', 5, 8],
  ['blade', 'Đao', 6, 9],
  ['staff', 'Côn', 4, 10],
  ['spear', 'Thương', 7, 9],
]

let nextId = 10001
const weapons = []

for (const tier of TIERS) {
  for (const [category, name, attackMin, attackMax] of WEAPONS) {
    weapons.push(createItem({
      id: nextId++, name: `${name} ${tier.label}`, type: 'weapon', category,
      level: tier.level, stackable: false,
      requirements: { level: tier.level },
      stats: { attackMin, attackMax },
      description: `${name} ${tier.label}.`,
    }))
  }
}

export { weapons }
