\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{scd}[2026/01/03 Sosyal Calisma Dergisi (SCD) LaTeX class]

% =========================================================
% Base class
% =========================================================
\LoadClass[10pt,twoside]{article}

% =========================================================
% Page layout
% =========================================================
\RequirePackage{geometry}
\geometry{
  paper=a4paper,
  left=1.7cm,
  right=1.7cm,
  top=2.6cm,
  bottom=3.8cm,
  headheight=14pt
}

% =========================================================
% Fonts & Encoding (XeLaTeX - Cross-Platform Compatible)
% =========================================================
\RequirePackage{fontspec}

% Use TeX Gyre fonts (available in texlive-fonts-recommended)
% These are high-quality open-source alternatives to Windows fonts

% Main text font - TeX Gyre Termes (Times-like, replaces Georgia)
\setmainfont{TeX Gyre Termes}

% Sans-serif font - TeX Gyre Heros (Helvetica-like, replaces Arial)
\setsansfont{TeX Gyre Heros}

% Monospace font - TeX Gyre Cursor (Courier-like, replaces Consolas)
\setmonofont{TeX Gyre Cursor}

% --- FONT VE PUNTO KONTROL PANELİ (Cross-Platform Compatible) ---
\newfontfamily\scdtitleTRfont{TeX Gyre Heros}     % Türkçe Başlık (Title TR)
\newfontfamily\scdtitleENfont{TeX Gyre Heros}     % İngilizce Başlık (Title EN)
\newfontfamily\scdauthorfont{TeX Gyre Heros}     % Yazar İsimleri
\newfontfamily\scdaffilfont{TeX Gyre Heros}     % Kurum Bilgileri
\newfontfamily\scdabstractfont{TeX Gyre Heros}      % Özet Metinleri
\newfontfamily\scdmetafont{TeX Gyre Heros}            % Metadata (Sağ Sütun)
\newfontfamily\scdbodyfont{TeX Gyre Termes}              % ANA METİN (Body) FONTU
\newcommand{\scdbodysize}{\fontsize{11}{13}\selectfont} % ANA METİN PUNTO
\newfontfamily\scdcaptionfont{TeX Gyre Heros}      % Tablo ve Şekil Başlıkları
\newfontfamily\scdtablefont{TeX Gyre Termes}         % TABLO İÇİ FONTU
\newcommand{\scdtablesize}{\fontsize{10}{12}\selectfont} % TABLO İÇİ PUNTO
\newfontfamily\scdheaderfont{TeX Gyre Heros} % Sayfa Üst Bilgileri
\newfontfamily\journalfont{TeX Gyre Termes}    % Dergi Adı (Header Logosu)
% --------------------------------------------------------------------------


% =========================================================
% Colors
% =========================================================
\RequirePackage{xcolor}
\definecolor{SCDBlue}{RGB}{0, 51, 102}   
\definecolor{SCDRed}{RGB}{145, 30, 30}    
\definecolor{SCDLightBlue}{RGB}{232, 237, 248} % T&F Abstract Box
\definecolor{SCDTextGray}{RGB}{80, 80, 80}
\definecolor{SADCitationBG}{RGB}{255, 245, 230}
\definecolor{SCDDarkDavy}{RGB}{44, 47, 51} % Prestişli Koyu Füme / Antrasit

% =========================================================
% Core Packages
% =========================================================
\RequirePackage{graphicx}
\RequirePackage{booktabs}
\RequirePackage{tikz}
\RequirePackage{multicol}
\RequirePackage{fancyhdr}
\RequirePackage{titlesec}
\RequirePackage{setspace}
\RequirePackage{etoolbox}
%\RequirePackage[round]{natbib}
\RequirePackage{rotating}  % sidewaystable (tam sayfa yatay)
\RequirePackage{lscape}    % landscape ortamı alternatif
\RequirePackage{caption}   % captionof komutu için
\DeclareCaptionFont{scdcap}{\scdcaptionfont}
\captionsetup{font=scdcap, labelfont={bf,scdcap}, labelsep=period, justification=centering, singlelinecheck=false}
\RequirePackage{threeparttable} % Tablo altı notlar için
\RequirePackage{hyperref}
\RequirePackage{float}
\RequirePackage{lastpage} % For end page detection

