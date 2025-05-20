"use client";
import React, { useState, useEffect } from 'react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { 
  FileText, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Clock, 
  AlertTriangle, 
  Building, 
  DollarSign, 
  Users, 
  HardDrive, 

} from 'lucide-react';
import Filters, { FormData } from '@/components/reports/filters';
import useAssetStore from '@/store/useAssetStore';
import { IAsset } from '@/interfaces/IAsset';
import ReportPreview from '@/components/reports/report-preview';
import TypeDistribution from '@/components/reports/asset-type-distribution';
import ReportCard, { ReportData } from '@/components/reports/report-card';
import ValueDistribution from '@/components/reports/value-distribution';



const Reports = () => {
  const [, setActiveTab] = useState("standard");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedReport, setSelectedReport] = useState("");
  const [filters, setFilters] = useState<FormData>({
    dateFrom: '',
    dateTo: '',
    assetType: '',
    status: '',
    department: '',
    location: '',
    conditions: []
  });
  const [filteredData, setFilteredData] = useState<IAsset[]>([]);

  const {assets,initalize}=useAssetStore()

  useEffect(()=>{
    if(!assets){
      initalize()
    }
    if(assets){
      setFilteredData(assets)
    }

  },[assets])

  // Update filtered data when filters change
  useEffect(() => {
    if(!assets) return;
    let result = assets;

    if (filters.dateFrom) {
      result = result.filter(asset => new Date(asset.purchaseDate ?? "") >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      result = result.filter(asset => new Date(asset.purchaseDate ?? "") <= new Date(filters.dateTo));
    }
    if (filters.assetType) {
      result = result.filter(asset => asset.assetType === filters.assetType);
    }
    if (filters.status) {
      result = result.filter(asset => asset.status === filters.status);
    }
    if (filters.department) {
      result = result.filter(asset => asset.department === filters.department);
    }
    if (filters.location) {
      result = result.filter(asset => asset.location === filters.location);
    }
    if (filters.conditions.length > 0) {
      result = result.filter(asset => filters.conditions.includes(asset.condition));
    }

    setFilteredData(result);
  }, [filters]);

  // Generate chart data
  const assetStatusData = Object.entries(
    filteredData.reduce((acc: Record<string, number>, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  const assetTypeData = Object.entries(
    filteredData.reduce((acc: Record<string, number>, asset) => {
      acc[asset.assetType] = (acc[asset.assetType] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));


  const departmentUsageData = Object.entries(
    filteredData.reduce((acc: Record<string, number>, asset) => {
      if (asset.department !== undefined) {
        acc[asset.department] = (acc[asset.department] || 0) + 1;
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.toUpperCase(), value }));

  const assetValueData = Object.entries(
    filteredData.reduce((acc: Record<string, number>, asset) => {
    acc[asset.assetType] = (acc[asset.assetType] || 0) + Number(asset.value || 0);
    return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));


  const handleGenerateReport = (reportName:string) => {
    setSelectedReport(reportName);
    setShowPreview(true);
  };





  const standardReports = [
    { title: "Asset Inventory Summary", description: "Complete list of all assets with key details", icon: <FileText className="h-8 w-8 text-blue-500" /> },
    { title: "Asset Status Report", description: "Overview of assets by status", icon: <BarChart3 className="h-8 w-8 text-green-500" /> },
    { title: "Asset Distribution by Type", description: "Breakdown of assets by type", icon: <PieChartIcon className="h-8 w-8 text-purple-500" /> },
    { title: "Asset Age Analysis", description: "Analysis of assets by purchase date", icon: <Clock className="h-8 w-8 text-amber-500" /> },
    { title: "Warranty Expiration Report", description: "List of assets with warranty details", icon: <AlertTriangle className="h-8 w-8 text-red-500" /> },
    { title: "Location/Department Distribution", description: "Assets grouped by location and department", icon: <Building className="h-8 w-8 text-indigo-500" /> }
  ];

  const financialReports = [
    { title: "Asset Valuation Summary", description: "Total value of assets by categories", icon: <DollarSign className="h-8 w-8 text-emerald-500" /> },
    { title: "Depreciation Schedule", description: "Asset depreciation based on purchase date", icon: <BarChart3 className="h-8 w-8 text-orange-500" /> },
    { title: "Budget Planning Report", description: "Projections for asset replacement costs", icon: <DollarSign className="h-8 w-8 text-cyan-500" /> }
  ];

  const assignmentReports = [
    { title: "User Assignment Report", description: "Assets assigned to each user", icon: <Users className="h-8 w-8 text-rose-500" /> },
    { title: "Department Allocation", description: "Assets allocated to each department", icon: <Building className="h-8 w-8 text-lime-500" /> },
    { title: "Assignment History", description: "Historical record of asset assignments", icon: <Clock className="h-8 w-8 text-yellow-500" /> }
  ];

  const technicalReports:ReportData[] = [
    { title: "IT Infrastructure Report", description: "Network configurations and technical details", icon: <HardDrive className="h-8 w-8 text-violet-500" /> },
    { title: "Maintenance Schedule", description: "Upcoming and past maintenance activities", icon: <Clock className="h-8 w-8 text-fuchsia-500" /> },
    { title: "Asset Condition Analysis", description: "Breakdown of assets by condition", icon: <AlertTriangle className="h-8 w-8 text-blue-500" /> }
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Asset Reports</h1>
          {assets && 
          <Filters filters={filters} setFilters={setFilters} assets={assets as IAsset[]} />}
        </div>

        <Tabs defaultValue="standard" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standardReports.map((report, index) => (
                <ReportCard key={index} report={report} handleGenerateReport={handleGenerateReport} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {financialReports.map((report, index) => (
                <ReportCard key={index} report={report} handleGenerateReport={handleGenerateReport} />
              ))}
              {/* Value distribution */}
              <ValueDistribution data={assetValueData} title='Asset Value Distribution' description='Total asset value by category' />
              
            </div>
          </TabsContent>

          <TabsContent value="assignment" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignmentReports.map((report, index) => (
               <ReportCard key={index} report={report} handleGenerateReport={handleGenerateReport} />
              ))}
              {/* department usage distribution */}
              <TypeDistribution data={departmentUsageData} title='Department Asset Distribution' description='Assets assigned by department' />
           
            </div>
          </TabsContent>

          <TabsContent value="technical" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technicalReports.map((report, index) => (
               <ReportCard key={index} report={report} handleGenerateReport={handleGenerateReport} />
              ))}

              {/* status overview */}
            <TypeDistribution data={assetStatusData} title='Asset Status Overview' description='Current status of all assets' />
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Asset Type Distribution */}
          <TypeDistribution data={assetTypeData} title={"Asset Type Distribution"} description='Breakdown of assets by type' />

          {/* Asset Status Distribution */}
          <ValueDistribution data={assetStatusData} title={"Asset Status Distribution"} description={"Current status of all assets"} />
        </div>

        <ReportPreview filters={filters} showPreview={showPreview} setShowPreview={setShowPreview} filteredData={filteredData} selectedReport={selectedReport}  />
      </div>
    </div>
  );
};

export default Reports;