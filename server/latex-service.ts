import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Article {
    language?: 'TR' | 'EN';
    metadata: {
        titleTurkish: string;
        titleEnglish: string;
        authors: Array<{
            name: string;
            orcid?: string;
            affiliation?: string;
            email?: string;
            isCorresponding?: boolean;
        }>;
        doi?: string;
        journalName?: string;
        volume?: string;
        issue?: string;
        year?: string;
        pages?: string;
        citation?: string;
    };
    abstract: {
        abstractTurkish: string;
        abstractEnglish: string;
        keywordsTurkish: string[];
        keywordsEnglish: string[];
    };
    sections: Array<{
        title: string;
        content: string;
        subsections?: Array<{
            title: string;
            content: string;
        }>;
        tables?: Array<{
            caption: string;
            layout: 'two-column' | 'full-width';
            columns: string[];
            rows: string[][];
            notes?: string;
        }>;
    }>;
    history: {
        receivedDate?: string;
        acceptedDate?: string;
        publishedDate?: string;
    };
    ethics: {
        hasEthicsApproval?: boolean;
        ethicsText?: string;
    };
    references?: string;
}

// Escape LaTeX special characters
function escapeLatex(text: string): string {
    if (!text) return '';
    return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}');
}

// Escape only & for references (keep other LaTeX commands)
function escapeReferences(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/&/g, '\\&');
}

// Format date from YYYY-MM-DD to DD.MM.YYYY
function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
}

// Generate author name line with ORCID links
function generateAuthorLine(authors: Article['metadata']['authors']): string {
    if (!authors || authors.length === 0) return '';

    return authors.map((author, index) => {
        const sup = `\\authorsup{${index + 1}}`;
        const orcidLink = author.orcid
            ? ` \\href{https://orcid.org/${author.orcid}}{\\SCDORCIDIcon}`
            : '';
        const separator = index === authors.length - 1 ? '' : (index === authors.length - 2 ? ' ve ' : ' ');
        return `${escapeLatex(author.name)}${sup}${orcidLink}${separator}`;
    }).join('');
}

// Generate author affiliations
function generateAffiliations(authors: Article['metadata']['authors']): string {
    if (!authors || authors.length === 0) return '';

    return authors.map((author, index) => {
        const sup = index + 1;
        const affil = author.affiliation || 'Kurum belirtilmemiş';
        return `\\noindent\\makebox[0pt][r]{\\authorsup{${sup}}} ${escapeLatex(affil)}`;
    }).join('\\par\\vspace{1pt}\n  ');
}

// Generate initials for header
function generateInitials(authors: Article['metadata']['authors']): string {
    if (!authors || authors.length === 0) return '';

    const firstAuthor = authors[0].name.split(' ').pop()?.toUpperCase() || '';
    return authors.length > 1 ? `${firstAuthor} ve ark.` : firstAuthor;
}

// Generate sections content with tables
function generateSections(sections: Article['sections']): string {
    if (!sections || sections.length === 0) return '';

    return sections.map(section => {
        let content = `\\section{${escapeLatex(section.title).toUpperCase()}}\n`;
        content += escapeLatex(section.content) + '\n\n';

        // Tables in section
        if (section.tables && section.tables.length > 0) {
            section.tables.forEach(table => {
                content += generateTable(table);
            });
        }

        // Subsections
        if (section.subsections && section.subsections.length > 0) {
            section.subsections.forEach(sub => {
                content += `\\subsection{${escapeLatex(sub.title)}}\n`;
                content += escapeLatex(sub.content) + '\n\n';
            });
        }

        return content;
    }).join('\n');
}

// Generate a table in scd.cls format
function generateTable(table: { caption: string; layout: string; columns: string[]; rows: string[][]; notes?: string }): string {
    if (!table.columns || table.columns.length === 0) return '';

    const colSpec = table.columns.map(() => 'l').join(' ');
    const isFullWidth = table.layout === 'full-width';

    let latex = isFullWidth
        ? `\n\\begin{scdtable*}{${colSpec}}{${escapeLatex(table.caption)}}\n`
        : `\n\\begin{scdtable}{${colSpec}}{${escapeLatex(table.caption)}}\n`;

    // Header row
    latex += '\\toprule\n';
    latex += table.columns.map(col => `\\textbf{${escapeLatex(col)}}`).join(' & ') + ' \\\\\n';
    latex += '\\midrule\n';

    // Data rows
    if (table.rows && table.rows.length > 0) {
        table.rows.forEach(row => {
            latex += row.map(cell => escapeLatex(cell)).join(' & ') + ' \\\\\n';
        });
    }

    latex += '\\bottomrule\n';

    // Table notes
    if (table.notes) {
        latex += `\\tablenote{${escapeLatex(table.notes)}}\n`;
    }

    latex += isFullWidth ? '\\end{scdtable*}\n\n' : '\\end{scdtable}\n\n';

    return latex;
}

