import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  CFormInput,
  CFormFeedback,
  CForm,
  CCol,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CFormSelect,
  CFormLabel,
  CButton,
  CSpinner,
} from '@coreui/react'
import { getAllServiceApi, addAddonsApi, editAddonsApi } from '../../../redux/api/api'

const AddonsForm = () => {
  const { state } = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [service, setService] = useState([])
  const [image, setImage] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
  } = useForm()

  const navigate = useNavigate()

  const handleSingleImgChange = (e) => {
    const files = e.target.files[0]
    if (files) {
      const imageUrl = URL.createObjectURL(files)
      setImage(imageUrl)
      clearErrors('image')
    } else {
      setImage(null)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        if (key === 'image') {
          formData.append(key, data[key][0])
        } else {
          formData.append(key, data[key])
        }
      })
      if (state) {
        formData.append('id', state._id)
      }
      const apiCall = state ? editAddonsApi(formData) : addAddonsApi(formData)
      const response = await apiCall
      if (response.status === 200) {
        toast.success(response.data.message)
        navigate('/addons')
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Error submitting addons')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchService = async () => {
    try {
      const response = await getAllServiceApi()
      if (response.status === 200) {
        setService(response.data.info)
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Error fetching service')
    }
  }

  useEffect(() => {
    if (state) {
      setValue('name', state.name)
      setValue('price', state.price)
      setValue('time', state.time)
      setValue('serviceid', state.serviceid._id)

      setImage(state.image)
    }
  }, [state])

  useEffect(() => {
    fetchService()
  }, [])

  return (
    <div>
      <ToastContainer />
      <CRow>
        <CCol lg={8} md={12} sm={12}>
          <CCard>
            <CCardHeader className="formcardheader">
              <CCardTitle>Addons Form</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol xl={6} md={12}>
                  <CFormInput
                    type="text"
                    label="Addon Name"
                    placeholder="Addon Name"
                    {...register('name', { required: 'Addon Name is required' })}
                    invalid={!!errors.name}
                  />
                  {errors.name && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.name.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={6} md={12}>
                  <CFormInput
                    type="number"
                    label="Price"
                    placeholder="Price"
                    {...register('price', { required: 'Price is required' })}
                    invalid={!!errors.price}
                    min={1}
                  />
                  {errors.price && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.price.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={6} md={12}>
                  <CFormInput
                    type="number"
                    label="Time (in minutes)"
                    placeholder="Time"
                    {...register('time', { required: 'Time is required' })}
                    invalid={!!errors.time}
                    min={1}
                  />
                  {errors.time && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.time.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={6} md={12}>
                  <CFormSelect
                    label="Service"
                    {...register('serviceid', { required: 'Service is required' })}
                    invalid={!!errors.serviceid}
                    value={watch('serviceid')}
                  >
                    <option value="">Select Service</option>
                    {service.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </CFormSelect>
                  {errors.serviceid && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.serviceid.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={6} md={12}>
                  <CFormInput
                    type="file"
                    label="Image"
                    {...register(
                      'image',
                      image ? { required: false } : { required: 'Image is required' },
                    )}
                    onChange={(e) => handleSingleImgChange(e)}
                  />
                  {errors.image && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.image.message}
                    </CFormFeedback>
                  )}
                </CCol>
                {image && (
                  <CCol xl={6} md={12}>
                    <img
                      src={image}
                      alt="addon"
                      className="img-fluid mt-2"
                      style={{ maxWidth: '100%' }}
                    />
                  </CCol>
                )}
                <CCol xl={12} md={12} className="text-center">
                  <CButton disabled={isLoading} type="submit" className="submit-button">
                    {isLoading ? <CSpinner /> : 'Submit'}
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

export default AddonsForm
