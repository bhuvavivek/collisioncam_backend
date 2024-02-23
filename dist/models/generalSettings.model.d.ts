import { GeneralSettings } from "../interfaces/generalSettings.interface";
import { Document } from "mongoose";
declare const generalSettingsModel: import("mongoose").Model<GeneralSettings & Document<any, any, any>, {}, {}>;
export default generalSettingsModel;
