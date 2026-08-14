# GAME ARCHITECTURE — Sổ tay trung tâm của Game

> **Đây là tài liệu bàn giao chính thức.** Khi đổi tài khoản, đổi phiên ChatGPT hoặc tiếp tục dự án ở nơi khác, đọc file này trước. Tài liệu ghi: gameplay đã chốt, ý tưởng/hướng đi, nguyên tắc UI, asset và roadmap.

## 0. Quy tắc làm việc
- Đây là nguồn ghi chú trung tâm cho các quyết định của dự án.
- **Ý tưởng mới** phải được ghi lại; chưa chốt thì không tự biến thành gameplay bắt buộc.
- **Yêu cầu đã chốt** phải được ghi vào hệ thống tương ứng và nhật ký quyết định.
- Khi người dùng nói **“sửa game”**: sửa trực tiếp code/repository, không chuyển sang tạo ảnh/mockup.
- Khi thay đổi gameplay đã chốt: cập nhật file này cùng code.
- Không tự ý đổi công thức, UI hoặc quy tắc đã chốt vì lý do “có cách hay hơn”. Nếu có đề xuất, ghi vào phần Ý tưởng và chờ chốt.
- Khi tiếp tục dự án: đọc file này → kiểm tra code thực tế → mới sửa.

## 1. Tầm nhìn & hướng game
- Game web tu tiên/võ hiệp, lấy **VLTK** làm nền tham chiếu cho thuộc tính/sát thương.
- Đã bỏ **Đường Môn** và **Thúy Yên**.
- Các môn phái còn lại có hệ thống skill sẵn; đủ cấp và bí kíp/điều kiện thì học.
- **Tán Tu** là hướng riêng: không có võ công môn phái sẵn, phải tìm/học bí kíp.
- Mục tiêu là progression dài hạn: nhân vật → môn phái/Tán Tu → võ kỹ → trang bị → nguyên liệu → Luyện Đan/Luyện Khí → Hợp Thành → Trùng Sinh → mở rộng giới hạn → tiếp tục phát triển.
- Mỗi hệ thống phải có lý do tồn tại và liên kết với hệ thống khác.

## 2. Nhân vật & thuộc tính
- Max cấp cố định **200**.
- Mỗi lần lên cấp **+5 điểm thuộc tính tự do**.
- 1 điểm tự do vào Sinh khí = **+5 HP**.
- 1 điểm tự do vào Nội công/Mana = **+5 MP**.
- HP/MP do game tự giới hạn; sát thương và thuộc tính khác lấy VLTK làm nền.
- Bỏ: **Kháng tất cả, Tốc độ đánh, các kỹ năng nội công**.
- HP/MP: 100% = 200 điểm; 120% = 250 điểm.
- Sức mạnh, Thân pháp, Sinh khí, Nội công: 100% = 20 điểm; 120% = 25 điểm.
- Kháng tính: mỗi món tối đa +20% cho một loại; tổng mỗi loại tối đa **80%**, không cho 100% miễn sát thương.

## 3. Trùng Sinh
- Trùng Sinh 1: **Lv100 + Trùng Sinh Đan Lv1**.
- Trùng Sinh 2: **Lv120 + Trùng Sinh Đan Lv2**; các lần sau theo hệ thống Trùng Sinh.
- Trùng Sinh xong về **Lv1**.
- Điểm do lên cấp reset.
- Nhận **+50 điểm thuộc tính vĩnh viễn**, không phải 50 điểm tự do tạm thời.
- Giữ điểm từ Tẩy Tủy Kinh, Võ Lâm Mật Tịch và giá trị đã dùng từ Thiên Cơ Đan.
- Võ kỹ/skill và Training giữ nguyên.
- Skill Training / Luyện Đan Training / Luyện Khí Training: giới hạn = **10 + Trùng Sinh × 10**.

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

Trần thuộc tính:
- Hoàng +30%.
- Huyền +50%.
- Địa +80%.
- Thiên đặc biệt +80–120%.

Màu từng dòng thuộc tính phải thể hiện loại thuộc tính để dễ đọc. Skill có yêu cầu vũ khí.

## 5. Đan dược
Có **8 loại hiện tại**:
1. Khí Huyết Đan — hồi HP.
2. Hồi Khí Đan — hồi MP.
3. Tụ Linh Đan — EXP nhân vật.
4. Ngộ Đạo Đan — EXP võ kỹ.
5. Trùng Sinh Đan — Trùng Sinh.
6. Thiên Cơ Đan — tăng thuộc tính ngẫu nhiên.
7. Đan Tâm Đan — EXP Luyện Đan.
8. Khí Linh Đan — EXP Luyện Khí.

