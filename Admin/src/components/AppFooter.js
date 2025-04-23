import React, { useState, useEffect } from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer) // Cleanup on unmount
  }, [])

  return (
    <CFooter>
      <div>
        <span>
          {currentTime.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })}
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
