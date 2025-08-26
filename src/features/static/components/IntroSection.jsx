// components/IntroSection.jsx
import React from 'react';
import { CheckCircle, Zap, Shield } from 'lucide-react';

const IntroSection = () => {
  const features = [
    {
      icon: <CheckCircle size={32} className="text-blue-600 dark:text-blue-500" />,
      title: 'Simple & Intuitive',
      description: 'Our clean and simple interface allows you to create invoices in minutes without any hassle.'
    },
    {
      icon: <Zap size={32} className="text-blue-600 dark:text-blue-500" />,
      title: 'Fast & Efficient',
      description: 'Automate repetitive tasks and get paid faster with our powerful features.'
    },
    {
      icon: <Shield size={32} className="text-blue-600 dark:text-blue-500" />,
      title: 'Secure & Reliable',
      description: 'Your data is safe with us. We use industry-standard security measures to protect your information.'
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose Shinichi IT Solutions?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntroSection;