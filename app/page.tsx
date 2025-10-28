'use client'

import { useState } from 'react'
import ProductForm from './components/ProductForm'
import ProductList from './components/ProductList'
import StatsCards from './components/StatsCards'
import { ProductWithCategory } from '@/lib/types'

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setShowForm(false)
    setEditingProduct(null)
    setRefreshKey(prev => prev + 1)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleEdit = (product: ProductWithCategory) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  return (
    <div className="px-4 sm:px-0">
      {/* Stats Cards */}
      <StatsCards refresh={refreshKey} />

      {/* Action Button */}
      {!showForm && (
        <div className="mb-6">
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="mr-2">+</span>
            Add New Product
          </button>
        </div>
      )}

      {/* Product Form */}
      {showForm && (
        <div className="mb-8">
          <ProductForm
            product={editingProduct || undefined}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Product List */}
      <ProductList onEdit={handleEdit} refresh={refreshKey} />
    </div>
  )
}