import { createItem } from './itemSchema.js'
import { skills } from '../skills/index.js'

export const attributeBooks = [
  createItem({
    id: 'tay_tuy_kinh',
    name: 'Tẩy Tủy Kinh',
    type: 'manual',
    category: 'attribute_book',
    stackable: true,
    maxStack: 99,
    description: 'Sử dụng không giới hạn. Nhận +5 điểm thuộc tính tự do.',
    effect: { attributePoints: 5, unlimitedUse: true },
  }),
  createItem({
    id: 'vo_lam_mat_tich',
    name: 'Võ Lâm Mật Tịch',
    type: 'manual',
    category: 'attribute_book',
    stackable: true,
    maxStack: 99,
    description: 'Vật phẩm cao cấp hơn Tẩy Tủy Kinh. Sử dụng không giới hạn, nhận +10 điểm thuộc tính tự do.',
    effect: { attributePoints: 10, unlimitedUse: true },
  }),
]

export const skillManuals = skills.map((skill) => createItem({
  id: `manual_${skill.id}`,
  name: `Bí Kíp ${skill.name}`,
  type: 'manual',
  category: 'skill_manual',
  stackable: true,
  maxStack: 20,
  requirements: { level: skill.requirements.characterLevel },
  description: `Bí kíp mở khóa ${skill.name}. Có thể sử dụng bởi ${skill.sect === 'tanTu' ? 'Tán Tu' : 'môn phái gốc và Tán Tu'}.`,
  effect: {
    unlockSkill: skill.id,
    allowedSects: skill.availableFor,
  },
}))

const recipeIcon = 'data:image/png;base64,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'

export const recipeItems = [
  createItem({
    id: 'dan_phuong',
    name: 'Đan phương',
    type: 'manual',
    category: 'alchemy_recipe',
    icon: recipeIcon,
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
    icon: recipeIcon,
    stackable: true,
    maxStack: 99,
    description: 'Bản vẽ dùng để học và mở công thức Luyện Khí.',
    effect: { recipeType: 'forging', unlockRecipe: true },
  }),
]

export const manuals = [...attributeBooks, ...skillManuals, ...recipeItems]
