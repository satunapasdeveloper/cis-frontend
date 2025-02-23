import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { ManajemenKasirService } from 'src/app/services/billing/manajemen-kasir/manajemen-kasir.service';
import { SetupLoketKasirService } from 'src/app/services/billing/manajemen-kasir/setup-loket-kasir.service';
import { SetupMetodePembayaranService } from 'src/app/services/billing/setup-data/setup-metode-pembayaran.service';

@Component({
    selector: 'app-setting-modal-kasir',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        InputNumberModule,
    ],
    templateUrl: './setting-modal-kasir.component.html',
    styleUrl: './setting-modal-kasir.component.scss'
})
export class SettingModalKasirComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form_buka_kasir' | 'form_update_modal' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Tambah',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'SetupMetodePembayaran',
        column: [
            { field: 'nama_kasir', headerName: 'Nama Kasir' },
            { field: 'tanggal_shift', headerName: 'Tgl. Shift' },
            { field: 'opened_at', headerName: 'Tgl. Buka Kasir', format: 'datetime' },
            { field: 'opening_balance', headerName: 'Modal Kasir', format: 'currency' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Edit', 'Detail'],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'tanggal_shift',
                placeholder: 'Cari Tgl. Shift Disini',
                type: 'date'
            }
        ],
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. Metode Pembayaran Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    ShowModalUpdateModal = false;
    IdKasirShift = 0;
    OpeningBalance = 0;

    constructor(
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _manajemenKasirService: ManajemenKasirService,
        private _setupLoketKasirService: SetupLoketKasirService,
    ) {
        this.FormProps = {
            id: 'form_buka_kasir',
            fields: [
                {
                    id: 'id_loket_kasir',
                    label: 'Loket Kasir',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_loket',
                        optionValue: 'id_loket_kasir'
                    },
                    value: '',
                    hidden: false
                },
                {
                    id: 'id_user',
                    label: 'Nama Kasir',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama',
                        optionValue: 'id_user'
                    },
                    value: '',
                    hidden: false
                },
                {
                    id: 'tanggal_shift',
                    label: 'Tgl. Shift',
                    required: true,
                    type: 'date',
                    value: '',
                },
                {
                    id: 'opening_balance',
                    label: 'Modal Kasir',
                    required: true,
                    type: 'number',
                    value: '',
                },
                {
                    id: 'keterangan',
                    label: 'Keterangan',
                    required: false,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-5 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll({ page: 1, count: 5 });
        this.getAllLoketKasir();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll(query: any) {
        this._manajemenKasirService
            .getAll(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.rows;
                    this.GridProps.totalRows = result.data.totalRows;
                }
            });
    }

    private getAllLoketKasir() {
        this._setupLoketKasirService
            .getAllActive({ page: 1, count: 100 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_loket_kasir');
                    this.FormProps.fields[index].dropdownProps.options = result.data.rows;
                }
            });
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form_buka_kasir';
            this.ButtonNavigation = [];
        };
    }

    handleBackToList() {
        this.FormComps.onResetForm();

        setTimeout(() => {
            this.PageState = 'list';
            this.FormState = 'insert';
            this.ButtonNavigation = [
                {
                    id: 'add',
                    title: 'Tambah',
                    icon: 'pi pi-plus'
                }
            ];
        }, 100);

        this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form_update_modal';
        this.FormState = 'update';
        this.ButtonNavigation = [];
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            this.FormComps.FormGroup.patchValue(args);
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'edit') {
            this.IdKasirShift = args.data.id_kasir_shift;
            this.OpeningBalance = 0;
            this.ShowModalUpdateModal = true;
        }

        if (args.type == 'detail') {
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

    handleBukaKasir(data: any) {
        this._manajemenKasirService
            .bukaKasir(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    handleEditModalKasir() {
        const data = {
            id_kasir_shift: this.IdKasirShift,
            opening_balance: this.OpeningBalance
        };

        console.log("data =>", data);

        this._manajemenKasirService
            .updateModalKasir(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.getAll({ ...this.GridPaginationData, ...this.GridCustomSearchParams });
                }
            })
    }
}
