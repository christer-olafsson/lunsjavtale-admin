import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './pages/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import NotFound from './pages/notFound/Index'
import FoodCategories from './pages/foodMenu/FoodCategories'
import FoodDetails from './pages/foodMenu/FoodDetails'
import FoodItem from './pages/foodMenu/Index'
import Orders from './pages/orders/Index'
import PaymentsHistory from './pages/paymentsHistory/Index'
import Customers from './pages/customers/Index'
import Coupons from './pages/coupons/Index'
import Brand from './pages/brand/Index'
import Faq from './pages/faq/Index'
import Promotion from './pages/promotion/Index'
import Settings from './pages/settings/Index'
import OrderDetails from './pages/orders/OrderDetails'
import SalesDetails from './pages/paymentsHistory/SalesDetails'
import Meeting from './pages/meeting/Index'
import Login from './pages/login/Login'
import { useEffect, useState } from 'react'
import Suppliers from './pages/suppliers/Index'
import Areas from './pages/postCode/Index'
import CustomerDetails from './pages/customers/CustomerDetails'
import SalesHistory from './pages/salesHistory/Index'
import SupplierDetails from './pages/suppliers/SupplierDetails'
import WithdrawReq from './pages/withdraw-req/Index'
import Notifications from './pages/notification/Notifications'
import StaffDetails from './pages/customers/StaffDetails'
import Social from './pages/social/Index'


function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_lunsjavtale'));

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setToken(localStorage.getItem('admin_lunsjavtale'))
  }, [])


  return (
    <Routes>
      <Route path='/login' element={token ? <Navigate to='/' /> : <Login />} />
      <Route element={token ? <Layout /> : <Navigate to='/login' />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/dashboard/notifications' element={<Notifications />} />
        <Route path='/dashboard/areas' element={<Areas />} />
        <Route path='/dashboard/food-item' element={<FoodItem />} />
        <Route path='/dashboard/food-categories' element={<FoodCategories />} />
        <Route path='/dashboard/:path/food-details/:id' element={<FoodDetails />} />
        <Route path='/dashboard/orders' element={<Orders />} />
        <Route path='/dashboard/orders/details/:id' element={<OrderDetails />} />
        <Route path='/dashboard/sales-history' element={<SalesHistory />} />
        <Route path='/dashboard/payments-history' element={<PaymentsHistory />} />
        <Route path='/dashboard/payments-history/details/:id' element={<SalesDetails />} />
        <Route path='/dashboard/customers' element={<Customers />} />
        <Route path='/dashboard/customers/details/:id' element={<CustomerDetails />} />
        <Route path='/dashboard/customers/staff/details/:id' element={<StaffDetails />} />
        <Route path='/dashboard/suppliers' element={<Suppliers />} />
        <Route path='/dashboard/suppliers/details/:id' element={<SupplierDetails />} />
        <Route path='/dashboard/withdraw-req' element={<WithdrawReq />} />
        <Route path='/dashboard/meetings' element={<Meeting />} />
        <Route path='/dashboard/coupons' element={<Coupons />} />
        {/* <Route path='/dashboard/invoice' element={<Invoice />} />
        <Route path='/dashboard/invoice/details/:id' element={<InvoiceDetails />} /> */}
        <Route path='/dashboard/brand' element={<Brand />} />
        <Route path='/dashboard/faq' element={<Faq />} />
        <Route path='/dashboard/social' element={<Social />} />
        <Route path='/dashboard/promotion' element={<Promotion />} />
        <Route path='/dashboard/settings' element={<Settings />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
