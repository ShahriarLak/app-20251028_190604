'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import LoadingSpinner from './LoadingSpinner'

interface Stats {
  totalProducts: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
}

interface StatsCardsProps {
  refresh: number
}

export default function StatsCards({ refresh }: StatsCardsProps) {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [refresh])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const { data: products, error } = await supabase
        .from('products')
        .select('quantity, price')

      if (error) throw error

      const totalProducts = products?.length || 0
      const totalValue = products?.reduce((sum, product) => 
        sum + (product.quantity * product.price), 0) || 0
      const lowStockItems = products?.filter(product => 
        product.quantity > 0 && product.quantity < 10).length || 0
      const outOfStockItems = products?.filter(product => 
        product.quantity === 0).length || 0

      setStats({
        totalProducts,
        totalValue,
        lowStockItems,
        outOfStockItems
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const cards = [
    {
      title: 'Total Products',
      value: loading ? '-' : stats.totalProducts.toLocaleString(),
      icon: '📦',
      color: 'bg-blue-500'
    },
    {
      title: 'Total Inventory Value',
      value: loading ? '-' : formatCurrency(stats.totalValue),
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      title: 'Low Stock Items',
      value: loading ? '-' : stats.lowStockItems.toLocaleString(),
      icon: '⚠️',
      color: 'bg-yellow-500'
    },
    {
      title: 'Out of Stock',
      value: loading ? '-' : stats.outOfStockItems.toLocaleString(),
      icon: '🚫',
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-12 h-12 ${card.color} rounded-lg text-white text-xl`}>
              {card.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <div className="text-2xl font-semibold text-gray-900">
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  card.value
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}