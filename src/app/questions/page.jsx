
'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/slices/userSlice'
import { useRouter } from 'next/navigation'
import AddQuestion from '@/components/AddQuestion'
import ThemeToggle from '@/components/ThemeToggle';

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
   const {accessKey, token } = useSelector((state)=>state.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className='flex justify-end gap-2 border-b border-gray-500'>
        <ThemeToggle />
        {
          token ? 
          <AddQuestion />
          : ""
        }
        <button
          onClick={handleLogout}
          className={`px-4 py-2 mb-2 border cursor-pointer bg-red-600 text-white`}
        >
          Logout
        </button>
      </div>
      <div className='flex flex-1 flex-col mt-40 items-center border-gray-500 text-center'>
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to Your Questions Hub
        </h1>
        
        <p className="text-lg text-gray-600 max-w-xl text-center">
          Explore your curated questions, organized by categories and levels. Keep preparing, keep growing!
        </p>
      </div>
      
    </div>
  )
}

