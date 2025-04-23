import React from 'react'
import { CSpinner, CFormSelect } from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MUIDataTable from 'mui-datatables'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { Button, Switch } from '@mui/material'

import {
  getAllOrdersApi,
  updateOrderStatusApi,
  getUpcomingOrdersApi,
  getPastOrdersApi,
  getTodayOrdersApi,
} from 'src/redux/api/api' // Assume updateOrderStatusApi is added

const Order = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [tableTitle, setTableTitle] = useState('Orders')

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await getAllOrdersApi()
      if (response.status === 200) {
        setOrders(response.data.info)
        setTableTitle('Orders')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUpcomingOrders = async () => {
    try {
      setIsLoading(true)

      const response = await getUpcomingOrdersApi()
      if (response.status === 200) {
        setOrders(response.data.info)
        setTableTitle('Upcoming Orders')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPastOrders = async () => {
    try {
      setIsLoading(true)

      const response = await getPastOrdersApi()
      if (response.status === 200) {
        setOrders(response.data.info)
        setTableTitle('Past Orders')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }
  const fetchTodayOrders = async () => {
    try {
      setIsLoading(true)

      const response = await getTodayOrdersApi()
      if (response.status === 200) {
        setOrders(response.data.info)
        setTableTitle('Today Orders')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatusApi({ id: orderId, order_status: newStatus })
      if (response.status === 200) {
        setOrders((prevState) =>
          prevState.map((order) =>
            order._id === orderId ? { ...order, order_status: newStatus } : order,
          ),
        )
        toast.success('Order status updated successfully')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update order status')
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const columns = [
    {
      name: 'order_id',
      label: 'Order ID',
    },
    {
      name: 'service_id',
      label: 'Service',
      options: {
        customBodyRender: (value) => value?.name || 'N/A',
      },
    },
    {
      name: 'cartype_id',
      label: 'Car Type',
      options: {
        customBodyRender: (value) => value?.name || 'N/A',
      },
    },
    {
      name: 'date',
      label: 'Date',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString(),
      },
    },
    {
      name: 'time',
      label: 'Time',
    },
    {
      name: 'total_amount',
      label: 'Total Amount',
    },
    {
      name: 'order_status',
      label: 'Order Status',
      options: {
        customBodyRender: (value, { rowIndex }) => {
          const { _id, order_status, paymentstatus, paymentmode } = orders[rowIndex]
          if (paymentstatus === 'FAILED') {
            return <span className="text-danger">Payment Failed</span>
          }
          if (paymentstatus === 'PENDING' && paymentmode === 'ONLINE') {
            return <span className="text-warning">Payment Pending</span>
          }

          return (
            <CFormSelect
              value={order_status}
              onChange={(e) => handleUpdateStatus(_id, e.target.value)}
              style={{ width: '120px' }}
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </CFormSelect>
          )
        },
      },
    },
    {
      name: '_id',
      label: 'Action',
      options: {
        sort: false,
        customBodyRender: (value, { rowIndex }) => {
          const data = orders[rowIndex]
          return (
            <Button className="editButton" onClick={() => navigate('/order/view', { state: data })}>
              <Icons.VisibilityRounded />
            </Button>
          )
        },
      },
    },
  ]

  const options = {
    selectableRows: 'none',
    responsive: 'standard',
    tableBodyHeight: 'auto',
  }

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="spinner-color" />
        </div>
      ) : (
        <>
          <ToastContainer />
          <Button
            className="add-button mb-4 mx-4"
            variant="contained"
            onClick={() => fetchOrders()}
          >
            Fetch Orders
          </Button>
          <Button
            className="add-button mb-4 mx-4"
            variant="contained"
            onClick={() => fetchTodayOrders()}
          >
            Fetch Today Orders
          </Button>
          <Button
            className="add-button mb-4 mx-4"
            variant="contained"
            onClick={() => fetchUpcomingOrders()}
          >
            Fetch Upcoming Orders
          </Button>
          <Button
            className="add-button mb-4 mx-4"
            variant="contained"
            onClick={() => fetchPastOrders()}
          >
            Fetch Past Orders
          </Button>
          <MUIDataTable title={tableTitle} data={orders} columns={columns} options={options} />
        </>
      )}
    </>
  )
}

export default Order
