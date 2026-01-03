import React from 'react'
import { assets } from '../assets/assets'
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
            Rooted in the grace of Indian heritage and shaped by modern minimalism, MAYILÉ creates premium womenswear for those who value sophistication in every detail. Designed with purpose, crafted with care.
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>
                <Link to="/" className="hover:text-black transition">Home</Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-black transition">Size Guide</Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-black transition">Delivery</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-black transition">Privacy policy</Link>
              </li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+91 90XXX 26XXX</li>
                <li>contactmayile@gmail.com</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@ MAYILÉ - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
