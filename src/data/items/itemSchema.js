// Chuẩn dữ liệu Item dùng chung cho toàn bộ game.
// Các file item cụ thể chỉ cần tạo object theo cấu trúc này.

export function createItem(data) {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    category: data.category ?? null,
    level: data.level ?? 1,
    quality: data.quality ?? 'normal',
    icon: data.icon ?? null,
    stackable: data.stackable ?? false,
    maxStack: data.maxStack ?? 1,
    requirements: {
      level: data.requirements?.level ?? 1,
      strength: data.requirements?.strength ?? 0,
      dexterity: data.requirements?.dexterity ?? 0,
    },
    stats: {
      attackMin: data.stats?.attackMin ?? 0,
      attackMax: data.stats?.attackMax ?? 0,
      defense: data.stats?.defense ?? 0,
      strength: data.stats?.strength ?? 0,
      dexterity: data.stats?.dexterity ?? 0,
      vitality: data.stats?.vitality ?? 0,
      energy: data.stats?.energy ?? 0,
      accuracy: data.stats?.accuracy ?? 0,
      dodge: data.stats?.dodge ?? 0,
    },
    price: {
      buy: data.price?.buy ?? 0,
      sell: data.price?.sell ?? 0,
    },
    description: data.description ?? '',
  }
}
