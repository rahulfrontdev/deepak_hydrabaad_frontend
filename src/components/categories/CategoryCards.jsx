import { Link } from 'react-router-dom'

const CategoryCards = () => {

  const categories = [
    {
      id: 'diamond-rings',
      name: 'Diamond Rings',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 'gold-rings',
      name: 'Gold Rings',
      imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 'engagement-rings',
      name: 'Engagement Rings',
      imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 'wedding-rings',
      name: 'Wedding Rings',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 'pendants',
      name: 'Pendants',
      imageUrl: 'https://m.media-amazon.com/images/I/512ms7BDqxL._AC_UY1100_.jpg'
    },
    {
      id: 'jewellery-sets',
      name: 'Jewellery Sets',
      imageUrl: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=60'
    }
  ];

  return (
    <section className="mt-6 px-4 mb-4">

      <div className='d-flex mb-4'>
        <h2 className="text-lg  font-semibold ">
          Categories
        </h2>
        {/* <h5 className='text-center text-xs'>Last Month up to 1500+ Products Sales From this category. You can choose a product from here and save money.</h5> */}

      </div>

      {/* GRID OUTSIDE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">

        {categories.map((cat) => (

          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className="  rounded-lg overflow-hidden bg-white hover:shadow "
          >

            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="w-full h-34 sm:h-28 object-cover"
            />

            <p className="text-center text-sm p-2">
              {cat.name}
            </p>

          </Link>

        ))}

      </div>

    </section>
  )
}

export default CategoryCards