import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MUIDataTable from 'mui-datatables'
import { Button, Checkbox, IconButton } from '@mui/material'
import * as Icons from '@mui/icons-material'
import { CSpinner } from '@coreui/react'
import swal from 'sweetalert'
import {
  getAllContentApi,
  updateContentApi,
  deleteContentApi,
  deleteMultipleContentApi,
} from '../../../redux/api/api'
import PropTypes from 'prop-types' // Import PropTypes

const Content = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState([])
  const navigate = useNavigate()

  const fetchContent = async () => {
    try {
      setIsLoading(true)
      const response = await getAllContentApi()
      if (response.status === 200) {
        setContent(response.data.info)
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeStatus = async (data) => {
    try {
      const { id, seen } = data
      const request = {
        id: id,
        status: seen,
      }
      const response = await updateContentApi(request)
      if (response.status === 200) {
        toast.success('Content status updated successfully')
        setContent(
          content.map((item) =>
            item._id === id ? { ...item, seen: response.data.info.seen } : item,
          ),
        )
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDeleteContent = async (id) => {
    try {
      const response = await deleteContentApi({ id })
      if (response.status === 200) {
        toast.success('Content deleted successfully')
        setContent(content.filter((item) => item._id !== id))
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }

  const deleteMultipleContent = async (selectedRows) => {
    const ids = selectedRows.data.map((row) => content[row.dataIndex]._id)

    const confirm = await swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete the selected content entries?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      try {
        setIsLoading(true)
        const response = await deleteMultipleContentApi({ ids })
        if (response.status === 200) {
          toast.success('Content entries deleted successfully!')
          setContent((prevState) => prevState.filter((item) => !ids.includes(item._id)))
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
        <IconButton onClick={() => deleteMultipleContent(selectedRows)}>
          <Icons.Delete />
        </IconButton>
      </div>
    )
  }

  SelectedRowsToolbar.propTypes = {
    selectedRows: PropTypes.object.isRequired,
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const columns = [
    {
      name: 'name',
      label: 'Name',
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        customBodyRender: (value) => {
          return <a href={`mailto:${value}`}>{value}</a>
        },
      },
    },
    {
      name: 'message',
      label: 'Message',
    },
    {
      name: 'createdAt',
      label: 'Created At',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleString(),
      },
    },
    {
      name: 'seen',
      label: 'Seen',
      options: {
        customBodyRender: (value, { rowIndex }) => {
          const { seen, _id } = content[rowIndex]
          return (
            <Checkbox
              checked={seen}
              onChange={() => handleChangeStatus({ id: _id, seen: !seen })}
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
          const data = content[rowIndex]
          return (
            <div className="d-flex gap-2">
              <Button
                color="error"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'You want to delete this content?',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true,
                  })
                  if (confirm) {
                    await handleDeleteContent(data._id)
                  }
                }}
              >
                <Icons.DeleteRounded />
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
          <ToastContainer />
          <MUIDataTable
            title="Contact Us List"
            data={content}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </>
  )
}

export default Content
