import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
import Meeting from './pages/meeting/Index'
import Login from './pages/login/Login'
import { useEffect, useState } from 'react'
import InvoiceDetails from './pages/invoice/InvoiceDetails'
import Suppliers from './pages/suppliers/Index'
import Areas from './pages/postCode/Index'


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])


  return (
    <Routes>
      <Route path='/login' element={token ? <Navigate to='/dashboard' /> : <Login />} />
      <Route element={token ? <Layout /> : <Navigate to='/login' />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboard/areas' element={<Areas />} />
        <Route path='/dashboard/food-item' element={<FoodItem />} />
        <Route path='/dashboard/food-categories' element={<FoodCategories />} />
        <Route path='/dashboard/food-details/:id' element={<FoodDetails />} />
        <Route path='/dashboard/orders' element={<Orders />} />
        <Route path='/dashboard/orders/details/:id' element={<OrderDetails />} />
        <Route path='/dashboard/sales-history' element={<SalesHistory />} />
        <Route path='/dashboard/sales-history/details/:id' element={<SalesDetails />} />
        <Route path='/dashboard/customers' element={<Customers />} />
        <Route path='/dashboard/suppliers' element={<Suppliers />} />
        <Route path='/dashboard/meetings' element={<Meeting />} />
        <Route path='/dashboard/coupons' element={<Coupons />} />
        <Route path='/dashboard/invoice' element={<Invoice />} />
        <Route path='/dashboard/invoice/details/:id' element={<InvoiceDetails />} />
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
