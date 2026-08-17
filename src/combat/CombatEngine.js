import { player, getPlayerStats, gainExperience, syncDerivedStats } from '../data/character.js'
import { getSkillById } from '../data/skills/index.js'
import { getItemById } from '../data/items/index.js'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const ENEMY_POOLS = [
  { min: 1, max: 15, names: ['Sơn Lang', 'Hắc Miêu', 'Dã Hầu'], color: 'forest' },
  { min: 16, max: 30, names: ['Thanh Xà', 'Sơn Tặc', 'Hắc Hùng'], color: 'jade' },
  { min: 31, max: 60, names: ['Băng Lang', 'Tuyết Hầu', 'Huyết Ảnh'], color: 'ice' },
  { min: 61, max: 90, names: ['Đạo Tặc', 'Cơ Quan Nhân', 'Thiết Giáp'], color: 'steel' },
  { min: 91, max: 120, names: ['Độc Ngạc', 'Độc Nhân', 'Mộc Yêu'], color: 'poison' },
  { min: 121, max: 150, names: ['Huyết Lang', 'U Minh Quỷ', 'Thạch Vệ'], color: 'blood' },
  { min: 151, max: 180, names: ['Sa Hạt', 'Huyết Ưng', 'Tinh Thạch Quỷ'], color: 'crystal' },
  { min: 181, max: 200, names: ['Thiên Sơn Tuyết Lang', 'Côn Lôn Hộ Vệ', 'Vạn Độc Yêu'], color: 'mythic' },
]

function poolForLevel(level) {
  return ENEMY_POOLS.find(pool => level >= pool.min && level <= pool.max) ?? ENEMY_POOLS[ENEMY_POOLS.length - 1]
}

function ensureLoadout() {
  if (!player.combatLoadout) player.combatLoadout = { attack: [null, null], buff: [null, null, null], hpPotion: null, mpPotion: null }
  player.combatLoadout.attack = [...(player.combatLoadout.attack ?? []), null, null].slice(0, 2)
  player.combatLoadout.buff = [...(player.combatLoadout.buff ?? []), null, null, null].slice(0, 3)
  if (!Object.prototype.hasOwnProperty.call(player.combatLoadout, 'hpPotion')) player.combatLoadout.hpPotion = null
  if (!Object.prototype.hasOwnProperty.call(player.combatLoadout, 'mpPotion')) player.combatLoadout.mpPotion = null
  return player.combatLoadout
}

function skillType(skill) {
  if (!skill) return null
  if (skill.effects?.combatType === 'buff' || skill.effects?.buff || skill.effects?.buffs || skill.effects?.duration) return 'buff'
  return 'attack'
}

function inventoryItem(id) {
  return getItemById(id)
}

function firstPotion(type) {
  return player.inventory.map(id => inventoryItem(id)).find(item => item?.type === 'consumable' && item?.effect?.[type] > 0) ?? null
}

export class CombatEngine {
  constructor(map, callbacks = {}) {
    this.map = map
    this.onChange = callbacks.onChange ?? (() => {})
    this.onLog = callbacks.onLog ?? (() => {})
    this.onEnd = callbacks.onEnd ?? (() => {})
    this.wave = 1
    this.kills = 0
    this.totalKills = 0
    this.selectedEnemyId = null
    this.autoAttack = true
    this.autoSettings = { enabled: true, hpThreshold: 50, mpThreshold: 30, autoBuff: false, autoSkill: false, autoLoot: true }
    this.enemies = []
    this.running = true
    this.lastPlayerActionAt = 0
    this.lastBuffAt = 0
    this.lastPotionAt = 0
    this.buffs = {}
    this.loot = []
    this.tickTimer = window.setInterval(() => this.tick(), 180)
    ensureLoadout()
    syncDerivedStats()
    player.hp = Math.min(player.maxHp, Math.max(1, player.hp || player.maxHp))
    player.mp = Math.min(player.maxMp, Math.max(0, player.mp || player.maxMp))
    this.spawnWave()
  }

