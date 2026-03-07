import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