Level 1–10: Lv1 = nhân vật 1–10; Lv2 = 11–20; ...; Lv9 = 81–90; Lv10 = 91–200.

Thiên Cơ Đan:
- Thuộc tính %: +1–5% ngẫu nhiên.
- Thuộc tính dạng điểm: +1–100 điểm ngẫu nhiên.
- Dùng không giới hạn.
- Giá trị đã nhận giữ qua Trùng Sinh.

## 6. Linh dược & Khoáng thạch
- Linh dược: **12 loại**, Lv1–10.
- Khoáng thạch: **12 loại**, Lv1–10.
- Là nguyên liệu chính cho Luyện Đan/Luyện Khí.

## 7. Tẩy Tủy Kinh & Võ Lâm Mật Tịch
- Tẩy Tủy Kinh: **+5 điểm tự do/lần**, không giới hạn.
- Võ Lâm Mật Tịch: **+10 điểm tự do/lần**, không giới hạn.
- Điểm đã nhận giữ vĩnh viễn qua Trùng Sinh.

## 8. Võ học / Skill
- Không cộng điểm kỹ năng.
- **Skill Level** = đẳng cấp/yêu cầu để học, khác Training Level.
- Ví dụ Skill Level 60 → nhân vật cần Lv60; học xong bắt đầu Training Level 1.
- Training tăng bằng EXP; thuộc tính/hiệu quả skill tăng dần theo Training.
- Chưa Trùng Sinh max 10; TS1 max 20; TS2 max 30...
- Hiển thị dạng **hiện tại/giới hạn**, ví dụ `3/10`, `10/20`.
- Skill có yêu cầu vũ khí.
- Bỏ toàn bộ kỹ năng nội công.
- Ngộ Đạo Đan tăng EXP luyện skill.

## 9. Túi đồ
- **5 trang × 30 ô = 150 ô**; trang 1–5 hoạt động.
- Click vật phẩm → thông tin xuất hiện gần con trỏ.
- Nếu đang trang bị → hiện thêm khung **Đang trang bị** để so sánh.
- Có nút **Thay thế** ngay tại khu vực so sánh.
- Bán nhanh: trang bị Trắng/Xanh/Vàng/Đỏ; đan dược Lv1–10; linh dược Lv1–10.

## 10. Đan phương & Bản vẽ
### Đan phương
- Level 1–10 tương ứng đan dược.
- Học 1 lần → công thức vĩnh viễn.
- Lv1–4: 1 tấm cùng Level để học.
- Lv5 trở lên: **4 mảnh cùng Level → 1 tấm hoàn chỉnh cùng Level**.

### Bản vẽ
- Phân theo **đẳng cấp + phẩm cấp + vị trí trang bị**.
- Ví dụ: Hoàng cấp Hạ phẩm – Áo; Huyền cấp Trung phẩm – Mũ.
- Học 1 lần → công thức vĩnh viễn.
- Quy tắc mảnh giống Đan phương: Lv1–4 dùng 1 tấm; từ Lv5 dùng 4 mảnh cùng Level → 1 tấm hoàn chỉnh.

## 11. Luyện Đan
- Có **Alchemy Training** riêng.
- Chưa Trùng Sinh max 10; mỗi Trùng Sinh +10.
- Hiển thị `hiện tại/giới hạn`.
- **Chỉ nhận EXP khi luyện thành công**.
- Training tăng → hiệu quả/thuộc tính nghề tăng dần.
- Công thức:
  - Lv1: 2 loại linh dược Lv1.
  - Lv2: 3 loại linh dược Lv2.
  - Lv3: 4 loại linh dược Lv3.
  - Mỗi Level +1 loại.
  - Lv10: 12 loại linh dược Lv10.
- Chỉ luyện công thức đã học bằng Đan phương.
- Đan Tâm Đan tăng EXP nghề.

## 12. Luyện Khí
- Có **Forging Training** riêng.
- Chưa Trùng Sinh max 10; mỗi Trùng Sinh +10.
- Hiển thị `hiện tại/giới hạn`.
- **Chỉ nhận EXP khi luyện thành công**.
- Dùng 12 loại khoáng thạch.
- Công thức bắt đầu: Hoàng cấp Hạ phẩm = 3 loại khoáng thạch Lv1; Trung phẩm = 4 loại Lv2; tiếp tục tăng số loại theo thiết kế.
- Bản vẽ quyết định loại trang bị, đẳng cấp, phẩm cấp, vị trí.
- Khí Linh Đan tăng EXP nghề.

