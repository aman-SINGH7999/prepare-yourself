'use client'
import React from 'react'
import { useSelector } from 'react-redux'

export default function ClientWrapper({ children }) {
  const theme = useSelector((state) => state.theme.theme)
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
