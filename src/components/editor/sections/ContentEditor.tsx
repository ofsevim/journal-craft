import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { ArticleSection, ArticleSubsection, ValidationError } from '@/types/article';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ContentEditorProps {
  sections: ArticleSection[];
  validationErrors: ValidationError[];
  onAddSection: () => void;
  onUpdateSection: (sectionId: string, updates: Partial<ArticleSection>) => void;
  onRemoveSection: (sectionId: string) => void;
  onAddSubsection: (sectionId: string) => void;
  onUpdateSubsection: (sectionId: string, subsectionId: string, updates: Partial<ArticleSubsection>) => void;
  onRemoveSubsection: (sectionId: string, subsectionId: string) => void;
}

export function ContentEditor({
  sections,
  validationErrors,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onAddSubsection,
  onUpdateSubsection,
  onRemoveSubsection,
}: ContentEditorProps) {
  const getFieldError = (field: string) => validationErrors.find(e => e.field === field);
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
            Makale bölümlerini düzenleyin. Her bölüm için başlık, içerik ve alt bölümler ekleyebilirsiniz.
          </p>
        </div>
        <Button variant="outline" onClick={onAddSection}>
          <Plus className="w-4 h-4 mr-1.5" />
          Yeni Ana Bölüm
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
                        {section.subsections.length} alt bölüm
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
                    <Label className={cn("form-label", getFieldError(`section-${section.id}-title`) && "text-destructive")}>Bölüm Başlığı</Label>
                    <Input
                      value={section.title}
                      onChange={(e) => onUpdateSection(section.id, { title: e.target.value })}
                      placeholder="Örn: Giriş, Yöntem, Bulgular..."
                      className={cn("font-semibold", getFieldError(`section-${section.id}-title`) && "border-destructive focus-visible:ring-destructive")}
                    />
                    {getFieldError(`section-${section.id}-title`) && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError(`section-${section.id}-title`)?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className={cn("form-label", getFieldError(`section-${section.id}-content`) && "text-destructive")}>Bölüm İçeriği (Giriş Metni)</Label>
                    <Textarea
                      value={section.content}
                      onChange={(e) => onUpdateSection(section.id, { content: e.target.value })}
                      placeholder="Bu bölümün giriş metnini yazın..."
                      className={cn(
                        "min-h-[150px] font-academic text-base leading-relaxed resize-none",
                        getFieldError(`section-${section.id}-content`) && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {getFieldError(`section-${section.id}-content`) && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError(`section-${section.id}-content`)?.message}
                      </p>
                    )}
                  </div>

                  {/* Subsections Area */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Layers className="w-3 h-3" />
                        Alt Bölümler
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => onAddSubsection(section.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Alt Bölüm Ekle
                      </Button>
                    </div>

                    {section.subsections.length > 0 ? (
                      <div className="space-y-4 pl-4 border-l-2 border-muted ml-2">
                        {section.subsections.map((ss, ssIndex) => (
                          <div key={ss.id} className="space-y-3 relative">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-muted-foreground">
                                {index + 1}.{ssIndex + 1}
                              </span>
                              <Input
                                value={ss.title}
                                onChange={(e) => onUpdateSubsection(section.id, ss.id, { title: e.target.value })}
                                placeholder="Alt Bölüm Başlığı"
                                className="h-8 text-sm font-medium"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => onRemoveSubsection(section.id, ss.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                            <Textarea
                              value={ss.content}
                              onChange={(e) => onUpdateSubsection(section.id, ss.id, { content: e.target.value })}
                              placeholder="Alt bölüm içeriği..."
                              className="min-h-[100px] text-sm resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-muted/30 rounded-md border border-dashed">
                        <p className="text-[10px] text-muted-foreground">Henüz alt bölüm eklenmemiş.</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-end pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveSection(section.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Ana Bölümü Sil
                    </Button>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {
        sections.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">Henüz bölüm eklenmemiş.</p>
            <Button onClick={onAddSection}>
              <Plus className="w-4 h-4 mr-1.5" />
              İlk Bölümü Ekle
            </Button>
          </div>
        )
      }
    </div>
  );
}
