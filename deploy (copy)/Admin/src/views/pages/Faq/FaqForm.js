import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
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
  CFormFeedback,
  CFormTextarea,
  CButton,
  CSpinner,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { addFaqApi, editFaqApi } from '../../../redux/api/api'

const FaqForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { state } = useLocation()

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const requestData = {
        question: data.question,
        answer: data.answer,
      }
      if (state) {
        requestData.id = state._id
      }
      const apiCall = state ? editFaqApi(requestData) : addFaqApi(requestData)
      const res = await apiCall
      if (res.status === 200) {
        toast.success('Faq updated successfully')
        navigate('/faq')
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
      setValue('question', state.question)
      setValue('answer', state.answer)
    }
  }, [state])
  return (
    <div>
      <ToastContainer />
      <CRow>
        <CCol lg={8} md={12} sm={12}>
          <CCard>
            <CCardHeader className="formcardheader">
              <CCardTitle>Faq Form</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol xl={12} md={12}>
                  <CFormInput
                    type="text"
                    label="Question"
                    placeholder="Question"
                    {...register('question', { required: 'Question is required' })}
                    invalid={!!errors.question}
                  />
                  {errors.question && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.question.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={12} md={12}>
                  <CFormTextarea
                    type="text"
                    label="Answer"
                    placeholder="Answer"
                    {...register('answer', { required: 'Answer is required' })}
                    invalid={!!errors.answer}
                    rows={5}
                  />
                  {errors.answer && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.answer.message}
                    </CFormFeedback>
                  )}
                </CCol>
                <CCol xl={12} md={12} className="text-center">
                  <CButton type="submit" className="submit-button">
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

export default FaqForm
