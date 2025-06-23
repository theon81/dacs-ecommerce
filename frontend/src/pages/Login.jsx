import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const{ token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up'){

        const response = await axios.post(backendUrl + '/api/user/register',{name, email, password})
        if (response.data.success){
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }

      } else {

        const response = await axios.post(backendUrl + '/api/user/login',{email, password})
        if (response.data.success){
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }

      }


    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  },[token])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl text-[#352F44]'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-[#B9B4C7]' />
      </div>
      {currentState === 'Login' ? '' : <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-[#352F44] bg-[#FAF0E6] text-[#5C5470]' placeholder='Name' required/>}
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-[#352F44] bg-[#FAF0E6] text-[#5C5470]' placeholder='Email' required/>
      <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-[#352F44] bg-[#FAF0E6] text-[#5C5470]' placeholder='Password' required/>
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        {
          currentState === 'Login'
            ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-[#5C5470]'>Create account</p>
            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-[#5C5470]'>Login here</p>
        }
        {currentState === 'Login' && (
          <p className='cursor-pointer text-[#5C5470]'>
            Forgot your password?
          </p>
        )}
      </div>

      <button className='bg-[#5C5470] text-[#FAF0E6] px-8 py-4 mt-4'>
        {currentState === 'Login' ? 'Login' : 'Sign Up'}
      </button>
      <p className='mt-2 text-[#352F44]'>Date: <span className='text-[#5C5470]'>{new Date().toDateString()}</span></p>
        
    </form>
  )
}

export default Login
