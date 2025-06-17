import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event)=>{
        event.preventDefault();
    }

  return (
    <div className='text-center mt-10'>
        <p className='text-2xl font-medium text-[#F0E9D2]'>Subscribe now and get 10% off!</p>
        <p className='text-[#E6DDC4] mt-3'>
            Lorem Ipsum is simply dummy text of the printing and typesetting 
            industry. Lorem Ipsum has been the industry's standard dummy 
            text ever since the 1500s
        </p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-[#E6DDC4] pl-3'>
            <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required/>
            <button type='submit' className='bg-[#F0E9D2] text-[#181D31] text-xs px-10 py-4'>Subscribe</button>
        </form>
    </div>
  )
}

export default NewsletterBox