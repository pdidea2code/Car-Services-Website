import React, { Suspense, useEffect, useState  } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { getAdminThemeApi } from './redux/api/api'
import './scss/style.scss'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import MinimalLayout from './layout/MinimalLayout'
import { CSpinner } from '@coreui/react'
import { getAllAppSettingApi } from './redux/api/api'
const loading = (
  <div className="pt-3 text-center">
    <CSpinner className="spinner-color" />
  </div>
)


const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))


const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const PublicRoute = () => {
    return isAuthenticated || Boolean(Cookies.get('token')) ? (
      <Navigate to="/dashboard" />
    ) : (
      <MinimalLayout />
    )
  }

  const PrivateRoute = () => {
    return isAuthenticated || Boolean(Cookies.get('token')) ? (
      <DefaultLayout />
    ) : (
      <Navigate to="/" />
    )
  }
  const fetchAdminTheme = async () => {
    const response = await getAdminThemeApi()
    if (response.status === 200) {
      const data = response.data.info      
      document.documentElement.style.setProperty('--color-one', data.color1);
      document.documentElement.style.setProperty('--color-two', data.color2);
      document.documentElement.style.setProperty('--color-three', data.color3);
    }
  }
  const setFavicon = (iconUrl) => {
    const link = document.querySelector("link[rel='icon']") || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'icon'
    link.href = iconUrl

    // If the <link> doesn't exist, add it to the <head>
    if (!document.querySelector("link[rel='icon']")) {
      document.head.appendChild(link)
    }
  }
  useEffect(() => {
    fetchAdminTheme()
    
    const appsetting=async()=>{
      try {
        const response = await getAllAppSettingApi()
        if (response.status === 200) {
          const data = response.data.info
          setFavicon(data.favicon)
        }
      } catch (error) {
        console.error(error)
      }
    }
    appsetting()
  }, [])
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/" element={<PublicRoute />}>
            <Route exact path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="*" element={<DefaultLayout />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
