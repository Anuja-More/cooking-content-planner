'use client'

import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Chore = {
  id: number
  name: string
  frequency: string
  completed: boolean
}

type ChoreSchedulerProps = {
  chores: Chore[]
  setChores: React.Dispatch<React.SetStateAction<Chore[]>>
}

export function ChoreScheduler({ chores, setChores }: ChoreSchedulerProps) {
  const [newChore, setNewChore] = useState('')
  const [frequency, setFrequency] = useState('daily')

  const addChore = (e: React.FormEvent) => {
    e.preventDefault()
    if (newChore.trim()) {
      setChores([...chores, { id: Date.now(), name: newChore, frequency, completed: false }])
      setNewChore('')
    }
  }

  const toggleComplete = (id: number) => {
    setChores(chores.map(chore => 
      chore.id === id ? { ...chore, completed: !chore.completed } : chore
    ))
  }

  const removeChore = (id: number) => {
    setChores(chores.filter(chore => chore.id !== id))
  }

  return (
    <div>
      <form onSubmit={addChore} className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
          placeholder="Add a chore"
          className="flex-grow"
        />
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </form>
      <ul className="space-y-2">
        {chores.map(chore => (
          <li key={chore.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
            <span className={`flex-grow ${chore.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {chore.name} - {chore.frequency}
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => toggleComplete(chore.id)}>
                <Check className={`w-4 h-4 ${chore.completed ? 'text-green-500' : 'text-gray-400'}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => removeChore(chore.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}