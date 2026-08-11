import { createItem } from './itemSchema.js'

const ores = [
  ['sat', 'Quặng Sắt', 1],
  ['dong', 'Quặng Đồng', 2],
  ['bac', 'Quặng Bạc', 3],
  ['vang', 'Quặng Vàng', 4],
  ['tinh_thiet', 'Tinh Thiết', 5],
  ['huyen_thiet', 'Huyền Thiết', 6],
  ['tinh_dong', 'Tinh Đồng', 5],
  ['tinh_ngan', 'Tinh Ngân', 7],
  ['tinh_kim', 'Tinh Kim', 8],
]

const alloys = [
  ['hop_kim_sat', 'Hợp Kim Sắt', 3],
  ['hop_kim_dong', 'Hợp Kim Đồng', 4],
  ['hop_kim_bac', 'Hợp Kim Bạc', 5],
  ['hop_kim_vang', 'Hợp Kim Vàng', 6],
  ['huyen_thiet_hop_kim', 'Huyền Thiết Hợp Kim', 8],
  ['thien_ngoai_hop_kim', 'Thiên Ngoại Hợp Kim', 10],
]

function makeMaterials(list, prefix, category) {
  return list.map(([id, name, level], index) => createItem({
    id: `${prefix}_${id}`,
    name,
    type: 'material',
    category,
    level,
    stackable: true,
    maxStack: 999,
    price: { buy: 0, sell: (index + 1) * 50 },
    description: `Nguyên liệu Luyện Khí cấp ${level}.`,
  }))
}

export const forgingMaterials = [
  ...makeMaterials(ores, 'ore', 'forging_ore'),
  ...makeMaterials(alloys, 'alloy', 'forging_alloy'),
]
