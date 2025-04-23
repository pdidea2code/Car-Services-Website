import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CButton,
  CCardTitle,
  CFormCheck,
  CSpinner,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { editBusinessHourApi } from '../../../redux/api/api'

const Businesshourform = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      day: '',
      status: '',
      open: '',
      close: '',
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const newData = {
        id: state._id,
        day: data.day,
        is_closed: data.status,
        open: data.open,
        close: data.close,
      }
      const response = await editBusinessHourApi(newData)
      if (response.status === 200) {
        toast.success('Business hour updated successfully')
        navigate('/businesshour')
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage =
        error?.response?.data?.message ||
        (error.request ? 'Network error occurred' : 'An unexpected error occurred')
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (state) {
      setValue('day', state.day)
      setValue('status', state.is_closed.toString())
      setValue('open', state.open)
      setValue('close', state.close)
    }
  }, [state, setValue])

  useEffect(() => {
    if (!state) {
      navigate(-1)
    }
  }, [state, navigate])

  return (
    <div>
      <ToastContainer />
      <CRow>
        <CCol lg={8} md={12} sm={12}>
          <CCard>
            <CCardHeader className="formcardheader">
              <CCardTitle>Business Hour Form</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol xl={6} md={12}>
                  <CFormInput
                    type="text"
                    label="Day"
                    placeholder="Day"
                    {...register('day', { required: 'Day is required' })}
                    disabled
                  />
                  {errors.day && (
                    <CFormText className="text-danger">{errors.day.message}</CFormText>
                  )}
                </CCol>

                <CCol xl={6} md={12}>
                  <CFormLabel>Status</CFormLabel>
                  <div>
                    <CFormCheck
                      type="radio"
                      id="is_closed"
                      label="Closed"
                      value="true"
                      checked={watch('status') === 'true'}
                      {...register('status', { required: 'Status is required' })}
                    />
                    <CFormCheck
                      type="radio"
                      id="is_open"
                      label="Open"
                      value="false"
                      checked={watch('status') === 'false'}
                      {...register('status')}
                    />
                  </div>
                  {errors.status && (
                    <CFormText className="text-danger">{errors.status.message}</CFormText>
                  )}
                </CCol>
                {watch('status') === 'false' && (
                  <>
                    <CCol xl={6} md={12}>
                      <CFormInput
                        type="time"
                        label="Open"
                        placeholder="Open Time"
                        {...register('open', {
                          required: watch('status') === 'false' ? 'Open time is required' : false,
                          validate: (value) =>
                            watch('status') === 'false' && value >= watch('close')
                              ? 'Open time must be before close time'
                              : true,
                        })}
                        max={watch('close')}
                      />
                      {errors.open && (
                        <CFormText className="text-danger">{errors.open.message}</CFormText>
                      )}
                    </CCol>

                    <CCol xl={6} md={12}>
                      <CFormInput
                        type="time"
                        label="Close"
                        placeholder="Close Time"
                        {...register('close', {
                          required: watch('status') === 'false' ? 'Close time is required' : false,
                          validate: (value) =>
                            watch('status') === 'false' && value <= watch('open')
                              ? 'Close time must be after open time'
                              : true,
                        })}
                        min={watch('open')}
                      />
                      {errors.close && (
                        <CFormText className="text-danger">{errors.close.message}</CFormText>
                      )}
                    </CCol>
                  </>
                )}

                <CCol xl={12} className="text-center">
                  <CButton type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? <CSpinner size="sm" /> : 'Submit'}
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Businesshourform