  get playerStats() { return getPlayerStats() }

  get equippedAttackSkills() {
    return ensureLoadout().attack.map(id => getSkillById(id)).map(skill => skill && Number(player.skills?.[skill.id] ?? 0) > 0 ? skill : null)
  }

  get equippedBuffSkills() {
    return ensureLoadout().buff.map(id => getSkillById(id)).map(skill => skill && Number(player.skills?.[skill.id] ?? 0) > 0 ? skill : null)
  }

  get potionSlots() {
    const loadout = ensureLoadout()
    const hp = loadout.hpPotion ? inventoryItem(loadout.hpPotion) : firstPotion('hp')
    const mp = loadout.mpPotion ? inventoryItem(loadout.mpPotion) : firstPotion('mp')
    return { hp: hp ?? null, mp: mp ?? null }
  }

  spawnWave() {
    const pool = poolForLevel(Math.max(this.map.levelMin, Math.min(player.level, this.map.levelMax)))
    const baseLevel = clamp(Math.round((this.map.levelMin + this.map.levelMax) / 2), 1, 200)
    const count = Math.min(6, 3 + Math.floor((this.wave - 1) / 2))
    this.enemies = Array.from({ length: count }, (_, index) => {
      const level = clamp(baseLevel + randomInt(-2, 2) + Math.min(this.wave - 1, 5), this.map.levelMin, this.map.levelMax)
      const name = pool.names[index % pool.names.length]
      const maxHp = Math.round(75 + level * 18 + this.wave * 22)
      return { id: `${this.wave}-${index}-${Date.now()}`, name, level, color: pool.color, maxHp, hp: maxHp, attackMin: Math.round(5 + level * 1.35 + this.wave * 1.5), attackMax: Math.round(9 + level * 1.75 + this.wave * 2), defense: Math.round(3 + level * 0.7), accuracy: 70 + level * 0.35, dodge: 3 + level * 0.12, dead: false }
    })
    this.selectedEnemyId = this.enemies[0]?.id ?? null
    this.onLog(`Wave ${this.wave}: ${count} ${pool.names[0]} xuất hiện.`, 'combat')
    this.onChange()
  }

  selectEnemy(id) {
    if (this.enemies.some(enemy => enemy.id === id && !enemy.dead)) {
      this.selectedEnemyId = id
      this.onChange()
    }
  }

  toggleAutoAttack() {
    this.autoSettings.enabled = !this.autoSettings.enabled
    this.autoAttack = this.autoSettings.enabled
    this.onLog(`AUTO: ${this.autoSettings.enabled ? 'BẬT' : 'TẮT'}.`, 'combat')
    this.onChange()
  }

  setAutoOption(key, value) {
    if (key === 'hpThreshold' || key === 'mpThreshold') this.autoSettings[key] = clamp(Number(value), 10, 90)
    else this.autoSettings[key] = Boolean(value)
    this.autoAttack = this.autoSettings.enabled
    this.onChange()
  }

  basicAttack(targetId = this.selectedEnemyId) {
    const target = this.enemies.find(enemy => enemy.id === targetId && !enemy.dead)
    if (!target || !this.running) return false
    const stats = this.playerStats
    const hitChance = clamp(88 + stats.accuracy - target.dodge, 55, 98)
    if (Math.random() * 100 > hitChance) { this.onLog(`Bạn đánh hụt ${target.name}.`, 'combat'); return false }
    let damage = randomInt(stats.attackMin, Math.max(stats.attackMin, stats.attackMax))
    const critical = Math.random() < clamp(5 + stats.dexterity * 0.12, 5, 25) / 100
    if (critical) damage = Math.round(damage * 1.6)
    damage = Math.max(1, Math.round(damage - target.defense * 0.35))
    target.hp = Math.max(0, target.hp - damage)
    this.onLog(`${critical ? 'Bạo kích! ' : ''}${target.name} nhận ${damage} sát thương.`, critical ? 'crit' : 'combat')
    if (target.hp <= 0) this.killEnemy(target)
    this.lastPlayerActionAt = Date.now()
    this.onChange()
    return true
  }

