'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { UploadZone } from '@/components/upload-zone'
import { ProcessingAnimation } from '@/components/processing-animation'
import { MarkdownViewer } from '@/components/markdown-viewer'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { analyzeScreenshot } from '@/app/actions/analyze-screenshot'

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [markdownContent, setMarkdownContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    try {
      setError(null)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setIsProcessing(true)

      // Convert file to base64 for API
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string

          const result = await analyzeScreenshot(base64)
          if (result.error) {
            setError(result.error)
            setImageUrl(null)
          } else {
            setMarkdownContent(result.markdown)
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Failed to analyze screenshot'
          )
          setImageUrl(null)
        } finally {
          setIsProcessing(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setImageUrl(null)
    setMarkdownContent(null)
    setError(null)
    setIsProcessing(false)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded bg-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Spec-Check AI</h1>
              <p className="text-xs text-muted-foreground">
                AI-powered UI analysis
              </p>
            </div>
          </div>
          {markdownContent && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">New Analysis</span>
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Initial state - upload zone */}
        {!imageUrl && !markdownContent && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Analyze Your UI Design
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload a screenshot of your interface and get an AI-generated developer
                handoff document with component specifications, layout logic, color tokens,
                and interaction states.
              </p>
            </div>
            <UploadZone onUpload={handleUpload} isProcessing={isProcessing} />
          </div>
        )}

        {/* Processing state */}
        {isProcessing && imageUrl && !markdownContent && (
          <ProcessingAnimation />
        )}

        {/* Result state - split view */}
        {imageUrl && markdownContent && !isProcessing && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - Image */}
              <div className="flex flex-col">
                <div className="sticky top-24 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Original Screenshot
                    </h2>
                    <div className="relative bg-secondary/30 rounded-2xl border border-border overflow-hidden aspect-square max-h-[600px]">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt="Uploaded screenshot"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full gap-2 bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Analyze Another Screenshot
                  </Button>
                </div>
              </div>

              {/* Right side - Markdown */}
              <div className="h-[calc(100vh-180px)] sticky top-24">
                <MarkdownViewer content={markdownContent} />
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Analysis Failed
              </h3>
              <p className="text-sm text-destructive/80 mb-4">{error}</p>
              <Button onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
            <UploadZone onUpload={handleUpload} isProcessing={isProcessing} />
          </div>
        )}
      </div>
    </main>
  )
}
