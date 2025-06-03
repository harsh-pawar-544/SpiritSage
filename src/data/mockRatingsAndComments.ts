export interface Rating {
  id: string;
  spiritId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}

export const mockRatings: Rating[] = [
  {
    id: "1",
    spiritId: "highland-single-malt",
    userId: "user1",
    rating: 5,
    comment: "Exceptional balance of flavors. The maritime influence really shines through.",
    createdAt: "2024-03-15T10:30:00Z",
    userName: "Whiskey Enthusiast"
  },
  {
    id: "2",
    spiritId: "highland-single-malt",
    userId: "user2",
    rating: 4,
    comment: "Lovely honey notes with a subtle smokiness. Very enjoyable.",
    createdAt: "2024-03-14T15:45:00Z",
    userName: "Spirit Explorer"
  },
  {
    id: "3",
    spiritId: "london-dry-gin",
    userId: "user3",
    rating: 5,
    comment: "Perfect balance of botanicals. Makes an exceptional martini.",
    createdAt: "2024-03-13T09:20:00Z",
    userName: "Gin Connoisseur"
  }
];

export const getRatingsForSpirit = (spiritId: string): Rating[] => {
  return mockRatings.filter(rating => rating.spiritId === spiritId);
};