## 13. Hợp Thành
### Đan dược / Linh dược / Khoáng thạch
- **2 vật phẩm cùng loại + cùng Level → 1 vật phẩm Level kế tiếp**.
- Xác suất vượt thêm 1 Level: **1–5%**.
- Ví dụ 2 Lv1 → Lv2; nếu vượt cấp → Lv3.
- Không vượt Lv10 nếu chưa có quy tắc mới.

### Đan phương / Bản vẽ
- Hệ thống riêng: từ Lv5 trở lên **4 mảnh cùng Level → 1 tấm hoàn chỉnh**.
- Không áp dụng quy tắc 2→1 ở trên.

## 14. UI hiện tại
- Phong cách nền tối, viền vàng/xanh, võ hiệp/tu tiên.
- Mỗi menu chỉ có **1 hàng tên chính**, không lặp tiêu đề.
- Luyện Đan/Luyện Khí/Hợp Thành dùng chung bố cục game hiện tại.
- Hình minh họa lớn bên trái; thao tác/thông tin bên phải.
- Hình chỉ thay phần trình bày, không làm thay đổi logic.
- Khi sửa từ ảnh chụp, chỉ sửa phần được yêu cầu và không phá phần đang chạy.

## 15. Asset — QUY TẮC CỐ ĐỊNH
### Hình ảnh
Thư mục chính thức: `src/assets/images/`

Ví dụ:
- `hinhdanlo.svg` — Đan Lô menu Luyện Đan.
- `hinhbualuyenkhi.svg` — Búa + Đe menu Luyện Khí.
- `hinhhopthanh.svg` — hình minh họa Hợp Thành.

### Icon
Thư mục chính thức: `src/assets/icons/`

### Quy tắc
- Tên file theo **chức năng**, tiếng Việt không dấu, dễ hiểu.
- Ví dụ `hinhdanlo`, không dùng `image123`.
- Icon tương tự: `iconluyendan`, `iconluyenkhi`, `iconhopthanh`.
- Nếu thay hình cùng chức năng, giữ nguyên tên file để không phải sửa code.
- `src/ui/assets.js` là nơi quản lý mapping asset cho UI khi phù hợp.
- Không tạo thư mục asset mới tùy tiện.
- Asset cũ đang được hệ thống sử dụng không tự ý di chuyển; phải kiểm tra reference trước.
- **Từ nay mọi hình/icon mới được chèn vào game phải theo cấu trúc này.**

## 16. Ý tưởng & hướng phát triển dài hạn
> Phần này dùng để lưu **những ý tưởng, triết lý và hướng đi** để người phát triển ở phiên sau hiểu game muốn trở thành gì. Ý tưởng chưa chốt không tự động thành tính năng.

### 16.1. Progression tổng thể
`Nhân vật → Môn phái/Tán Tu → Võ kỹ → Trang bị → Nguyên liệu → Luyện Đan/Luyện Khí → Hợp Thành → Trùng Sinh → mở rộng giới hạn → tiếp tục tu luyện`

Mục tiêu: progression dài hạn nhưng không chỉ phụ thuộc Level.

### 16.2. Triết lý cân bằng
- Lấy VLTK làm nền nhưng không sao chép máy móc.
- HP/MP và thuộc tính điểm có trần riêng để tránh ảo chỉ số.
- Kháng tối đa 80%, không cho miễn sát thương 100%.
- Trang bị mạnh dần Hoàng → Huyền → Địa → Thiên, nhưng luôn có giới hạn dòng và %.
- Thiên cấp là tầng đặc biệt 80–120%.
- Trùng Sinh + Training + vật phẩm vĩnh viễn + công thức đã học tạo progression dài hạn.

### 16.3. Triết lý nghề Luyện Đan/Luyện Khí
- Hai nghề phải giống **nghề tu luyện**, không chỉ là nút chế tạo.
- Người chơi đầu tư nguyên liệu, công thức và thời gian để tăng Training.
- Chỉ thành công mới nhận EXP giúp lựa chọn công thức có ý nghĩa.
- Đan Tâm Đan/Khí Linh Đan hỗ trợ progression nhưng không được làm mất giá trị tự luyện.
- Sau này có thể mở bonus theo Training Level nhưng không được phá trần thuộc tính/trang bị.

### 16.4. Đan phương & Bản vẽ
- Là hệ thống **mở khóa công thức vĩnh viễn**, không phải vật phẩm tiêu hao thông thường.
- Cấp thấp dễ tiếp cận; cấp cao cần thu thập mảnh để tạo mục tiêu dài hạn.
- Bản vẽ nhiều nhánh theo đẳng cấp/phẩm cấp/vị trí để tạo mục tiêu sưu tầm.

