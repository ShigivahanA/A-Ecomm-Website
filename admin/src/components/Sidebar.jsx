import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-xl' to="/add">
                <img className='w-5 h-5' src={assets.add_icon} alt="" />
                <p className='hidden md:block'>Add Items</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-xl' to="/list">
                <img className='w-5 h-5' src={assets.items} alt="" />
                <p className='hidden md:block'>List Items</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-xl' to="/orders">
                <img className='w-5 h-5' src={assets.order} alt="" />
                <p className='hidden md:block'>Orders</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-xl' to="/add-job">
                <img className='w-5 h-5' src={assets.addjob} alt="" />
                <p className='hidden md:block'>Add Jobs</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-xl' to="/jobs-list">
                <img className='w-5 h-5' src={assets.job} alt="" />
                <p className='hidden md:block'>Jobs</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-xl' to="/newsletter">
                <img className='w-5 h-5' src={assets.newsletter} alt="" />
                <p className='hidden md:block'>Newsletter</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-xl' to="/banner">
                <img className='w-5 h-5' src={assets.offer} alt="" />
                <p className='hidden md:block'>Banner</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-xl' to="/order-cancellations">
                <img className='w-5 h-5' src={assets.cancel} alt="" />
                <p className='hidden md:block'>Cancellations</p>
            </NavLink>

             <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-xl' to="/return">
                <img className='w-5 h-5' src={assets.returns} alt="" />
                <p className='hidden md:block'>Returns</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-xl' to="/coupons">
                <img className='w-5 h-5' src={assets.returns} alt="" />
                <p className='hidden md:block'>Coupons</p>
            </NavLink>
        </div>

    </div>
  )
}

export default Sidebar