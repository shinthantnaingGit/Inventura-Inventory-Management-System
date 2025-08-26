// components/LoginForm.jsx
"use client";
import React from "react";
import { Mail, Lock, Github } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { userLogin } from "@/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAccountStore from "@/store/useAccountStore";

const LoginForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const { token, setToken } = useAccountStore();

  // Handle form submit
  const onSubmit = async (data) => {
    // console.log(loginAuthUrl);
    console.log("Form Submitted ✅", data);
    // console.log(data.email);
    // console.log(data.password);
    try {
      const res = await userLogin({
        email: data.email,
        password: data.password,
      });
      const loginData = await res.json();
      console.log(res);
      console.log(loginData);
      if (!res.ok) {
        throw new Error(loginData.message || "Login Failed");
      }
      setToken(loginData.token);
      console.log(loginData.token);
      toast.success("Login Successfully");
      reset();
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="you@example.com"
            />
            <Mail
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="••••••••"
            />
            <Lock
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me and Forgot password link */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Forgot password?
          </a>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Social Sign-in Divider */}
      <div className="my-6 flex items-center">
        <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        <span className="mx-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          or
        </span>
        <hr className="flex-grow border-gray-300 dark:border-gray-600" />
      </div>

      {/* Social Sign-in Buttons */}
      <div className="space-y-4">
        <button
          type="button"
          className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 19"
          >
            <path d="M15.6 19.1h-3.59c-3.13 0-5.71-2.58-5.71-5.71s2.58-5.71 5.71-5.71 5.71 2.58 5.71 5.71c0 3.13-2.58 5.71-5.71 5.71zm0-9.22c-2.32 0-4.21 1.89-4.21 4.21s1.89 4.21 4.21 4.21 4.21-1.89 4.21-4.21-1.89-4.21-4.21-4.21z" />
            <path d="M17.43 12.38c.04.14.07.28.07.43 0 1.54-.53 2.97-1.46 4.09-1.22 1.48-2.9 2.37-4.74 2.37-3.79 0-6.88-3.09-6.88-6.88S6.87 3.09 10.66 3.09c2.09 0 3.96.95 5.24 2.47l-1.97 1.88c-.97-1.07-2.32-1.74-3.8-1.74-2.81 0-5.09 2.28-5.09 5.09s2.28 5.09 5.09 5.09c1.92 0 3.52-1.05 4.39-2.61l.08.03z" />
            <path d="M.4 9.5a.47.47 0 01.47-.47h1.49a.47.47 0 01.47.47v1.49a.47.47 0 01-.47.47H.87a.47.47 0 01-.47-.47V9.5z" />
          </svg>
          <span>Sign in with Google</span>
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          <Github size={24} />
          <span>Sign in with GitHub</span>
        </button>
      </div>

      {/* Register Link */}
      <div className="mt-6 text-center">
        <span className="text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
        </span>
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
