import { getAllPopupImageApi, updatePopupImageApi } from '../../../redux/api/api'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'
import {
  CForm,
  CFormInput,
  CFormFeedback,
  CButton,
  CCol,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CFormSwitch,
} from '@coreui/react'
const Popupimage = () => {
  const [popupimage, setPopupimage] = useState({})
  const [image, setImage] = useState('')
  const [mobileimage, setMobileimage] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm()

  const fetchPopupimage = async () => {
    try {
      const res = await getAllPopupImageApi()
      if (res.data.status === 200) {
        //
        setPopupimage(res.data.info)
        setImage(res.data.info.image)
        setMobileimage(res.data.info.mobileimage)
        setValue('status', res.data.info.status)
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message)
    }
  }

  const handleSingleImgChange = (e, name) => {
    const files = e.target.files[0]

    if (files) {
      const imageUrl = URL.createObjectURL(files)
      if (name === 'image') {
        setImage(imageUrl)
      } else {
        setMobileimage(imageUrl)
      }

      clearErrors(name)
    } else {
      if (name === 'image') {
        setImage(null)
      } else {
        setMobileimage(null)
      }
    }
  }
  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        if (key === 'image') {
          if (data[key][0] !== undefined) {
            formData.append(key, data[key][0])
          }
        } else if (key === 'mobileimage') {
          if (data[key][0] !== undefined) {
            formData.append(key, data[key][0])
          }
        } else {
          formData.append(key, data[key])
        }
      })
      formData.append('id', popupimage._id)
      const res = await updatePopupImageApi(formData)
      if (res.data.status === 200) {
        toast.success('Updated Successfully')
        fetchPopupimage()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    fetchPopupimage()
  }, [])
  return (
    <div>
      <ToastContainer />
      <CRow>
        <CCol md={12} sm={12}>
          <CCard>
            <CCardHeader className="formcardheader">
              <CCardTitle>City Form</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol xl={12} md={12}>
                  <h5>Visible</h5>
                  <CFormSwitch
                    id="custom-switch"
                    {...register('status')}
                    invalid={!!errors.status}
                    style={{ height: '20px', width: '50px' }}
                  />
                  {errors.status && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.status.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={12} md={12}>
                  <h5>Desktop Image</h5>
                  <CFormInput
                    type="file"
                    name="image"
                    placeholder="Image"
                    {...register(
                      'image',
                      image ? { required: false } : { required: 'Image is required' },
                    )}
                    invalid={!!errors.image}
                    onChange={(e) => handleSingleImgChange(e, 'image')}
                  />
                  {errors.image && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.image.message}
                    </CFormFeedback>
                  )}
                </CCol>
                {image && (
                  <CCol xl={12} md={12} className="text-center">
                    <h5>Desktop Image</h5>
                    <img
                      src={image}
                      alt="popupimage"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </CCol>
                )}
                <CCol xl={12} md={12}>
                  <h5>Mobile Image</h5>
                  <CFormInput
                    type="file"
                    name="mobileimage"
                    placeholder="Mobile Image"
                    {...register(
                      'mobileimage',
                      mobileimage ? { required: false } : { required: 'Mobile Image is required' },
                    )}
                    invalid={!!errors.mobileimage}
                    onChange={(e) => handleSingleImgChange(e, 'mobileimage')}
                  />
                  {errors.mobileimage && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.mobileimage.message}
                    </CFormFeedback>
                  )}
                </CCol>
                {mobileimage && (
                  <CCol xl={12} md={12} className="text-center">
                    <h5>Mobile Image</h5>
                    <img
                      src={mobileimage}
                      alt="popupimage"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </CCol>
                )}

                <CCol xl={12} md={12} className="text-center">
                  <CButton type="submit" className="submit-button">
                    Submit
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
export default Popupimage
