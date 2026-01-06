import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { EthicsStatement } from '@/types/article';

interface EthicsEditorProps {
  ethics: EthicsStatement;
  onUpdate: (updates: Partial<EthicsStatement>) => void;
}

export function EthicsEditor({ ethics, onUpdate }: EthicsEditorProps) {
  return (
    <div className="space-y-6">
      <Card className="section-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-section-header flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Etik Kurul Onayı
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30">
            <Switch
              id="hasEthicsApproval"
              checked={ethics.hasEthicsApproval}
              onCheckedChange={(checked) => onUpdate({ hasEthicsApproval: checked })}
            />
            <div className="flex-1">
              <Label htmlFor="hasEthicsApproval" className="text-sm font-medium cursor-pointer">
                Bu araştırma için etik kurul onayı alındı
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                İnsan katılımcılar, deneysel çalışmalar veya etik denetim gerektiren araştırmalar için gereklidir.
              </p>
            </div>
          </div>

          {ethics.hasEthicsApproval && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="form-label">Etik Kurul Adı</Label>
                  <Input
                    value={ethics.committeeName}
                    onChange={(e) => onUpdate({ committeeName: e.target.value })}
                    placeholder="Örn: XYZ Üniversitesi Etik Kurulu"
                  />
                </div>
                <div>
                  <Label className="form-label">Onay Tarihi</Label>
                  <Input
                    type="date"
                    value={ethics.approvalDate}
                    onChange={(e) => onUpdate({ approvalDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label className="form-label">Karar Numarası</Label>
                <Input
                  value={ethics.decisionNumber}
                  onChange={(e) => onUpdate({ decisionNumber: e.target.value })}
                  placeholder="Örn: 2024/01-15"
                />
              </div>

              <div>
                <Label className="form-label">Etik Beyan Metni</Label>
                <Textarea
                  value={ethics.ethicsText}
                  onChange={(e) => onUpdate({ ethicsText: e.target.value })}
                  placeholder="Bu çalışma için XYZ Üniversitesi Etik Kurulu'ndan 01.01.2024 tarih ve 2024/01-15 sayılı karar ile etik kurul onayı alınmıştır. Tüm katılımcılardan bilgilendirilmiş onam alınmıştır."
                  className="min-h-[120px] resize-none font-academic"
                />
                <p className="form-hint">
                  Bu metin makalenin sonunda "Etik Beyan" bölümünde görünecektir.
                </p>
              </div>
            </div>
          )}

          {!ethics.hasEthicsApproval && (
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

      <Card className="section-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-section-header">
            Etik Kurallar Hatırlatması
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                İnsan katılımcıların dahil olduğu tüm çalışmalar için etik kurul onayı zorunludur.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Katılımcılardan bilgilendirilmiş onam alınmalıdır.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Kişisel veriler gizli tutulmalı ve anonimleştirilmelidir.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Çıkar çatışması varsa beyan edilmelidir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
