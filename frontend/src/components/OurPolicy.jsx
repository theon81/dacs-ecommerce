import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='w-full flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base'>
        <div>
            <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
            <p className='text-[#352F44] font-semibold'>Easy Exchange Policy</p>
            <p className='text-[#5C5470]'>We offer hassle free exchange policy</p>
        </div>

        <div>
            <img src={assets.quality_icon} className='w-12 m-auto mb-5'  alt="" />
            <p className='text-[#352F44] font-semibold'>7 Days Return Policy</p>
            <p className='text-[#5C5470]'>We provide 7 days free return policy</p>
        </div>

        <div>
            <img src={assets.support_img} className='w-12 m-auto mb-5'  alt="" />
            <p className='text-[#352F44] font-semibold'>Best Customer Support</p>
            <p className='text-[#5C5470]'>We provide 24/7 customer support</p>
        </div>
    </div>
  )
}

export default OurPolicy