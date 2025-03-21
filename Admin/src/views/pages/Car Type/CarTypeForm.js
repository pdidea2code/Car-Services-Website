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
} from '@coreui/react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { addCarTypeApi, editCarTypeApi } from '../../../redux/api/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const CarTypeForm = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()
  const onSubmit = async (data) => {
    try {
      const request = {
        name: data.name,
      }
      if (state) {
        request.id = state._id
      }
      const apiCall = state ? editCarTypeApi(request) : addCarTypeApi(request)
      const response = await apiCall
      if (response.status === 200) {
        navigate('/cartype')
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    if (state) {
      setValue('name', state.name)
    }
  }, [state])
  return (
    <>
      <ToastContainer />
      <CRow>
        <CCol md={8} sm={12}>
          <CCard>
            <CCardHeader>
              <CCardTitle>Car Type Form</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol xl={12} md={12}>
                  <CFormInput
                    type="text"
                    label="Car Type Name"
                    placeholder="Car Type Name"
                    {...register('name', { required: 'Car Type Name is required' })}
                    invalid={!!errors.name}
                  />
                  {errors.name && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.name.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={12} md={12} className="d-flex justify-content-end">
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

export default CarTypeForm