% =========================================================
% Dinamik Dil Desteği (TR/EN)
% =========================================================
\newcommand{\scd@lang}{TR} % Varsayılan dil TR
\newcommand{\setlang}[1]{\renewcommand{\scd@lang}{#1}\scd@applylang}

\newcommand{\scd@label@table}{Tablo}
\newcommand{\scd@label@figure}{Şekil}
\newcommand{\scd@label@vol}{Cilt}
\newcommand{\scd@label@issue}{Sayı}
\newcommand{\scd@label@note}{Not}
\newcommand{\scd@label@ref}{Kaynakça}
\newcommand{\scd@label@history}{MAKALE GEÇMİŞİ}
\newcommand{\scd@label@keywords}{ANAHTAR KELİMELER}
\newcommand{\scd@label@ethics}{ETİK BEYAN}
\newcommand{\scd@label@oz}{ÖZ}

\newcommand{\scd@applylang}{%
  \ifdefstring{\scd@lang}{EN}{%
    \renewcommand{\scd@label@table}{Table}%
    \renewcommand{\scd@label@figure}{Figure}%
    \renewcommand{\scd@label@vol}{Vol}%
    \renewcommand{\scd@label@issue}{No}%
    \renewcommand{\scd@label@note}{Note}%
    \renewcommand{\scd@label@ref}{References}%
    \renewcommand{\scd@label@history}{ARTICLE HISTORY}%
    \renewcommand{\scd@label@keywords}{KEYWORDS}%
    \renewcommand{\scd@label@ethics}{ETHICS STATEMENT}%
    \renewcommand{\scd@label@oz}{ABSTRACT}%
    \renewcommand{\scd@monthyear}{\scd@monthyearEN}%
  }{%
    \renewcommand{\scd@label@table}{Tablo}%
    \renewcommand{\scd@label@figure}{Şekil}%
    \renewcommand{\scd@label@vol}{Cilt}%
    \renewcommand{\scd@label@issue}{Sayı}%
    \renewcommand{\scd@label@note}{Not}%
    \renewcommand{\scd@label@ref}{Kaynakça}%
    \renewcommand{\scd@label@history}{MAKALE GEÇMİŞİ}%
    \renewcommand{\scd@label@keywords}{ANAHTAR KELİMELER}%
    \renewcommand{\scd@label@ethics}{ETİK BEYAN}%
    \renewcommand{\scd@label@oz}{ÖZ}%
    \renewcommand{\scd@monthyear}{\scd@monthyearTR}%
  }%
  \renewcommand{\figurename}{\scd@label@figure}%
  \renewcommand{\tablename}{\scd@label@table}%
  \renewcommand{\refname}{\scd@label@ref}%       % Article class bibliography title
  \providecommand{\bibname}{\scd@label@ref}%    % Provide if not defined
  \renewcommand{\bibname}{\scd@label@ref}%       % Book/report class bibliography title
}

% Custom command for table notes that align with table width
\newcommand{\scdtablenote}[1]{%
  \begin{tablenotes}[flushleft]
    \footnotesize
    \item \textit{\scd@label@note:} #1
  \end{tablenotes}
}


\hypersetup{
  colorlinks=true,
  linkcolor=SCDBlue,
  citecolor=SCDBlue,
  urlcolor=SCDBlue,
  pdfborder={0 0 0}
}

% =========================================================
% Typography
% =========================================================
\setlength{\parindent}{1.2em}
\setlength{\parskip}{0pt}
\setstretch{1.15}

% Prevent widows and orphans (single lines at top/bottom of pages)
\widowpenalty=10000
\clubpenalty=10000
\displaywidowpenalty=10000
\brokenpenalty=10000
\interlinepenalty=50 % Allow some page breaks in long paragraphs, but keep headers with text

% Allow pages to have slightly different heights to prevent vertical stretching
\raggedbottom
\flushbottom % Back to flushbottom to prevent white gaps, but keep it balanced

% Standardize float spacing (for [H] tables)
\setlength{\intextsep}{1.2em}

\titleformat{\section}
  {\scdbodyfont\large\bfseries\color{SCDBlue}}
  {\thesection.}
  {0.5em}
  {}

\titleformat{\subsection}
  {\scdbodyfont\normalsize\bfseries}
  {\thesubsection.}
  {0.5em}
  {}

\titleformat{\subsubsection}
  {\scdbodyfont\normalsize\normalfont}   % ← Başlık metni (bold DEĞİL)
  {\bfseries\thesubsubsection.} % ← SADECE rakam koyu
  {0.5em}
  {}

\titleformat{\subsubsubsection}
  {\scdbodyfont\normalsize\itshape}
  {\thesubsubsubsection.}
  {0.5em}
  {}

\titlespacing*{\section}{0pt}{12pt}{6pt}
\titlespacing*{\subsection}{0pt}{12pt}{6pt}
\titlespacing*{\subsubsection}{0pt}{10pt}{6pt}
\titlespacing*{\subsubsubsection}{0pt}{8pt}{6pt}

% =========================================================
% Icons
% =========================================================
% ORCID Icon (TikZ drawing)
\newcommand{\SCDORCIDIcon}{%
  \kern-2pt
  \raisebox{2pt}{%
    \tikz[baseline=(c.base)]{%
      \node[draw=none, fill=green!70!black, circle, inner sep=1.2pt, minimum size=11pt] (c) {\color{white}\bfseries\sffamily\tiny iD};%
    }%
  }%
}

% ROR Icon (Vector Quality)
\newcommand{\SCDRORIcon}[1]{%
  \href{#1}{%
    \raisebox{-2.5pt}{%
      \IfFileExists{img/ror-icon-rgb.pdf}{%
        \includegraphics[height=9pt]{img/ror-icon-rgb.pdf}% Vector quality
      }{%
        \IfFileExists{img/ror-icon-rgb.png}{%
          \includegraphics[height=9pt]{img/ror-icon-rgb.png}% Fallback
        }{%
          \textbf{[ROR]}%
        }%
      }%
    }%
  }%
}

% Mail Icon (TikZ drawing)
\newcommand{\SCDMailIcon}{%
  \tikz[baseline=-0.1ex, scale=1.0]{
    \draw[fill=black, draw=none] (0,0) rectangle (3mm, 2mm);
    \draw[white, line width=0.2mm] (0,2mm) -- (1.5mm, 0.8mm) -- (3mm, 2mm);
  }
}

% Quote Icon for Citation (TikZ)
\newcommand{\SCDQuoteIcon}{%
  \begin{tikzpicture}[baseline=(q.base)]
    \node[SCDBlue, inner sep=0pt, scale=2.5, yshift=-0.15ex] (q) {''};
  \end{tikzpicture}
}

% Contact/Mail Icon (TikZ) - Blue Envelope
\newcommand{\SCDContactIcon}{%
  \begin{tikzpicture}[baseline=-0.1ex, scale=1.0]
    \draw[fill=SCDBlue, draw=none] (0,0) rectangle (3.5mm, 2.3mm);
    \draw[white, line width=0.2mm] (0, 2.3mm) -- (1.75mm, 0.9mm) -- (3.5mm, 2.3mm);
  \end{tikzpicture}
}

\newcommand{\SCDCCLogo}{%
  \textbf{CC BY-NC 4.0}%
}


% =========================================================
% Metadata Storage
% =========================================================
\providecommand\scd@journalname{Sosyal Çalışma Dergisi}
\providecommand\scd@journalurl{https://dergipark.org.tr/tr/pub/scd}
\providecommand\scd@articletype{Araştırma}

\providecommand\scd@titleTR{}
\providecommand\scd@titleEN{}
\providecommand\scd@authorname{} 
\providecommand\scd@corrauthor{}
\providecommand\scd@corremail{}

\providecommand\scd@submittedTR{}
\providecommand\scd@acceptedTR{}
\providecommand\scd@publishedTR{}

\providecommand\scd@keywordsTR{}
\providecommand\scd@keywordsEN{}
\providecommand\scd@ethicsTR{}
\providecommand\scd@ethicsEN{}

\providecommand\scd@abstractTR{}
\providecommand\scd@abstractEN{}

\providecommand\scd@eissn{2587-1412}
\providecommand\scd@monthyearTR{}
\providecommand\scd@monthyearEN{}
\providecommand\scd@monthyear{}
\providecommand\scd@vol{}
\providecommand\scd@issue{}
\providecommand\scd@doi{}
\providecommand\scd@citationtext{}
\providecommand\scd@contacttext{}
\providecommand\scd@initialsauthors{}
\providecommand\scd@startpage{1} % Default start page is 1

% Setters
\newcommand{\journalname}[1]{\renewcommand\scd@journalname{#1}}
\newcommand{\journalurl}[1]{\renewcommand\scd@journalurl{#1}}
\newcommand{\articletype}[1]{\renewcommand\scd@articletype{#1}}
\newcommand{\titleTR}[1]{\renewcommand\scd@titleTR{#1}}
\newcommand{\titleEN}[1]{\renewcommand\scd@titleEN{#1}}
\newcommand{\authorname}[1]{\renewcommand\scd@authorname{#1}} 
\newcommand{\correspondingauthor}[2]{\renewcommand\scd@corrauthor{#1}\renewcommand\scd@corremail{#2}}
\newcommand{\submittedTR}[1]{\renewcommand\scd@submittedTR{#1}}
\newcommand{\acceptedTR}[1]{\renewcommand\scd@acceptedTR{#1}}
\newcommand{\publishedTR}[1]{\renewcommand\scd@publishedTR{#1}}
\newcommand{\keywordsTR}[1]{\renewcommand\scd@keywordsTR{#1}}
\newcommand{\keywordsEN}[1]{\renewcommand\scd@keywordsEN{#1}}
\newcommand{\abstractTR}[1]{\renewcommand\scd@abstractTR{#1}}
\newcommand{\abstractEN}[1]{\renewcommand\scd@abstractEN{#1}}
\newcommand{\eissn}[1]{\renewcommand\scd@eissn{#1}}
\newcommand{\monthyearTR}[1]{\renewcommand\scd@monthyearTR{#1}\scd@applylang}
\newcommand{\monthyearEN}[1]{\renewcommand\scd@monthyearEN{#1}\scd@applylang}
\newcommand{\monthyear}[1]{\monthyearTR{#1}\monthyearEN{#1}} % Backward compatible
\newcommand{\volume}[1]{\renewcommand\scd@vol{#1}}
\newcommand{\issue}[1]{\renewcommand\scd@issue{#1}}
\newcommand{\doi}[1]{\renewcommand\scd@doi{#1}}
\newcommand{\citationtext}[1]{\renewcommand\scd@citationtext{#1}}
\newcommand{\contacttext}[1]{\renewcommand\scd@contacttext{#1}}
\newcommand{\initialsauthors}[1]{\renewcommand\scd@initialsauthors{#1}}
\newcommand{\ethicsTR}[1]{\renewcommand\scd@ethicsTR{#1}}
\newcommand{\ethicsEN}[1]{\renewcommand\scd@ethicsEN{#1}}
\newcommand{\ethics}[1]{\ethicsTR{#1}} % Alias for backward compatibility

% Dummies
\newcommand{\authororcid}[1]{}
\newcommand{\affiliation}[1]{}
\newcommand{\submittedEN}[1]{}
\newcommand{\acceptedEN}[1]{}
\newcommand{\publishedEN}[1]{}
\newcommand{\openaccess}[1]{}

% =========================================================
% Header / Footer (T&F Style - Minimal)
% =========================================================
\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt} 
\renewcommand{\footrulewidth}{0pt}

% Dynamic Headers for subsequent pages
\renewcommand{\headrulewidth}{0pt} % Çizgiyi kaldır
\fancyhead[LE,RO]{} % Dış kenarları temizle
\fancyhead[RE]{%
  \footnotesize\scdheaderfont SOSYAL ÇALIŞMA DERGİSİ\quad
  \scd@label@vol\ \scd@vol\ \scd@label@issue\ \scd@issue\quad
  \thepage
}

\fancyhead[LO]{%
  \footnotesize\scdheaderfont \thepage\quad \scd@initialsauthors
}
\fancyfoot[C]{} % Sayfa numarasını alttan kaldırdık

% First page special
\fancypagestyle{scdfirst}{
  \fancyhf{}
  \renewcommand{\headrulewidth}{0pt}
  \renewcommand{\footrulewidth}{0pt}
  
  % Header Design - Large Journal Name with Line and Box
  \fancyhead[L]{%
    \begin{tikzpicture}[remember picture, overlay]
      % Journal Name - 26pt with Hoefler Text
      \node[anchor=north west, inner sep=0pt] at ([xshift=1.7cm, yshift=-1.5cm]current page.north west) {
        {\journalfont\fontsize{26}{30}\selectfont\bfseries\color{SCDBlue} Sosyal Çalışma Dergisi}
      };
      
      % Horizontal Line (Burgundy/Red) - Below the box
      \draw[SCDRed, line width=2pt] 
        ([xshift=12cm, yshift=-2.1cm]current page.north west) -- 
        ([xshift=-1.7cm, yshift=-2.1cm]current page.north east);
      
      % Article Type Box (Burgundy/Red) - Aligned with right margin and line
      \node[anchor=north east, fill=SCDRed, inner xsep=10pt, minimum height=0.6cm, align=right, inner ysep=0pt] 
        at ([xshift=-1.7cm, yshift=-1.5cm]current page.north east) {
        \color{white}\small\scdheaderfont \scd@articletype
      };
      
      % Journal URL - Aligned with right margin below the line
      \node[anchor=north east, inner sep=0pt] 
        at ([xshift=-1.7cm, yshift=-2.2cm]current page.north east) {
        \scriptsize\scdheaderfont \scd@journalurl
      };
    \end{tikzpicture}
  }
  
  % Footer with Contact, Citation, and DOI
  \fancyfoot[C]{} % Remove page number from first page
  \fancyfoot[L]{%
    \begin{minipage}[b]{\textwidth}
      \ifstrempty{\scd@citationtext}{}{%
        \begin{minipage}[t]{0.04\textwidth}\raisebox{-10pt}{\SCDQuoteIcon}\end{minipage}%
        \begin{minipage}[t]{0.95\textwidth}
          \scriptsize\textbf{\color{SCDBlue}Atıf / To Cite:}\par
          \scd@citationtext
        \end{minipage}\\[0.2em]
      }
      \ifstrempty{\scd@contacttext}{%
        \ifstrempty{\scd@corremail}{}{%
          \begin{minipage}[t]{0.04\textwidth}\raisebox{-1pt}{\SCDContactIcon}\end{minipage}%
          \begin{minipage}[t]{0.95\textwidth}
            \scriptsize\textbf{\color{SCDBlue}İletişim / Contact:}\par
            \scd@corrauthor\quad \href{mailto:\scd@corremail}{\scd@corremail}
          \end{minipage}\\[0.4em]
        }
      }{%
        \begin{minipage}[t]{0.04\textwidth}\raisebox{-1pt}{\SCDContactIcon}\end{minipage}%
        \begin{minipage}[t]{0.95\textwidth}
          \scriptsize\textbf{\color{SCDBlue}İletişim / Contact:}\par
          \scd@contacttext
        \end{minipage}\\[0.4em]
      }
      {\color{SCDBlue}\hrule height 1.5pt}\vspace{0.5em}
      \scriptsize
      Turkish Journal of Social Work $|$ E-ISSN: \scd@eissn \hfill \scd@monthyear\ $|$ \scd@label@vol\ \scd@vol\ $|$ \scd@label@issue\ \scd@issue\\
      Bu makale CC BY-NC 4.0 ile lisanslanmıştır.\\[0.2em]
      \SCDCCLogo
    \end{minipage}
  }
  \fancyfoot[R]{}
}

% =========================================================
% Title Block (Refined Layout)
% =========================================================
% Author affiliation command
\newcommand{\scd@authoraffiliation}{}
\newcommand{\authoraffiliation}[1]{\renewcommand{\scd@authoraffiliation}{#1}}

% Title Block (Refined Layout)
% =========================================================
% Abstract Boxes as Reusable Commands
\newcommand{\scd@drawabstractTR}{%
  \noindent
  \begin{minipage}[t]{0.75\textwidth}
    \vspace{0pt}
    \colorbox{SCDLightBlue}{\parbox{\dimexpr\linewidth-2\fboxsep}{%
      \scdabstractfont\vspace{0.5em}
      {\bfseries\small\color{SCDBlue} ÖZ}\par
      \vspace{0.3em}
      {\small\scd@abstractTR\par}
      \vspace{0.5em}
    }}
  \end{minipage}%
  \hfill
  \begin{minipage}[t]{0.22\textwidth}\scdmetafont
    \vspace{6pt}
    \small
    \textbf{\color{SCDBlue}MAKALE GEÇMİŞİ}\par
    \scriptsize
    \ifstrempty{\scd@submittedTR}{}{Başvuru: \scd@submittedTR\\}
    \ifstrempty{\scd@acceptedTR}{}{Kabul: \scd@acceptedTR\\}
    \ifstrempty{\scd@publishedTR}{}{Yayın: \scd@publishedTR}
    \vspace{0.8em}
    
    \small
    \textbf{\color{SCDBlue}ANAHTAR KELİMELER}\par
    \scriptsize\raggedright\scd@keywordsTR
    
    \ifstrempty{\scd@ethicsTR}{}{%
      \vspace{0.8em}
      \small
      \textbf{\color{SCDBlue}ETİK BEYAN}\par
      \scriptsize\raggedright\scd@ethicsTR
    }
  \end{minipage}\par
}

\newcommand{\scd@drawabstractEN}{%
  \noindent
  \begin{minipage}[t]{0.75\textwidth}
    \vspace{0pt}
    \colorbox{SCDLightBlue}{\parbox{\dimexpr\linewidth-2\fboxsep}{%
      \scdabstractfont\vspace{0.5em}
      {\bfseries\small\color{SCDBlue} ABSTRACT}\par
      \vspace{0.3em}
      {\small\scd@abstractEN\par}
      \vspace{0.5em}
    }}
  \end{minipage}%
  \hfill
  \begin{minipage}[t]{0.22\textwidth}\scdmetafont
    \vspace{6pt}
    \small
    \textbf{\color{SCDBlue}ARTICLE HISTORY}\par
    \scriptsize
    \ifstrempty{\scd@submittedTR}{}{Received: \scd@submittedTR\\}
    \ifstrempty{\scd@acceptedTR}{}{Accepted: \scd@acceptedTR\\}
    \ifstrempty{\scd@publishedTR}{}{Published: \scd@publishedTR}
    \vspace{0.8em}
    
    \small
    \textbf{\color{SCDBlue}KEYWORDS}\par
    \scriptsize\raggedright\scd@keywordsEN
    
    \ifstrempty{\scd@ethicsEN}{}{%
      \vspace{0.8em}
      \small
      \textbf{\color{SCDBlue}ETHICS STATEMENT}\par
      \scriptsize\raggedright\scd@ethicsEN
    }
  \end{minipage}\par
}

\renewcommand{\maketitle}{%
  \thispagestyle{scdfirst}
  \vspace*{0cm}
  \begin{flushleft}
    \ifdefstring{\scd@lang}{EN}{%
      {\scdtitleENfont\LARGE\bfseries\color{SCDDarkDavy} \scd@titleEN \par}
      \vspace{0.4em}
      {\scdtitleTRfont\Large\color{SCDDarkDavy}\itshape \scd@titleTR \par}
    }{%
      {\scdtitleTRfont\LARGE\bfseries\color{SCDDarkDavy} \scd@titleTR \par}
      \vspace{0.4em}
      {\scdtitleENfont\Large\color{SCDDarkDavy}\itshape \scd@titleEN \par}
    }
  \end{flushleft}
  \vspace{1em}
  {\scdauthorfont\large \scd@authorname \par}
  \vspace{0.8em}
  \ifstrempty{\scd@authoraffiliation}{}{%
    {%
      \scdaffilfont\fontsize{9}{11}\selectfont
      \leftskip=1.5em
      \scd@authoraffiliation\par
    }%
  }
  \vspace{0.5em}
  
  \ifdefstring{\scd@lang}{EN}{%
    \scd@drawabstractEN
    \vspace{0.6em}
    \scd@drawabstractTR
  }{%
    \scd@drawabstractTR
    \vspace{0.6em}
    \scd@drawabstractEN
  }
  
  \vspace{1.2em}
  \clearpage
}


% Command to set custom start page Number
\newcommand{\startpage}[1]{\setcounter{page}{#1}\renewcommand\scd@startpage{#1}}

% Command for red author superscripts
\newcommand{\authorsup}[1]{\textcolor{SCDRed}{\textsuperscript{#1}}}

% =========================================================
% Table Environments
% =========================================================
\newcommand{\tablenote}[1]{\par\vspace{2pt}\fontsize{8}{10}\selectfont\textit{\scd@label@note: #1}}

% In-column table (for multicols)
\newenvironment{scdtable}[2]{%
  \vspace{0.5em}
  \noindent
  \begin{minipage}{\linewidth}
    \centering
    \scdtablesize\scdtablefont
    \captionof{table}{#2}
    \begin{tabular}{#1}
}{%
    \end{tabular}
  \end{minipage}
  \vspace{0.8em}
}

% Full-width table (spans both columns)
\newenvironment{scdtable*}[2]{%
  \begin{table*}[!ht]
    \centering
    \scdtablesize\scdtablefont
    \caption{#2}
    \begin{tabular}{#1}
}{%
    \end{tabular}
  \end{table*}
}

\NewDocumentEnvironment{scdbody}{ O{2} }{%
  \scdbodyfont\scdbodysize % Merkezi font ve punto ayarı burada uygulanır
  \setlength{\parskip}{3pt} % Sadece ana metin için dikey boşluk
  \setlength{\columnsep}{6mm}%
  \begin{multicols}{#1}%
}{%
  \end{multicols}%
}

% =========================================================
% Manual Reference Section (Word Style)
% =========================================================
% Redefined to use paragraph parameters for robust hanging indents on ALL paragraphs.
\newenvironment{scdreferences}{%
  \section*{\refname}%
  \fontsize{10}{12}\selectfont
  \setstretch{1.0}
  \setlength{\parskip}{6pt}
  \setlength{\leftskip}{1cm}
  \setlength{\parindent}{-1cm}
  \par
}{%
  \par
}
