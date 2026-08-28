# 🎂 The Sweetest Slices — Birthday Memories & 35mm Filmstrip Experience

Trải nghiệm web tương tác sinh nhật gia đình cao cấp (**Interactive Birthday Scrollytelling Experience**) kết hợp mô hình bánh 3D đa tầng (Three.js / React Three Fiber), nghi thức thổi nến bằng Micro (Web Audio API), dải cuộn phim nhựa 35mm cổ điển (35mm Analog Filmstrip Reel) và hệ thống âm thanh đa giác quan xúc giác.

---

## ✨ Tính Năng Nổi Bật

1. **🎨 Phong Cách Bright Warm Editorial (Nền Trắng Ấm & Sứ Ngà):**
   - Tông màu sứ ngà ấm áp (`#FAF8F5`), kem bơ vani (`#FFF8EB`), mật ong ánh kim (`#D4A017`) và đỏ anh đào tươi (`#E04848`).
   - Kiểu chữ tạp chí cao cấp *DM Serif Display* và *Plus Jakarta Sans*.

2. **🍰 Mô Hình Bánh Sinh Nhật 3D Chuẩn Gourmet (`CakeScene.tsx`):**
   - Đĩa sứ chân loe (`Fluted Porcelain Pedestal`) với hiệu ứng bóng đổ tiếp xúc êm dịu (`ContactShadows`).
   - Viền kem bắt bông mịn màng (`Piped Cream Rosettes & Scallops`) và quả cherry đỏ bóng gương.
   - **Mặt cắt lát bánh 3 tầng thực tế:** Lớp bông lan vani trên + Lớp mứt dâu ruby kẹp giữa + Lớp bông lan nướng dưới.
   - Nến sinh nhật với ngọn lửa Shader 2 lớp bập bùng, phản hồi theo cường độ hơi thổi từ micro. Khi tắt, làn khói hạt cuộn sóng bay lên.

3. **🎙️ Nhận Diện Hơi Thổi Nến Bằng Web Audio API (`useBlowDetector.ts`):**
   - Đo cường độ RMS từ Microphone thời gian thực.
   - Khi thổi tắt nến: Kích hoạt âm thanh vụt tắt (`Flame Snuff`) + Pháo kim tuyến nở rộ đa tầng (`Canvas Confetti`).
   - Có cơ chế fallback: Chạm/Click trực tiếp vào ngọn lửa nếu không bật micro.

4. **🎞️ Dải Băng Cuộn Phim 35mm Chạy Ngang (`FilmstripReel.tsx`):**
   - Tái hiện cuộn phim analog Kodak Portra 400 / Fuji Pro với hai hàng **lỗ răng cưa (Sprocket Holes)** chạy dọc mép.
   - Hỗ trợ **kéo thả chuột mượt mà (Physics Drag)** và **lăn con chuột (Wheel Scroll)**.
   - Âm thanh răng cưa cuộn phim lách cách (`Film Sprocket Ticks`) khi cuộn và âm thanh màn trập máy ảnh cơ học (`Camera Shutter Snap`) khi bấm mở ảnh phóng to (Vintage Lightbox).

5. **🔊 Hệ Thống Âm Thanh Đa Giác Quan (`soundEngine.ts`):**
   - Tự động tổng hợp âm thanh bằng **Web Audio API Procedural Synthesizer** (không sợ lỗi mất mạng hay link CDN hỏng):
     - Tiếng quẹt que diêm & bùng lửa (`Match Strike & Spark`)
     - Tiếng gió thổi & xì khói tắt nến (`Flame Snuff`)
     - Tiếng pháo hoa nổ & chuông kim tuyến (`Confetti Pop & Sparkle Chimes`)
     - Tiếng dao cắt bánh chạm đĩa sứ (`Cake Slice Porcelain Clink`)
     - Tiếng răng cưa cuộn phim (`Film Sprocket Click`)
     - Tiếng màn trập máy ảnh (`Camera Shutter`)
     - Tiếng mở phong thư giấy nến (`Paper Unfold`)
     - Bản nhạc Happy Birthday dạng Hộp Nhạc (Music Box) êm đềm, ấm áp.

