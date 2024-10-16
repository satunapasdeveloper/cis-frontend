import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpRequestService } from '../http/http-request.service';
import { HttpBaseResponse, PostRequestByDynamicFiterModel } from 'src/app/model/http/http-request.model';
import { RekamMedisModel } from 'src/app/model/pages/rekam-medis/rekam-medis.model';
import { environment } from 'src/environments/environment';
import { AssesmentModel } from 'src/app/model/pages/rekam-medis/assesment.model';
import { AnamesisModel } from 'src/app/model/pages/rekam-medis/anamesis.model';
import { PemeriksaanFisikModel } from 'src/app/model/pages/rekam-medis/pemeriksaan-fisik.model';
import { DiagnosisModel } from 'src/app/model/pages/rekam-medis/diagnosis.model';
import { TindakanModel } from 'src/app/model/pages/rekam-medis/tindakan.model';
import { ResepModel } from 'src/app/model/pages/rekam-medis/resep.model';
import { BillingModel } from 'src/app/model/pages/rekam-medis/billing.model';
import { KondisiPulangModel } from 'src/app/model/pages/rekam-medis/pulang.model';

@Injectable({
    providedIn: 'root'
})
export class RekamMedisService {

    BodyParts: any[] = [
        { id: 'kulit', label: 'Kulit', keterangan: '' },
        { id: 'kuku', label: 'Kuku', keterangan: '' },
        { id: 'kepala', label: 'Kepala', keterangan: '' },
        { id: 'wajah', label: 'Wajah', keterangan: '' },
        { id: 'mata', label: 'Mata', keterangan: '' },
        { id: 'telinga', label: 'Telinga', keterangan: '' },
        { id: 'hidung', label: 'Hidung', keterangan: '' },
        { id: 'mulut', label: 'Mulut', keterangan: '' },
        { id: 'gigi', label: 'Gigi', keterangan: '' },
        { id: 'leher', label: 'Leher', keterangan: '' },
        { id: 'tenggorokan', label: 'Tenggorokan', keterangan: '' },
        { id: 'tonsil', label: 'Tonsil', keterangan: '' },
        { id: 'dada', label: 'Dada', keterangan: '' },
        { id: 'payudara', label: 'Payudara', keterangan: '' },
        { id: 'punggung', label: 'Punggung', keterangan: '' },
        { id: 'perut', label: 'Perut', keterangan: '' },
        { id: 'genital', label: 'Genital', keterangan: '' },
        { id: 'anus / dubur', label: 'Anus / Dubur', keterangan: '' },
        { id: 'lengan atas', label: 'Lengan Atas', keterangan: '' },
        { id: 'lengan bawah', label: 'Lengan Bawah', keterangan: '' },
        { id: 'jari tangan', label: 'Jari Tangan', keterangan: '' },
        { id: 'kuku tangan', label: 'Kuku Tangan', keterangan: '' },
        { id: 'persendian tangan', label: 'Persendian Tangan', keterangan: '' },
        { id: 'tungkai atas', label: 'Tungkai Atas', keterangan: '' },
        { id: 'tungkai bawah', label: 'Tungkai Bawah', keterangan: '' },
        { id: 'jari kaki', label: 'Jari Kaki', keterangan: '' },
        { id: 'kuku kaki', label: 'Kuku Kaki', keterangan: '' },
        { id: 'persendian kaki', label: 'Persendian Kaki', keterangan: '' },
        { id: 'lainnya', label: 'Lainnya', keterangan: '' }
    ];

    WaktuPemberianObat: any[] = [
        { label: 'Pagi', value: 'Pagi' },
        { label: 'Siang', value: 'Siang' },
        { label: 'Sore', value: 'Sore' },
        { label: 'Lain - Lain', value: 'Lain - Lain' },
    ];

    WaktuSpesifikPemberianObat: any[] = [
        { label: 'Sebelum Makan', value: 'Sebelum Makan' },
        { label: 'Sesudah Makan', value: 'Sesudah Makan' },
        { label: 'Bersamaan Makan', value: 'Bersamaan Makan' },
        { label: 'Lain - Lain', value: 'Lain - Lain' },
    ];

