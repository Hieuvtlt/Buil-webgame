import { createItem } from './itemSchema.js'

// Vật phẩm công thức dùng cho hai hệ thống chế tạo.
// Công thức chi tiết sẽ được gắn vào từng Đan phương/Bản vẽ khi recipe được tạo.
export const recipeItems = [
  createItem({
    id: 'dan_phuong',
    name: 'Đan phương',
    type: 'manual',
    category: 'alchemy_recipe',
    icon: '/assets/vltk/bikip/danphuong.png',
    stackable: true,
    maxStack: 99,
    description: 'Đan phương dùng để học và mở công thức Luyện Đan.',
    effect: { recipeType: 'alchemy', unlockRecipe: true },
  }),
  createItem({
    id: 'ban_ve',
    name: 'Bản vẽ',
    type: 'manual',
    category: 'forging_recipe',
    icon: '/assets/vltk/bikip/banve.png',
    stackable: true,
    maxStack: 99,
    description: 'Bản vẽ dùng để học và mở công thức Luyện Khí.',
    effect: { recipeType: 'forging', unlockRecipe: true },
  }),
]
