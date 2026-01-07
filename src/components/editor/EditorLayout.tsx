import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { EditorSidebar } from './EditorSidebar';
import { EditorContent } from './EditorContent';
import { PdfPreview } from './PdfPreview';
import { EditorToolbar } from './EditorToolbar';
import { useArticle } from '@/hooks/useArticle';
import { EditorTab } from '@/types/article';

export function EditorLayout() {
  const [activeTab, setActiveTab] = useState<EditorTab>('metadata');
  const [showPreview, setShowPreview] = useState(true);
  const articleHook = useArticle();

  return (
    <div className="h-screen flex flex-col bg-background">
      <EditorToolbar
        article={articleHook.article}
        onValidate={articleHook.validate}
        validationErrors={articleHook.validationErrors}
        onReset={articleHook.resetArticle}
        onLanguageChange={articleHook.setLanguage}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />

      <div className="flex-1 flex overflow-hidden">
        <EditorSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sections={articleHook.article.sections}
        />

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={showPreview ? 50 : 100} minSize={35}>
            <EditorContent
              activeTab={activeTab}
              articleHook={articleHook}
            />
          </ResizablePanel>

          {showPreview && (
            <>
              <ResizableHandle withHandle className="bg-border hover:bg-accent transition-colors" />
              <ResizablePanel defaultSize={50} minSize={30}>
                <PdfPreview article={articleHook.article} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
