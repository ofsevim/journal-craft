import React from 'react';
import { EditorTab } from '@/types/article';
import { useArticle } from '@/hooks/useArticle';
import { MetadataEditor } from './sections/MetadataEditor';
import { AbstractEditor } from './sections/AbstractEditor';
import { ContentEditor } from './sections/ContentEditor';
import { TablesEditor } from './sections/TablesEditor';
import { ReferencesEditor } from './sections/ReferencesEditor';
import { EthicsEditor } from './sections/EthicsEditor';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditorContentProps {
  activeTab: EditorTab;
  articleHook: ReturnType<typeof useArticle>;
}

export function EditorContent({ activeTab, articleHook }: EditorContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case 'metadata':
        return (
          <MetadataEditor
            metadata={articleHook.article.metadata}
            history={articleHook.article.history}
            onUpdateMetadata={articleHook.updateMetadata}
            onUpdateHistory={articleHook.updateHistory}
            onAddAuthor={articleHook.addAuthor}
            onUpdateAuthor={articleHook.updateAuthor}
            onRemoveAuthor={articleHook.removeAuthor}
          />
        );
      case 'abstract':
        return (
          <AbstractEditor
            abstract={articleHook.article.abstract}
            onUpdate={articleHook.updateAbstract}
          />
        );
      case 'content':
        return (
          <ContentEditor
            sections={articleHook.article.sections}
            onAddSection={articleHook.addSection}
            onUpdateSection={articleHook.updateSection}
            onRemoveSection={articleHook.removeSection}
          />
        );
      case 'tables':
        return (
          <TablesEditor
            sections={articleHook.article.sections}
            onAddTable={articleHook.addTable}
            onUpdateTable={articleHook.updateTable}
            onRemoveTable={articleHook.removeTable}
          />
        );
      case 'references':
        return (
          <ReferencesEditor
            references={articleHook.article.references}
            onUpdate={articleHook.updateReferences}
          />
        );
      case 'ethics':
        return (
          <EthicsEditor
            ethics={articleHook.article.ethics}
            onUpdate={articleHook.updateEthics}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full editor-panel flex flex-col">
      <div className="editor-toolbar flex items-center justify-between">
        <h2 className="section-header">
          {activeTab === 'metadata' && 'Makale Bilgileri'}
          {activeTab === 'abstract' && 'Özet & Anahtar Kelimeler'}
          {activeTab === 'content' && 'Makale İçeriği'}
          {activeTab === 'tables' && 'Tablolar'}
          {activeTab === 'references' && 'Kaynakça'}
          {activeTab === 'ethics' && 'Etik Beyan'}
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-6 animate-fade-in">
          {renderContent()}
        </div>
      </ScrollArea>
    </div>
  );
}
