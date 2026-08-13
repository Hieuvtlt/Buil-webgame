# Kiến trúc Game Web — Quy tắc hiện tại

> Đây là bộ quy tắc thiết kế hiện tại đã được chốt. Khi code mới mâu thuẫn với tài liệu này, ưu tiên xác nhận lại quy tắc trước khi thay đổi hệ thống.

## 1. Nhân vật

- Cấp nhân vật cố định: **Lv1–200**.
- Mỗi lần lên 1 cấp: **+5 điểm thuộc tính tự do**.
- Điểm tự do được phân bổ vào các thuộc tính cơ bản của nhân vật.
- Khi cộng điểm tự do vào **Sinh khí**: 1 điểm = **+5 HP**.
- Khi cộng điểm tự do vào **Nội lực/Mana**: 1 điểm = **+5 MP**.
- HP và MP có quy tắc/giới hạn riêng do game này quy định, không lấy nguyên công thức HP/MP của VLTK.
- Sát thương và các thuộc tính chiến đấu khác lấy VLTK làm nền theo dữ liệu/cơ chế tham khảo từ repo VLTK đã chia sẻ.
- Không có thuộc tính **Kháng tất cả**.
- Không có **Tốc độ đánh**.
- Không xây dựng **kỹ năng nội công**.
- Võ công/skill dùng hướng **Ngoại công**.

## 2. Trùng sinh

- Trùng Sinh 1: **Nhân vật Lv100 + Trùng Sinh Đan Lv1**.
- Trùng Sinh 2: **Nhân vật Lv120 + Trùng Sinh Đan Lv2**.
- Các mốc Trùng Sinh tiếp theo phải được cấu hình theo quy tắc được chốt sau; không tự suy đoán nếu chưa xác nhận.
- Sau mỗi lần Trùng Sinh:
  - Nhân vật quay về **Lv1**.
  - Các điểm thuộc tính nhận từ quá trình lên cấp và phần phân bổ tương ứng được reset để phân bổ lại.
  - Nhận **+50 điểm thuộc tính vĩnh viễn**, không phải điểm tự do tạm thời và không bị reset ở các lần Trùng Sinh sau.
  - Điểm đã tích lũy từ **Tẩy Tủy Kinh** được giữ nguyên.
  - Điểm đã tích lũy từ **Võ Lâm Mật Tịch** được giữ nguyên.
  - Các thuộc tính/giá trị đã nhận từ **Thiên Cơ Đan** được giữ nguyên.
  - **Võ kỹ và cấp luyện kỹ năng giữ nguyên**.
- Giới hạn cấp luyện võ kỹ: **10 + (cấp Trùng Sinh × 10)**.

## 3. Thuộc tính và giới hạn HP/MP

- HP và MP là hệ thống được game tự quy định để tránh chỉ số phình quá lớn.
- Mốc đã chốt:
  - **100% = 200 điểm** HP/MP.
  - **120% = 250 điểm** HP/MP.
- Với thuộc tính điểm cơ bản:
  - **Sức mạnh:** 100% = 20 điểm; 120% = 25 điểm.
  - **Thân pháp:** 100% = 20 điểm; 120% = 25 điểm.
  - **Sinh khí:** 100% = 20 điểm; 120% = 25 điểm.
  - **Nội công:** 100% = 20 điểm; 120% = 25 điểm.
- Các mốc trên là quy tắc giới hạn/qui đổi của game; công thức nội suy giữa các mốc sẽ chỉ được triển khai khi đã chốt.

## 4. Trang bị — đẳng cấp và cấp nhân vật

Trang bị có 4 đẳng cấp:

| Đẳng cấp | Cấp nhân vật yêu cầu | Số dòng thuộc tính |
|---|---:|---:|
| **Hoàng cấp** | Lv1–30 | tối đa 3 dòng |
| **Huyền cấp** | Lv31–60 | 3–5 dòng |
| **Địa cấp** | Lv61–90 | 5–7 dòng |
| **Thiên cấp** | Lv91–200 | 8–10 dòng |

- Thiên cấp là đẳng cấp cao nhất và đặc biệt vì có thể dùng tới cấp nhân vật 200.
- Đẳng cấp trang bị **khác** phẩm cấp trang bị.

## 5. Phẩm cấp trang bị và màu sắc

Có 4 phẩm cấp:

| Phẩm cấp | Màu hiển thị |
|---|---|
| **Hạ phẩm** | Trắng |
| **Trung phẩm** | Xanh dương |
| **Thượng phẩm** | Vàng |
| **Cực phẩm** | Đỏ |

- Màu của **tên, viền và thuộc tính hiển thị** của trang bị đi theo phẩm cấp.
- Phẩm cấp và đẳng cấp là hai hệ thống độc lập.
- Ví dụ: **Thiên cấp – Cực phẩm** là hoàn toàn hợp lệ.

## 6. Giới hạn thuộc tính trang bị

Trần % thuộc tính theo đẳng cấp trang bị:

