import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { ShoppingCart, AttachMoney, People, RoomService, LocalOffer } from '@mui/icons-material'
import '@coreui/coreui/dist/css/coreui.min.css'
import { getKpiMetricsApi } from '../../redux/api/api'

const KPIDashboard = () => {
  const [kpiData, setKpiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch KPI data from API
  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const response = await getKpiMetricsApi()
        const result = response.data.info
        if (response.status === 200) {
          setKpiData(result)
        } else {
          setError('Failed to fetch KPI data')
        }
      } catch (err) {
        setError('Error fetching KPI data')
      } finally {
        setLoading(false)
      }
    }

    fetchKPIData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="container-fluid p-4">
      <CRow className="g-4">
        {/* Total Orders Card */}
        <CCol xs={12} sm={6} lg={4}>
          <CCard className="text-white bg-primary h-100">
            <CCardBody className="d-flex align-items-center">
              <ShoppingCart sx={{ fontSize: 40, mr: 2 }} />
              <div>
                <h5>Total Orders</h5>
                <h3>{kpiData?.orders?.total?.toLocaleString()}</h3>
                <small>
                  Pending: {kpiData?.orders?.pending} | Completed: {kpiData?.orders?.completed} |
                  Cancelled: {kpiData?.orders?.cancelled}
                </small>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Total Revenue Card */}
        <CCol xs={12} sm={6} lg={4}>
          <CCard className="text-white bg-success h-100">
            <CCardBody className="d-flex align-items-center">
              <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
              <div>
                <h5>Total Revenue</h5>
                <h3>{kpiData?.revenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Total Users Card */}
        <CCol xs={12} sm={6} lg={4}>
          <CCard className="text-white bg-info h-100">
            <CCardBody className="d-flex align-items-center">
              <People sx={{ fontSize: 40, mr: 2 }} />
              <div>
                <h5>Total Users</h5>
                <h3>{kpiData?.users?.total?.toLocaleString()}</h3>
                <small>Verified: {kpiData?.users?.verified}</small>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Total Services Card */}
        <CCol xs={12} sm={6} lg={4}>
          <CCard className="text-white bg-warning h-100">
            <CCardBody className="d-flex align-items-center">
              <RoomService sx={{ fontSize: 40, mr: 2 }} />
              <div>
                <h5>Active Services</h5>
                <h3>{kpiData?.services?.toLocaleString()}</h3>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Promo Code Usage Card */}
        <CCol xs={12} sm={6} lg={4}>
          <CCard className="text-white bg-danger h-100">
            <CCardBody className="d-flex align-items-center">
              <LocalOffer sx={{ fontSize: 40, mr: 2 }} />
              <div>
                <h5>Promo Code Activity</h5>
                <h3>{kpiData?.promo?.totalUses?.toLocaleString()} Uses</h3>
                <small>
                  Total Discount:
                  {kpiData?.promo?.totalDiscountAmount?.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </small>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default KPIDashboard