  useSkill(skillId, targetId = this.selectedEnemyId) {
    const target = this.enemies.find(enemy => enemy.id === targetId && !enemy.dead)
    const skill = getSkillById(skillId)
    const trainingLevel = Number(player.skills?.[skillId] ?? 0)
    if (!skill || trainingLevel <= 0 || !this.running || skillType(skill) !== 'attack' || !target) return false
    const cost = Number(skill.manaCost ?? 0)
    if (player.mp < cost) { this.onLog(`Không đủ MP để dùng ${skill.name}.`, 'danger'); return false }
    player.mp -= cost
    const stats = this.playerStats
    const percent = Number(skill.effects?.externalAttackPercent ?? 100) / 100
    const trainingBonus = 1 + Math.max(0, trainingLevel - 1) * 0.04
    let damage = Math.round(randomInt(stats.attackMin, Math.max(stats.attackMin, stats.attackMax)) * percent * trainingBonus)
    damage = Math.max(1, Math.round(damage - target.defense * 0.2))
    target.hp = Math.max(0, target.hp - damage)
    this.onLog(`${skill.name}: ${damage} sát thương lên ${target.name}.`, 'skill')
    if (target.hp <= 0) this.killEnemy(target)
    this.lastPlayerActionAt = Date.now()
    this.onChange()
    return true
  }

  useBuff(skillId) {
    const skill = getSkillById(skillId)
    const trainingLevel = Number(player.skills?.[skillId] ?? 0)
    if (!skill || trainingLevel <= 0 || !this.running || skillType(skill) !== 'buff') return false
    const cost = Number(skill.manaCost ?? 0)
    if (player.mp < cost) { this.onLog(`Không đủ MP để dùng ${skill.name}.`, 'danger'); return false }
    player.mp -= cost
    const duration = Number(skill.effects?.duration ?? 10000)
    this.buffs[skill.id] = Date.now() + duration
    this.lastBuffAt = Date.now()
    this.onLog(`${skill.name}: buff trong ${Math.round(duration / 1000)} giây.`, 'buff')
    this.onChange()
    return true
  }

  usePotion(type, itemId = null) {
    const potion = itemId ? inventoryItem(itemId) : this.potionSlots[type]
    if (!potion || potion.type !== 'consumable' || !potion.effect?.[type]) return false
    const index = player.inventory.findIndex(id => Number(id) === Number(potion.id))
    if (index < 0) return false
    if (type === 'hp' && player.hp >= player.maxHp) return false
    if (type === 'mp' && player.mp >= player.maxMp) return false
    const amount = Number(potion.effect[type])
    if (type === 'hp') player.hp = Math.min(player.maxHp, player.hp + amount)
    else player.mp = Math.min(player.maxMp, player.mp + amount)
    player.inventory.splice(index, 1)
    this.lastPotionAt = Date.now()
    this.onLog(`Dùng ${potion.name}: +${amount} ${type.toUpperCase()}.`, 'potion')
    this.onChange()
    return true
  }

  collectLoot() {
    if (!this.loot.length) return false
    const count = this.loot.length
    this.loot = []
    this.onLog(`Nhặt ${count} phần chiến lợi phẩm.`, 'reward')
    this.onChange()
    return true
  }

  killEnemy(enemy) {
    if (enemy.dead) return
    enemy.dead = true
    enemy.hp = 0
    this.kills += 1
    this.totalKills += 1
    const exp = Math.round(20 + enemy.level * 4)
    const gold = Math.round(8 + enemy.level * 3)
    gainExperience(exp)
    player.gold += gold
    this.loot.push({ enemy: enemy.name, gold })
    this.onLog(`Hạ ${enemy.name} Lv.${enemy.level}: +${exp} EXP, +${gold} vàng.`, 'reward')
    if (this.autoSettings.autoLoot) this.collectLoot()
    const next = this.enemies.find(item => !item.dead)
    this.selectedEnemyId = next?.id ?? null
    if (!next) {
      this.wave += 1
      this.onLog(`Hoàn thành Wave ${this.wave - 1}. Chuẩn bị Wave ${this.wave}.`, 'victory')
      window.setTimeout(() => this.running && this.spawnWave(), 650)
    }
  }

