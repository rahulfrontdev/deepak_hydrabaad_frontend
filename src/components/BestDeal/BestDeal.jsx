import React from "react";

const products = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: "Women handbag for shoulder",
    price: 1205,
    image:
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200",
}));

const BestDeal = () => {
    return (
        <div className="p-6 bg-gray-100">
            {/* Heading */}
            <h2 className="text-xl font-semibold border-b-2 border-blue-500 inline-block mb-4">
                Best Deals
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT SIDE BIG CARD */}
                <div className="bg-white p-5 rounded-lg shadow">
                    <div className="border rounded-lg p-6 flex justify-center">
                        <img
                            src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=300"
                            alt="bracelet"
                            className="h-40 object-contain"
                        />
                    </div>

                    {/* rating */}
                    <div className="text-gray-400 text-sm mt-3">
                        ★★★★★ <span className="ml-2">0 Review</span>
                    </div>

                    <h3 className="mt-2 font-medium">
                        Stylish belt with unique design and color
                    </h3>

                    <p className="text-lg font-semibold mt-2">₹1205</p>

                    {/* timer */}
                    <div className="flex gap-2 mt-4">
                        {["00", "00", "00", "00"].map((item, i) => (
                            <div
                                key={i}
                                className="bg-gray-200 px-3 py-1 rounded text-sm"
                            >
                                {item}
                            </div>
                        ))}
                    </div>

                    {/* progress */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Available: 15</span>
                            <span>Sold: 11</span>
                        </div>

                        <div className="w-full bg-gray-200 h-2 rounded mt-1">
                            <div className="bg-blue-500 h-2 rounded w-[70%]"></div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE PRODUCT LIST */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-3 bg-white p-3 rounded-lg shadow"
                        >
                            <img
                                src={item.image}
                                alt="product"
                                className="h-20 w-20 object-cover rounded"
                            />

                            <div>
                                <h4 className="text-sm font-medium">{item.title}</h4>

                                <div className="text-gray-400 text-xs">
                                    ★★★★★ <span>0 Review</span>
                                </div>

                                <p className="text-sm font-semibold mt-1">
                                    ₹{item.price}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default BestDeal;