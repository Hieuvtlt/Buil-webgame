# GAME ARCHITECTURE — Sổ tay trung tâm của Game

> Tài liệu bàn giao chính thức. Khi đổi tài khoản/phiên ChatGPT, đọc file này trước. Đây là nơi lưu các quy tắc gameplay đã chốt, ý tưởng, hướng phát triển, UI và asset.

## 0. Quy tắc
- Ý tưởng mới ghi vào tài liệu; chưa chốt không tự biến thành tính năng bắt buộc.
- Yêu cầu đã chốt phải được ghi vào hệ thống tương ứng và nhật ký.
- Khi sửa game: kiểm tra code hiện tại rồi mới sửa, không phá tính năng đang chạy.
- Khi thay đổi gameplay: cập nhật tài liệu cùng commit.
- Khi tiếp tục dự án: đọc file này → kiểm tra repository → tiếp tục.

## 1. Tầm nhìn
- Game web tu tiên/võ hiệp, lấy VLTK làm nền tham chiếu.
- Đã bỏ Đường Môn và Thúy Yên.
- Tán Tu là hướng riêng, sức mạnh đến từ tìm/học bí kíp.
- Progression: Nhân vật → Môn phái/Tán Tu → Võ kỹ → Trang bị → Nguyên liệu → Luyện Đan/Luyện Khí → Hợp Thành → Trùng Sinh.

## 2. Nhân vật
- Max cấp 200.
- Mỗi lần lên cấp +5 điểm thuộc tính tự do.
- 1 điểm Sinh khí = +5 HP; 1 điểm Nội công = +5 MP.
- Bỏ Kháng tất cả, Tốc độ đánh và kỹ năng nội công.
- Kháng mỗi loại tối đa 80%, không miễn sát thương 100%.

## 3. Trùng Sinh
- Trùng Sinh về Lv1.
- Trùng Sinh 1 cần Lv100 + Trùng Sinh Đan Lv1; Trùng Sinh 2 cần Lv120 + Trùng Sinh Đan Lv2.
- Nhận +50 điểm thuộc tính vĩnh viễn.
- Giữ giá trị Tẩy Tủy Kinh, Võ Lâm Mật Tịch, Thiên Cơ Đan và Võ kỹ.
- Giới hạn Training = 10 + Trùng Sinh × 10.

## 4. Trang bị
| Đẳng cấp | Cấp nhân vật | Dòng thuộc tính |
|---|---:|---:|
| Hoàng cấp | 1–30 | tối đa 3 |
| Huyền cấp | 31–60 | 3–5 |
| Địa cấp | 61–90 | 5–7 |
| Thiên cấp | 91–200 | 8–10 |

Phẩm cấp/màu:
- Hạ phẩm = trắng.
- Trung phẩm = xanh dương.
- Thượng phẩm = vàng.
- Cực phẩm = đỏ.
- Thiên cấp có thể đạt 80–120% theo thiết kế.

## 5. Đan dược
8 loại hiện tại: Khí Huyết Đan, Hồi Khí Đan, Tụ Linh Đan, Ngộ Đạo Đan, Trùng Sinh Đan, Thiên Cơ Đan, Đan Tâm Đan, Khí Linh Đan.
- Level 1–10 tương ứng các mốc nhân vật 1–10, 11–20 ... 91–200.
- Thiên Cơ Đan: +1–5% ngẫu nhiên hoặc +1–100 điểm ngẫu nhiên; dùng không giới hạn; giá trị giữ qua Trùng Sinh.

## 6. Linh dược & Khoáng thạch
- Mỗi loại có 12 loại, Lv1–10.
- Là nguyên liệu chính cho Luyện Đan/Luyện Khí.

## 7. Tẩy Tủy Kinh / Võ Lâm Mật Tịch
- Tẩy Tủy Kinh: +5 điểm tự do/lần, không giới hạn.
- Võ Lâm Mật Tịch: +10 điểm tự do/lần, không giới hạn.
- Điểm đã nhận giữ vĩnh viễn qua Trùng Sinh.

## 8. Võ học / Skill
- Không cộng điểm kỹ năng.
- Skill Level = cấp/yêu cầu để học; Training Level là cấp luyện sau khi học.
- Training tăng bằng EXP.
- Giới hạn trước Trùng Sinh 10; mỗi Trùng Sinh +10.
- Hiển thị dạng hiện tại/giới hạn, ví dụ 3/10.
- Skill có yêu cầu vũ khí.
- Ngộ Đạo Đan tăng EXP luyện skill.

## 9. Túi đồ
- 5 trang × 30 ô = 150 ô.
- Click vật phẩm → thông tin gần con trỏ.
- Nếu đang trang bị → hiện khung Đang trang bị để so sánh và có nút Thay thế.
- Bán nhanh được trang bị Trắng/Xanh/Vàng/Đỏ, đan dược Lv1–10 và linh dược Lv1–10.

