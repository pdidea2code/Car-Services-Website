import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import {
  CForm,
  CFormInput,
  CCol,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CFormLabel,
  CFormFeedback,
  CButton,
  CSpinner,
  CFormTextarea,
} from '@coreui/react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { getBlogByIdApi, addBlogApi, updateBlogApi } from '../../../redux/api/api'
import { useNavigate, useLocation } from 'react-router-dom'

const base64ToBlob = (base64, mimeType = 'image/jpeg') => {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

const BlogForm = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const navigate = useNavigate()
  const { state } = useLocation()
  //   const [content, setContent] = useState('')

  const handleSingleImgChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
      clearErrors('image')
    } else {
      setImage(null)
    }
  }

  useEffect(() => {
    const fetchBlogById = async () => {
      const response = await getBlogByIdApi({ id: state._id })
      if (response.status === 200) {
        setValue('title', response.data.info.title)
        setValue('description', response.data.info.description)
        // setValue('image', response.data.info.mainimage)
        setValue('content', response.data.info.content)
        setImage(response.data.info.image)
        // setContent(response.data.info.content)
      }
    }
    if (state) {
      fetchBlogById()
    }
  }, [state])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      if (data.image) {
        formData.append('mainimage', data.image[0])
      }
      formData.append('content', data.content)
      if (state) {
        formData.append('id', state._id)
      }
      const imageTags = data.content.match(/<img[^>]*src="data:image\/[^>]*>/g) || []

      for (let i = 0; i < imageTags.length; i++) {
        const base64 = imageTags[i].match(/src="data:image\/[^;]+;base64,(.*?)"/)[1]
        const blob = base64ToBlob(base64)
        formData.append('images', blob, `image-${i}.jpg`)
      }

      const apiCall = state ? await updateBlogApi(formData) : await addBlogApi(formData)
      if (apiCall.status === 200) {
        toast.success('Blog saved successfully')
        navigate('/blog')
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ color: ['#0E0821'] }],
    [{ font: [] }],
    [{ align: [] }],
    ['link', 'image', 'video'], // Enable image and video upload
    ['clean'],
  ]

  return (
    <div>
      <ToastContainer />
      <CRow>
        <CCol lg={12} md={12} sm={12}>
          <CCard>
            <CCardHeader className="formcardheader">
              <CCardTitle>Blog Form</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol xl={12} md={12}>
                  <CFormInput
                    type="text"
                    label="Blog Title"
                    placeholder="Blog Title"
                    {...register('title', { required: 'Blog Title is required' })}
                    invalid={!!errors.title}
                  />
                  {errors.title && (
                    <CFormFeedback className="text-danger">{errors.title?.message}</CFormFeedback>
                  )}
                </CCol>

                <CCol xl={12} md={12}>
                  <CFormTextarea
                    label="Blog Description"
                    placeholder="Blog Description"
                    {...register('description', { required: 'Blog Description is required' })}
                    invalid={!!errors.description}
                  />
                  {errors.description && (
                    <CFormFeedback className="text-danger">
                      {errors.description?.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={12} md={12}>
                  <CFormInput
                    type="file"
                    label="Blog Image"
                    placeholder="Blog Image"
                    {...register(
                      'image',
                      image ? { required: false } : { required: 'Blog Image is required' },
                    )}
                    invalid={!!errors.image}
                    onChange={(e) => handleSingleImgChange(e)}
                  />
                  {errors.image && (
                    <CFormFeedback className="text-danger">{errors.image?.message}</CFormFeedback>
                  )}
                </CCol>
                {image && (
                  <CCol xl={12} md={12}>
                    <img
                      src={image}
                      alt="Blog Image"
                      style={{ width: 'auto', maxWidth: '100%', objectFit: 'cover' }}
                    />
                  </CCol>
                )}
                <CCol xl={12} md={12}>
                  <CFormLabel>Blog Content</CFormLabel>
                  <Controller
                    name="content"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <ReactQuill
                        {...field}
                        theme="snow"
                        onChange={field.onChange}
                        modules={{ toolbar: toolbarOptions }}
                      />
                    )}
                  />
                </CCol>
                <CCol xl={12} md={12} className="text-center">
                  <CButton disabled={loading} type="submit" className="submit-button">
                    {loading ? <CSpinner /> : 'Submit'}
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

export default BlogForm
