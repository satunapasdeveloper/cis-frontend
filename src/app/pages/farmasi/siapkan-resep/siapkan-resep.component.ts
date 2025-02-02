import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { AntrianResepBaruService } from 'src/app/services/farmasi/antrian/antrian-resep-baru.service';
import { PenjualanObatService } from 'src/app/services/farmasi/penjualan-obat/penjualan-obat.service';
import { ResepService } from 'src/app/services/pelayanan-klinik/rekam-medis/resep.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-siapkan-resep',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        DynamicFormComponent,
        ButtonModule,
        TableModule,
        ConfirmDialogModule,
    ],
    templateUrl: './siapkan-resep.component.html',
    styleUrl: './siapkan-resep.component.scss'
})
export class SiapkanResepComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Kembali',
            icon: 'pi pi-chevron-left'
        },
        {
            id: 'batal',
            title: 'Batalkan Resep',
            icon: 'pi pi-ban'
        },
        {
            id: 'simpan',
            title: 'Simpan',
            icon: 'pi pi-save'
        },
    ];

    GridProps: GridModel.IGrid = {
        id: 'TelaahResep',
        column: [
            { field: 'nama_obat', headerName: 'Nama Obat', class: 'text-xs' },
            { field: 'aturan_pakai', headerName: 'Aturan Pakai', class: 'text-xs' },
            { field: 'rute_pemberian_obat', headerName: 'Rute Pemberian', class: 'text-xs' },
            { field: 'qty', headerName: 'Qty', format: 'number', class: 'text-end text-xs' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        showPaging: false,
        showSearch: false,
        showSort: false,
        searchKeyword: 'nama_pabrik',
        searchPlaceholder: 'Cari Nama Pabrik Disini',
        totalRows: 0,
    };

    SelectedObats: any[] = [];

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _confirmationService: ConfirmationService,
        private _penjualanObatService: PenjualanObatService,
        private _antrianResepBaruService: AntrianResepBaruService,
    ) {
        this.FormProps = {
            id: 'form_informasi_resep',
            fields: [
                {
                    id: 'no_resep',
                    label: 'No. Resep',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_pasien',
                    label: 'Pasien',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_dokter',
                    label: 'Dokter',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_petugas',
                    label: 'Petugas',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_stokroom',
                    label: 'Stokroom',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_poli',
                    label: 'Poli',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'id_dokter',
                    label: 'id_dokter',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'id_stokroom',
                    label: 'id_stokroom',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'id_register',
                    label: 'id_register',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'tanggal_penjualan',
                    label: 'tanggal_penjualan',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'jumlah_item',
                    label: 'Jumlah Item',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'total_harga',
                    label: 'Total Harga',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-3',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
    }

    ngOnDestroy(): void {
        localStorage.removeItem("_SAFSH_");
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        const id_register = this._activatedRoute.snapshot.queryParams['id_register'];

        this._antrianResepBaruService
            .getByIdRegister(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    const selectedResep = JSON.parse(localStorage.getItem("_SAFSH_") as any);

                    this.FormComps.FormGroup.patchValue({
                        id_register: selectedResep.id_register,
                        no_resep: result.data.no_resep,
                        id_stokroom: selectedResep.id_stokroom,
                        nama_stokroom: result.data.stokroom.nama_stokroom,
                        nama_poli: result.data.poli.nama_poli,
                        id_dokter: selectedResep.id_dokter,
                        nama_dokter: result.data.dokter.nama,
                        nama_petugas: result.data.petugas.nama,
                        nama_pasien: result.data.pasien.nama_pasien,
                        jumlah_item: 0,
                        total_harga: 0,
                    });

                    this.GridProps.dataSource = result.data.detail_resep;
                }
            })

    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'back') {
            this._router.navigateByUrl("/farmasi/antrian");
        };

        if (data.id == 'simpan') {
            this.handleSave(this.FormComps.FormGroup.value);
        }
    }

    private handleSave(data: any) {
        const detail_obat = this.SelectedObats.map((item: any) => ({
            id_resep: item.id_resep,
            id_resep_detail: item.id_resep_detail,
            qty: item.qty,
            harga: item.harga,
            subtotal: item.subtotal,
        }));

        const jumlah_item = detail_obat.reduce((sum, item) => sum + item.qty, 0);
        const total_harga = detail_obat.reduce((sum, item) => sum + item.subtotal, 0);

        const payload = {
            id_register: data.id_register,
            id_dokter: data.id_dokter,
            id_stokroom: data.id_stokroom,
            tanggal_penjualan: this._utilityService.onFormatDate(new Date(), 'yyyy-MM-DD HH:mm:ss'),
            jumlah_item: jumlah_item,
            total_harga: total_harga,
            detail_obat: detail_obat
        };

        this._penjualanObatService
            .create(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Penjualan Obat Berhasil Disimpan' });
                    this.handleClickButtonNavigation({ id: 'back', icon: '', title: '' });
                }
            })
    }

    private handleBatalResep(data: any) {

    }


}
