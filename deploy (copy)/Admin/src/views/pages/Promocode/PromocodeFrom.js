import { useForm } from 'react-hook-form'
import { ToastContainer } from 'react-toastify'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CCardTitle,
  CButton,
  CFormFeedback,
  CFormSelect,
} from '@coreui/react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { addPromocodeApi, editPromocodeApi } from 'src/redux/api/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const PromoCodeForm = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm()

  // Watch the values of discountType, minimumOrderAmount, and startDate
  const discountType = watch('discountType')
  const minimumOrderAmount = watch('minimumOrderAmount')
  const startDate = watch('startDate')

  // Function to generate random uppercase promo code
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    const length = 8 // You can adjust the length as needed
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    setValue('code', result)
  }

  const onSubmit = async (data) => {
    try {
      const request = {
        title: data.title,
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxUses: data.maxUses,
        startDate: data.startDate,
        expirationDate: data.expirationDate,
        minimumOrderAmount: data.minimumOrderAmount,
        isActive: data.isActive === 'true',
      }

      if (state) {
        request.id = state._id
      }

      const apiCall = state ? editPromocodeApi(request) : addPromocodeApi(request)
      const response = await apiCall

      if (response.status === 200) {
        navigate('/promocode')
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    if (state) {
      setValue('title', state.title)
      setValue('code', state.code)
      setValue('discountType', state.discountType)
      setValue('discountValue', state.discountValue)
      setValue('maxUses', state.maxUses)
      setValue('startDate', new Date(state.startDate).toISOString().split('T')[0])
      setValue('expirationDate', new Date(state.expirationDate).toISOString().split('T')[0])
      setValue('minimumOrderAmount', state.minimumOrderAmount)
      setValue('isActive', state.isActive.toString())
    }
  }, [state, setValue])

  return (
    <>
      <ToastContainer />
      <CRow>
        <CCol md={8} sm={12}>
          <CCard>
            <CCardHeader>
              <CCardTitle>Promo Code Form</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Title"
                    placeholder="Enter promo code title"
                    {...register('title', {
                      required: 'Title is required',
                      maxLength: { value: 50, message: 'Title cannot exceed 50 characters' },
                    })}
                    invalid={!!errors.title}
                  />
                  {errors.title && <CFormFeedback invalid>{errors.title.message}</CFormFeedback>}
                </CCol>

                <CCol md={6}>
                  <div className="d-flex align-items-end gap-2">
                    <div className="flex-grow-1">
                      <CFormInput
                        type="text"
                        label="Promo Code"
                        placeholder="Enter promo code"
                        {...register('code', {
                          required: 'Promo Code is required',
                          pattern: {
                            value: /^[A-Z0-9]+$/,
                            message: 'Only uppercase letters and numbers allowed',
                          },
                        })}
                        invalid={!!errors.code}
                      />
                      {errors.code && <CFormFeedback invalid>{errors.code.message}</CFormFeedback>}
                    </div>
                    <CButton color="secondary" onClick={generateRandomCode}>
                      Generate
                    </CButton>
                  </div>
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    label="Discount Type"
                    {...register('discountType', { required: 'Discount Type is required' })}
                    invalid={!!errors.discountType}
                  >
                    <option value="">Select Discount Type</option>
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED">Fixed Amount</option>
                  </CFormSelect>
                  {errors.discountType && (
                    <CFormFeedback invalid>{errors.discountType.message}</CFormFeedback>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="number"
                    label="Discount Value"
                    placeholder="Enter discount value"
                    {...register('discountValue', {
                      required: 'Discount Value is required',
                      min: { value: 0, message: 'Value must be positive' },
                      validate: {
                        percentageMax: (value) => {
                          if (discountType === 'PERCENTAGE') {
                            return (
                              parseFloat(value) <= 100 ||
                              'Discount Value cannot exceed 100 for Percentage discount'
                            )
                          }
                          return true
                        },
                        fixedMax: (value) => {
                          if (discountType === 'FIXED' && minimumOrderAmount) {
                            return (
                              parseFloat(value) <= parseFloat(minimumOrderAmount) ||
                              'Discount Value cannot be greater than Minimum Order Amount for Fixed discount'
                            )
                          }
                          return true
                        },
                      },
                    })}
                    invalid={!!errors.discountValue}
                  />
                  {errors.discountValue && (
                    <CFormFeedback invalid>{errors.discountValue.message}</CFormFeedback>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="number"
                    label="Max Uses (-1 for unlimited)"
                    placeholder="Enter max uses"
                    min={-1}
                    {...register('maxUses', {
                      required: 'Max Uses is required',
                      min: { value: -1, message: 'Minimum value is -1' },
                    })}
                    invalid={!!errors.maxUses}
                  />
                  {errors.maxUses && (
                    <CFormFeedback invalid>{errors.maxUses.message}</CFormFeedback>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label="Start Date"
                    {...register('startDate', { required: 'Start Date is required' })}
                    invalid={!!errors.startDate}
                  />
                  {errors.startDate && (
                    <CFormFeedback invalid>{errors.startDate.message}</CFormFeedback>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label="Expiration Date"
                    {...register('expirationDate', {
                      required: 'Expiration Date is required',
                      validate: (value) =>
                        !startDate ||
                        new Date(value) >= new Date(startDate) ||
                        'Expiration Date must be on or after Start Date',
                    })}
                    invalid={!!errors.expirationDate}
                  />
                  {errors.expirationDate && (
                    <CFormFeedback invalid>{errors.expirationDate.message}</CFormFeedback>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="number"
                    label="Minimum Order Amount"
                    placeholder="Enter minimum order amount"
                    {...register('minimumOrderAmount', {
                      required: 'Minimum Order Amount is required',
                      min: { value: 0, message: 'Value must be positive' },
                    })}
                    invalid={!!errors.minimumOrderAmount}
                  />
                  {errors.minimumOrderAmount && (
                    <CFormFeedback invalid>{errors.minimumOrderAmount.message}</CFormFeedback>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    label="Status"
                    {...register('isActive', { required: 'Status is required' })}
                    invalid={!!errors.isActive}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </CFormSelect>
                  {errors.isActive && (
                    <CFormFeedback invalid>{errors.isActive.message}</CFormFeedback>
                  )}
                </CCol>

                <CCol xl={12} className="d-flex justify-content-end">
                  <CButton type="submit" className="submit-button">
                    Submit
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default PromoCodeForm
