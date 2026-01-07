# Journal Craft - Akademik Makale Editörü

<p align="center">
  <img src="public/favicon.ico" alt="Journal Craft Logo" width="64" height="64">
</p>

**Journal Craft**, akademik makaleleri Sosyal Çalışma Dergisi (SCD) formatında düzenlemenizi ve LaTeX PDF olarak dışa aktarmanızı sağlayan modern bir web uygulamasıdır.

## ✨ Özellikler

- 📝 **Görsel Makale Editörü** - Sezgisel arayüz ile makale yazımı
- 📄 **Gerçek Zamanlı Önizleme** - HTML ve LaTeX PDF önizleme
- 🖨️ **LaTeX PDF Çıktısı** - scd.cls formatında profesyonel PDF
- 💾 **Otomatik Kaydetme** - Değişiklikler otomatik olarak kaydedilir
- 📤 **Import/Export** - JSON formatında içe/dışa aktarma
- 🌍 **Çift Dil Desteği** - Türkçe ve İngilizce makale desteği
- 📊 **Tablo Editörü** - Kolay tablo oluşturma ve düzenleme
- ✅ **Doğrulama** - Makale yapısı doğrulama

## 🛠️ Teknolojiler

### Frontend
- **React 18** - UI framework
- **TypeScript** - Tip güvenliği
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Query** - Server state management

### Backend
- **Express.js** - API server
- **XeLaTeX** - PDF derleme
- **Zod** - Input validation
- **Helmet** - Security headers
- **Rate Limiting** - DoS koruması

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- XeLaTeX (PDF derleme için)

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/your-username/journal-craft.git
cd journal-craft
```

### 2. Frontend Kurulumu

```bash
# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env

# Development server'ı başlat
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır.

### 3. Backend Kurulumu (LaTeX PDF için)

```bash
# Server klasörüne git
cd server

# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env

# Server'ı başlat
npm run dev
```

Backend `http://localhost:3001` adresinde çalışacaktır.

### 4. XeLaTeX Kurulumu (Opsiyonel)

LaTeX PDF çıktısı için sisteminizde XeLaTeX kurulu olmalıdır:

**Windows:**
```bash
# MiKTeX veya TeX Live kurulumu
# https://miktex.org/download
```

**macOS:**
```bash
brew install --cask mactex
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install texlive-xetex texlive-fonts-recommended texlive-fonts-extra
```

## 📁 Proje Yapısı

```
journal-craft/
├── src/
│   ├── api/              # API istemci fonksiyonları
│   ├── components/       # React componentleri
│   │   ├── editor/       # Editör componentleri
│   │   └── ui/           # shadcn/ui componentleri
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript tip tanımları
│   ├── utils/            # Yardımcı fonksiyonlar
│   └── config/           # Uygulama yapılandırması
├── server/               # Express.js backend
│   ├── index.ts          # Server entry point
│   ├── latex-service.ts  # LaTeX derleme servisi
│   └── validation.ts     # Zod şemaları
├── public/               # Statik dosyalar
└── scd.cls               # LaTeX class dosyası
```

## 🔧 Yapılandırma

### Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001
```

**Backend (server/.env):**
```env
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

## 📖 Kullanım

1. **Makale Bilgileri** - Başlık, yazarlar ve yayın bilgilerini girin
2. **Özet** - Türkçe ve İngilizce özetleri yazın
3. **İçerik** - Makale bölümlerini düzenleyin
4. **Tablolar** - Gerekli tabloları ekleyin
5. **Kaynakça** - Referansları listeleyin
6. **PDF İndir** - LaTeX PDF olarak dışa aktarın

## 🐳 Docker ile Çalıştırma

```bash
# Image oluştur
docker build -t journal-craft-server .

# Container'ı çalıştır
docker run -p 3001:3001 journal-craft-server
```

## 🧪 Geliştirme

```bash
# Lint kontrolü
npm run lint

# Build
npm run build

# Preview
npm run preview
```

## 📝 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/health` | Sunucu sağlık kontrolü |
| POST | `/api/compile` | Makaleyi PDF'e derle |

## 🔒 Güvenlik

- Helmet ile HTTP güvenlik başlıkları
- Rate limiting (10 istek/dakika derleme için)
- CORS koruması
- Input validation (Zod)
- XSS koruması

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- [Sosyal Çalışma Dergisi](https://dergipark.org.tr/tr/pub/scd) - LaTeX şablonu
- [shadcn/ui](https://ui.shadcn.com/) - UI componentleri
- [Radix UI](https://www.radix-ui.com/) - Erişilebilir primitifler

---

<p align="center">
  Made with ❤️ for academic publishing
</p>
