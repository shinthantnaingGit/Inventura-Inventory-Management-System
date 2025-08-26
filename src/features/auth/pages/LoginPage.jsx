// app/login/page.jsx
import React from 'react';
import AuthHeader from '../components/AuthHeader';
import LoginForm from '../components/LoginForm';


const LoginPage = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <AuthHeader />
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Sign in to your account
        </h2>
        <LoginForm />
      </div>
    </section>
  );
};

export default LoginPage;