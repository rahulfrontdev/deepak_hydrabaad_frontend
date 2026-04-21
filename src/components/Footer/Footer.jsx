import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-100 pt-12 pb-6 px-6 mt-6">

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">

                {/* CONTACT */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Contact Us</h3>

                    <div className="space-y-2 text-sm text-gray-600">
                        <p>📞 +91 9901234567</p>
                        <p>✉️ admin@email.com</p>
                        <p>📍 Delhi, India</p>
                    </div>

                    {/* social */}
                    <div className="flex justify-center sm:justify-start gap-4 mt-4 text-xl">
                        <span className="cursor-pointer hover:scale-110 transition">📘</span>
                        <span className="cursor-pointer hover:scale-110 transition">❌</span>
                        <span className="cursor-pointer hover:scale-110 transition">📸</span>
                        <span className="cursor-pointer hover:scale-110 transition">▶️</span>
                    </div>
                </div>

                {/* MY ACCOUNT */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">My Account</h3>

                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="hover:text-black cursor-pointer">Dashboard</li>
                        <li className="hover:text-black cursor-pointer">My Orders</li>
                        <li className="hover:text-black cursor-pointer">My Reviews</li>
                        <li className="hover:text-black cursor-pointer">My Profile</li>
                    </ul>
                </div>

                {/* OUR SERVICES */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Our Services</h3>

                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="hover:text-black cursor-pointer">Return Policy</li>
                        <li className="hover:text-black cursor-pointer">FAQ</li>
                        <li className="hover:text-black cursor-pointer">Privacy Policy</li>
                        <li className="hover:text-black cursor-pointer">Terms of Use</li>
                    </ul>
                </div>

                {/* INFORMATION */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Information</h3>

                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="hover:text-black cursor-pointer">New Arrivals</li>
                        <li className="hover:text-black cursor-pointer">Special Offers</li>
                        <li className="hover:text-black cursor-pointer">Hot Deals</li>
                        <li className="hover:text-black cursor-pointer">Jewellery Care</li>
                        <li className="hover:text-black cursor-pointer">Women's Collection</li>
                    </ul>
                </div>

            </div>

            {/* bottom */}
            <div className="border-t mt-10 pt-4 text-center text-xs text-gray-500">
                © 2026 Jewellery Store. All rights reserved.
            </div>
            <input
                type="file"
                className="relative z-50 cursor-pointer"
            />

        </footer>
    );
};

export default Footer;