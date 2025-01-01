import React from 'react';
import { Clock, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useVideoHistory } from '../hooks/useVideoHistory';

export function VideoHistory() {
  const { user } = useAuth();
  const { history, loading, error } = useVideoHistory();

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        Failed to load video history
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        No videos generated yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {history.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <video
            src={item.videoUrl}
            className="w-full aspect-video object-cover"
            controls
          />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
              <a
                href={item.videoUrl}
                download
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {item.config.duration}s • {item.config.aspectRatio}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
