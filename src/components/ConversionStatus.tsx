import React from 'react';
import { Loader2, CheckCircle, XCircle, Download } from 'lucide-react';
import { ConversionStatus as StatusType } from '../types';

interface StatusProps {
  status: StatusType;
}

export function ConversionStatus({ status }: StatusProps) {
  if (!status) return null;

  const renderStatus = () => {
    switch (status.status) {
      case 'pending':
      case 'processing':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Converting your image...</span>
          </div>
        );
      case 'completed':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Conversion complete!</span>
            </div>
            {status.videoUrl && (
              <a
                href={status.videoUrl}
                download
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Video
              </a>
            )}
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span>{status.error || 'Conversion failed'}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 text-center">
      {renderStatus()}
    </div>
  );
}