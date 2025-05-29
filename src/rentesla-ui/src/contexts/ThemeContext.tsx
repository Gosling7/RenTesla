import React, { createContext, useContext, useEffect, useState } from 'react'

type ThemeContextType = {
    darkMode: boolean
    toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleDarkMode: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage or system preference
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('darkMode')
            if (savedMode !== null) {
                return savedMode === 'true'
            }            
            return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return false
    })
    
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('darkMode', String(darkMode))
    }, [darkMode])
    
    const toggleDarkMode = () => setDarkMode(!darkMode)
    
    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
}