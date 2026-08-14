# Kiến trúc Game Web — Quy tắc hiện tại

> Bộ quy tắc đã chốt cho việc phát triển game.

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

## 13. Nguồn tham khảo
- VLTK 1 là nền tham khảo cho môn phái, võ học, sát thương và thuộc tính chiến đấu.
- Repo tham khảo: https://github.com/jxoffline/jx1linux
