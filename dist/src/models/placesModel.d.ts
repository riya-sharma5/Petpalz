import mongoose, { Document } from "mongoose";
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
declare const placeModel: mongoose.Model<IPlace, {}, {}, {}, mongoose.Document<unknown, {}, IPlace, {}, {}> & IPlace & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default placeModel;
//# sourceMappingURL=placesModel.d.ts.map