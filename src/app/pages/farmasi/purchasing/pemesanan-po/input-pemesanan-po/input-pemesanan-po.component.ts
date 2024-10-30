import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, BehaviorSubject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SetupGolonganService } from 'src/app/services/farmasi/setup-data/setup-golongan.service';
import { SetupGolonganState, SetupGolonganActions } from 'src/app/store/farmasi/setup-data/setup-golongan';
import { SetupStockroomState } from 'src/app/store/farmasi/setup-data/setup-stockroom';
import { SetupSupplierState } from 'src/app/store/farmasi/setup-data/setup-supplier';

@Component({
    selector: 'app-input-pemesanan-po',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
    ],
    templateUrl: './input-pemesanan-po.component.html',
    styleUrl: './input-pemesanan-po.component.scss'
})
export class InputPemesananPoComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Kembali',
            icon: 'pi pi-chevron-left'
        },
        {
            id: 'save',
            title: 'Simpan',
            icon: 'pi pi-save'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'Setup_Golongan',
        column: [
            { field: 'nomor_urut', headerName: '#' },
            { field: 'nama_item', headerName: 'Nama Item', class: 'font-semibold' },
            { field: 'banyak', headerName: 'Banyak', format: 'number', class: 'text-end' },
            { field: 'satuan', headerName: 'Satuan', },
            { field: 'isi', headerName: 'Isi', format: 'number', class: 'text-end' },
            { field: 'harga_satuan', headerName: 'Harga Satuan', format: 'currency', class: 'text-end' },
            { field: 'sub_total', headerName: 'Sub Total', format: 'currency', class: 'text-end' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Detail'],
        showPaging: false,
        showSearch: true,
        showSort: false,
        searchKeyword: 'nama_item',
        searchPlaceholder: 'Cari Nama Item Disini',
        totalRows: 0,
    };
    GridSelectedData: any;

    First: number = 0;

    Rows: number = 10;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    KfaKeywordSearch$ = new BehaviorSubject(null);

    constructor(
        private _store: Store,
        private _messageService: MessageService,
        private _golonganService: SetupGolonganService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_pemesanan_po_header',
            fields: [
                {
                    id: 'tgl_pemesanan',
                    label: 'Tgl. Pemesanan',
                    required: true,
                    type: 'date',
                    value: '',
                    readonly: false,
                },
                {
                    id: 'tgl_expired',
                    label: 'Tgl. Expired',
                    required: true,
                    type: 'date',
                    value: '',
                    readonly: false,
                },
                {
                    id: 'id_stockroom',
                    label: 'Nama Stockroom',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_stockroom',
                        optionValue: 'id_stockroom',
                        autoDisplayFirst: false
                    },
                    value: '',
                    readonly: false,
                },
                {
                    id: 'kode_stockroom',
                    label: 'Kode Stockroom',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'id_supplier',
                    label: 'Nama Supplier',
                    required: false,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_supplier',
                        optionValue: 'id_supplier',
                        autoDisplayFirst: false
                    },
                    value: "",
                },
                {
                    id: 'kode_supplier',
                    label: 'Kode Supplier',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
            ],
            style: 'inline',
            class: 'grid-rows-2 grid-cols-3',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getDropdownProps();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getDropdownProps() {
        this._store
            .select(SetupSupplierState.supplierEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_supplier');
                    this.FormProps.fields[index].dropdownProps.options = result.entities;
                }
            });

        this._store
            .select(SetupStockroomState.stockroomEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_stockroom');
                    this.FormProps.fields[index].dropdownProps.options = result.entities;
                }
            });
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
            this.ButtonNavigation = [
                {
                    id: 'add',
                    title: 'Tambah',
                    icon: 'pi pi-plus'
                }
            ];
        }, 100);
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form';
        this.FormState = 'update';
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            setTimeout(() => {
                this.FormComps.FormGroup.patchValue(args);
            }, 500);
        }, 100);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'delete') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Data yang dihapus tidak bisa dikembalikan',
                header: 'Apakah Anda Yakin?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Iya Saya Yakin',
                rejectIcon: "none",
                rejectLabel: 'Tidak, Kembali',
                accept: () => {
                    this.deleteGolongan(args.data.uuid);
                }
            });
        }

        if (args.type == 'ubah status') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Data akan diubah statusnya',
                header: 'Apakah Anda Yakin?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Iya Saya Yakin',
                rejectIcon: "none",
                rejectLabel: 'Tidak, Kembali',
                accept: () => {
                    this.updateStatusGolongan(args.data.id_golongan);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    onPageChanged(args: any): void {
        this._store
            .dispatch(new SetupGolonganActions.GetAllGolongan({ count: args.rows, page: args.page + 1 }))
            .pipe(takeUntil(this.Destroy$));
    }

    saveGolongan(data: any) {
        this._store
            .dispatch(new SetupGolonganActions.CreateGolongan(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_golongan.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateGolongan(data: any) {
        this._store
            .dispatch(new SetupGolonganActions.UpdateGolongan(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_golongan.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusGolongan(uuid: string) {
        // this._store
        //     .dispatch(new SetupGolonganActions.UpdateStatusGolongan(uuid))
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         if (result.setup_golongan.success) {
        //             this._messageService.clear();
        //             this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Status Berhasil Diperbarui' });
        //             this.handleBackToList();
        //         }
        //     })
    }

    private deleteGolongan(uuid: string) {
        this._store
            .dispatch(new SetupGolonganActions.DeleteGolongan(uuid))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_golongan.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Dihapus' });
                    this.handleBackToList();
                }
            })
    }

}
