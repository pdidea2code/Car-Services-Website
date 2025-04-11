import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { getAllAppSettingApi } from '../redux/api/api'

const AppHeader = () => {
  const [appSetting, setAppSetting] = useState('')
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
  useEffect(() => {
    const appsetting = async () => {
      try {
        const response = await getAllAppSettingApi()
        if (response.status === 200) {
          const data = response.data.info
          console.log(data)
          setAppSetting(data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    appsetting()
  }, [])
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand
          style={{ backgroundColor: 'var(--color-one)' }}
          className="mx-auto d-md-none"
          to="/"
        >
          <img src={appSetting.logo} alt="logo" height={48} />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
