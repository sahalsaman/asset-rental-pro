// app/documentation/auth/page.tsx
import {
  UserPlus,
  ShieldCheck,
  LogIn,
  ChevronRight,
  CircleCheck
} from 'lucide-react';

export default function AuthFlowPage() {
  return (
    <div className="p-6 md:p-10 relative overflow-hidden">
      {/* Background decorations - slightly muted for card */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-teal-900/5 rounded-bl-full -z-0 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] bg-sky-50 rounded-full -z-0 pointer-events-none" />

      <div className="flex flex-col gap-10 relative z-10">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col justify-between items-start gap-2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1a5f7a] w-full">
            Authentication Flow
          </h1>
          <p className="text-lg text-gray-500">
            Secure access management for property owners
          </p>
        </div>

        {/* Main content - Process steps */}
        <div className="w-full flex flex-col items-center">
          <div className="w-full">
            {/* Connecting line + progress (Desktop only) */}
            <div className="relative mb-16 hidden md:block">
              <div className="absolute top-1/2 left-12 right-12 h-1 bg-gray-200 rounded-full -translate-y-1/2" />
              <div className="absolute top-1/2 left-12 w-3/5 h-1 bg-gradient-to-r from-[#127aa4] to-[#40bdef] rounded-full -translate-y-1/2" />

              {/* Arrow indicators */}
              <ChevronRight
                className="absolute top-1/2 text-gray-300 text-3xl -translate-y-1/2"
                style={{ left: '32%' }}
              />
              <ChevronRight
                className="absolute top-1/2 text-gray-300 text-3xl -translate-y-1/2"
                style={{ left: '66%' }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {/* Step 1 */}
              <div className="relative bg-white rounded-2xl shadow-lg border-t-4 border-[#186786] hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-[#186786] rounded-full flex items-center justify-center text-white shadow-lg">
                  <UserPlus size={32} className="md:w-9 md:h-9" />
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>

                <div className="pt-12 md:pt-16 px-6 md:px-8 pb-8 md:pb-10 text-center">
                  <h3 className="text-xl md:text-2xl font-bold font-montserrat text-gray-800 mb-6">
                    Signup / Registration
                  </h3>
                  <ul className="text-left space-y-4 text-gray-700 text-sm md:text-base">
                    <li className="flex items-start gap-3">
                      <CircleCheck className="text-[#2793be] mt-1 flex-shrink-0" size={18} />
                      <span><strong>Data Collection:</strong> Full Name, Email Address or Phone Number.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CircleCheck className="text-[#2793be] mt-1 flex-shrink-0" size={18} />
                      <span><strong>Security:</strong> Password creation with strength requirements.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CircleCheck className="text-[#2793be] mt-1 flex-shrink-0" size={18} />
                      <span><strong>Validation:</strong> Basic format checks and Terms of Service consent.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative bg-white rounded-2xl shadow-lg border-t-4 border-[#1e7da3] hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-[#1e7da3] rounded-full flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck size={32} className="md:w-9 md:h-9" />
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>

                <div className="pt-12 md:pt-16 px-6 md:px-8 pb-8 md:pb-10 text-center">
                  <h3 className="text-xl md:text-2xl font-bold font-montserrat text-gray-800 mb-6">
                    OTP Verification
                  </h3>
                  <ul className="text-left space-y-4 text-gray-700 text-sm md:text-base">
                    <li className="flex items-start gap-3">
                      <CircleCheck className="text-[#2793be] mt-1 flex-shrink-0" size={18} />
                      <span><strong>Delivery:</strong> One-Time Password sent to registered email or mobile.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CircleCheck className="text-[#2793be] mt-1 flex-shrink-0" size={18} />
                      <span><strong>Security:</strong> Time-limited codes with expiry handling.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CircleCheck className="text-[#2793be] mt-1 flex-shrink-0" size={18} />
                      <span><strong>Retry Logic:</strong> Resend option available after cooldown period.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative bg-white rounded-2xl shadow-lg border-t-4 border-[#2793be] hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-[#2793be] rounded-full flex items-center justify-center text-white shadow-lg">
                  <LogIn size={32} className="md:w-9 md:h-9" />
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>

                <div className="pt-12 md:pt-16 px-6 md:px-8 pb-8 md:pb-10 text-center">
                  <h3 className="text-xl md:text-2xl font-bold font-montserrat text-gray-800 mb-6">
                    Login Access
                  </h3>
                  <ul className="text-left space-y-4 text-gray-700 text-sm md:text-base">
                    <li className="flex items-start gap-3">
                      <CircleCheck className="text-[#2793be] mt-1 flex-shrink-0" size={18} />
                      <span><strong>Credentials:</strong> Login via verified Email/Phone and Password.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CircleCheck className="text-[#2793be] mt-1 flex-shrink-0" size={18} />
                      <span><strong>Convenience:</strong> "Remember Me" functionality for quick access.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CircleCheck className="text-[#2793be] mt-1 flex-shrink-0" size={18} />
                      <span><strong>Recovery:</strong> Forgot Password flow to reset credentials securely.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}