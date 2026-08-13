# Kiến trúc Game Web — Quy tắc hiện tại

> Đây là bộ quy tắc thiết kế hiện tại đã được chốt. Khi code mới mâu thuẫn với tài liệu này, ưu tiên xác nhận lại quy tắc trước khi thay đổi hệ thống.

## 1. Nhân vật

- Cấp nhân vật cố định: **Lv1–200**.
- Mỗi lần lên 1 cấp: **+5 điểm thuộc tính tự do**.
- Khi cộng điểm tự do vào **Sinh khí**: 1 điểm = **+5 HP**.
- Khi cộng điểm tự do vào **Nội lực/Mana**: 1 điểm = **+5 MP**.
- HP và MP có quy tắc/giới hạn riêng do game này quy định, không lấy nguyên công thức HP/MP của VLTK.
- Sát thương và các thuộc tính chiến đấu khác lấy VLTK làm nền theo dữ liệu/cơ chế tham khảo từ repo VLTK đã chia sẻ.
- Không có **Kháng tất cả**, **Tốc độ đánh** hoặc **kỹ năng nội công**.

## 2. Trùng sinh

- Trùng Sinh 1: **Lv100 + Trùng Sinh Đan Lv1**.
- Trùng Sinh 2: **Lv120 + Trùng Sinh Đan Lv2**.
- Các mốc tiếp theo chỉ cấu hình khi được chốt.
- Sau mỗi lần Trùng Sinh:
  - Nhân vật về **Lv1**.
  - Phần điểm thuộc tính do quá trình lên cấp được reset để phân bổ lại.
  - Nhận **+50 điểm thuộc tính vĩnh viễn**; đây không phải điểm tự do tạm thời và không bị reset.
  - Điểm từ **Tẩy Tủy Kinh** và **Võ Lâm Mật Tịch** giữ nguyên.
  - Thuộc tính/giá trị từ **Thiên Cơ Đan** giữ nguyên.
  - **Võ kỹ và cấp luyện kỹ năng giữ nguyên**.
- Max cấp luyện võ kỹ = **10 + (cấp Trùng Sinh × 10)**.

## 3. Thuộc tính và giới hạn HP/MP

- HP/MP là hệ thống riêng của game.
- **100% = 200 điểm**, **120% = 250 điểm** HP/MP.
- Sức mạnh, Thân pháp, Sinh khí, Nội công: **100% = 20 điểm; 120% = 25 điểm**.
- Công thức nội suy giữa các mốc chưa được tự ý chốt.

## 4. Trang bị

| Đẳng cấp | Cấp nhân vật | Số dòng thuộc tính |
|---|---:|---:|
| **Hoàng cấp** | Lv1–30 | tối đa 3 |
| **Huyền cấp** | Lv31–60 | 3–5 |
| **Địa cấp** | Lv61–90 | 5–7 |
| **Thiên cấp** | Lv91–200 | 8–10 |

Đẳng cấp trang bị độc lập với phẩm cấp.

### Phẩm cấp và màu

| Phẩm cấp | Màu |
|---|---|
| **Hạ phẩm** | Trắng |
| **Trung phẩm** | Xanh dương |
| **Thượng phẩm** | Vàng |
| **Cực phẩm** | Đỏ |

### Trần thuộc tính

- Hoàng: tối đa **+30%**.
- Huyền: tối đa **+50%**.
- Địa: tối đa **+80%**.
- Thiên: đặc biệt **+80% đến +120%**.

### Kháng tính

- Một món trang bị: tối đa **+20% cho một loại kháng tính**.
- Tổng kháng mỗi loại của nhân vật: hard cap **80%**, dù trang bị cộng vượt mức.
- Không cho đạt 100% kháng.

## 5. Đan dược

Có đúng **6 loại**:

1. **Khí Huyết Đan** — hồi HP.
2. **Hồi Khí Đan** — hồi MP.
3. **Tụ Linh Đan** — tăng EXP nhân vật.
4. **Ngộ Đạo Đan** — tăng EXP luyện kỹ năng.
5. **Trùng Sinh Đan** — dùng cho Trùng Sinh.
6. **Thiên Cơ Đan** — tăng thuộc tính ngẫu nhiên.

Đan dược có Level **1–10**:

| Level | Cấp nhân vật |
|---|---:|
| Lv1 | 1–10 |
| Lv2 | 11–20 |
| Lv3 | 21–30 |
| Lv4 | 31–40 |
| Lv5 | 41–50 |
| Lv6 | 51–60 |
| Lv7 | 61–70 |
| Lv8 | 71–80 |
| Lv9 | 81–90 |
| Lv10 | 91–200 |

### Thiên Cơ Đan

- Thuộc tính dạng %: ngẫu nhiên **+1% đến +5%**.
- Thuộc tính dạng điểm: ngẫu nhiên **+1 đến +100 điểm**.
- **Không giới hạn số lần sử dụng**.
- Giá trị đã nhận được giữ sau Trùng Sinh.

## 6. Linh dược và khoáng thạch

- **Linh dược:** Level 1–10.
- **Khoáng thạch:** Level 1–10.

## 7. Tẩy Tủy Kinh và Võ Lâm Mật Tịch

- **Tẩy Tủy Kinh:** mỗi lần dùng **+5 điểm thuộc tính tự do**.
- **Võ Lâm Mật Tịch:** mỗi lần dùng **+10 điểm thuộc tính tự do**.
- Không giới hạn số lần sử dụng.
- Điểm đã nhận được giữ vĩnh viễn qua Trùng Sinh.

