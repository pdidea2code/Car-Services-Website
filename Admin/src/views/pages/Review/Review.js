import React from 'react'
import { Button, Switch, IconButton } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import noprofile from 'src/assets/Profile.png'
import MUIDataTable from 'mui-datatables'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { useState, useEffect } from 'react'
import {
  getAllReviewsApi,
  changeReviewStatusApi,
  deleteReviewApi,
  deleteMultipleReviewsApi,
} from 'src/redux/api/api'
import PropTypes from 'prop-types' // Import PropTypes

const Reviews = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const response = await getAllReviewsApi()
      if (response.status === 200) {
        setReviews(response.data.info)
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
        review_id: data._id,
        status: !data.status,
      }
      const response = await changeReviewStatusApi(req)
      if (response.status === 200) {
        setReviews((prevState) =>
          prevState.map((item) =>
            item._id === data._id ? { ...item, status: response.data.info.status } : item,
          ),
        )
        toast.success('Review status updated successfully')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const handleDeleteReview = async (data) => {
    try {
      setIsLoading(true)
      const req = {
        review_id: data._id,
      }
      const response = await deleteReviewApi(req)
      if (response.status === 200) {
        toast.success('Review deleted successfully')
        setReviews((prevState) => prevState.filter((item) => item._id !== data._id))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMultipleReviews = async (selectedRows) => {
    const ids = selectedRows.data.map((row) => reviews[row.dataIndex]._id)

    const confirm = await swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete the selected reviews?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      try {
        setIsLoading(true)
        const response = await deleteMultipleReviewsApi({ ids })
        if (response.status === 200) {
          toast.success('Reviews deleted successfully!')
          setReviews((prevState) => prevState.filter((item) => !ids.includes(item._id)))
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
        <IconButton onClick={() => deleteMultipleReviews(selectedRows)}>
          <Icons.Delete />
        </IconButton>
      </div>
    )
  }

  SelectedRowsToolbar.propTypes = {
    selectedRows: PropTypes.object.isRequired,
  }

  const handleOpenModal = (review) => {
    setSelectedReview(review)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedReview(null)
  }

  useEffect(() => {
    fetchReviews()
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
      name: 'designation',
      label: 'Designation',
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, { rowData, rowIndex }) => {
          const review = reviews[rowIndex]
          return (
            <Switch
              checked={review.status}
              onChange={() => handleChangeStatus(review)}
              color="primary"
            />
          )
        },
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        sort: false,
        customBodyRender: (value, { rowIndex }) => {
          const review = reviews[rowIndex]
          return (
            <div className="d-flex gap-2">
              <Button
                color="error"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'You want to delete this review?',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true,
                  })
                  if (confirm) {
                    await handleDeleteReview(review)
                  }
                }}
              >
                <Icons.DeleteRounded />
              </Button>
              <Button color="primary" onClick={() => handleOpenModal(review)}>
                <Icons.VisibilityRounded />
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
    responsive: 'standard',
    rowsPerPage: 10,
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
          {/* <div className="right-text">
            <Button
              variant="contained"
              className="add-button"
              onClick={() => navigate('/cartype/form')}
            >
              Add Review
            </Button>
          </div> */}
          <ToastContainer />
          <MUIDataTable title={'Reviews'} data={reviews} columns={columns} options={options} />

          <CModal visible={modalVisible} onClose={handleCloseModal} alignment="center">
            <CModalHeader>
              <CModalTitle>Review Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {selectedReview && (
                <div>
                  <div className="d-flex justify-content-between">
                    <img
                      src={selectedReview.image || noprofile}
                      alt="Review"
                      className="review-image mb-2"
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <p>
                    <strong>Email:</strong> {selectedReview.email}
                  </p>
                  <p>
                    <strong>Designation:</strong> {selectedReview.designation}
                  </p>
                  <p>
                    <strong>Review:</strong> {selectedReview.review}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {selectedReview.order_id}
                  </p>
                  <p>
                    <strong>Created At:</strong>{' '}
                    {new Date(selectedReview.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </CModalBody>
            <CModalFooter>
              <Button color="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </CModalFooter>
          </CModal>
        </>
      )}
    </>
  )
}

export default Reviews
