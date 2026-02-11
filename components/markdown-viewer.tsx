'use client'

import { useRef, useEffect } from 'react'
import { Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface MarkdownViewerProps {
  content: string
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  const { toast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)

  // Render markdown to HTML
  const htmlContent = renderMarkdown(content)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast({
      title: 'Copied to clipboard',
      description: 'Paste into Jira, Notion, or any editor',
    })
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = 'handoff-document.md'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast({
      title: 'Downloaded!',
      description: 'Handoff document saved as markdown',
    })
  }

  return (
    <div className="h-full flex flex-col bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-secondary/20">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Developer Handoff</h2>
          <p className="text-xs text-muted-foreground mt-1">Markdown format</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            size="sm"
            variant="outline"
            className="gap-2 bg-transparent"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy to Clipboard</span>
          </Button>
          <Button
            onClick={handleDownload}
            size="sm"
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-auto p-6 prose prose-invert max-w-none
          prose-headings:font-semibold prose-headings:text-foreground
          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
          prose-p:text-foreground prose-p:leading-relaxed
          prose-code:bg-secondary prose-code:text-accent prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-pre:bg-secondary prose-pre:border prose-pre:border-border
          prose-strong:text-foreground prose-strong:font-semibold
          prose-em:text-muted-foreground
          prose-table:border-collapse prose-table:w-full
          prose-th:bg-secondary prose-th:text-foreground prose-th:font-semibold prose-th:text-left prose-th:p-3 prose-th:border prose-th:border-border
          prose-td:p-3 prose-td:border prose-td:border-border prose-td:text-foreground
          prose-tr:border-b prose-tr:border-border
          prose-li:text-foreground
          prose-blockquote:border-accent prose-blockquote:text-muted-foreground"
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />
    </div>
  )
}

function renderMarkdown(markdown: string): string {
  let html = markdown

  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>')

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.*?)_/g, '<em>$1</em>')

  // Inline code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>')

  // Code blocks
  html = html.replace(
    /```(.*?)\n([\s\S]*?)```/g,
    '<pre><code>$2</code></pre>'
  )

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr />')

  // Tables
  html = html.replace(
    /\|(.+)\n\|[-|\s]+\n((?:\|.+\n?)*)/g,
    (match, header, body) => {
      const headers = header
        .split('|')
        .map((h: string) => h.trim())
        .filter((h: string) => h)
        .map((h: string) => `<th>${h}</th>`)
        .join('')

      const rows = body
        .trim()
        .split('\n')
        .map((row: string) => {
          const cells = row
            .split('|')
            .map((c: string) => c.trim())
            .filter((c: string) => c)
            .map((c: string) => `<td>${c}</td>`)
            .join('')
          return `<tr>${cells}</tr>`
        })
        .join('')

      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`
    }
  )

  // Unordered lists
  html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>')
  html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>')
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')

  // Ordered lists
  html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>')
  html = `<p>${html}</p>`

  // Clean up empty tags
  html = html.replace(/<p><\/p>/g, '')

  return html
}
