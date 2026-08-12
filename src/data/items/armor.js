import { createItem } from './itemSchema.js'

// Chỉ tạo trang bị tương ứng với các thư mục/icon người dùng đã chuẩn bị.
// Không còn các item mẫu "Tân Thủ" hay item tự sinh không có asset.

const TIERS = [
  { key: 'hoang', label: 'Hoàng cấp', level: 1 },
  { key: 'huyen', label: 'Huyền cấp', level: 31 },
  { key: 'dia', label: 'Địa cấp', level: 61 },
  { key: 'thien', label: 'Thiên cấp', level: 91 },
]

const SIMPLE_ARMOR = [
  ['helmet', 'Mũ', 2],
  ['gauntlet', 'Bao Tay', 3],
  ['belt', 'Đai Lưng', 3],
  ['boots', 'Giày', 2],
  ['necklace', 'Dây Chuyền', 1],
  ['amulet', 'Ngọc Bội', 1],
  ['ring', 'Nhẫn', 1],
]

const BODY_QUALITIES = [
  ['haPham', 'Hạ Phẩm'],
  ['trungPham', 'Trung Phẩm'],
  ['thuongPham', 'Thượng Phẩm'],
  ['cucPham', 'Cực Phẩm'],
]

let nextId = 20001
const armors = []

for (const tier of TIERS) {
  for (const [category, label, defense] of SIMPLE_ARMOR) {
    armors.push(createItem({
      id: nextId++, name: `${label} ${tier.label}`, type: 'armor', category,
      level: tier.level, requirements: { level: tier.level },
      stats: { defense },
      description: `${label} ${tier.label}.`,
    }))
  }

  for (const [quality, qualityLabel] of BODY_QUALITIES) {
    armors.push(createItem({
      id: nextId++, name: `Áo ${tier.label} ${qualityLabel}`, type: 'armor', category: 'body',
      level: tier.level, quality, requirements: { level: tier.level },
      stats: { defense: 5 },
      description: `Áo ${tier.label}, ${qualityLabel}.`,
    }))
  }
}

export { armors }
