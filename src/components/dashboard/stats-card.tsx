import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'

const StatsCard = () => {
    const assetData = {
        total: 1247,
        active: 1103,
        inactive: 144,
        categories: {
          laptops: 482,
          desktops: 256,
          servers: 64,
          phones: 288,
          printers: 47,
          networking: 110
        },
        recentActivities: [
          { id: 1, type: 'Laptop', tag: 'LPT-2023-089', action: 'Assigned', user: 'Sarah Johnson', department: 'Marketing', date: '2 hours ago' },
          { id: 2, type: 'Monitor', tag: 'MON-2023-156', action: 'Returned', user: 'Alex Chen', department: 'Development', date: '4 hours ago' },
          { id: 3, type: 'Server', tag: 'SRV-2023-012', action: 'Maintenance', user: 'IT Team', department: 'IT', date: '1 day ago' },
          { id: 4, type: 'Smartphone', tag: 'PHN-2023-201', action: 'New', user: 'Inventory', department: 'IT', date: '2 days ago' }
        ],
        pendingRequests: 8,
        lowStockItems: 5,
        maintenanceNeeded: 12
      };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assetData.total}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="text-green-500 font-medium">+24</span> since last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assetData.active}</div>
                  <Progress value={Math.round((assetData.active / assetData.total) * 100)} className="h-1 mt-2" />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round((assetData.active / assetData.total) * 100)}% of total
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assetData.maintenanceNeeded}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="text-amber-500 font-medium">+3</span> need attention
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assetData.pendingRequests}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="text-blue-500 font-medium">Pending</span> approval
                  </div>
                </CardContent>
              </Card>
            </div>
  )
}

export default StatsCard
