export interface webDavItem {
  type: 'file' | 'directory';
  basename: string;
  filename: string;
  mime?: string;
  size?: number;
}
