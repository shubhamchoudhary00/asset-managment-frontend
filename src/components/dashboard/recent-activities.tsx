"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import useAssetStore from '@/store/useAssetStore'
import { IActivity } from '@/interfaces/IActivity'
import ActivityCard from '../recent-activity/card'
import ActivityDialog from '../recent-activity/activity-dialog'
import { useRouter } from 'next/navigation'
import { generateActivities } from '@/lib/utils'



const RecentActivities = () => {
  const {assets,initalize}=useAssetStore();
  const [acitviites,setActivities]=useState<IActivity[]>([]);
  const [selectedActivity,setSelectedActivity]=useState<IActivity | null>(null);
  const [isDetailsOpen,setIsDetailsOpen]=useState<boolean>(false);
  const router=useRouter();
  useEffect(()=>{
    if(!assets){
      initalize();
    }
    if(assets){
      const activity=generateActivities(assets);
      setActivities(activity);
    }
  },[assets]);

   const viewActivityDetails = (activity: IActivity) => {
      setSelectedActivity(activity);
      setIsDetailsOpen(true);
    };
  return (
    <>
        <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle>Recent Activities</CardTitle>
      <CardDescription>Latest asset movements and changes</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {acitviites.slice(0,3).map((activity,index) => (
         <ActivityCard key={index} activity={activity} viewActivityDetails={viewActivityDetails} />
        ))}
      </div>
    </CardContent>
    <CardFooter className="border-t pt-4">
      <Button variant="outline" onClick={()=>router.push("/activities")} className="w-full">View All Activities</Button>
    </CardFooter>
  </Card>
  <ActivityDialog selectedActivity={selectedActivity} isDetailsOpen={isDetailsOpen} setIsDetailsOpen={setIsDetailsOpen} />

    </>

  )
}

export default RecentActivities
