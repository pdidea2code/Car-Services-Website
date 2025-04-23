import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CForm,
  CFormInput,
  CFormFeedback,
  CButton,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { GoogleMap, Marker, LoadScript, LoadScriptNext } from '@react-google-maps/api'
import { editAddressApi, addAddressApi, getAllAppSettingApi } from 'src/redux/api/api'
import { CSpinner } from '@coreui/react'

const AddressForm = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [googleMapApiKey, setGoogleMapApiKey] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm()

  const [map, setMap] = useState(null)

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  }

  const [marker, setMarker] = useState(null)

  // Watch latitude and longitude fields
  const latitude = watch('latitude')
  const longitude = watch('longitude')

  const onMapLoad = (map) => {
    setMap(map)
  }

  const handleMapClick = (event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

    setMarker({ lat, lng })
    setValue('latitude', lat.toString())
    setValue('longitude', lng.toString())
  }

  const fetchAppSetting = async () => {
    try {
      setIsLoading(true)
      const res = await getAllAppSettingApi()
      if (res.status === 200) {
        setGoogleMapApiKey(res.data.info.google_map_api_key)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const req = {
        address: data.address,
        city: data.city,
        country: data.country,
        zipCode: data.zipCode,
        phone: data.phone,
        email: data.email,
        latitude: data.latitude,
        longitude: data.longitude,
      }

      if (state) {
        req.id = state._id
      }

      const apiCall = state ? editAddressApi(req) : addAddressApi(req)
      const response = await apiCall
      setIsLoading(false)
      toast.success('Address saved successfully')

      if (response.status === 200) {
        navigate('/address')
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (state) {
      setValue('address', state.address || '')
      setValue('city', state.city || '')
      setValue('country', state.country || '')
      setValue('zipCode', state.zipCode || '')
      setValue('phone', state.phone || '')
      setValue('email', state.email || '')

      const lat = parseFloat(state.latitude) || 0
      const lng = parseFloat(state.longitude) || 0

      setValue('latitude', lat.toString())
      setValue('longitude', lng.toString())
      setMarker({ lat, lng })
    }
  }, [state, setValue])

  // Update marker position when latitude or longitude changes
  useEffect(() => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)

      if (!isNaN(lat) && !isNaN(lng)) {
        setMarker({ lat, lng })
      }
    }
  }, [latitude, longitude])

  useEffect(() => {
    fetchAppSetting()
  }, [])

  return (
    <div>
      <ToastContainer />
      <CRow>
        <CCol lg={8} md={12} sm={12}>
          <CCard>
            <CCardHeader className="formcardheader">
              <CCardTitle>Address Form</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol xl={6} md={12}>
                  <CFormInput
                    type="text"
                    label="Address"
                    placeholder="Address"
                    {...register('address', { required: 'Address is required' })}
                    invalid={!!errors.address}
                  />
                  {errors.address && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.address.message}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xl={6} md={12}>
                  <CFormInput
                    type="text"
                    label="City"
                    placeholder="City"
                    {...register('city', { required: 'City is required' })}
                    invalid={!!errors.city}
                  />
                  {errors.city && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.city.message}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xl={6} md={12}>
                  <CFormInput
                    type="text"
                    label="Country"
                    placeholder="Country"
                    {...register('country', { required: 'Country is required' })}
                    invalid={!!errors.country}
                  />
                  {errors.country && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.country.message}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xl={6} md={12}>
                  <CFormInput
                    type="text"
                    label="Zip Code"
                    placeholder="Zip Code"
                    {...register('zipCode', { required: 'Zip Code is required' })}
                    invalid={!!errors.zipCode}
                  />
                  {errors.zipCode && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.zipCode.message}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xl={6} md={12}>
                  <CFormInput
                    type="text"
                    label="Phone"
                    placeholder="Phone"
                    {...register('phone', { required: 'Phone is required' })}
                    invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.phone.message}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xl={6} md={12}>
                  <CFormInput
                    type="text"
                    label="Email"
                    placeholder="Email"
                    {...register('email', { required: 'Email is required' })}
                    invalid={!!errors.email}
                  />
                  {errors.email && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.email.message}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xl={6} md={12}>
                  <CFormInput
                    type="text"
                    label="Latitude"
                    placeholder="Latitude"
                    {...register('latitude', { required: 'Latitude is required' })}
                    invalid={!!errors.latitude}
                  />
                  {errors.latitude && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.latitude.message}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xl={6} md={12}>
                  <CFormInput
                    type="text"
                    label="Longitude"
                    placeholder="Longitude"
                    {...register('longitude', { required: 'Longitude is required' })}
                    invalid={!!errors.longitude}
                  />
                  {errors.longitude && (
                    <CFormFeedback className="text-danger" invalid>
                      {errors.longitude.message}
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xl={12} md={12}>
                  {isLoading ? (
                    <CSpinner />
                  ) : (
                    <LoadScriptNext googleMapsApiKey={googleMapApiKey}>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={marker || { lat: 0, lng: 0 }}
                        zoom={12}
                        onClick={handleMapClick}
                        onLoad={onMapLoad}
                      >
                        {marker && <Marker position={marker} />}
                      </GoogleMap>
                    </LoadScriptNext>
                  )}
                </CCol>

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

export default AddressForm
