import mongoose, { Schema, Document } from "mongoose";
import { PlaceType } from "../utils/enum";

export interface IPlace extends Document {
  name: string;
  type: PlaceType;
  description: string;
  city: string;
  state: string;
  zipcode: string;
  address: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  image: string[];
  specialDiscounts: string;
}

const placeSchema = new Schema<IPlace>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(PlaceType), required: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
    },
   image: { type: [String], default: [] },

    specialDiscounts: { type: String },
  },
  { timestamps: true, collection: "places", versionKey: false }
);

const placeModel = mongoose.model<IPlace>("places", placeSchema);
export default placeModel;
