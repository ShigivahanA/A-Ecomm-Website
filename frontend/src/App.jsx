import React, { useEffect,useContext  } from 'react'
import { useLocation } from "react-router-dom";
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ShopContext } from "./context/ShopContext"
import Verify from './pages/Verify'
import NotFound from './pages/NotFound';
import Profile from './pages/Profile'
import Unsubscribe from './pages/Unsubscribe'
import Wishlist from './pages/Wishlist'
import ForgotPassword from './pages/ForgetPassword'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Delivery from './pages/Delivery'
import SizeGuide from './pages/SizeGuide';
import CustomDesignPage from './pages/CustomDesignPage';
import ScrollToTop from './components/ScrollToTop';
import JobsPage from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';
import AnnouncementBar from "./components/AnnouncementBar"


const App = () => {
  const { homeBanner, fetchHomeBanner } = useContext(ShopContext);

  useEffect(() => {
  fetchHomeBanner();
}, []);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ScrollToTop />
      {homeBanner?.announcementActive && (
        <AnnouncementBar texts={homeBanner.announcementTexts} />
      )}
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/custom-design" element={<CustomDesignPage />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
