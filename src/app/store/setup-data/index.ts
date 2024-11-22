import { SetupBedState } from "./bed";
import { SetupItemState } from "./item";
import { SetupJabatanState } from "./jabatan";
import { SetupKamarState } from "./kamar";
import { SetupKategoriKamarState } from "./kategori-kamar";
import { SetupKelasState } from "./kelas";
import { ManajemenUserState } from "./manajemen-user";
import { SetupPenjaminState } from "./penjamin";
import { RekananPenunjangState } from "./rekanan-penunjang";
import { SetupRoleState } from "./role";
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
    SetupKamarState,
    SetupKategoriKamarState,
    SetupJabatanState,
    SetupBedState,
    SetupPenjaminState,
    SetupRoleState,
]