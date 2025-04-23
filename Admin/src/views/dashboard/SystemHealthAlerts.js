import React, { useState, useEffect } from 'react'
import { CContainer, CSpinner, CCard, CCardBody, CCardTitle, CAlert } from '@coreui/react'
import { getSystemHealthAlertsApi } from '../../redux/api/api'

const SystemHealthAlerts = () => {
  const [loading, setLoading] = useState(true)
  const [alertsData, setAlertsData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await getSystemHealthAlertsApi()
        setAlertsData(response.data.info)
      } catch (error) {
        console.error('Error fetching system health alerts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <CContainer className="my-4">
      <h1 className="mb-4">System Health and Alerts</h1>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '50vh' }}
        >
          <CSpinner color="primary" style={{ width: '4rem', height: '4rem' }} />
        </div>
      ) : (
        <div className="row">
          <div className="col-md-12 mb-4">
            <CCard>
              <CCardBody>
                <CCardTitle>System Alerts</CCardTitle>
                {alertsData ? (
                  <>
                    <CAlert color="warning" className="d-flex align-items-center">
                      <span role="img" aria-label="warning" className="me-2">
                        ⚠️
                      </span>
                      {alertsData.pendingReviews.message}
                    </CAlert>
                    <CAlert color="danger" className="d-flex align-items-center">
                      <span role="img" aria-label="alert" className="me-2">
                        🚨
                      </span>
                      {alertsData.inactiveServices.message}
                    </CAlert>
                    <CAlert color="info" className="d-flex align-items-center">
                      <span role="img" aria-label="info" className="me-2">
                        ℹ️
                      </span>
                      {alertsData.expiredPromoCodes.message}
                    </CAlert>
                    <CAlert color="secondary" className="d-flex align-items-center">
                      <span role="img" aria-label="content" className="me-2">
                        📩
                      </span>
                      {alertsData.unseenContent.message}
                    </CAlert>
                  </>
                ) : (
                  <CAlert color="danger">No alerts data available</CAlert>
                )}
              </CCardBody>
            </CCard>
          </div>
        </div>
      )}
    </CContainer>
  )
}

export default SystemHealthAlerts
