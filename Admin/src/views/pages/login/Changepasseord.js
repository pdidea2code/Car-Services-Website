import React, { useState } from 'react'
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
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { useForm } from 'react-hook-form'
// import { changePasswordApi } from 'src/redux/api/api'  // <-- replace with actual API
import Cookies from 'js-cookie'
import { ChangePasswordapi } from 'src/redux/api/api'

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onsubmit = async (data) => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    try {
      const req = {
        password: data.password,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }
      const res = await ChangePasswordapi(req) // Replace with actual API
      if (res.status === 200) {
        reset()
        setSuccess('Password changed successfully.')
      }
    } catch (error) {
      console.error(error)
      const errorMessage =
        error.response?.data?.message || 'An error occurred while changing the password.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{ backgroundColor: '#EAF0F5' }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={9} lg={6} xl={5} xxl={5}>
            <CCardGroup>
              <CCard className="p-4 col-md-7 rounded-4" style={{ backgroundColor: '#F9FCFF' }}>
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onsubmit)}>
                    <h1 className="fw-bold">Change Password</h1>
                    <p className="text-medium-emphasis fw-bold">Update your password</p>
                    {error && <p className="errors text-danger">{error}</p>}
                    {success && <p className="text-success">{success}</p>}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Current Password"
                        autoComplete="off"
                        {...register('password', { required: 'Current password is required' })}
                        invalid={!!errors.password}
                        className="p-2 rounded-end-3"
                      />
                      <CFormFeedback invalid>{errors.password?.message}</CFormFeedback>
                    </CInputGroup>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="New Password"
                        autoComplete="off"
                        {...register('newPassword', { required: 'New password is required' })}
                        invalid={!!errors.newPassword}
                        className="p-2 rounded-end-3"
                      />
                      <CFormFeedback invalid>{errors.newPassword?.message}</CFormFeedback>
                    </CInputGroup>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Confirm New Password"
                        autoComplete="off"
                        {...register('confirmPassword', {
                          required: 'Confirm password is required',
                          validate: (value) =>
                            value === watch('newPassword') || 'Passwords do not match',
                        })}
                        invalid={!!errors.confirmPassword}
                        className="p-2 rounded-end-3"
                      />
                      <CFormFeedback invalid>{errors.confirmPassword?.message}</CFormFeedback>
                    </CInputGroup>

                    <CRow className="mt-4">
                      <CCol xs={12}>
                        <CButton type="submit" disabled={isLoading} className="px-5 btnapp w-100">
                          {isLoading ? 'Processing...' : 'Change Password'}
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

export default ChangePassword
