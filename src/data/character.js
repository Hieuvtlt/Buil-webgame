// Dữ liệu nhân vật trung tâm của game.
// Level nhân vật: 1-200. Mỗi lần lên cấp nhận 5 điểm tự do.

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
  name: 'Nhân vật',
  level: 1,
  exp: 0,
  expToNextLevel: 100,
  rebirth: 0,
  freePoints: 0,
  attributes: { ...INITIAL_ATTRIBUTE_POINTS },
  permanentRebirthPoints: 0,
  skills: {},
  sect: 'tanTu',
  hp: 100,
  maxHp: 100,
  mp: 100,
  maxMp: 100,
  gold: 0,
  spiritStone: 0,
}

export function getMaxSkillLevel() {
  return 10 + player.rebirth * 10
}

export function getPlayerStats() {
  const { strength, dexterity, vitality, energy } = player.attributes
  return {
    strength,
    dexterity,
    vitality,
    energy,
    maxHp: 100 + vitality * 20,
    maxMp: 100 + energy * 10,
    attackMin: 10 + strength * 2,
    attackMax: 15 + strength * 3,
    defense: 5 + dexterity,
    accuracy: 10 + dexterity * 2,
    dodge: 5 + dexterity,
  }
}

export function addFreeAttributePoints(attribute, amount = 1) {
  const valid = ['strength', 'dexterity', 'vitality', 'energy']
  if (!valid.includes(attribute) || amount < 1 || player.freePoints < amount) return false
  player.attributes[attribute] += amount
  player.freePoints -= amount
  syncDerivedStats()
  return true
}

export function syncDerivedStats() {
  const stats = getPlayerStats()
  player.maxHp = stats.maxHp
  player.maxMp = stats.maxMp
  player.hp = Math.min(player.hp, player.maxHp)
  player.mp = Math.min(player.mp, player.maxMp)
}

export function gainLevel() {
  if (player.level >= MAX_CHARACTER_LEVEL) return false
  player.level += 1
  player.freePoints += POINTS_PER_LEVEL
  player.exp = 0
  player.expToNextLevel = Math.round(100 * Math.pow(1.08, player.level - 1))
  return true
}

export function gainAttributePoints(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return false
  player.freePoints += Math.floor(amount)
  return true
}

export function useAttributeBook(points) {
  return gainAttributePoints(points)
}
