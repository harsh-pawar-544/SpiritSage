import React, { useState } from 'react';
import { History, X, Download, Trash2 } from 'lucide-react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';
import ConfirmationModal from './ConfirmationModal';

const UserHistoryButton: React.FC = () => {
  const { getUserHistory, clearHistory, exportHistory } = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const history = getUserHistory();

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative">
            <History className="w-5 h-5" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {history.length}
              </span>
            )}
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl z-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-semibold">
                Interaction History
              </Dialog.Title>
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportHistory}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  title="Export history"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-red-500"
                  title="Clear history"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <Dialog.Close className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X className="w-5 h-5" />
                </Dialog.Close>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto space-y-4">
              {history.length > 0 ? (
                history.map(interaction => (
                  <div
                    key={interaction.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="capitalize font-medium">
                        {interaction.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(interaction.timestamp), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    {interaction.rating && (
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Rating: {interaction.rating} stars
                      </div>
                    )}
                    {interaction.comment && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        "{interaction.comment}"
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No interaction history yet
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ConfirmationModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearHistory();
          setShowClearConfirm(false);
        }}
        title="Clear History"
        message="Are you sure you want to clear your interaction history? This action cannot be undone."
        confirmText="Clear History"
      />
    </>
  );
};

export default UserHistoryButton;