import {
  getAllAddonsApi,
  editAddonsApi,
  deleteAddonsApi,
  getAddonsByServiceApi,
  deleteMultipleAddonsApi,
} from '../../../redux/api/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MUIDataTable from 'mui-datatables'
import { CSpinner } from '@coreui/react'
import { Button, Switch, IconButton } from '@mui/material'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import PropTypes from 'prop-types' // Import PropTypes

const Addons = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [addons, setAddons] = useState([])
  const navigate = useNavigate()
  const { state } = useLocation()

  const fetchAddons = async () => {
    try {
      setIsLoading(true)
      const response = await getAllAddonsApi()
      if (response.status === 200) {
        setAddons(response.data.info)
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Error fetching addons')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAddonsByService = async () => {
    try {
      setIsLoading(true)
      const request = {
        serviceid: state._id,
      }
      const response = await getAddonsByServiceApi(request)
      if (response.status === 200) {
        setAddons(response.data.info)
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Error fetching addons')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeStatus = async (data) => {
    try {
      const request = {
        id: data.id,
        status: data.status,
      }
      const response = await editAddonsApi(request)
      if (response.status === 200) {
        toast.success('Status changed successfully')
        setAddons(
          addons.map((addon) =>
            addon._id === data.id ? { ...addon, status: data.status } : addon,
          ),
        )
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Error changing status')
    }
  }

  const handleDeleteAddons = async (id) => {
    try {
      const request = {
        id: id,
      }
      const response = await deleteAddonsApi(request)
      if (response.status === 200) {
        toast.success('Addon deleted successfully')
        setAddons(addons.filter((addon) => addon._id !== id))
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Error deleting addon')
    }
  }

  const deleteMultipleAddons = async (selectedRows) => {
    const ids = selectedRows.data.map((row) => addons[row.dataIndex]._id)

    const confirm = await swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete the selected addons?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      try {
        setIsLoading(true)
        const response = await deleteMultipleAddonsApi({ ids })
        if (response.status === 200) {
          toast.success('Addons deleted successfully!')
          setAddons((prevState) => prevState.filter((item) => !ids.includes(item._id)))
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Error deleting addons')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const SelectedRowsToolbar = ({ selectedRows }) => {
    return (
      <div>
        <IconButton onClick={() => deleteMultipleAddons(selectedRows)}>
          <Icons.Delete />
        </IconButton>
      </div>
    )
  }

  SelectedRowsToolbar.propTypes = {
    selectedRows: PropTypes.object.isRequired,
  }

  useEffect(() => {
    if (state) {
      fetchAddonsByService()
    } else {
      fetchAddons()
    }
  }, [])

  const columns = [
    {
      name: 'name',
      label: 'Name',
    },
    {
      name: 'price',
      label: 'Price',
    },
    {
      name: 'time',
      label: 'Time (in minutes)',
    },
    {
      name: 'servicename',
      label: 'Service',
    },
    {
      name: 'image',
      label: 'Image',
      options: {
        customBodyRender: (value) => {
          return <img src={value} alt="addon" style={{ width: '50px', height: '50px' }} />
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRender: (value, { rowIndex }) => {
          const { status, _id } = addons[rowIndex]
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
          const data = addons[rowIndex]
          return (
            <div className="d-flex gap-2">
              <Button
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'You want to delete this addon?',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true,
                  })
                  if (confirm) {
                    await handleDeleteAddons(data._id)
                  }
                }}
                color="error"
              >
                <Icons.DeleteRounded />
              </Button>
              <Button
                onClick={() => navigate(`/addons/form`, { state: data })}
                className="editButton"
              >
                <Icons.EditRounded />
              </Button>
            </div>
          )
        },
      },
    },
  ]

  const options = {
    selectableRows: 'multiple', // Enable multiple row selection
    selectableRowsHeader: true, // Show checkbox in header
    customToolbarSelect: (selectedRows) => <SelectedRowsToolbar selectedRows={selectedRows} />,
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
              onClick={() => navigate('/addons/form')}
            >
              Add Addon
            </Button>
          </div>
          <ToastContainer />
          <MUIDataTable title={'Addons'} data={addons} columns={columns} options={options} />
        </div>
      )}
    </>
  )
}

export default Addons
