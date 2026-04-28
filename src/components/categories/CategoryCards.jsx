import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchRootCategories } from '../../api/categoriesApi'

const CategoryCards = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const loadRootCategories = async () => {
      try {
        // Public endpoint default now returns only enabled categories.
        const response = await fetchRootCategories()
        setCategories(response?.data?.data || [])
      } catch (error) {
        console.error('Error loading home categories:', error)
        setCategories([])
      }
    }

    loadRootCategories()
  }, [])

  return (
    <section className="mt-6 px-4 mb-4">

      <div className='d-flex mb-4'>
        <h2 className="text-lg  font-semibold ">
          Categories
        </h2>
        {/* <h5 className='text-center text-xs'>Last Month up to 1500+ Products Sales From this category. You can choose a product from here and save money.</h5> */}

      </div>

      {/* GRID OUTSIDE */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">

        {categories.map((cat) => (

          <Link
            key={cat._id || cat.id}
            to={`/category/${cat._id || cat.id}`}
            className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >

            <div className="w-full h-40 sm:h-48 md:h-56 bg-gray-50 flex items-center justify-center p-3 md:p-4">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-center text-sm md:text-base font-medium text-gray-800 py-3 md:py-4 px-2">
              {cat.name}
            </p>

          </Link>

        ))}

      </div>

    </section>
  )
}

export default CategoryCards