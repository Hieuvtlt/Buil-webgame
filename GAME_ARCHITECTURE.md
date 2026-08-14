# Kiến trúc Game Web — Quy tắc hiện tại

> Đây là tài liệu bàn giao trung tâm của dự án. Khi đổi tài khoản, đổi phiên ChatGPT, hoặc tiếp tục dự án ở nơi khác, hãy đọc file này trước để nắm nhanh quy tắc và hướng xây dựng đã chốt.

## 0. Quy tắc bàn giao & phát triển
- Đây là nguồn ghi chú trung tâm cho các quyết định thiết kế/gameplay đã chốt.
- Khi người phát triển mới tiếp tục dự án, ưu tiên đọc `GAME_ARCHITECTURE.md`, sau đó kiểm tra code thực tế trước khi sửa.
- Không tự ý thay đổi các quy tắc gameplay đã chốt. Nếu cần thay đổi, cập nhật lại tài liệu này cùng với code.
- Khi người dùng nói “sửa game”, phải sửa trực tiếp code/repository; không chuyển sang tạo ảnh/mockup trừ khi được yêu cầu.
- Khi thêm hình ảnh/icon mới, phải tuân thủ cấu trúc asset ở mục 13.
- Khi thay đổi hệ thống lớn, cập nhật tài liệu này để phiên làm việc sau có thể tiếp tục ngay.

## 1. Nhân vật
- Max cấp cố định Lv1–200.
- Mỗi lần lên cấp +5 điểm thuộc tính tự do.
- 1 điểm tự do vào Sinh khí = +5 HP.
- 1 điểm tự do vào Nội lực/Mana = +5 MP.
- HP/MP theo giới hạn riêng của game; sát thương và thuộc tính chiến đấu khác lấy VLTK làm nền.
- Bỏ Kháng tất cả, Tốc độ đánh và kỹ năng nội công.

## 2. Trùng sinh
- Trùng Sinh 1: Lv100 + Trùng Sinh Đan Lv1.
- Trùng Sinh 2: Lv120 + Trùng Sinh Đan Lv2.
- Sau Trùng Sinh: về Lv1; điểm do lên cấp reset; nhận +50 điểm thuộc tính vĩnh viễn.
- Điểm từ Tẩy Tủy Kinh, Võ Lâm Mật Tịch và giá trị Thiên Cơ Đan giữ nguyên.
- Võ kỹ và cấp luyện kỹ năng giữ nguyên.
- Max Skill Training = 10 + cấp Trùng Sinh × 10.

## 3. Thuộc tính
- HP/MP: 100% = 200 điểm; 120% = 250 điểm.
- Sức mạnh, Thân pháp, Sinh khí, Nội công: 100% = 20 điểm; 120% = 25 điểm.
- Công thức sát thương và thuộc tính khác theo VLTK.

## 4. Trang bị
| Đẳng cấp | Cấp nhân vật | Dòng thuộc tính |
|---|---:|---:|
| Hoàng cấp | 1–30 | tối đa 3 |
| Huyền cấp | 31–60 | 3–5 |
| Địa cấp | 61–90 | 5–7 |
| Thiên cấp | 91–200 | 8–10 |

Phẩm cấp: Hạ phẩm = trắng; Trung phẩm = xanh dương; Thượng phẩm = vàng; Cực phẩm = đỏ.

Trần thuộc tính: Hoàng +30%; Huyền +50%; Địa +80%; Thiên +80–120%.

Kháng tính: mỗi món tối đa +20% cho một loại; tổng mỗi loại tối đa 80%.

## 5. Đan dược
Có 8 loại đan dược:
- Khí Huyết Đan: hồi HP.
- Hồi Khí Đan: hồi MP.
- Tụ Linh Đan: EXP nhân vật.
- Ngộ Đạo Đan: EXP võ kỹ.
- Trùng Sinh Đan: dùng cho Trùng Sinh.
- Thiên Cơ Đan: tăng thuộc tính ngẫu nhiên.
- Đan Tâm Đan: EXP Luyện Đan.
- Khí Linh Đan: EXP Luyện Khí.

