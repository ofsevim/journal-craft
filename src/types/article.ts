// Article data types for the academic editor

export interface Author {
  id: string;
  name: string;
  affiliation: string;
  orcid: string;
  email: string;
  isCorresponding: boolean;
}

export interface ArticleMetadata {
  titleTurkish: string;
  titleEnglish: string;
  authors: Author[];
  doi: string;
  journalName: string;
  volume: string;
  issue: string;
  year: string;
  pages: string;
}

export interface AbstractSection {
  abstractEnglish: string;
  keywordsEnglish: string[];
  abstractTurkish: string;
  keywordsTurkish: string[];
}

export interface ArticleHistory {
  receivedDate: string;
  acceptedDate: string;
  publishedDate: string;
}

export interface EthicsStatement {
  hasEthicsApproval: boolean;
  ethicsText: string;
  approvalDate: string;
  decisionNumber: string;
  committeeName: string;
}

export interface TableData {
  id: string;
  caption: string;
  layout: 'two-column' | 'full-width';
  columns: string[];
  rows: string[][];
  notes: string;
}

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  subsections: ArticleSubsection[];
  tables: TableData[];
  order: number;
}

export interface ArticleSubsection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Article {
  id: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  metadata: ArticleMetadata;
  abstract: AbstractSection;
  history: ArticleHistory;
  ethics: EthicsStatement;
  sections: ArticleSection[];
  references: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export type EditorTab = 'metadata' | 'abstract' | 'content' | 'tables' | 'references' | 'ethics';
