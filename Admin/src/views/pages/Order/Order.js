import React from 'react'
import { CSpinner, CFormSelect } from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MUIDataTable from 'mui-datatables'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { Button, Switch } from '@mui/material'

import { getAllOrdersApi, updateOrderStatusApi } from 'src/redux/api/api' // Assume updateOrderStatusApi is added

const Order = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState([])

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await getAllOrdersApi()
      if (response.status === 200) {
        setOrders(response.data.info)
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
          const { _id, order_status } = orders[rowIndex]
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
        filter: false,
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
          <MUIDataTable title={'Orders'} data={orders} columns={columns} options={options} />
        </>
      )}
    </>
  )
}

export default Order
