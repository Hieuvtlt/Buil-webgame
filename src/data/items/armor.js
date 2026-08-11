import { createItem } from './itemSchema.js'

// Khung dữ liệu trang bị phòng thủ.

export const armors = [
  createItem({
    id: 20001,
    name: 'Mũ Vải Tân Thủ',
    type: 'armor',
    category: 'helmet',
    level: 1,
    quality: 'normal',
    requirements: { level: 1 },
    stats: { defense: 2 },
    price: { buy: 60, sell: 30 },
    description: 'Mũ vải đơn giản giúp bảo vệ đầu.',
  }),
  createItem({
    id: 20002,
    name: 'Áo Vải Tân Thủ',
    type: 'armor',
    category: 'body',
    level: 1,
    quality: 'normal',
    requirements: { level: 1 },
    stats: { defense: 5 },
    price: { buy: 100, sell: 50 },
    description: 'Áo vải cơ bản dành cho người mới.',
  }),
  createItem({
    id: 20003,
    name: 'Giày Vải Tân Thủ',
    type: 'armor',
    category: 'boots',
    level: 1,
    quality: 'normal',
    requirements: { level: 1 },
    stats: { defense: 2, dodge: 1 },
    price: { buy: 70, sell: 35 },
    description: 'Đôi giày nhẹ, giúp di chuyển linh hoạt hơn.',
  }),
]
