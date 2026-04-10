import React from 'react'

const Announcement = () => {
    return (
        <div className="bg-black text-white text-sm py-2 px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">

                {/* LEFT TEXT */}
                <p className="text-center justify-center sm:text-left">
                    🎉 Free Shipping on Orders Above ₹999 | Limited Time Offer!
                </p>

                {/* RIGHT LINKS */}
                {/* <div className="flex gap-4 text-xs sm:text-sm">
                    <span className="cursor-pointer hover:underline">Track Order</span>
                    <span className="cursor-pointer hover:underline">Support</span>
                    <span className="cursor-pointer hover:underline">Login</span>
                </div> */}

            </div>
        </div>
    )
}

export default Announcement