  autoRoutine(now) {
    const hpPct = player.maxHp ? player.hp / player.maxHp * 100 : 100
    const mpPct = player.maxMp ? player.mp / player.maxMp * 100 : 100
    if (now - this.lastPotionAt > 700) {
      if (hpPct <= this.autoSettings.hpThreshold && this.potionSlots.hp) { if (this.usePotion('hp')) return true }
      if (mpPct <= this.autoSettings.mpThreshold && this.potionSlots.mp) { if (this.usePotion('mp')) return true }
    }
    if (this.autoSettings.autoBuff && now - this.lastBuffAt > 1000) {
      const buff = this.equippedBuffSkills.find(skill => !this.buffs[skill.id] || this.buffs[skill.id] <= now)
      if (buff && this.useBuff(buff.id)) return true
    }
    if (this.autoSettings.autoSkill && now - this.lastPlayerActionAt >= 1000) {
      const skill = this.equippedAttackSkills.find(Boolean)
      if (skill && this.useSkill(skill.id)) return true
    }
    return false
  }

  tick() {
    if (!this.running) return
    const now = Date.now()
    const stats = this.playerStats
    for (const enemy of this.enemies) {
      if (enemy.dead) continue
      enemy.attackCooldown = (enemy.attackCooldown ?? Math.random() * 700) - 180
      if (enemy.attackCooldown <= 0) {
        enemy.attackCooldown = 900 + Math.random() * 400
        const hitChance = clamp(75 + enemy.accuracy - stats.dodge, 35, 92)
        if (Math.random() * 100 <= hitChance) {
          const damage = Math.max(1, Math.round(randomInt(enemy.attackMin, enemy.attackMax) - stats.defense * 0.32))
          player.hp = Math.max(0, player.hp - damage)
          this.onLog(`${enemy.name} đánh bạn ${damage} sát thương.`, 'danger')
          if (player.hp <= 0) { this.end('defeat'); return }
        } else this.onLog(`${enemy.name} đánh hụt.`, 'combat')
      }
    }
    if (this.autoSettings.enabled) {
      if (!this.autoRoutine(now) && now - this.lastPlayerActionAt >= 850) this.basicAttack()
    }
    this.onChange()
  }

  end(result) {
    if (!this.running) return
    this.running = false
    window.clearInterval(this.tickTimer)
    if (result === 'defeat') {
      player.hp = Math.max(1, Math.round(player.maxHp * 0.25))
      player.mp = Math.max(0, Math.round(player.maxMp * 0.25))
      this.onLog('Bạn đã bại trận. Hồi phục 25% HP/MP và rời chiến trường.', 'danger')
    }
    syncDerivedStats()
    this.onChange()
    this.onEnd(result)
  }

  stop() { this.running = false; window.clearInterval(this.tickTimer) }

  snapshot() {
    const stats = this.playerStats
    const loadout = ensureLoadout()
    return {
      map: this.map, wave: this.wave, kills: this.kills, totalKills: this.totalKills, autoAttack: this.autoSettings.enabled, autoSettings: { ...this.autoSettings }, running: this.running,
      player: { hp: player.hp, maxHp: stats.maxHp, mp: player.mp, maxMp: stats.maxMp }, enemies: this.enemies.map(enemy => ({ ...enemy })), selectedEnemyId: this.selectedEnemyId,
      attackSkills: loadout.attack.map(id => getSkillById(id)).map(skill => skill && Number(player.skills?.[skill.id] ?? 0) > 0 ? skill : null),
      buffSkills: loadout.buff.map(id => getSkillById(id)).map(skill => skill && Number(player.skills?.[skill.id] ?? 0) > 0 ? skill : null),
      potions: this.potionSlots,
      lootCount: this.loot.length,
      buffs: { ...this.buffs },
    }
  }
}