Các đan dược có Level 1–10 khi áp dụng hệ thống cấp: Lv1 = nhân vật 1–10; Lv2 = 11–20; ...; Lv9 = 81–90; Lv10 = 91–200.

Thiên Cơ Đan: thuộc tính % +1–5% ngẫu nhiên; thuộc tính dạng điểm +1–100 điểm ngẫu nhiên; sử dụng không giới hạn; giá trị giữ qua Trùng Sinh.

Đan Tâm Đan và Khí Linh Đan là vật phẩm tăng EXP riêng cho hai nghề; dữ liệu hiện có đủ Lv1–Lv10 và sử dụng icon từ thư mục `danduoc`.

## 6. Linh dược và khoáng thạch
- Linh dược có 12 loại, mỗi loại Lv1–10.
- Khoáng thạch có 12 loại, mỗi loại Lv1–10.

## 7. Tẩy Tủy Kinh và Võ Lâm Mật Tịch
- Tẩy Tủy Kinh: +5 điểm tự do/lần, không giới hạn.
- Võ Lâm Mật Tịch: +10 điểm tự do/lần, không giới hạn.
- Điểm đã nhận giữ vĩnh viễn qua Trùng Sinh.

## 8. Võ học / Skill
- Các môn phái xây theo VLTK; Tán Tu không có võ công sẵn và phải học bằng bí kíp.
- Không cộng điểm kỹ năng.
- Skill Level là đẳng cấp/yêu cầu để học. Ví dụ Skill Level 60 yêu cầu nhân vật Lv60; học xong bắt đầu Training Level 1.
- Skill Training Level tăng bằng EXP luyện skill và làm thuộc tính/hiệu quả skill tăng dần.
- Chưa Trùng Sinh max Training 10; mỗi Trùng Sinh mở thêm 10 cấp: TS1 = 20, TS2 = 30,...
- Cách hiển thị bắt buộc: `Skill Training hiện tại / giới hạn`, ví dụ `3/10`, Trùng Sinh 1 có thể `10/20`.
- Skill có yêu cầu vũ khí.
- Không có kỹ năng nội công.
- Ngộ Đạo Đan tăng EXP luyện skill.

## 9. Túi đồ
- 5 trang × 30 ô = 150 ô; trang 1–5 hoạt động.
- Thông tin vật phẩm hiện gần con trỏ khi click/chọn.
- Nếu vật phẩm đang trang bị, hiện khung đang trang bị để so sánh và có nút Thay thế ngay tại popup.
- Bán nhanh: trang bị Trắng/Xanh/Vàng/Đỏ; đan dược Lv1–10; linh dược Lv1–10.

## 10. Đan phương và Bản vẽ
### Đan phương
- Đan phương có Level 1–10, tương ứng với Level đan dược.
- Học một Đan phương chỉ 1 lần; sau khi học thành công, công thức được mở vĩnh viễn cho nhân vật.
- Đan phương Lv1–Lv4: có thể học trực tiếp bằng 1 Đan phương cùng Level.
- Từ Lv5 trở lên, Đan phương cấp cao phải được tạo thông qua Hợp Thành Đan phương:
  - 4 mảnh Đan phương Lv5 → 1 Đan phương Lv5 hoàn chỉnh.
  - 4 mảnh Đan phương Lv6 → 1 Đan phương Lv6 hoàn chỉnh.
  - Tiếp tục tương tự cho Lv7–Lv10.
- Mảnh và tấm hoàn chỉnh phải cùng Level.
- Việc dùng Đan phương hoàn chỉnh để học công thức là vĩnh viễn và không cần dùng lại.

