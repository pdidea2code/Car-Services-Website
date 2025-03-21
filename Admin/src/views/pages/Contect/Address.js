import { getAllAddressApi, editAddressApi, deleteAddressApi } from 'src/redux/api/api'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MUIDataTable from 'mui-datatables'
import { Button, Switch, Tooltip } from '@mui/material'
import * as Icons from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { CSpinner } from '@coreui/react'
import swal from 'sweetalert'

const Address = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState([])
  const navigate = useNavigate()
  const fetchAddress = async () => {
    try {
      setIsLoading(true)
      const response = await getAllAddressApi()
      if (response.status === 200) {
        setAddress(response.data.info)
      }
      setIsLoading(false)
    } catch (error) {
      console.error(error)  
      toast.error(error?.response?.data?.message||'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  const handleChangeStatus = async (data) => {
    try {
      const { id, status } = data
      const requestData = {
        id: id,
        status,
      }
      const response = await editAddressApi(requestData)
      if (response.status === 200) {
        toast.success('Address updated successfully')
        setAddress(address.map((item) => (item._id === id ? { ...item, status } : item)))
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message||'Something went wrong')
    }
  }
  const handleDeleteAddress = async (id) => {
    try {
        const requestData = {
            id: id,
        }
      const response = await deleteAddressApi(requestData)
      if (response.status === 200) {
        toast.success('Address deleted successfully')
        setAddress(address.filter((item) => item._id !== id))
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message||'Something went wrong')
    }
  }
  useEffect(() => {
    fetchAddress()
  }, [])
  const columns = [
    {
      name: 'city',
      label: 'city',
    },
    {
      name: 'address',
      label: 'address',
    },
    {
        name: 'country',
        label: 'country',
    },
    {
        name: 'phone',
        label: 'phone',
    },
    {
        name: 'email',
        label: 'email',
    },
    {
        name: 'status',
        label: 'status',
        options: {
            customBodyRender: (value, { rowIndex }) => {
                const { status, _id } = address[rowIndex]
                return <Switch checked={status} onChange={() => handleChangeStatus({ id: _id, status: !status })} />
            }
        }   
    },
    {
        name: 'action',
        label: 'action',
        options: {
            filter: false,
            sort: false,
            customBodyRender: (value, { rowIndex }) => {
                const data = address[rowIndex]
                return(
                    <div className="d-flex gap-2">
                        <Button color="error" onClick={async () => {
                            const confirm = await swal({
                                title: 'Are you sure?',
                                text: 'You want to delete this address?',
                                icon: 'warning',
                                buttons: true,
                                dangerMode: true,
                            })
                            if (confirm) {
                                await handleDeleteAddress(data._id)
                            }
                        }}><Icons.DeleteRounded /></Button>
                        <Button className="editButton" onClick={() => navigate(`/address/form`,{state: data})}><Icons.EditRounded /></Button>
                    </div>
                )
            }
        }
    },
  ]
  const options = {
   
    selectableRows: 'none',
  
  }
  
  return (
    <>
    {isLoading ? (
      <div className="d-flex justify-content-center">
        <CSpinner className="theme-spinner-color" />
      </div>
    ) : (
      <div>
        <div className="right-text">
          <Button
            className="add-button"
            variant="contained"
            onClick={() => navigate('/address/form')}
          >
            Add Address
          </Button>
        </div>
        <ToastContainer />  
        <MUIDataTable
          title="Address List"
          data={address}
          columns={columns}
          options={options}
        />
    
      </div>
    )}
    </>
  );
};

export default Address;
