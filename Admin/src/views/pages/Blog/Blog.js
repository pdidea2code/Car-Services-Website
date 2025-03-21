  import { getAllBlogApi,updateBlogStatusApi,deleteBlogApi } from "../../../redux/api/api"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import MUIDataTable from 'mui-datatables'
import { Button,Switch,Tooltip } from "@mui/material"
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { CSpinner } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const Blog = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [blog, setBlog] = useState([])
  const navigate = useNavigate()
  const fetchBlog = async () => {
    try {
      setIsLoading(true)
      const response = await getAllBlogApi()
      if (response.status === 200) {
        setBlog(response.data.info)
      }

    } catch (error) {
      console.error(error)    
      toast.error(error?.response?.data?.message||'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  } 
  const handleDeleteBlog = async (data) => {
    try {
      setIsLoading(true)
      const request = {
        id: data._id
      }
      const response = await deleteBlogApi(request)
      if (response.status === 200) {
        toast.success('Blog deleted successfully')
        setBlog(blog.filter((item) => item._id !== data._id))
      }
    } catch (error) {
        console.error(error)
      toast.error(error?.response?.data?.message||'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  const handleChangeStatus = async (data) => {
    try {
  
     const request={
      id:data.id,
      status:data.status
     }
      const response = await updateBlogStatusApi(request)
      if (response.status === 200) {
        toast.success('Status updated successfully')
        setBlog(blog.map((item) => (item._id === data.id ? { ...item, status: data.status } : item)))
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message||'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchBlog()
  }, [])
  const columns = [
    {
      name: 'title',
      label: 'Title',
    },
    {
      name: 'description',
      label: 'Description',
    },
    {
      name: 'image',
      label: 'Image',
      options: {
        customBodyRender: (value) => {
          return <img src={value} alt="Blog" style={{ width: '100px', height: '100px' }} />
        }
      }
    },
    {
      name: 'createdAt',
      label: 'Created At',
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>
        }
      }
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRender: (value,{rowIndex}) => {
          const {status,_id} = blog[rowIndex]
          return <Switch checked={status} onChange={() => handleChangeStatus({id:_id,status:!status})} />
        }
      }
    },
    {
      name: 'action',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value,{rowIndex}) => {
          const data = blog[rowIndex]
          return <div className="d-flex gap-2">
            <Button className="w-fit" color="error" onClick={async () => {
              const confirm = await swal({
                title: 'Are you sure?',
                text: 'You want to delete this blog?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
              })
              if (confirm) {
                await handleDeleteBlog(data)
              }
            }}><Icons.DeleteRounded /></Button>
            <Button className="editButton" onClick={() => navigate('/blog/form', { state: data })}><Icons.EditRounded /></Button>
          </div>
        }
      }
    }
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
              onClick={() => navigate('/blog/form')}
            >
              Add Blog
            </Button>
          </div>
          <ToastContainer />
          <MUIDataTable title={'Blog'} data={blog} columns={columns} options={options} />
        </div>
      )}
    </>
  )
}

export default Blog