6. **💌 Thiệp Chúc Mừng & Lưu Lời Chúc Finale:**
   - Trái tim Polaroid tập hợp toàn bộ ảnh gia đình quanh chiếc bánh hoàn chỉnh.
   - Thiệp chúc mừng với lời đề từ đong đầy yêu thương.
   - Form viết lời chúc cá nhân hóa được lưu an toàn trong `localStorage`.

---

## 🛠️ Hướng Dẫn Tùy Biến Ảnh & Lời Chúc Của Bạn

Để thay đổi 5 chương ảnh và nội dung gia đình, bạn chỉ cần chỉnh sửa file:
👉 [`client/src/data/familyMemories.ts`](file:///home/binhminh/Developer/birthday-family/client/src/data/familyMemories.ts)

Cấu trúc gồm 5 Lát Bánh (Chương 1 đến 5):
```typescript
export const familyMemories: SliceChapter[] = [
  {
    sliceId: "01",
    sliceNumber: "01",
    title: "Những Bước Chân Đầu Tiên",
    subtitle: "Childhood & Early Days",
    description: "Lời dẫn câu chuyện của bạn...",
    colorTag: "Tuổi Thơ",
    accentColor: "#E09F3E",
    photos: [
      {
        id: "c1",
        image: "https://your-image-url.jpg", // Hoặc đặt ảnh trong public/photos/
        alt: "Mô tả ảnh",
        date: "2006",
        title: "Tiêu đề bức ảnh",
        caption: "Câu chuyện ấm áp phía sau bức ảnh...",
        frameCode: "KODAK 400 • 01A",
        location: "Hà Nội",
      },
      // ...
    ]
  },
  // ... Tiếp tục cho 5 Slices
];
```

---

## 🚀 Chạy Thử Tại Local

```bash
# 1. Cài đặt dependencies (nếu chưa có)
pnpm install

# 2. Khởi chạy dev server
pnpm dev

# 3. Mở trình duyệt tại: http://localhost:3000
```

---

## 🌐 Hướng Dẫn Deploy Lên Vercel & Cấu Hình Cloudflare DNS

### Bước 1: Đẩy code lên GitHub
```bash
git add .
git commit -m "feat: complete bright editorial birthday app with 3D cake and 35mm film reel"
git push origin main
```

### Bước 2: Import Project vào Vercel
1. Truy cập [vercel.com](https://vercel.com) và chọn **"Add New Project"**.
2. Chọn kho lưu trữ `birthday-family`.
3. Vercel sẽ tự động nhận diện cấu hình trong `vercel.json` (`Framework: Vite`, `Build Command: pnpm build`, `Output Directory: dist`).
4. Bấm **"Deploy"**.

### Bước 3: Gắn Domain từ Cloudflare
1. Trên dashboard Vercel của dự án, vào tab **Settings** ➔ **Domains**.
2. Thêm domain của bạn (ví dụ: `birthday.yourdomain.com` hoặc `yourdomain.com`).
3. Vercel sẽ cung cấp bản ghi CNAME (thường là `cname.vercel-dns.com`).
4. Truy cập **Cloudflare Dashboard** ➔ Chọn domain của bạn ➔ Vào mục **DNS**:
   - **Type:** `CNAME`
   - **Name:** `birthday` (hoặc `@`)
   - **Target:** `cname.vercel-dns.com`
   - **Proxy status:** Bật *Proxied* (đám mây cam) hoặc *DNS only* (khuyên dùng *DNS only* trong lần đầu xác thực SSL của Vercel, sau đó có thể bật lại Proxied).
5. Sau 1-2 phút, domain của bạn sẽ hoạt động hoàn hảo với chứng chỉ HTTPS bảo mật!