### 16.5. Tán Tu
- Không biến Tán Tu thành “môn phái thứ N”.
- Sức mạnh đến từ tìm/học bí kíp.
- Tạo cảm giác khám phá và xây dựng nhân vật tự do.

### 16.6. Trùng Sinh
- Là reset có phần thưởng vĩnh viễn, không phải reset mất sạch.
- Mỗi Trùng Sinh mở thêm không gian progression thông qua Training.
- Giữ các giá trị vĩnh viễn và Võ kỹ để người chơi không phải làm lại toàn bộ.
- Về sau có thể có nội dung riêng theo mốc Trùng Sinh, nhưng không phá vòng Lv1–200.

### 16.7. UI/UX
- Thống nhất bố cục giữa các menu.
- Thông tin vật phẩm gần con trỏ.
- So sánh trực tiếp trang bị đang mặc với vật phẩm đang xem và có nút Thay thế.
- Màu phẩm cấp/thuộc tính nhất quán toàn game.
- Hình minh họa tạo bản sắc nhưng không được làm chậm hoặc phá responsive.

### 16.8. Menu Nhiệm Vụ — hệ thống nhiệm vụ dự kiến
> Đây là thiết kế đã được người dùng đưa ra để làm khung gameplay cho menu **Nhiệm vụ**. Khi bắt đầu code menu này, phải bám các quy tắc dưới đây; không tự ý đổi số lượng, giới hạn hoặc cơ chế nếu chưa được chốt lại.

#### A. Nhiệm vụ tiêu diệt quái vật
- Nhiệm vụ yêu cầu người chơi đi tới **các map phù hợp với Level nhân vật** để tiêu diệt quái vật.
- Phạm vi Level của quái/map có thể **chênh lệch ±5 Level** so với Level nhân vật.
- Số lượng quái cần tiêu diệt theo mốc Level:
  - Nhân vật **dưới Lv50**: khoảng **30–60 quái**.
  - Nhân vật **trên Lv50**: khoảng **60–100 quái**.
  - Nhân vật **Lv90–200**: khoảng **200–300 quái**.
- Nhiệm vụ mang tính **nhiệm vụ trong ngày**.
- Mỗi lần nhận có thể nhận **tối đa 2 nhiệm vụ**.
- Khi hoàn thành, phần thưởng gồm **tiền + linh dược**.
- Nhiệm vụ phải ưu tiên tạo cảm giác đi săn quái theo map/Level, không chỉ là một nút nhận thưởng.

#### B. Nhiệm vụ truy nã
- Đối tượng là các nhân vật/quái **giống boss nhỏ**, được phân bổ **ngẫu nhiên ở các map**.
- Mục tiêu: tới đúng map và tìm/tiêu diệt người bị truy nã.
- **Xác suất gặp thấp**, cố ý tạo cảm giác phải đi tìm mới gặp; không được thiết kế kiểu chắc chắn vừa vào map là thấy ngay.
- Mỗi lần chỉ được nhận **tối đa 1 nhiệm vụ truy nã đang hoạt động**.
- Menu truy nã có **5 nhân vật bị truy nã** để người chơi lựa chọn.
- Danh sách 5 mục truy nã **làm mới mỗi 1 giờ**.
- Giới hạn mỗi ngày: người chơi chỉ được **hoàn thành tối đa 10 nhiệm vụ truy nã/ngày**.
- Phần thưởng khi hoàn thành gồm:
  - **EXP**.
  - **Tiền thưởng**.
  - **Đan dược**.
  - **Linh dược**.
- Truy nã phải tạo cảm giác phiêu lưu/tìm kiếm và có tính ngẫu nhiên cao hơn nhiệm vụ quái vật.

#### C. Hướng UI cho menu Nhiệm Vụ
- Menu Nhiệm Vụ nên có **2 khu vực/tab chính**:
  1. **Nhiệm vụ quái vật**.
  2. **Truy nã**.
