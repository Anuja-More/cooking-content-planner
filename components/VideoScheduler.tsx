'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Plus, Video, Edit, Upload, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Calendar } from './ui/calender'
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type VideoEvent = {
  _id: string
  title: string
  date: string
  time: string
  type: 'filming' | 'editing' | 'publishing'
  notes: string
}

export default function VideoScheduler() {
  const { theme } = useTheme()
  const { data: events, error, mutate } = useSWR<VideoEvent[]>('/api/videoEvents', fetcher)
  const [newEvent, setNewEvent] = useState<Omit<VideoEvent, '_id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: 'filming',
    notes: ''
  })

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newEvent.title && newEvent.date && newEvent.time) {
      const response = await fetch('/api/videoEvents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      })
      if (response.ok) {
        mutate()
        setNewEvent({ title: '', date: new Date().toISOString().split('T')[0], time: '', type: 'filming', notes: '' })
      }
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'filming':
        return <Video className="w-5 h-5" />
      case 'editing':
        return <Edit className="w-5 h-5" />
      case 'publishing':
        return <Upload className="w-5 h-5" />
      default:
        return null
    }
  }

  if (error) return <div>Failed to load video events</div>
  if (!events) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            Schedule New Video Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addEvent} className="space-y-4">
            <Input
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <select
              className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white/50'}`}
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'filming' | 'editing' | 'publishing' })}
            >
              <option value="filming">Filming</option>
              <option value="editing">Editing</option>
              <option value="publishing">Publishing</option>
            </select>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={`w-[240px] pl-3 text-left font-normal ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white/50'}`}>
                    {newEvent.date ? format(new Date(newEvent.date), "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(newEvent.date)}
                    onSelect={(date) => setNewEvent({ ...newEvent, date: date?.toISOString().split('T')[0] || '' })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="relative">
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className={`pl-10 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white/50'}`}
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <Textarea
              placeholder="Notes"
              value={newEvent.notes}
              onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Event
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-primary'} flex items-center gap-2`}>
                  {getEventIcon(event.type)}
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-secondary'}`}>Type: {event.type}</p>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  Date: {new Date(event.date).toLocaleDateString()} at {event.time}
                </p>
                {event.notes && (
                  <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    Notes: {event.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}