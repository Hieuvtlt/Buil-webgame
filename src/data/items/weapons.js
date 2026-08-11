import { createItem } from './itemSchema.js'

// Bộ vũ khí mẫu đầu tiên.
// Đây là dữ liệu khung để phát triển tiếp, không phải danh sách item VLTK hoàn chỉnh.

export const weapons = [
  createItem({
    id: 10001,
    name: 'Kiếm Tân Thủ',
    type: 'weapon',
    category: 'sword',
    level: 1,
    quality: 'normal',
    stackable: false,
    requirements: { level: 1 },
    stats: { attackMin: 5, attackMax: 8, accuracy: 2 },
    price: { buy: 100, sell: 50 },
    description: 'Vũ khí cơ bản dành cho nhân vật mới bắt đầu hành trình.',
  }),
  createItem({
    id: 10002,
    name: 'Đao Tân Thủ',
    type: 'weapon',
    category: 'blade',
    level: 1,
    quality: 'normal',
    stackable: false,
    requirements: { level: 1 },
    stats: { attackMin: 6, attackMax: 9 },
    price: { buy: 110, sell: 55 },
    description: 'Một thanh đao đơn giản, phù hợp cho người mới luyện võ.',
  }),
  createItem({
    id: 10003,
    name: 'Côn Tân Thủ',
    type: 'weapon',
    category: 'staff',
    level: 1,
    quality: 'normal',
    stackable: false,
    requirements: { level: 1 },
    stats: { attackMin: 4, attackMax: 10, defense: 1 },
    price: { buy: 105, sell: 52 },
    description: 'Một cây côn gỗ chắc chắn dành cho người mới.',
  }),
  createItem({
    id: 10004,
    name: 'Thương Tân Thủ',
    type: 'weapon',
    category: 'spear',
    level: 1,
    quality: 'normal',
    stackable: false,
    requirements: { level: 1 },
    stats: { attackMin: 7, attackMax: 9, accuracy: 1 },
    price: { buy: 120, sell: 60 },
    description: 'Một cây thương cơ bản có tầm đánh tốt.',
  }),
]
