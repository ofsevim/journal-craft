import { Article } from '@/types/article';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Yapılandırma sabitleri
const CONFIG = {
    TIMEOUT_MS: 60000, // 60 saniye (LaTeX derleme uzun sürebilir)
    MAX_RETRIES: 2,
    RETRY_DELAY_MS: 1000,
};

export interface CompileError {
    error: string;
    details?: string;
    log?: string;
}

/**
 * Özel hata sınıfı - API hatalarını daha iyi yönetmek için
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public details?: string,
        public log?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Timeout ile fetch wrapper
 * @param url - İstek URL'i
 * @param options - Fetch options
 * @param timeoutMs - Timeout süresi (ms)
 */
async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number = CONFIG.TIMEOUT_MS
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        return response;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.', 408);
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Retry mekanizması ile fetch
 * @param fetchFn - Çalıştırılacak fetch fonksiyonu
 * @param retries - Kalan deneme sayısı
 */
async function fetchWithRetry<T>(
    fetchFn: () => Promise<T>,
    retries: number = CONFIG.MAX_RETRIES
): Promise<T> {
    try {
        return await fetchFn();
    } catch (error) {
        // Network hatalarında retry yap
        if (retries > 0 && error instanceof Error) {
            const isNetworkError = 
                error.message.includes('fetch') || 
                error.message.includes('network') ||
                error.name === 'TypeError';
            
            if (isNetworkError) {
                console.warn(`İstek başarısız, ${retries} deneme kaldı...`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS));
                return fetchWithRetry(fetchFn, retries - 1);
            }
        }
        throw error;
    }
}

/**
 * Makaleyi PDF'e derler
 * @param article - Derlenecek makale verisi
 * @returns PDF blob
 */
export async function compileArticleToPdf(article: Article): Promise<Blob> {
    return fetchWithRetry(async () => {
        const response = await fetchWithTimeout(
            `${API_BASE_URL}/api/compile`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ article }),
            }
        );

        if (!response.ok) {
            let errorData: CompileError;
            try {
                errorData = await response.json();
            } catch {
                throw new ApiError(
                    'Sunucu yanıtı işlenemedi',
                    response.status
                );
            }
            
            throw new ApiError(
                errorData.details || errorData.error || 'Derleme başarısız',
                response.status,
                errorData.details,
                errorData.log
            );
        }

        return await response.blob();
    });
}

/**
 * API sağlık kontrolü
 * @returns API'nin erişilebilir olup olmadığı
 */
export async function checkApiHealth(): Promise<boolean> {
    try {
        const response = await fetchWithTimeout(
            `${API_BASE_URL}/api/health`,
            { method: 'GET' },
            5000 // Health check için 5 saniye timeout
        );
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Blob'u dosya olarak indirir
 * @param blob - İndirilecek blob
 * @param filename - Dosya adı
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * API URL'ini döndürür (debug için)
 */
export function getApiBaseUrl(): string {
    return API_BASE_URL;
}
