import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import NotFound from './pages/notFound/Index'
import FoodCategories from './pages/foodMenu/FoodCategories'
import FoodDetails from './pages/foodMenu/FoodDetails'
import FoodItem from './pages/foodMenu/Index'
import Orders from './pages/orders/Index'
import SalesHistory from './pages/salesHistory/Index'
import Customers from './pages/customers/Index'
import Coupons from './pages/coupons/Index'
import Invoice from './pages/invoice/Index'
import Brand from './pages/brand/Index'
import Faq from './pages/faq/Index'
import Promotion from './pages/promotion/Index'
import Settings from './pages/settings/Index'
import OrderDetails from './pages/orders/OrderDetails'
import SalesDetails from './pages/salesHistory/SalesDetails'

function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboard/food-item' element={<FoodItem />} />
        <Route path='/dashboard/food-categories' element={<FoodCategories />} />
        <Route path='/dashboard/food-details/:id' element={<FoodDetails />} />
        <Route path='/dashboard/orders' element={<Orders />} />
        <Route path='/dashboard/orders/details/:id' element={<OrderDetails />} />
        <Route path='/dashboard/sales-history' element={<SalesHistory />} />
        <Route path='/dashboard/sales-history/details/:id' element={<SalesDetails />} />
        <Route path='/dashboard/customers' element={<Customers />} />
        <Route path='/dashboard/coupons' element={<Coupons />} />
        <Route path='/dashboard/invoice' element={<Invoice />} />
        <Route path='/dashboard/brand' element={<Brand />} />
        <Route path='/dashboard/faq' element={<Faq />} />
        <Route path='/dashboard/promotion' element={<Promotion />} />
        <Route path='/dashboard/settings' element={<Settings />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
