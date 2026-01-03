import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>MAYILÉ was created from a deep appreciation for elegance, craftsmanship, and the evolving expression of modern women. 
                Our journey began with a simple intention — to offer thoughtfully designed Indo-Western pieces that celebrate grace, 
                individuality, and effortless luxury.</p>
              <p>Every collection is curated with attention to detail, refined silhouettes, and premium materials. 
                From timeless essentials to statement designs, we strive to craft pieces that resonate with confidence, comfort, 
                and the quiet sophistication that defines the MAYILÉ woman.</p>
              <b className='text-gray-800'>Our Mission</b>
              <p>Our mission is to inspire women through thoughtfully made fashion that blends cultural essence with contemporary minimalism. 
                  We are committed to creating a seamless experience — from discovery to delivery — built on trust, quality, and an unwavering 
                  dedication to elevating everyday elegance.</p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border bg-[#e5e5e5] px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>
            <p className=' text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p className=' text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
          </div>
          <div className='border bg-[#e5e5e5] px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service:</b>
            <p className=' text-gray-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
