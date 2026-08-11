import { SECTS, SECT_NAMES, createSkill } from './skillSchema.js'

// Kho võ kỹ dùng chung. Mỗi skill chỉ có một bản; Tán Tu được thêm vào availableFor.
// Dữ liệu chi tiết VLTK sẽ tiếp tục được nhập theo từng môn phái, mỗi phái một file.
export const skills = [
  createSkill({
    id: 'thieulam_dao_phap',
    name: 'Thiếu Lâm Đao Pháp',
    sect: 'thieuLam',
    availableFor: ['thieuLam', 'tanTu'],
    level: 1,
    weaponType: 'blade',
    manaCost: 10,
    effects: { externalAttackPercent: 100, accuracy: 10 },
    description: 'Võ kỹ ngoại công hệ Đao của Thiếu Lâm. Không chứa thuộc tính Nội công.',
  }),
  createSkill({
    id: 'vo_dang_kiem_phap',
    name: 'Võ Đang Kiếm Pháp',
    sect: 'voDang',
    availableFor: ['voDang', 'tanTu'],
    level: 1,
    weaponType: 'sword',
    manaCost: 10,
    effects: { externalAttackPercent: 100, accuracy: 12, dodge: 4 },
    description: 'Võ kỹ ngoại công hệ Kiếm của Võ Đang.',
  }),
  createSkill({
    id: 'cai_bang_chuong_phap',
    name: 'Cái Bang Chưởng Pháp',
    sect: 'caiBang',
    availableFor: ['caiBang', 'tanTu'],
    level: 1,
    weaponType: null,
    manaCost: 12,
    effects: { externalAttackPercent: 105, accuracy: 8 },
    description: 'Võ kỹ ngoại công hệ Chưởng của Cái Bang.',
  }),
  createSkill({
    id: 'nga_mi_kiem_phap',
    name: 'Nga Mi Kiếm Pháp',
    sect: 'ngaMi',
    availableFor: ['ngaMi', 'tanTu'],
    level: 1,
    weaponType: 'sword',
    manaCost: 10,
    effects: { externalAttackPercent: 95, accuracy: 15, dodge: 5 },
    description: 'Võ kỹ ngoại công hệ Kiếm của Nga Mi.',
  }),
]

export const skillById = new Map(skills.map((skill) => [skill.id, skill]))
export { SECTS, SECT_NAMES }

export function getSkillById(id) {
  return skillById.get(id) ?? null
}

export function getSkillsForSect(sect) {
  return skills.filter((skill) => skill.availableFor.includes(sect))
}
