import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { LoginApi } from 'src/redux/api/api'
import { LOGIN_SUCCESS } from 'src/redux/actions/action'
import Cookies from 'js-cookie'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const req = {
        email: data.email,
        password: data.password,
      }
      const res = await LoginApi(req)
      if (res.status === 200) {
        const userObject = {
          name: res.data.info.admin.name,
          id: res.data.info.admin._id,
          email: res.data.info.admin.email,
        }
        Cookies.set('admin', JSON.stringify(userObject))
        dispatch({
          type: LOGIN_SUCCESS,
          data: userObject,
        })
        Cookies.set('token', res.data.info.token)
        Cookies.set('refreshToken', res.data.info.refreshToken)
        navigate('/dashboard')
      }
    } catch (error) {
      console.error(error)
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'An error occurred while logging in. Please try again.'

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center login-page">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5} xs={12}>
            <CCardGroup>
              <CCard className="p-4 card-login">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    {error && <p className="text-danger mb-1">{error}</p>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...register('email', { required: 'Email is required' })}
                        invalid={!!errors.email}
                      />
                      <CFormFeedback invalid={errors.email}>{errors.email?.message}</CFormFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password', { required: 'Password is required' })}
                        invalid={!!errors.password}
                      />
                      <CFormFeedback invalid={errors.password}>
                        {errors.password?.message}
                      </CFormFeedback>
                    </CInputGroup>
                    <CRow className="mt-4">
                      <CCol xs={12}>
                        <CButton type="submit" disabled={isLoading} className="btn-login">
                          {isLoading ? <CSpinner /> : 'Login'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
