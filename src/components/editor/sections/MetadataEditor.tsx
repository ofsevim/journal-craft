import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, Mail, Building2, Hash, AlertCircle } from 'lucide-react';
import { ArticleMetadata, ArticleHistory, Author, ValidationError } from '@/types/article';
import { cn } from '@/lib/utils';

interface MetadataEditorProps {
  metadata: ArticleMetadata;
  history: ArticleHistory;
  validationErrors: ValidationError[];
  onUpdateMetadata: (updates: Partial<ArticleMetadata>) => void;
  onUpdateHistory: (updates: Partial<ArticleHistory>) => void;
  onAddAuthor: () => void;
  onUpdateAuthor: (authorId: string, updates: Partial<Author>) => void;
  onRemoveAuthor: (authorId: string) => void;
}

export function MetadataEditor({
  metadata,
  history,
  validationErrors,
  onUpdateMetadata,
  onUpdateHistory,
  onAddAuthor,
  onUpdateAuthor,
  onRemoveAuthor,
}: MetadataEditorProps) {
  const getFieldError = (field: string) => validationErrors.find(e => e.field === field);
  return (
    <div className="space-y-6">
      {/* Titles */}
      <Card className="section-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-section-header">Makale Başlıkları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="titleTurkish" className={cn("form-label", getFieldError('titleTurkish') && "text-destructive")}>
              Türkçe Başlık <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titleTurkish"
              value={metadata.titleTurkish}
              onChange={(e) => onUpdateMetadata({ titleTurkish: e.target.value })}
              placeholder="Makalenin Türkçe başlığını girin..."
              className={cn("font-academic text-lg", getFieldError('titleTurkish') && "border-destructive focus-visible:ring-destructive")}
            />
            {getFieldError('titleTurkish') && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {getFieldError('titleTurkish')?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="titleEnglish" className={cn("form-label", getFieldError('titleEnglish') && "text-destructive")}>
              İngilizce Başlık <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titleEnglish"
              value={metadata.titleEnglish}
              onChange={(e) => onUpdateMetadata({ titleEnglish: e.target.value })}
              placeholder="Enter the English title of the article..."
              className={cn("font-academic text-lg", getFieldError('titleEnglish') && "border-destructive focus-visible:ring-destructive")}
            />
            {getFieldError('titleEnglish') && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {getFieldError('titleEnglish')?.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Authors */}
      <Card className="section-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className={cn("text-base font-semibold text-section-header", getFieldError('authors') && "text-destructive")}>
                Yazarlar
              </CardTitle>
              {getFieldError('authors') && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {getFieldError('authors')?.message}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={onAddAuthor} className={cn(getFieldError('authors') && "border-destructive text-destructive hover:bg-destructive/10")}>
              <Plus className="w-4 h-4 mr-1.5" />
              Yazar Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {metadata.authors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Henüz yazar eklenmemiş.</p>
              <p className="text-xs mt-1">Yazar eklemek için yukarıdaki butona tıklayın.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {metadata.authors.map((author, index) => (
                <div
                  key={author.id}
                  className="p-4 border border-border rounded-lg bg-card hover:border-section-border transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-2 text-muted-foreground cursor-grab">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          Yazar {index + 1}
                        </span>
                        <div className="flex items-center gap-2 ml-auto">
                          <Switch
                            id={`corresponding-${author.id}`}
                            checked={author.isCorresponding}
                            onCheckedChange={(checked) =>
                              onUpdateAuthor(author.id, { isCorresponding: checked })
                            }
                          />
                          <Label htmlFor={`corresponding-${author.id}`} className="text-xs text-muted-foreground">
                            Sorumlu Yazar
                          </Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="form-label text-xs">Ad Soyad</Label>
                          <Input
                            value={author.name}
                            onChange={(e) => onUpdateAuthor(author.id, { name: e.target.value })}
                            placeholder="Dr. Ahmet Yılmaz"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="form-label text-xs">ORCID</Label>
                          <div className="relative">
                            <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                              value={author.orcid}
                              onChange={(e) => onUpdateAuthor(author.id, { orcid: e.target.value })}
                              placeholder="0000-0002-1234-5678"
                              className="h-9 pl-8"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="form-label text-xs">Kurum</Label>
                          <div className="relative">
                            <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                              value={author.affiliation}
                              onChange={(e) => onUpdateAuthor(author.id, { affiliation: e.target.value })}
                              placeholder="Örnek Üniversitesi"
                              className="h-9 pl-8"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="form-label text-xs">E-posta</Label>
                          <div className="relative">
                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                              type="email"
                              value={author.email}
                              onChange={(e) => onUpdateAuthor(author.id, { email: e.target.value })}
                              placeholder="yazar@ornek.edu.tr"
                              className="h-9 pl-8"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveAuthor(author.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Journal Info */}
      <Card className="section-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-section-header">Dergi Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="form-label">Dergi Adı</Label>
              <Input
                value={metadata.journalName}
                disabled
                className="bg-muted"
              />
              <p className="form-hint">Otomatik doldurulur</p>
            </div>
            <div>
              <Label className="form-label">DOI</Label>
              <Input
                value={metadata.doi}
                onChange={(e) => onUpdateMetadata({ doi: e.target.value })}
                placeholder="10.xxxxx/xxxxx"
              />
            </div>
            <div>
              <Label className="form-label">Cilt</Label>
              <Input
                value={metadata.volume}
                onChange={(e) => onUpdateMetadata({ volume: e.target.value })}
                placeholder="12"
              />
            </div>
            <div>
              <Label className="form-label">Sayı</Label>
              <Input
                value={metadata.issue}
                onChange={(e) => onUpdateMetadata({ issue: e.target.value })}
                placeholder="3"
              />
            </div>
            <div>
              <Label className="form-label">Yıl</Label>
              <Input
                value={metadata.year}
                onChange={(e) => onUpdateMetadata({ year: e.target.value })}
                placeholder="2024"
              />
            </div>
            <div>
              <Label className="form-label">Sayfa Aralığı</Label>
              <Input
                value={metadata.pages}
                onChange={(e) => onUpdateMetadata({ pages: e.target.value })}
                placeholder="1-25"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Article History */}
      <Card className="section-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-section-header">Makale Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="form-label">Gönderim Tarihi</Label>
              <Input
                type="date"
                value={history.receivedDate}
                onChange={(e) => onUpdateHistory({ receivedDate: e.target.value })}
              />
            </div>
            <div>
              <Label className="form-label">Kabul Tarihi</Label>
              <Input
                type="date"
                value={history.acceptedDate}
                onChange={(e) => onUpdateHistory({ acceptedDate: e.target.value })}
              />
            </div>
            <div>
              <Label className="form-label">Yayın Tarihi</Label>
              <Input
                type="date"
                value={history.publishedDate}
                onChange={(e) => onUpdateHistory({ publishedDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
