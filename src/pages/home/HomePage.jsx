import { Link } from 'react-router-dom'
import Promotional from '../../components/Promotional'
import CategoryCards from '../../components/categories/CategoryCards'
import NewArrivalProduct from '../../components/NewArrivalProduct/NewArrivalProduct'
import BestDeal from '../../components/BestDeal/BestDeal'
import RecentPost from '../../components/RecentPost/RecentPost'
import NewsLetter from '../../components/NewsLetter/NewsLetter'
import Footer from '../../components/Footer/Footer'
import Insta from '../../components/InstagramEmbadded/Insta'


const HomePage = () => {
  return (
    <section>
      <Promotional />
      <CategoryCards />
      <NewArrivalProduct />
      <BestDeal />
      {/* <RecentPost /> */}
      <Insta />
      <NewsLetter />
      <Footer />
    </section>
  )
}

export default HomePage
