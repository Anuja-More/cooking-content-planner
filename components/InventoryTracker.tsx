'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, MinusCircle, PlusCircle, AlertTriangle, Search } from 'lucide-react'
import { useTheme } from 'next-themes'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type InventoryItem = {
  _id: string
  name: string
  quantity: number
  expirationDate?: string
  lowStockThreshold: number
}

export default function InventoryTracker() {
  const { theme } = useTheme()
  const { data: inventory, error, mutate } = useSWR<InventoryItem[]>('/api/inventoryItems', fetcher)
  const [newItem, setNewItem] = useState<Omit<InventoryItem, '_id'>>({
    name: '',
    quantity: 0,
    expirationDate: undefined,
    lowStockThreshold: 5
  })
  const [searchTerm, setSearchTerm] = useState('')

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newItem.name && newItem.quantity > 0) {
      const response = await fetch('/api/inventoryItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })
      if (response.ok) {
        mutate()
        setNewItem({ name: '', quantity: 0, expirationDate: undefined, lowStockThreshold: 5 })
      }
    }
  }

  const updateQuantity = async (id: string, change: number) => {
    const item = inventory?.find(item => item._id === id)
    if (item) {
      const updatedQuantity = Math.max(0, item.quantity + change)
      const response = await fetch(`/api/inventoryItems/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: updatedQuantity }),
      })
      if (response.ok) {
        mutate()
      }
    }
  }

  const filteredInventory = inventory?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (error) return <div>Failed to load inventory</div>
  if (!inventory) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Add New Inventory Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addItem} className="space-y-4">
            <Input
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <Input
              type="date"
              placeholder="Expiration Date (optional)"
              onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <Input
              type="number"
              placeholder="Low Stock Threshold"
              value={newItem.lowStockThreshold}
              onChange={(e) => setNewItem({ ...newItem, lowStockThreshold: parseInt(e.target.value) })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mb-4">
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
          icon={<Search className="w-4 h-4" />}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory?.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-primary'}`}>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-secondary'}`}>Quantity: {item.quantity}</p>
                {item.expirationDate && (
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    Expires: {new Date(item.expirationDate).toLocaleDateString()}
                  </p>
                )}
                {item.quantity <= item.lowStockThreshold && (
                  <p className="text-yellow-500 flex items-center mt-2">
                    <AlertTriangle className="w-4 h-4 mr-1" /> Low Stock
                  </p>
                )}
                <div className="flex space-x-2 mt-2">
                  <Button onClick={() => updateQuantity(item._id, -1)} variant="outline" size="icon">
                    <MinusCircle className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => updateQuantity(item._id, 1)} variant="outline" size="icon">
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}