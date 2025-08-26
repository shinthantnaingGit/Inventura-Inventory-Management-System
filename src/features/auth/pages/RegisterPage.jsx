// app/register/page.jsx
import React from 'react';
import AuthHeader from '../components/AuthHeader';
import RegisterForm from '../components/RegisterForm';


const RegisterPage = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <AuthHeader />
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Create a new account
        </h2>
        <RegisterForm />
      </div>
    </section>
  );
};

export default RegisterPage;