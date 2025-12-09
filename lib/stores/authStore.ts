import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from 'firebase/auth'
import { UserProfile } from '../firebase/auth'

interface AuthState {
  user: User | null
  userProfile: UserProfile | null
  isLoading: boolean
  isInitialized: boolean
  setUser: (user: User | null) => void
  setUserProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  reset: () => void
}

const initialState = {
  user: null,
  userProfile: null,
  isLoading: true,
  isInitialized: false,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setUserProfile: (userProfile) => set({ userProfile }),

      setLoading: (isLoading) => set({ isLoading }),

      setInitialized: (isInitialized) => set({ isInitialized }),

      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Solo persistir userProfile, no el user de Firebase
        userProfile: state.userProfile,
      }),
    }
  )
)
