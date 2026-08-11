import { SECTS, SECT_NAMES } from './skillSchema.js'
import { thienVuongSkills } from './thienVuong.js'
import { thieuLamSkills } from './thieuLam.js'
import { voDangSkills } from './voDang.js'
import { ngaMiSkills } from './ngaMi.js'
import { duongMonSkills } from './duongMon.js'
import { nguDocSkills } from './nguDoc.js'
import { caiBangSkills } from './caiBang.js'
import { hoaSonSkills } from './hoaSon.js'
import { conLonSkills } from './conLon.js'
import { thienNhanSkills } from './thienNhan.js'
import { tieuDaoSkills } from './tieuDao.js'
import { tanTuSkills } from './tanTu.js'

export const skills = [
  ...thienVuongSkills,
  ...thieuLamSkills,
  ...voDangSkills,
  ...ngaMiSkills,
  ...duongMonSkills,
  ...nguDocSkills,
  ...caiBangSkills,
  ...hoaSonSkills,
  ...conLonSkills,
  ...thienNhanSkills,
  ...tieuDaoSkills,
  ...tanTuSkills,
]

export const skillById = new Map(skills.map((skill) => [skill.id, skill]))
export { SECTS, SECT_NAMES }

export function getSkillById(id) {
  return skillById.get(id) ?? null
}

export function getSkillsForSect(sect) {
  return skills.filter((skill) => skill.availableFor.includes(sect))
}