### Bản vẽ
- Bản vẽ cũng có hệ thống cấp độ tương ứng với đẳng cấp trang bị.
- Bản vẽ phải phân loại theo đẳng cấp + phẩm cấp + vị trí trang bị, không dùng một Bản vẽ chung cho mọi trang bị.
- Ví dụ: Hoàng cấp Hạ phẩm – Áo, Huyền cấp Trung phẩm – Mũ.
- Mỗi loại Bản vẽ được học một lần và công thức đã học được mở vĩnh viễn.
- Quy tắc tạo Bản vẽ cấp cao áp dụng tương tự Đan phương: Lv1–Lv4 dùng 1 tấm hoàn chỉnh; từ Lv5 trở lên dùng 4 mảnh cùng Level → 1 tấm hoàn chỉnh cùng Level.
- Không gộp các loại Bản vẽ khác vị trí/đẳng cấp/phẩm cấp vào cùng một công thức.

## 11. Luyện Đan, Luyện Khí, Hợp Thành
### Luyện Đan
- Hệ thống có 12 loại đan dược chế tạo.
- Lv1 cần 2 loại linh dược Lv1.
- Lv2 cần 3 loại linh dược Lv2.
- Lv3 cần 4 loại linh dược Lv3.
- Tiếp tục tăng 1 loại nguyên liệu mỗi Level.
- Lv10 cần 12 loại linh dược Lv10.
- Chỉ được luyện các công thức Đan dược đã học thông qua Đan phương.
- Có hệ thống **Alchemy Training** riêng.
- Chưa Trùng Sinh: giới hạn luyện tối đa **10**.
- Mỗi Trùng Sinh mở thêm **10 cấp**: TS1 = 20, TS2 = 30,...
- Hiển thị theo dạng `Luyện Đan hiện tại / giới hạn`, ví dụ `3/10`, TS1 có thể `10/20`.
- EXP Luyện Đan **chỉ nhận khi luyện thành công**.
- Cấp Luyện Đan tăng dần sẽ làm hiệu quả/thuộc tính của quá trình Luyện Đan tăng dần theo hệ thống cân bằng sau này.
- Đan Tâm Đan dùng để tăng EXP Luyện Đan.

### Luyện Khí
- Dùng 12 loại khoáng thạch.
- Hoàng cấp Hạ phẩm: 3 loại khoáng thạch Lv1.
- Hoàng cấp Trung phẩm: 4 loại khoáng thạch Lv2.
- Tiếp tục theo quy luật tăng 1 loại nguyên liệu.
- Chỉ được luyện các công thức trang bị đã học thông qua Bản vẽ tương ứng.
- Có hệ thống **Forging Training** riêng.
- Chưa Trùng Sinh: giới hạn luyện tối đa **10**.
- Mỗi Trùng Sinh mở thêm **10 cấp**: TS1 = 20, TS2 = 30,...
- Hiển thị theo dạng `Luyện Khí hiện tại / giới hạn`, ví dụ `3/10`, TS1 có thể `10/20`.
- EXP Luyện Khí **chỉ nhận khi luyện thành công**.
- Cấp Luyện Khí tăng dần sẽ làm hiệu quả/thuộc tính của quá trình Luyện Khí tăng dần theo hệ thống cân bằng sau này.
- Khí Linh Đan dùng để tăng EXP Luyện Khí.

### Hợp Thành
- Luôn dùng 2 vật phẩm cùng loại và cùng Level đối với hệ thống Hợp Thành vật liệu/đan dược.
- 2 vật phẩm Level N → 1 vật phẩm Level N+1 cùng loại.
- Có xác suất 1–5% vượt thêm 1 Level.
- Ví dụ 2 Khí Huyết Đan Lv1 → Lv2; nếu vượt cấp → Lv3.
- Quy tắc tương tự cho linh dược và khoáng thạch.
- Không vượt Level 10 nếu chưa có quy tắc mới.
- Hợp Thành Đan phương/Bản vẽ là hệ thống riêng: từ Level 5 trở lên dùng 4 mảnh cùng Level → 1 tấm hoàn chỉnh cùng Level, không áp dụng quy tắc 2→1 của vật liệu/đan dược.

