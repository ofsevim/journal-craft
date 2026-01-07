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
    onUpdateTable(sectionId, table.id, { columns: newColumns, rows: newRows });
  };

  const removeColumn = (sectionId: string, table: TableData, colIndex: number) => {
    if (table.columns.length <= 1) return;
    const newColumns = table.columns.filter((_, i) => i !== colIndex);
    const newRows = table.rows.map(row => row.filter((_, i) => i !== colIndex));
    onUpdateTable(sectionId, table.id, { columns: newColumns, rows: newRows });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Tablolar bölümlere eklenir ve PDF'de otomatik olarak formatlanır.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Bölüm seçin" />
            </SelectTrigger>
            <SelectContent>
              {sections.map(section => (
                <SelectItem key={section.id} value={section.id}>
                  {section.title || 'Başlıksız'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => selectedSection && onAddTable(selectedSection)}
            disabled={!selectedSection}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Tablo Ekle
          </Button>
        </div>
      </div>

      {allTables.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
          <TableIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Henüz tablo eklenmemiş.</p>
          <p className="text-sm text-muted-foreground mb-4">
            Bir bölüm seçip tablo ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {allTables.map((table, tableIndex) => (
            <Card key={table.id} className="section-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      Tablo {tableIndex + 1}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({table.sectionTitle})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveTable(table.sectionId, table.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="form-label">Tablo Başlığı</Label>
                    <Input
                      value={table.caption}
                      onChange={(e) =>
                        onUpdateTable(table.sectionId, table.id, { caption: e.target.value })
                      }
                      placeholder="Engellilik Algısı Alt Boyutları"
                    />
                  </div>
                  <div>
                    <Label className="form-label">Tablo Genişliği</Label>
                    <Select
                      value={table.layout}
                      onValueChange={(value: 'two-column' | 'full-width') =>
                        onUpdateTable(table.sectionId, table.id, { layout: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="two-column">İki Sütun</SelectItem>
                        <SelectItem value="full-width">Tam Genişlik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Table Grid container with horizontal scroll */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto overflow-y-hidden custom-scrollbar pb-2">
                    <table className="w-full border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-muted">
                          <th className="w-10 border-r border-b border-border" />
                          {table.columns.map((col, colIndex) => (
                            <th
                              key={colIndex}
                              className="border-r border-b border-border last:border-r-0 min-w-[160px]"
                            >
                              <div className="flex items-center">
                                <Input
                                  value={col}
                                  onChange={(e) =>
                                    updateColumnHeader(table.sectionId, table, colIndex, e.target.value)
                                  }
                                  className="border-0 bg-transparent font-semibold text-sm h-10 rounded-none focus-visible:ring-0"
                                  placeholder="Başlık"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                  onClick={() => removeColumn(table.sectionId, table, colIndex)}
                                >
                                  <MinusCircle className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </th>
                          ))}
                          <th className="w-10 border-b border-border bg-muted/30">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => addColumn(table.sectionId, table)}
                            >
                              <PlusCircle className="w-4 h-4" />
                            </Button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-border last:border-b-0">
                            <td className="border-r border-border bg-muted/50 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => removeRow(table.sectionId, table, rowIndex)}
                              >
                                <MinusCircle className="w-3.5 h-3.5" />
                              </Button>
                            </td>
                            {row.map((cell, colIndex) => (
                              <td key={colIndex} className="border-r border-border last:border-r-0">
                                <Input
                                  value={cell}
                                  onChange={(e) =>
                                    updateCell(table.sectionId, table, rowIndex, colIndex, e.target.value)
                                  }
                                  className="border-0 bg-transparent text-sm h-10 rounded-none focus-visible:ring-0"
                                  placeholder="—"
                                />
                              </td>
                            ))}
                            <td className="w-10 bg-muted/10" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-muted/50 px-3 py-2 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                      onClick={() => addRow(table.sectionId, table)}
                    >
                      <PlusCircle className="w-4 h-4 mr-1.5" />
                      Satır Ekle
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="form-label">Tablo Notları (İsteğe bağlı)</Label>
                  <Textarea
                    value={table.notes}
                    onChange={(e) =>
                      onUpdateTable(table.sectionId, table.id, { notes: e.target.value })
                    }
                    placeholder="Tabloya ait açıklama notları..."
                    className="resize-none h-20"
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
