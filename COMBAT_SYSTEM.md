# HỆ THỐNG COMBAT V1

## Mục tiêu

Map trong Ngoại cảnh không còn chỉ là màn xem ảnh. Khi người chơi đủ cấp và bấm **TIẾN VÀO**, game chuyển sang một chiến trường thời gian thực dùng chung cho toàn bộ 17 map.

## Luồng

`Ngoại cảnh → chọn map → TIẾN VÀO → Chiến đấu → Wave → hạ quái → EXP + Vàng → Wave tiếp theo`

## Cơ chế V1

- Combat real-time, tick 180ms.
- Mỗi wave sinh 3–8 quái tùy wave.
- Quái tự áp sát và đánh khi vào khoảng cách.
- Người chơi có thể chọn mục tiêu và đánh cơ bản.
- **TỰ ĐỘNG ĐÁNH** mặc định bật, chu kỳ khoảng 850ms.
- Có thanh HP/MP, chỉ số Công/Thủ/Chính xác/Né.
- Bạo kích dựa trên Dexterity.
- Công thức sát thương có Defense của mục tiêu.
- Skill đã học trong `player.skills` tự xuất hiện trên thanh kỹ năng; MP và `externalAttackPercent` được xử lý trực tiếp.
- Hạ quái nhận EXP và Vàng.
- Hết wave tự sinh wave tiếp theo.
- Khi HP về 0: thất bại, hồi 25% HP/MP và rời chiến trường.

## Tích hợp map

`NgoaiCanhScreen` phát event `game:combat-start` với dữ liệu map. `main.js` mở màn `Chiến đấu` và `CombatScreen` tạo `CombatEngine` cho map đó.

Mỗi map dùng `levelMin/levelMax` hiện có trong `src/data/worldMaps.js` để scale cấp quái và sức mạnh chiến trường. Không tạo bộ map chiến đấu riêng.

## Cấu trúc code

- `src/combat/CombatEngine.js` — state, spawn, AI, hit, damage, skill, reward, wave.
- `src/combat/CombatScreen.js` — giao diện chiến trường và input.
- `src/combat/CombatScreen.css` — giao diện combat.
- `src/combat/combatSession.js` — map/engine hiện tại giữa Explorer và Combat.

## Nguyên tắc mở rộng

- Không đưa logic damage vào UI.
- Không hard-code map riêng trong combat; dùng data map hiện tại.
- Skill mới thêm vào data skill hiện tại, CombatEngine chỉ đọc schema.
- Enemy/boss nâng cấp sau có thể tách thành data riêng mà không đổi flow `CombatScreen`.
- Quest, loot, drop, boss, trạng thái bất lợi và PvP có thể hook vào event/log của engine ở các phiên bản sau.
