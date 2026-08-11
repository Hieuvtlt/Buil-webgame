import { createItem } from './itemSchema.js'

const herbs = [
  ['linh_chi', 'Linh Chi', 1],
  ['huyet_linh_chi', 'Huyết Linh Chi', 2],
  ['tu_linh_chi', 'Tử Linh Chi', 3],
  ['ngoc_linh_chi', 'Ngọc Linh Chi', 4],
  ['thien_linh_chi', 'Thiên Linh Chi', 5],
  ['huyet_sam', 'Huyết Sâm', 2],
  ['ngoc_sam', 'Ngọc Sâm', 4],
  ['tu_sam', 'Tử Sâm', 6],
  ['thien_sam', 'Thiên Sâm', 8],
  ['long_huyet_thao', 'Long Huyết Thảo', 7],
  ['nguyet_linh_thao', 'Nguyệt Linh Thảo', 5],
  ['tu_van_thao', 'Tử Vân Thảo', 6],
  ['thanh_tam_thao', 'Thanh Tâm Thảo', 3],
  ['hoa_linh_thao', 'Hỏa Linh Thảo', 7],
  ['bang_tam_thao', 'Băng Tâm Thảo', 8],
]

export const alchemyMaterials = herbs.map(([id, name, level], index) => createItem({
  id: `herb_${id}`,
  name,
  type: 'material',
  category: 'alchemy_herb',
  level,
  stackable: true,
  maxStack: 999,
  price: { buy: 0, sell: (index + 1) * 25 },
  description: `Linh dược dùng làm nguyên liệu Luyện Đan, phẩm cấp nguyên liệu ${level}.`,
}))
