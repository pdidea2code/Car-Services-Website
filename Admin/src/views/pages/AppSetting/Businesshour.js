import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getAllBusinessHourApi } from '../../../redux/api/api'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import MUIDataTable from 'mui-datatables'
import { CSpinner } from '@coreui/react'
import * as Icons from '@mui/icons-material'
import { Button } from '@mui/material'

const BusinessHour = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [businessHour, setBusinessHour] = useState([])
  const navigate = useNavigate()

  const fetchBusinessHour = async () => {
    try {
      const response = await getAllBusinessHourApi()
      if (response.status === 200) {
        setBusinessHour(response.data.info)
      }
    } catch (error) {
      console.error('Error fetching business hour:', error)
    }
  }
  useEffect(() => {
    fetchBusinessHour()
  }, [])

  const columns = [
    {
      name: 'day',
      label: 'Day',
    },
    {
      name: 'open',
      label: 'Open',
      options: {
        customBodyRender: (value, { rowIndex }) => {
          const businessHours = businessHour[rowIndex]
          return <span>{businessHours.is_closed ? 'Closed' : businessHours.open}</span>
        },
      },
    },
    {
      name: 'close',
      label: 'Close',
      options: {
        customBodyRender: (value, { rowIndex }) => {
          const businessHours = businessHour[rowIndex]
          return <span>{businessHours.is_closed ? 'Closed' : businessHours.close}</span>
        },
      },
    },
    {
      name: '_id',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, { rowIndex }) => {
          const businessHours = businessHour[rowIndex]
          return (
            <span>
              <Button
                className="editButton"
                onClick={() => navigate(`/businesshour/form`, { state: businessHours })}
              >
                {' '}
                <Icons.EditRounded />
              </Button>
            </span>
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
            title={'Business Hour'}
            data={businessHour}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </>
  )
}

export default BusinessHour
