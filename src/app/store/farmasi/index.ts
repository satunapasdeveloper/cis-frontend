import { FARMASI_PURCHASING_STATE } from "./purchasing-order";
import { FARMASI_SETUP_DATA_STATE } from "./setup-data";

export const FARMASI_STATE = [
    ...FARMASI_SETUP_DATA_STATE,
    ...FARMASI_PURCHASING_STATE,
]