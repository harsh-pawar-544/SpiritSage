// Inside SpiritSubtypesPage.tsx

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subtypes.map(subtype => (
          <div
            key={subtype.id}
            className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
              {/* Subtype Card Header */}
              <div
                className="relative aspect-[4/3] cursor-pointer"
                onClick={() => navigate(`/subtype/${subtype.id}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/subtype/${subtype.id}`);
                  }
                }}
              >
                <TransitionImage
                  src={subtype.image}
                  alt={subtype.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">{subtype.name}</h3>
                  <p className="text-sm text-gray-200 line-clamp-2">{subtype.description}</p>
                </div>
              </div>

              {/* Related Spirits/Brands Section */}
              <div className="p-4">
                <RelatedSpirits subtypeId={subtype.id} />
              </div>
            </div>
          </div> // <--- This closing div corresponds to the first one in the map
        ))}