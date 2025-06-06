import {
  getAllFaqApi,
  editFaqApi,
  deleteFaqApi,
  deleteMultipleFaqApi,
} from '../../../redux/api/api'
import { useState, useEffect } from 'react'
import { Button, Switch, IconButton } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MUIDataTable from 'mui-datatables'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { CSpinner } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const Faq = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [faq, setFaq] = useState([])
  const navigate = useNavigate()

  const fetchFaq = async () => {
    try {
      setIsLoading(true)
      const res = await getAllFaqApi()
      if (res.status === 200) {
        setFaq(res.data.info)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeStatus = async (data) => {
    try {
      const requestData = {
        id: data.id,
        status: data.status,
      }
      const res = await editFaqApi(requestData)
      if (res.status === 200) {
        toast.success('Status updated successfully')
        setFaq(faq.map((item) => (item._id === data.id ? { ...item, status: data.status } : item)))
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    try {
      setIsLoading(true)
      const requestData = {
        id: id,
      }
      const res = await deleteFaqApi(requestData)
      if (res.status === 200) {
        toast.success('Faq deleted successfully')
        setFaq(faq.filter((item) => item._id !== id))
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMultipleFaqs = async (selectedRows) => {
    const ids = selectedRows.data.map((row) => faq[row.dataIndex]._id)

    const confirm = await swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete the selected FAQs?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      try {
        setIsLoading(true)
        const response = await deleteMultipleFaqApi({ ids })
        if (response.status === 200) {
          toast.success('FAQs deleted successfully!')
          setFaq((prevState) => prevState.filter((item) => !ids.includes(item._id)))
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
        <IconButton onClick={() => deleteMultipleFaqs(selectedRows)}>
          <Icons.Delete />
        </IconButton>
      </div>
    )
  }

  SelectedRowsToolbar.propTypes = {
    selectedRows: PropTypes.object.isRequired,
  }

  useEffect(() => {
    fetchFaq()
  }, [])

  const columns = [
    {
      name: 'question',
      label: 'Question',
    },
    {
      name: 'answer',
      label: 'Answer',
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRender: (value, { rowIndex }) => {
          const { status, _id } = faq[rowIndex]
          return (
            <Switch
              checked={status}
              onChange={(e) => handleChangeStatus({ id: _id, status: !status })}
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
          const data = faq[rowIndex]
          return (
            <div className="d-flex gap-2">
              <Button
                color="error"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'You want to delete this faq?',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true,
                  })
                  if (confirm) {
                    await handleDelete(data._id)
                  }
                }}
              >
                <Icons.DeleteRounded />
              </Button>
              <Button className="editButton" onClick={() => navigate(`/faq/form`, { state: data })}>
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
              onClick={() => navigate('/faq/form')}
            >
              Add Faq
            </Button>
          </div>
          <ToastContainer />
          <MUIDataTable title={'Faq'} data={faq} columns={columns} options={options} />
        </div>
      )}
    </>
  )
}

export default Faq
