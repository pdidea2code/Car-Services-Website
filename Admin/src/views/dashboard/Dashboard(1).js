import KPIDashboard from './KPIDashboard'
import RecentActivity from './RecentActivity'
import OrderStatusBreakdown from './OrderStatusBreakdown'
import TopServicesAndAddons from './TopServicesAndAddons'
import SystemHealthAlerts from './SystemHealthAlerts'
const Dashboard = () => {
  return (
    <>
      <KPIDashboard />
      <RecentActivity />
      <OrderStatusBreakdown />
      <TopServicesAndAddons />
      <SystemHealthAlerts />
    </>
  )
}

export default Dashboard
