import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Dashboard1 = React.lazy(() => import('./views/dashboard/Dashboard(1)'))
const User = React.lazy(() => import('./views/pages/User/User'))
const CarType = React.lazy(() => import('./views/pages/Car Type/index'))
const CarTypeForm = React.lazy(() => import('./views/pages/Car Type/CarTypeForm'))
const Gallery = React.lazy(() => import('./views/pages/Gallery/Gallery'))
const GalleryForm = React.lazy(() => import('./views/pages/Gallery/GalleryForm'))
const Service = React.lazy(() => import('./views/pages/Service/Service'))
const ServiceForm = React.lazy(() => import('./views/pages/Service/ServiceForm'))
const Addons = React.lazy(() => import('./views/pages/Addons/Addons'))
const AddonsForm = React.lazy(() => import('./views/pages/Addons/AddonsForm'))
const Appsetting = React.lazy(() => import('./views/pages/AppSetting/Appsetting'))
const Faq = React.lazy(() => import('./views/pages/Faq/Faq'))
const FaqForm = React.lazy(() => import('./views/pages/Faq/FaqForm'))
const AdminTheme = React.lazy(() => import('./views/pages/Theme/AdminTheme'))
const Blog = React.lazy(() => import('./views/pages/Blog/Blog'))
const BlogForm = React.lazy(() => import('./views/pages/Blog/BlogForm'))
const Address = React.lazy(() => import('./views/pages/Contect/Address'))
const AddressForm = React.lazy(() => import('./views/pages/Contect/AddresssForm'))
const BusinessHour = React.lazy(() => import('./views/pages/AppSetting/Businesshour'))
const Businesshourfrom = React.lazy(() => import('./views/pages/AppSetting/Businesshourfrom'))
const UserTheme = React.lazy(() => import('./views/pages/Theme/UserTheme'))
const UserThemeForm = React.lazy(() => import('./views/pages/Theme/UserThemeForm'))
const Promocode = React.lazy(() => import('./views/pages/Promocode/Promocode'))
const PromocodeForm = React.lazy(() => import('./views/pages/Promocode/PromocodeFrom'))
const Order = React.lazy(() => import('./views/pages/Order/Order'))
const OrderView = React.lazy(() => import('./views/pages/Order/Orderview'))
const Review = React.lazy(() => import('./views/pages/Review/Review'))
const ServiceView = React.lazy(() => import('./views/pages/Service/Serviceview'))
const Contectus = React.lazy(() => import('./views/pages/Contect/Contectus'))
const Popupimage = React.lazy(() => import('./views/pages/popupimg/Popupimage'))
const changepassword = React.lazy(() => import('./views/pages/login/Changepasseord'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/dashboard', name: 'Dashboard', element: Dashboard1 },
  { path: '/dashboard1', name: 'Dashboard1', element: Dashboard1 },
  { path: '/users', name: 'Users', element: User },
  { path: '/cartype', name: 'Car Type', element: CarType },
  { path: '/cartype/form', name: 'Car Type Form', element: CarTypeForm },
  { path: '/gallery', name: 'Gallery', element: Gallery },
  { path: '/gallery/form', name: 'Gallery Form', element: GalleryForm },
  { path: '/service', name: 'Service', element: Service },
  { path: '/service/form', name: 'Service Form', element: ServiceForm },
  { path: '/addons', name: 'Addons', element: Addons },
  { path: '/addons/form', name: 'Addons Form', element: AddonsForm },
  { path: '/appsetting', name: 'App Setting', element: Appsetting },
  { path: '/faq', name: 'Faq', element: Faq },
  { path: '/faq/form', name: 'Faq Form', element: FaqForm },
  { path: '/admin-theme', name: 'Admin Theme', element: AdminTheme },
  { path: '/blog', name: 'Blog', element: Blog },
  { path: '/blog/form', name: 'Blog Form', element: BlogForm },
  { path: '/address', name: 'Address', element: Address },
  { path: '/address/form', name: 'Address Form', element: AddressForm },
  { path: '/businesshour', name: 'Business Hour', element: BusinessHour },
  { path: '/businesshour/form', name: 'Business Hour Form', element: Businesshourfrom },
  { path: '/usertheme', name: 'User Theme', element: UserTheme },
  { path: '/usertheme/form', name: 'User Theme Form', element: UserThemeForm },
  { path: '/promocode', name: 'Promocode', element: Promocode },
  { path: '/promocode/form', name: 'Promocode Form', element: PromocodeForm },
  { path: '/order', name: 'Order', element: Order },
  { path: '/order/view', name: 'Order View', element: OrderView },
  { path: '/review', name: 'Review', element: Review },
  { path: '/service/view/:id', name: 'Service View', element: ServiceView },
  { path: '/contactus', name: 'Contact Us', element: Contectus },
  { path: '/popupimage', name: 'Popup Image', element: Popupimage },
  { path: '/changepassword', name: 'Change Password', element: changepassword },
]

export default routes
