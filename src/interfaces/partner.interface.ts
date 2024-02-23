export interface PartnerInterface {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  comment: string;
  document: string;
  documentPublicKey: string;
  status: string;
  createdAt: string;
  aboutUs: string;
  documents: { url: string; publicKey: string }[];
}
