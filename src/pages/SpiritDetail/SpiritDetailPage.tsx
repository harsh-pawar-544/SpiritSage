import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits, SpiritRating } from '../../contexts/SpiritsContext';
import RatingForm from '../../components/SpiritRating/RatingForm';
import RatingsList from '../../components/SpiritRating/RatingsList';
import ConfirmationModal from '../../components/ConfirmationModal';

const spiritsData = {
  whiskies: {
    name: 'Highland Single Malt Whiskey',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80',
    tastingNotes: 'Rich and smooth with hints of caramel, vanilla, and oak. The palate opens with honeyed sweetness, followed by warm spices and a touch of smoke. A long finish reveals layers of dried fruit and subtle maritime influences.',
    history: 'Crafted in the heart of the Scottish Highlands, this distinguished single malt carries centuries of tradition. The distillery, established in 1826, draws its water from ancient springs filtered through layers of granite.',
    funFacts: 'The unique microclimate of the region, combined with traditional floor malting and copper pot stills, creates a spirit of exceptional character and complexity. The surrounding heather-clad hills contribute to its distinctive flavor profile.'
  },
  gins: {
    name: 'London Dry Gin',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80',
    tastingNotes: 'Crisp and refreshing with prominent juniper notes, followed by citrus peel, coriander, and angelica root. A balanced blend of botanical flavors creates a clean, classic gin profile.',
    history: 'London Dry Gin emerged in the late 19th century as a response to the gin crisis of the previous century. The style became synonymous with quality and purity in gin production.',
    funFacts: 'Despite its name, London Dry Gin doesn\'t have to be made in London. The term refers to the production method rather than the location, requiring all botanicals to be added during distillation.'
  },
  rums: {
    name: 'Caribbean Aged Rum',
    image: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&q=80',
    tastingNotes: 'Deep and complex with notes of tropical fruits, brown sugar, and vanilla. The aging process imparts rich flavors of oak, toffee, and subtle spices, leading to a warm, lingering finish.',
    history: 'Born in the Caribbean islands during the 17th century, rum became an integral part of colonial trade. Each island developed its own distinct style, influenced by local traditions and available resources.',
    funFacts: 'The aging process in the Caribbean is accelerated due to the tropical climate, with rum aging up to three times faster than spirits aged in cooler climates. This phenomenon is known as "tropical aging."'
  },
  tequila: {
    name: 'Premium Blue Agave Tequila',
    image: 'https://images.unsplash.com/photo-1583303341936-c2431a7c9f19?auto=format&fit=crop&q=80',
    tastingNotes: 'Earthy, sweet, with hints of citrus and pepper. The agave\'s natural sweetness is complemented by subtle mineral notes and a smooth, clean finish.',
    history: 'Originates from Mexico, made from the blue agave plant. Traditionally consumed neat or in cocktails like Margarita.',
    funFacts: 'Tequila must be made in specific regions of Mexico to be called tequila legally. The blue agave plant takes 7-10 years to reach maturity before it can be harvested.'
  },
  brandy: {
    name: 'Fine Aged Brandy',
    image: 'https://images.unsplash.com/photo-1609760321567-3be05aa1d95b?auto=format&fit=crop&q=80',
    tastingNotes: 'Warm, fruity, with notes of oak and vanilla. Rich layers of dried fruits and honey are balanced by subtle wood tannins.',
    history: 'Distilled from wine or fermented fruit juice, brandy dates back to the 16th century in Europe.',
    funFacts: 'Cognac and Armagnac are famous types of brandy from France. The word "brandy" comes from the Dutch word "brandewijn," meaning "burned wine."'
  },
  cognac: {
    name: 'Fine Champagne Cognac',
    image: 'https://images.unsplash.com/photo-1608283036724-a24b723a7583?auto=format&fit=crop&q=80',
    tastingNotes: 'Smooth, rich, with hints of caramel and spice. Complex aromas of dried fruit, vanilla, and subtle floral notes lead to a long, elegant finish.',
    history: 'A type of brandy from the Cognac region of France, double-distilled in copper pot stills.',
    funFacts: 'Cognac is aged in French oak barrels for several years. The age classifications (VS, VSOP, XO) indicate the minimum aging period of the youngest brandy in the blend.'
  }
};

const SpiritDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const spirit = id ? spiritsData[id as keyof typeof spiritsData] : null;
  const { getRatingsForSpirit, getUserRatingForSpirit, deleteRating } = useSpirits();
  
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [editingRating, setEditingRating] = useState<SpiritRating | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ratingToDelete, setRatingToDelete] = useState<string | null>(null);

  if (!spirit || !id) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Spirit not found</p>
      </div>
    );
  }

  const ratings = getRatingsForSpirit(id);
  const userRating = getUserRatingForSpirit(id);

  const handleEditRating = (rating: SpiritRating) => {
    setEditingRating(rating);
    setShowRatingForm(true);
  };

  const handleDeleteRating = (ratingId: string) => {
    setRatingToDelete(ratingId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (ratingToDelete) {
      deleteRating(ratingToDelete);
      setRatingToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <Link 
        to="/explore" 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Explore
      </Link>

      <div className="relative">
        <div className="h-[400px] w-full overflow-hidden rounded-xl">
          <img
            src={spirit.image}
            alt={spirit.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
        <h1 className="absolute bottom-8 left-8 text-4xl font-bold text-white">
          {spirit.name}
        </h1>
      </div>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Tasting Notes
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {spirit.tastingNotes}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            History
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {spirit.history}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Fun Facts
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {spirit.funFacts}
          </p>
        </section>

        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Ratings & Reviews
            </h2>
            {!showRatingForm && !userRating && (
              <button
                onClick={() => setShowRatingForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>

          {showRatingForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingRating ? 'Edit Your Review' : 'Write a Review'}
              </h3>
              <RatingForm
                spiritId={id}
                onSuccess={() => {
                  setShowRatingForm(false);
                  setEditingRating(null);
                }}
                initialRating={editingRating?.rating}
                initialComment={editingRating?.comment}
                ratingId={editingRating?.id}
              />
            </div>
          )}

          <RatingsList
            ratings={ratings}
            onEdit={handleEditRating}
            onDelete={handleDeleteRating}
          />
        </section>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete Review"
      />
    </div>
  );
};

export default SpiritDetailPage;