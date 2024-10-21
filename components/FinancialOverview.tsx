'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Transaction = {
  _id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
}

export default function FinancialOverview() {
  const { data: transactions, error, mutate } = useSWR<Transaction[]>('/api/transactions', fetcher)
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, '_id'>>({
    description: '',
    amount: 0,
    type: 'income',
    date: new Date().toISOString().split('T')[0]
  })

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTransaction.description && newTransaction.amount > 0) {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      })
      if (response.ok) {
        mutate()
        setNewTransaction({ description: '', amount: 0, type: 'income', date: new Date().toISOString().split('T')[0] })
      }
    }
  }

  if (error) return <div>Failed to load transactions</div>
  if (!transactions) return <div>Loading...</div>

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary" />
            Add New Transaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTransaction} className="space-y-4">
            <Input
              placeholder="Description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              className="bg-white/50"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
              className="bg-white/50"
            />
            <select
              className="w-full p-2 border rounded bg-white/50"
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <Input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              className="bg-white/50"
            />
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Transaction
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-secondary">Total Income</p>
              <p className="text-2xl font-bold text-green-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 mr-1" />
                ${totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-secondary">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 mr-1" />
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-secondary">Balance</p>
              <p className={`text-2xl font-bold flex items-center justify-center ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <DollarSign className="w-5 h-5 mr-1" />
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {transactions.slice(-5).reverse().map((transaction, index) => (
              <motion.li
                key={transaction._id}
                className="flex justify-between items-center p-2 rounded-lg bg-white/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span className="font-medium">{transaction.description}</span>
                <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  ${transaction.amount.toFixed(2)}
                </span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}