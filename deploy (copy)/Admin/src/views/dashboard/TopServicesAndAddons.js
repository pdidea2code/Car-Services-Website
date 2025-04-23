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
import '@coreui/coreui/dist/css/coreui.min.css'
import { getTopServicesAndAddonsApi } from '../../redux/api/api'
const TopServicesAndAddons = () => {
  const [data, setData] = useState({ topServices: [], topAddons: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopServicesAndAddons = async () => {
      try {
        const response = await getTopServicesAndAddonsApi()
        const result = response.data.info

        if (response.status === 200) {
          setData(result)
        } else {
          setError('Failed to fetch top services and addons')
        }
      } catch (err) {
        setError(err.message || 'Error fetching top services and addons')
      } finally {
        setLoading(false)
      }
    }

    fetchTopServicesAndAddons()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <CRow className="mt-4">
      {/* Top Services */}
      <CCol xs={12} lg={6}>
        <CCard>
          <CCardHeader>
            <h5>Top Services</h5>
          </CCardHeader>
          <CCardBody>
            {data.topServices.length === 0 ? (
              <p>No services found.</p>
            ) : (
              <CTable responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Orders</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.topServices.map((service) => (
                    <CTableRow key={service._id}>
                      <CTableDataCell>{service.name}</CTableDataCell>
                      <CTableDataCell>
                        {service.price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </CTableDataCell>
                      <CTableDataCell>{service.count}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Top Addons */}
      <CCol xs={12} lg={6}>
        <CCard>
          <CCardHeader>
            <h5>Top Addons</h5>
          </CCardHeader>
          <CCardBody>
            {data.topAddons.length === 0 ? (
              <p>No addons found.</p>
            ) : (
              <CTable responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Orders</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.topAddons.map((addon) => (
                    <CTableRow key={addon._id}>
                      <CTableDataCell>{addon.name}</CTableDataCell>
                      <CTableDataCell>
                        {addon.price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </CTableDataCell>
                      <CTableDataCell>{addon.count}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default TopServicesAndAddons
