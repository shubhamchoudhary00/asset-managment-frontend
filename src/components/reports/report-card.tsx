import React, { JSX } from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

export interface ReportData{
    title:string;
    description:string;
    icon: JSX.Element;
}
 interface ReportProps{
    report:ReportData
    handleGenerateReport:(data:string)=>void;
}
const ReportCard = ({report,handleGenerateReport}:ReportProps) => {
  return (
    <Card className="flex flex-col">
    <CardHeader>
      <div className="flex items-center space-x-4">
        {report.icon}
        <CardTitle>{report.title}</CardTitle>
      </div>
      <CardDescription>{report.description}</CardDescription>
    </CardHeader>
    <CardFooter className="flex justify-end mt-auto">
      <Button onClick={() => handleGenerateReport(report.title)}>
        View Report
      </Button>
    </CardFooter>
  </Card>
  )
}

export default ReportCard
