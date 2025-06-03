export interface Database {
  public: {
    Tables: {
      spirit_categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          image: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image?: string;
          created_at?: string;
        };
      };
      spirit_subtypes: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string;
          image: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description: string;
          image: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          description?: string;
          image?: string;
          created_at?: string;
        };
      };
      ratings: {
        Row: {
          id: string;
          spirit_id: string;
          rating: number;
          user_id: string;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          spirit_id: string;
          rating: number;
          user_id: string;
          comment: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          spirit_id?: string;
          rating?: number;
          user_id?: string;
          comment?: string;
          created_at?: string;
        };
      };
    };
  };
}