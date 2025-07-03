"use client";
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

export default function page() {
  return (
    <div className='relative w-screen h-screen overflow-hidden'>
      {/* Background Image */}
      <div className='absolute w-full h-full -z-10 opacity-40'>
        <Image
          src="/login-bg.jpg"
          alt="Landing background"
          fill
          className='object-cover'
        />
      </div>

      {/* Overlay */}
      <div className='absolute w-full h-full bg-black/40 -z-10'></div>

      <div className='flex flex-col items-center justify-center h-full text-center text-white px-4'>
        {/* Heading */}
        <h1 className='text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg'>
          Prepare Yourself
        </h1>
        
        {/* Subtext */}
        <p className='max-w-xl text-lg md:text-xl mb-8 text-gray-300'>
          Your personal Education practice & learning hub. Organize your topics, 
          track your progress, and prepare smarter.
        </p>

        {/* Buttons */}
        <div className='flex gap-4'>
          <Link href="/signup" className='bg-green-600 hover:bg-green-700 transition py-2 px-4 '>
            Get Started
          </Link>
          <Link href="/login" className='bg-white text-black hover:bg-gray-200 transition py-2 px-4 '>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
