import React from 'react'

const Title = ({text1, text2}) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-[#F0E9D2]'>{text1} <span className='text-[#678983] font-medium'>{text2}</span></p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-[#E6DDC4]'></p>
    </div>
  )
}

export default Title
