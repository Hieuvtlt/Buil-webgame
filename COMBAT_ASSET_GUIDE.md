# Hướng dẫn thay hình Combat

## Bố cục Combat hiện tại

- Nhân vật người chơi bắt đầu ở **giữa chiến trường**: tọa độ logic mặc định `50%, 52%`.
- Quái vật được tạo nhiều đơn vị và hiển thị **thiên về vùng rìa chiến trường**, không gom thành một cụm ngay khi vào combat.
- Quái vẫn dùng tọa độ logic riêng để di chuyển, áp sát và giao tranh; lớp hiển thị chỉ điều chỉnh cách phân bố để tạo cảm giác bao quanh người chơi.
- Click trên chiến trường vẫn là lệnh di chuyển nhân vật.

## Icon đơn vị Combat — vị trí thay đổi về sau

Combat hiện dùng các ô vuông màu làm placeholder:

- Nhân vật: ô trắng.
- Quái thường: ô đỏ.
- Tiểu boss: ô xanh dương.
- Boss hoàng kim: ô vàng.

Không cần sửa logic combat khi muốn đổi sang ảnh nhân vật/quái. Các biến CSS đã được tách riêng trong:

`combat-position-fix.css`

Các biến:

- `--combat-player-icon`
- `--combat-monster-icon`
- `--combat-subboss-icon`
- `--combat-goldboss-icon`

Hiện tại cả bốn biến đều là `none`, nên game vẫn hiển thị ô màu. Sau này chỉ cần đổi biến thành `url('...')` để đưa PNG/WebP/SVG của nhân vật hoặc quái vào ô tương ứng.

Phần xử lý phân bố hiển thị của quái nằm trong:

`combat-position-fix.js`

File này chỉ điều chỉnh lớp hiển thị; không thay đổi dữ liệu HP/MP, sát thương hay logic chiến đấu.

## Asset placeholder quái

`public/assets/combat/monster-common.svg`

Có thể dùng làm hình placeholder hoặc thay bằng asset riêng theo từng loại quái.

## Hình nhân vật

Hình nhân vật chính của hệ thống vẫn lấy từ `getCharacterImageSrc()` và có thể thay đổi theo ảnh nhân vật đã chọn/lưu.

## Icon đan dược trong Combat

- Đan HP: `public/assets/vltk/danduoc/hoimau.png`
- Đan MP: `public/assets/vltk/danduoc/hoimana.png`

## 5 ô kỹ năng Combat

Combat luôn có đúng **5 ô kỹ năng**:

- Ô 1–2: kỹ năng tấn công chủ động.
- Ô 3–5: kỹ năng hỗ trợ chủ động.
- Kỹ năng bị động không chiếm ô combat.
- Khi chưa gán kỹ năng, slot để trống.

## Quy tắc HP / Mana

- HP không tự hồi theo thời gian.
- Mana không tự hồi theo thời gian.
- Chỉ hồi bằng đan dược, kỹ năng, trang bị hoặc hiệu ứng hồi phục.
- Khi chết, hiện **VỀ THÀNH DƯỠNG SỨC** và bấm vào để về menu Nhân vật.

## Auto

- Auto chỉ tồn tại trong giao diện Combat.
- Không sử dụng Auto riêng ở cột phải giao diện chính.
- Bấm Auto trong Combat để mở các lựa chọn Auto.
