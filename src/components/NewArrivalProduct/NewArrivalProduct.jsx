import React, { useRef } from 'react'

const NewArrivalProduct = () => {

    const scrollRef = useRef(null)

    const products = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        name: `Product ${index + 1}`,
        price: 499 + index * 50,
        image: `https://picsum.photos/300/300?random=${index + 1}`
    }))

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -200 : 200,
                behavior: "smooth"
            })
        }
    }

    return (

        <section className="mt-8 px-4 relative">

            <h2 className="text-lg sm:text-xl font-semibold mb-4">
                New Arrivals
            </h2>

            {/* left arrow */}
            <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full px-2 py-1 shadow"
            >
                ◀
            </button>

            {/* slider */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            >

                {products.map((item) => (

                    <div
                        key={item.id}
                        className="min-w-[160px]   rounded-lg p-2 bg-white hover:shadow"
                    >

                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded"
                        />

                        <h3 className="text-sm mt-2 font-medium">
                            {item.name}
                        </h3>

                        <p className="text-sm text-gray-600">
                            ₹{item.price}
                        </p>

                    </div>

                ))}

            </div>

            {/* right arrow */}
            <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full px-2 py-1 shadow"
            >
                ▶
            </button>

        </section>

    )
}

export default NewArrivalProduct