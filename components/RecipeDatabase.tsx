'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Utensils, Search, Tag } from 'lucide-react'
import { useTheme } from 'next-themes'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Recipe = {
  _id: string
  title: string
  ingredients: string
  instructions: string
  category: string
  tags: string[]
}

export default function RecipeDatabase() {
  const { theme } = useTheme()
  const { data: recipes, error, mutate } = useSWR<Recipe[]>('/api/recipes', fetcher)
  const [newRecipe, setNewRecipe] = useState<Omit<Recipe, '_id'>>({
    title: '',
    ingredients: '',
    instructions: '',
    category: '',
    tags: []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [newTag, setNewTag] = useState('')

  const addRecipe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newRecipe.title && newRecipe.ingredients && newRecipe.instructions) {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      })
      if (response.ok) {
        mutate()
        setNewRecipe({ title: '', ingredients: '', instructions: '', category: '', tags: [] })
      }
    }
  }

  const addTag = () => {
    if (newTag && !newRecipe.tags.includes(newTag)) {
      setNewRecipe({ ...newRecipe, tags: [...newRecipe.tags, newTag] })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewRecipe({ ...newRecipe, tags: newRecipe.tags.filter(tag => tag !== tagToRemove) })
  }

  const filteredRecipes = recipes?.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (error) return <div>Failed to load recipes</div>
  if (!recipes) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-primary" />
            Add New Recipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addRecipe} className="space-y-4">
            <Input
              placeholder="Recipe Title"
              value={newRecipe.title}
              onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <Input
              placeholder="Category"
              value={newRecipe.category}
              onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <Textarea
              placeholder="Ingredients (one per line)"
              value={newRecipe.ingredients}
              onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <Textarea
              placeholder="Instructions"
              value={newRecipe.instructions}
              onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
            />
            <div className="flex space-x-2">
              <Input
                placeholder="Add Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Tag className="w-4 h-4 mr-2" /> Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newRecipe.tags.map((tag, index) => (
                <span key={index} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-2 text-xs">×</button>
                </span>
              ))}
            </div>
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Recipe
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mb-4">
        <Input
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'}`}
          icon={<Search className="w-4 h-4" />}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes?.map((recipe, index) => (
          <motion.div
            key={recipe._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-primary'}`}>{recipe.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-secondary'}`}>Category: {recipe.category}</p>
                <p className={`font-semibold mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-secondary'}`}>Ingredients:</p>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{recipe.ingredients}</p>
                <p className={`font-semibold mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-secondary'}`}>Instructions:</p>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{recipe.instructions}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recipe?.tags?.map((tag, index) => (
                    <span key={index} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}