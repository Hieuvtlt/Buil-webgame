// Dữ liệu nhân vật trung tâm của game.
// Level nhân vật: 1-200. Mỗi lần lên cấp nhận 5 điểm tự do.

import { clampCharacterResistances } from './attributeRules.js'
import { items } from './items/index.js'

export const MAX_CHARACTER_LEVEL = 200
export const POINTS_PER_LEVEL = 5
export const REBIRTH_POINTS = 50
export const INITIAL_ATTRIBUTE_POINTS = {
  strength: 0,
  dexterity: 0,
  vitality: 0,
  energy: 0,
}

export const player = {
  name: 'Nhân vật', level: 1, exp: 0, expToNextLevel: 100, rebirth: 0, freePoints: 0,
  attributes: { ...INITIAL_ATTRIBUTE_POINTS }, permanentRebirthPoints: 0, skills: {}, sect: 'tanTu',
  hp: 100, maxHp: 100, mp: 100, maxMp: 100, gold: 0, spiritStone: 0,
  resistances: { poisonResistance: 0, fireResistance: 0, iceResistance: 0, lightningResistance: 0 },
  equipment: { weapon: null, helmet: null, armor: null, gloves: null, belt: null, boots: null, ring1: null, ring2: null, necklace: null, amulet: null },
  inventory: items.slice(0, 24).map((item) => item.id),
}

const EQUIPMENT_ATTRIBUTE_MAP = {
  strength: 'strength', dexterity: 'dexterity', vitality: 'vitality', energy: 'energy',
  accuracy: 'accuracy', dodge: 'dodge', hp: 'hp', mp: 'mp', defense: 'defense',
  attackMin: 'attackMin', attackMax: 'attackMax', externalAttack: 'externalAttack',
}
const RESISTANCE_MAP = { poisonResist: 'poisonResistance', fireResist: 'fireResistance', iceResist: 'iceResistance', lightningResist: 'lightningResistance' }

export function getMaxSkillLevel() { return 10 + player.rebirth * 10 }
function getEquippedItems() { return Object.values(player.equipment).filter(Boolean).map((id) => items.find((item) => item.id === id)).filter(Boolean) }

export function getEquipmentStats() {
  const bonuses = { attackMin: 0, attackMax: 0, defense: 0, accuracy: 0, dodge: 0, hp: 0, mp: 0, externalAttack: 0, strength: 0, dexterity: 0, vitality: 0, energy: 0, poisonResistance: 0, fireResistance: 0, iceResistance: 0, lightningResistance: 0 }
  for (const item of getEquippedItems()) {
    for (const [key, value] of Object.entries(item.stats ?? {})) {
      if (!Number.isFinite(value)) continue
      const statKey = EQUIPMENT_ATTRIBUTE_MAP[key]
      if (statKey) bonuses[statKey] += value
      const resistanceKey = RESISTANCE_MAP[key]
      if (resistanceKey) bonuses[resistanceKey] += value
    }
  }
  return bonuses
}

export function getEquippedItem(slot) {
  const id = player.equipment[slot]
  return id ? items.find((item) => item.id === id) ?? null : null
}

export function getPlayerStats() {
  const equipment = getEquipmentStats()
  const strength = player.attributes.strength + equipment.strength
  const dexterity = player.attributes.dexterity + equipment.dexterity
  const vitality = player.attributes.vitality + equipment.vitality
  const energy = player.attributes.energy + equipment.energy
  const resistances = clampCharacterResistances({ poisonResistance: player.resistances.poisonResistance + equipment.poisonResistance, fireResistance: player.resistances.fireResistance + equipment.fireResistance, iceResistance: player.resistances.iceResistance + equipment.iceResistance, lightningResistance: player.resistances.lightningResistance + equipment.lightningResistance })
  return { strength, dexterity, vitality, energy, maxHp: 100 + vitality * 20 + equipment.hp, maxMp: 100 + energy * 10 + equipment.mp, attackMin: 10 + strength * 2 + equipment.attackMin + equipment.externalAttack, attackMax: 15 + strength * 3 + equipment.attackMax + equipment.externalAttack, defense: 5 + dexterity + equipment.defense, accuracy: 10 + dexterity * 2 + equipment.accuracy, dodge: 5 + dexterity + equipment.dodge, ...resistances }
}

