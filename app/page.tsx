'use client'

import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function QRGenerator() {
  const [url, setUrl] = useState('https://')
  const [qrGenerated, setQrGenerated] = useState(false)
  const qrRef = useRef<SVGSVGElement>(null)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (url) {
      setQrGenerated(true)
    }
  }

  const handleExport = () => {
    if (qrRef.current) {
      const canvas = document.createElement('canvas')
      const svg = qrRef.current
      const svgData = new XMLSerializer().serializeToString(svg)
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = 'qr-code.png'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }
          }, 'image/png')
        }
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              required
            />
            <Button type="submit" className="w-full">Generate QR Code</Button>
          </form>
        </CardContent>
        {qrGenerated && (
          <CardFooter className="flex flex-col items-center space-y-4">
            <QRCodeSVG ref={qrRef} value={url} size={200} />
            <Button onClick={handleExport} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Export as PNG
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

