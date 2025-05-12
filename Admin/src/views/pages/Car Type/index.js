import React from 'react'
import { Button, Switch, IconButton } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CSpinner } from '@coreui/react'
import MUIDataTable from 'mui-datatables'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  getAllCarTypeApi,
  deleteCarTypeApi,
  editCarTypeApi,
  deleteMultipleCarTypeApi,
} from 'src/redux/api/api'

const CarType = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [carType, setCarType] = useState([])

  const fetchCarType = async () => {
    try {
      setIsLoading(true)
      const response = await getAllCarTypeApi()
      if (response.status === 200) {
        setCarType(response.data.info)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeStatus = async (data) => {
    try {
      const req = {
        id: data.id,
        status: data.status,
      }
      const response = await editCarTypeApi(req)
      if (response.status === 200) {
        setCarType((prevState) =>
          prevState.map((item) =>
            item._id === data.id ? { ...item, status: response.data.info.status } : item,
          ),
        )
        toast.success('Car Type status updated successfully')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCarType = async (data) => {
    try {
      setIsLoading(true)
      const req = {
        id: data._id,
      }
      const response = await deleteCarTypeApi(req)
      if (response.status === 200) {
        toast.success('Car Type deleted successfully')
        setCarType((prevState) => prevState.filter((item) => item._id !== data._id))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMultipleCarType = async (selectedRows) => {
    const ids = selectedRows.data.map((row) => carType[row.dataIndex]._id)

    const confirm = await swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete the selected car types?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      try {
        // setIsLoading(true)
        const response = await deleteMultipleCarTypeApi({ ids })
        if (response.status === 200) {
          toast.success('Car Types deleted successfully!')
          setCarType((prevState) => prevState.filter((item) => !ids.includes(item._id)))
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong!')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const SelectedRowsToolbar = ({ selectedRows }) => {
    return (
      <div>
        <IconButton onClick={() => deleteMultipleCarType(selectedRows)}>
          <Icons.Delete />
        </IconButton>
      </div>
    )
  }

  SelectedRowsToolbar.propTypes = {
    selectedRows: PropTypes.object.isRequired,
  }

  useEffect(() => {
    fetchCarType()
  }, [])

  const columns = [
    {
      name: 'name',
      label: 'Name',
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, { rowIndex }) => {
          const { status, _id } = carType[rowIndex]
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
      name: 'name',
      label: 'Action',
      options: {
        sort: false,
        customBodyRender: (value, { rowIndex }) => {
          const data = carType[rowIndex]
          return (
            <div className="d-flex gap-2">
              <Button
                color="error"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'You want to delete this car type?',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true,
                  })
                  if (confirm) {
                    await handleDeleteCarType(data)
                  }
                }}
              >
                <Icons.DeleteRounded />
              </Button>
              <Button
                className="editButton"
                onClick={() => navigate(`/cartype/form`, { state: data })}
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
          <CSpinner className="spinner-color" />
        </div>
      ) : (
        <>
          <div className="right-text">
            <Button
              variant="contained"
              className="add-button"
              onClick={() => navigate('/cartype/form')}
            >
              Add Car Type
            </Button>
          </div>
          <ToastContainer />
          <MUIDataTable title={'Car Type'} data={carType} columns={columns} options={options} />
        </>
      )}
    </>
  )
}

export default CarType