    RutePemberianObat: any[] = [
        { label: 'Injeksi', value: 'Injeksi' },
        { label: 'Oral', value: 'Oral' },
        { label: 'Suppositoria', value: 'Suppositoria' },
        { label: 'Topikal', value: 'Topikal' },
        { label: 'Sublingual', value: 'Sublingual' },
        { label: 'Inhalasi', value: 'Inhalasi' },
    ];

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getRekamMedisPasien() {
        const tindakan: any = localStorage.getItem('tindakan');
        const bmhp: any = localStorage.getItem('bmhp');
        const resep_non_racikan: any = localStorage.getItem('resep_non_racikan');
        const resep_racikan: any = localStorage.getItem('resep_racikan');

        let data_billing = {
            tindakan: JSON.parse(tindakan),
            bmhp: JSON.parse(bmhp),
            resep: [
                ...JSON.parse(resep_non_racikan),
                ...JSON.parse(resep_racikan),
            ],
        };

        return of(data_billing);
    }

    getAll(parameter?: PostRequestByDynamicFiterModel[]): Observable<RekamMedisModel.GetAllRekamMedis> {
        const filter = { filter: parameter ? parameter : [] };
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/GetListRekamMedis`, filter);
    }

    getById(id_pendaftaran: string): Observable<RekamMedisModel.GetByIdRekamMedis> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/RekamMedis/GetRekamMedisByIdPendaftaran/${id_pendaftaran}`);
    }

    getAllVariableRekamMedis(): Observable<RekamMedisModel.GetAllRekamMedisVariable> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/RekamMedis/Variable`);
    }

    createAssesment(payload: AssesmentModel.IAssesment): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/Assessment`, payload);
    }

    createAnamesis(payload: AnamesisModel.IAnamnesis): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/Anamnesis`, payload);
    }

    createPemeriksaanFisik(payload: PemeriksaanFisikModel.IPemeriksaanFisik): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/PemeriksaanFisik`, payload);
    }

    getAllIcd10(keyword?: string): Observable<DiagnosisModel.GetAllIcd10> {
        const payload = {
            cari: keyword ? keyword : ""
        };

        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/GetIcd10`, payload);
    }

    createDiagnosis(payload: DiagnosisModel.IDiagnosisi): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/Diagnosisi`, payload);
    }

    getAllBmhp(keyword?: string): Observable<TindakanModel.GetItemBmhp> {
        const payload = {
            cari: keyword ? keyword : ""
        };

        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/GetItemBmhp`, payload);
    }

    createTindakan(payload: TindakanModel.ITindakan): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/Tindakan`, payload);
    }

    getAllObat(keyword?: string): Observable<TindakanModel.GetItemBmhp> {
        const payload = {
            cari: keyword ? keyword : ""
        };

        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/GetItemObat`, payload);
    }

    createResep(payload: ResepModel.IResep): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/Resep`, payload);
    }

    createKondisiPulang(payload: KondisiPulangModel.IKondisiPulang): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/StatusPulang`, payload);
    }

    getTagihan(id_pendaftaran: string): Observable<BillingModel.GetTagihan> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/satunapas/RekamMedis/GetTagihanByIdPendaftaran/${id_pendaftaran}`);
    }

    createInvoice(payload: BillingModel.IInvoice): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/BuatInvoicePaymnet`, payload);
    }

    getAllHistoryPembayaran(id_pendaftaran: string): Observable<BillingModel.GetAllHistoryPembayaran> {
        const filter = {
            filter: [
                {
                    columnName: "pendaftaran.id_pendaftaran",
                    filter: "equel",
                    searchText: id_pendaftaran,
                    searchText2: "",
                    withOr: true
                }
            ]
        };

        return this._httpRequestService.postRequest(`${environment.webApiUrl}/satunapas/RekamMedis/HistoryPembayaran`, filter);
    }

    batalInvoice(id_pendaftaran: string): Observable<RekamMedisModel.GetByIdRekamMedis> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/satunapas/RekamMedis/BatalInvoice/${id_pendaftaran}`, null);
    }

    updateStatus(id_pendaftaran: string, kode: number): Observable<any> {
        return this._httpRequestService.postRequestWithoutLoading(`${environment.webApiUrl}/satunapas/RekamMedis/UpdateStatusPasien`, {
            id_pendaftaran: id_pendaftaran,
            kode: kode
        });
    }
}
