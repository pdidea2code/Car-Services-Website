import { CSpinner } from '@coreui/react'
import { useState, useEffect } from 'react'
import { getAllUserApi, updateUserApi } from '../../../redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MUIDataTable from 'mui-datatables'
import { CRow, CCol, CModal, CModalHeader, CModalBody } from '@coreui/react'
import { Switch } from '@mui/material'
const User = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState([])
  const [visible, setVisible] = useState(false)
  const [image, setImage] = useState('')
  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const res = await getAllUserApi()

      if (res.status === 200) {
        setUser(res.data.info)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeStatus = async (data) => {
    try {
      const req = {
        userid: data.id,
        status: data.status,
      }
      const response = await updateUserApi(req)
     
      if (response.status === 200) {
        setUser((prevState) =>
          prevState.map((item) =>
            item._id === data.id ? { ...item, status: response.data.info.status } : item,
          ),
        )
        toast.success('Status changed successfully')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    fetchUser()
  }, [])

  const columns = [
    {
      name: 'name',
      label: 'Name',
    },
    {
      name: 'email',
      label: 'Email',
    },
    {
      name: 'phone_number',
      label: 'Phone',
    },
    {
      name: 'image',
      label: 'Image',
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value) => {
          return (
            <img
              src={value}
              alt="user"
              style={{ width: '50px', height: '50px' }}
              onClick={() => {
                setImage(value)
                setVisible(true)
              }}
            />
          )
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRender: (value, { rowIndex }) => {
          const { status, _id } = user[rowIndex]
          return (
            <Switch
              checked={value}
              onChange={() => {
                handleChangeStatus({ id: _id, status: !status })
              }}
            />
          )
        },
      },
    },
  ]

  const options = {
    selectableRows: 'none',
  }
  return (
    <>
      <ToastContainer />

      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="spinner-color" />
        </div>
      ) : (
        <>
          <MUIDataTable title={'User'} data={user} columns={columns} options={options} />
          <CRow>
            <CCol md={12}>
              <CModal
                alignment="center"
                backdrop="static"
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel"
              >
                <CModalHeader>Image Preview</CModalHeader>

                <CModalBody>
                  <img
                    src={image}
                    alt="city"
                    style={{ height: '100%', width: '100%' }}
                    className="cityimage"
                  />
                </CModalBody>
              </CModal>
            </CCol>
          </CRow>
        </>
      )}
    </>
  )
}

export default User
