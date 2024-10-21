'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import RecipeDatabase from './RecipeDatabase'
import VideoScheduler from './VideoScheduler'
import InventoryTracker from './InventoryTracker'
import FinancialOverview from './FinancialOverview'
import CreativeTools from './CreativeTools'
import EducationalHub from './EducationalHub'
import Achievements from './Achievements'
import { CookingPot, Calendar, Package, DollarSign, Palette, GraduationCap, Sun, Moon, Trophy } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSpring, animated } from 'react-spring'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('recipes')
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [showAchievement, setShowAchievement] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate unlocking an achievement
    setTimeout(() => setShowAchievement(true), 3000)
  }, [])

  const tabContent = [
    { id: 'recipes', title: 'Recipes', icon: CookingPot, component: RecipeDatabase },
    { id: 'schedule', title: 'Schedule', icon: Calendar, component: VideoScheduler },
    { id: 'inventory', title: 'Inventory', icon: Package, component: InventoryTracker },
    { id: 'finance', title: 'Finance', icon: DollarSign, component: FinancialOverview },
    { id: 'tools', title: 'Creative Tools', icon: Palette, component: CreativeTools },
    { id: 'education', title: 'Education', icon: GraduationCap, component: EducationalHub },
    { id: 'achievements', title: 'Achievements', icon: Trophy, component: Achievements },
  ]

  const springProps = useSpring({
    opacity: showAchievement ? 1 : 0,
    transform: showAchievement ? 'translateY(0)' : 'translateY(-50px)',
    config: { tension: 300, friction: 10 },
  })

  if (!mounted) return null

  return (
    <div className={`container mx-auto px-4 py-8 min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-50 to-pink-100'}`}>
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-primary'}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          CulinaryCloud
        </motion.h1>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`p-2 rounded-full ${theme === 'dark' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
        >
          {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </motion.div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-2 mb-8">
          {tabContent.map(({ id, title, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <AnimatePresence mode="wait">
          {tabContent.map(({ id, component: Component }) => (
            <TabsContent key={id} value={id}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-md shadow-xl`}>
                  <CardContent className="p-6">
                    <Component />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>
      <animated.div style={springProps} className="fixed bottom-4 right-4">
        <Card className={`${theme === 'dark' ? 'bg-yellow-400 text-gray-900' : 'bg-primary text-primary-foreground'} p-4 rounded-lg shadow-lg`}>
          <CardContent className="flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            <span className="font-bold">Achievement Unlocked: ERP Master!</span>
          </CardContent>
        </Card>
      </animated.div>
    </div>
  )
}