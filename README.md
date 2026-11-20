# Anime Cooking ASMR — Official Website

Website tĩnh (HTML5, CSS3, JavaScript thuần) được xây dựng để quảng bá kênh YouTube **Anime Cooking ASMR** và tích hợp hệ thống tiếp thị liên kết **Shopee Affiliate Việt Nam**.

- **Kênh YouTube:** https://www.youtube.com/channel/UCTxSZlfMkxZZ88-GN22Z1sg
- **Hosting đề xuất:** GitHub + Cloudflare Pages (100% miễn phí)

---

## Cấu trúc thư mục dự án

```text
anime-cooking-asmr-website/
├── index.html      # Cấu trúc toàn bộ trang web
├── styles.css      # Giao diện, bảng màu, font chữ, responsive
├── config.js       # Cấu hình chung (tên thương hiệu, link YouTube, email, ảnh nhận diện)
├── resources.js    # File chỉnh sửa thường xuyên nhất (danh sách video & sản phẩm Shopee)
├── app.js          # Xử lý hiển thị video, sản phẩm, bộ lọc và kiểm tra link Affiliate
└── README.md       # Tài liệu hướng dẫn triển khai & cập nhật
```

---

## 1. Tạo Repository trên GitHub và Upload mã nguồn

1. Đăng nhập vào tài khoản GitHub tại https://github.com/
2. Nhấn nút **New** (hoặc dấu **+** ở góc phải trên -> **New repository**).
3. Đặt tên repository chính xác là: `anime-cooking-asmr-website`
4. Chọn chế độ **Public** -> nhấn **Create repository**.
5. Nhấn vào dòng **uploading an existing file**.
6. Giải nén file ZIP trên máy tính, mở vào bên trong thư mục `anime-cooking-asmr-website/`, chọn cả **6 file** (`index.html`, `styles.css`, `config.js`, `resources.js`, `app.js`, `README.md`) và kéo thả vào GitHub.
   > **Lưu ý quan trọng:** Upload trực tiếp 6 file vào thư mục gốc của repository (để `index.html` nằm ngay ngoài cùng).
7. Nhấn nút xanh **Commit changes** để lưu lại.

---

## 2. Triển khai miễn phí lên Cloudflare Pages

1. Đăng nhập vào Cloudflare tại https://dash.cloudflare.com/
2. Ở menu bên trái, chọn **Workers & Pages**.
3. Nhấn **Create application** -> chuyển sang tab **Pages** -> chọn **Connect to Git**.
4. Kết nối tài khoản GitHub và chọn repository `anime-cooking-asmr-website`.
5. Cấu hình Build:
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** để trống
   - **Build output directory:** để trống (hoặc `/`) vì `index.html` nằm ở thư mục gốc.
6. Nhấn **Save and Deploy**. Sau khoảng 1 phút, website sẽ hoạt động tại đường dẫn `https://anime-cooking-asmr-website.pages.dev`.

---

## 3. Cách cập nhật website sau này

Mỗi khi bạn chỉnh sửa file trên GitHub (ví dụ cập nhật `resources.js` hoặc `config.js`) và nhấn **Commit changes**, Cloudflare Pages sẽ **tự động cập nhật website** sau khoảng 30–60 giây.

---

## 4. Cách thêm video YouTube mới

Mở file `resources.js`, tìm mảng `VIDEOS` và thêm một khối mới theo mẫu:

```javascript
{
  id: "VIDEO_ID_MOI",
  title: "Tiêu đề video tiếng Anh",
  description: "Mô tả ngắn gọn về món ăn trong video.",
  url: "https://www.youtube.com/shorts/VIDEO_ID_MOI"
}
```

Thumbnail sẽ tự động lấy từ `https://img.youtube.com/vi/VIDEO_ID_MOI/hqdefault.jpg`.

---

## 5. Cách thêm sản phẩm Shopee Affiliate

1. Đăng nhập https://affiliate.shopee.vn/ và tạo **link Affiliate chính thức** cho sản phẩm.
2. Mở file `resources.js`, tìm mảng `PRODUCTS`.
3. Dán link Affiliate vào trường `affiliateUrl` (và dán link ảnh sản phẩm vào `imageUrl` nếu có):

```javascript
{
  id: "ten-san-pham-khong-dau",
  name: "Product Name in English",
  category: "Japanese Tableware", // Chọn 1 trong 4: Japanese Tableware, Kitchen Tools, Cookware, Cute Kitchen
  description: "Short English description of the product.",
  imageUrl: "https://link-anh-san-pham.jpg",
  affiliateUrl: "https://s.shopee.vn/..."
}
```

- Khi `affiliateUrl` hợp lệ: Nút sẽ tự động đổi thành **SHOP NOW**, mở tab mới và gắn `rel="sponsored nofollow noopener"`.
- Khi `affiliateUrl` để trống `""`: Nút sẽ hiển thị **LINK COMING SOON** và không dẫn tới đường link giả.

---

## 6. Cách cập nhật Logo, Avatar, Banner sau này (Giai đoạn 5)

Khi bạn có ảnh chính thức, upload ảnh vào repository (ví dụ thư mục `assets/`), sau đó mở file `config.js` và điền đường dẫn vào mục `branding`:

```javascript
branding: {
  logoUrl: "assets/avatar.jpg",
  heroBannerUrl: "assets/banner.jpg",
  faviconUrl: "assets/favicon.png"
}
```
