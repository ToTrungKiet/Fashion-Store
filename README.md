# 🛍️ Fashion-Store - Fullstack E-commerce Website

Fashion-Store là một ứng dụng web thương mại điện tử chuyên bán quần áo, được xây dựng với kiến trúc Fullstack. Dự án bao gồm 3 phần chính: Frontend (Giao diện người dùng), Admin (Trang quản trị) và Backend (Hệ thống API và Cơ sở dữ liệu).

## ✨ Chức năng nổi bật

### 🛒 Giao diện người dùng (Frontend)

- **Xác thực người dùng:** Đăng ký, đăng nhập, quên mật khẩu và đặt lại mật khẩu.
- **Quản lý tài khoản:** Xem và cập nhật thông tin cá nhân (Profile), thay đổi mật khẩu an toàn.
- **Duyệt sản phẩm:** Xem danh sách toàn bộ sản phẩm, sản phẩm nổi bật (Latest Collection), sản phẩm bán chạy (Best Sellers).
- **Tìm kiếm & Lọc:** Công cụ tìm kiếm sản phẩm và lọc theo danh mục, sở thích.
- **Chi tiết sản phẩm:** Xem thông tin chi tiết, chọn kích thước (Size) và màu sắc.
- **Giỏ hàng (Cart):** Thêm sản phẩm vào giỏ, cập nhật số lượng trực tiếp.
- **Thanh toán (Checkout):** Nhập địa chỉ giao hàng, hỗ trợ thanh toán khi nhận hàng (COD) hoặc thanh toán trực tuyến qua **VNPay**.
- **Quản lý đơn hàng:** Theo dõi lịch sử đặt hàng và trạng thái vận chuyển của từng đơn.

### ⚙️ Trang Quản trị (Admin)

- **Dashboard:** Bảng điều khiển tổng quan, thống kê doanh thu và theo dõi các đơn hàng đã hoàn thành.
- **Quản lý Sản phẩm:** Thêm mới, chỉnh sửa thông tin, xóa sản phẩm và xem sản phẩm bán chạy nhất.
- **Quản lý Đơn hàng:** Xem danh sách toàn bộ đơn hàng, cập nhật trạng thái đơn hàng (Đang xử lý, Đang giao, Đã giao...).
- **Quản lý Kho (Warehouse):** Kiểm tra tồn kho và nhập thêm hàng (Restock).

---

## 🚀 Cấu trúc dự án

Dự án được chia thành 3 thư mục chính:

### 1. Frontend (React / Vite)

Cung cấp trải nghiệm mua sắm mượt mà cho khách hàng.

```text
frontend/
├── src/
│   ├── assets/
│   ├── components/      # AddressSelector, BestSeller, CartTotal, Navbar, ProductItem,...
│   ├── context/         # ShopContext
│   ├── pages/           # Home, Cart, Collection, Login, PlaceOrder, Profile, ResetPassword,...
│   ├── App.jsx
│   └── main.jsx
└── package.json

```
### 2. Admin (React / Vite)
Giao diện quản lý dành riêng cho chủ cửa hàng.

```
admin/
├── src/
│   ├── assets/
│   ├── components/      # Navbar, Sidebar
│   ├── pages/           # Add, Dashboard, Edit, List, Login, Orders, Warehouse
│   ├── App.jsx
│   └── main.jsx
└── package.json

```
### 3. Backend (Node.js / Express)
Xử lý logic nghiệp vụ, kết nối cơ sở dữ liệu (MongoDB) và tích hợp thanh toán (VNPay), lưu trữ ảnh (Cloudinary).

```
backend/
├── config/              # cloudinary.js, email.js, mongodb.js
├── controllers/         # Xử lý logic cho cart, order, payment, product, user
├── middleware/          # auth.js, adminAuth.js, multer.js
├── models/              # orderModel.js, productModel.js, userModel.js
├── routes/              # Định tuyến API (cart, order, payment, product, user)
├── services/            # Tách biệt logic nghiệp vụ
├── server.js            # Entry point của server
└── seedWarehouse.js     # Script khởi tạo dữ liệu kho

```
## 🛠️ Hướng dẫn cài đặt (Local Development)

### 1. Clone dự án
```
git clone https://github.com/ToTrungKiet/Fashion-Store.git
cd Fashion-Store

```
### 2. Cài đặt Backend
```
cd backend
npm install
Tạo file .env và cấu hình các biến (MongoDB URI, JWT Secret, VNPay Keys, Cloudinary...)
npm run server

```
### 3. Cài đặt Frontend
```
cd ../frontend
npm install
Tạo file .env cấu hình các biến VITE_BACKEND_URL trỏ về backend
npm run dev

```
### 4. Cài đặt Admin
```
cd ../admin
npm install
Tạo file .env cấu hình các biến VITE_BACKEND_URL trỏ về backend
npm run dev

---

```
## 👥 Thành viên nhóm
```

| STT | Họ và Tên | Vai trò | Nhiệm vụ cụ thể | GitHub |

| 1 | Tô Trung Kiệt | Fullstack Developer | Phát triển toàn bộ hệ thống (Frontend, Admin, Backend cốt lõi) | [@ToTrungKiet](https://github.com/ToTrungKiet) |

| 2 | Bùi Tấn Đạt | Backend Developer | Tích hợp thanh toán VNPay, chức năng Update Profile | [@Tandat-562](https://github.com/Tandat-562) |

| 3 | Nguyễn Hữu Gia Lâm | Backend Developer | Chức năng Forgot Password, Change Password, Quản lý kho hàng & số lượng | [@GiaLaam](https://github.com/GiaLaam) |