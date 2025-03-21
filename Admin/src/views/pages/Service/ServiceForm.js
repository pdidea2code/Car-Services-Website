import { useForm, useFieldArray } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormTextarea,
  CFormLabel,
  CButton,
  CSpinner,
} from '@coreui/react'
import { addServiceApi, editServiceApi } from 'src/redux/api/api'

const ServiceForm = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
    reset,
    setError,
    clearErrors,
  } = useForm()
  const { state } = useLocation({
    defaultValues: {
      name: '',
      title: '',
      description: '',
      image: '',
      price: '',
      time: '',
      include: Array(1).fill(''),
      whyChooseqImage: '',
      whyChooseqTitle: '',
      whyChooseqDescription: '',
      whyChooseqinclude: Array(1).fill(''),
      status: true,
    },
  })
  const {
    fields: includeFields,
    append: appendInclude,
    remove: removeInclude,
  } = useFieldArray({ control, name: 'include' })

  const {
    fields: whyChooseFields,
    append: appendWhyChoose,
    remove: removeWhyChoose,
  } = useFieldArray({ control, name: 'whyChooseqinclude' })

  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState('')
  const [whyChooseqImage, setWhyChooseqImage] = useState('')
  const [iconimage, setIconimage] = useState('')
  const handleAddInclude = () => {
    appendInclude('')
    clearErrors('include')
  }

  const handleAddWhyChoose = () => {
    appendWhyChoose('')
    clearErrors('whyChooseqinclude')
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const filteredIncludes = data.include.filter((item) => item.trim() !== '')
      if (filteredIncludes.length === 0) {
        setError('include', { type: 'manual', message: 'Please add at least one include' })
        return
      }
      const filteredWhyChoose = data.whyChooseqinclude.filter((item) => item.trim() !== '')
      if (filteredWhyChoose.length === 0) {
        setError('whyChooseqinclude', {
          type: 'manual',
          message: 'Please add at least one include',
        })
        return
      }
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        if (key === 'iconimage') {
          formData.append(key, data[key][0])
        } else if (key === 'image') {
          formData.append(key, data[key][0])
        } else if (key === 'whyChooseqImage') {
          formData.append(key, data[key][0])
        } else if (key === 'include') {
          data[key].forEach((item) => {
            formData.append(`include`, item)
          })
        } else if (key === 'whyChooseqinclude') {
          data[key].forEach((item) => {
            formData.append(`whyChooseqinclude`, item)
          })
        } else {
          formData.append(key, data[key])
        }
      })
      if (state) {
        formData.append('id', state._id)
      }
      const apiCall = state ? editServiceApi(formData) : addServiceApi(formData)
      const response = await apiCall
      setIsLoading(false)
      toast.success('Service added successfully')
      if (response.status === 200) {
        navigate('/service')
      }

    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (state) {
      setValue('name', state.name)
      setValue('title', state.title)
      setValue('description', state.description)
      setValue('price', state.price)
      setValue('time', state.time)
      setValue('image', state.image)
      setValue('include', state.include)
      setValue('whyChooseqTitle', state.whyChooseqTitle)
      setValue('whyChooseqDescription', state.whyChooseqDescription)
      setValue('whyChooseqImage', state.whyChooseqImage)
      setValue('whyChooseqinclude', state.whyChooseqinclude)
      setValue('iconimage', state.iconimage)
      setIconimage(state.iconimage)
      setImage(state.image)
      setWhyChooseqImage(state.whyChooseqImage)
    }
  }, [state])

  const handleSingleImgChange = (e, key) => {
    const files = e.target.files[0]

    if (files) {
      const imageUrl = URL.createObjectURL(files)

      if (key === 'image') {
        setImage(imageUrl)
      } else if (key === 'whyChooseqImage') {
        setWhyChooseqImage(imageUrl)
      } else {
        setIconimage(imageUrl)
      }

      clearErrors(key)
    } else {
      setImage(null)
    }
  }
  return (
    <div>
      <ToastContainer />
      <CRow>
        <CCol lg={8} md={12} sm={12}>
          <CCard>
            <CCardHeader className="formcardheader">
              <CCardTitle>Service Form</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol xl={6} md={12}>
                  <CFormInput
                    type="text"
                    label="Service Name"
                    placeholder="Service Name"
                    {...register('name', { required: 'Service Name is required' })}
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
                    type="text"
                    label="Service Title"
                    {...register('title', { required: 'Service Title is required' })}
                    invalid={!!errors.title}
                    placeholder="Service Title"
                  />
                  {errors.title && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.title.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={12} md={12}>
                  <CFormTextarea
                    type="text"
                    label="Service Description"
                    placeholder="Service Description"
                    {...register('description', { required: 'Service Description is required' })}
                    invalid={!!errors.description}
                  />
                  {errors.description && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.description.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={6} md={12}>
                  <CFormInput
                    type="number"
                    label="Service Price"
                    placeholder="Service Price"
                    {...register('price', { required: 'Service Price is required' })}
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
                    label="Service Time(in minutes)"
                    placeholder="Service Time"
                    {...register('time', { required: 'Service Time is required' })}
                    invalid={!!errors.time}
                    min={0}
                  />
                  {errors.time && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.time.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={12} md={12}>
                  <CFormLabel>Service Icon<span className="text-danger">*only svg allowed</span></CFormLabel>
                  <CFormInput
                    type="file"
                    placeholder="Service Icon"
                    {...register(
                      'iconimage',
                      iconimage ? { required: false } : { required: 'Service Icon is required' },
                    )}
                    invalid={!!errors.iconimage}
                    onChange={(e) => handleSingleImgChange(e, 'iconimage')}
                  />
                  {errors.iconimage && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.iconimage.message}
                    </CFormFeedback>
                  )}
                </CCol>
                {iconimage && (
                  <CCol xl={12} md={12}>
                    <img src={iconimage} alt="service" style={{ maxWidth: '100%' }} />
                  </CCol>
                )}
                <CCol xl={12} md={12}>
                  <CFormInput
                    type="file"
                    label="Service Image"
                    placeholder="Service Image"
                    {...register(
                      'image',
                      image ? { required: false } : { required: 'Service Image is required' },
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
                  <CCol xl={12} md={12}>
                    <img src={image} alt="service" style={{ maxWidth: '100%' }} />
                  </CCol>
                )}
                <CCol xl={12} md={12}>
                  <CFormLabel>Includes Service</CFormLabel>
                  {includeFields.map((item, index) => (
                    <div key={item.id} className="d-flex gap-2 mb-2">
                      <CFormInput
                        type="text"
                        {...register(`include.${index}`)}
                        onChange={(e) => {
                          if (e.target.value.trim() === '') {
                            setError(`include.${index}`, {
                              type: 'manual',
                              message: 'Include is required',
                            })
                          } else {
                            clearErrors(`include.${index}`)
                            clearErrors('include')
                          }
                        }}
                      />
                      <CButton
                        type="button"
                        color="danger"
                        onClick={() => removeInclude(index)}
                        className=""
                      >
                        -
                      </CButton>
                    </div>
                  ))}
                  <CButton type="button" onClick={handleAddInclude} className="add-button">
                    + Add More
                  </CButton>
                  {errors.include && (
                    <CFormFeedback className="text-danger">{errors.include.message}</CFormFeedback>
                  )}
                </CCol>
                <CCol xl={12} md={12}>
                  <CFormInput
                    type="text"
                    label="Why Choose Us Title"
                    placeholder="Why Choose Us Title"
                    {...register('whyChooseqTitle', {
                      required: 'Why Choose Us Title is required',
                    })}
                    invalid={!!errors.whyChooseqTitle}
                  />
                  {errors.whyChooseqTitle && (
                    <CFormFeedback className="text-danger">
                      {errors.whyChooseqTitle.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={12} md={12}>
                  <CFormTextarea
                    type="text"
                    label="Why Choose Us Description"
                    placeholder="Why Choose Us Description"
                    {...register('whyChooseqDescription', {
                      required: 'Why Choose Us Description is required',
                    })}
                    invalid={!!errors.whyChooseqDescription}
                  />
                  {errors.whyChooseqDescription && (
                    <CFormFeedback className="text-danger">
                      {errors.whyChooseqDescription.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={12} md={12}>
                  <CFormInput
                    type="file"
                    label="Why Choose Us Image"
                    placeholder="Why Choose Us Image"
                    {...register(
                      'whyChooseqImage',
                      whyChooseqImage
                        ? { required: false }
                        : { required: 'Why Choose Us Image is required' },
                    )}
                    invalid={!!errors.whyChooseqImage}
                    onChange={(e) => handleSingleImgChange(e, 'whyChooseqImage')}
                  />
                  {errors.whyChooseqImage && (
                    <CFormFeedback className="text-danger">
                      {errors.whyChooseqImage.message}
                    </CFormFeedback>
                  )}
                </CCol>
                {whyChooseqImage && (
                  <CCol xl={12} md={12}>
                    <img src={whyChooseqImage} alt="whyChooseq" style={{ maxWidth: '100%' }} />
                  </CCol>
                )}
                <CCol xl={12} md={12}>
                  <CFormLabel>Why Choose Us Include</CFormLabel>
                  {whyChooseFields.map((item, index) => (
                    <div key={item.id} className="d-flex gap-2 mb-2">
                      <CFormInput
                        type="text"
                        {...register(`whyChooseqinclude.${index}`)}
                        onChange={(e) => {
                          if (e.target.value.trim() === '') {
                            setError(`whyChooseqinclude.${index}`, {
                              type: 'manual',
                              message: 'Include is required',
                            })
                          } else {
                            clearErrors(`whyChooseqinclude.${index}`)
                            clearErrors('whyChooseqinclude')
                          }
                        }}
                      />
                      <CButton
                        type="button"
                        color="danger"
                        onClick={() => removeWhyChoose(index)}
                        className=""
                      >
                        -
                      </CButton>
                    </div>
                  ))}
                  <CButton type="button" onClick={handleAddWhyChoose} className="add-button">
                    + Add More
                  </CButton>
                  {errors.whyChooseqinclude && (
                    <CFormFeedback className="text-danger">
                      {errors.whyChooseqinclude.message}
                    </CFormFeedback>
                  )}
                </CCol>
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

export default ServiceForm
