import React, { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UpdateResult {
  name: string;
  status: 'success' | 'error' | 'skipped';
  imageUrl?: string;
  error?: string;
  reason?: string;
}

const ImageUpdater: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [results, setResults] = useState<UpdateResult[]>([]);

  const updateImages = async () => {
    setIsUpdating(true);
    setResults([]);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-images`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update images');
      }

      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
        toast.success('Spirit images updated successfully!');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Update Spirit Images</h3>
        <button
          onClick={updateImages}
          disabled={isUpdating}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white transition-colors ${
            isUpdating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} />
          <span>{isUpdating ? 'Updating...' : 'Update Images'}</span>
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Spirit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((result, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {result.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-2">
                        {result.status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {result.status === 'error' && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        {result.status === 'skipped' && (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        )}
                        <span>{result.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {result.imageUrl && (
                        <a
                          href={result.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          View Image
                        </a>
                      )}
                      {result.error && <span className="text-red-500">{result.error}</span>}
                      {result.reason && <span className="text-yellow-500">{result.reason}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpdater;