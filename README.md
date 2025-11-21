# 🏕️ Youth Camp 2025 Attendance System

A modern, comprehensive attendance management system for Youth Camp 2025, built with cutting-edge web technologies and designed to provide a seamless experience for participants and organizers.

## 🎯 About Youth Camp 2025

**Theme:** "Knowledge, Faith and Character are. The Ultimate Goals of Education."

**Dates:** 3-5 Desember 2025

This attendance system provides real-time tracking, photo verification, and comprehensive management features for a 3-day youth camp experience.

## 👨‍🎓 Cara Penggunaan untuk Siswa

### 📋 Panduan Lengkap Penggunaan Sistem Absensi

#### 1. **Mengakses Sistem**
- Buka browser (Chrome, Firefox, Safari, atau Edge)
- Kunjungi URL yang diberikan panitia
- Pastikan koneksi internet stabil
- Izinkan akses kamera saat diminta (penting untuk foto verifikasi)

#### 2. **Memahami Interface Utama**
Sistem memiliki 4 tab utama:
- **📊 Dashboard** - Melihat statistik dan overview kehadiran
- **✅ Absensi** - Melakukan check-in dan check-out
- **📸 Gallery** - Melihat foto-foto kehadiran
- **ℹ️ Informasi** - Jadwal lengkap dan informasi kegiatan

#### 3. **Prosedur Check-in Pagi (06:00-08:00)**

**Langkah 1: Buka Tab Absensi**
- Klik tab "✅ Absensi" di bagian atas
- Pilih hari yang sesuai (Hari 1, Hari 2, atau Hari 3)

**Langkah 2: Check-in Pagi**
- Cari card "Check-in Pagi" untuk hari tersebut
- Pastikan tombol "Check-in" berwarna hijau (aktif)
- Klik tombol "Check-in"
- Tunggu hingga muncul notifikasi sukses

**Langkah 3: Ambil Foto Verifikasi**
- Setelah check-in berhasil, tombol kamera akan aktif
- Klik tombol "📷 Ambil Foto Check-in Pagi"
- Berikan izin akses kamera jika diminta
- Posisikan wajah di frame kamera
- Klik tombol capture untuk mengambil foto
- Foto akan tersimpan otomatis

#### 4. **Prosedur Check-out Malam (19:00-21:00)**

**Untuk Hari 1 & Hari 2:**
- Ikuti langkah yang sama seperti check-in pagi
- Pilih card "Check-out Malam"
- Lakukan check-out terlebih dahulu
- Ambil foto verifikasi setelah check-out berhasil

**Untuk Hari 3:**
- Check-out dilakukan pada jam 07:00-15:00
- Pilih card "Check-out Akhir"
- Follow prosedur yang sama

#### 5. **Memantau Status Kehadiran**

**Di Dashboard:**
- Lihat overview statistik kehadiran
- Progress bar menunjukkan persentase kehadiran
- Card statistik menampilkan detail sesi

**Di Tab Absensi:**
- Status setiap sesi ditampilkan dengan warna:
  - ✅ Hijau: Sudah check-in
  - ⏳ Kuning: Belum check-in tapi masih dalam waktu
  - ❌ Merah: Terlewat waktu

#### 6. **Melihat Gallery Foto**

**Akses Gallery:**
- Klik tab "📸 Gallery"
- Foto diorganisir berdasarkan hari dan sesi
- Klik foto untuk melihat detail
- Download foto jika diperlukan

#### 7. **Informasi Jadwal**

**Cek Jadwal Lengkap:**
- Klik tab "ℹ️ Informasi"
- Lihat semua jadwal kegiatan
- Perhatikan waktu-waktu penting:
  - Check-in Pagi: 06:00-08:00
  - Check-out Malam: 19:00-21:00 (Hari 1 & 2)
  - Check-out Akhir: 15:00-18:00 (Hari 3)

#### 8. **Tips & Trik Penting**

⚠️ **Penting:**
- **Jangan lupa izinkan akses kamera** saat pertama kali menggunakan
- **Check-in tepat waktu** untuk menghindari keterlambatan
- **Ambil foto dengan pencahayaan baik** untuk verifikasi yang jelas
- **Simpan bukti check-in** (screenshot) sebagai cadangan