- Khu nhiệm vụ quái vật cần thể hiện rõ: map mục tiêu, Level phù hợp, loại quái, số lượng cần giết, tiến độ `đã giết/tổng`, phần thưởng và trạng thái nhiệm vụ.
- Khu truy nã cần thể hiện 5 thẻ nhân vật bị truy nã; mỗi thẻ nên có hình, tên, map, thông tin mục tiêu, phần thưởng và trạng thái đã nhận/chưa nhận.
- Nên có đồng hồ đếm thời gian tới lần làm mới danh sách truy nã tiếp theo.
- Cả hai loại nhiệm vụ đều cần thể hiện giới hạn nhận/làm trong ngày để người chơi dễ hiểu.
- Hình ảnh nhân vật/quái/truy nã phải đi theo quy tắc asset chung: lưu trong thư mục asset chính thức, tên file theo chức năng, không dùng tên ngẫu nhiên.

#### D. Hướng gameplay dài hạn
- Nhiệm vụ quái vật là hoạt động ổn định hằng ngày, giúp người chơi kiếm **tiền + linh dược** và kết nối trực tiếp với hệ thống map/quái.
- Truy nã là hoạt động hiếm và khó đoán hơn, tạo động lực di chuyển giữa các map và săn mục tiêu đặc biệt.
- Hai loại nhiệm vụ phải bổ trợ progression: quái vật → nguyên liệu/kinh tế; truy nã → EXP + vật phẩm/tiền thưởng đa dạng.
- Về sau có thể mở rộng map, loại quái, mục tiêu truy nã và phần thưởng nhưng phải giữ nguyên triết lý: **nhiệm vụ quái vật = săn theo Level/map; truy nã = tìm mục tiêu ngẫu nhiên với xác suất gặp thấp**.

## 17. Roadmap
### Giai đoạn 1 — Nền tảng
- Ổn định GitHub Pages/build.
- Ổn định cấu trúc asset.
- Không phá inventory/item khi refactor.

### Giai đoạn 2 — Gameplay lõi
- Nhân vật + thuộc tính + Trùng Sinh.
- Skill Training + yêu cầu vũ khí.
- Trang bị 4 đẳng cấp × 4 phẩm cấp.

### Giai đoạn 3 — Nghề
- Luyện Đan Training.
- Luyện Khí Training.
- Đan phương/Bản vẽ kết nối công thức.
- Hợp Thành.

### Giai đoạn 4 — UX
- Popup vật phẩm gần con trỏ.
- So sánh trang bị.
- Bán nhanh.
- Túi 5 × 30.

### Giai đoạn 5 — Nội dung
- Tán Tu/bí kíp.
- Môn phái/cây skill.
- Công thức, nguyên liệu, bản vẽ, đan phương.
- **Menu Nhiệm Vụ:** nhiệm vụ quái vật + truy nã theo thiết kế mục 16.8.
- Sau khi gameplay ổn định mới đầu tư mạnh hơn vào hiệu ứng/hình ảnh.

## 18. Nhật ký quyết định quan trọng
- VLTK là nền tham chiếu; bỏ Kháng tất cả, Tốc độ đánh và kỹ năng nội công.
- Max nhân vật 200.
- Trùng Sinh: về Lv1 + **50 điểm vĩnh viễn**, giữ giá trị Tẩy Tủy Kinh/Võ Lâm Mật Tịch/Thiên Cơ Đan và giữ Võ kỹ.
- Skill Level khác Training Level.
- Skill/Luyện Đan/Luyện Khí Training đều +10 giới hạn mỗi Trùng Sinh.
- Đan dược hiện tại có 8 loại, Lv1–10.
- Linh dược và khoáng thạch: 12 loại, Lv1–10.
- Hợp Thành vật liệu/đan dược: 2→1, vượt cấp 1–5%.
- Đan phương/Bản vẽ cấp cao: 4 mảnh cùng Level → 1 tấm.
- Asset mới: `src/assets/images/` và `src/assets/icons/`.
- `GAME_ARCHITECTURE.md` là sổ tay trung tâm khi đổi tài khoản/phiên.
- **Menu Nhiệm Vụ:** 2 loại nhiệm vụ — tiêu diệt quái vật và truy nã; truy nã có 5 mục làm mới mỗi giờ, tối đa 1 nhiệm vụ đang nhận và tối đa 10 nhiệm vụ/ngày.

## 19. Quy trình ghi chú từ nay
- **Ý tưởng mới:** ghi vào mục 16.
- **Ý tưởng được chốt:** chuyển thành quy tắc ở mục hệ thống tương ứng + nhật ký.
- **Thay đổi đã code:** cập nhật tài liệu cùng commit.
- **Asset mới quan trọng:** ghi tên/chức năng vào mục 15.
- Nếu có mâu thuẫn, ưu tiên quyết định mới nhất mà người dùng đã chốt và xóa/sửa quy tắc cũ trong tài liệu.
- Không để kiến trúc, ý tưởng và code đi lệch nhau quá lâu.
