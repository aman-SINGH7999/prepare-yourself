"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { ImSpinner2 } from "react-icons/im";
import { redirect, useRouter,  } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessKey, setToken } from '@/store/slices/userSlice';


export default function page() {
  const [passwordButton, setPasswordButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myAccessKey, setMyAccessKey] = useState("");
  const [password, setPassword] = useState("");

  const { accessKey } = useSelector((state)=> state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(()=>{
    if(accessKey) router.push("/questions");
  },[accessKey])

  const handleSubmitWithPassword = async (e)=>{
      e.preventDefault();
      try{
          setLoading(true);
          const { data } = await axios.put(`/api/users`, {accessKey:myAccessKey, password} )
          console.log("response: ", data);
          dispatch(setToken(data.token));
          dispatch(setAccessKey(myAccessKey));
          router.push('/questions');
      }catch(error){
          console.log("Error with password",error)
      }finally{
          setLoading(false);
      }
  }

   const handleSubmitWithoutPassword = async (e)=>{
      e.preventDefault();
      try{
          setLoading(true);
          const { data } = await axios.get('/api/users', {
            headers: {
              accesskey: myAccessKey
            }
          });
          console.log("response: ", data);
          dispatch(setAccessKey(myAccessKey));
          router.push('/questions');
      }catch(error){
          console.log("Error without password",error)
      }finally{
          setLoading(false);
      }
  }

  return (
    <div className='flex justify-center w-screen h-screen'>
        <form action="" 
          className={`flex flex-col items-start mt-52 gap-3 w-96 p-4 bg-[#fff2] ${ passwordButton ? "h-72" : "h-56"}`}
          onSubmit={ passwordButton ? handleSubmitWithPassword : handleSubmitWithoutPassword }
        >
            <div className='flex w-full h-10 justify-center items-center text-xl'>
                <div 
                  onClick={()=> setPasswordButton(false)} 
                  className={`${passwordButton ? "bg-[#fff2]" : "bg-[#fff5]"} w-1/2 h-full cursor-pointer flex justify-center items-center py-1`}
                >Get Access</div>
                <div 
                  onClick={()=> setPasswordButton(true)} 
                  className={`${passwordButton ? "bg-[#fff5]" : "bg-[#fff2]"} w-1/2 h-full cursor-pointer flex justify-center items-center py-1`}
                >Sign In</div>
            </div>
            <div className=' w-full flex flex-col'>
              <label htmlFor="access-key" className='text-start mb-1'>access-key</label>
              <input 
                value={myAccessKey}
                onChange={(e)=> setMyAccessKey(e.target.value)}
                type="text" id='access-key' placeholder='' required
                className='border w-full py-1 px-2 border-gray-500'/>
            </div>
            {
              passwordButton ? 
              <div className=' w-full flex flex-col'>
                <label htmlFor="password" className='text-start mb-1'>password</label>
                <input 
                  value={password}
                  onChange={(e)=> setPassword(e.target.value)}
                  type="password" id='password' placeholder='' required
                  className='border w-full py-1 px-2 border-gray-500'/>
              </div>
              : ""
            }
            <button type='submit' 
                className={`w-full cursor-pointer h-10 mt-2 py-1 bg-[#fff5]`}
            >{ loading ? <ImSpinner2 className='animate-spin text-4xl'/> : "Go" }</button>
            <Link href={'/signup'} className='text-white'>If you are new? Register</Link>
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
