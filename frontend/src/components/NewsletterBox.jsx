import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event)=>{
        event.preventDefault();
    }

  return (
    <div className='text-center mt-10'>
        <p className='text-2xl font-medium text-[#352F44]'>Subscribe now and get 10% off!</p>

        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-[#352F44] pl-3'>
            <input className='w-full sm:flex-1 outline-none bg-[#FAF0E6]' type="email" placeholder='Enter your email' required/>
            <button type='submit' className='bg-[#352F44] text-[#FAF0E6] text-xs px-10 py-4'>Subscribe</button>
        </form>
    </div>
  )
}

export default NewsletterBox