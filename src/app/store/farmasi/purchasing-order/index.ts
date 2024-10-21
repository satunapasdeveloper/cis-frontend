import { PurchasingOrderState } from "./pemesanan-po";
import { PenerimaanBarangState } from "./penerimaan-barang";
import { PenerimaanKonsinyasiState } from "./penerimaan-konsinyasi";
import { ReturKonsinyasiState } from "./retur-konsinyasi";
import { ReturPenerimaanState } from "./retur-penerimaan";

export const FARMASI_PURCHASING_STATE = [
    PurchasingOrderState,
    PenerimaanBarangState,
    ReturPenerimaanState,
    PenerimaanKonsinyasiState,
    ReturKonsinyasiState
];