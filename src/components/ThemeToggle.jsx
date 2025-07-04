'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '@/store/slices/themeSlice'
import { BsMoon, BsSun } from 'react-icons/bs'

export default function ThemeToggle() {
  const theme = useSelector((state)=> state.theme.theme)
  const dispatch = useDispatch()

  return (
    <button 
      onClick={()=> dispatch(toggleTheme())}
      className="p-2 rounded hover:bg-[#fff3] transition"
    >
      { theme === 'light' ? <BsMoon size={20}/> : <BsSun size={20}/> }
    </button>
  )
}
