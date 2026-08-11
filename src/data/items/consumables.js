import { createItem } from './itemSchema.js'

export const consumables = [
  {
    ...createItem({
      id: 30001,
      name: 'Tiểu Huyết Dược',
      type: 'consumable',
      category: 'hp_potion',
      level: 1,
      quality: 'normal',
      stackable: true,
      maxStack: 99,
      price: { buy: 20, sell: 10 },
      description: 'Hồi một lượng HP khi sử dụng.',
    }),
    effect: { hp: 50 },
  },
  {
    ...createItem({
      id: 30002,
      name: 'Tiểu Nội Lực Dược',
      type: 'consumable',
      category: 'mp_potion',
      level: 1,
      quality: 'normal',
      stackable: true,
      maxStack: 99,
      price: { buy: 20, sell: 10 },
      description: 'Hồi một lượng MP khi sử dụng.',
    }),
    effect: { mp: 30 },
  },
]
