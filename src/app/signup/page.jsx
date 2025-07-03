"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function page() {
  const [loading, setLoading] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [password, setPassword] = useState("");

  const storedAccessKey = useSelector((state)=> state.user.accessKey)
  const router = useRouter();


    useEffect(()=>{
      if(storedAccessKey) router.push("/questions");
    },[storedAccessKey])

  const handleSubmit = async (e)=>{
      e.preventDefault();
      try{
          setLoading(true);
          const { data } = await axios.post(`/api/users`, {accessKey, password} )
          console.log("response: ", data);
          router.push('/login');
      }catch(error){
          console.log("Error with password",error)
      }finally{
          setLoading(false);
      }
  }



  return (
    <div className='flex justify-center w-screen h-screen'>
        <form action="" 
          className={`flex flex-col items-start mt-52 gap-2 w-96 p-4 bg-[#fff2] h-72`}
          onSubmit={ handleSubmit }
        >
            <div className='flex w-full h-10 justify-center items-center '>
                <div  
                  className={`w-full h-full cursor-pointer flex justify-center items-center font-semibold text-xl`}
                >Register Yourself</div>
            </div>
            <div className=' w-full flex flex-col'>
                <label htmlFor="access-key" className='text-start'>access-key</label>
                <input 
                    value={accessKey}
                    onChange={(e)=> setAccessKey(e.target.value)}
                    type="text" id='access-key' placeholder='Create your access-key' 
                    className='border w-full py-1 px-2'/>
            </div>
            <div className=' w-full flex flex-col'>
                <label htmlFor="password" className='text-start'>password</label>
                <input 
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    type="password" id='password' placeholder='Your new password' 
                    className='border w-full py-1 px-2'/>
            </div>
            <button type='submit' 
                className={`w-full cursor-pointer h-10 mt-2 border bg-[#fff3] hover:bg-[#fff4]`}
            >{ loading ? <ImSpinner2 className='animate-spin text-4xl'/> : "Register" }</button>
            <Link href={'/login'} className='text-white'>Already Register? Sign In</Link>
        </form>
        <div className='absolute w-full h-full -z-10 opacity-50'>
          <Image
            src="/signup-bg.jpg"
            fill={true}
            alt="Picture of the author"
            className='-z-10'
          />
          {/* <div className='text-white z-0 text-4xl m-5'>Welcome to Prepare Yourself </div> */}
        </div>
    </div>
  )
}
