import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Save,
  Eye,
  Settings
} from 'lucide-react';
import { Article, ValidationError } from '@/types/article';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EditorToolbarProps {
  article: Article;
  onValidate: () => ValidationError[];
  validationErrors: ValidationError[];
}

export function EditorToolbar({ article, onValidate, validationErrors }: EditorToolbarProps) {
  const errorCount = validationErrors.filter(e => e.severity === 'error').length;
  const warningCount = validationErrors.filter(e => e.severity === 'warning').length;

  const getStatusBadge = () => {
    switch (article.status) {
      case 'draft':
        return <Badge variant="secondary" className="status-draft">Taslak</Badge>;
      case 'review':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">İncelemede</Badge>;
      case 'approved':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Onaylandı</Badge>;
      case 'published':
        return <Badge className="bg-primary text-primary-foreground">Yayınlandı</Badge>;
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
            <p className="text-xs text-muted-foreground">Sosyal Bilimler Dergisi</p>
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
                    <div className="flex items-center gap-1 text-destructive">
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
                    <div className="flex items-center gap-1 text-warning">
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
        
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4 mr-1.5" />
          Önizle
        </Button>
        
        <Button variant="ghost" size="sm">
          <Save className="w-4 h-4 mr-1.5" />
          Kaydet
        </Button>
        
        <div className="h-6 w-px bg-border mx-1" />
        
        <Button variant="outline" size="sm">
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
