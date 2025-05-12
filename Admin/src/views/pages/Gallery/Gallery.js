import {
  getAllShowcaseApi,
  editShowcaseApi,
  deleteShowcaseApi,
  deleteMultipleShowcaseApi,
} from '../../../redux/api/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'
import { CSpinner, CModal, CModalHeader, CModalTitle, CModalBody, CRow, CCol } from '@coreui/react'
import MUIDataTable from 'mui-datatables'
import * as Icons from '@mui/icons-material'
import { Button, Switch, IconButton } from '@mui/material'
import swal from 'sweetalert'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types' // Import PropTypes

const Gallery = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [gallery, setGallery] = useState([])
  const [viewImage, setViewImage] = useState(false)
  const [image, setImage] = useState('')

  const fetchGallery = async () => {
    try {
      setIsLoading(true)
      const response = await getAllShowcaseApi()
      if (response.status === 200) {
        setGallery(response.data.info)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeStatus = async (data) => {
    try {
      const { id, status } = data
      const requestData = {
        id,
        status,
      }

      const response = await editShowcaseApi(requestData)
      if (response.status === 200) {
        setGallery(gallery.map((item) => (item._id === id ? { ...item, status } : item)))
        toast.success('Status updated successfully')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const handleDeleteGallery = async (data) => {
    try {
      const { _id } = data
      const requestData = {
        id: _id,
      }
      const response = await deleteShowcaseApi(requestData)
      if (response.status === 200) {
        toast.success('Gallery deleted successfully')
        setGallery(gallery.filter((item) => item._id !== _id))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const deleteMultipleGallery = async (selectedRows) => {
    const ids = selectedRows.data.map((row) => gallery[row.dataIndex]._id)

    const confirm = await swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete the selected gallery items?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      try {
        setIsLoading(true)
        const response = await deleteMultipleShowcaseApi({ ids })
        if (response.status === 200) {
          toast.success('Gallery items deleted successfully!')
          setGallery((prevState) => prevState.filter((item) => !ids.includes(item._id)))
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
        <IconButton onClick={() => deleteMultipleGallery(selectedRows)}>
          <Icons.Delete />
        </IconButton>
      </div>
    )
  }

  SelectedRowsToolbar.propTypes = {
    selectedRows: PropTypes.object.isRequired,
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  const columns = [
    {
      name: 'image',
      label: 'Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return (
            <img
              src={value}
              alt="gallery"
              style={{ width: '200px', height: '200px' }}
              onClick={() => {
                setViewImage(true)
                setImage(value)
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
        filter: false,
        sort: false,
        customBodyRender: (value, { rowIndex }) => {
          const { status, _id } = gallery[rowIndex]
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
      name: '_id',
      label: 'Action',
      options: {
        sort: false,
        customBodyRender: (value, { rowIndex }) => {
          const data = gallery[rowIndex]
          return (
            <div className="d-flex gap-2">
              <Button
                color="error"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'You want to delete this gallery item?',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true,
                  })
                  if (confirm) {
                    await handleDeleteGallery(data)
                  }
                }}
              >
                <Icons.DeleteRounded />
              </Button>
              <Button
                className="editButton"
                onClick={() => navigate(`/gallery/form`, { state: data })}
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
          <div>
            <div className="right-text">
              <Button
                variant="contained"
                className="add-button"
                onClick={() => navigate('/gallery/form')}
              >
                Add Gallery
              </Button>
            </div>
            <ToastContainer />
            <MUIDataTable title={'Gallery'} data={gallery} columns={columns} options={options} />
            <CRow>
              <CCol md={12}>
                <CModal
                  backdrop="static"
                  visible={viewImage}
                  onClose={() => setViewImage(false)}
                  aria-labelledby="StaticBackdropExampleLabel"
                >
                  <CModalHeader>
                    <CModalTitle>Image Preview</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <img src={image} alt="Event" className="cityimage" />
                  </CModalBody>
                </CModal>
              </CCol>
            </CRow>
          </div>
        </>
      )}
    </>
  )
}

export default Gallery
