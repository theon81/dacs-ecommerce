import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({ setToken, navigate }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      // Đăng nhập admin
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
      if (response.data.success) {
        const { token } = response.data
        setToken(token)
        localStorage.setItem('token', token)
        navigate('/list')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 w-80 mx-auto mt-32">
      <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} required className="border px-3 py-2" />
      <input type="password" placeholder="Admin Password" value={password} onChange={e => setPassword(e.target.value)} required className="border px-3 py-2" />
      <button type="submit" className="bg-black text-white py-2">Login</button>
    </form>
  )
}

export default Login