// Service.jsx
import { useState, useEffect } from 'react'
import { getAllServiceApi, softDeleteServiceApi, editServiceApi } from 'src/redux/api/api'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MUIDataTable from 'mui-datatables'
import { Button, Switch, Tooltip } from '@mui/material'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { CSpinner } from '@coreui/react'

const Service = () => {
  const [service, setService] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const fetchService = async () => {
    setIsLoading(true)
    try {
      const response = await getAllServiceApi()
      if (response.status === 200) {
        setService(response.data.info)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteService = async (data) => {
    try {
      const { _id } = data
      const requestData = {
        id: _id,
      }
      const response = await softDeleteServiceApi(requestData)
      if (response.status === 200) {
        toast.success('Service deleted successfully')
        setService(service.filter((item) => item._id !== _id))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }

  const handleChangeStatus = async (data) => {
    try {
      const { id, status } = data

      const requestData = {
        id: id,
        status,
      }
      const response = await editServiceApi(requestData)
      if (response.status === 200) {
        toast.success('Status changed successfully')
        setService(service.map((item) => (item._id === id ? { ...item, status } : item)))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    fetchService()
  }, [])

  const columns = [
    {
      name: 'name',
      label: 'Name',
    },
    {
      name: 'image',
      label: 'Image',
      options: {
        customBodyRender: (value) => {
          return <img src={value} alt="service" style={{ width: '200px', height: 'auto' }} />
        },
      },
    },
    {
      name: 'price',
      label: 'Price',
    },
    {
      name: 'time',
      label: 'Time (minutes)',
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRender: (value, { rowIndex }) => {
          const { status, _id } = service[rowIndex]
          return (
            <Switch
              checked={status}
              onChange={() => handleChangeStatus({ id: _id, status: !status })}
            />
          )
        },
      },
    },
    {
      name: 'action',
      label: 'Action',
      options: {
        sort: false,
        customBodyRender: (value, { rowIndex }) => {
          const data = service[rowIndex]
          return (
            <div className="d-flex gap-2">
              <Tooltip title="View Details">
                <Button
                  className="editButton w-fit"
                  onClick={() => navigate(`/service/view/${data._id}`, { state: data })}
                >
                  <Icons.VisibilityRounded />
                </Button>
              </Tooltip>
              <Button
                className="w-fit"
                color="error"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'You want to delete this service?',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true,
                  })
                  if (confirm) {
                    await handleDeleteService(data)
                  }
                }}
              >
                <Icons.DeleteRounded />
              </Button>
              <Button
                className="editButton w-fit"
                onClick={() => navigate('/service/form', { state: data })}
              >
                <Icons.EditRounded />
              </Button>
              <Tooltip title="Addons">
                <Button
                  className="editButton w-fit"
                  onClick={() => navigate('/addons', { state: data })}
                >
                  <Icons.AddRounded />
                </Button>
              </Tooltip>
            </div>
          )
        },
      },
    },
  ]

  const options = {
    selectableRows: 'none',
    responsive: 'standard',
    print: false,
    download: true,
    filter: true,
    search: true,
  }

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : (
        <div className="container p-4">
          <div className="right-text mb-4">
            <Button
              className="add-button"
              variant="contained"
              onClick={() => navigate('/service/form')}
            >
              Add Service
            </Button>
          </div>
          <ToastContainer />
          <MUIDataTable title={'Service List'} data={service} columns={columns} options={options} />
        </div>
      )}
    </>
  )
}

export default Service
