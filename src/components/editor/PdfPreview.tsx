import React from 'react';
import { Article } from '@/types/article';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfPreviewProps {
  article: Article;
}

export function PdfPreview({ article }: PdfPreviewProps) {
  const formatKeywords = (keywords: string[]) => {
    return keywords.length > 0 ? keywords.join(', ') : '–';
  };

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
        {/* A4 Paper Preview - matching scd.cls geometry */}
        <div className="paper-preview max-w-[210mm] mx-auto min-h-[297mm] shadow-xl relative" 
             style={{ padding: '2.6cm 1.7cm 3.2cm 1.7cm' }}>
          
          {/* ===== FIRST PAGE HEADER ===== */}
          <div className="relative mb-6">
            {/* Journal Name - Hoefler Text style */}
            <h1 className="font-scd-journal text-[26px] font-bold text-[hsl(var(--scd-blue))] leading-tight">
              Sosyal Çalışma Dergisi
            </h1>
            
            {/* Article Type Box - Burgundy */}
            <div className="absolute top-0 right-0 bg-[hsl(var(--scd-red))] text-white px-3 py-1">
              <span className="font-scd-title text-sm">Araştırma</span>
            </div>
            
            {/* Red horizontal line */}
            <div className="h-0.5 bg-[hsl(var(--scd-red))] mt-3 mb-1" />
            
            {/* Journal URL */}
            <p className="font-scd-title text-[10px] text-right text-muted-foreground">
              https://dergipark.org.tr/tr/pub/scd
            </p>
          </div>

          {/* ===== TITLE BLOCK ===== */}
          <div className="mb-6">
            {/* Turkish Title - Primary, Bold */}
            <h2 className="font-scd-title text-[18px] font-bold text-[hsl(var(--scd-dark-davy))] leading-tight mb-2">
              {article.metadata.titleTurkish || 'Makale Başlığı (Türkçe)'}
            </h2>
            {/* English Title - Italic */}
            <h3 className="font-scd-title text-[16px] text-[hsl(var(--scd-dark-davy))] italic leading-tight">
              {article.metadata.titleEnglish || 'Article Title (English)'}
            </h3>
          </div>

          {/* ===== AUTHORS ===== */}
          {article.metadata.authors.length > 0 && (
            <div className="mb-4">
              <p className="font-scd-title text-base">
                {article.metadata.authors.map((author, index) => (
                  <span key={author.id}>
                    {author.name || 'Yazar Adı'}
                    {author.isCorresponding && (
                      <sup className="text-[hsl(var(--scd-red))]">*</sup>
                    )}
                    <sup className="text-[hsl(var(--scd-red))]">{index + 1}</sup>
                    {/* ORCID Icon */}
                    {author.orcid && (
                      <span className="inline-flex items-center ml-1">
                        <span className="inline-block w-3 h-3 bg-green-600 rounded-full text-white text-[7px] font-bold leading-3 text-center">
                          iD
                        </span>
                      </span>
                    )}
                    {index < article.metadata.authors.length - 1 && ', '}
                  </span>
                ))}
              </p>
              
              {/* Affiliations */}
              <div className="font-scd-title text-[9px] text-[hsl(var(--scd-text-gray))] mt-2 ml-4 space-y-0.5">
                {article.metadata.authors.map((author, index) => (
                  <p key={author.id}>
                    <sup className="text-[hsl(var(--scd-red))]">{index + 1}</sup> {author.affiliation || 'Kurum bilgisi'}
                    {author.email && ` • ${author.email}`}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* ===== ABSTRACT BLOCKS (T&F Style) ===== */}
          {/* Turkish Abstract */}
          <div className="flex gap-4 mb-4">
            {/* Abstract Box - Light Blue Background */}
            <div className="flex-1 bg-[hsl(var(--scd-light-blue))] p-4">
              <h4 className="font-scd-title text-sm font-bold text-[hsl(var(--scd-blue))] mb-2">
                ÖZ
              </h4>
              <p className="font-scd-title text-sm leading-relaxed text-justify">
                {article.abstract.abstractTurkish || 'Türkçe özet metni buraya eklenecektir...'}
              </p>
            </div>
            
            {/* Metadata Sidebar */}
            <div className="w-[22%] font-scd-meta text-[10px]">
              <h5 className="font-bold text-[hsl(var(--scd-blue))] mb-1">MAKALE GEÇMİŞİ</h5>
              <div className="text-[9px] text-[hsl(var(--scd-text-gray))] space-y-0.5">
                <p>Başvuru: {article.history.receivedDate || '–'}</p>
                <p>Kabul: {article.history.acceptedDate || '–'}</p>
                <p>Yayın: {article.history.publishedDate || '–'}</p>
              </div>
              
              <h5 className="font-bold text-[hsl(var(--scd-blue))] mt-3 mb-1">ANAHTAR KELİMELER</h5>
              <p className="text-[9px] text-[hsl(var(--scd-text-gray))] leading-relaxed">
                {formatKeywords(article.abstract.keywordsTurkish)}
              </p>
              
              {article.ethics.hasEthicsApproval && (
                <>
                  <h5 className="font-bold text-[hsl(var(--scd-blue))] mt-3 mb-1">ETİK BEYAN</h5>
                  <p className="text-[9px] text-[hsl(var(--scd-text-gray))] leading-relaxed">
                    {article.ethics.ethicsText || 'Etik kurul onayı alınmıştır.'}
                    {article.ethics.decisionNumber && ` (${article.ethics.decisionNumber})`}
                  </p>
                </>
              )}
            </div>
          </div>
          
          {/* English Abstract */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-[hsl(var(--scd-light-blue))] p-4">
              <h4 className="font-scd-title text-sm font-bold text-[hsl(var(--scd-blue))] mb-2">
                ABSTRACT
              </h4>
              <p className="font-scd-title text-sm leading-relaxed text-justify">
                {article.abstract.abstractEnglish || 'English abstract text will be added here...'}
              </p>
            </div>
            
            <div className="w-[22%] font-scd-meta text-[10px]">
              <h5 className="font-bold text-[hsl(var(--scd-blue))] mb-1">ARTICLE HISTORY</h5>
              <div className="text-[9px] text-[hsl(var(--scd-text-gray))] space-y-0.5">
                <p>Received: {article.history.receivedDate || '–'}</p>
                <p>Accepted: {article.history.acceptedDate || '–'}</p>
                <p>Published: {article.history.publishedDate || '–'}</p>
              </div>
              
              <h5 className="font-bold text-[hsl(var(--scd-blue))] mt-3 mb-1">KEYWORDS</h5>
              <p className="text-[9px] text-[hsl(var(--scd-text-gray))] leading-relaxed">
                {formatKeywords(article.abstract.keywordsEnglish)}
              </p>
            </div>
          </div>

          {/* ===== CITATION BOX ===== */}
          <div className="flex items-start gap-2 mb-4">
            <span className="text-[hsl(var(--scd-blue))] text-3xl leading-none font-serif">"</span>
            <div className="flex-1">
              <p className="font-scd-meta text-[10px] font-bold text-[hsl(var(--scd-blue))]">Atıf / To Cite:</p>
              <p className="font-scd-meta text-[9px] text-[hsl(var(--scd-text-gray))]">
                {article.metadata.authors.map(a => a.name).filter(Boolean).join(', ') || 'Yazar'} 
                ({article.metadata.year}). {article.metadata.titleTurkish || 'Başlık'}. 
                <em> Sosyal Çalışma Dergisi</em>, {article.metadata.volume || '–'}({article.metadata.issue || '–'}), 1–XX.
              </p>
            </div>
          </div>

          {/* ===== CONTACT BOX ===== */}
          {article.metadata.authors.some(a => a.isCorresponding && a.email) && (
            <div className="flex items-start gap-2 mb-6">
              {/* Mail icon */}
              <div className="w-4 h-3 bg-[hsl(var(--scd-blue))] relative mt-1">
                <div className="absolute inset-x-0 top-0 h-0 border-l-[8px] border-r-[8px] border-t-[6px] border-l-transparent border-r-transparent border-t-white" />
              </div>
              <div className="flex-1">
                <p className="font-scd-meta text-[10px] font-bold text-[hsl(var(--scd-blue))]">İletişim / Contact:</p>
                {article.metadata.authors.filter(a => a.isCorresponding).map(author => (
                  <p key={author.id} className="font-scd-meta text-[9px] text-[hsl(var(--scd-text-gray))]">
                    {author.name} • <span className="text-[hsl(var(--scd-blue))] underline">{author.email}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* ===== MAIN BODY (Two Column Layout) ===== */}
          <div className="columns-2 gap-6 text-[11px] leading-[13px] font-scd-body">
            {article.sections.map((section, index) => (
              <div key={section.id} className="mb-4 break-inside-avoid-column">
                {/* Section Header - Blue, Bold */}
                <h4 className="font-scd-body text-[12px] font-bold text-[hsl(var(--scd-blue))] mb-2 uppercase">
                  {index + 1}. {section.title}
                </h4>
                
                {/* Section Content */}
                <div className="text-justify indent-4 whitespace-pre-wrap">
                  {section.content || 'Bölüm içeriği...'}
                </div>
                
                {/* Tables in section */}
                {section.tables.map((table, tableIndex) => (
                  <div key={table.id} className="my-4 break-inside-avoid">
                    <p className="font-scd-title text-[10px] font-bold text-center mb-2">
                      Tablo {tableIndex + 1}. {table.caption}
                    </p>
                    <div className="border-t-2 border-b-2 border-black overflow-x-auto">
                      <table className="w-full font-scd-body text-[10px]">
                        <thead>
                          <tr className="border-b border-black">
                            {table.columns.map((col, i) => (
                              <th key={i} className="px-2 py-1.5 text-left font-bold">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-gray-300 last:border-0">
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-2 py-1">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {table.notes && (
                      <p className="text-[9px] text-[hsl(var(--scd-text-gray))] mt-1 italic">
                        <span className="font-semibold">Not:</span> {table.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ===== REFERENCES ===== */}
          {article.references.length > 0 && (
            <div className="mt-6 pt-4">
              <h4 className="font-scd-body text-[12px] font-bold text-[hsl(var(--scd-blue))] mb-3 uppercase">
                Kaynakça
              </h4>
              <div className="font-scd-body text-[10px] leading-[12px] space-y-1.5">
                {article.references.map((ref, index) => (
                  <p key={index} className="pl-4 -indent-4">
                    {ref}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* ===== FIRST PAGE FOOTER ===== */}
          <div className="absolute bottom-8 left-[1.7cm] right-[1.7cm]">
            <div className="h-0.5 bg-[hsl(var(--scd-blue))] mb-2" />
            <div className="flex justify-between items-center font-scd-meta text-[8px] text-[hsl(var(--scd-text-gray))]">
              <div>
                <p>Turkish Journal of Social Work | E-ISSN: 2587-1412</p>
                <p>Bu makale CC BY-NC 4.0 ile lisanslanmıştır.</p>
                <div className="flex gap-1 mt-1">
                  <span className="w-3 h-3 bg-gray-400 rounded-sm text-[6px] text-white flex items-center justify-center font-bold">CC</span>
                  <span className="w-3 h-3 bg-gray-400 rounded-sm text-[6px] text-white flex items-center justify-center font-bold">BY</span>
                  <span className="w-3 h-3 bg-gray-400 rounded-sm text-[6px] text-white flex items-center justify-center font-bold">NC</span>
                </div>
              </div>
              <div className="text-right">
                <p>{article.metadata.year} | Cilt {article.metadata.volume || '–'} | Sayı {article.metadata.issue || '–'}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
