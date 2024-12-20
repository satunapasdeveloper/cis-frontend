import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AntrianPoliklinikRawatJalanModel } from 'src/app/model/pages/pelayanan/rawat-jalan/antrian-poliklinik-rawat-jalan.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../../http/http-request.service';

@Injectable({
    providedIn: 'root'
})
export class AntrianPoliklinikRawatJalanService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(query: AntrianPoliklinikRawatJalanModel.IQueryParams): Observable<AntrianPoliklinikRawatJalanModel.GetAll> {
        return this._httpRequestService
            .getRequest(`${environment.webApiUrl}/tr-antrian-poli/getAll`, query)
            .pipe(
                map((result) => {
                    const data: any[] = result.data.rows.map((item: any) => {
                        return {
                            id_register: item.id_register,
                            no_antrian: item.no_antrian,
                            no_register: item.no_register,
                            id_pasien: item.id_pasien,
                            nama_pasien: item.pasien.nama_pasien,
                            no_rekam_medis: item.pasien.no_rekam_medis,
                            gender: item.pasien.gender,
                            tanggal_lahir: item.pasien.tanggal_lahir,
                            tanggal_admisi: item.tanggal_admisi,
                            tanggal_pulang: item.tanggal_pulang,
                            id_poli: item.id_poli,
                            nama_poli: item.poli.nama_poli,
                            id_jadwal_dokter: item.id_jadwal_dokter,
                            id_hari: item.jadwal_dokter.id_hari,
                            jam_mulai: item.jadwal_dokter.jam_mulai,
                            jam_selesai: item.jadwal_dokter.jam_selesai,
                            id_dokter: item.id_dokter,
                            nama_dokter: item.dokter.nama,
                            id_penjamin: item.id_penjamin,
                            nama_penjamin: item.penjamin.nama_penjamin,
                            is_assessment: item.is_assessment,
                            status_bpjs: item.status_bpjs,
                            status_register: item.status_register,
                        }
                    });

                    // Hitung jumlah pasien berdasarkan id_jadwal_dokter
                    const idJadwalCounts = data.reduce((acc, item) => {
                        acc[item.id_jadwal_dokter] = (acc[item.id_jadwal_dokter] || 0) + 1;
                        return acc;
                    }, {});

                    // Tambahkan field jumlah_pasien ke setiap objek
                    const updatedData = data.map(item => ({
                        ...item,
                        jumlah_pasien: idJadwalCounts[item.id_jadwal_dokter]
                    }));

                    result.data.rows = updatedData;

                    return result;
                })
            )
    }

    panggil(id_register: string) {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-antrian-poli/panggil/${id_register}`);
    }

    tidakHadir(id_register: string) {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-antrian-poli/tidakHadir/${id_register}`);
    }

    mulaiPeriksa(id_register: string) {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-antrian-poli/mulaiPeriksa/${id_register}`);
    }

    selesaiPeriksa(id_register: string) {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/tr-antrian-poli/selesaiPeriksa/${id_register}`);
    }
}
