import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardTitle,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CFormFeedback,
  CButton,
  CSpinner,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { addShowcaseApi, editShowcaseApi } from 'src/redux/api/api'

const GalleryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
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
          if (data[key][0] !== undefined) {
            formData.append(key, data[key][0])
          }
        } else {
          formData.append(key, data[key])
        }
      })
      if (state) {
        formData.append('id', state._id)
      }
      const apiCall = state ? editShowcaseApi(formData) : addShowcaseApi(formData)
      const response = await apiCall
      setIsLoading(false)
      toast.success('Gallery added successfully')
      if (response.status === 200) {
        navigate('/gallery')
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    if (state) {
      setImage(state.image)
    }
  }, [state])

  return (
    <div>
      <ToastContainer />
      <CRow>
        <CCol md={8} sm={12}>
          <CCard>
            <CCardHeader>
              <CCardTitle>Gallery Form</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol xl={12} md={12}>
                  <CFormLabel>
                    Image{' '}
                    <span className="errors" style={{ fontSize: '12px' }}>
                      {' '}
                      Only png, jpg, webp and jpeg image allow
                    </span>
                  </CFormLabel>
                  <CFormInput
                    type="file"
                    placeholder="Image"
                    {...register(
                      'image',
                      image ? { required: false } : { required: 'Image is required' },
                    )}
                    invalid={!!errors.image}
                    onChange={(e) => handleSingleImgChange(e)}
                  />
                  {errors.image && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.image.message}
                    </CFormFeedback>
                  )}
                </CCol>
                {image && (
                  <CCol xl={12} md={12}>
                    <img
                      style={{ width: 'auto', maxWidth: '100%', objectFit: 'cover' }}
                      src={image}
                      alt="image"
                    />
                  </CCol>
                )}
                <CCol xl={12} md={12} className="text-center">
                  <CButton disabled={isLoading} className="submit-button" type="submit">
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

export default GalleryForm
