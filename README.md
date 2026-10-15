# Developer Portfolio

Website portfolio full-stack: **React + Three.js** (frontend) và **Spring Boot + PostgreSQL** (backend).

Điểm nổi bật:

- **Cây 3D phát triển**: một cây low-poly mọc lên khi trang mở và tiếp tục lớn khi cuộn xuống; hoa màu cam nở khi cây trưởng thành.
- **Chuyển động mượt**: smooth scroll (Lenis), chữ hiện dần theo từng từ, parallax, mục Dự án ghim lại và trượt ngang khi cuộn (GSAP ScrollTrigger).
- **Con trỏ tùy biến**, màn hình intro và hiệu ứng chuyển trang.
- **Song ngữ EN / VI**, chế độ sáng/tối.
- **Hình giao diện cho mỗi dự án** và trang case study riêng (vấn đề, giải pháp, kiến trúc, kết quả).
- **Backend thật**: form liên hệ lưu vào PostgreSQL, gửi email thông báo, chống spam (honeypot + giới hạn theo IP); API thống kê GitHub có cache.

```
portfolio/
├── frontend/                 React 18 + Vite + TypeScript + Tailwind
│   └── src/
│       ├── content/profile.ts   ← TOÀN BỘ NỘI DUNG CÁ NHÂN (sửa ở đây)
│       ├── three/               Cây 3D (React Three Fiber)
│       ├── sections/            Hero, About, Projects, Skills, Experience, GitHub, Contact
│       ├── pages/               Trang chủ, chi tiết dự án, 404
│       └── components/          Loader, Cursor, Navbar, hiệu ứng Reveal...
├── backend/                  Spring Boot 3.3 + Java 21
│   └── src/main/java/com/portfolio/
│       ├── contact/             POST /api/contact
│       ├── github/              GET  /api/github/stats
│       └── common/, config/     Xử lý lỗi, CORS, cấu hình
├── docker-compose.yml        PostgreSQL + Mailpit + backend để chạy local
├── render.yaml               Cấu hình deploy backend lên Render
└── .github/workflows/ci.yml  Tự động build & test khi push lên GitHub
```

---

## 1. Sửa nội dung của bạn

Mọi thông tin (tên, giới thiệu, dự án, kỹ năng, kinh nghiệm, link) nằm trong **`frontend/src/content/profile.ts`**. Mỗi đoạn chữ có 2 bản `en` và `vi`.

- **CV**: đặt file vào `frontend/public/cv.pdf`.
- **Ảnh đại diện**: đặt file vào `frontend/public/avatar.jpg`, rồi sửa `avatar: '/avatar.jpg'`.
- **Ảnh chụp dự án thật**: đặt vào `frontend/public/shots/ten-du-an.png`, rồi sửa `image: '/shots/ten-du-an.png'` trong dự án đó. Nếu không có ảnh, website tự vẽ giao diện mẫu (`render: 'dash' | 'track' | 'game'`).
- **Tiêu đề trình duyệt và SEO**: sửa `<title>` và các thẻ `meta` trong `frontend/index.html`.

## 2. Chạy trên máy

### Cài đặt cần có

| Công cụ | Dùng cho | Tải về |
|---|---|---|
| Node.js 20+ | Frontend | https://nodejs.org |
| JDK 21 | Backend | https://adoptium.net |
| Maven 3.9+ | Build backend (hoặc dùng VS Code Java Extension) | https://maven.apache.org |
| Docker Desktop | Chạy database + backend bằng 1 lệnh | https://www.docker.com/products/docker-desktop |

### Cách A: chỉ chạy frontend (nhanh nhất)

```bash
cd frontend
npm install
npm run dev
```

Mở http://localhost:5173. Khi backend chưa chạy, mục GitHub hiển thị dữ liệu mẫu, còn form liên hệ báo lỗi và gợi ý gửi email trực tiếp.

### Cách B: chạy đầy đủ với Docker

```bash
docker compose up --build
```

Lệnh này khởi động PostgreSQL (cổng 5432), backend (http://localhost:8080) và Mailpit (http://localhost:8025, nơi xem email gửi từ form liên hệ). Sau đó chạy frontend như Cách A. Vite tự chuyển `/api` sang backend.

### Cách C: chạy backend không dùng Docker

Cần một PostgreSQL đang chạy, có database `portfolio` (user/pass `portfolio`).

```bash
cd backend
mvn spring-boot:run
```

Chạy test: `mvn test`.

## 3. API

| Method | Đường dẫn | Mô tả |
|---|---|---|
| `POST` | `/api/contact` | Body `{ name, email, company?, message, website }`. Trả `201`, hoặc `400` (lỗi kèm từng trường), hoặc `429` (quá 5 tin/giờ/IP). |
| `GET` | `/api/github/stats` | Số repo, sao, follower, ngôn ngữ, repo mới cập nhật. Cache 60 phút. |
| `GET` | `/actuator/health` | Kiểm tra server còn sống (Render dùng). |

## 4. Đưa lên GitHub

```bash
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<username>/portfolio.git
git push -u origin main
```

Sau khi push, tab **Actions** trên GitHub sẽ tự build frontend và chạy test backend.

## 5. Deploy (miễn phí)

**Bước 1: Database trên [Neon](https://neon.tech)**
Tạo project, rồi lấy host, database, user và password trong Connection Details.
`DATABASE_URL` có dạng: `jdbc:postgresql://<host>/<database>?sslmode=require`

**Bước 2: Backend trên [Render](https://render.com)**
Chọn New → Blueprint → chọn repo này (Render đọc file `render.yaml`), rồi điền các biến:

- `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`: lấy từ Neon.
- `APP_CORS_ORIGINS`: URL Vercel của bạn, ví dụ `https://ten-ban.vercel.app`.
- `MAIL_USERNAME`, `MAIL_PASSWORD`: Gmail và [App Password](https://myaccount.google.com/apppasswords) (16 ký tự, **không phải** mật khẩu Gmail).
- `CONTACT_NOTIFY_TO`, `CONTACT_FROM`: email của bạn.
- `GITHUB_USERNAME`: username GitHub của bạn.

> Gói free của Render tạm ngủ sau 15 phút không có truy cập. Lần gọi đầu tiên có thể mất khoảng 30 giây; form liên hệ đã có thông báo cho trường hợp này.

**Bước 3: Frontend trên [Vercel](https://vercel.com)**
Import repo, đặt **Root Directory = `frontend`**, thêm biến môi trường `VITE_API_URL = https://<ten-backend>.onrender.com` rồi bấm Deploy.

## 6. Tùy chỉnh nhanh

| Muốn đổi | Sửa ở đâu |
|---|---|
| Màu sắc (sáng/tối) | Các biến `--accent`, `--signal`... trong `frontend/src/index.css` |
| Font chữ | Link Google Fonts trong `frontend/index.html` và `tailwind.config.js` |
| Hình dáng cây, màu lá | `frontend/src/three/GrowthTree.tsx` (`MAX_DEPTH`, `PALETTE`, seed trong `buildTree(11)`) |
| Tốc độ smooth scroll | `duration` trong `frontend/src/lib/SmoothScroll.tsx` |
| Thời gian intro | `DURATION` trong `frontend/src/components/Loader.tsx` |
| Giới hạn tin nhắn/giờ | `CONTACT_MAX_PER_HOUR` (biến môi trường backend) |

Website tự tắt hiệu ứng chuyển động khi người xem bật "Reduce motion" trong hệ điều hành.
