import express from 'express';
import cors from 'cors';
import { compileLatex } from './latex-service.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// LaTeX compilation endpoint
app.post('/api/compile', async (req, res) => {
    try {
        const { article } = req.body;

        if (!article) {
            return res.status(400).json({ error: 'Article data is required' });
        }

        console.log('📝 Compiling article:', article.metadata?.titleTurkish || 'Untitled');

        const pdfBuffer = await compileLatex(article);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${article.metadata?.titleTurkish || 'article'}.pdf"`);
        res.send(pdfBuffer);

    } catch (error: any) {
        console.error('❌ Compilation error:', error.message);
        res.status(500).json({
            error: 'LaTeX compilation failed',
            details: error.message,
            log: error.log || null
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 LaTeX compilation server running on http://localhost:${PORT}`);
    console.log(`📄 POST /api/compile - Compile LaTeX to PDF`);
});
