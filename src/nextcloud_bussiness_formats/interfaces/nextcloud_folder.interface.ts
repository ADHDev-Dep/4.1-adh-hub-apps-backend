export interface NextcloudFolder {
  name: string;
  path: string;
  files: { name: string; path: string }[];
  children: NextcloudFolder[];
}
