"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/dashboard/navigation';
import Header from '@/components/dashboard/header';
import StatsCard from '@/components/dashboard/stats-card';
import AssetCategories from '@/components/dashboard/asset-categories';
import AssetStatus from '@/components/dashboard/asset-status';
import RecentActivities from '@/components/dashboard/recent-activities';
import QuickActions from '@/components/dashboard/quick-actions';

export default function ITAssetDashboard() {
  const router=useRouter()

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(!token){
      router.push("/")
    }
  })

  return (
    <div className="flex w-full min-h-screen bg-gray-50 dark:bg-gray-900">
 

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Navigation */}
        <Navigation />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-6">
            {/* Header */}
            <Header />

            {/* Stats Cards */}
            <StatsCard />

            {/* Asset Categories */}
           <AssetCategories />

            {/* Recent Activities and Asset Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Asset Status */}
              <AssetStatus />

              {/* Recent Activities */}
              <RecentActivities />
            </div>

            {/* Quick Actions */}
           <QuickActions />
          </div>
        </main>
      </div>
      
    </div>
  );
}