## 10. Đan phương & Bản vẽ
### Đan phương
- Lv1–10 tương ứng đan dược.
- Học 1 lần → công thức vĩnh viễn.
- Lv1–4 dùng 1 tấm cùng Level.
- Lv5 trở lên: 4 mảnh cùng Level → 1 tấm hoàn chỉnh.
### Bản vẽ
- Phân theo đẳng cấp + phẩm cấp + vị trí trang bị.
- Học 1 lần → công thức vĩnh viễn.
- Lv1–4 dùng 1 tấm; từ Lv5 dùng 4 mảnh cùng Level.

## 11. Luyện Đan
- Training riêng, giới hạn 10 + Trùng Sinh × 10.
- Chỉ nhận EXP khi luyện thành công.
- Công thức tăng số loại linh dược theo Level: Lv1=2 loại, Lv2=3 loại, Lv3=4 loại... Lv10=12 loại.
- Chỉ luyện công thức đã học bằng Đan phương.
- Đan Tâm Đan tăng EXP nghề.
- Khung hình minh họa cố định để người chơi tự thay ảnh.

## 12. Luyện Khí
- Training riêng, giới hạn 10 + Trùng Sinh × 10.
- Chỉ nhận EXP khi luyện thành công.
- Dùng khoáng thạch.
- Bản vẽ quyết định loại trang bị, đẳng cấp, phẩm cấp và vị trí.
- Khí Linh Đan tăng EXP nghề.
- **Cấp độ trong Luyện Khí phải là Hoàng/Huyền/Địa/Thiên, không phải Level nhân vật.**
- Khung hình minh họa cố định, có hình giống Luyện Đan và có thể thay ảnh.

## 13. Hợp Thành
### Đan dược / Linh dược / Khoáng thạch
- 2 vật phẩm cùng loại + cùng Level → 1 vật phẩm Level kế tiếp.
- Xác suất vượt thêm 1 Level: 1–5%.
### Đan phương / Bản vẽ
- Từ Lv5: 4 mảnh cùng Level → 1 tấm hoàn chỉnh.
- Không dùng quy tắc 2→1 cho Đan phương/Bản vẽ.

## 14. Thương Hội
- Hai tab: **MUA** và **BÁN**.
- MUA = người chơi mua đồ của Bot.
- BÁN = người chơi bán đồ của mình cho Bot.
- Click ô trong BÁN → danh sách vật phẩm túi đồ → click vật phẩm → bảng thông tin vật phẩm + giá.
- Thông tin phải đầy đủ như Túi đồ: tên, đẳng cấp, phẩm cấp, màu tên, thuộc tính, mô tả.
- Hạ phẩm trắng; Trung phẩm xanh dương; Thượng phẩm vàng; Cực phẩm đỏ. Thuộc tính dùng màu phù hợp.
- Hiện giá trị cơ sở và khoảng giá Bot có thể mua.
- **Giá muốn bán do người chơi tự nhập, không tự động điền.**
- Bot chỉ mua nếu giá nhập nằm trong phạm vi **±10% giá trị cơ sở**.
- Người chơi chọn loại tiền rồi nhập số, tránh số quá dài.
- Vật phẩm đăng bán tồn tại **3 ngày**, quá 3 ngày tự động trả về túi đồ.

## 15. Tiền tệ
- Thứ tự hiển thị: **Linh thạch → Vàng → Bạc → Đồng**.
- Tỷ lệ: 1000 Đồng = 1 Bạc; 1000 Bạc = 1 Vàng; 1000 Vàng = 1 Linh thạch.
- Khi cần tránh số quá dài, dùng dạng **vạn**; không hiển thị chuỗi số quá dài.
- Icon lấy từ thư mục `nganluong` và `linhthach` đã tạo.

## 16. UI & Asset
- Phong cách nền tối, viền vàng/xanh, võ hiệp/tu tiên.
- Mỗi menu chỉ có một hàng tên chính.
- Luyện Đan/Luyện Khí/Hợp Thành dùng bố cục chung.
- Hình lớn bên trái; thao tác/thông tin bên phải.
- Khung hình phải cố định để thay ảnh không làm vỡ layout.
- Khung ảnh Luyện Đan/Luyện Khí/Hợp Thành theo kích thước hiển thị **373×677 px**, ảnh phải lấp đầy khung.
- Click khung có thể hiện **THAY HÌNH / Click để chọn hình**.

### Asset chính thức
- Hình ảnh: `src/assets/images/`
- Icon: `src/assets/icons/`
- Tên theo chức năng, tiếng Việt không dấu.
- Ví dụ: `hinhdanlo`, `hinhbualuyenkhi`, `hinhhopthanh`, `iconluyendan`, `iconluyenkhi`, `iconhopthanh`.
- Thay ảnh cùng chức năng thì giữ nguyên tên file.
- `src/ui/assets.js` là nơi mapping asset khi phù hợp.
- Không tự tạo thư mục asset mới.

## 17. Ý tưởng & hướng đi
- Progression dài hạn phải có nhiều nguồn sức mạnh: Level, Skill Training, trang bị, nghề, vật phẩm vĩnh viễn và Trùng Sinh.
- Luyện Đan/Luyện Khí phải có cảm giác là nghề tu luyện, không chỉ là nút chế tạo.
- Tán Tu tập trung vào khám phá bí kíp.
- UI ưu tiên thông tin trực quan, popup gần con trỏ, màu phẩm cấp nhất quán và khung ảnh cố định.

