// components/ContactSection.jsx
import React from 'react';
import ContactForm from './ContactForm';
import ContactDetails from './ContactDetails';

const ContactSection = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Title and Subtitle */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions or need support? Fill out the form below or reach out to us using the contact details provided.
          </p>
        </div>

        {/* Contact Form and Details */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <ContactForm />
          <ContactDetails />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;