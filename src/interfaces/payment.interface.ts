
export interface PaymentInterface {
  _id: string;
  name: string;
  email: string;
  date: string;
  amount: string;
  type: string;
  createdAt: string;
  status: string;
  secretkey: string;
  expireAt: string;
  products: [];
}
