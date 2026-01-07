import { Article } from '@/types/article';

/**
 * Makaleyi JSON dosyası olarak dışa aktarır
 * @param article - Dışa aktarılacak makale
 * @param filename - Dosya adı (opsiyonel)
 */
export function exportArticleToJson(article: Article, filename?: string): void {
    const data = JSON.stringify(article, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const safeName = (filename || article.metadata.titleTurkish || 'makale')
        .replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s-]/g, '')
        .substring(0, 50)
        .trim() || 'makale';
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * JSON dosyasından makale içe aktarır
 * @param file - Yüklenecek dosya
 * @returns Promise<Article> - İçe aktarılan makale
 */
export function importArticleFromJson(file: File): Promise<Article> {
    return new Promise((resolve, reject) => {
        // Dosya tipi kontrolü
        if (!file.name.endsWith('.json') && file.type !== 'application/json') {
            reject(new Error('Sadece JSON dosyaları kabul edilir'));
            return;
        }

        // Dosya boyutu kontrolü (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            reject(new Error('Dosya boyutu 5MB\'dan büyük olamaz'));
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const article = JSON.parse(content) as Article;

                // Temel yapı doğrulaması
                if (!validateArticleStructure(article)) {
                    reject(new Error('Geçersiz makale formatı'));
                    return;
                }

                resolve(article);
            } catch (error) {
                reject(new Error('JSON dosyası okunamadı veya geçersiz format'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Dosya okuma hatası'));
        };

        reader.readAsText(file);
    });
}

/**
 * Makale yapısını doğrular
 * @param article - Doğrulanacak makale
 * @returns boolean - Geçerli mi?
 */
function validateArticleStructure(article: unknown): article is Article {
    if (!article || typeof article !== 'object') return false;
    
    const a = article as Record<string, unknown>;
    
    // Zorunlu alanları kontrol et
    const requiredFields = ['id', 'metadata', 'abstract', 'sections'];
    for (const field of requiredFields) {
        if (!(field in a)) {
            console.warn(`Missing required field: ${field}`);
            return false;
        }
    }

    // Metadata kontrolü
    if (!a.metadata || typeof a.metadata !== 'object') return false;
    
    // Sections kontrolü
    if (!Array.isArray(a.sections)) return false;

    return true;
}

/**
 * Dosya seçici açar ve seçilen dosyayı döndürür
 * @param accept - Kabul edilen dosya tipleri
 * @returns Promise<File | null>
 */
export function openFilePicker(accept: string = '.json'): Promise<File | null> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            resolve(file || null);
        };

        input.oncancel = () => {
            resolve(null);
        };

        input.click();
    });
}

/**
 * Makaleyi localStorage'dan temizler
 * @param storageKey - LocalStorage anahtarı
 */
export function clearStoredArticle(storageKey: string = 'journal_craft_current_article'): void {
    localStorage.removeItem(storageKey);
}

/**
 * Makale verilerini kopyalar (deep clone)
 * @param article - Kopyalanacak makale
 * @returns Article - Kopya
 */
export function cloneArticle(article: Article): Article {
    return JSON.parse(JSON.stringify(article));
}