- **Hoàng cấp:** tối đa +30%.
- **Huyền cấp:** tối đa +50%.
- **Địa cấp:** tối đa +80%.
- **Thiên cấp:** đặc biệt, +80% đến +120%.

Giới hạn kháng tính:

- Một món trang bị chỉ được cộng tối đa **+20% cho một loại kháng tính**.
- Tổng kháng của nhân vật đối với mỗi loại kháng tính bị giới hạn cứng ở **80%**.
- Dù tổng trang bị cộng vượt 80%, nhân vật vẫn chỉ có tối đa 80% kháng.
- Không cho kháng đạt 100% để tránh miễn hoàn toàn sát thương thuộc tính.

## 7. Đan dược

Game có đúng **6 loại đan dược chính**:

1. **Khí Huyết Đan** — hồi HP.
2. **Hồi Khí Đan** — hồi MP.
3. **Tụ Linh Đan** — tăng EXP nhân vật.
4. **Ngộ Đạo Đan** — tăng EXP luyện kỹ năng.
5. **Trùng Sinh Đan** — dùng cho Trùng Sinh.
6. **Thiên Cơ Đan** — tăng thuộc tính ngẫu nhiên.

### Cấp đan dược

Đan dược có Level **1–10**:

| Level đan | Cấp nhân vật sử dụng |
|---|---:|
| Lv1 | Lv1–10 |
| Lv2 | Lv11–20 |
| Lv3 | Lv21–30 |
| Lv4 | Lv31–40 |
| Lv5 | Lv41–50 |
| Lv6 | Lv51–60 |
| Lv7 | Lv61–70 |
| Lv8 | Lv71–80 |
| Lv9 | Lv81–90 |
| Lv10 | Lv91–200 |

### Thiên Cơ Đan

- Nếu tác động vào thuộc tính dạng **%**: tăng ngẫu nhiên **+1% đến +5%**.
- Nếu tác động vào thuộc tính dạng **điểm**: tăng ngẫu nhiên **+1 đến +100 điểm**.
- **Không giới hạn số lần sử dụng**.
- Giá trị đã nhận từ Thiên Cơ Đan được giữ lại sau Trùng Sinh.

## 8. Linh dược và khoáng thạch

- **Linh dược:** Level **1–10**.
- **Khoáng thạch:** Level **1–10**.
- Hai hệ thống được dùng làm nguyên liệu cho các hệ thống chế tạo tương ứng.

## 9. Tẩy Tủy Kinh và Võ Lâm Mật Tịch

- **Tẩy Tủy Kinh:** mỗi lần sử dụng **+5 điểm thuộc tính tự do**.
- **Võ Lâm Mật Tịch:** mỗi lần sử dụng **+10 điểm thuộc tính tự do**.
- Cả hai đều **không giới hạn số lần sử dụng**.
- Điểm đã nhận được từ hai loại item này được **giữ lại vĩnh viễn qua Trùng Sinh**.

## 10. Võ học / Skill

### Môn phái

Hệ thống môn phái được xây dựng theo VLTK và là nền tảng của skill. Danh sách hiện tại trong code gồm:

- Thiên Vương
- Thiếu Lâm
- Võ Đang
- Nga Mi
- Đường Môn
- Ngũ Độc
- Cái Bang
- Hoa Sơn
- Côn Lôn
- Thiên Nhẫn
- Tiêu Dao
- Tán Tu

> Việc bỏ/giữ Đường Môn và các môn phái khác sẽ chỉ thay đổi khi được chốt lại; không tự ý thêm phái mới.

### Skill của môn phái thường

- Khi gia nhập môn phái, nhân vật có **hệ võ công của môn phái đó**.
- Skill được mở/học theo **môn phái + đẳng cấp kỹ năng + cấp nhân vật + bí kíp + vũ khí và các điều kiện khác của skill**.
- Không dùng hệ thống cộng điểm kỹ năng.
- Skill được **luyện** bằng EXP luyện kỹ năng.

### Tán Tu

- Tán Tu là hệ thống riêng.
- Ban đầu **không có võ công sẵn**.
- Muốn có skill phải **học bí kíp**.
- Tán Tu có thể học võ công thông qua bí kíp theo quy tắc được xác định cho từng skill.

### Cấp độ kỹ năng và cấp luyện kỹ năng

Hai khái niệm hoàn toàn khác nhau:

- **Đẳng cấp/cấp độ kỹ năng (`skillLevel`)**: là đẳng cấp yêu cầu để học skill. Ví dụ Skill Level 60 yêu cầu nhân vật đạt Lv60. Sau khi học, skill bắt đầu ở **cấp luyện Lv1**.
- **Cấp luyện kỹ năng (`skillTrainingLevel`)**: là cấp độ nhân vật đã luyện skill sau khi học.

Ví dụ:

`Skill Level 60 → Nhân vật Lv60 + đủ bí kíp/điều kiện → học thành công → Training Level 1.`

Cấp luyện kỹ năng tăng dần sẽ làm **thuộc tính/hiệu quả của skill tăng dần**.

### Giới hạn cấp luyện