💡 **Tips:**
- Gunakan Chrome atau Firefox untuk pengalaman terbaik
- Pastikan baterai perangkat cukup
- Gunakan WiFi stabil untuk proses yang lancar
- Refresh halaman jika terjadi masalah teknis

#### 9. **Troubleshooting**

**Masalah Umum:**
- **Kamera tidak aktif**: Refresh halaman dan izinkan akses kamera
- **Tombol tidak aktif**: Pastikan sudah dalam waktu yang ditentukan
- **Foto tidak tersimpan**: Cek koneksi internet dan coba lagi
- **Error loading**: Refresh halaman dan coba koneksi yang lebih stabil

**Hubungi Panitia:**
Jika mengalami masalah teknis yang tidak bisa diselesaikan:
- Screenshot error yang muncul
- Catat waktu dan hari saat masalah terjadi
- Hubungi tim IT panitia Youth Camp 2025

#### 10. **Best Practices**

✅ **Do's:**
- Check-in 10-15 menit sebelum waktu dimulai
- Ambil foto dengan background yang jelas
- Pastikan wajah terlihat jelas di foto
- Double-check status kehadiran setelah proses

❌ **Don'ts:**
- Tunggu hingga menit terakhir untuk check-in
- Gunakan filter atau efek pada foto
- Minimize browser saat proses berlangsung
- Gunakan VPN yang bisa memperlambat koneksi

## ✨ Features

### 📱 Attendance Management
- **Time-based Check-in/Check-out**: Automated scheduling with specific time windows
  - Check-in Pagi: 06:00-08:00
  - Check-out Malam: 19:00-21:00 (Hari 1 & 2)
  - Check-out Akhir: 15:00-18:00 (Hari 3)
- **Smart Time Validation**: Buttons automatically activate/deactivate based on scheduled times
- **Real-time Status Tracking**: Live attendance status updates with visual indicators

### 📸 Photo Verification System
- **Camera Integration**: Built-in photo capture for attendance verification
- **Time-controlled Access**: Camera buttons only active during valid attendance periods
- **Photo Gallery**: Organized display of captured photos by day and session
- **Image Management**: View, manage, and organize attendance photos

### 📊 Dashboard & Analytics
- **Participant Statistics**: Real-time overview of attendance rates
- **Session Tracking**: Detailed breakdown by day and session type
- **Visual Progress Indicators**: Progress bars and completion metrics
- **Responsive Design**: Optimized for desktop and mobile devices

### 🔐 Backend API
- **RESTful API**: Complete backend endpoints for data management
- **Database Integration**: Prisma ORM with SQLite for data persistence
- **Real-time Updates**: WebSocket support for live data synchronization
- **Type Safety**: Full TypeScript implementation throughout

## 🛠️ Technology Stack

### Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Modern utility-first styling

### UI Components & Design
- **🧩 shadcn/ui** - High-quality accessible components
- **🎯 Lucide React** - Beautiful icon library
- **🌈 Framer Motion** - Smooth animations and transitions
- **📱 Responsive Design** - Mobile-first approach

### Database & Backend
- **🗄️ Prisma ORM** - Type-safe database operations
- **💾 SQLite** - Lightweight database solution
- **🔄 Real-time Updates** - WebSocket integration
- **🔐 API Security** - Protected endpoints and validation

### Image & Media
- **📸 Camera Integration** - WebRTC camera access
- **🖼️ Image Processing** - Base64 encoding and management
- **📊 Media Gallery** - Organized photo display system

## 🌐 SEO & Metadata

### 📝 Search Engine Optimization
- **Meta Tags**: Lengkap dengan title, description, dan keywords
- **Open Graph**: Optimized untuk social media sharing
- **Twitter Cards**: Enhanced preview untuk Twitter
- **Robots.txt**: Konfigurasi crawling untuk search engines
- **Sitemap.xml**: Peta situs untuk indexing yang lebih baik

### 📱 Progressive Web App (PWA)
- **Manifest.json**: Konfigurasi PWA untuk installable app
- **Service Worker**: Ready untuk offline functionality
- **App Icons**: Multiple sizes untuk berbagai devices
- **Theme Color**: Konsisten dengan brand identity

### 🔧 Environment Configuration
- **.env.example**: Template konfigurasi environment
- **Security**: Proper environment variable handling
- **Scalability**: Ready untuk production deployment

