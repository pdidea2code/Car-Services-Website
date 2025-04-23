import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CheckCircle, Cancel } from '@mui/icons-material'
import '@coreui/coreui/dist/css/coreui.min.css'
import { getRecentActivityApi } from '../../redux/api/api'
const RecentActivity = () => {
  const [activityData, setActivityData] = useState({
    orders: [],
    todayOrders: [],
    users: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await getRecentActivityApi()
        const result = response.data.info

        if (response.status === 200) {
          // Filter todayOrders to ensure only today's date (optional, based on your preference)
          const today = new Date().toISOString().split('T')[0] // e.g., "2025-04-11"
          const filteredTodayOrders = response.data.info.todayOrders.filter(
            (order) => new Date(order.date).toISOString().split('T')[0] === today,
          )

          setActivityData({
            orders: result.orders,
            todayOrders: filteredTodayOrders, // Use filtered or response.data.info.todayOrders for all
            users: result.users,
          })
        } else {
          setError('Failed to fetch recent activity')
        }
      } catch (err) {
        setError(err.message || 'Error fetching recent activity')
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <CRow className="mt-4">
      {/* Today's Orders */}
      <CCol xs={12} className="mb-4">
        <CCard>
          <CCardHeader>
            <h5>Today{"'"}s Orders</h5>
          </CCardHeader>
          <CCardBody>
            {activityData.todayOrders.length === 0 ? (
              <p>No orders placed today.</p>
            ) : (
              <CTable responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Order ID</CTableHeaderCell>
                    <CTableHeaderCell>Customer</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Payment</CTableHeaderCell>
                    <CTableHeaderCell>Time</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {activityData.todayOrders.map((order) => (
                    <CTableRow key={order._id}>
                      <CTableDataCell>{order.order_id}</CTableDataCell>
                      <CTableDataCell>{order.name}</CTableDataCell>
                      <CTableDataCell>
                        {order.total_amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </CTableDataCell>
                      <CTableDataCell>{order.order_status}</CTableDataCell>
                      <CTableDataCell>{order.paymentstatus}</CTableDataCell>
                      <CTableDataCell>{order.time}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Recent Orders */}
      <CCol xs={12} lg={6}>
        <CCard>
          <CCardHeader>
            <h5>Recent Orders</h5>
          </CCardHeader>
          <CCardBody>
            <CTable responsive hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Order ID</CTableHeaderCell>
                  <CTableHeaderCell>Customer</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Payment</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {activityData.orders.map((order) => (
                  <CTableRow key={order._id}>
                    <CTableDataCell>{order.order_id}</CTableDataCell>
                    <CTableDataCell>{order.name}</CTableDataCell>
                    <CTableDataCell>
                      {order.total_amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </CTableDataCell>
                    <CTableDataCell>{order.order_status}</CTableDataCell>
                    <CTableDataCell>{order.paymentstatus}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* New Users */}
      <CCol xs={12} lg={6}>
        <CCard>
          <CCardHeader>
            <h5>New Users</h5>
          </CCardHeader>
          <CCardBody>
            <CTable responsive hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Verified</CTableHeaderCell>
                  <CTableHeaderCell>Registered</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {activityData.users.map((user) => (
                  <CTableRow key={user._id}>
                    <CTableDataCell>{user.name}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>
                      {user.isverified ? <CheckCircle color="success" /> : <Cancel color="error" />}
                    </CTableDataCell>
                    <CTableDataCell>{new Date(user.createdAt).toLocaleDateString()}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default RecentActivity
