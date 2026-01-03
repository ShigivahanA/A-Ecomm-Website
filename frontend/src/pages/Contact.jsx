import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from "../components/ToastProvider";


const ContactFormMinimal = () => {
  const { sendContact } = useContext(ShopContext);
  const { addToast } = useToast();

  const [form, setForm] = useState({ name: '', email: '', message: '', botcheck: '' });
  const [loading, setLoading] = useState(false);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      addToast({ type: "error", message: "Please fill in name, email and message." });
      return;
    }

    // Honeypot check
    if (form.botcheck) {
      addToast({ type: "error", message: "Bot detected." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // call context helper which calls your backend
      const data = await sendContact({
        name: form.name,
        email: form.email,
        message: form.message,
      });

      if (data?.success) {
        addToast({
            type: "success",
            message: data.message || "Thanks — your message has been sent.",
          });
        setForm({ name: '', email: '', message: '', botcheck: '' });
      } else {
        addToast({
            type: "error",
            message: data?.message || "Submission failed. Please try again.",
          });
      }
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        message: "Network error — please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 border border-gray-100 rounded-xl bg-[#e5e5e5]">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Send us a message</h4>
      <p className="text-sm text-gray-500 mb-4">Questions about orders, sizing, or collaborations — we’re here to help.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#000000]"
          required
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@gmail.com"
          className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#000000]"
          required
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="How can we help?"
          className="border rounded-xl px-3 py-2 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-[#000000]"
          required
        />

        {/* Honeypot (hidden from users) */}
        <input
          name="botcheck"
          value={form.botcheck}
          onChange={handleChange}
          className="hidden"
          tabIndex="-1"
          autoComplete="off"
        />

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-black text-white font-medium disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>

          <span className="text-xs text-black">*You’ll hear from us within 3–6 hours.</span>
        </div>
      </form>
    </div>
  );
};

const Contact = () => {
    const navigate = useNavigate();
  return (
    <div className='max-w-5xl'>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-6">
        <img className="w-full md:max-w-[480px]" src={assets.contact_img} alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className=" text-gray-500">
            MAYILÉ<br /> Tuticorin, Tamil Nadu, India.
          </p>
          <p className=" text-gray-500">
            Tel: 0461 2XXXXX <br /> Email: contactmayile@gmail.com
          </p>
          <p className="font-semibold text-xl text-gray-600">Careers at MAYILÉ </p>
          <p className=" text-gray-500">Learn more about our teams and job openings.</p>
          <button onClick={() => navigate("/jobs")} className="border border-black rounded-xl px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Minimal contact form — retained page content above */}
      <ContactFormMinimal />

      {/* Keep newsletter & footer stuff */}
      <div className="mt-12">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default Contact;
