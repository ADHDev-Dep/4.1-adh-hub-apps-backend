export interface UserProfile {
  id: string;
  email: string;
  name: string;
  paternal_surname: string;
  maternal_surname: string;
  is_active: boolean;
  role: 'ADMIN' | 'USER'; // Coincide con tu ENUM de Postgres
  created_at: string;
}
