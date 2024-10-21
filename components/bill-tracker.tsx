import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from 'date-fns'

type Bill = {
  id: number
  name: string
  amount: number
  dueDate: string
  paid: boolean
}

type BillTrackerProps = {
  bills: Bill[]
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>
}

export function BillTracker({ bills, setBills }: BillTrackerProps) {
  const [newBill, setNewBill] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')

  const addBill = (e: React.FormEvent) => {
    e.preventDefault()
    if (newBill.trim() && amount && dueDate) {
      setBills([...bills, { 
        id: Date.now(), 
        name: newBill, 
        amount: parseFloat(amount), 
        dueDate, 
        paid: false 
      }])
      setNewBill('')
      setAmount('')
      setDueDate('')
    }
  }

  const togglePaid = (id: number) => {
    setBills(bills.map(bill => 
      bill.id === id ? { ...bill, paid: !bill.paid } : bill
    ))
  }

  const removeBill = (id: number) => {
    setBills(bills.filter(bill => bill.id !== id))
  }

  return (
    <div>
      <form onSubmit={addBill} className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={newBill}
          onChange={(e) => setNewBill(e.target.value)}
          placeholder="Bill name"
          className="flex-grow"
        />
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-24"
        />
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-40"
        />
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </form>
      <ul className="space-y-2">
        {bills.map(bill => (
          <li key={bill.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
            <span className={`flex-grow ${bill.paid ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {bill.name} - ${bill.amount.toFixed(2)} - Due: {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => togglePaid(bill.id)}>
                <Check className={`w-4 h-4 ${bill.paid ? 'text-green-500' : 'text-gray-400'}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => removeBill(bill.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}