- Chưa Trùng Sinh: tối đa **Lv10**.
- Trùng Sinh 1: tối đa **Lv20**.
- Trùng Sinh 2: tối đa **Lv30**.
- Quy luật: mỗi cấp Trùng Sinh mở thêm **10 cấp luyện**.
- Không cộng điểm kỹ năng để nâng skill.
- **Ngộ Đạo Đan** tăng EXP luyện kỹ năng.
- Võ kỹ và cấp luyện giữ nguyên sau Trùng Sinh.

### Vũ khí

- Skill có thể có **yêu cầu loại vũ khí**.
- Khi sử dụng skill, nhân vật phải trang bị đúng vũ khí nếu skill yêu cầu.
- Skill không yêu cầu vũ khí có thể sử dụng theo điều kiện riêng của skill.

### Loại bỏ

- Không có **kỹ năng nội công**.
- Không xây hệ skill nội công.
- Không có thuộc tính Kháng tất cả.
- Không dùng Tốc độ đánh làm thuộc tính của game.

## 11. Túi đồ

- Túi đồ có **5 trang**.
- Mỗi trang có **30 ô**.
- Tổng sức chứa theo giao diện hiện tại: **150 ô**.
- Chuyển trang 1–5 phải hoạt động thực tế.
- Popup thông tin vật phẩm xuất hiện gần con trỏ khi chọn vật phẩm.
- Trang bị đang mặc có thể được hiển thị để so sánh với vật phẩm mới.
- Có nút **Thay thế** ngay trong vùng thông tin tương tác.

### Bán nhanh

Có menu Bán nhanh với các nhóm:

- Trang bị: Trắng / Xanh / Vàng / Đỏ.
- Đan dược: Lv1 / Lv2 / ... / Lv10.
- Linh dược: Lv1 / Lv2 / ... / Lv10.

## 12. Luyện Đan, Luyện Khí và Hợp Thành

- Các hệ thống **Luyện Đan**, **Luyện Khí** và **Hợp Thành** đã có trong kiến trúc/project và sẽ tiếp tục được phát triển trên hệ thống hiện tại.
- Linh dược Level 1–10 là nhóm nguyên liệu cho Luyện Đan.
- Khoáng thạch Level 1–10 là nhóm nguyên liệu cho Luyện Khí.
- Không tạo ngựa và item liên quan đến ngựa.

## 13. Công thức chiến đấu

- Sát thương và các thuộc tính chiến đấu khác lấy **VLTK làm nền** theo repo VLTK đã chia sẻ.
- HP/MP và các giới hạn chỉ số mà người chơi đã chốt là **quy tắc riêng của game**, ưu tiên hơn công thức gốc nếu có khác biệt.
- Chưa tự ý chốt các công thức chưa được xác nhận.

## 14. Kiến trúc dữ liệu

Các module chính:

- `src/data/character.js`: trạng thái và thuộc tính nhân vật.
- `src/data/rebirth.js`: điều kiện và logic Trùng Sinh.
- `src/data/equipment.js`: roll phẩm cấp và thuộc tính trang bị.
- `src/data/equipmentSlots.js`: vị trí trang bị.
- `src/data/items/itemSchema.js`: schema item và bảng cấp.
- `src/data/items/consumables.js`: đan dược.
- `src/data/items/alchemy.js`: linh dược.
- `src/data/items/forging.js`: khoáng thạch/quặng/hợp kim.
- `src/data/items/manuals.js`: Tẩy Tủy Kinh, Võ Lâm Mật Tịch và bí kíp.
- `src/data/items/index.js`: registry item.
- `src/data/skills/skillSchema.js`: schema môn phái/skill.
- `src/data/skills/index.js`: registry skill.
- `src/systems/skillSystem.js`: học và luyện võ kỹ.
- `src/systems/itemSystem.js`: sử dụng item.
- `src/ui/screens/CharacterScreen.js`: giao diện nhân vật.
- `src/ui/screens/InventoryScreen.js`: giao diện túi đồ.
- `src/ui/screens/SkillsScreen.js`: giao diện võ học.
- `src/ui/controllers/*`: xử lý tương tác từng màn hình.

## 15. Nguồn tham khảo VLTK

- Game lấy VLTK 1 làm nền cho môn phái, võ học, sát thương và các thuộc tính chiến đấu khác.
- Repo tham khảo do người phát triển cung cấp: `https://github.com/jxoffline/jx1linux`.
- Dữ liệu trong project hiện tại có thể chỉ là dữ liệu khởi tạo để kiểm tra logic; không coi đó là danh sách skill/trang bị VLTK hoàn chỉnh cho đến khi được nhập và kiểm tra.

## 16. Quy tắc phát triển UI

- Chỉ tạo hình ảnh/mockup khi người phát triển **yêu cầu thiết kế**.
- Khi yêu cầu là sửa/làm/chỉnh tính năng trong game thì **không tự tạo hình ảnh**, mà triển khai trực tiếp trong game.
- Mọi giao diện được thiết kế phải có khả năng triển khai bằng code thực tế; không tạo mockup chứa chức năng không thể thực hiện.
