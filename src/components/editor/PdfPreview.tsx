import React from 'react';
import { Article } from '@/types/article';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfPreviewProps {
  article: Article;
}

export function PdfPreview({ article }: PdfPreviewProps) {
  return (
    <div className="h-full preview-panel flex flex-col">
      <div className="editor-toolbar flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="section-header">PDF Önizleme</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-7 h-7">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground px-2">100%</span>
          <Button variant="ghost" size="icon" className="w-7 h-7">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-2" />
          <Button variant="ghost" size="icon" className="w-7 h-7">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-6">
        <div className="paper-preview max-w-[210mm] mx-auto min-h-[297mm] p-12 font-academic">
          {/* Journal Header */}
          <div className="text-center border-b-2 border-section-border pb-4 mb-6">
            <h1 className="text-lg font-bold text-section-header tracking-wide">
              SOSYAL BİLİMLER DERGİSİ
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {article.metadata.year} • Cilt {article.metadata.volume || '–'} • Sayı {article.metadata.issue || '–'}
            </p>
            {article.metadata.doi && (
              <p className="text-xs text-muted-foreground mt-1">
                DOI: {article.metadata.doi}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="academic-title text-center mb-3">
              {article.metadata.titleTurkish || 'Makale Başlığı (Türkçe)'}
            </h2>
            <h3 className="text-lg text-center text-muted-foreground italic">
              {article.metadata.titleEnglish || 'Article Title (English)'}
            </h3>
          </div>

          {/* Authors */}
          {article.metadata.authors.length > 0 && (
            <div className="text-center mb-6">
              {article.metadata.authors.map((author, index) => (
                <div key={author.id} className="mb-2">
                  <span className="font-semibold">
                    {author.name || 'Yazar Adı'}
                    {author.isCorresponding && <sup>*</sup>}
                  </span>
                  {author.orcid && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({author.orcid})
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {author.affiliation || 'Kurum Bilgisi'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Article History */}
          <div className="text-center text-xs text-muted-foreground mb-8 pb-4 border-b border-border">
            <span>Gönderim: {article.history.receivedDate || '–'}</span>
            <span className="mx-2">•</span>
            <span>Kabul: {article.history.acceptedDate || '–'}</span>
            <span className="mx-2">•</span>
            <span>Yayın: {article.history.publishedDate || '–'}</span>
          </div>

          {/* Abstract - Turkish */}
          <div className="mb-6">
            <h4 className="font-bold text-sm uppercase tracking-wide text-section-header mb-2">
              Öz
            </h4>
            <p className="academic-abstract text-sm leading-relaxed text-justify">
              {article.abstract.abstractTurkish || 'Türkçe özet metni buraya eklenecektir...'}
            </p>
            <p className="text-sm mt-2">
              <span className="font-semibold">Anahtar Kelimeler: </span>
              {article.abstract.keywordsTurkish.length > 0 
                ? article.abstract.keywordsTurkish.join(', ')
                : 'Anahtar kelimeler...'}
            </p>
          </div>

          {/* Abstract - English */}
          <div className="mb-8 pb-6 border-b border-border">
            <h4 className="font-bold text-sm uppercase tracking-wide text-section-header mb-2">
              Abstract
            </h4>
            <p className="academic-abstract text-sm leading-relaxed text-justify italic">
              {article.abstract.abstractEnglish || 'English abstract text will be added here...'}
            </p>
            <p className="text-sm mt-2 italic">
              <span className="font-semibold">Keywords: </span>
              {article.abstract.keywordsEnglish.length > 0 
                ? article.abstract.keywordsEnglish.join(', ')
                : 'Keywords...'}
            </p>
          </div>

          {/* Sections */}
          {article.sections.map((section, index) => (
            <div key={section.id} className="mb-6">
              <h4 className="font-bold text-base uppercase tracking-wide text-section-header mb-3">
                {index + 1}. {section.title}
              </h4>
              <div className="academic-abstract text-sm leading-relaxed text-justify whitespace-pre-wrap">
                {section.content || 'Bölüm içeriği...'}
              </div>
              
              {/* Tables in section */}
              {section.tables.map((table, tableIndex) => (
                <div key={table.id} className="my-4">
                  <p className="text-sm font-semibold mb-2 text-center">
                    Tablo {tableIndex + 1}. {table.caption}
                  </p>
                  <div className="border border-border overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted">
                          {table.columns.map((col, i) => (
                            <th key={i} className="border-b border-border px-3 py-2 text-left font-semibold">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-border last:border-0">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {table.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Not: {table.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* References */}
          {article.references.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-base uppercase tracking-wide text-section-header mb-3">
                Kaynakça
              </h4>
              <div className="space-y-2">
                {article.references.map((ref, index) => (
                  <p key={index} className="text-sm leading-relaxed pl-6 -indent-6">
                    {ref}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Ethics Statement */}
          {article.ethics.hasEthicsApproval && (
            <div className="mt-8 pt-4 border-t border-border">
              <h4 className="font-bold text-sm uppercase tracking-wide text-section-header mb-2">
                Etik Beyan
              </h4>
              <p className="text-xs text-muted-foreground">
                {article.ethics.ethicsText || 'Etik kurul onayı alınmıştır.'}
                {article.ethics.committeeName && ` (${article.ethics.committeeName})`}
                {article.ethics.decisionNumber && `, Karar No: ${article.ethics.decisionNumber}`}
                {article.ethics.approvalDate && `, Tarih: ${article.ethics.approvalDate}`}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
