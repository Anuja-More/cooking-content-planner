import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Meal = {
  id: number
  name: string
  day: string
}

type MealPlannerProps = {
  meals: Meal[]
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function MealPlanner({ meals, setMeals }: MealPlannerProps) {
  const [newMeal, setNewMeal] = useState('')
  const [selectedDay, setSelectedDay] = useState('Monday')

  const addMeal = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMeal.trim()) {
      setMeals([...meals, { id: Date.now(), name: newMeal, day: selectedDay }])
      setNewMeal('')
    }
  }

  const removeMeal = (id: number) => {
    setMeals(meals.filter(meal => meal.id !== id))
  }

  return (
    <div>
      <form onSubmit={addMeal} className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={newMeal}
          onChange={(e) => setNewMeal(e.target.value)}
          placeholder="Add a meal"
          className="flex-grow"
        />
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {days.map(day => (
              <SelectItem key={day} value={day}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </form>
      {days.map(day => (
        <div key={day} className="mb-4">
          <h3 className="font-semibold text-lg mb-2">{day}</h3>
          <ul className="space-y-2">
            {meals.filter(meal => meal.day === day).map(meal => (
              <li key={meal.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
                <span className="flex-grow text-gray-800">{meal.name}</span>
                <Button variant="outline" size="icon" onClick={() => removeMeal(meal.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}