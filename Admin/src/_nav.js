import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import * as Icons from '@mui/icons-material'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <Icons.DashboardRounded className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <Icons.PersonRounded className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Car Type',
    to: '/cartype',
    icon: <Icons.CategoryRounded className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Gallery',
    to: '/gallery',
    icon: <Icons.PhotoRounded className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Service',
    to: '/service',
    icon: <Icons.BuildRounded className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Blog',
    to: '/blog',
    icon: <Icons.ArticleRounded className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Addons',
    to: '/addons',
    icon: <Icons.AddRounded className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Address',
    to: '/address',
    icon: <Icons.LocationOnRounded className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Promocode',
    to: '/promocode',
    icon: <Icons.LocalOfferRounded className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Order',
    to: '/order',
    icon: <Icons.LocalOfferRounded className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Review',
    to: '/review',
    icon: <Icons.ReviewsRounded className="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Setting',
    to: '/appsetting',
    icon: <Icons.SettingsRounded className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Faq',
        to: '/faq',
      },
      {
        component: CNavItem,
        name: 'App Setting',
        to: '/appsetting',
      },
      {
        component: CNavItem,
        name: 'Business Hour',
        to: '/businesshour',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Theme',
    to: '/theme',
    icon: <Icons.PaletteRounded className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Admin Theme',
        to: '/admin-theme',
      },
      {
        component: CNavItem,
        name: 'User Theme',
        to: '/usertheme',
      },
    ],
  },

  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
