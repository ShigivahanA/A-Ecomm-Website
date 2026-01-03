// src/pages/PrivacyPolicy.jsx
import React from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[60vh] py-12 px-4 max-w-5xl mx-auto text-gray-800">
      {/* Page header */}
      <header className="text-center mb-10">
        <div className="inline-block px-4 py-1 rounded-md text-2xl">
          <Title text1={"PRIVACY"} text2={"POLICY"} />
        </div>
        <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto">
          We respect your privacy. This page explains what we collect, why, and the control you have
          over your data.
        </p>
      </header>

      {/* Main content */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column */}
        <section className="md:col-span-2 space-y-8">
          <article>
            <h3 className="text-lg font-semibold">Information we collect</h3>
            <ul className="list-disc ml-5 text-gray-600 mt-2">
              <li>Account & contact details (name, email, phone)</li>
              <li>Order & shipping information (addresses, order history)</li>
              <li>Payment & transaction metadata (we do not store card numbers)</li>
              <li>Usage data (pages visited, product interactions) to improve the site</li>
            </ul>
          </article>

          <article>
            <h3 className="text-lg font-semibold">How we use your data</h3>
            <ul className="list-disc ml-5 text-gray-600 mt-2">
              <li>Process and fulfil your orders</li>
              <li>Send transactional emails (order confirmations, shipping updates)</li>
              <li>Personalise product recommendations and marketing (with your consent)</li>
              <li>Detect fraud and enforce our terms</li>
            </ul>
          </article>

          <article>
            <h3 className="text-lg font-semibold">Sharing & third parties</h3>
            <p className="text-gray-600 mt-2">
              We share essential data with payment processors and courier partners strictly to
              complete your orders. We never sell your personal information. Third parties are
              required to follow appropriate security measures.
            </p>
          </article>

          <article>
            <h3 className="text-lg font-semibold">Cookies & tracking</h3>
            <p className="text-gray-600 mt-2">
              We use cookies and similar technologies to make the site work and to analyse usage.
              You can control cookie preferences via your browser.
            </p>
          </article>

          <article className="pb-4">
            <h3 className="text-lg font-semibold">Your rights</h3>
            <ul className="list-disc ml-5 text-gray-600 mt-2">
              <li>Access the data we hold about you</li>
              <li>Request corrections or deletion</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="mt-4 text-gray-600">
              For privacy requests, contact us at{" "}
              <span className="font-medium text-black">contactmayile@gmail.com</span>. 
              We respond to verified requests as required by law.
            </p>
          </article>
        </section>

        {/* Right column */}
        <aside className="space-y-6 md:pl-2">
          <div className="rounded-xl p-5 bg-[#e5e5e5] border">
            <h4 className="text-sm font-semibold mb-2">Our promise</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Minimal collection, secure storage and transparent control — your data is treated with care.
            </p>
          </div>

          <div className="rounded-xl p-5 bg-white border shadow-sm">
            <h4 className="text-sm font-semibold mb-2">Need help?</h4>
            <p className="text-sm text-gray-600 mb-3">
              If you have concerns or want to exercise your rights, reach out:
            </p>
            <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=contactmayile@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block px-4 py-2 rounded-md bg-[#4A70A9] text-white text-sm"
>
              Email support
            </a>
          </div>
        </aside>
      </main>

      {/* OUR PROMISE section — fixed margins and spacing */}
      {/* OUR PROMISE section — improved outer spacing only */}
<section className="mt-16 mb-24">
  <div className="flex flex-col md:flex-row text-sm gap-6 md:gap-0">

    <div className="border bg-[#e5e5e5] px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 w-full">
      <b>Minimal data</b>
      <p className="text-gray-600">
        We only collect data necessary to provide our services.
      </p>
    </div>

    <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 w-full">
      <b>Secure storage</b>
      <p className="text-gray-600">
        We use industry-standard measures to protect your information.
      </p>
    </div>

    <div className="border bg-[#e5e5e5] px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 w-full">
      <b>Transparent control</b>
      <p className="text-gray-600">
        You can request data access, edits, or deletion — contact us anytime.
      </p>
    </div>

  </div>
</section>

      {/* Newsletter */}
      <div className="mt-16">
        <NewsletterBox />
      </div>
    </div>
  );
}
