import { useState, useEffect } from 'react'
import { CRow, CCol, CCard, CCardHeader, CCardTitle, CCardBody, CForm, CFormInput, CButton, CSpinner } from '@coreui/react'
import { useForm } from 'react-hook-form'
import { getAdminThemeApi, editAdminThemeApi } from 'src/redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const AdminTheme = () => {
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState({})
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const fetchAdminTheme = async () => {
    const response = await getAdminThemeApi()
    if (response.status === 200) {
      setTheme(response.data.info)
      const data = response.data.info
      setValue('color1', data.color1)
      setValue('color2', data.color2)
      setValue('color3', data.color3)
      document.documentElement.style.setProperty('--color-one', data.color1);
      document.documentElement.style.setProperty('--color-two', data.color2);
      document.documentElement.style.setProperty('--color-three', data.color3);
    }
  }
  
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const requestData = {
      color1: data.color1,
      color2: data.color2,
      color3: data.color3
    }
    const response = await editAdminThemeApi(requestData)
    if (response.status === 200) {
      toast.success('Theme updated successfully')
      fetchAdminTheme()
    }
  } catch (error) {
    console.error(error)  
    toast.error(error?.response?.data?.message)
  } finally {
    setLoading(false)
  }
  }

  useEffect(() => {
    fetchAdminTheme()
  }, [])

  return( 
  <div>
    <ToastContainer />
    <CRow>
      <CCol lg={12} md={12} sm={12}>
        <CCard>
          <CCardHeader className="formcardheader">
            <CCardTitle>Admin Theme</CCardTitle>  
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
              <CCol lg={6} md={12} sm={12}>
                <CFormInput className='w-100' type="color" label="Primary Color" {...register('color1', { required: 'Primary Color is required' })} />
              </CCol>
              <CCol lg={6} md={12} sm={12}>
                <CFormInput className='w-100' type="color" label="Secondary Color" {...register('color2', { required: 'Secondary Color is required' })} />
              </CCol>
              <CCol lg={6} md={12} sm={12}>
                <CFormInput className='w-100' type="color" label="Tertiary Color" {...register('color3', { required: 'Tertiary Color is required' })} />
              </CCol>
              <CCol lg={12} md={12} sm={12} className='text-center'>
                <CButton disabled={loading} type="submit" className='submit-button'>
                  {loading ? <CSpinner /> : 'Submit'}
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow> 
  </div>)
}

export default AdminTheme
