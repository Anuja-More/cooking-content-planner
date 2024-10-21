import { Plus, Trash2, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'

type GroceryItem = {
  id: number
  name: string
  completed: boolean
}

type GroceryListProps = {
  groceries: GroceryItem[]
  setGroceries: React.Dispatch<React.SetStateAction<GroceryItem[]>>
}

export function GroceryList({ groceries, setGroceries }: GroceryListProps) {
  const [newItem, setNewItem] = useState('')

  const addItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItem.trim()) {
      setGroceries([...groceries, { id: Date.now(), name: newItem, completed: false }])
      setNewItem('')
    }
  }

  const toggleComplete = (id: number) => {
    setGroceries(groceries.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const removeItem = (id: number) => {
    setGroceries(groceries.filter(item => item.id !== id))
  }

  return (
    <div>
      <form onSubmit={addItem} className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a grocery item"
          className="flex-grow"
        />
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </form>
      <ul className="space-y-2">
        {groceries.map(item => (
          <li key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
            <span className={`flex-grow ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {item.name}
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => toggleComplete(item.id)}>
                <Check className={`w-4 h-4 ${item.completed ? 'text-green-500' : 'text-gray-400'}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => removeItem(item.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}