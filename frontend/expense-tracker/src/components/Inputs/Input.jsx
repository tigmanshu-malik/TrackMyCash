import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, placeholder, label, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-4 relative">
            <label className="text-[13px] text-slate-800 block mb-1">
                {label}
            </label>

            <div className="input-box relative">
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none border-b-2 border-gray-300 focus:border-primary py-2 pr-8"
                    value={value}
                    onChange={(e) => onChange(e.target.value)} 
                />
                {type === "password" && (
                    showPassword ? (
                        <FaRegEye
                            size={22}
                            className="text-primary cursor-pointer absolute right-0 top-1/2 -translate-y-1/2"
                            onClick={toggleShowPassword}
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={22}
                            className="text-slate-400 cursor-pointer absolute right-0 top-1/2 -translate-y-1/2"
                            onClick={toggleShowPassword}
                        />
                        
                    )
                )}
            </div>
        </div>
    );
};

export default Input;