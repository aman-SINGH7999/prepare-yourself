'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTag } from '@/store/slices/utilitySlice';

export default function Layout({ children }) {
  const [allTags, setAllTags] = useState("");

  const {accessKey } = useSelector((state)=>state.user);
  const { selectedTag } = useSelector((state)=> state.utility);
  const dispatch = useDispatch();


    const getAllTags = async ()=>{
      try{
        const { data } = await axios.get('/api/questions/add', {
          headers:{
            accessKey : accessKey
          }
        })
        console.log("All tags", data);
        setAllTags(data.tags);
      }catch(error){
        console.log("Error in getting tags", error);
      }
    }

    useEffect(()=>{
      getAllTags();
    },[selectedTag])

  return (
    <div className="flex">
      {/* Sidebar ya tags list */}
      <aside className="w-64 h-screen p-4 border-r border-gray-500">
        <h2 className="text-xl font-bold mb-4 border-b-[1px] border-gray-600">Categories</h2>
        <div className="flex flex-col space-y-2 w-full">
          {
            allTags.length > 0 ? 
              allTags.map((tag, i)=>{
                return (
                  <Link 
                    key={i}
                    href={`/questions/${tag}`}
                    onClick={()=> { dispatch(setSelectedTag(tag))}} 
                    className={`py-1 px-2 w-full ${selectedTag == tag ? "bg-[#fff5]" : "bg-[#fff2]"}`}
                  >
                    {tag}
                  </Link>
                )
              })
              
            : "No Tags."
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
