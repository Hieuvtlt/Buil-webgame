# Hình ảnh game — thư mục chính thức

Đây là **thư mục chính thức** dành cho mọi hình ảnh lớn/ảnh minh họa được chèn vào giao diện game.

## Quy tắc đặt tên

Đặt tên theo đúng chức năng để sau này thay thế không cần tìm trong code:

| Tên file | Chức năng |
|---|---|
| `hinhdanlo.svg` | Hình Đan Lô của menu Luyện Đan |
| `hinhbualuyenkhi.svg` | Hình Búa + Đe của menu Luyện Khí |
| `hinhhopthanh.svg` | Hình minh họa của menu Hợp Thành |

Ví dụ hình mới:
- `hinhmenukythang.svg` → hình minh họa menu Kỹ Năng
- `hinhthuonghoi.svg` → hình minh họa menu Thương Hội
- `hinhnhanvat.svg` → hình minh họa khu vực Nhân Vật

## Quan trọng

- **Tất cả hình minh họa UI mới phải ưu tiên lưu ở đây.**
- Code giao diện lấy đường dẫn qua `src/ui/assets.js`.
- Khi thay một hình, giữ nguyên tên file thì **không cần sửa logic game**.
- Không tiếp tục tạo thư mục ảnh giao diện mới ở nơi khác nếu không có lý do đặc biệt.
