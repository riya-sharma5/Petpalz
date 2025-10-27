import mongoose, { Document, Schema } from "mongoose";
import { Gender, Species } from "../utils/enum";




export interface IPet extends Document {
  petName: string;
  species: Species;
  breed: string;  
  gender: Gender;  
  dateOfBirth: Date;
  age: number;
  userId: mongoose.Types.ObjectId;
}


const petSchema: Schema<IPet> = new Schema(
  {
    petName: { type: String, required: true},
    species: { type: String, enum: Object.values(Species), required: true},
    breed: { type: String, required: true },

    gender: {
      type: String,
      enum: Object.values(Gender), 
      required: true,
    },

    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "pets",
    versionKey: false,
  }
);


const petModel = mongoose.model<IPet>("pets", petSchema);
export default petModel;