## 8. Võ học / Skill

- Skill môn phái được xây theo VLTK; gia nhập môn phái có hệ võ công của môn phái.
- Tán Tu ban đầu không có võ công; muốn học phải có **bí kíp**.
- Không cộng điểm kỹ năng.
- **Skill Level** = đẳng cấp/yêu cầu học skill. Ví dụ Skill Level 60 yêu cầu nhân vật Lv60.
- Sau khi học, **Skill Training Level = 1**.
- **Skill Training Level** tăng bằng EXP luyện skill và làm thuộc tính/hiệu quả skill tăng dần.
- Chưa Trùng Sinh max Training Lv10; mỗi cấp Trùng Sinh mở thêm 10 cấp: TS1 Lv20, TS2 Lv30, ...
- Skill có thể yêu cầu loại **vũ khí**.
- Không có kỹ năng nội công.
- **Ngộ Đạo Đan** tăng EXP luyện kỹ năng.
- Võ kỹ và cấp luyện giữ nguyên sau Trùng Sinh.

## 9. Túi đồ

- **5 trang × 30 ô = 150 ô**.
- Trang 1–5 phải hoạt động.
- Thông tin vật phẩm hiển thị gần con trỏ khi chọn.
- Trang bị đang mặc có thể hiện để so sánh và có nút **Thay thế**.

### Bán nhanh

- Trang bị: Trắng / Xanh / Vàng / Đỏ.
- Đan dược: Lv1–Lv10.
- Linh dược: Lv1–Lv10.

## 10. Luyện Đan, Luyện Khí và Hợp Thành

Các menu/hệ thống **Luyện Đan, Luyện Khí và Hợp Thành** đã có trong project và tiếp tục phát triển trên kiến trúc hiện tại.

### Hợp Thành đan dược, linh dược và khoáng thạch

- Công thức cơ bản luôn dùng **2 vật phẩm**, không phải 3, 4 hay nhiều hơn.
- Hai vật phẩm phải **cùng loại và cùng Level**.
- **2 vật phẩm Level N → 1 vật phẩm Level N+1 cùng loại**.
- Ví dụ đan dược: **2 Khí Huyết Đan Lv1 → 1 Khí Huyết Đan Lv2**.
- Ví dụ linh dược: **2 Linh dược Lv1 → 1 Linh dược Lv2 cùng loại**.
- Ví dụ khoáng thạch: **2 Khoáng thạch Lv1 → 1 Khoáng thạch Lv2 cùng loại**.
- Có **xác suất 1–5%** để kết quả **vượt thêm 1 Level**.
- Ví dụ: **2 Khí Huyết Đan Lv1** thông thường tạo Lv2; nếu kích hoạt xác suất vượt cấp thì tạo **Lv3**. Quy tắc tương tự áp dụng cho linh dược và khoáng thạch.
- Hai vật phẩm đầu vào được tiêu hao để tạo ra **1 vật phẩm kết quả duy nhất**.
- Không vượt quá **Level 10** của đan dược, linh dược và khoáng thạch, trừ khi sau này có quy tắc mới được chốt.

## 11. Công thức chiến đấu

- Sát thương và các thuộc tính chiến đấu khác lấy **VLTK làm nền** theo repo VLTK đã chia sẻ.
- HP/MP và các giới hạn chỉ số riêng đã chốt của game được ưu tiên.
- Không tự ý chốt công thức chưa được xác nhận.

## 12. Kiến trúc dữ liệu chính

- `src/data/character.js`: nhân vật và thuộc tính.
- `src/data/rebirth.js`: Trùng Sinh.
- `src/data/equipment.js`: trang bị, phẩm cấp, thuộc tính.
- `src/data/equipmentSlots.js`: vị trí trang bị.
- `src/data/items/itemSchema.js`: schema item/cấp.
- `src/data/items/consumables.js`: đan dược.
- `src/data/items/alchemy.js`: linh dược.
- `src/data/items/forging.js`: khoáng thạch/quặng/hợp kim.
- `src/data/items/manuals.js`: Tẩy Tủy Kinh, Võ Lâm Mật Tịch, bí kíp.
- `src/data/items/index.js`: registry item.
- `src/data/skills/skillSchema.js`: schema skill.
- `src/data/skills/index.js`: registry skill.
- `src/systems/skillSystem.js`: học/luyện võ kỹ.
- `src/systems/itemSystem.js`: sử dụng item.
- `src/ui/screens/CharacterScreen.js`: giao diện nhân vật.
- `src/ui/screens/InventoryScreen.js`: túi đồ.
- `src/ui/screens/SkillsScreen.js`: võ học.
- `src/ui/controllers/*`: controller giao diện.

## 13. Nguồn VLTK

- VLTK 1 là nền tham khảo cho môn phái, võ học, sát thương và các thuộc tính chiến đấu khác.
- Repo tham khảo: `https://github.com/jxoffline/jx1linux`.

## 14. Quy tắc phát triển UI

- Chỉ tạo hình ảnh/mockup khi người phát triển **yêu cầu thiết kế**.
- Nếu yêu cầu là sửa/làm/chỉnh tính năng thì **không tự tạo hình ảnh**, mà triển khai trực tiếp trong game.
- Mockup phải có khả năng triển khai thực tế bằng code.
