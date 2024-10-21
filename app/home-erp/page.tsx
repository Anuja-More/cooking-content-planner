import { Metadata } from 'next'
import Dashboard from '../../components/Dashboard'

export const metadata: Metadata = {
  title: 'Home ERP for Content Creators',
  description: 'All-in-one system for managing your content creation business',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Dashboard />
    </main>
  )
}