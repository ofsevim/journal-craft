import { Article } from '@/types/article';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface CompileError {
    error: string;
    details?: string;
    log?: string;
}

export async function compileArticleToPdf(article: Article): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/compile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article }),
    });

    if (!response.ok) {
        const errorData: CompileError = await response.json();
        throw new Error(errorData.details || errorData.error || 'Compilation failed');
    }

    return await response.blob();
}

export async function checkApiHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        return response.ok;
    } catch {
        return false;
    }
}

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
