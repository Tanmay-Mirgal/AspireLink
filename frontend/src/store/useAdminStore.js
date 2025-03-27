import {create} from 'zustand'

export const useAdminStore = create((set) => ({
    admin: null,
    setAdmin: (admin) => set({admin}),
    isloading: false,
    setIsLoading: (isloading) => set({isloading}),
    error: null,
    setError: (error) => set({error}),
    
}))