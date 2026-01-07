# LaTeX Backend Deployment Guide

Bu kılavuz, LaTeX derleme sunucusunu Render.com'a deploy etmenizi anlatır.

## Neden Gerekli?

Vercel serverless bir platform olduğu için XeLaTeX gibi sistem komutlarını çalıştıramaz. 
LaTeX derleme işlemi için ayrı bir sunucu gereklidir.

## Render.com'a Deploy Etme Adımları

### 1. Render.com Hesabı Oluşturun
- https://render.com adresine gidin
- GitHub hesabınızla kaydolun

### 2. Yeni Web Service Oluşturun
1. Dashboard'da **"New +"** → **"Web Service"** tıklayın
2. GitHub reponuzu seçin: `journal-craft`
3. Ayarları yapılandırın:
   - **Name:** `journal-craft-latex`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `./server/Dockerfile`
   - **Docker Build Context Directory:** `.` (root)
   - **Instance Type:** `Free` (veya ücretli plan)

4. **Create Web Service** tıklayın

### 3. Deploy Tamamlanınca
Render size bir URL verecek, örneğin:
```
https://journal-craft-latex.onrender.com
```

### 4. Vercel'de Environment Variable Ekleyin
1. Vercel Dashboard → Projeniz → Settings → Environment Variables
2. Yeni değişken ekleyin:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://journal-craft-latex.onrender.com` (Render URL'niz)
3. **Save** tıklayın
4. Projeyi yeniden deploy edin (Deployments → Redeploy)

## Önemli Notlar

- **Free tier uyarısı:** Render'ın ücretsiz planında, 15 dakika aktif olmayan sunucu uyku moduna geçer. İlk istek 30-60 saniye sürebilir.
- **Cold start:** Uyku modundan uyanma süresi uzun olabilir. Ücretli plan ($7/ay) bunu önler.

## Test Etme

Deploy sonrası health check endpoint'ini test edin:
```bash
curl https://your-render-url.onrender.com/api/health
```

Başarılı yanıt:
```json
{"status":"ok","timestamp":"2024-01-07T..."}
```
