'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTag } from '@/store/slices/utilitySlice';

export default function Layout({ children }) {
  const [allTags, setAllTags] = useState([]);

  const { accessKey } = useSelector((state) => state.user);
  const { selectedTag } = useSelector((state) => state.utility);
  const { theme } = useSelector((state) => state.theme); // <-- theme redux se
  const dispatch = useDispatch();

  const getAllTags = async () => {
    try {
      const { data } = await axios.get('/api/questions/add', {
        headers: {
          accessKey: accessKey
        }
      })
      console.log("All tags", data);
      setAllTags(data.tags);
    } catch (error) {
      console.log("Error in getting tags", error);
    }
  }

  useEffect(() => {
    getAllTags();
  }, [selectedTag])

  return (
    <div className={`flex ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} min-h-screen`}>
      
      {/* Sidebar */}
      <aside className={`w-64 h-screen p-4 border-r 
        ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'}`}>
        <h2 className={`text-xl font-bold mb-4 pb-2 border-b 
          ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}>
          Categories
        </h2>
        <div className="flex flex-col space-y-2 w-full">
          {
            allTags.length > 0 ?
              allTags.map((tag, i) => (
                <Link
                  key={i}
                  href={`/questions/${tag}`}
                  onClick={() => { dispatch(setSelectedTag(tag)) }}
                  className={`py-2 px-3 rounded cursor-pointer transition 
                    ${selectedTag == tag 
                      ? (theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
                      : (theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200')}`}
                >
                  {tag}
                </Link>
              ))
              : <div>No Tags.</div>
          }
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
