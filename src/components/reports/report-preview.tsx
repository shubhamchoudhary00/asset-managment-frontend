import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Download } from 'lucide-react'
import { FormData } from './filters';
import { IAsset } from '@/interfaces/IAsset';
import apiClient from '@/utils/apiClient';

interface Props{
    showPreview:boolean;
    setShowPreview:(data:boolean)=>void;
    selectedReport:string;
    filters:FormData;
    filteredData:IAsset[];
}



const ReportPreview = ({showPreview,setShowPreview,selectedReport,filters,filteredData}:Props) => {

  const generatePDF = async () => {
    try {
      // Make the request with responseType: 'blob' to handle binary data
      const response = await apiClient.post("/report/asset-report", {filters:filters,selectedReport:selectedReport}, {
        responseType: 'blob', // Important: tells axios to expect binary data
      });
      
      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = url;
      
      // Set the download attribute with filename
      // You can customize the filename here
      link.setAttribute('download', `asset-report-${new Date().getTime()}.pdf`);
      
      // Append to the document
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Add appropriate error handling/notification for your UI
    }
  };
  return (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
    <DialogContent className="sm:max-w-5xl">
      <DialogHeader>
        <DialogTitle>{selectedReport}</DialogTitle>
        <DialogDescription>
          Report generated on {new Date().toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>
      <div className="bg-gray-100 p-4 h-96 overflow-y-auto border border-gray-300 rounded-md">
        <div className="bg-white p-6 min-h-full shadow-sm">
          <h2 className="text-xl font-bold mb-4">{selectedReport}</h2>
          <p className="text-gray-500 mb-6">Generated on {new Date().toLocaleDateString()} by Admin</p>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Report Summary</h3>
            <p>This report provides a comprehensive overview of the selected assets based on the applied filters.</p>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium">Filter Criteria:</h4>
              <ul className="list-disc list-inside text-sm mt-2">
                <li>Date From: {filters.dateFrom || 'Any'}</li>
                <li>Date To: {filters.dateTo || 'Any'}</li>
                <li>Asset Type: {filters.assetType || 'Any'}</li>
                <li>Status: {filters.status || 'Any'}</li>
                <li>Department: {filters.department || 'Any'}</li>
                <li>Location: {filters.location || 'Any'}</li>
                <li>Conditions: {filters.conditions.length > 0 ? filters.conditions.join(', ') : 'Any'}</li>
              </ul>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium">Report Data:</h4>
              <div className="mt-2">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Mfr</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Dept</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Loc</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Cond</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Value ($)</th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map(asset => (
                      <tr key={asset._id}>
                        <td className="px-2 py-1 text-sm">{asset.assetName}</td>
                        <td className="px-2 py-1 text-sm">{asset.serialNumber}</td>
                        <td className="px-2 py-1 text-sm">{asset.manufacturer}</td>
                        <td className="px-2 py-1 text-sm">{asset.model}</td>
                        <td className="px-2 py-1 text-sm">{asset.assignment?.assignedUser || '-'}</td>
                        <td className="px-2 py-1 text-sm">{asset.status}</td>
                        <td className="px-2 py-1 text-sm">{asset.department}</td>
                        <td className="px-2 py-1 text-sm">{asset.location}</td>
                        <td className="px-2 py-1 text-sm">{asset.condition}</td>
                        <td className="px-2 py-1 text-sm">{asset.value}</td>
                        <td className="px-2 py-1 text-sm">{new Date(asset.purchaseDate ?? "").toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setShowPreview(false)} className="mr-2">
          Close
        </Button>
        <Button className="gap-2" onClick={generatePDF}>
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default ReportPreview
