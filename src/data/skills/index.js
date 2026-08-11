import { SECTS, SECT_NAMES } from './skillSchema.js'
import { thieuLamSkills } from './thieuLam.js'
import { voDangSkills } from './voDang.js'
import { caiBangSkills } from './caiBang.js'
import { ngaMiSkills } from './ngaMi.js'

// Mỗi môn phái là một file riêng. Tán Tu không có skill riêng;
// Tán Tu dùng availableFor của skill môn phái khác.
export const skills = [
  ...thieuLamSkills,
  ...voDangSkills,
  ...caiBangSkills,
  ...ngaMiSkills,
]

export const skillById = new Map(skills.map((skill) => [skill.id, skill]))
export { SECTS, SECT_NAMES }

export function getSkillById(id) {
  return skillById.get(id) ?? null
}

export function getSkillsForSect(sect) {
  return skills.filter((skill) => skill.availableFor.includes(sect))
}