### 📊 Analytics & Monitoring
- **Google Analytics**: Ready untuk tracking
- **Search Console**: Verification support
- **Performance**: Optimized metadata loading

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up the database
npm run db:push

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/            # Admin panel routes
│   │   ├── layout.tsx   # Admin layout with metadata
│   │   └── page.tsx     # Admin dashboard
│   ├── api/              # API routes for backend functionality
│   │   ├── attendance/   # Attendance management endpoints
│   │   ├── gallery/      # Photo gallery endpoints
│   │   └── participants/ # Participant data endpoints
│   ├── layout.tsx        # Root layout with SEO metadata
│   └── page.tsx          # Main application interface
├── components/
│   └── ui/               # shadcn/ui component library
├── hooks/                # Custom React hooks
├── lib/
│   ├── db.ts            # Database connection
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
```

### 🖼️ Assets & Icons

**Required Files:**
- `/public/logo.svg` - Main logo for Open Graph, social sharing, and PWA
- `/public/favicon.png` - Main favicon (32x32 PNG) for modern browsers
- `/public/favicon.ico` - Legacy favicon (48x48 ICO) for older browsers

**Optional Files:**
- `/public/screenshot-desktop.png` - Desktop screenshot for PWA
- `/public/screenshot-mobile.png` - Mobile screenshot for PWA

## 📋 Attendance Schedule

### Hari 1 - 3 Desember 2025
- **Check-in Pagi**: 06:00-08:00
- **Check-out Malam**: 19:00-21:00

### Hari 2 - 4 Desember 2025
- **Check-in Pagi**: 06:00-08:00
- **Check-out Malam**: 19:00-21:00

### Hari 3 - 5 Desember 2025
- **Check-in Pagi**: 06:00-08:00
- **Check-out Akhir**: 07:00-15:00

## 🔧 API Endpoints

### Attendance Management
- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance` - Create new attendance record
- `GET /api/attendance/stats` - Get attendance statistics

### Photo Gallery
- `GET /api/gallery` - Get all photos
- `POST /api/gallery` - Upload new photo
- `GET /api/gallery/[day]` - Get photos by day

### Participants
- `GET /api/participants` - Get all participants
- `POST /api/participants` - Add new participant
- `PUT /api/participants/[id]` - Update participant info

## 🎨 UI Features

### Navigation
- **Tab-based Interface**: Easy navigation between sections
- **Active State Indicators**: Visual feedback for current section
- **Responsive Design**: Optimized for all screen sizes

### Attendance Cards
- **Day-based Organization**: Clear separation by camp day
- **Session Tracking**: Check-in/Check-out status for each session
- **Time Validation**: Visual indicators for active/inactive periods
- **Photo Integration**: Direct camera access from attendance cards

### Information Section
- **Event Details**: Comprehensive camp information
- **Schedule Overview**: Clear display of all sessions and times
- **Responsive Grid**: Optimized layout for desktop and mobile

## 🔒 Security & Validation

- **Time-based Access**: Features only available during scheduled times
- **Input Validation**: Comprehensive form validation with Zod schemas
- **Type Safety**: End-to-end TypeScript implementation
- **Error Handling**: Robust error management and user feedback

## 📱 Responsive Design

- **Mobile-first Approach**: Optimized for mobile devices
- **Desktop Enhancement**: Enhanced layouts for larger screens
- **Touch-friendly**: Appropriate touch targets and interactions
- **Adaptive Layouts**: Responsive grid systems and components

## 🚀 Performance

- **Optimized Images**: Efficient image handling and processing
- **Lazy Loading**: Components load as needed
- **Caching Strategy**: Intelligent data caching
- **Bundle Optimization**: Optimized build configuration

## 🛠️ Development

```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Database operations
npm run db:push    # Push schema changes
npm run db:studio  # Open Prisma Studio
```

## 📊 Monitoring

The system includes comprehensive monitoring features:
- **Real-time Statistics**: Live attendance tracking
- **Session Analytics**: Detailed breakdown by session
- **Participant Metrics**: Individual attendance tracking
- **System Health**: API performance monitoring

## 🤝 Contributing

This project is built with modern development practices and is designed to be easily extensible. Key areas for potential enhancement:

- Additional reporting features
- Enhanced photo management
- Integration with external calendar systems
- Advanced analytics and insights
- Mobile app development

---

Built with ❤️ for Youth Camp 2025 • Powered by modern web technology
