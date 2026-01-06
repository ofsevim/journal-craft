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

const tabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
  { id: 'metadata', label: 'Makale Bilgileri', icon: <FileText className="w-4 h-4" /> },
  { id: 'abstract', label: 'Özet & Anahtar Kelimeler', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'content', label: 'İçerik', icon: <Layers className="w-4 h-4" /> },
  { id: 'tables', label: 'Tablolar', icon: <Table className="w-4 h-4" /> },
  { id: 'references', label: 'Kaynakça', icon: <Quote className="w-4 h-4" /> },
  { id: 'ethics', label: 'Etik Beyan', icon: <Shield className="w-4 h-4" /> },
];

export function EditorSidebar({ activeTab, onTabChange, sections }: EditorSidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
          Bölümler
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                'hover:bg-sidebar-accent',
                activeTab === tab.id
                  ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                  : 'text-sidebar-foreground/80'
              )}
            >
              <span className={cn(
                'transition-colors',
                activeTab === tab.id ? 'text-sidebar-primary' : 'text-sidebar-foreground/60'
              )}>
                {tab.icon}
              </span>
              <span className="flex-1 text-left">{tab.label}</span>
              {activeTab === tab.id && (
                <ChevronRight className="w-4 h-4 text-sidebar-primary" />
              )}
            </button>
          ))}
        </nav>
        
        {activeTab === 'content' && (
          <div className="px-4 py-3 border-t border-sidebar-border mt-2">
            <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
              Makale Bölümleri
            </h3>
            <div className="space-y-1">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded transition-colors"
                >
                  <span className="text-sidebar-foreground/40">{index + 1}.</span>
                  <span className="truncate">{section.title || 'Başlıksız'}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/50">
          <p>Son güncelleme:</p>
          <p className="text-sidebar-foreground/70">Bugün, 14:32</p>
        </div>
      </div>
    </aside>
  );
}
