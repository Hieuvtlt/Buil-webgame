import { weapons } from './weapons.js'
import { armors } from './armor.js'
import { consumables } from './consumables.js'
import { materials } from './materials.js'

export const items = [
  ...weapons,
  ...armors,
  ...consumables,
  ...materials,
]

export const itemById = new Map(items.map((item) => [item.id, item]))

export function getItemById(id) {
  return itemById.get(id) ?? null
}
