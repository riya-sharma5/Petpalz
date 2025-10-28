import mongoose, { Schema, Document } from "mongoose";
import { PlaceType } from "../utils/enum";
export interface IPlace extends Document {
  name: string;
  type: PlaceType;
  description: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number]; 
  };
  image?: string;
  specialDiscounts?: string;
}

const placeSchema = new Schema<IPlace>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(PlaceType), required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    image: { type: String },
    specialDiscounts: { type: String },
  },
  { timestamps: true, collection: "places", versionKey: false }
);


placeSchema.index({ location: "2dsphere" });

const placeModel = mongoose.model<IPlace>("places", placeSchema);
export default placeModel;
