import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CCard,
  CCardBody,
  CCardTitle,
  CRow,
  CCol,
  CButton,
  CBadge,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'

const OrderView = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = state || {}

  // Extract fields with fallbacks
  const userEmail = order.user_id?.email || 'N/A'
  const serviceId = order.service_id?._id || 'N/A'
  const serviceName = order.service_id?.name || 'N/A'
  const addonDetails = order.addons_id?.length > 0 ? order.addons_id : []
  const promoCodeId = order.promocode_id?._id || 'N/A'
  const promoCode = order.promocode_id?.code || 'N/A'
  const carTypeName = order.cartype_id?.name || 'N/A'
  const formattedDate = order.date ? new Date(order.date).toLocaleDateString() : 'N/A'

  return (
    <CContainer fluid style={{ marginTop: '20px' }}>
      <CCard>
        <CCardBody>
          <CCardTitle>Order Details (Admin View)</CCardTitle>

          {/* Section 1: Order Overview */}
          <h5 className="mt-4">Order Overview</h5>
          <CRow className="mb-3">
            <CCol xs={12} md={4}>
              <p>
                <strong>Order ID:</strong> <CBadge color="info">{order.order_id || 'N/A'}</CBadge>
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>User Email:</strong> <span style={{ color: '#2eb85c' }}>{userEmail}</span>
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Promo Code ID:</strong> <CBadge color="warning">{promoCodeId}</CBadge>
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Promo Code:</strong> {promoCode}
              </p>
            </CCol>
          </CRow>
          <hr />

          {/* Section 2: Service and Add-ons */}
          <h5>Service and Add-ons</h5>
          <CRow className="mb-3">
            <CCol xs={12} md={6}>
              <h6>Service Details</h6>
              <CListGroup>
                <CListGroupItem>
                  <strong>ID:</strong> <CBadge color="primary">{serviceId}</CBadge>
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Name:</strong> {serviceName}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Price:</strong> {order.service_id?.price || 0}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Time:</strong> {order.service_id?.time || 'N/A'} minutes
                </CListGroupItem>
              </CListGroup>
            </CCol>
            <CCol xs={12} md={6}>
              <h6>Add-ons Details</h6>
              {addonDetails.length > 0 ? (
                <CListGroup>
                  {addonDetails.map((addon, index) => (
                    <CListGroupItem key={index}>
                      <strong>ID:</strong> <CBadge color="secondary">{addon._id}</CBadge>
                      <br />
                      <strong>Name:</strong> {addon.name}
                      <br />
                      <strong>Price:</strong> {addon.price || 0}
                      <br />
                      <strong>Time:</strong> {addon.time || 'N/A'} minutes
                    </CListGroupItem>
                  ))}
                </CListGroup>
              ) : (
                <p>No add-ons selected</p>
              )}
            </CCol>
          </CRow>
          <hr />

          {/* Section 3: Car Details */}
          <h5>Car Details</h5>
          <CRow className="mb-3">
            <CCol xs={12} md={4}>
              <p>
                <strong>Car Type:</strong> {carTypeName}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Car Name:</strong> {order.carname || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Car Number:</strong> {order.carnumber || 'N/A'}
              </p>
            </CCol>
          </CRow>
          <hr />

          {/* Section 4: Pickup and Drop Details */}
          <h5>Pickup and Drop Details</h5>
          <CRow className="mb-3">
            <CCol xs={12} md={4}>
              <p>
                <strong>Pickup and Drop:</strong> {order.pickupanddrop ? 'Yes' : 'No'}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Date:</strong> {formattedDate}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Time:</strong> {order.time || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Total Time:</strong> {order.total_time || 'N/A'} minutes
              </p>
            </CCol>
          </CRow>
          <hr />

          {/* Section 5: Customer Details */}
          <h5>Customer Details</h5>
          <CRow className="mb-3">
            <CCol xs={12} md={4}>
              <p>
                <strong>Name:</strong> {order.name || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Phone:</strong> {order.phone || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Email:</strong> {order.email || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>City:</strong> {order.city || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Pincode:</strong> {order.pincode || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Colony:</strong> {order.colony || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>House No:</strong> {order.house_no || 'N/A'}
              </p>
            </CCol>
          </CRow>
          <hr />

          {/* Section 6: Payment Details */}
          <h5>Payment Details</h5>
          <CRow className="mb-3">
            <CCol xs={12} md={4}>
              <p>
                <strong>Service Amount:</strong> {order.service_amount || 0}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Tax Amount:</strong> {order.tax_amount || 0}
              </p>
            </CCol>
            {order.discount_amount > 0 && (
              <CCol xs={12} md={4}>
                <p>
                  <strong>Discount Amount:</strong> {order.discount_amount}
                </p>
              </CCol>
            )}
            <CCol xs={12} md={4}>
              <p>
                <strong>Total Amount:</strong> {order.total_amount || 0}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Payment Mode:</strong> {order.paymentmode || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Payment Status:</strong>{' '}
                <CBadge
                  color={
                    order.paymentstatus === 'SUCCESS'
                      ? 'success'
                      : order.paymentstatus === 'FAILED'
                      ? 'danger'
                      : 'warning'
                  }
                >
                  {order.paymentstatus || 'N/A'}
                </CBadge>
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Order Status:</strong>{' '}
                <CBadge
                  color={
                    order.order_status === 'PENDING'
                      ? 'warning'
                      : order.order_status === 'CANCELLED'
                      ? 'danger'
                      : 'success'
                  }
                >
                  {order.order_status || 'N/A'}
                </CBadge>
              </p>
            </CCol>
            <CCol xs={12} md={4}>
              <p>
                <strong>Payment Intent ID:</strong> {order.paymentIntentId || 'N/A'}
              </p>
            </CCol>
          </CRow>
          <hr />

          {/* Section 7: Additional Info */}
          <h5>Additional Info</h5>
          <CRow className="mb-3">
            <CCol xs={12}>
              <p>{order.additionalinfo || 'N/A'}</p>
            </CCol>
          </CRow>

          {/* Action Buttons */}
          <div style={{ marginTop: '20px' }}>
            <CButton
              style={{ width: 'fit-content' }}
              className="me-2 submit-button"
              onClick={() => navigate('/order')}
            >
              Back to Orders
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default OrderView
