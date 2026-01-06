import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Save,
  RotateCcw,
  Settings
} from 'lucide-react';
import { Article, ValidationError } from '@/types/article';
import { JOURNAL_CONFIG } from '@/config/journal';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
// @ts-ignore - html2pdf types can be tricky
import html2pdf from 'html2pdf.js';

interface EditorToolbarProps {
  article: Article;
  onValidate: () => ValidationError[];
  validationErrors: ValidationError[];
  onReset: () => void;
}

export function EditorToolbar({ article, onValidate, validationErrors, onReset }: EditorToolbarProps) {
  const errorCount = validationErrors.filter(e => e.severity === 'error').length;
  const warningCount = validationErrors.filter(e => e.severity === 'warning').length;

  const handleSave = () => {
    // LocalStorage zaten useArticle içinde otomatik kaydediyor
    toast.success('Değişiklikler tarayıcıya kaydedildi');
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('article-pdf-content');
    if (!element) {
      toast.error('Önizleme alanı bulunamadı');
      return;
    }

    const opt = {
      margin: 0,
      filename: `${article.metadata.titleTurkish || 'makale'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    toast.promise(html2pdf().set(opt).from(element).save(), {
      loading: 'PDF hazırlanıyor...',
      success: 'PDF başarıyla indirildi',
      error: 'PDF oluşturulurken bir hata oluştu'
    });
  };

  const getStatusBadge = () => {
    switch (article.status) {
      case 'draft':
        return <Badge variant="secondary">Taslak</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">İncelemede</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Onaylandı</Badge>;
      case 'published':
        return <Badge variant="default">Yayınlandı</Badge>;
      default:
        return null;
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-sm">Makale Editörü</h1>
            <p className="text-xs text-muted-foreground">{JOURNAL_CONFIG.name}</p>
          </div>
        </div>

        <div className="h-6 w-px bg-border" />

        {getStatusBadge()}

        {(errorCount > 0 || warningCount > 0) && (
          <>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              {errorCount > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-destructive cursor-help">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">{errorCount}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{errorCount} hata mevcut</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {warningCount > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-warning cursor-help">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">{warningCount}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{warningCount} uyarı mevcut</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onValidate}>
          <CheckCircle className="w-4 h-4 mr-1.5" />
          Doğrula
        </Button>

        <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground hover:text-destructive">
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Sıfırla
        </Button>

        <Button variant="ghost" size="sm" onClick={handleSave}>
          <Save className="w-4 h-4 mr-1.5" />
          Kaydet
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
          <Download className="w-4 h-4 mr-1.5" />
          PDF İndir
        </Button>

        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
