'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Target, Zap, Coffee, Video, DollarSign } from 'lucide-react'
import { useTheme } from 'next-themes'

type Achievement = {
  id: string
  title: string
  description: string
  icon: React.ElementType
  progress: number
  maxProgress: number
}

const achievements: Achievement[] = [
  { id: '1', title: 'Recipe Master', description: 'Create 50 recipes', icon: Coffee, progress: 25, maxProgress: 50 },
  { id: '2', title: 'Video Star', description: 'Schedule 100 video events', icon: Video, progress: 75, maxProgress: 100 },
  { id: '3', title: 'Inventory Guru', description: 'Track 200 inventory items', icon: Target, progress: 150, maxProgress: 200 },
  { id: '4', title: 'Finance Wizard', description: 'Log 500 financial transactions', icon: DollarSign, progress: 300, maxProgress: 500 },
  { id: '5', title: 'Creative Genius', description: 'Use creative tools 50 times', icon: Zap, progress: 30, maxProgress: 50 },
  { id: '6', title: 'Learning Enthusiast', description: 'Complete 20 educational resources', icon: Star, progress: 15, maxProgress: 20 },
]

export default function Achievements() {
  const { theme } = useTheme()
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredAchievement(achievement.id)}
                onHoverEnd={() => setHoveredAchievement(null)}
              >
                <Card className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} overflow-hidden`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <achievement.icon className={`w-8 h-8 ${hoveredAchievement === achievement.id ? 'text-primary' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium">
                        {achievement.progress} / {achievement.maxProgress}
                      </span>
                    </div>
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{achievement.title}</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{achievement.description}</p>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="mt-2"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}