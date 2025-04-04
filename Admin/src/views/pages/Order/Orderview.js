import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CContainer, CCard, CCardBody, CCardTitle, CRow, CCol, CButton } from '@coreui/react'

const OrderView = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = state || {}

  return (
    <CContainer fluid style={{ marginTop: '20px' }}>
      <CCard>
        <CCardBody>
          <CCardTitle>Order Details</CCardTitle>
          <CRow>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Order ID:</strong> {order.order_id}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Service:</strong> {order.service_id?.name || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Car Type:</strong> {order.cartype_id?.name || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Time:</strong> {order.time}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Name:</strong> {order.name}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Email:</strong> {order.email}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Phone:</strong> {order.phone}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Car Name:</strong> {order.carname}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Car Number:</strong> {order.carnumber}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>City:</strong> {order.city}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Pincode:</strong> {order.pincode}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Colony:</strong> {order.colony || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>House No:</strong> {order.house_no || 'N/A'}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Service Amount:</strong> {order.service_amount}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Tax Amount:</strong> {order.tax_amount}
              </p>
            </CCol>
            {order.discount_amount > 0 && (
              <>
                <CCol xs={12} sm={6}>
                  <p>
                    <strong>Discount Amount:</strong> {order.discount_amount}
                  </p>
                </CCol>
                <CCol xs={12} sm={6}>
                  <p>
                    <strong>Promo Code:</strong> {order.promocode_id.code}
                  </p>
                </CCol>
              </>
            )}
            <CCol xs={12} sm={6}>
              <p>
                <strong>Total Amount:</strong> {order.total_amount}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Pickup and Drop:</strong> {order.pickupanddrop ? 'Yes' : 'No'}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Payment Mode:</strong> {order.paymentmode}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Payment Status:</strong> {order.paymentstatus}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Order Status:</strong> {order.order_status}
              </p>
            </CCol>
            <CCol xs={12} sm={6}>
              <p>
                <strong>Additional Info:</strong> {order.additionalinfo || 'N/A'}
              </p>
            </CCol>
          </CRow>
          <CButton
            style={{ marginTop: '20px', width: 'auto !important' }}
            className="submit-button"
            onClick={() => navigate('/order')} // Navigate back to order list
          >
            Back to Orders
          </CButton>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default OrderView
