import React, { createContext, useContext } from 'react'

type EditingDevice = 'desktop' | 'tablet' | 'mobile'

type ResponsiveStyleContextType = {
    editingDevice: EditingDevice
}

const ResponsiveStyleContext = createContext<ResponsiveStyleContextType | null>(null)

export function useResponsiveStyle() {
    const context = useContext(ResponsiveStyleContext)
    if (!context) {
        throw new Error('useResponsiveStyle must be used within ResponsiveStyleProvider')
    }
    return context
}

export function ResponsiveStyleProvider({
    children,
    editingDevice
}: {
    children: React.ReactNode
    editingDevice: EditingDevice
}) {
    return (
        <ResponsiveStyleContext.Provider value={{ editingDevice }}>
            {children}
        </ResponsiveStyleContext.Provider>
    )
}
