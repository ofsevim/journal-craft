import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, PlusCircle, MinusCircle, Table as TableIcon } from 'lucide-react';
import { ArticleSection, TableData } from '@/types/article';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TablesEditorProps {
  sections: ArticleSection[];
  onAddTable: (sectionId: string) => string;
  onUpdateTable: (sectionId: string, tableId: string, updates: Partial<TableData>) => void;
  onRemoveTable: (sectionId: string, tableId: string) => void;
}

export function TablesEditor({
  sections,
  onAddTable,
  onUpdateTable,
  onRemoveTable,
}: TablesEditorProps) {
  const [selectedSection, setSelectedSection] = useState<string>(sections[0]?.id || '');

  const allTables = sections.flatMap(section =>
    section.tables.map(table => ({ ...table, sectionId: section.id, sectionTitle: section.title }))
  );

  const addColumn = (sectionId: string, table: TableData) => {
    const newColumns = [...table.columns, `Sütun ${table.columns.length + 1}`];
    const newRows = table.rows.map(row => [...row, '']);
    const newWidths = [...(table.columnWidths || table.columns.map(() => 180)), 180];
    onUpdateTable(sectionId, table.id, { columns: newColumns, rows: newRows, columnWidths: newWidths });
  };

  const removeColumn = (sectionId: string, table: TableData, colIndex: number) => {
    if (table.columns.length <= 1) return;
    const newColumns = table.columns.filter((_, i) => i !== colIndex);
    const newRows = table.rows.map(row => row.filter((_, i) => i !== colIndex));
    const newWidths = (table.columnWidths || table.columns.map(() => 180)).filter((_, i) => i !== colIndex);
    onUpdateTable(sectionId, table.id, { columns: newColumns, rows: newRows, columnWidths: newWidths });
  };

  const updateColumnWidth = (sectionId: string, table: TableData, colIndex: number, width: number) => {
    const currentWidths = table.columnWidths || table.columns.map(() => 180);
    const newWidths = currentWidths.map((w, i) => i === colIndex ? Math.max(80, width) : w);
    onUpdateTable(sectionId, table.id, { columnWidths: newWidths });
  };

  const addRow = (sectionId: string, table: TableData) => {
    const newRow = new Array(table.columns.length).fill('');
    onUpdateTable(sectionId, table.id, { rows: [...table.rows, newRow] });
  };

  const removeRow = (sectionId: string, table: TableData, rowIndex: number) => {
    if (table.rows.length <= 1) return;
    const newRows = table.rows.filter((_, i) => i !== rowIndex);
    onUpdateTable(sectionId, table.id, { rows: newRows });
  };

  const updateCell = (sectionId: string, table: TableData, rowIndex: number, colIndex: number, value: string) => {
    const newRows = table.rows.map((row, ri) =>
      ri === rowIndex ? row.map((cell, ci) => (ci === colIndex ? value : cell)) : row
    );
    onUpdateTable(sectionId, table.id, { rows: newRows });
  };

  const updateColumnHeader = (sectionId: string, table: TableData, colIndex: number, value: string) => {
    const newColumns = table.columns.map((col, i) => (i === colIndex ? value : col));
    onUpdateTable(sectionId, table.id, { columns: newColumns });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Redesigned Header - Single column layout for best visibility */}
      <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-primary" />
            Yeni Tablo Oluştur
          </h3>
          <p className="text-xs text-muted-foreground">
            Aşağıdan bir bölüm seçin ve ardından tablo ekleyin.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 min-w-[180px]">
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="h-10 bg-background">
                <SelectValue placeholder="Bölüm seçin" />
              </SelectTrigger>
              <SelectContent>
                {sections.map(section => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.title || 'Başlıksız Bölüm'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="default"
            className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 h-10 shadow-sm"
            onClick={() => selectedSection && onAddTable(selectedSection)}
            disabled={!selectedSection}
          >
            <Plus className="w-4 h-4 mr-2" />
            Bölüme Tablo Ekle
          </Button>
        </div>
      </div>

      {allTables.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-muted/10">
          <TableIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h4 className="text-base font-medium text-foreground">Henüz tablo eklenmemiş</h4>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
            Makalenize veri tablosu eklemek için yukarıdaki menüyü kullanın.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {allTables.map((table, tableIndex) => (
            <Card key={table.id} className="section-card border-2 border-border/60 shadow-md">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <TableIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold">
                        Tablo {tableIndex + 1}
                      </CardTitle>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                        Konum: {table.sectionTitle}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={() => onRemoveTable(table.sectionId, table.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Tablo Başlığı (Otomatik Numaralanır)
                    </Label>
                    <Input
                      value={table.caption}
                      className="bg-muted/30 focus-visible:bg-background transition-colors"
                      onChange={(e) =>
                        onUpdateTable(table.sectionId, table.id, { caption: e.target.value })
                      }
                      placeholder="Ör: Katılımcıların demografik verileri"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Yazdırılacak Genişlik
                    </Label>
                    <Select
                      value={table.layout}
                      onValueChange={(value: 'two-column' | 'full-width') =>
                        onUpdateTable(table.sectionId, table.id, { layout: value })
                      }
                    >
                      <SelectTrigger className="bg-muted/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="two-column">Tek Sütun (Dar)</SelectItem>
                        <SelectItem value="full-width">Çift Sütun (Geniş/Tam sayfa)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Table Editor Grid */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tablo İçeriği
                  </Label>
                  <div className="border border-border rounded-xl bg-background shadow-inner overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar pb-2">
                      <table className="w-max min-w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/40">
                            <th className="w-12 border-r border-b border-border/80" />
                            {table.columns.map((col, colIndex) => {
                              const colWidth = (table.columnWidths && table.columnWidths[colIndex]) || 180;
                              return (
                                <th
                                  key={colIndex}
                                  style={{ width: colWidth, minWidth: colWidth }}
                                  className="border-r border-b border-border/80 last:border-r-0 group relative"
                                >
                                  <div className="flex items-center px-1">
                                    <Input
                                      value={col}
                                      onChange={(e) =>
                                        updateColumnHeader(table.sectionId, table, colIndex, e.target.value)
                                      }
                                      className="border-0 bg-transparent font-bold text-xs h-10 rounded-none focus-visible:ring-0 px-2"
                                      placeholder="Sütun Adı"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => removeColumn(table.sectionId, table, colIndex)}
                                    >
                                      <MinusCircle className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>

                                  {/* Resize Handle */}
                                  <div
                                    className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/40 active:bg-primary z-20 group-hover:bg-muted-foreground/20"
                                    onMouseDown={(e) => {
                                      const startX = e.pageX;
                                      const startWidth = colWidth;

                                      const onMouseMove = (moveEvent: MouseEvent) => {
                                        const newWidth = startWidth + (moveEvent.pageX - startX);
                                        updateColumnWidth(table.sectionId, table, colIndex, newWidth);
                                      };

                                      const onMouseUp = () => {
                                        document.removeEventListener('mousemove', onMouseMove);
                                        document.removeEventListener('mouseup', onMouseUp);
                                      };

                                      document.addEventListener('mousemove', onMouseMove);
                                      document.addEventListener('mouseup', onMouseUp);
                                    }}
                                  />
                                </th>
                              );
                            })}
                            <th className="w-14 border-b border-border/80 bg-primary/5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-full w-full rounded-none text-primary hover:bg-primary/10"
                                onClick={() => addColumn(table.sectionId, table)}
                                title="Sütun Ekle"
                              >
                                <PlusCircle className="w-5 h-5" />
                              </Button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-border/60 hover:bg-muted/10 transition-colors last:border-b-0">
                              <td className="border-r border-border/60 bg-muted/20 text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground/40 hover:text-destructive"
                                  onClick={() => removeRow(table.sectionId, table, rowIndex)}
                                >
                                  <MinusCircle className="w-3.5 h-3.5" />
                                </Button>
                              </td>
                              {row.map((cell, colIndex) => {
                                const colWidth = (table.columnWidths && table.columnWidths[colIndex]) || 180;
                                return (
                                  <td
                                    key={colIndex}
                                    className="border-r border-border/60 last:border-r-0"
                                    style={{ width: colWidth, minWidth: colWidth }}
                                  >
                                    <Input
                                      value={cell}
                                      onChange={(e) =>
                                        updateCell(table.sectionId, table, rowIndex, colIndex, e.target.value)
                                      }
                                      className="border-0 bg-transparent text-sm h-11 rounded-none focus-visible:ring-1 focus-visible:ring-primary/20 px-3 w-full"
                                      placeholder="..."
                                    />
                                  </td>
                                );
                              })}
                              <td className="w-14 bg-muted/5 border-l border-border/40" />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-muted/30 px-4 py-3 border-t border-border/60 flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-background text-foreground text-xs shadow-sm hover:bg-muted font-medium border-border/80"
                        onClick={() => addRow(table.sectionId, table)}
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-2 text-primary" />
                        Yeni Satır Ekle
                      </Button>
                      <p className="text-[10px] text-muted-foreground italic">
                        Tablo {tableIndex + 1} için veri girişi yapıyorsunuz.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    Tablo Notları / Kaynakça
                    <span className="text-[10px] font-normal lowercase bg-muted px-1.5 rounded">(isteğe bağlı)</span>
                  </Label>
                  <Textarea
                    value={table.notes}
                    onChange={(e) =>
                      onUpdateTable(table.sectionId, table.id, { notes: e.target.value })
                    }
                    placeholder="Tablo altında görünecek açıklamaları veya veri kaynağını buraya yazın..."
                    className="resize-none h-24 bg-muted/20 focus-visible:bg-background border-border/60"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
