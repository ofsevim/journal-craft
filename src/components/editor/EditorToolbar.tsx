import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Save,
  RotateCcw,
  Settings,
  Loader2,
  FileCode,
  Globe
} from 'lucide-react';
import { Article, ValidationError } from '@/types/article';
import { JOURNAL_CONFIG } from '@/config/journal';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { compileArticleToPdf, downloadBlob, checkApiHealth } from '@/api/latex';
// @ts-ignore - html2pdf types can be tricky
import html2pdf from 'html2pdf.js';

interface EditorToolbarProps {
  article: Article;
  onValidate: () => ValidationError[];
  validationErrors: ValidationError[];
  onReset: () => void;
  onLanguageChange: (language: 'TR' | 'EN') => void;
}

export function EditorToolbar({ article, onValidate, validationErrors, onReset, onLanguageChange }: EditorToolbarProps) {
  const [isCompiling, setIsCompiling] = useState(false);
  const errorCount = validationErrors.filter(e => e.severity === 'error').length;
  const warningCount = validationErrors.filter(e => e.severity === 'warning').length;

  const handleSave = () => {
    toast.success('Değişiklikler tarayıcıya kaydedildi');
  };

  // Quick HTML-based PDF (existing)
  const handleQuickPdf = () => {
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

  // Real LaTeX PDF (new)
  const handleLatexPdf = async () => {
    setIsCompiling(true);

    try {
      // Check if backend is running
      const isHealthy = await checkApiHealth();
      if (!isHealthy) {
        toast.error('LaTeX sunucusu çalışmıyor. Lütfen "npm run server" komutunu çalıştırın.');
        return;
      }

      toast.loading('LaTeX derleniyor...', { id: 'latex-compile' });

      const pdfBlob = await compileArticleToPdf(article);
      const filename = `${article.metadata.titleTurkish || 'makale'}.pdf`;
      downloadBlob(pdfBlob, filename);

      toast.success('PDF başarıyla oluşturuldu ve indirildi!', { id: 'latex-compile' });
    } catch (error: any) {
      console.error('LaTeX compilation error:', error);
      toast.error(`Derleme hatası: ${error.message}`, { id: 'latex-compile' });
    } finally {
      setIsCompiling(false);
    }
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

        <div className="h-6 w-px bg-border" />

        {/* Language Selector */}
        <div className="flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <Select value={article.language || 'TR'} onValueChange={(v) => onLanguageChange(v as 'TR' | 'EN')}>
            <SelectTrigger className="w-[70px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TR">TR</SelectItem>
              <SelectItem value="EN">EN</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm" disabled={isCompiling}>
              {isCompiling ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-1.5" />
              )}
              PDF İndir
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLatexPdf} disabled={isCompiling}>
              <FileCode className="w-4 h-4 mr-2" />
              <div>
                <div className="font-medium">LaTeX PDF (Önerilen)</div>
                <div className="text-xs text-muted-foreground">scd.cls formatında gerçek PDF</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleQuickPdf}>
              <FileText className="w-4 h-4 mr-2" />
              <div>
                <div className="font-medium">Hızlı Önizleme PDF</div>
                <div className="text-xs text-muted-foreground">HTML'den dönüştürme</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
