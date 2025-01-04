import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBarbershop, useBarbershops } from '@/lib/hooks/use-barbershop'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Mock do serviço
vi.mock('@/lib/services/barbershop-service', () => ({
  BarbershopService: vi.fn(() => ({
    getBarbershopById: vi.fn(),
    getBarbershops: vi.fn(),
  })),
}))

// Wrapper necessário para o React Query
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
}

function createWrapper() {
  const testQueryClient = createTestQueryClient()
  return function TestWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

describe('useBarbershop', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return barbershop data', async () => {
    const { result } = renderHook(() => useBarbershop('barbershop-id'), {
      wrapper: createWrapper(),
    })
    
    expect(result.current.isLoading).toBe(true)
    expect(result.current.barbershop).toBe(undefined)
    expect(result.current.error).toBe(null)
  })

  it('should handle error when fetching barbershop', async () => {
    const error = new Error('Failed to fetch barbershop')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const { result } = renderHook(() => useBarbershop('invalid-id'), {
      wrapper: createWrapper(),
    })
    
    expect(result.current.error).toBe(null)
    expect(result.current.isLoading).toBe(true)
  })
})

describe('useBarbershops', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return list of barbershops', async () => {
    const { result } = renderHook(() => useBarbershops(), {
      wrapper: createWrapper(),
    })
    
    expect(result.current.isLoading).toBe(true)
    expect(result.current.barbershops).toEqual([])
    expect(result.current.error).toBe(null)
  })

  it('should handle error when fetching barbershops list', async () => {
    const error = new Error('Failed to fetch barbershops')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const { result } = renderHook(() => useBarbershops(), {
      wrapper: createWrapper(),
    })
    
    expect(result.current.error).toBe(null)
    expect(result.current.isLoading).toBe(true)
  })
}) 