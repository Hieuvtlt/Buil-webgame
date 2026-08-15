# Hướng dẫn thay hình Combat

## Khung hình cố định

- Nhân vật: khung `.fighter-image-frame`.
- Quái vật: dùng cùng khung `.fighter-image-frame`.
- Ảnh bên trong dùng `object-fit: contain`, vì vậy thay PNG/WebP không làm vỡ khung.
- Combat hiện bố trí nhân vật bên trái, quái vật bên phải; thanh HP/MP nằm phía trên hình tương ứng.

## Vị trí hình quái mặc định

`public/assets/combat/monster-common.svg`

Đây là hình placeholder dùng cho tất cả quái trong combat ở phiên bản đầu. Sau này có thể thay trực tiếp file này hoặc tách thành từng file theo từng quái mà không cần thay đổi khung combat.

## Vị trí hình nhân vật

Hình nhân vật lấy từ hệ thống `getCharacterImageSrc()` và vẫn ưu tiên ảnh người chơi đã chọn/lưu trong `localStorage`.

## Vị trí icon Ngoại cảnh

Các icon khu vực đang nằm tại:

`public/assets/world/`

Ví dụ:

- `forest.svg`
- `cave.svg`
- `mountain.svg`
- `bandit.svg`
- `water.svg`
- `desert.svg`
- `snow.svg`
- `demon.svg`

Tên file hiện tại được khai báo trong `src/ui/screens/NgoaiCanhScreen.js` ở mảng `areas`. Giữ nguyên tên file khi thay hình sẽ không phải sửa logic map.

## Icon đan dược trong Combat

Hai ô hồi phục ở HUD Combat dùng trực tiếp asset VLTK:

- Đan HP: `public/assets/vltk/danduoc/hoimau.png`
- Đan MP: `public/assets/vltk/danduoc/hoimana.png`

CSS hiển thị hai icon này tại `.combat-item-slot:nth-child(1)` và `.combat-item-slot:nth-child(2)` trong `src/ui/combat.css`.

## 5 ô kỹ năng Combat

Combat luôn có đúng **5 ô kỹ năng**.

- Khi chưa gán kỹ năng: ô trống và chỉ hiện dấu `+`.
- Khi hệ thống menu Kỹ năng gán kỹ năng vào slot: thêm class `.has-skill` cho nút slot để hiện icon/tên kỹ năng.
- Không cần thay đổi vị trí HUD khi đổi kỹ năng.

Các slot được đánh số bằng `data-skill-slot="1"` đến `data-skill-slot="5"`.
