import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MUIDataTable from 'mui-datatables'
import { Button, Checkbox } from '@mui/material'
import * as Icons from '@mui/icons-material'
import { CSpinner } from '@coreui/react'
import swal from 'sweetalert'
import { getAllContentApi, updateContentApi, deleteContentApi } from '../../../redux/api/api'
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
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
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
