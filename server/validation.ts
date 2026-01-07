import { z } from 'zod';

/**
 * Yazar şeması
 */
const authorSchema = z.object({
    id: z.string(),
    name: z.string().max(200, 'Yazar adı çok uzun'),
    affiliation: z.string().max(500, 'Kurum bilgisi çok uzun').optional().default(''),
    orcid: z.string().max(50).optional().default(''),
    email: z.string().email('Geçersiz email').optional().or(z.literal('')).default(''),
    isCorresponding: z.boolean().optional().default(false),
});

/**
 * Tablo şeması
 */
const tableSchema = z.object({
    id: z.string(),
    caption: z.string().max(500, 'Tablo başlığı çok uzun'),
    layout: z.enum(['two-column', 'full-width']),
    columns: z.array(z.string().max(200)).max(20, 'Çok fazla sütun'),
    rows: z.array(z.array(z.string().max(1000))).max(100, 'Çok fazla satır'),
    columnWidths: z.array(z.number()).optional(),
    notes: z.string().max(1000, 'Tablo notu çok uzun').optional().default(''),
});

/**
 * Alt bölüm şeması
 */
const subsectionSchema = z.object({
    id: z.string(),
    title: z.string().max(200, 'Alt bölüm başlığı çok uzun'),
    content: z.string().max(50000, 'Alt bölüm içeriği çok uzun'),
    order: z.number(),
});

/**
 * Bölüm şeması
 */
const sectionSchema = z.object({
    id: z.string(),
    title: z.string().max(200, 'Bölüm başlığı çok uzun'),
    content: z.string().max(100000, 'Bölüm içeriği çok uzun'),
    subsections: z.array(subsectionSchema).max(20, 'Çok fazla alt bölüm').optional().default([]),
    tables: z.array(tableSchema).max(20, 'Çok fazla tablo').optional().default([]),
    order: z.number(),
});

/**
 * Makale meta verileri şeması
 */
const metadataSchema = z.object({
    titleTurkish: z.string().max(500, 'Türkçe başlık çok uzun'),
    titleEnglish: z.string().max(500, 'İngilizce başlık çok uzun'),
    authors: z.array(authorSchema).max(20, 'Çok fazla yazar'),
    doi: z.string().max(100).optional().default(''),
    journalName: z.string().max(200).optional().default(''),
    volume: z.string().max(20).optional().default(''),
    issue: z.string().max(20).optional().default(''),
    year: z.string().max(10).optional().default(''),
    pages: z.string().max(20).optional().default(''),
    citation: z.string().max(1000).optional().default(''),
    contactText: z.string().max(500).optional().default(''),
});

/**
 * Özet şeması
 */
const abstractSchema = z.object({
    abstractEnglish: z.string().max(5000, 'İngilizce özet çok uzun'),
    keywordsEnglish: z.array(z.string().max(100)).max(10, 'Çok fazla anahtar kelime'),
    abstractTurkish: z.string().max(5000, 'Türkçe özet çok uzun'),
    keywordsTurkish: z.array(z.string().max(100)).max(10, 'Çok fazla anahtar kelime'),
});

/**
 * Tarihçe şeması
 */
const historySchema = z.object({
    receivedDate: z.string().optional().default(''),
    acceptedDate: z.string().optional().default(''),
    publishedDate: z.string().optional().default(''),
});

/**
 * Etik beyan şeması
 */
const ethicsSchema = z.object({
    hasEthicsApproval: z.boolean().optional().default(false),
    ethicsText: z.string().max(2000, 'Etik beyan çok uzun').optional().default(''),
    approvalDate: z.string().optional().default(''),
    decisionNumber: z.string().max(100).optional().default(''),
    committeeName: z.string().max(200).optional().default(''),
});

/**
 * Ana makale şeması - tüm gelen veriyi doğrular
 */
export const articleSchema = z.object({
    id: z.string(),
    status: z.enum(['draft', 'review', 'approved', 'published']),
    language: z.enum(['TR', 'EN']).optional().default('TR'),
    metadata: metadataSchema,
    abstract: abstractSchema,
    history: historySchema,
    ethics: ethicsSchema,
    sections: z.array(sectionSchema).max(30, 'Çok fazla bölüm'),
    references: z.array(z.string().max(2000)).max(200, 'Çok fazla kaynak').optional().default([]),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ValidatedArticle = z.infer<typeof articleSchema>;

