// ServiceView.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardContent, Typography, Grid, Divider, Box } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getServiceByIdApi } from 'src/redux/api/api'
import { CSpinner } from '@coreui/react'

const ServiceView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [serviceData, setService] = useState(null)

  const fetchService = async () => {
    setIsLoading(true)
    try {
      const response = await getServiceByIdApi({ id })
      if (response.status === 200) {
        setService(response.data.info)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchService()
  }, [])

  // Calculate order statistics
  const calculateOrderStats = () => {
    if (!serviceData?.order)
      return { pendingOrders: 0, totalIncome: 0, totalDiscount: 0, totalTax: 0 }

    const pendingOrders = serviceData.order.reduce((count, order) => {
      if (
        order.order_status === 'PENDING' &&
        ((order.paymentmode === 'ONLINE' && order.paymentstatus === 'SUCCESS') ||
          (order.paymentmode === 'COD' && order.paymentstatus === 'PENDING'))
      ) {
        return count + 1
      }
      return count
    }, 0)

    const { totalIncome, totalDiscount, totalTax } = serviceData.order.reduce(
      (acc, order) => {
        if (order.paymentstatus === 'SUCCESS') {
          acc.totalIncome += order.total_amount || 0
          acc.totalDiscount += order.discount_amount || 0
          acc.totalTax += order.tax_amount || 0
        }
        return acc
      },
      { totalIncome: 0, totalDiscount: 0, totalTax: 0 },
    )

    return {
      pendingOrders,
      totalIncome: totalIncome.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalTax: totalTax.toFixed(2),
    }
  }

  const { pendingOrders, totalIncome, totalDiscount, totalTax } = calculateOrderStats()

  // Addons table columns
  const addonColumns = [
    { name: 'name', label: 'Name' },
    {
      name: 'image',
      label: 'Image',
      options: {
        customBodyRender: (value) => (
          <img src={value} alt="addon" style={{ width: '100px', height: 'auto' }} />
        ),
      },
    },
    { name: 'price', label: 'Price' },
    { name: 'time', label: 'Time (minutes)' },
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRender: (value) => <span>{value ? 'Active' : 'Inactive'}</span>,
      },
    },
    {
      name: 'createdAt',
      label: 'Created At',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString(),
      },
    },
  ]

  // Orders table columns
  const orderColumns = [
    { name: 'order_id', label: 'Order ID' },
    { name: 'name', label: 'Customer Name' },
    { name: 'email', label: 'Email' },
    { name: 'phone', label: 'Phone' },
    {
      name: 'date',
      label: 'Date',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString(),
      },
    },
    { name: 'time', label: 'Time' },
    { name: 'total_time', label: 'Total Time (minutes)' },
    { name: 'service_amount', label: 'Service Amount' },
    { name: 'tax_amount', label: 'Tax' },
    { name: 'discount_amount', label: 'Discount' },
    { name: 'total_amount', label: 'Total Amount' },
    { name: 'paymentstatus', label: 'Payment Status' },
    { name: 'order_status', label: 'Order Status' },
    { name: 'paymentmode', label: 'Payment Mode' },
    { name: 'carname', label: 'Car Name' },
    { name: 'carnumber', label: 'Car Number' },
    { name: 'city', label: 'City' },
  ]

  // Reviews table columns
  const reviewColumns = [
    { name: 'name', label: 'Customer Name' },
    { name: 'email', label: 'Email' },
    { name: 'designation', label: 'Designation' },
    { name: 'review', label: 'Review' },
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRender: (value) => <span>{value ? 'Active' : 'Inactive'}</span>,
      },
    },
    {
      name: 'createdAt',
      label: 'Created At',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString(),
      },
    },
    {
      name: 'order_id',
      label: 'Order ID',
    },
  ]

  const tableOptions = {
    selectableRows: 'none',
    responsive: 'standard',
    print: false,
    download: true,
    filter: true,
    search: true,
    pagination: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
    jumpToPage: true,
  }

  const reviewTableOptions = {
    selectableRows: 'none',
    responsive: 'standard',
    print: false,
    download: true,
    filter: true,
    search: true,
    pagination: true,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20],
    jumpToPage: true,
  }

  return (
    <div className="container p-4">
      <ToastContainer />
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : (
        <>
          <Button
            className="add-button"
            variant="contained"
            onClick={() => navigate('/service')}
            style={{ marginBottom: '20px' }}
          >
            Back to Services
          </Button>

          {/* Service Details Card */}
          {serviceData && (
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {serviceData.name}
                </Typography>
                <Divider style={{ marginBottom: '20px' }} />

                <Grid container spacing={3}>
                  {/* Left Column: Text Details */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Basic Information
                    </Typography>
                    <Typography variant="body1">
                      <strong>Title:</strong> {serviceData.title}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Price:</strong> {serviceData.price}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Time:</strong> {serviceData.time} minutes
                    </Typography>
                    <Typography variant="body1">
                      <strong>Status:</strong> {serviceData.status ? 'Active' : 'Inactive'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Created At:</strong>{' '}
                      {new Date(serviceData.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Updated At:</strong>{' '}
                      {new Date(serviceData.updatedAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Is Deleted:</strong> {serviceData.isDeleted ? 'Yes' : 'No'}
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                      Description
                    </Typography>
                    <Typography variant="body1">{serviceData.description}</Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                      Included Services
                    </Typography>
                    <ul>
                      {serviceData.include?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                      Why Choose This Service
                    </Typography>
                    <Typography variant="body1">
                      <strong>Title:</strong> {serviceData.whyChooseqTitle}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '10px' }}>
                      {serviceData.whyChooseqDescription}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '10px' }}>
                      <strong>Includes:</strong>
                    </Typography>
                    <ul>
                      {serviceData.whyChooseqinclude?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </Grid>

                  {/* Right Column: Images */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Images
                    </Typography>
                    <div style={{ marginBottom: '20px' }}>
                      <Typography variant="body1">Service Image:</Typography>
                      <img
                        src={serviceData.image}
                        alt="Service"
                        style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                      />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <Typography variant="body1">Icon Image:</Typography>
                      <img
                        src={serviceData.iconimage}
                        alt="Icon"
                        style={{ maxWidth: '100px', height: 'auto', marginTop: '10px' }}
                      />
                    </div>
                    <div>
                      <Typography variant="body1">Why Choose Image:</Typography>
                      <img
                        src={serviceData.whyChooseqImage}
                        alt="Why Choose"
                        style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                      />
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Addons Table */}
          {serviceData && (
            <Card style={{ marginTop: '30px' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Addons
                </Typography>
                <MUIDataTable
                  title="Service Addons"
                  data={serviceData.addon}
                  columns={addonColumns}
                  options={tableOptions}
                />
              </CardContent>
            </Card>
          )}

          {/* Orders Table */}
          {serviceData && (
            <Card style={{ marginTop: '30px' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Orders
                </Typography>
                <MUIDataTable
                  title="Service Orders"
                  data={serviceData.order}
                  columns={orderColumns}
                  options={tableOptions}
                />
                {/* Order Statistics */}
                <Box
                  sx={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '20px',
                  }}
                >
                  <Typography variant="body1">
                    <strong>Pending Orders:</strong> {pendingOrders}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Income:</strong> {totalIncome}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Discount:</strong> {totalDiscount}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Tax:</strong> {totalTax}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Reviews Table */}
          {serviceData && (
            <Card style={{ marginTop: '30px', marginBottom: '30px' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Reviews
                </Typography>
                <MUIDataTable
                  title="Service Reviews"
                  data={serviceData.review}
                  columns={reviewColumns}
                  options={reviewTableOptions}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default ServiceView
