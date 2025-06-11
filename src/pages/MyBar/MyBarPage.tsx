import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpirits } from '../../contexts/SpiritsContext';
import { useAuth } from '../../contexts/AuthContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { Search, Trash2, Edit3, Wine } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import toast from 'react-hot-toast';

const MyBarPage: React.FC = () => {
  const { 
    myBarSpirits, 
    removeSpiritFromMyBar, 
    updateMyBarNotes, 
    loadMyBarSpirits 
  } = useSpirits();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSpirit, setEditingSpirit] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadMyBarSpirits();
    }
  }, [user, loadMyBarSpirits]);

  // Add safety check for myBarSpirits and spirit_data
  const filteredSpirits = (myBarSpirits || []).filter(spirit =>
    spirit?.spirit_data?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveSpirit = async (userSpiritRecordId: string, spiritName: string) => {
    if (window.confirm(`Remove ${spiritName} from your bar?`)) {
      try {
        console.log('Removing spirit with record ID:', userSpiritRecordId);
        await removeSpiritFromMyBar(userSpiritRecordId);
        toast.success(`${spiritName} removed from your bar`);
      } catch (error: any) {
        console.error('Failed to remove spirit:', error);
        toast.error(error.message || 'Failed to remove spirit');
      }
    }
  };

  const handleEditNotes = (spirit: any) => {
    setEditingSpirit(spirit);
    setNotes(spirit.notes || '');
    setShowNotesModal(true);
  };

  const handleSaveNotes = async () => {
    if (!editingSpirit) return;

    try {
      await updateMyBarNotes(editingSpirit.id, notes);
      toast.success('Notes updated');
      setShowNotesModal(false);
      setEditingSpirit(null);
      setNotes('');
    } catch (error) {
      toast.error('Failed to update notes');
    }
  };

  const navigateToSpirit = (spirit: any) => {
    switch (spirit.spirit_type) {
      case 'alcohol_type':
        return `/alcohol-type/${spirit.spirit_id}`;
      case 'subtype':
        return `/subtype/${spirit.spirit_id}`;
      case 'brand':
        return `/spirit/${spirit.spirit_id}`;
      default:
        return '/explore';
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Wine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">My Bar</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Sign in to start building your personal spirit collection
        </p>
        <Link
          to="/settings"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // Add safety check for myBarSpirits length
  const spiritsCount = myBarSpirits?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Bar</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {spiritsCount} spirit{spiritsCount !== 1 ? 's' : ''} in your collection
        </p>

        {spiritsCount > 0 && (
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your spirits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {filteredSpirits.length === 0 ? (
        <div className="text-center py-16">
          <Wine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {spiritsCount === 0 ? 'Your Bar is Empty' : 'No Matching Spirits'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {spiritsCount === 0 
              ? 'Start building your collection by exploring spirits and adding them to your bar.'
              : 'Try adjusting your search to find spirits in your collection.'
            }
          </p>
          {spiritsCount === 0 && (
            <Link
              to="/explore"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Explore Spirits
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpirits.map((spirit) => {
            const spiritData = spirit.spirit_data;
            if (!spiritData) return null;

            return (
              <div key={spirit.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <Link to={navigateToSpirit(spirit)} className="block">
                  <div className="relative aspect-[4/3]">
                    <TransitionImage
                      src={spiritData.image_url || spiritData.image || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'}
                      alt={spiritData.name}
                      className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{spiritData.name}</h3>
                      <p className="text-sm text-gray-200 capitalize">
                        {spirit.spirit_type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  {spirit.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                      "{spirit.notes}"
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                    Added: {new Date(spirit.added_at).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditNotes(spirit)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      Notes
                    </button>
                    <button
                      onClick={() => handleRemoveSpirit(spirit.id, spiritData.name)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notes Modal */}
      <Dialog.Root open={showNotesModal} onOpenChange={setShowNotesModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl z-50 p-6">
            <Dialog.Title className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Edit Notes
            </Dialog.Title>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your tasting notes, thoughts, or memories..."
              className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Notes
              </button>
            </div>

            <Dialog.Close className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <span className="sr-only">Close</span>
              ×
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default MyBarPage;
