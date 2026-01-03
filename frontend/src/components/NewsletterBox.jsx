import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

const NewsletterBox = () => {
  const { sendNewsletter } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const data = await sendNewsletter({ email });

      if (data?.success) {
        setStatus({ type: 'success', message: data.message || 'Subscribed successfully!' });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: data?.message || 'Subscription failed.' });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Network error — please try again.' });
    }

    setLoading(false);
  };

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>

      <p className='text-gray-400 mt-3'>
        Receive updates on handcrafted pieces, seasonal collections, and exclusive discounts.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'
      >
        <input
          className='w-full sm:flex-1 outline-none'
          type="email"
          placeholder='Enter your email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type='submit'
          className='bg-black text-white rounded-l-xl text-xs px-10 py-4 focus:outline-none focus:ring-2 focus:ring-[#ffffff]'
          disabled={loading}
        >
          {loading ? 'SUBSCRIBING' : 'SUBSCRIBE'}
        </button>
      </form>

      {/* Reserved space for message (prevents layout shifting) */}
      <div className="w-full sm:w-1/2 mx-auto min-h-[24px] flex items-center justify-center transition-all duration-300">
          {status && (
            <div
              role="status"
              className={`w-full text-sm py-1 px-3 rounded-md transition-all duration-300 ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {status.message}
            </div>
          )}
        </div>
    </div>
  );
};

export default NewsletterBox;
