import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'
import { getAllAppSettingApi } from '../redux/api/api'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const [appSetting, setAppSetting] = useState('')
  const unfoldable = useSelector((state) => state.sidebar.sidebarUnfoldable)

  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
  useEffect(() => {
    const appsetting = async () => {
      try {
        const response = await getAllAppSettingApi()
        if (response.status === 200) {
          const data = response.data.info
          setAppSetting(data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    appsetting()
  }, [])

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand
        style={{ backgroundColor: 'var(--color-one)' }}
        className="d-none d-md-flex"
        to="/"
      >
        <img src={appSetting.logo} alt="logo" className="sidebar-brand-full" height={35} />
        <img src={appSetting.logo} alt="logo" className="sidebar-brand-narrow" height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
