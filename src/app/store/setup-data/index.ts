import { SetupItemState } from "./item";
import { SetupKelasState } from "./kelas";
import { ManajemenUserState } from "./manajemen-user";
import { RekananPenunjangState } from "./rekanan-penunjang";
import { SetupPoliState } from "./setup-poli";
import { SetupTindakanMedisState } from "./tindakan-medis";
import { SetupUnitState } from "./unit";

export const SETUP_DATA_STATE = [
    SetupPoliState,
    SetupItemState,
    SetupTindakanMedisState,
    ManajemenUserState,
    RekananPenunjangState,
    SetupKelasState,
    SetupUnitState,
]