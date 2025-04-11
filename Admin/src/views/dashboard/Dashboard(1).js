import KPIDashboard from './KPIDashboard'
import RecentActivity from './RecentActivity'
import OrderStatusBreakdown from './OrderStatusBreakdown'
import TopServicesAndAddons from './TopServicesAndAddons'
const Dashboard = () => {
  return (
    <>
      <KPIDashboard />
      <RecentActivity />
      <OrderStatusBreakdown />
      <TopServicesAndAddons />
    </>
  )
}

export default Dashboard
