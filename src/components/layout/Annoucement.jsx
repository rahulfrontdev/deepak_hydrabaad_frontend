import React from 'react'

const Announcement = () => {
    return (
        <div className="bg-black text-white text-sm py-2 px-4 flex items-center justify-center">
            <input
                type="file"
                className="relative z-50 cursor-pointer"
            />
            <p className="text-center">
                🎉 Free Shipping on Orders Above ₹999 | Limited Time Offer!
            </p>

        </div>
    )
}

export default Announcement