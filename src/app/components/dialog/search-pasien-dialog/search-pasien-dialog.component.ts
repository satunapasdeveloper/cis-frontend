import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PostRequestByDynamicFiterModel } from 'src/app/model/http/http-request.model';
import { PasienService } from 'src/app/services/pasien/pasien.service';

@Component({
    selector: 'app-search-pasien-dialog',
    standalone: true,
    imports: [
        DialogModule,
        CommonModule,
        ButtonModule,
        InputTextModule
    ],
    templateUrl: './search-pasien-dialog.component.html',
    styleUrl: './search-pasien-dialog.component.scss'
})
export class SearchPasienDialogComponent {

    @Output('onSelect') onSelect = new EventEmitter<any>();

    ShowDialog: boolean = false;

    DataPasien: any[] = [];

    constructor(
        private _router: Router,
        private _pasienService: PasienService,
    ) { }

    handleSearch(keyword: string) {
        if (keyword.length) {
            const parameter: PostRequestByDynamicFiterModel[] = [
                {
                    filter: 'like',
                    columnName: 'nama_lengkap',
                    searchText: keyword.toLowerCase(),
                    searchText2: '',
                    withOr: false
                }
            ];

            this.onSearchPasien(parameter);
        } else {
            this.onSearchPasien();
        }
    }

    private onSearchPasien(parameter?: any[]) {
        this._pasienService
            .getAll(parameter)
            .subscribe((result) => {
                if (result.responseResult) {
                    this.DataPasien = result.data;
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
