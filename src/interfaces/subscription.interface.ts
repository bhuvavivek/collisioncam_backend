export interface Subscription {
  _id: string;
  email: string;
  password: string;
  full_name: string;
  address: string;
  phone: string;
  companyName: string;
  website: string;
  industry: string;
  comments: string;
  promotionMethod: string;
  amount: string;
  duration: string;
  userId: string;
  documents: { url: string; publicKey: string }[];
  aboutUs: string;
  createdAt: string;
  expireAt: string;
  status: string;
  isDelete: boolean;
}
