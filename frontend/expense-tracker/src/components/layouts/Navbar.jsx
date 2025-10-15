import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    return (
        <div className="flex items-center justify-between bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 shadow-md">
            
            {/* Mobile Menu Toggle */}
            <button
                className="lg:hidden text-black p-2 rounded-md hover:bg-gray-100 transition-all duration-200"
                onClick={() => setOpenSideMenu(!openSideMenu)}
            >
                {openSideMenu ? (
                    <HiOutlineX className="text-2xl transition-transform duration-200 rotate-180" />
                ) : (
                    <HiOutlineMenu className="text-2xl transition-transform duration-200" />
                )}
            </button>

            {/* Brand Name */}
            <h2 className="text-xl font-semibold text-gray-900 tracking-wide">TrackMyCash</h2>

            {/* Side Menu - Only for Mobile */}
            {openSideMenu && (
                <div className="fixed top-[61px] left-0 w-[70%] h-screen bg-white shadow-lg transition-all duration-300 ease-in-out">
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}
        </div>
    );
};

export default Navbar;
