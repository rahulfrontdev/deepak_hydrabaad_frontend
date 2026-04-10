import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const Promotional = () => {

    // Later you can replace this with API response
    const banners = [
        {
            id: 1,
            image: "https://blog.tanishq.co.in/wp-content/uploads/2023/11/Clip-path-group-1.png",
            alt: "Elegant Bag"
        },
        {
            id: 2,
            image: "https://muesa.fr/cdn/shop/files/cabas-xl-en-coton-334057.jpg?v=1721220431",
            alt: "Pink Handbag"
        },
        {
            id: 3,
            image: "https://blog.tanishq.co.in/wp-content/uploads/2025/08/Clip-path-group-8-1.png",
            alt: "Leather Bag"
        }
    ]

    return (
        <div className="w-full">
            <Carousel
                showThumbs={false}
                showStatus={false}
                infiniteLoop
                autoPlay
                interval={3000}
                swipeable
                emulateTouch
            >

                {banners.map((item) => (

                    <div
                        key={item.id}
                        className="h-[420px] sm:h-[480px] md:h-[400px] bg-white flex items-center justify-center"
                    >

                        <img
                            src={item.image}
                            alt={item.alt}
                            className="h-full w-full object-cover"
                        />

                    </div>

                ))}

            </Carousel>
        </div>
    )
}

export default Promotional