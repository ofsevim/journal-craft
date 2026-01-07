import React from 'react';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  BookOpen, 
  Layers, 
  Table, 
  Quote,
  Shield,
  ChevronRight
} from 'lucide-react';
import { EditorTab, ArticleSection } from '@/types/article';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditorSidebarProps {
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
  sections: ArticleSection[];
}

const tabs: { id: EditorTab; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'metadata', label: 'Makale Bilgileri', icon: <FileText className="w-4 h-4" />, description: 'Başlık, yazarlar ve yayın bilgileri' },
  { id: 'abstract', label: 'Özet & Anahtar Kelimeler', icon: <BookOpen className="w-4 h-4" />, description: 'Türkçe ve İngilizce özetler' },
  { id: 'content', label: 'İçerik', icon: <Layers className="w-4 h-4" />, description: 'Makale bölümleri' },
  { id: 'tables', label: 'Tablolar', icon: <Table className="w-4 h-4" />, description: 'Tablo düzenleyici' },
  { id: 'references', label: 'Kaynakça', icon: <Quote className="w-4 h-4" />, description: 'Kaynak listesi' },
  { id: 'ethics', label: 'Etik Beyan', icon: <Shield className="w-4 h-4" />, description: 'Etik kurul onayı' },
];

/**
 * Editör yan menüsü - Bölümler arası navigasyon sağlar
 * Erişilebilirlik: ARIA rolleri ve keyboard navigation desteği
 */
export function EditorSidebar({ activeTab, onTabChange, sections }: EditorSidebarProps) {
  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent, tabId: EditorTab) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabChange(tabId);
    }
  };

  return (
    <aside 
      className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col"
      role="navigation"
      aria-label="Editör bölümleri"
    >
      <div className="p-4 border-b border-sidebar-border">
        <h2 
          id="sidebar-heading"
          className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider"
        >
          Bölümler
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <nav 
          className="p-2 space-y-1"
          role="tablist"
          aria-labelledby="sidebar-heading"
          aria-orientation="vertical"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              title={tab.description}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                'hover:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-1',
                activeTab === tab.id
                  ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                  : 'text-sidebar-foreground/80'
              )}
            >
              <span 
                className={cn(
                  'transition-colors',
                  activeTab === tab.id ? 'text-sidebar-primary' : 'text-sidebar-foreground/60'
                )}
                aria-hidden="true"
              >
                {tab.icon}
              </span>
              <span className="flex-1 text-left">{tab.label}</span>
              {activeTab === tab.id && (
                <ChevronRight className="w-4 h-4 text-sidebar-primary" aria-hidden="true" />
              )}
            </button>
          ))}
        </nav>
        
        {activeTab === 'content' && sections.length > 0 && (
          <div 
            className="px-4 py-3 border-t border-sidebar-border mt-2"
            role="region"
            aria-label="Makale bölümleri listesi"
          >
            <h3 
              id="sections-heading"
              className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2"
            >
              Makale Bölümleri
            </h3>
            <ul 
              className="space-y-1"
              aria-labelledby="sections-heading"
            >
              {sections.map((section, index) => (
                <li key={section.id}>
                  <button
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded transition-colors focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
                    aria-label={`Bölüm ${index + 1}: ${section.title || 'Başlıksız'}`}
                  >
                    <span className="text-sidebar-foreground/40" aria-hidden="true">{index + 1}.</span>
                    <span className="truncate">{section.title || 'Başlıksız'}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ScrollArea>
      
      <div 
        className="p-4 border-t border-sidebar-border"
        role="status"
        aria-live="polite"
      >
        <div className="text-xs text-sidebar-foreground/50">
          <p>Son güncelleme:</p>
          <p className="text-sidebar-foreground/70">
            <time dateTime={new Date().toISOString()}>
              {new Date().toLocaleString('tr-TR', { 
                day: 'numeric', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </time>
          </p>
        </div>
      </div>
    </aside>
  );
}
