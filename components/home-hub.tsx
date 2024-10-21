'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GroceryList } from './grocery-list'
import { ChoreScheduler } from './chore-scheduler'
import { BillTracker } from './bill-tracker'
import { MealPlanner } from './meal-planner'
import { ShoppingCart, CalendarCheck, DollarSign, Utensils, Bell } from 'lucide-react'
import { useLocalStorage } from '../hooks/use-local-storage'
import { Button } from "@/components/ui/button"
import { toast, Toaster } from 'react-hot-toast'

type GroceryItem = { id: number; name: string; completed: boolean }
type Chore = { id: number; name: string; frequency: string; completed: boolean }
type Bill = { id: number; name: string; amount: number; dueDate: string; paid: boolean }
type Meal = { id: number; name: string; day: string }

export default function HomeHub() {
  const [groceries, setGroceries] = useLocalStorage<GroceryItem[]>('groceries', [])
  const [chores, setChores] = useLocalStorage<Chore[]>('chores', [])
  const [bills, setBills] = useLocalStorage<Bill[]>('bills', [])
  const [meals, setMeals] = useLocalStorage<Meal[]>('meals', [])
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  const enableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotificationsEnabled(true)
        toast.success('Notifications enabled!')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-bold text-center text-gray-800">Home Hub</CardTitle>
          <Button variant="outline" size="icon" onClick={enableNotifications} disabled={notificationsEnabled}>
            <Bell className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grocery" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="grocery" className="flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Grocery
              </TabsTrigger>
              <TabsTrigger value="chores" className="flex items-center">
                <CalendarCheck className="w-4 h-4 mr-2" />
                Chores
              </TabsTrigger>
              <TabsTrigger value="bills" className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Bills
              </TabsTrigger>
              <TabsTrigger value="meals" className="flex items-center">
                <Utensils className="w-4 h-4 mr-2" />
                Meals
              </TabsTrigger>
            </TabsList>
            <TabsContent value="grocery">
              <GroceryList groceries={groceries} setGroceries={setGroceries} />
            </TabsContent>
            <TabsContent value="chores">
              <ChoreScheduler chores={chores} setChores={setChores} />
            </TabsContent>
            <TabsContent value="bills">
              <BillTracker bills={bills} setBills={setBills} />
            </TabsContent>
            <TabsContent value="meals">
              <MealPlanner meals={meals} setMeals={setMeals} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}