import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>
      
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.logo} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-[#F0E9D2]'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Fuga excepturi repellendus maiores labore nulla asperiores a, 
            voluptates praesentium unde non tempora magni tempore, mollitia 
            hic facere illum accusantium velit repudiandae?</p>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
            Odio est praesentium deleniti, placeat a animi suscipit molestias 
            eveniet non beatae velit laborum doloribus ut neque quod repellendus 
            corrupti unde fuga?</p>
          <b className='text-[#678983]'>Our Mission</b>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
            Magnam nisi illum nemo laboriosam eos placeat minus eligendi 
            accusantium, architecto adipisci consequuntur error eius culpa,
            sequi vel enim tenetur iure perspiciatis!</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b className='text-[#678983]'>Quality Assurance:</b>
          <p className='text-[#F0E9D2]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Molestias, quibusdam ad! Assumenda qui dolore, excepturi eligendi adipisci 
            dolorem nesciunt quaerat, esse deserunt fuga laborum itaque nemo, sunt quia repellendus facere.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b className='text-[#678983]'>Convenience:</b>
          <p className='text-[#F0E9D2]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Molestias, quibusdam ad! Assumenda qui dolore, excepturi eligendi adipisci 
            dolorem nesciunt quaerat, esse deserunt fuga laborum itaque nemo, sunt quia repellendus facere.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b className='text-[#678983]'>Exceptional Customer Service:</b>
          <p className='text-[#F0E9D2]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Molestias, quibusdam ad! Assumenda qui dolore, excepturi eligendi adipisci 
            dolorem nesciunt quaerat, esse deserunt fuga laborum itaque nemo, sunt quia repellendus facere.</p>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default About
