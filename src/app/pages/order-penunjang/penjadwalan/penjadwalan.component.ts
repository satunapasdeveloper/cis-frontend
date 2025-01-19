import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { GroupItemModel } from 'src/app/model/pages/inventory/setup-data/setup-grup-item.model';
import { SetupGroupItemService } from 'src/app/services/inventory/setup-data/setup-group-item.service';
import { LaboratoriumService } from 'src/app/services/pelayanan-klinik/rekam-medis/laboratorium.service';
import { RadiologiService } from 'src/app/services/pelayanan-klinik/rekam-medis/radiologi.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
    selector: 'app-penjadwalan',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        GridComponent,
        DashboardComponent,
        ConfirmDialogModule,
        DynamicFormComponent,
    ],
    templateUrl: './penjadwalan.component.html',
    styleUrl: './penjadwalan.component.scss'
})
export class PenjadwalanComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    IsLaboratorium: boolean = true;

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [];

    GridProps: GridModel.IGrid = {
        id: 'SetupGroupItem',
        column: [
            { field: 'nomor_order_penunjang', headerName: 'No. Order', class: 'text-blue-500 font-semibold' },
            { field: 'tanggal_order_penunjang', headerName: 'Tgl. Order', format: 'date' },
            { field: 'no_register', headerName: 'No. Register' },
            { field: 'no_rekam_medis', headerName: 'No. Rekam Medis' },
            { field: 'nama_pasien', headerName: 'Nama Pasien' },
            { field: 'status_tes', headerName: 'Status Penjadwalan', },
            { field: 'tanggal_tes', headerName: 'Tgl. Pemeriksaan', format: 'datetime' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Jadwalkan'],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'nomor_order_penunjang',
                placeholder: 'Cari No. Order Disini',
                type: 'text'
            },
            {
                id: 'tanggal_order_penunjang',
                placeholder: 'Cari Tgl. Order Disini',
                type: 'date'
            },
        ],
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. Cara Pulang Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _router: Router,
        private _utilityService: UtilityService,
        private _messageService: MessageService,
        private _radiologiService: RadiologiService,
        private _laboratoriumService: LaboratoriumService,
    ) {
        this.FormProps = {
            id: 'form_penjadwalan_order',
            fields: [
                {
                    id: 'id_order_penunjang',
                    label: 'ID Asal Rujukan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'nomor_order_penunjang',
                    label: 'No. Order',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'tanggal_order_penunjang',
                    label: 'Tgl. Order',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'no_register',
                    label: 'No. Register',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'no_rekam_medis',
                    label: 'No. Rekam Medis',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_pasien',
                    label: 'Nama Pasien',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'tanggal_tes',
                    label: 'Tgl. Pemeriksaan',
                    required: true,
                    type: 'datetime',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-3 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        const url = this._router.url;
        this.IsLaboratorium = url.includes('laboratorium');

        this.getAll({ page: 1, count: 5 });
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: any) {
        if (this.IsLaboratorium) {
            this._laboratoriumService
                .getAllActive({ ...query, jenis_penunjang: 'Laboratorium' })
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this.GridProps.dataSource = result.data.rows;
                        this.GridProps.totalRows = result.data.totalRows;
                    }
                });
        } else {
            this._radiologiService
                .getAllActive({ ...query, jenis_penunjang: 'Radiologi' })
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result) {
                        this.GridProps.dataSource = result.data.rows;
                        this.GridProps.totalRows = result.data.totalRows;
                    }
                });
        }
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];
        };
    }

    handleBackToList() {
        this.FormComps.onResetForm();

        setTimeout(() => {
            this.PageState = 'list';
            this.FormState = 'insert';
            this.ButtonNavigation = [];
        }, 100);

        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form';
        this.FormState = 'update';
        this.ButtonNavigation = [];
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            args.tanggal_order_penunjang = formatDate(new Date(args.tanggal_order_penunjang), 'dd-MM-yyyy', 'EN');

            const tanggal_tes = new Date(args.tanggal_tes);
            args.tanggal_tes = new Date(tanggal_tes.getTime() + (tanggal_tes.getTimezoneOffset() * 60000));

            this.FormComps.FormGroup.patchValue(args);
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'jadwalkan') {
            this.onRowDoubleClicked(args.data);
        }
    }

    onPageChanged(args: any) {
        this.GridPaginationData = { page: args.page + 1, count: args.rows };
        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
    }

    onSearchGrid(args: any) {
        this.GridCustomSearchParams = args;
        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
    }

    handleSavePenjadwalan(data: any) {
        if (this.IsLaboratorium) {
            this._laboratoriumService
                .updateJadwal(data.id_order_penunjang, data.tanggal_tes)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                        this.handleBackToList();
                    }
                })
        } else {
            this._radiologiService
                .updateJadwal(data.id_order_penunjang, data.tanggal_tes)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                        this.handleBackToList();
                    }
                })
        }


    }
}
