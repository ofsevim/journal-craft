import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, BookOpen, AlertCircle } from 'lucide-react';

interface ReferencesEditorProps {
  references: string[];
  onUpdate: (references: string[]) => void;
}

export function ReferencesEditor({ references, onUpdate }: ReferencesEditorProps) {
  const [newReference, setNewReference] = useState('');

  const addReference = () => {
    if (newReference.trim()) {
      onUpdate([...references, newReference.trim()]);
      setNewReference('');
    }
  };

  const updateReference = (index: number, value: string) => {
    const updated = references.map((ref, i) => (i === index ? value : ref));
    onUpdate(updated);
  };

  const removeReference = (index: number) => {
    onUpdate(references.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card className="section-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-section-header flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Kaynakça
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg border border-border">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">APA 7 Formatı Kullanın</p>
              <p>
                Örnek: Yılmaz, A. ve Kaya, B. (2023). Makale başlığı. <em>Dergi Adı, 15</em>(3), 45-67.
              </p>
            </div>
          </div>

          {references.length > 0 && (
            <div className="space-y-2">
              {references.map((reference, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 border border-border rounded-lg bg-card hover:border-section-border transition-colors group"
                >
                  <div className="text-muted-foreground cursor-grab pt-1">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded mt-1">
                    [{index + 1}]
                  </span>
                  <Textarea
                    value={reference}
                    onChange={(e) => updateReference(index, e.target.value)}
                    className="flex-1 min-h-[60px] resize-none text-sm font-academic"
                    placeholder="Kaynak bilgisini girin..."
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeReference(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-border pt-4">
            <Label className="form-label">Yeni Kaynak Ekle</Label>
            <div className="flex gap-2">
              <Textarea
                value={newReference}
                onChange={(e) => setNewReference(e.target.value)}
                placeholder="APA 7 formatında kaynak bilgisini girin..."
                className="flex-1 min-h-[80px] resize-none font-academic"
              />
            </div>
            <Button
              variant="outline"
              onClick={addReference}
              disabled={!newReference.trim()}
              className="mt-3"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Kaynak Ekle
            </Button>
          </div>

          {references.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Henüz kaynak eklenmemiş.</p>
              <p className="text-xs mt-1">Yukarıdaki alana kaynak ekleyebilirsiniz.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="section-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-section-header">
            Kaynak Formatı Rehberi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Makale</p>
              <p className="text-muted-foreground font-academic">
                Yazar, A. A. ve Yazar, B. B. (Yıl). Makale başlığı. <em>Dergi Adı, Cilt</em>(Sayı), sayfa-aralığı.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Kitap</p>
              <p className="text-muted-foreground font-academic">
                Yazar, A. A. (Yıl). <em>Kitap başlığı</em> (Baskı). Yayınevi.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Kitap Bölümü</p>
              <p className="text-muted-foreground font-academic">
                Yazar, A. A. (Yıl). Bölüm başlığı. Editör, E. E. (Ed.), <em>Kitap başlığı</em> içinde (ss. xx-xx). Yayınevi.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Web Sitesi</p>
              <p className="text-muted-foreground font-academic">
                Yazar, A. A. (Yıl, Ay Gün). Sayfa başlığı. Site Adı. https://www.ornek.com
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