## 12. Quy tắc phát triển UI
- Chỉ tạo hình ảnh/mockup khi người phát triển yêu cầu thiết kế.
- Nếu yêu cầu sửa/làm/chỉnh game thì không tự tạo hình; triển khai trực tiếp bằng code.
- Mockup nếu có phải có khả năng triển khai thực tế bằng code.

## 13. Cấu trúc Asset — QUY TẮC CỐ ĐỊNH
> Đây là cấu trúc chính thức để lưu hình ảnh/icon của game. Không tạo thêm các thư mục asset tùy tiện nếu không có lý do rõ ràng.

### 13.1. Hình ảnh giao diện/minh họa
Thư mục chuẩn:

`src/assets/images/`

Tất cả hình minh họa lớn, hình cố định trong menu/giao diện và hình trang trí chức năng mới phải lưu tại đây.

Ví dụ:
- `hinhdanlo.svg` — hình Đan Lô của menu Luyện Đan.
- `hinhbualuyenkhi.svg` — hình Búa + Đe của menu Luyện Khí.
- `hinhhopthanh.svg` — hình minh họa menu Hợp Thành.

Quy tắc đặt tên:
- Tên mô tả đúng chức năng.
- Ưu tiên tiếng Việt không dấu, viết liền, dễ tìm.
- Không đặt tên kiểu `image1`, `new2`, `test`, `final-final`.
- Khi thay hình nhưng giữ nguyên chức năng, ưu tiên giữ nguyên tên file để code không phải sửa.

### 13.2. Icon
Thư mục chuẩn:

`src/assets/icons/`

Tất cả icon menu, icon chức năng, icon trạng thái và icon UI mới phải lưu tại đây.

Quy tắc đặt tên tương tự hình ảnh: tên phải thể hiện chức năng, ví dụ `iconluyendan`, `iconluyenkhi`, `iconhopthanh`, `iconskill`.

### 13.3. Quản lý đường dẫn asset
- Các đường dẫn asset giao diện mới phải ưu tiên lấy từ hệ thống quản lý asset tập trung (ví dụ `src/ui/assets.js`) thay vì viết đường dẫn rải rác trong nhiều component.
- Khi thêm một asset mới, cập nhật registry quản lý asset tương ứng.
- Khi thay asset, chỉ cần thay file đúng tên trong `src/assets/images/` hoặc `src/assets/icons/` nếu không đổi chức năng.
- Không tự ý di chuyển các thư mục dữ liệu icon/item cũ đang được code sử dụng nếu chưa kiểm tra toàn bộ import/reference. Việc gom asset cũ phải thực hiện có kiểm tra để tránh làm hỏng item hiện tại.

### 13.4. Quy trình thêm hình mới
1. Xác định đây là **hình minh họa** hay **icon**.
2. Đặt file vào `src/assets/images/` hoặc `src/assets/icons/`.
3. Đặt tên theo chức năng.
4. Đăng ký đường dẫn trong hệ thống asset tập trung nếu hệ thống đó đang dùng cho module.
5. Sửa component/menu để dùng đường dẫn chuẩn mới.
6. Kiểm tra cả môi trường local và GitHub Pages vì game được triển khai dưới sub-path `/Buil-webgame/`.
7. Không để lại đường dẫn asset cũ chết trong code nếu asset đã được thay thế.

## 14. Nguồn tham khảo
- VLTK 1 là nền tham khảo cho môn phái, võ học, sát thương và thuộc tính chiến đấu.
- Repo tham khảo: https://github.com/jxoffline/jx1linux

## 15. Ghi chú trạng thái dự án
- Game đang được phát triển trực tiếp trên GitHub repository `Hieuvtlt/Buil-webgame`.
- GitHub Pages là môi trường kiểm tra giao diện/chức năng online.
- Khi kiểm tra sau deploy, có thể cần `Ctrl + F5` để loại bỏ cache asset cũ.
- Các quy tắc gameplay trong tài liệu này là những gì đã được chốt trong quá trình xây dựng; các chi tiết chưa chốt phải được coi là đang mở và không tự suy diễn thành quy tắc cố định.
