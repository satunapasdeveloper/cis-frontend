import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { ResepService } from 'src/app/services/pelayanan-klinik/rekam-medis/resep.service';

@Component({
    selector: 'app-penyerahan-resep',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        PaginatorModule,
        CheckboxModule,
        InputTextareaModule,
    ],
    templateUrl: './penyerahan-resep.component.html',
    styleUrl: './penyerahan-resep.component.scss'
})
export class PenyerahanResepComponent implements OnInit, OnDestroy {

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

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _router: Router,
        private _resepService: ResepService,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_informasi_resep',
            fields: [
                {
                    id: 'no_penjualan_obat',
                    label: 'No. Penjualan Obat',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'tanggal_penjualan',
                    label: 'Tgl. Penjualan',
                    required: false,
                    type: 'datetime',
                    value: '',
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
                    id: 'no_register',
                    label: 'No. Register',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'no_rekam_medis',
                    label: 'No. Rekam Medis',
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
            ],
            style: 'inline',
            class: 'grid-rows-8 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        const id_resep = this._activatedRoute.snapshot.queryParams['id_resep'];

        this._resepService
            .getByIdResep(id_resep)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.FormComps.FormGroup.patchValue({
                        nama_stokroom: result.data.stokroom.nama_stokroom,
                        nama_poli: "-",
                        nama_dokter: result.data.dokter.nama,
                        nama_petugas: result.data.petugas.nama,
                        nama_pasien: "John Doe",
                    })
                    this.GridProps.dataSource = result.data.detail_resep;
                }
            })

    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'back') {
            this._router.navigateByUrl("/farmasi/antrian");
        };
    }

    private handleSaveTelaah(data: any) {

    }

    private handleBatalResep(data: any) {

    }

}
