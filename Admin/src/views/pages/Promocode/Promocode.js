import React from 'react'
import { Button, Switch } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CSpinner } from '@coreui/react'
import MUIDataTable from 'mui-datatables'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { useState, useEffect } from 'react'
import { getAllPromocodeApi, deletePromocodeApi, editPromocodeApi } from 'src/redux/api/api'

const PromoCode = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [promoCodes, setPromoCodes] = useState([])

  const fetchPromoCodes = async () => {
    try {
      setIsLoading(true)
      const response = await getAllPromocodeApi()
      if (response.status === 200) {
        setPromoCodes(response.data.info)
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
        isActive: data.isActive,
      }
      const response = await editPromocodeApi(req)
      if (response.status === 200) {
        setPromoCodes((prevState) =>
          prevState.map((item) =>
            item._id === data.id ? { ...item, isActive: response.data.info.isActive } : item,
          ),
        )
        toast.success('Promo Code status updated successfully')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const handleDeletePromoCode = async (data) => {
    try {
      setIsLoading(true)
      const req = {
        id: data._id,
      }
      const response = await deletePromocodeApi(req)
      if (response.status === 200) {
        toast.success('Promo Code deleted successfully')
        setPromoCodes((prevState) => prevState.filter((item) => item._id !== data._id))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const columns = [
    {
      name: 'title',
      label: 'Title',
    },
    {
      name: 'code',
      label: 'Code',
    },
    {
      name: 'discountType',
      label: 'Discount Type',
    },
    {
      name: 'discountValue',
      label: 'Discount Value',
    },
    {
      name: 'maxUses',
      label: 'Max Uses',
      options: {
        customBodyRender: (value) => (value === -1 ? 'Unlimited' : value),
      },
    },
    {
      name: 'usesCount',
      label: 'Uses Count',
    },
    {
      name: 'totalDiscountAmount',
      label: 'Total Discount Amount',
    },
    {
      name: 'startDate',
      label: 'Start Date',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString(),
      },
    },
    {
      name: 'expirationDate',
      label: 'Expiration Date',
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString(),
      },
    },
    {
      name: 'isActive',
      label: 'Status',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, { rowIndex }) => {
          const { isActive, _id } = promoCodes[rowIndex]
          return (
            <Switch
              checked={isActive}
              onChange={() => handleChangeStatus({ id: _id, isActive: !isActive })}
            />
          )
        },
      },
    },
    {
      name: 'code',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, { rowIndex }) => {
          const data = promoCodes[rowIndex]
          return (
            <div className="d-flex gap-2">
              <Button
                color="error"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'You want to delete this promo code?',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true,
                  })
                  if (confirm) {
                    await handleDeletePromoCode(data)
                  }
                }}
              >
                <Icons.DeleteRounded />
              </Button>
              <Button
                className="editButton"
                onClick={() => navigate(`/promocode/form`, { state: data })}
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
    selectableRows: 'none',
    responsive: 'standard',
    tableBodyHeight: 'auto',
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
              onClick={() => navigate('/promocode/form')}
            >
              Add Promo Code
            </Button>
          </div>
          <ToastContainer />
          <MUIDataTable
            title={'Promo Codes'}
            data={promoCodes}
            columns={columns}
            options={options}
          />
        </>
      )}
    </>
  )
}

export default PromoCode