export function addFreeAttributePoints(attribute, amount = 1) {
  const valid = ['strength', 'dexterity', 'vitality', 'energy']
  if (!valid.includes(attribute) || amount < 1 || player.freePoints < amount) return false
  player.attributes[attribute] += amount; player.freePoints -= amount; syncDerivedStats(); return true
}
export function addCharacterResistance(attribute, amount) {
  if (!Object.prototype.hasOwnProperty.call(player.resistances, attribute) || !Number.isFinite(amount)) return false
  player.resistances[attribute] = Math.min(80, Math.max(0, player.resistances[attribute] + amount)); return true
}

const VALID_EQUIPMENT_CATEGORIES = {
  weapon: ['sword', 'blade', 'staff', 'spear'], helmet: ['helmet'], armor: ['body'], gloves: ['gauntlet'], belt: ['belt'], boots: ['boots'], ring1: ['ring'], ring2: ['ring'], necklace: ['necklace'], amulet: ['amulet'],
}

// Trang bị từ Túi đồ. Hàm này nhận cả id số hoặc id dạng chuỗi để tránh lỗi do dataset HTML.
// Với nhẫn: ưu tiên ô Nhẫn 1, nếu đã có thì tự dùng Nhẫn 2 còn trống.
export function equipItem(slot, itemId) {
  const numericId = Number(itemId)
  const item = items.find((candidate) => candidate.id === numericId)
  if (!item || !['weapon', 'armor', 'equipment', 'accessory'].includes(item.type)) return false

  let targetSlot = slot
  if (item.category === 'ring') {
    if (!targetSlot || !['ring1', 'ring2'].includes(targetSlot)) targetSlot = player.equipment.ring1 ? 'ring2' : 'ring1'
    else if (targetSlot === 'ring1' && player.equipment.ring1 && !player.equipment.ring2) targetSlot = 'ring2'
  }

  if (!VALID_EQUIPMENT_CATEGORIES[targetSlot]?.includes(item.category)) return false
  const requiredLevel = Number(item.requirements?.level ?? item.level ?? 1)
  if (requiredLevel > player.level) return false

  const inventoryIndex = player.inventory.findIndex((id) => Number(id) === numericId)
  const currentlyEquippedId = player.equipment[targetSlot]
  if (currentlyEquippedId === numericId) return true
  if (inventoryIndex < 0) return false

  if (currentlyEquippedId && currentlyEquippedId !== numericId && !player.inventory.some((id) => Number(id) === Number(currentlyEquippedId))) {
    player.inventory.push(currentlyEquippedId)
  }

  player.inventory.splice(inventoryIndex, 1)
  player.equipment[targetSlot] = numericId
  syncDerivedStats()
  return true
}

export function unequipItem(slot) {
  if (!Object.prototype.hasOwnProperty.call(player.equipment, slot)) return false
  const itemId = player.equipment[slot]
  if (!itemId) return false
  if (!player.inventory.some((id) => Number(id) === Number(itemId))) player.inventory.push(itemId)
  player.equipment[slot] = null; syncDerivedStats(); return true
}

export function syncDerivedStats() { const stats = getPlayerStats(); player.maxHp = stats.maxHp; player.maxMp = stats.maxMp; player.hp = Math.min(player.hp, player.maxHp); player.mp = Math.min(player.mp, player.maxMp) }
export function gainLevel() { if (player.level >= MAX_CHARACTER_LEVEL) return false; player.level += 1; player.freePoints += POINTS_PER_LEVEL; player.exp = 0; player.expToNextLevel = Math.round(100 * Math.pow(1.08, player.level - 1)); return true }
export function gainAttributePoints(amount) { if (!Number.isFinite(amount) || amount <= 0) return false; player.freePoints += Math.floor(amount); return true }
export function useAttributeBook(points) { return gainAttributePoints(points) }
