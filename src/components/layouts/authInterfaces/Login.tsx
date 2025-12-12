import { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black font-sans py-12 px-4">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/login.jpg"
          alt="Login Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* GLASS CARD */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/70 backdrop-blur-md border border-white/40 shadow-2xl shadow-black/20 rounded-3xl animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors mb-4 uppercase tracking-widest"
          >
            <FaArrowLeft /> Back to Home
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-600 font-medium">
            Log in to continue your Himalayan journey.
          </p>
        </div>

        {/* Social Buttons - Google Only */}
        <div className="mb-6">
          <button className="w-full flex items-center justify-center gap-2 bg-white/60 border border-white/50 hover:bg-white hover:border-white py-3 rounded-xl transition-all duration-200 text-sm font-bold text-gray-700 shadow-sm">
            <FaGoogle className="text-red-500" /> Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300/50"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
            <span className="bg-transparent px-2 text-gray-500">Or log in with email</span>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="nomad@example.com"
              className="w-full px-5 py-3 rounded-xl bg-white/50 border border-white/50 text-gray-900 font-medium placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#084EA8] focus:border-transparent transition-all shadow-inner"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Password
              </label>
              <a href="#" className="text-xs font-bold text-[#084EA8] hover:underline">
                Forgot?
              </a>
            </div>
            
            {/* Password Input Wrapper */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-5 pr-12 py-3 rounded-xl bg-white/50 border border-white/50 text-gray-900 font-medium placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#084EA8] focus:border-transparent transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <button className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-[#084EA8] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg mt-2">
            Log In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-[#084EA8] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;