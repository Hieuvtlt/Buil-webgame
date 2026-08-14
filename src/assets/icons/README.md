# Icon game — thư mục chính thức

Đây là **thư mục chính thức** dành cho toàn bộ icon dùng trong giao diện và chức năng game.

## Quy tắc đặt tên

Tên icon phải mô tả đúng chức năng, ưu tiên tiếng Việt không dấu để dễ tìm:

| Tên file | Chức năng |
|---|---|
| `icontrangbi.svg` | Icon nhóm Trang bị |
| `iconnguyenlieu.svg` | Icon nhóm Nguyên liệu |
| `icondanduoc.svg` | Icon nhóm Đan dược |
| `iconskill.svg` | Icon nhóm Kỹ năng |
| `equipment.svg` | Asset icon trang bị |
| `material.svg` | Asset icon nguyên liệu |
| `potion.svg` | Asset icon đan dược |
| `skill.svg` | Asset icon kỹ năng |

Ví dụ icon mới:
- `iconluyendan.svg` → icon menu Luyện Đan
- `iconluyenkhi.svg` → icon menu Luyện Khí
- `iconhopthanh.svg` → icon menu Hợp Thành
- `icontrungsinh.svg` → icon hệ thống Trùng Sinh

## Quan trọng

- **Icon mới phải ưu tiên lưu ở đây.**
- Code giao diện lấy đường dẫn qua `src/ui/assets.js`.
- Khi thay icon, giữ nguyên tên file thì không cần sửa logic game.
- Không tạo thêm thư mục icon UI ở nơi khác nếu không có lý do đặc biệt.
