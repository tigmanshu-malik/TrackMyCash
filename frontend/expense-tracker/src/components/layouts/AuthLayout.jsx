import React from "react";
import CARD_2 from "../../assets/images/card2.png";
import { LuTrendingUpDown } from "react-icons/lu"; 

const AuthLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen">
            {/* Left Side - Auth Form */}
            <div className="w-full md:w-[60vw] px-8 md:px-12 py-8 bg-white flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold text-primary mb-4 tracking-wide">
                        TrackMyCash
                    </h2>
                    {children}
                </div>
                <p className="text-xs text-gray-400 text-center md:text-left mt-4">
                    Securely manage your money with TrackMyCash 💸
                </p>
            </div>

            {/* Right Side - Visual/Stats */}
            <div className="hidden md:block w-[40vw] h-full bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden relative p-8">
                {/* Background Accents */}
                <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5 blur-sm opacity-70" />
                <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10 blur-sm opacity-60"></div>
                <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5 blur-sm opacity-60"></div>

                {/* Stats Card */}
                <div className="relative z-20 mt-12">
                    <StatsInfoCard
                        icon={<LuTrendingUpDown />}
                        label="Track Your Income & Expenses"
                        value="x,xx,900"
                        color="bg-violet-500"
                    />
                </div>

                {/* Card Image */}
                <img
                    src={CARD_2}
                    className="w-64 lg:w-[90%] absolute bottom-10 right-6 drop-shadow-2xl"
                    alt="Visual aid"
                />
            </div>
        </div>
    );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
    return (
        <div className="flex gap-4 bg-white p-5 rounded-xl shadow-lg border border-gray-200 items-center transition-all hover:scale-[1.02] duration-300">
            <div className={`w-12 h-12 flex items-center justify-center text-[24px] text-white ${color} rounded-full shadow-md`}>
                {icon}
            </div>
            <div>
                <h6 className="text-sm text-gray-500 mb-1">{label}</h6>
                <p className="text-[22px] font-semibold text-gray-800">₹{value}</p>
            </div>
        </div>
    );
};
