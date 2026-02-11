'use client'

import React from "react"

import { useRef, useState } from 'react'
import { Upload, Cloud } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UploadZoneProps {
  onUpload: (file: File) => void
  isProcessing: boolean
}

export function UploadZone({ onUpload, isProcessing }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        onUpload(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      onUpload(files[0])
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-12 ${
        isDragActive
          ? 'border-accent bg-accent/10 scale-105'
          : 'border-border bg-card/30 hover:border-accent hover:bg-card/50'
      } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={isProcessing}
      />

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl animate-pulse" />
          <Cloud className="relative w-16 h-16 text-accent" strokeWidth={1.5} />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Drop your UI screenshot here
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            or click to browse your files
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            PNG, JPG, WebP • Up to 20MB
          </p>
        </div>

        <Button
          onClick={handleClick}
          disabled={isProcessing}
          className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Upload className="w-4 h-4" />
          Select Image
        </Button>
      </div>
    </div>
  )
}
