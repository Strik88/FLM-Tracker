import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as client from '../lib/supabaseClient'
import { createMetascript } from './metascripts'

const mockAuth = { getSession: vi.fn() }
const mockFrom = vi.fn()

beforeEach(() => {
  vi.restoreAllMocks()
  mockAuth.getSession.mockReset()
  mockFrom.mockReset()
  vi.spyOn(client, 'supabase', 'get').mockReturnValue({
    auth: mockAuth as any,
    from: mockFrom as any,
  } as any)
})

describe('createMetascript', () => {
  it('throws when not authenticated', async () => {
    mockAuth.getSession.mockResolvedValue({ data: { session: null } })
    await expect(createMetascript({ heart_shift: 'x' })).rejects.toThrow('Not authenticated')
  })

  it('inserts and returns record', async () => {
    mockAuth.getSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } })
    const single = vi.fn().mockResolvedValue({ data: { id: 'm1', user_id: 'u1' }, error: null })
    const select = vi.fn().mockReturnValue({ single })
    const insert = vi.fn().mockReturnValue({ select })
    mockFrom.mockReturnValue({ insert })

    const rec = await createMetascript({ heart_shift: 'x' })
    expect(rec.id).toBe('m1')
    expect(mockFrom).toHaveBeenCalledWith('metascripts')
    expect(insert).toHaveBeenCalledWith({ user_id: 'u1', heart_shift: 'x' })
  })
})
