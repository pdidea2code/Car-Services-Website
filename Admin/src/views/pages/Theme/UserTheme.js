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
  CFormCheck,
  CButton,
  CSpinner,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { getAllUserThemeApi, setActiveUserThemeApi } from '../../../redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const UserTheme = () => {
  const navigate = useNavigate()
  const [userTheme, setUserTheme] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const fetchAllUserTheme = async () => {
    try {
      setIsLoading(true)
      const response = await getAllUserThemeApi()
      if (response.status === 200) {
        setUserTheme(response.data.info)
        response.data.info.forEach((theme) => {
          if (theme.is_active) {
            setValue('theme', theme._id)
          }
        })

        console.log(response.data.info)
      }
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
    
  }
  const onSubmit = async (data) => {
    setIsSubmitLoading(true)
    try {
        const req={
            id:data.theme,
        }
      const response = await setActiveUserThemeApi(req)
      if (response.status === 200) {
        toast.success('Theme updated successfully')
        fetchAllUserTheme()
      }
    } catch (error) {
      console.log(error)
      setIsSubmitLoading(false)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setIsSubmitLoading(false)
    }
  }
  useEffect(() => {
    fetchAllUserTheme()
  }, [])
  return (
    <div>
        <ToastContainer />
      {isLoading ? (
        <CSpinner />
      ) : (
        <>
          
          <CRow>
        <CCol lg={12} md={12} sm={12}>
          <CCard>
            <CCardHeader>
              <CCardTitle>User Theme</CCardTitle>
            </CCardHeader>
            <CCardBody>
            <div className="right-text">
            <Button
              className="add-button"
              variant="contained"
              onClick={() => navigate('/usertheme/form')}
            >
              Add Theme
            </Button>
          </div>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                {userTheme.map((theme) => (
                  <CCol
                    lg={4}
                    md={12}
                    sm={12}
                    style={{ backgroundColor: watch('theme') === theme._id ? '#dcdcde' : '#fff', padding: '10px' }}
                    onClick={() => setValue('theme', theme._id)}
                  >
                    <CFormCheck
                      type="radio"
                      name="theme"
                      label={theme.name}
                      value={theme._id}
                      {...register('theme')}
                      checked={theme._id === watch('theme')}
                    />
                    <div className="d-flex align-items-center">
                      <div style={{ backgroundColor: theme.color1, borderRadius: '10px 0 0 10px', height: '50px', width: '33%' }}></div>
                      <div style={{ backgroundColor: theme.color2, borderRadius: '0', height: '50px', width: '33%' }}></div>
                      <div style={{ backgroundColor: theme.color3, borderRadius: '0 10px 10px 0', height: '50px', width: '33%' }}></div>
                    </div>
                  </CCol>
                ))}
                <CCol lg={12} md={12} sm={12} className="text-center">
                  <CButton disabled={isSubmitLoading} type="submit" className="submit-button">
                    {isSubmitLoading ? <CSpinner size="sm" /> : 'Submit'}
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
            </CCol>
          </CRow>
                
        </>
      )}
    </div>
  )
}

export default UserTheme
