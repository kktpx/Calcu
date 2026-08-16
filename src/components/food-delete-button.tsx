'use client'

import { useState } from 'react'
import { deleteFood } from '@/app/actions/food'
import { Button } from '@/components/ui/button'

export function FoodDeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this food?')) {
      setIsDeleting(true)
      try {
        await deleteFood(id)
      } catch (error) {
        console.error(error)
        alert('Failed to delete food')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDelete} 
      disabled={isDeleting} 
      className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-900/50 dark:hover:bg-rose-950/50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
