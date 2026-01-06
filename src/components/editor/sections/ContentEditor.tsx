import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { ArticleSection } from '@/types/article';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ContentEditorProps {
  sections: ArticleSection[];
  onAddSection: () => void;
  onUpdateSection: (sectionId: string, updates: Partial<ArticleSection>) => void;
  onRemoveSection: (sectionId: string) => void;
}

export function ContentEditor({
  sections,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
}: ContentEditorProps) {
  const [expandedSections, setExpandedSections] = React.useState<string[]>(
    sections.slice(0, 2).map(s => s.id)
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Makale bölümlerini düzenleyin. Her bölüm için başlık ve içerik girebilirsiniz.
          </p>
        </div>
        <Button variant="outline" onClick={onAddSection}>
          <Plus className="w-4 h-4 mr-1.5" />
          Yeni Bölüm
        </Button>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <Collapsible
            key={section.id}
            open={expandedSections.includes(section.id)}
            onOpenChange={() => toggleSection(section.id)}
          >
            <Card className="section-card overflow-hidden">
              <CollapsibleTrigger asChild>
                <CardHeader className="py-3 px-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground cursor-grab">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {index + 1}
                    </span>
                    <CardTitle className="text-sm font-medium flex-1">
                      {section.title || 'Başlıksız Bölüm'}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {section.content.length} karakter
                      </span>
                      {expandedSections.includes(section.id) ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 pb-4 px-4 space-y-4 border-t border-border">
                  <div className="pt-4">
                    <Label className="form-label">Bölüm Başlığı</Label>
                    <Input
                      value={section.title}
                      onChange={(e) => onUpdateSection(section.id, { title: e.target.value })}
                      placeholder="Örn: Giriş, Yöntem, Bulgular..."
                      className="font-semibold"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="form-label mb-0">Bölüm İçeriği</Label>
                      <span className="text-xs text-muted-foreground">
                        {section.content.split(/\s+/).filter(Boolean).length} kelime
                      </span>
                    </div>
                    <Textarea
                      value={section.content}
                      onChange={(e) => onUpdateSection(section.id, { content: e.target.value })}
                      placeholder="Bu bölümün içeriğini yazın. Paragraflar halinde düzenli bir şekilde yazabilirsiniz..."
                      className="min-h-[300px] font-academic text-base leading-relaxed resize-none"
                    />
                    <p className="form-hint">
                      Sadece düz metin kullanın. LaTeX komutları otomatik olarak oluşturulacaktır.
                    </p>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveSection(section.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Bölümü Sil
                    </Button>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-4">Henüz bölüm eklenmemiş.</p>
          <Button onClick={onAddSection}>
            <Plus className="w-4 h-4 mr-1.5" />
            İlk Bölümü Ekle
          </Button>
        </div>
      )}
    </div>
  );
}
