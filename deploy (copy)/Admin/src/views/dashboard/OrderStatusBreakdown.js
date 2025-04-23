import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { CChartPie } from '@coreui/react-chartjs'
import '@coreui/coreui/dist/css/coreui.min.css'
import { getOrderStatusBreakdownApi } from '../../redux/api/api'
const OrderStatusBreakdown = () => {
  const [breakdownData, setBreakdownData] = useState({
    orderStatus: { pending: { count: 0 }, completed: { count: 0 }, cancelled: { count: 0 } },
    paymentStatus: {
      pending: { count: 0 },
      success: { count: 0 },
      failed: { count: 0 },
      refunded: { count: 0 },
    },
    paymentMode: { online: { count: 0 }, cod: { count: 0 } },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBreakdownData = async () => {
      try {
        const response = await getOrderStatusBreakdownApi()
        const result = response.data.info
        if (response.status === 200) {
          setBreakdownData(result)
        } else {
          setError('Failed to fetch order status breakdown')
        }
      } catch (err) {
        setError(err.message || 'Error fetching order status breakdown')
      } finally {
        setLoading(false)
      }
    }

    fetchBreakdownData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  // Data for Order Status Pie Chart
  const orderStatusChartData = {
    labels: ['Pending', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          breakdownData.orderStatus.pending.count,
          breakdownData.orderStatus.completed.count,
          breakdownData.orderStatus.cancelled.count,
        ],
        backgroundColor: ['#f0ad4e', '#5cb85c', '#d9534f'],
        hoverBackgroundColor: ['#f0ad4e', '#5cb85c', '#d9534f'],
      },
    ],
  }

  // Data for Payment Status Pie Chart
  const paymentStatusChartData = {
    labels: ['Pending', 'Success', 'Failed', 'Refunded'],
    datasets: [
      {
        data: [
          breakdownData.paymentStatus.pending.count,
          breakdownData.paymentStatus.success.count,
          breakdownData.paymentStatus.failed.count,
          breakdownData.paymentStatus.refunded.count,
        ],
        backgroundColor: ['#f0ad4e', '#5cb85c', '#d9534f', '#0275d8'],
        hoverBackgroundColor: ['#f0ad4e', '#5cb85c', '#d9534f', '#0275d8'],
      },
    ],
  }

  // Data for Payment Mode Pie Chart
  const paymentModeChartData = {
    labels: ['Online', 'Cash'],
    datasets: [
      {
        data: [breakdownData.paymentMode.online.count, breakdownData.paymentMode.cod.count],
        backgroundColor: ['#0275d8', '#5bc0de'],
        hoverBackgroundColor: ['#0275d8', '#5bc0de'],
      },
    ],
  }

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.raw || 0
            const datasetIndex = context.datasetIndex
            const total =
              datasetIndex === 0
                ? breakdownData.orderStatus.total
                : datasetIndex === 1
                ? breakdownData.paymentStatus.pending.count +
                  breakdownData.paymentStatus.success.count +
                  breakdownData.paymentStatus.failed.count +
                  breakdownData.paymentStatus.refunded.count
                : breakdownData.paymentMode.total
            const percentage = ((value / (total || 1)) * 100).toFixed(2)
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  return (
    <CRow className="mt-4">
      <CCol xs={12} lg={4}>
        <CCard>
          <CCardHeader>
            <h5>Order Status Breakdown</h5>
          </CCardHeader>
          <CCardBody>
            <CChartPie data={orderStatusChartData} options={chartOptions} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} lg={4}>
        <CCard>
          <CCardHeader>
            <h5>Payment Status Breakdown</h5>
          </CCardHeader>
          <CCardBody>
            <CChartPie data={paymentStatusChartData} options={chartOptions} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} lg={4}>
        <CCard>
          <CCardHeader>
            <h5>Payment Mode Breakdown</h5>
          </CCardHeader>
          <CCardBody>
            <CChartPie data={paymentModeChartData} options={chartOptions} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default OrderStatusBreakdown
