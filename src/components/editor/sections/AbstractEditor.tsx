import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, AlertCircle } from 'lucide-react';
import { AbstractSection } from '@/types/article';

interface AbstractEditorProps {
  abstract: AbstractSection;
  onUpdate: (updates: Partial<AbstractSection>) => void;
}

export function AbstractEditor({ abstract, onUpdate }: AbstractEditorProps) {
  const [newKeywordEn, setNewKeywordEn] = useState('');
  const [newKeywordTr, setNewKeywordTr] = useState('');

  const addKeywordEnglish = () => {
    if (newKeywordEn.trim()) {
      onUpdate({
        keywordsEnglish: [...abstract.keywordsEnglish, newKeywordEn.trim()],
      });
      setNewKeywordEn('');
    }
  };

  const removeKeywordEnglish = (index: number) => {
    onUpdate({
      keywordsEnglish: abstract.keywordsEnglish.filter((_, i) => i !== index),
    });
  };

  const addKeywordTurkish = () => {
    if (newKeywordTr.trim()) {
      onUpdate({
        keywordsTurkish: [...abstract.keywordsTurkish, newKeywordTr.trim()],
      });
      setNewKeywordTr('');
    }
  };

  const removeKeywordTurkish = (index: number) => {
    onUpdate({
      keywordsTurkish: abstract.keywordsTurkish.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Turkish Abstract */}
      <Card className="section-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-section-header">
            Öz (Türkçe)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="form-label mb-0">
                Özet Metni <span className="text-destructive">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {abstract.abstractTurkish.length} karakter
              </span>
            </div>
            <Textarea
              value={abstract.abstractTurkish}
              onChange={(e) => onUpdate({ abstractTurkish: e.target.value })}
              placeholder="Makalenizin Türkçe özetini buraya yazın. Özet, araştırmanızın amacını, yöntemini, bulgularını ve sonuçlarını kısaca özetlemelidir..."
              className="min-h-[180px] font-academic text-base leading-relaxed resize-none"
            />
            <p className="form-hint">Özet 150-300 kelime arasında olmalıdır.</p>
          </div>

          <div>
            <Label className="form-label">
              Anahtar Kelimeler <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {abstract.keywordsTurkish.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 text-sm font-normal"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeywordTurkish(index)}
                    className="ml-2 hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newKeywordTr}
                onChange={(e) => setNewKeywordTr(e.target.value)}
                placeholder="Yeni anahtar kelime..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeywordTurkish())}
                className="flex-1"
              />
              <Button variant="outline" onClick={addKeywordTurkish}>
                <Plus className="w-4 h-4 mr-1" />
                Ekle
              </Button>
            </div>
            {abstract.keywordsTurkish.length < 3 && (
              <div className="flex items-center gap-2 mt-2 text-warning">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">En az 3 anahtar kelime gereklidir.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* English Abstract */}
      <Card className="section-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-section-header">
            Abstract (English)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="form-label mb-0">
                Abstract Text <span className="text-destructive">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {abstract.abstractEnglish.length} characters
              </span>
            </div>
            <Textarea
              value={abstract.abstractEnglish}
              onChange={(e) => onUpdate({ abstractEnglish: e.target.value })}
              placeholder="Write the English abstract of your article here. The abstract should briefly summarize the purpose, method, findings, and conclusions of your research..."
              className="min-h-[180px] font-academic text-base leading-relaxed resize-none"
            />
            <p className="form-hint">Abstract should be between 150-300 words.</p>
          </div>

          <div>
            <Label className="form-label">
              Keywords <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {abstract.keywordsEnglish.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 text-sm font-normal"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeywordEnglish(index)}
                    className="ml-2 hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newKeywordEn}
                onChange={(e) => setNewKeywordEn(e.target.value)}
                placeholder="New keyword..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeywordEnglish())}
                className="flex-1"
              />
              <Button variant="outline" onClick={addKeywordEnglish}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            {abstract.keywordsEnglish.length < 3 && (
              <div className="flex items-center gap-2 mt-2 text-warning">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">At least 3 keywords are required.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
