'use client'

import { useState, useRef, useEffect } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Palette, ListChecks, Camera, Download } from 'lucide-react'
import { useTheme } from 'next-themes'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type VideoTemplate = {
  _id: string
  name: string
  description: string
  sections: string[]
}

export default function CreativeTools() {
  const { theme } = useTheme()
  const { data: templates, error, mutate } = useSWR<VideoTemplate[]>('/api/videoTemplates', fetcher)
  const [newTemplate, setNewTemplate] = useState<Omit<VideoTemplate, '_id'>>({
    name: '',
    description: '',
    sections: []
  })
  const [newSection, setNewSection] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const addTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTemplate.name && newTemplate.sections.length > 0) {
      const response = await fetch('/api/videoTemplates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTemplate),
      })
      if (response.ok) {
        mutate()
        setNewTemplate({ name: '', description: '', sections: [] })
      }
    }
  }

  const addSection = () => {
    if (newSection) {
      setNewTemplate({ ...newTemplate, sections: [...newTemplate.sections, newSection] })
      setNewSection('')
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (err) {
      console.error("Error accessing the camera", err)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480)
        const imageDataUrl = canvasRef.current.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = imageDataUrl
        link.download = 'captured-image.png'
        link.click()
      }
    }
  }

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  if (error) return <div>Failed to load video templates</div>
  if (!templates) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-primary" />
            Create Video Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTemplate} className="space-y-4">
            <Input
              placeholder="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <Textarea
              placeholder="Template Description"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <div className="flex space-x-2">
              <Input
                placeholder="Add Section"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
              />
              <Button type="button" onClick={addSection} variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {newTemplate.sections.map((section, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {section}
                </motion.li>
              ))}
            </ul>
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Save Template
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            Capture Thumbnail
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showCamera ? (
            <Button onClick={startCamera} className="w-full">
              <Camera className="w-4 h-4 mr-2" /> Start Camera
            </Button>
          ) : (
            <div className="space-y-4">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
              <Button onClick={captureImage} className="w-full">
                <Camera className="w-4 h-4 mr-2" /> Capture Image
              </Button>
            </div>
          )}
          <canvas ref={canvasRef} width="640" height="480" className="hidden" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <motion.div
            key={template._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-primary'} flex items-center gap-2`}>
                  <ListChecks className="w-5 h-5" />
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} mb-2`}>{template.description}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {template.sections.map((section, index) => (
                    <li key={index} className={`${theme === 'dark' ? 'text-gray-300' : 'text-secondary'}`}>{section}</li>
                  ))}
                </ul>
                <Button className="mt-4 w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" /> Use Template
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}