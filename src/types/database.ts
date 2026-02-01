export type Database = {
  app: {
    Tables: {
      concentrate_events: {
        Row: {
          id: string;
          concentrate: string;
          event_date: string;
          quantity: number;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id: string;
          concentrate: string;
          event_date: string;
          quantity: number;
          created_by: string;
        };
      };
    };
  };
};
