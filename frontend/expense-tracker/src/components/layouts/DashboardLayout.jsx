import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar activeMenu={activeMenu} />
            
            {user && (
                <div className="flex flex-1">
                    {/* Sidebar with fixed width */}
                    <div className="w-64 hidden md:block bg-white shadow-lg">
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                    
                    {/* Main content area with centered layout and sidebar offset */}
                    <div className="flex-1 p-4 md:p-6 overflow-auto flex justify-center w-full">
                        <div className="max-w-6xl mx-auto w-full md:ml-0 ml-0">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;