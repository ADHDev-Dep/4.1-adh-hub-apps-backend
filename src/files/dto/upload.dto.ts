export class UploadDto {
  folio: string;
  provider: string;
  fileType: 'Facturas' | 'Guias';
  date: string;
}