// Generate the full LaTeX document
function generateLatexDocument(article: Article): string {
    const m = article.metadata;
    const a = article.abstract;
    const h = article.history;
    const e = article.ethics;
    const lang = article.language || 'TR';

    // Find corresponding author
    const corrAuthor = m.authors?.find(auth => auth.isCorresponding) || m.authors?.[0];

    // Handle references - ensure it's a string
    const refsText = typeof article.references === 'string' ? escapeReferences(article.references) : '';

    return `\\documentclass{scd}
\\setlang{${lang}}

% --- Journal-level metadata ---
\\journalname{${escapeLatex(m.journalName || 'Sosyal Çalışma Dergisi')}}
\\journalurl{https://dergipark.org.tr/tr/pub/scd}
\\articletype{Araştırma}
\\eissn{2587-1412}
\\monthyearTR{${new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}}
\\monthyearEN{${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}}
\\volume{${escapeLatex(m.volume || '1')}}
\\issue{${escapeLatex(m.issue || '1')}}

% --- Article-level metadata ---
\\titleTR{${escapeLatex(m.titleTurkish)}}
\\titleEN{${escapeLatex(m.titleEnglish)}}

\\authorname{${generateAuthorLine(m.authors)}}
\\initialsauthors{${generateInitials(m.authors)}}

\\authoraffiliation{%
  ${generateAffiliations(m.authors)}
}

${corrAuthor ? `\\correspondingauthor{${escapeLatex(corrAuthor.name)}}{${corrAuthor.email || ''}}` : ''}

\\submittedTR{${formatDate(h.receivedDate || '')}}
\\acceptedTR{${formatDate(h.acceptedDate || '')}}
\\publishedTR{${formatDate(h.publishedDate || '')}}

\\keywordsTR{${a.keywordsTurkish?.join(', ') || ''}}
\\keywordsEN{${a.keywordsEnglish?.join(', ') || ''}}

${m.doi ? `\\doi{${escapeLatex(m.doi)}}` : ''}
${e.hasEthicsApproval && e.ethicsText ? `\\ethicsTR{${escapeLatex(e.ethicsText)}}` : ''}

\\abstractTR{${escapeLatex(a.abstractTurkish)}}
\\abstractEN{${escapeLatex(a.abstractEnglish)}}

${m.citation ? `\\citationtext{${escapeLatex(m.citation)}}` : ''}

\\startpage{1}

\\begin{document}

\\maketitle

\\begin{scdbody}

${generateSections(article.sections)}

${refsText ? `\\begin{scdreferences}
${refsText}
\\end{scdreferences}` : ''}

\\end{scdbody}

\\end{document}
`;
}

export async function compileLatex(article: Article): Promise<Buffer> {
    // Create temp directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'latex-'));
    const texFile = path.join(tempDir, 'article.tex');
    const pdfFile = path.join(tempDir, 'article.pdf');

    try {
        // Copy scd.cls to temp directory
        const clsSource = path.join(__dirname, '..', 'scd.cls');
        const clsDest = path.join(tempDir, 'scd.cls');
        await fs.copyFile(clsSource, clsDest);

        // Copy img folder if exists
        const imgSource = path.join(__dirname, '..', 'img');
        const imgDest = path.join(tempDir, 'img');
        try {
            await fs.cp(imgSource, imgDest, { recursive: true });
        } catch {
            // img folder might not exist, that's ok
            await fs.mkdir(imgDest, { recursive: true });
        }

        // Generate and write .tex file
        const texContent = generateLatexDocument(article);
        await fs.writeFile(texFile, texContent, 'utf-8');

        console.log('📄 Generated .tex file at:', texFile);

        // Run XeLaTeX (twice for cross-references)
        for (let i = 0; i < 2; i++) {
            await runXeLatex(tempDir, 'article.tex');
        }

        // Read generated PDF
        const pdfBuffer = await fs.readFile(pdfFile);

        return pdfBuffer;

    } finally {
        // Cleanup temp directory
        try {
            await fs.rm(tempDir, { recursive: true, force: true });
        } catch {
            // Ignore cleanup errors
        }
    }
}

function runXeLatex(cwd: string, texFile: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const proc = spawn('xelatex', [
            '-interaction=nonstopmode',
            '-halt-on-error',
            texFile
        ], { cwd, shell: true });

        let stdout = '';
        let stderr = '';

        proc.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        proc.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                console.error('❌ XeLaTeX failed. Last 3000 chars of output:');
                console.error(stdout.slice(-3000));
                if (stderr) console.error('STDERR:', stderr);
                const error: any = new Error(`XeLaTeX failed with code ${code}`);
                error.log = stdout + stderr;
                reject(error);
            }
        });

        proc.on('error', (err) => {
            console.error('❌ XeLaTeX spawn error:', err);
            reject(err);
        });
    });
}
