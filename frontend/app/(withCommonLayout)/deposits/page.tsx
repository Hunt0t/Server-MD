import DepositAmount from '@/components/section/DepositAmount'
import DepositTable from '@/components/section/DepositTable'
import DashboardNavbar from '@/components/shared/Navbar/DashboardNavbar'
import React from 'react'

const DepositsPage = () => {
  return (
    <div>
           <DashboardNavbar/>
           <DepositAmount/>
           <DepositTable/>
    </div>
  )
}

export default DepositsPage