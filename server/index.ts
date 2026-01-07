import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { compileLatex } from './latex-service.js';
import { articleSchema } from './validation.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// Güvenlik Middleware'leri
// ============================================

// Helmet - HTTP güvenlik başlıkları
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // PDF indirme için devre dışı
}));

// CORS yapılandırması
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    // Production origins
    'https://journal-craft.vercel.app',
    'https://journal-craft.netlify.app',
];

// Hugging Face veya production'da tüm originlere izin ver
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
    origin: (origin, callback) => {
        // Production'da veya origin yoksa (Postman, curl vb.) kabul et
        if (isProduction || !origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`⚠️ CORS blocked origin: ${origin}`);
            callback(new Error('CORS policy violation'));
        }
    },
    credentials: true,
}));

// Rate Limiting - DoS koruması
const compileLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 dakika
    max: 10, // Dakikada max 10 derleme
    message: {
        error: 'Çok fazla istek gönderdiniz',
        details: 'Lütfen bir dakika bekleyip tekrar deneyin',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100, // Dakikada max 100 genel istek
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(generalLimiter);

// Body parser - boyut limiti ile
app.use(express.json({ limit: '5mb' }));

// ============================================
// Request Logging Middleware
// ============================================
app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// ============================================
// Routes
// ============================================

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime(),
    });
});

// LaTeX derleme endpoint'i
app.post('/api/compile', compileLimiter, async (req: Request, res: Response) => {
    try {
        const { article } = req.body;

        // Input validation
        if (!article) {
            res.status(400).json({ 
                error: 'Geçersiz istek',
                details: 'Article verisi gereklidir' 
            });
            return;
        }

        // Zod ile şema doğrulama
        const validationResult = articleSchema.safeParse(article);
        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(e => e.message).join(', ');
            console.warn('⚠️ Validation failed:', errors);
            res.status(400).json({ 
                error: 'Doğrulama hatası',
                details: errors 
            });
            return;
        }

        console.log('📝 Compiling article:', article.metadata?.titleTurkish || 'Untitled');

        const pdfBuffer = await compileLatex(article);

        // Güvenli dosya adı oluştur
        const safeTitle = (article.metadata?.titleTurkish || 'article')
            .replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s-]/g, '')
            .substring(0, 50)
            .trim() || 'article';

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeTitle)}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);

    } catch (error: unknown) {
        const err = error as Error & { log?: string };
        console.error('❌ Compilation error:', err.message);
        res.status(500).json({
            error: 'LaTeX derleme hatası',
            details: err.message,
            log: process.env.NODE_ENV === 'development' ? err.log : undefined,
        });
    }
});

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ 
        error: 'Endpoint bulunamadı',
        path: req.path 
    });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
        error: 'Sunucu hatası',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Bir hata oluştu',
    });
});

// ============================================
// Server Start
// ============================================
app.listen(PORT, () => {
    console.log(`🚀 LaTeX compilation server running on http://localhost:${PORT}`);
    console.log(`📄 POST /api/compile - Compile LaTeX to PDF`);
    console.log(`🔒 Rate limit: 10 compilations/minute`);
    console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
});
