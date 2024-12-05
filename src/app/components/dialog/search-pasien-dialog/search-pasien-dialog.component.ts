import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PostRequestByDynamicFiterModel } from 'src/app/model/http/http-request.model';
import { PasienService } from 'src/app/services/pendaftaran-klinik/pasien/pasien.service';

@Component({
    selector: 'app-search-pasien-dialog',
    standalone: true,
    imports: [
        FormsModule,
        DialogModule,
        CommonModule,
        ButtonModule,
        InputTextModule,
        RadioButtonModule,
        CalendarModule,
    ],
    templateUrl: './search-pasien-dialog.component.html',
    styleUrl: './search-pasien-dialog.component.scss'
})
export class SearchPasienDialogComponent {

    @Output('onSelect') onSelect = new EventEmitter<any>();

    ShowDialog: boolean = false;

    DataPasien: any[] = [];

    TanggalLahir: any;

    Filter: string = "nama_pasien";

    constructor(
        private _router: Router,
        private _pasienService: PasienService,
    ) { }

    handleSearch(keyword: string) {
        let payload: any = {
            page: 1,
            count: 100
        };

        switch (this.Filter) {
            case 'nama_pasien':
                payload.nama_pasien = keyword;
                if (this.TanggalLahir) {
                    payload.tanggal_lahir = formatDate(new Date(this.TanggalLahir), 'yyyy-MM-dd', 'EN');
                }
                break;
            case 'nik':
                payload.nik = keyword;
                break;
            case 'no_rekam_medis':
                payload.no_rekam_medis = keyword;
                break;
            case 'no_kartu':
                payload.no_kartu = keyword;
                break;
            default:
                break;
        };

        this.onSearchPasien(payload);
    }

    private onSearchPasien(payload: any) {
        this._pasienService
            .getAllActive(payload)
            .subscribe((result) => {
                if (result.responseResult) {
                    this.DataPasien = result.data.rows;
                }
            })
    }

    handleSelectPasien(data: any) {
        this.onSelect.emit(data);
        this.ShowDialog = false;
    }

    handleNavigateToPasien() {
        this._router.navigate(['/pasien'], { queryParams: { from_url: 'antrian' } });
    }
}
