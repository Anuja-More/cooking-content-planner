'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Resource = {
  _id: string
  title: string
  description: string
  link: string
  category: 'cooking' | 'filming' | 'editing'
}

export default function EducationalHub() {
  const { data: resources, error, mutate } = useSWR<Resource[]>('/api/educationalResources', fetcher)
  const [newResource, setNewResource] = useState<Omit<Resource, '_id'>>({
    title: '',
    description: '',
    link: '',
    category: 'cooking'
  })

  const addResource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newResource.title && newResource.link) {
      const response = await fetch('/api/educationalResources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResource),
      })
      if (response.ok) {
        mutate()
        setNewResource({ title: '', description: '', link: '', category: 'cooking' })
      }
    }
  }

  if (error) return <div>Failed to load educational resources</div>
  if (!resources) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Educational Resource</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addResource} className="space-y-4">
            <Input
              placeholder="Resource Title"
              value={newResource.title}
              onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
            />
            <Textarea
              placeholder="Resource Description"
              value={newResource.description}
              onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
            />
            <Input
              placeholder="Resource Link"
              value={newResource.link}
              onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded"
              value={newResource.category}
              onChange={(e) => setNewResource({ ...newResource, category: e.target.value as 'cooking' | 'filming' | 'editing' })}
            >
              <option value="cooking">Cooking</option>
              <option value="filming">Filming</option>
              <option value="editing">Editing</option>
            </select>
            <Button type="submit">Add Resource</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <Card key={resource._id}>
            <CardHeader>
              <CardTitle>{resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{resource.description}</p>
              <p className="mt-2">Category: {resource.category}</p>
              <Button className="mt-2" onClick={() => window.open(resource.link, '_blank')}>
                View Resource
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}