import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect, useState } from 'react'
import Loader from './common/loader/Index'

const Layout = lazy(() => import('./pages/Layout'))
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const NotFound = lazy(() => import('./pages/notFound/Index'))
const FoodCategories = lazy(() => import('./pages/foodMenu/FoodCategories'))
const FoodItem = lazy(() => import('./pages/foodMenu/Index'))
const Orders = lazy(() => import('./pages/orders/Index'))
const PaymentsHistory = lazy(() => import('./pages/paymentsHistory/Index'))
const Customers = lazy(() => import('./pages/customers/Index'))
const Coupons = lazy(() => import('./pages/coupons/Index'))
const Brand = lazy(() => import('./pages/brand/Index'))
const Faq = lazy(() => import('./pages/faq/Index'))
const Promotion = lazy(() => import('./pages/promotion/Index'))
const Settings = lazy(() => import('./pages/settings/Index'))
const OrderDetails = lazy(() => import('./pages/orders/OrderDetails'))
const Meeting = lazy(() => import('./pages/meeting/Index'))
const Login = lazy(() => import('./pages/login/Login'))
const Suppliers = lazy(() => import('./pages/suppliers/Index'))
const Areas = lazy(() => import('./pages/postCode/Index'))
const CustomerDetails = lazy(() => import('./pages/customers/CustomerDetails'))
const SalesHistory = lazy(() => import('./pages/salesHistory/Index'))
const SupplierDetails = lazy(() => import('./pages/suppliers/SupplierDetails'))
const WithdrawReq = lazy(() => import('./pages/withdraw-req/Index'))
const Notifications = lazy(() => import('./pages/notification/Notifications'))
const StaffDetails = lazy(() => import('./pages/customers/StaffDetails'))
const Social = lazy(() => import('./pages/social/Index'))
const PaymentDetails = lazy(() => import('./pages/paymentsHistory/PaymentDetails'))
const CouponDetails = lazy(() => import('./pages/coupons/CouponDetails'))
const FoodDetailsPage = lazy(() => import('./pages/foodMenu/FoodDetailsPage'))

// Wrapper Component for Lazy Loading
// eslint-disable-next-line react/prop-types
const LazyLoad = ({ component: Component }) => (
  <Suspense fallback={<div><Loader /></div>}>
    <Component />
  </Suspense>
)

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
        <Route path='/' element={<LazyLoad component={Dashboard} />} />
        <Route path='/dashboard/notifications' element={<LazyLoad component={Notifications} />} />
        <Route path='/dashboard/areas' element={<LazyLoad component={Areas} />} />
        <Route path='/dashboard/food-item' element={<LazyLoad component={FoodItem} />} />
        <Route path='/dashboard/food-item/details/:id' element={<LazyLoad component={FoodDetailsPage} />} />
        <Route path='/dashboard/food-categories' element={<LazyLoad component={FoodCategories} />} />
        <Route path='/dashboard/orders' element={<LazyLoad component={Orders} />} />
        <Route path='/dashboard/orders/details/:id' element={<LazyLoad component={OrderDetails} />} />
        <Route path='/dashboard/sales-history' element={<LazyLoad component={SalesHistory} />} />
        <Route path='/dashboard/payments-history' element={<LazyLoad component={PaymentsHistory} />} />
        <Route path='/dashboard/payments-history/details/:id' element={<LazyLoad component={PaymentDetails} />} />
        <Route path='/dashboard/customers' element={<LazyLoad component={Customers} />} />
        <Route path='/dashboard/customers/details/:id' element={<LazyLoad component={CustomerDetails} />} />
        <Route path='/dashboard/customers/staff/details/:id' element={<LazyLoad component={StaffDetails} />} />
        <Route path='/dashboard/suppliers' element={<LazyLoad component={Suppliers} />} />
        <Route path='/dashboard/suppliers/details/:id' element={<LazyLoad component={SupplierDetails} />} />
        <Route path='/dashboard/coupons' element={<LazyLoad component={Coupons} />} />
        <Route path='/dashboard/coupons/details/:id' element={<LazyLoad component={CouponDetails} />} />
        <Route path='/dashboard/brand' element={<LazyLoad component={Brand} />} />
        <Route path='/dashboard/faq' element={<LazyLoad component={Faq} />} />
        <Route path='/dashboard/social' element={<LazyLoad component={Social} />} />
        <Route path='/dashboard/promotion' element={<LazyLoad component={Promotion} />} />
        <Route path='/dashboard/settings' element={<LazyLoad component={Settings} />} />
        <Route path='*' element={<LazyLoad component={NotFound} />} />
      </Route>
    </Routes>
  )
}

export default App;
