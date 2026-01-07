import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, AlertCircle } from 'lucide-react';
import { EthicsStatement, ValidationError } from '@/types/article';

interface EthicsEditorProps {
  ethics: EthicsStatement;
  validationErrors: ValidationError[];
  onUpdate: (updates: Partial<EthicsStatement>) => void;
}

export function EthicsEditor({ ethics, validationErrors, onUpdate }: EthicsEditorProps) {
  const handleTextChange = (value: string) => {
    onUpdate({
      ethicsText: value,
      hasEthicsApproval: value.trim().length > 0
    });
  };

  return (
    <div className="space-y-6">
      <Card className="section-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-section-header flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Etik Beyan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="form-label">Etik Beyan Metni</Label>
            <Textarea
              value={ethics.ethicsText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Örn: Bu çalışma için XYZ Üniversitesi Etik Kurulu'ndan 01.01.2024 tarih ve 2024/01-15 sayılı karar ile etik kurul onayı alınmıştır..."
              className="min-h-[160px] resize-none font-academic"
            />
            <p className="form-hint">
              Bu metin makalenin sonunda "Etik Beyan" bölümünde görünecektir.
            </p>
          </div>

          {!ethics.ethicsText && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
              <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Etik Kurul Onayı Gerekmiyorsa</p>
                <p>
                  Derleme makaleleri, teorik çalışmalar veya ikincil veri analizleri genellikle etik kurul onayı gerektirmez.
                  Bu durumda bu bölümü boş bırakabilirsiniz.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
