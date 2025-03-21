import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'   
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from '@mui/material'
import { addUserThemeApi } from '../../../redux/api/api'
import { useState } from 'react'
import { CCol, CRow, CCard, CCardHeader, CCardBody, CForm, CFormInput,CCardTitle, CFormLabel, CFormCheck, CButton, CSpinner } from '@coreui/react'

const UserThemeForm = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit ,setValue,watch ,formState:{errors},clearErrors} = useForm()
    const [mainimage,setMainimage] = useState(null)
    const [headerimage,setHeaderimage] = useState(null)
    const [workingimage,setWorkingimage] = useState(null)
    const [springimage,setSpringimage] = useState(null)
    const onSubmit = async (data) => {
        setIsLoading(true)
        try{
            const formData = new FormData()
            Object.keys(data).forEach((key) => {
                if(key === 'mainimage'){
                    formData.append(key,data[key][0])
                }else if(key === 'headerimage'){
                    formData.append(key,data[key][0])
                }else if(key === 'workingimage'){
                    formData.append(key,data[key][0])
                }else if(key === 'springimage'){
                    formData.append(key,data[key][0])
                }else{
                    formData.append(key,data[key])
                }

            })
            const response = await addUserThemeApi(formData)
            if(response.status === 200){
                toast.success('User Theme Added Successfully')
                navigate('/usertheme')
            }
        }catch(error){
            console.error(error)      
            toast.error(error.response.data.message || 'Something went wrong') 
        }finally{
            setIsLoading(false)
        }
    }

    const handleSingleImgChange = (e,key) => {
        const file = e.target.files[0]
        if(file){
            
            const imageUrl = URL.createObjectURL(file)

           if(key === 'mainimage'){
            setMainimage(imageUrl)
           }else if(key === 'headerimage'){
            setHeaderimage(imageUrl)
           }else if(key === 'workingimage'){
            setWorkingimage(imageUrl)
           }else {     
            setSpringimage(imageUrl)
           }
            clearErrors(key)
           
        }else{
            setMainimage(null)
            setHeaderimage(null)
            setWorkingimage(null)
            setSpringimage(null)
        }
    }
    return (
        <div>
            <ToastContainer />
            <CRow>
                <CCol lg={8} md={12} sm={12}>
                    <CCard>
                        <CCardHeader className="formcardheader">
                            <CCardTitle>User Theme Form</CCardTitle>    
                        </CCardHeader>
                        <CCardBody>
                            <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                                <CCol xl={12} md={12}>
                                    <CFormInput type="text" label="Name" {...register('name',{required:"Name is required"})} />
                                    {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                </CCol>
                                <CCol xl={4} md={12}>
                                    <CFormInput style={{width:"100%"}} type="color" label="Color 1" {...register('color1',{required:"Color 1 is required"})} />
                                    {errors.color1 && <p className="text-danger">{errors.color1.message}</p>}
                                </CCol>
                                <CCol xl={4} md={12}>
                                    <CFormInput style={{width:"100%"}} type="color" label="Color 2" {...register('color2',{required:"Color 2 is required"})} />
                                    {errors.color2 && <p className="text-danger">{errors.color2.message}</p>}
                                </CCol>
                                <CCol xl={4} md={12}>
                                    <CFormInput style={{width:"100%"}}  type="color" label="Color 3" {...register('color3',{required:"Color 3 is required"})} />
                                    {errors.color3 && <p className="text-danger">{errors.color3.message}</p>}
                                </CCol>
                                <CCol xl={12} md={12}>
                                    <CFormInput type="file" label="Home Page Main Image" {...register('mainimage',{required:"Home Page Main Image is required"})}
                                     onChange={(e)=>handleSingleImgChange(e,'mainimage')}
                                     />
                                    {errors.mainimage && <p className="text-danger">{errors.mainimage.message}</p>}
                                    {mainimage && <img src={mainimage} alt="mainimage" style={{maxWidth:"100%",}} />}

                                </CCol>
                                <CCol xl={12} md={12}>
                                    <CFormInput type="file" label="Page Header Image" {...register('headerimage',{required:"Page Header Image is required"})}
                                     onChange={(e)=>handleSingleImgChange(e,'headerimage')}
                                     />
                                    {errors.headerimage && <p className="text-danger">{errors.headerimage.message}</p>}
                                    {headerimage && <img src={headerimage} alt="headerimage" style={{maxWidth:"100%",}} />}
                                </CCol>  
                                
                                <CCol xl={12} md={12}>
                                    <CFormInput type="file" label="Why Choose Us Section Image" {...register('workingimage',{required:"Why Choose Us Section Image is required"})}
                                     onChange={(e)=>handleSingleImgChange(e,'workingimage')}
                                     />
                                    {errors.workingimage && <p className="text-danger">{errors.workingimage.message}</p>}
                                    {workingimage && <img src={workingimage} alt="workingimage" style={{maxWidth:"100%",}} />}
                                </CCol>
                               
                                <CCol xl={12} md={12}>
                                    <CFormInput type="file" label=" Home Page Discount Section Image" {...register('springimage',{required:"Home Page Discount Section Image is required"})}
                                     onChange={(e)=>handleSingleImgChange(e,'springimage')}
                                     />
                                    {errors.springimage && <p className="text-danger">{errors.springimage.message}</p>}
                                    {springimage && <img src={springimage} alt="springimage" style={{maxWidth:"100%",}} />}
                                </CCol>
                                <CCol xl={12} className='text-center'>
                                    <CButton type="submit"  className='submit-button' disabled={isLoading}>
                                        {isLoading ? <CSpinner size="sm" /> : 'Submit'}
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
export default UserThemeForm