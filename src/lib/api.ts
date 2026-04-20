export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

export const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin
  } catch {
    return 'http://localhost:8000'
  }
})()

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('ellena_token')
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message ?? 'API error')
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export function apiRegister(data: { name: string; email: string; password: string; password_confirmation: string }) {
  return request<{ user: User; token: string }>('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function apiLogin(data: { email: string; password: string }) {
  return request<{ user: User; token: string }>('/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function apiLogout() {
  return request<void>('/logout', { method: 'POST' })
}

export function apiMe() {
  return request<User>('/me')
}

// ─── Products ──────────────────────────────────────────────────────────────

export function apiGetProducts(params: {
  category?: string
  featured?: boolean
  search?: string
  sort?: string
  page?: number
} = {}) {
  const q = new URLSearchParams()
  if (params.category) q.set('category', params.category)
  if (params.featured) q.set('featured', '1')
  if (params.search)   q.set('search', params.search)
  if (params.sort)     q.set('sort', params.sort)
  if (params.page)     q.set('page', String(params.page))
  return request<PaginatedResponse<ApiProduct>>(`/products?${q}`)
}

export function apiGetProduct(slug: string) {
  return request<ApiProduct>(`/products/${slug}`)
}

export function apiCreateProduct(data: Partial<ApiProduct>) {
  return request<ApiProduct>('/products', { method: 'POST', body: JSON.stringify(data) })
}

export function apiUpdateProduct(slug: string, data: Partial<ApiProduct>) {
  return request<ApiProduct>(`/products/${slug}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function apiDeleteProduct(slug: string) {
  return request<void>(`/products/${slug}`, { method: 'DELETE' })
}

// ─── Categories ────────────────────────────────────────────────────────────

export function apiGetCategories() {
  return request<ApiCategory[]>('/categories')
}

export function apiGetCategory(slug: string) {
  return request<ApiCategory>(`/categories/${slug}`)
}

export function apiCreateCategory(data: Partial<ApiCategory>) {
  return request<ApiCategory>('/categories', { method: 'POST', body: JSON.stringify(data) })
}

export function apiUpdateCategory(slug: string, data: Partial<ApiCategory>) {
  return request<ApiCategory>(`/categories/${slug}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function apiDeleteCategory(slug: string) {
  return request<void>(`/categories/${slug}`, { method: 'DELETE' })
}

// ─── Cart ──────────────────────────────────────────────────────────────────

export function apiGetCart() {
  return request<ApiCartItem[]>('/cart')
}

export function apiAddToCart(data: { product_id: number; shade?: string; quantity?: number }) {
  return request<ApiCartItem>('/cart', { method: 'POST', body: JSON.stringify(data) })
}

export function apiUpdateCartItem(id: number, quantity: number) {
  return request<ApiCartItem>(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) })
}

export function apiRemoveCartItem(id: number) {
  return request<void>(`/cart/${id}`, { method: 'DELETE' })
}

export function apiClearCart() {
  return request<void>('/cart', { method: 'DELETE' })
}

// ─── Wishlist ──────────────────────────────────────────────────────────────

export function apiGetWishlist() {
  return request<ApiWishlistItem[]>('/wishlist')
}

export function apiToggleWishlist(product_id: number) {
  return request<{ wishlisted: boolean }>('/wishlist/toggle', {
    method: 'POST',
    body: JSON.stringify({ product_id }),
  })
}

// ─── Orders ────────────────────────────────────────────────────────────────

export function apiGetOrders() {
  return request<ApiOrder[]>('/orders')
}

export function apiCreateOrder(data: {
  shipping_address: {
    name: string
    address: string
    city: string
    country: string
    phone: string
  }
  payment_method?: string
  notes?: string
}) {
  return request<ApiOrder>('/orders', { method: 'POST', body: JSON.stringify(data) })
}

export function apiGetOrder(id: number) {
  return request<ApiOrder>(`/orders/${id}`)
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface User {
  id: number
  name: string
  email: string
  role: 'customer' | 'admin'
  created_at: string
}

export interface ApiProduct {
  id: number
  name: string
  slug: string
  brand: string
  category_id: number
  category: ApiCategory
  subcategory: string | null
  price: number
  currency: string
  size: string | null
  description: string
  badge: string | null
  accent: string | null
  hero_tone: string | null
  rating: number
  review_count: number
  in_stock: boolean
  featured: boolean
  status: 'draft' | 'published'
  images: ApiProductImage[]
  shades: ApiProductShade[]
  variations: ApiProductVariation[]
  created_at: string
}

export interface ApiProductVariation {
  id: number
  product_id: number
  type: 'pc' | 'quantity' | 'size' | 'color'
  value: string
  price: number | null
  stock: number
}

export interface ApiProductImage {
  id: number
  url: string
  is_primary: boolean
  sort_order: number
}

export interface ApiProductShade {
  id: number
  name: string
  hex: string | null
}

export interface ApiCategory {
  id: number
  name: string
  slug: string
  description: string | null
  banner_image: string | null
  parent_id: number | null
  is_active: boolean
  featured: boolean
  sort_order: number
  products_count: number
  children: ApiCategory[]
}

export function apiGetFeaturedCategories() {
  return request<ApiCategory[]>('/categories?featured=1')
}

export interface ApiCartItem {
  id: number
  product_id: number
  shade: string | null
  quantity: number
  product: ApiProduct
}

export interface ApiWishlistItem {
  id: number
  product_id: number
  product: ApiProduct
}

export interface ApiOrder {
  id: number
  status: string
  subtotal: number
  total: number
  currency: string
  shipping_address: {
    name: string
    address: string
    city: string
    country: string
    phone: string
  }
  payment_method: string | null
  payment_status: string
  notes: string | null
  items: ApiOrderItem[]
  created_at: string
}

export interface ApiOrderItem {
  id: number
  product_id: number
  shade: string | null
  quantity: number
  unit_price: number
  subtotal: number
  product: ApiProduct
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// ─── Site Settings ─────────────────────────────────────────────────────────

export interface ApiSiteSettings {
  site_name: string | null
  tagline: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  facebook: string | null
  instagram: string | null
  twitter: string | null
  tiktok: string | null
  logo_url: string | null
  favicon_url: string | null
}

export function apiGetSettings() {
  return request<ApiSiteSettings>('/settings')
}

// ─── Banners ───────────────────────────────────────────────────────────────

export interface ApiBanner {
  id: number
  title: string | null
  image_url: string
  link_url: string | null
  category_id: number | null
  position: 'home_top' | 'home_middle' | 'home_bottom' | 'category_top' | 'sidebar'
  active: boolean
  sort_order: number
}

export function apiGetBanners(position?: ApiBanner['position']) {
  const q = position ? `?position=${position}` : ''
  return request<ApiBanner[]>(`/banners${q}`)
}
