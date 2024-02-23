import { model, Schema, Document } from "mongoose";
import { PaymentInterface } from "@/interfaces/payment.interface";
interface Product {
  _id: string; // Assuming _id is a string, adjust accordingly
  name: string;
  price: number;
  thumbnail: string;
  description: string;
  // Add any other fields related to a product
}

const paymentSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
    },

    expireAt: {
      type: String,
    },

    date: {
      type: String,
      default: Date.now(),
    },

    amount: {
      type: String,
    },

    type: {
      type: String,
    },

    products: [
      {
        type: new Schema<Product>({
          _id: { type: String, required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          thumbnail: { type: String, required: true },
          video: { type: String, required: true },
          description: { type: String },
          // Add any other fields related to a product
        }),
        required: false, // Make the array optional
      },
    ],

    status: {
      type: String,
      enum: ['pending', 'success', 'rejected'],
      default: 'pending'
    },

    secretkey: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const paymentModel = model<PaymentInterface & Document>(
  "Payment",
  paymentSchema
);

export default paymentModel;