## 18. MENU NHIỆM VỤ — THIẾT KẾ ĐÃ CHỐT

### 18.1 Nhiệm vụ tiêu diệt quái vật
- Đi tới các map phù hợp với Level nhân vật.
- Map/quái có thể chênh lệch khoảng **±5 Level** so với nhân vật.
- Dưới Lv50: **30–60 quái**.
- Trên Lv50: **60–100 quái**.
- Lv90–200: **200–300 quái**.
- **Nhiệm vụ quái vật nhận và làm được cả ngày.**
- **Không giới hạn tổng số nhiệm vụ có thể nhận hoặc hoàn thành trong ngày.**
- **Chỉ giới hạn tối đa 2 nhiệm vụ quái vật đang nhận cùng lúc.**
- Hoàn thành nhận **tiền + linh dược**.
- Đây là nhiệm vụ có thể tiếp tục nhận/làm trong ngày, **không phải daily quest có quota**.

### 18.2 Nhiệm vụ truy nã
- Đối tượng giống boss nhỏ, phân bổ ngẫu nhiên ở các map.
- Người chơi phải tới map và tìm người bị truy nã.
- **Xác suất gặp thấp**, tạo cảm giác phải đi tìm mới thấy.
- Mỗi lần tối đa **1 nhiệm vụ truy nã đang nhận**.
- Có **5 nhân vật truy nã** trong danh sách.
- Danh sách 5 mục **làm mới mỗi 1 giờ**.
- Tối đa **10 nhiệm vụ truy nã/ngày**.
- Thưởng: **EXP + tiền thưởng + đan dược + linh dược**.

### 18.3 UI Nhiệm vụ
- Hai tab/khu vực: **Nhiệm vụ quái vật** và **Truy nã**.
- Quái vật: map, Level phù hợp, loại quái, số lượng, tiến độ `đã giết/tổng`, phần thưởng, trạng thái.
- Truy nã: 5 thẻ nhân vật, hình, tên, map, thông tin mục tiêu, phần thưởng, trạng thái.
- Có đồng hồ tới lần refresh truy nã.
- Hiển thị rõ giới hạn đang nhận: quái vật 2, truy nã 1.
- Không hiển thị giới hạn “nhiệm vụ/ngày” cho nhiệm vụ quái vật vì **không có giới hạn ngày**.

### 18.4 Hướng gameplay
- Nhiệm vụ quái vật = hoạt động săn ổn định theo Level/map, cung cấp tiền + linh dược.
- Truy nã = hoạt động hiếm/khó đoán, tạo động lực di chuyển và tìm mục tiêu đặc biệt.
- Sau này có thể mở rộng map, quái, mục tiêu và phần thưởng nhưng giữ nguyên hai triết lý này.

## 19. Roadmap
### Giai đoạn 1 — Nền tảng
- Ổn định GitHub Pages/build.
- Ổn định asset.
- Không phá inventory/item khi refactor.
### Giai đoạn 2 — Gameplay lõi
- Nhân vật + thuộc tính + Trùng Sinh.
- Skill Training + yêu cầu vũ khí.
- Trang bị 4 đẳng cấp × 4 phẩm cấp.
### Giai đoạn 3 — Nghề
- Luyện Đan, Luyện Khí, Đan phương, Bản vẽ, Hợp Thành.
### Giai đoạn 4 — UX
- Popup vật phẩm gần con trỏ.
- So sánh trang bị.
- Bán nhanh.
- Túi 5×30.
### Giai đoạn 5 — Nội dung
- Tán Tu/bí kíp.
- Môn phái/cây skill.
- Công thức/nguyên liệu/bản vẽ/đan phương.
- Menu Nhiệm Vụ: quái vật + truy nã theo mục 18.

## 20. Nhật ký quyết định
- Max nhân vật 200.
- Trùng Sinh về Lv1 +50 điểm vĩnh viễn, giữ giá trị vĩnh viễn và Võ kỹ.
- Skill Level khác Training Level.
- Training +10 giới hạn mỗi Trùng Sinh.
- Đan dược 8 loại Lv1–10.
- Linh dược/khoáng thạch 12 loại Lv1–10.
- Hợp Thành vật liệu/đan dược 2→1, vượt cấp 1–5%.
- Đan phương/Bản vẽ cấp cao 4 mảnh → 1 tấm.
- Asset mới dùng `src/assets/images/` và `src/assets/icons/`.
- **Nhiệm vụ quái vật: cả ngày, không giới hạn tổng số; tối đa 2 nhiệm vụ đang nhận.**
- **Truy nã: tối đa 1 đang nhận, 5 mục refresh mỗi giờ, tối đa 10/ngày.**

## 21. Quy trình ghi chú
- Ý tưởng mới → mục 17.
- Ý tưởng đã chốt → mục hệ thống tương ứng + nhật ký.
- Thay đổi đã code → cập nhật tài liệu cùng commit.
- Asset mới → ghi tên/chức năng vào mục 16.
- Nếu có mâu thuẫn, ưu tiên quyết định mới nhất người dùng đã chốt.
