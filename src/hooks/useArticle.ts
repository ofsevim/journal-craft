import { useState, useCallback } from 'react';
import { Article, Author, ArticleSection, TableData, ValidationError } from '@/types/article';

const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const createDefaultArticle = (): Article => ({
  id: generateId(),
  status: 'draft',
  metadata: {
    titleTurkish: '',
    titleEnglish: '',
    authors: [],
    doi: '',
    journalName: 'Sosyal Bilimler Dergisi',
    volume: '',
    issue: '',
    year: new Date().getFullYear().toString(),
    pages: '',
  },
  abstract: {
    abstractEnglish: '',
    keywordsEnglish: [],
    abstractTurkish: '',
    keywordsTurkish: [],
  },
  history: {
    receivedDate: '',
    acceptedDate: '',
    publishedDate: '',
  },
  ethics: {
    hasEthicsApproval: false,
    ethicsText: '',
    approvalDate: '',
    decisionNumber: '',
    committeeName: '',
  },
  sections: [
    {
      id: generateId(),
      title: 'Giriş',
      content: '',
      subsections: [],
      tables: [],
      order: 0,
    },
    {
      id: generateId(),
      title: 'Yöntem',
      content: '',
      subsections: [],
      tables: [],
      order: 1,
    },
    {
      id: generateId(),
      title: 'Bulgular',
      content: '',
      subsections: [],
      tables: [],
      order: 2,
    },
    {
      id: generateId(),
      title: 'Tartışma',
      content: '',
      subsections: [],
      tables: [],
      order: 3,
    },
    {
      id: generateId(),
      title: 'Sonuç',
      content: '',
      subsections: [],
      tables: [],
      order: 4,
    },
  ],
  references: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function useArticle() {
  const [article, setArticle] = useState<Article>(createDefaultArticle());
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const updateMetadata = useCallback((updates: Partial<Article['metadata']>) => {
    setArticle(prev => ({
      ...prev,
      metadata: { ...prev.metadata, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateAbstract = useCallback((updates: Partial<Article['abstract']>) => {
    setArticle(prev => ({
      ...prev,
      abstract: { ...prev.abstract, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateHistory = useCallback((updates: Partial<Article['history']>) => {
    setArticle(prev => ({
      ...prev,
      history: { ...prev.history, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateEthics = useCallback((updates: Partial<Article['ethics']>) => {
    setArticle(prev => ({
      ...prev,
      ethics: { ...prev.ethics, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addAuthor = useCallback(() => {
    const newAuthor: Author = {
      id: generateId(),
      name: '',
      affiliation: '',
      orcid: '',
      email: '',
      isCorresponding: false,
    };
    setArticle(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        authors: [...prev.metadata.authors, newAuthor],
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateAuthor = useCallback((authorId: string, updates: Partial<Author>) => {
    setArticle(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        authors: prev.metadata.authors.map(a =>
          a.id === authorId ? { ...a, ...updates } : a
        ),
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeAuthor = useCallback((authorId: string) => {
    setArticle(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        authors: prev.metadata.authors.filter(a => a.id !== authorId),
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addSection = useCallback(() => {
    const newSection: ArticleSection = {
      id: generateId(),
      title: 'Yeni Bölüm',
      content: '',
      subsections: [],
      tables: [],
      order: article.sections.length,
    };
    setArticle(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      updatedAt: new Date().toISOString(),
    }));
  }, [article.sections.length]);

  const updateSection = useCallback((sectionId: string, updates: Partial<ArticleSection>) => {
    setArticle(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setArticle(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addTable = useCallback((sectionId: string) => {
    const newTable: TableData = {
      id: generateId(),
      caption: '',
      layout: 'full-width',
      columns: ['Sütun 1', 'Sütun 2', 'Sütun 3'],
      rows: [['', '', '']],
      notes: '',
    };
    setArticle(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, tables: [...s.tables, newTable] } : s
      ),
      updatedAt: new Date().toISOString(),
    }));
    return newTable.id;
  }, []);

  const updateTable = useCallback((sectionId: string, tableId: string, updates: Partial<TableData>) => {
    setArticle(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              tables: s.tables.map(t => (t.id === tableId ? { ...t, ...updates } : t)),
            }
          : s
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeTable = useCallback((sectionId: string, tableId: string) => {
    setArticle(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, tables: s.tables.filter(t => t.id !== tableId) }
          : s
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateReferences = useCallback((references: string[]) => {
    setArticle(prev => ({
      ...prev,
      references,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const validate = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Metadata validation
    if (!article.metadata.titleTurkish.trim()) {
      errors.push({ field: 'titleTurkish', message: 'Türkçe başlık gereklidir', severity: 'error' });
    }
    if (!article.metadata.titleEnglish.trim()) {
      errors.push({ field: 'titleEnglish', message: 'İngilizce başlık gereklidir', severity: 'error' });
    }
    if (article.metadata.authors.length === 0) {
      errors.push({ field: 'authors', message: 'En az bir yazar eklenmelidir', severity: 'error' });
    }

    // Abstract validation
    if (!article.abstract.abstractEnglish.trim()) {
      errors.push({ field: 'abstractEnglish', message: 'İngilizce özet gereklidir', severity: 'error' });
    }
    if (!article.abstract.abstractTurkish.trim()) {
      errors.push({ field: 'abstractTurkish', message: 'Türkçe özet gereklidir', severity: 'error' });
    }
    if (article.abstract.keywordsEnglish.length < 3) {
      errors.push({ field: 'keywordsEnglish', message: 'En az 3 İngilizce anahtar kelime gereklidir', severity: 'error' });
    }
    if (article.abstract.keywordsTurkish.length < 3) {
      errors.push({ field: 'keywordsTurkish', message: 'En az 3 Türkçe anahtar kelime gereklidir', severity: 'error' });
    }

    // Section validation
    article.sections.forEach(section => {
      if (!section.title.trim()) {
        errors.push({ field: `section-${section.id}-title`, message: 'Bölüm başlığı gereklidir', severity: 'error' });
      }
      if (!section.content.trim() && section.subsections.length === 0) {
        errors.push({ field: `section-${section.id}-content`, message: `"${section.title}" bölümü boş bırakılamaz`, severity: 'warning' });
      }
    });

    // Table validation
    article.sections.forEach(section => {
      section.tables.forEach(table => {
        if (!table.caption.trim()) {
          errors.push({ field: `table-${table.id}-caption`, message: 'Tablo başlığı gereklidir', severity: 'error' });
        }
        const columnCount = table.columns.length;
        table.rows.forEach((row, rowIndex) => {
          if (row.length !== columnCount) {
            errors.push({
              field: `table-${table.id}-row-${rowIndex}`,
              message: `Satır ${rowIndex + 1} sütun sayısı başlık ile uyuşmuyor`,
              severity: 'error',
            });
          }
        });
      });
    });

    setValidationErrors(errors);
    return errors;
  }, [article]);

  return {
    article,
    setArticle,
    validationErrors,
    isSaving,
    updateMetadata,
    updateAbstract,
    updateHistory,
    updateEthics,
    addAuthor,
    updateAuthor,
    removeAuthor,
    addSection,
    updateSection,
    removeSection,
    addTable,
    updateTable,
    removeTable,
    updateReferences,
    validate,
  };
}
