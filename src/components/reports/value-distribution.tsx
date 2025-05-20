import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface Props{
    title:string;
    description:string;
    data:{name:string;value:number | unknown}[]
}

const ValueDistribution = ({title,description,data}:Props) => {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="Value ($)" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
  )
}

export default ValueDistribution
