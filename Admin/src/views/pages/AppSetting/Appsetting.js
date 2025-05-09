import { useForm } from 'react-hook-form'
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
  CButton,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CFormLabel,
} from '@coreui/react'
import { getAllAppSettingApi, editAppSettingApi } from '../../../redux/api/api'
import { useState, useEffect } from 'react'

const Appsetting = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    clearErrors,
    setValue,
  } = useForm()
  const [appSetting, setAppSetting] = useState(null)
  const [loading, setLoading] = useState(false)
  const [logo, setLogo] = useState(null)
  const [favicon, setFavicon] = useState(null)
  const [footerLogo, setFooterLogo] = useState(null)

  const fetchAppSetting = async () => {
    try {
      setLoading(true)
      const res = await getAllAppSettingApi()
      if (res.data.status === 200) {
        setAppSetting(res.data.info)
        setLogo(res.data.info.logo)
        setFavicon(res.data.info.favicon)
        setFooterLogo(res.data.info.footerlogo)
        setValue('name', res.data.info.name)
        setValue('currency', res.data.info.currency)
        setValue('currency_symbol', res.data.info.currency_symbol)
        setValue('copyright', res.data.info.copyright)
        setValue('facebook', res.data.info.facebook)
        setValue('instagram', res.data.info.instagram)
        setValue('twitter', res.data.info.twitter)
        setValue('youtube', res.data.info.youtube)
        setValue('google_map_api_key', res.data.info.google_map_api_key)
        setValue('smtp_mail', res.data.info.smtp_mail)
        setValue('smtp_password', res.data.info.smtp_password)
        setValue('smtp_port', res.data.info.smtp_port)
        setValue('smtp_host', res.data.info.smtp_host)
        setValue('google_client_id', res.data.info.google_client_id)
        setValue('service_tax', res.data.info.service_tax)
        setValue('stripe_secret_key', res.data.info.stripe_secret_key)
        setValue('stripe_publishable_key', res.data.info.stripe_publishable_key)
        setValue('stripe_webhook_secret', res.data.info.stripe_webhook_secret)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSingleImgChange = (e, key) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      if (key === 'logo') {
        setLogo(imageUrl)
      } else if (key === 'favicon') {
        setFavicon(imageUrl)
      } else if (key === 'footerlogo') {
        setFooterLogo(imageUrl)
      } else {
        setLogo(imageUrl)
      }
      clearErrors(key)
    } else {
      setLogo(null)
      setFavicon(null)
      setFooterLogo(null)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        if (key === 'logo') {
          formData.append(key, data[key][0])
        } else if (key === 'favicon') {
          formData.append(key, data[key][0])
        } else if (key === 'footerlogo') {
          formData.append(key, data[key][0])
        } else {
          formData.append(key, data[key])
        }
      })
      const res = await editAppSettingApi(formData)
      if (res.data.status === 200) {
        toast.success('App Setting Updated Successfully')
        fetchAppSetting()
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppSetting()
  }, [])

  return (
    <div>
      <ToastContainer />
      <CRow>
        <CCol lg={12} md={12} sm={12}>
          <CCard>
            <CCardHeader className="formcardheader">
              <CCardTitle>App Settings</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                {/* App Setting Card */}
                <CCard className="mb-4  p-0">
                  <CCardHeader>
                    <CCardTitle>App Setting</CCardTitle>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol xl={6} md={12}>
                        <CFormInput
                          type="text"
                          label="App Name"
                          name="appName"
                          {...register('name', { required: 'App Name is required' })}
                          invalid={!!errors.name}
                        />
                        {errors.name && (
                          <CFormFeedback className="text-danger">
                            {errors.name.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={3} md={12}>
                        <CFormInput
                          type="text"
                          label="Currency"
                          name="currency"
                          {...register('currency', { required: 'Currency is required' })}
                          invalid={!!errors.currency}
                        />
                        {errors.currency && (
                          <CFormFeedback className="text-danger">
                            {errors.currency.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={3} md={12}>
                        <CFormInput
                          type="text"
                          label="Currency Symbol"
                          name="currencySymbol"
                          {...register('currency_symbol', {
                            required: 'Currency Symbol is required',
                          })}
                          invalid={!!errors.currency_symbol}
                        />
                        {errors.currency_symbol && (
                          <CFormFeedback className="text-danger">
                            {errors.currency_symbol.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={6} md={12}>
                        <CFormLabel>Service Tax</CFormLabel>
                        <CInputGroup>
                          <CFormInput
                            type="number"
                            name="service_tax"
                            {...register('service_tax', { required: 'Service Tax is required' })}
                            invalid={!!errors.service_tax}
                          />
                          <CInputGroupText>%</CInputGroupText>
                        </CInputGroup>
                        {errors.service_tax && (
                          <CFormFeedback className="text-danger">
                            {errors.service_tax.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={12} md={12}>
                        <CFormInput
                          type="text"
                          label="Copyright"
                          name="copyright"
                          {...register('copyright', { required: 'Copyright is required' })}
                          invalid={!!errors.copyright}
                        />
                        {errors.copyright && (
                          <CFormFeedback className="text-danger">
                            {errors.copyright.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>

                {/* Social Links Card */}
                <CCard className="mb-4  p-0">
                  <CCardHeader>
                    <CCardTitle>Social Links</CCardTitle>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol xl={6} md={12}>
                        <CFormInput
                          type="text"
                          label="Facebook"
                          name="facebook"
                          {...register('facebook', { required: 'Facebook is required' })}
                          invalid={!!errors.facebook}
                        />
                        {errors.facebook && (
                          <CFormFeedback className="text-danger">
                            {errors.facebook.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={6} md={12}>
                        <CFormInput
                          type="text"
                          label="Instagram"
                          name="instagram"
                          {...register('instagram', { required: 'Instagram is required' })}
                          invalid={!!errors.instagram}
                        />
                        {errors.instagram && (
                          <CFormFeedback className="text-danger">
                            {errors.instagram.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={6} md={12}>
                        <CFormInput
                          type="text"
                          label="Twitter"
                          name="twitter"
                          {...register('twitter', { required: 'Twitter is required' })}
                          invalid={!!errors.twitter}
                        />
                        {errors.twitter && (
                          <CFormFeedback className="text-danger">
                            {errors.twitter.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={6} md={12}>
                        <CFormInput
                          type="text"
                          label="Youtube"
                          name="youtube"
                          {...register('youtube', { required: 'Youtube is required' })}
                          invalid={!!errors.youtube}
                        />
                        {errors.youtube && (
                          <CFormFeedback className="text-danger">
                            {errors.youtube.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>

                {/* Google Secret Key Card */}
                <CCard className="mb-4  p-0">
                  <CCardHeader>
                    <CCardTitle>Google Secret Key</CCardTitle>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol xl={12} md={12}>
                        <CFormInput
                          type="text"
                          label="Google Map API Key"
                          name="google_map_api_key"
                          {...register('google_map_api_key', {
                            required: 'Google Map API Key is required',
                          })}
                          invalid={!!errors.google_map_api_key}
                        />
                        {errors.google_map_api_key && (
                          <CFormFeedback className="text-danger">
                            {errors.google_map_api_key.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={12} md={12}>
                        <CFormInput
                          type="text"
                          label="Google Client ID"
                          name="google_client_id"
                          {...register('google_client_id', {
                            required: 'Google Client ID is required',
                          })}
                          invalid={!!errors.google_client_id}
                        />
                        {errors.google_client_id && (
                          <CFormFeedback className="text-danger">
                            {errors.google_client_id.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>

                {/* SMTP Setting Card */}
                <CCard className="mb-4 p-0">
                  <CCardHeader>
                    <CCardTitle>SMTP Setting</CCardTitle>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol xl={4} md={12}>
                        <CFormInput
                          type="text"
                          label="SMTP Mail"
                          name="smtp_mail"
                          {...register('smtp_mail', { required: 'SMTP Mail is required' })}
                          invalid={!!errors.smtp_mail}
                        />
                        {errors.smtp_mail && (
                          <CFormFeedback className="text-danger">
                            {errors.smtp_mail.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={4} md={12}>
                        <CFormInput
                          type="text"
                          label="SMTP Password"
                          name="smtp_password"
                          {...register('smtp_password', { required: 'SMTP Password is required' })}
                          invalid={!!errors.smtp_password}
                        />
                        {errors.smtp_password && (
                          <CFormFeedback className="text-danger">
                            {errors.smtp_password.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={4} md={12}>
                        <CFormInput
                          type="text"
                          label="SMTP Host"
                          name="smtp_host"
                          {...register('smtp_host', { required: 'SMTP Host is required' })}
                          invalid={!!errors.smtp_host}
                        />
                        {errors.smtp_host && (
                          <CFormFeedback className="text-danger">
                            {errors.smtp_host.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={4} md={12}>
                        <CFormInput
                          type="text"
                          label="SMTP Port"
                          name="smtp_port"
                          {...register('smtp_port', { required: 'SMTP Port is required' })}
                          invalid={!!errors.smtp_port}
                        />
                        {errors.smtp_port && (
                          <CFormFeedback className="text-danger">
                            {errors.smtp_port.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>

                {/* Stripe Credentials Card */}
                <CCard className="mb-4  p-0">
                  <CCardHeader>
                    <CCardTitle>Stripe Credentials</CCardTitle>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol xl={12} md={12}>
                        <CFormInput
                          type="text"
                          label="Stripe Secret Key"
                          name="stripe_secret_key"
                          {...register('stripe_secret_key', {
                            required: 'Stripe Secret Key is required',
                          })}
                          invalid={!!errors.stripe_secret_key}
                        />
                        {errors.stripe_secret_key && (
                          <CFormFeedback className="text-danger">
                            {errors.stripe_secret_key.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={12} md={12}>
                        <CFormInput
                          type="text"
                          label="Stripe Publishable Key"
                          name="stripe_publishable_key"
                          {...register('stripe_publishable_key', {
                            required: 'Stripe Publishable Key is required',
                          })}
                          invalid={!!errors.stripe_publishable_key}
                        />
                        {errors.stripe_publishable_key && (
                          <CFormFeedback className="text-danger">
                            {errors.stripe_publishable_key.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol xl={12} md={12}>
                        <CFormInput
                          type="text"
                          label="Stripe Webhook Secret"
                          name="stripe_webhook_secret"
                          {...register('stripe_webhook_secret', {
                            required: 'Stripe Webhook Secret is required',
                          })}
                          invalid={!!errors.stripe_webhook_secret}
                        />
                        {errors.stripe_webhook_secret && (
                          <CFormFeedback className="text-danger">
                            {errors.stripe_webhook_secret.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>

                {/* Image Uploads Card */}
                <CCard className="mb-4 p-0">
                  <CCardHeader>
                    <CCardTitle>Image Uploads</CCardTitle>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol xl={6} md={12}>
                        <CFormInput
                          type="file"
                          label="Logo"
                          name="logo"
                          {...register(
                            'logo',
                            logo ? { required: false } : { required: 'Logo is required' },
                          )}
                          invalid={!!errors.logo}
                          onChange={(e) => handleSingleImgChange(e, 'logo')}
                        />
                        {errors.logo && (
                          <CFormFeedback className="text-danger">
                            {errors.logo.message}
                          </CFormFeedback>
                        )}
                        <img src={logo} alt="logo" className="img-fluid mt-2" />
                      </CCol>
                      <CCol xl={6} md={12}>
                        <CFormInput
                          type="file"
                          label="Favicon"
                          name="favicon"
                          {...register(
                            'favicon',
                            favicon ? { required: false } : { required: 'Favicon is required' },
                          )}
                          invalid={!!errors.favicon}
                          onChange={(e) => handleSingleImgChange(e, 'favicon')}
                        />
                        {errors.favicon && (
                          <CFormFeedback className="text-danger">
                            {errors.favicon.message}
                          </CFormFeedback>
                        )}
                        <img src={favicon} alt="favicon" className="img-fluid mt-2" />
                      </CCol>
                      <CCol xl={6} md={12}>
                        <CFormInput
                          type="file"
                          label="Footer Logo"
                          name="footerLogo"
                          {...register(
                            'footerlogo',
                            footerLogo
                              ? { required: false }
                              : { required: 'Footer Logo is required' },
                          )}
                          invalid={!!errors.footerlogo}
                          onChange={(e) => handleSingleImgChange(e, 'footerlogo')}
                        />
                        {errors.footerlogo && (
                          <CFormFeedback className="text-danger">
                            {errors.footerlogo.message}
                          </CFormFeedback>
                        )}
                        <img src={footerLogo} alt="footerLogo" className="img-fluid mt-2" />
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>

                <CCol xl={12} md={12} className="text-center">
                  <CButton disabled={loading} type="submit" className="submit-button">
                    {loading ? <CSpinner /> : 'Save'}
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

export default Appsetting
