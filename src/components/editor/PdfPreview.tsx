import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Article } from '@/types/article';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ZoomIn, ZoomOut, RefreshCw, Loader2, FileCode, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JOURNAL_CONFIG } from '@/config/journal';
import { compileArticleToPdf, checkApiHealth } from '@/api/latex';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PdfPreviewProps {
  article: Article;
}

export function PdfPreview({ article }: PdfPreviewProps) {
  const [previewMode, setPreviewMode] = useState<'html' | 'pdf'>('html');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const lastArticleRef = useRef<string>('');

  // Check if backend is available on mount
  useEffect(() => {
    checkApiHealth().then(setBackendAvailable);
  }, []);

  // Generate PDF preview
  const generatePdfPreview = useCallback(async () => {
    if (!backendAvailable) {
      setError('LaTeX sunucusu çalışmıyor');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const blob = await compileArticleToPdf(article);
      const url = URL.createObjectURL(blob);

      // Revoke old URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      setPdfUrl(url);
      lastArticleRef.current = JSON.stringify(article);
    } catch (err: any) {
      setError(err.message || 'PDF oluşturulamadı');
    } finally {
      setIsLoading(false);
    }
  }, [article, backendAvailable, pdfUrl]);

  // Auto-refresh PDF when switching to PDF mode
  useEffect(() => {
    if (previewMode === 'pdf' && backendAvailable) {
      const currentArticle = JSON.stringify(article);
      if (currentArticle !== lastArticleRef.current) {
        generatePdfPreview();
      }
    }
  }, [previewMode, backendAvailable]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const formatKeywords = (keywords: string[]) => {
    return keywords.length > 0 ? keywords.join(', ') : '–';
  };

  return (
    <div className="h-full preview-panel flex flex-col">
      <div className="editor-toolbar flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="section-header">Önizleme</span>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as 'html' | 'pdf')}>
            <TabsList className="h-7">
              <TabsTrigger value="html" className="text-xs h-6 px-2">
                <Eye className="w-3 h-3 mr-1" />
                Hızlı
              </TabsTrigger>
              <TabsTrigger value="pdf" className="text-xs h-6 px-2" disabled={!backendAvailable}>
                <FileCode className="w-3 h-3 mr-1" />
                LaTeX
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {previewMode === 'pdf' && (
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7"
              onClick={generatePdfPreview}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {previewMode === 'pdf' ? (
        <div className="flex-1 flex flex-col">
          {isLoading && (
            <div className="flex-1 flex items-center justify-center bg-muted/30">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">LaTeX derleniyor...</p>
                <p className="text-xs text-muted-foreground mt-1">Bu birkaç saniye sürebilir</p>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex-1 flex items-center justify-center bg-destructive/5">
              <div className="text-center p-6">
                <p className="text-sm text-destructive font-medium mb-2">Derleme Hatası</p>
                <p className="text-xs text-muted-foreground mb-4">{error}</p>
                <Button variant="outline" size="sm" onClick={generatePdfPreview}>
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Tekrar Dene
                </Button>
              </div>
            </div>
          )}

          {pdfUrl && !isLoading && !error && (
            <iframe
              src={pdfUrl}
              className="flex-1 w-full border-0"
              title="PDF Preview"
            />
          )}

          {!pdfUrl && !isLoading && !error && (
            <div className="flex-1 flex items-center justify-center bg-muted/30">
              <div className="text-center">
                <FileCode className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground mb-3">Gerçek LaTeX Önizlemesi</p>
                <Button variant="default" size="sm" onClick={generatePdfPreview}>
                  <RefreshCw className="w-3 h-3 mr-1" />
                  PDF Oluştur
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ScrollArea className="flex-1 p-6">
          {/* A4 Paper Preview - matching scd.cls geometry */}
          <div id="article-pdf-content" className="paper-preview max-w-[210mm] mx-auto min-h-[297mm] shadow-xl relative bg-white"
            style={{ padding: '2.6cm 1.7cm 3.2cm 1.7cm' }}>

            {/* ===== FIRST PAGE HEADER ===== */}
            <div className="relative mb-8 h-[2.5cm]">
              {/* Journal Name - Hoefler Text style */}
              <div className="absolute top-0 left-0">
                <h1 className="font-scd-journal text-[26pt] font-bold text-[hsl(var(--scd-blue))] leading-tight">
                  Sosyal Çalışma Dergisi
                </h1>
              </div>

              {/* Red horizontal line - Aligned with scd.cls TikZ */}
              <div className="absolute top-[2.1cm] right-0 left-[10.3cm] h-[2px] bg-[hsl(var(--scd-red))]" />

              {/* Article Type Box - Aligned with scd.cls TikZ */}
              <div className="absolute top-0 right-0 bg-[hsl(var(--scd-red))] text-white px-4 py-1 text-sm font-scd-header min-h-[0.6cm] flex items-center">
                Araştırma
              </div>

              {/* Journal URL - Aligned with scd.cls TikZ */}
              <div className="absolute top-[2.2cm] right-0">
                <p className="font-scd-header text-[8pt] text-muted-foreground">
                  {JOURNAL_CONFIG.url}
                </p>
              </div>
            </div>

            {/* ===== TITLES ===== */}
            <div className="mb-6">
              {article.language === 'EN' ? (
                <>
                  <h2 className="font-scd-title text-[18pt] font-bold text-[hsl(var(--scd-dark-davy))] leading-tight mb-2">
                    {article.metadata.titleEnglish || 'English Title'}
                  </h2>
                  <h3 className="font-scd-title text-[14pt] italic text-[hsl(var(--scd-dark-davy))] leading-tight">
                    {article.metadata.titleTurkish || 'Türkçe Başlık'}
                  </h3>
                </>
              ) : (
                <>
                  <h2 className="font-scd-title text-[18pt] font-bold text-[hsl(var(--scd-dark-davy))] leading-tight mb-2">
                    {article.metadata.titleTurkish || 'Türkçe Başlık'}
                  </h2>
                  <h3 className="font-scd-title text-[14pt] italic text-[hsl(var(--scd-dark-davy))] leading-tight">
                    {article.metadata.titleEnglish || 'English Title'}
                  </h3>
                </>
              )}
            </div>

            {/* ===== AUTHORS ===== */}
            <div className="mb-6">
              <p className="font-scd-author text-[12pt]">
                {article.metadata.authors.length > 0
                  ? article.metadata.authors.map((a, i) => (
                    <span key={i}>
                      {a.name}
                      <sup className="text-[hsl(var(--scd-red))]">{i + 1}</sup>
                      {a.orcid && <span className="text-green-600 ml-1">●</span>}
                      {i < article.metadata.authors.length - 1 && ', '}
                    </span>
                  ))
                  : 'Yazar bilgisi girilmemiş'}
              </p>
              {/* Affiliations */}
              <div className="mt-2 font-scd-meta text-[9pt] text-muted-foreground pl-6">
                {article.metadata.authors.map((a, i) => (
                  <p key={i}>
                    <sup className="text-[hsl(var(--scd-red))]">{i + 1}</sup> {a.affiliation || 'Kurum belirtilmemiş'}
                  </p>
                ))}
              </div>
            </div>

            {/* ===== ABSTRACT BOXES - Order based on language ===== */}
            {article.language === 'EN' ? (
              <>
                {/* English Abstract First */}
                <div className="flex gap-6 mb-4">
                  <div className="flex-[3] bg-[hsl(var(--scd-light-blue))] p-4">
                    <p className="font-scd-abstract text-sm font-bold text-[hsl(var(--scd-blue))] mb-2">ABSTRACT</p>
                    <p className="font-scd-abstract text-sm leading-relaxed text-justify">
                      {article.abstract.abstractEnglish || 'Abstract not entered...'}
                    </p>
                  </div>
                  <div className="flex-1 font-scd-meta text-[8pt]">
                    <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">ARTICLE HISTORY</p>
                    <p className="text-muted-foreground mb-3">
                      {article.history.receivedDate && <>Received: {article.history.receivedDate}<br /></>}
                      {article.history.acceptedDate && <>Accepted: {article.history.acceptedDate}<br /></>}
                      {article.history.publishedDate && <>Published: {article.history.publishedDate}</>}
                    </p>
                    <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">KEYWORDS</p>
                    <p className="text-muted-foreground mb-3">{formatKeywords(article.abstract.keywordsEnglish)}</p>
                    {article.ethics.hasEthicsApproval && (
                      <>
                        <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">ETHICS STATEMENT</p>
                        <p className="text-muted-foreground">{article.ethics.ethicsText}</p>
                      </>
                    )}
                  </div>
                </div>
                {/* Turkish Abstract Second */}
                <div className="flex gap-6 mb-6">
                  <div className="flex-[3] bg-[hsl(var(--scd-light-blue))] p-4">
                    <p className="font-scd-abstract text-sm font-bold text-[hsl(var(--scd-blue))] mb-2">ÖZ</p>
                    <p className="font-scd-abstract text-sm leading-relaxed text-justify">
                      {article.abstract.abstractTurkish || 'Özet girilmemiş...'}
                    </p>
                  </div>
                  <div className="flex-1 font-scd-meta text-[8pt]">
                    <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">MAKALE GEÇMİŞİ</p>
                    <p className="text-muted-foreground mb-3">
                      {article.history.receivedDate && <>Başvuru: {article.history.receivedDate}<br /></>}
                      {article.history.acceptedDate && <>Kabul: {article.history.acceptedDate}<br /></>}
                      {article.history.publishedDate && <>Yayın: {article.history.publishedDate}</>}
                    </p>
                    <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">ANAHTAR KELİMELER</p>
                    <p className="text-muted-foreground mb-3">{formatKeywords(article.abstract.keywordsTurkish)}</p>
                    {article.ethics.hasEthicsApproval && (
                      <>
                        <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">ETİK BEYAN</p>
                        <p className="text-muted-foreground">{article.ethics.ethicsText}</p>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Turkish Abstract First */}
                <div className="flex gap-6 mb-4">
                  <div className="flex-[3] bg-[hsl(var(--scd-light-blue))] p-4">
                    <p className="font-scd-abstract text-sm font-bold text-[hsl(var(--scd-blue))] mb-2">ÖZ</p>
                    <p className="font-scd-abstract text-sm leading-relaxed text-justify">
                      {article.abstract.abstractTurkish || 'Özet girilmemiş...'}
                    </p>
                  </div>
                  <div className="flex-1 font-scd-meta text-[8pt]">
                    <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">MAKALE GEÇMİŞİ</p>
                    <p className="text-muted-foreground mb-3">
                      {article.history.receivedDate && <>Başvuru: {article.history.receivedDate}<br /></>}
                      {article.history.acceptedDate && <>Kabul: {article.history.acceptedDate}<br /></>}
                      {article.history.publishedDate && <>Yayın: {article.history.publishedDate}</>}
                    </p>
                    <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">ANAHTAR KELİMELER</p>
                    <p className="text-muted-foreground mb-3">{formatKeywords(article.abstract.keywordsTurkish)}</p>
                    {article.ethics.hasEthicsApproval && (
                      <>
                        <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">ETİK BEYAN</p>
                        <p className="text-muted-foreground">{article.ethics.ethicsText}</p>
                      </>
                    )}
                  </div>
                </div>
                {/* English Abstract Second */}
                <div className="flex gap-6 mb-6">
                  <div className="flex-[3] bg-[hsl(var(--scd-light-blue))] p-4">
                    <p className="font-scd-abstract text-sm font-bold text-[hsl(var(--scd-blue))] mb-2">ABSTRACT</p>
                    <p className="font-scd-abstract text-sm leading-relaxed text-justify">
                      {article.abstract.abstractEnglish || 'Abstract not entered...'}
                    </p>
                  </div>
                  <div className="flex-1 font-scd-meta text-[8pt]">
                    <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">ARTICLE HISTORY</p>
                    <p className="text-muted-foreground mb-3">
                      {article.history.receivedDate && <>Received: {article.history.receivedDate}<br /></>}
                      {article.history.acceptedDate && <>Accepted: {article.history.acceptedDate}<br /></>}
                      {article.history.publishedDate && <>Published: {article.history.publishedDate}</>}
                    </p>
                    <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">KEYWORDS</p>
                    <p className="text-muted-foreground mb-3">{formatKeywords(article.abstract.keywordsEnglish)}</p>
                    {article.ethics.hasEthicsApproval && (
                      <>
                        <p className="font-bold text-[hsl(var(--scd-blue))] text-[9pt] mb-1">ETHICS STATEMENT</p>
                        <p className="text-muted-foreground">{article.ethics.ethicsText}</p>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ===== BODY CONTENT (Two-column) ===== */}
            <div className="columns-2 gap-6 font-scd-body text-[11pt] leading-[13pt]" style={{ columnGap: '6mm' }}>
              {article.sections.map((section, index) => (
                <div key={section.id} className="break-inside-avoid-column mb-4">
                  <h4 className="font-scd-body text-base font-bold text-[hsl(var(--scd-blue))] mb-2">
                    {index + 1}. {section.title.toUpperCase()}
                  </h4>
                  <p className="text-justify indent-4 mb-2">
                    {section.content || 'İçerik girilmemiş...'}
                  </p>

                  {/* Tables in section */}
                  {section.tables && section.tables.length > 0 && (
                    <div className="my-4 space-y-4">
                      {section.tables.map((table, tableIndex) => (
                        <div key={table.id} className={`break-inside-avoid ${table.layout === 'full-width' ? 'column-span-all' : ''}`}>
                          <p className="text-xs font-bold text-[hsl(var(--scd-blue))] mb-1">
                            Tablo {index + 1}.{tableIndex + 1}: {table.caption}
                          </p>
                          <table className="w-full text-xs border-collapse">
                            <thead>
                              <tr className="border-t-2 border-b border-[hsl(var(--scd-blue))]">
                                {table.columns.map((col, colIdx) => (
                                  <th key={colIdx} className="text-left py-1 px-2 font-bold">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {table.rows.map((row, rowIdx) => (
                                <tr key={rowIdx} className="border-b border-muted">
                                  {row.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="py-1 px-2">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {table.notes && (
                            <p className="text-[8pt] text-muted-foreground mt-1 italic">
                              Not: {table.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subsections */}
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="ml-0">
                      {section.subsections.map((sub, subIndex) => (
                        <div key={sub.id} className="mb-3">
                          <h5 className="font-scd-body text-sm font-bold mb-1">
                            {index + 1}.{subIndex + 1}. {sub.title}
                          </h5>
                          <p className="text-justify indent-4">
                            {sub.content || ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ===== FOOTER (First page) ===== */}
            <div className="absolute bottom-[2.2cm] left-[1.7cm] right-[1.7cm]">
              {/* Citation & Contact */}
              <div className="mb-2 text-[9pt] font-scd-meta">
                {article.metadata.citation && (
                  <div className="flex gap-2 mb-1">
                    <span className="text-[hsl(var(--scd-blue))] font-bold">"</span>
                    <span className="italic text-muted-foreground">Atıf / To Cite:</span>
                    <span className="text-foreground">{article.metadata.citation}</span>
                  </div>
                )}
                {article.metadata.contactText ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[hsl(var(--scd-blue))]">✉</span>
                    <span className="italic text-muted-foreground">İletişim / Contact:</span>
                    <span className="text-foreground">{article.metadata.contactText}</span>
                  </div>
                ) : (
                  article.metadata.authors.some(a => a.isCorresponding) && (
                    <div className="flex items-center gap-2">
                      <span className="text-[hsl(var(--scd-blue))]">✉</span>
                      <span className="italic text-muted-foreground">İletişim / Contact:</span>
                      {article.metadata.authors.filter(a => a.isCorresponding).map((author, i) => (
                        <span key={author.id} className="text-foreground">
                          {author.name}{author.email && ` • ${author.email}`}
                          {i < article.metadata.authors.filter(a => a.isCorresponding).length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  )
                )}
              </div>

              <div className="border-t-2 border-[hsl(var(--scd-blue))] pt-2">
                <p className="font-scd-header text-[9pt] text-muted-foreground">
                  {JOURNAL_CONFIG.nameEnglish} | E-ISSN: {JOURNAL_CONFIG.issn}
                  <span className="float-right">{article.metadata.volume && `Cilt ${article.metadata.volume}`} {article.metadata.issue && `| Sayı ${article.metadata.issue}`}</span>
                </p>
                <p className="font-scd-header text-[9pt] text-muted-foreground">
                  Bu makale {JOURNAL_CONFIG.license} ile lisanslanmıştır.
                </p>
              </div>
            </div>
          </div>

          {/* ===== PAGE 2 AND BEYOND (Body Content) ===== */}
          <div className="paper-preview max-w-[210mm] mx-auto min-h-[297mm] shadow-xl relative bg-white mt-8"
            style={{ padding: '2.6cm 1.7cm 3.2cm 1.7cm' }}>

            {/* Page 2 Header */}
            <div className="flex justify-between border-b border-muted pb-1 mb-6 text-[9pt] font-scd-header text-muted-foreground">
              <span>{article.metadata.year || new Date().getFullYear()} | {JOURNAL_CONFIG.name.toUpperCase()}</span>
              <span>Sayfa 2</span>
            </div>

            <div className="columns-2 gap-6 font-scd-body text-[11pt] leading-[13pt]" style={{ columnGap: '6mm' }}>
              {article.sections.map((section, index) => (
                <div key={section.id} className="mb-6">
                  <h4 className="font-scd-body text-base font-bold text-[hsl(var(--scd-blue))] mb-2 break-after-avoid">
                    {index + 1}. {section.title.toUpperCase()}
                  </h4>
                  <p className="text-justify indent-4 mb-2">
                    {section.content || 'İçerik girilmemiş...'}
                  </p>

                  {/* Tables in section */}
                  {section.tables && section.tables.length > 0 && (
                    <div className="my-4 space-y-4">
                      {section.tables.map((table, tableIndex) => (
                        <div key={table.id} className={`break-inside-avoid ${table.layout === 'full-width' ? 'column-span-all' : ''}`}>
                          <p className="text-xs font-bold text-[hsl(var(--scd-blue))] mb-1">
                            Tablo {index + 1}.{tableIndex + 1}: {table.caption}
                          </p>
                          <table className="w-full text-xs border-collapse">
                            <thead>
                              <tr className="border-t-2 border-b border-[hsl(var(--scd-blue))]">
                                {table.columns.map((col, colIdx) => (
                                  <th key={colIdx} className="text-left py-1 px-2 font-bold">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {table.rows.map((row, rowIdx) => (
                                <tr key={rowIdx} className="border-b border-muted">
                                  {row.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="py-1 px-2">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {table.notes && (
                            <p className="text-[8pt] text-muted-foreground mt-1 italic">
                              Not: {table.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subsections */}
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="ml-0">
                      {section.subsections.map((sub, subIndex) => (
                        <div key={sub.id} className="mb-3">
                          <h5 className="font-scd-body text-sm font-bold mb-1">
                            {index + 1}.{subIndex + 1}. {sub.title}
                          </h5>
                          <p className="text-justify indent-4">
                            {sub.content || ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ===== REFERENCES ===== */}
            {article.references && (
              <div className="mt-8 border-t pt-4">
                <h4 className="font-scd-body text-base font-bold text-[hsl(var(--scd-blue))] mb-4">
                  {article.language === 'EN' ? 'REFERENCES' : 'KAYNAKÇA'}
                </h4>
                <div className="font-scd-body text-[10pt] leading-relaxed space-y-2">
                  {article.references.filter(ref => ref.trim()).map((ref, idx) => (
                    <p key={idx} className="pl-8 -indent-8 text-justify">
                      {ref}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
