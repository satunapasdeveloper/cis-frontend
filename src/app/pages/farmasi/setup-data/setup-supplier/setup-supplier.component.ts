import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { Subject, BehaviorSubject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SetupSupplierService } from 'src/app/services/farmasi/setup-data/setup-supplier.service';
import { LokasiService } from 'src/app/services/pelayanan-klinik/setup-data/lokasi.service';
import { SetupSupplierState, SetupSupplierActions } from 'src/app/store/farmasi/setup-data/setup-supplier';

@Component({
    selector: 'app-setup-supplier',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        PaginatorModule,
    ],
    templateUrl: './setup-supplier.component.html',
    styleUrl: './setup-supplier.component.scss'
})
export class SetupSupplierComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Tambah',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'Setup_Supplier',
        column: [
            { field: 'kode_supplier', headerName: 'Kode Supplier', class: 'font-semibold' },
            { field: 'nama_supplier', headerName: 'Nama Supplier', },
            { field: 'npwp', headerName: 'NPWP', },
            { field: 'alamat', headerName: 'Alamat', },
            { field: 'provinsi', headerName: 'Provinsi', },
            { field: 'kota', headerName: 'Kota', },
            { field: 'kecamatan', headerName: 'Kecamatan', },
            { field: 'is_active', headerName: 'Status Aktif', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', "Ubah Status", 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: true,
        searchKeyword: 'nama_supplier',
        searchPlaceholder: 'Cari Nama Supplier Disini',
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
        private _lokasiService: LokasiService,
        private _messageService: MessageService,
        private _supplierService: SetupSupplierService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_setup_supplier',
            fields: [
                {
                    id: 'kode_supplier',
                    label: 'Kode Supplier',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: false,
                },
                {
                    id: 'nama_supplier',
                    label: 'Nama Supplier',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: false,
                },
                {
                    id: 'npwp',
                    label: 'NPWP',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: false,
                    mask: '00.000.000.0-000.000',
                    dropSpecialCharacters: true,
                },
                {
                    id: 'alamat',
                    label: 'Alamat',
                    required: true,
                    type: 'textarea',
                    textareaRow: 5,
                    value: '',
                    readonly: false
                },
                {
                    id: 'id_provinsi',
                    label: 'Provinsi',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'id'
                    },
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.getKota(args.id);
                            this.FormComps.FormGroup.get('provinsi')?.setValue(args.name);
                        } else {
                            this.FormComps.FormGroup.get('id_kabupaten')?.setValue(null);
                            this.FormComps.FormGroup.get('id_kecamatan')?.setValue(null);
                            this.FormProps.fields[6].dropdownProps.options = [];
                            this.FormProps.fields[8].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'provinsi',
                    label: 'Provinsi',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: false,
                    hidden: true,
                },
                {
                    id: 'id_kota',
                    label: 'Kota / Kabupaten',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'id'
                    },
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.getKecamatan(args.id);
                            this.FormComps.FormGroup.get('kota')?.setValue(args.name);
                        } else {
                            this.FormComps.FormGroup.get('id_kecamatan')?.setValue(null);
                            this.FormProps.fields[8].dropdownProps.options = [];
                        }
                    },
                },
                {
                    id: 'kota',
                    label: 'Kota',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: false,
                    hidden: true,
                },
                {
                    id: 'id_kecamatan',
                    label: 'Kecamatan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'id'
                    },
                    value: '',
                    onChange: (args: any) => {
                        if (args) {
                            this.getKelurahan(args.id);
                            this.FormComps.FormGroup.get('kecamatan')?.setValue(args.name);
                        }
                    },
                },
                {
                    id: 'kecamatan',
                    label: 'Kecamatan',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: false,
                    hidden: true,
                },
                {
                    id: 'contact_person',
                    label: 'Nama Kontak Person',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: false,
                },
                {
                    id: 'no_wa',
                    label: 'No. Whatsapp',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: false,
                    mask: '0000-0000-00000',
                    dropSpecialCharacters: true,
                },
                {
                    id: 'id_supplier',
                    label: 'Id Supplier',
                    hidden: true,
                    required: false,
                    type: 'text',
                    value: "",
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-5 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
        this.getProvinsi();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .select(SetupSupplierState.supplierEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    console.log("get data from setup supplier =>", result);
                    this.GridProps.dataSource = result.entities;
                    this.GridProps.totalRows = result.totalRows;
                }
            });
    }

    private getProvinsi() {
        this._lokasiService
            .getProvinsi()
            .subscribe((result) => {
                if (result.responseResult) {
                    this.FormProps.fields[4].dropdownProps.options = result.data;
                }
            })
    }

    private getKota(id_provinsi: string, setValue?: boolean, id_kota?: string) {
        this._lokasiService
            .getKota(id_provinsi)
            .subscribe((result) => {
                if (result.responseResult) {
                    this.FormProps.fields[2].dropdownProps.options = result.data;

                    if (setValue) {
                        this.FormComps.FormGroup.get('id_kabupaten')?.setValue(id_kota);
                    }
                }
            })
    }

    private getKecamatan(id_kota: string, setValue?: boolean, id_kecamatan?: string) {
        this._lokasiService
            .getKecamatan(id_kota)
            .subscribe((result) => {
                if (result.responseResult) {
                    this.FormProps.fields[3].dropdownProps.options = result.data;

                    if (setValue) {
                        this.FormComps.FormGroup.get('id_kecamatan')?.setValue(id_kecamatan);
                    }
                }
            })
    }

    private getKelurahan(id_kecamatan: string, setValue?: boolean, id_kelurahan?: string) {
        this._lokasiService
            .getKelurahan(id_kecamatan)
            .subscribe((result) => {
                if (result.responseResult) {
                    this.FormProps.fields[4].dropdownProps.options = result.data;

                    if (setValue) {
                        this.FormComps.FormGroup.get('id_kelurahan')?.setValue(id_kelurahan);
                    }
                }
            })
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
                    this.deleteSupplier(args.data.uuid);
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
                    this.updateStatusSupplier(args.data.id_supplier);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    onPageChanged(args: any): void {
        this._store
            .dispatch(new SetupSupplierActions.GetAllSupplier({ count: args.rows, page: args.page + 1 }))
            .pipe(takeUntil(this.Destroy$));
    }

    saveSupplier(data: any) {
        this._store
            .dispatch(new SetupSupplierActions.CreateSupplier(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_supplier.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateSupplier(data: any) {
        this._store
            .dispatch(new SetupSupplierActions.UpdateSupplier(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_supplier.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusSupplier(uuid: string) {
        // this._store
        //     .dispatch(new SetupSupplierActions.UpdateStatusSupplier(uuid))
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         if (result.setup_supplier.success) {
        //             this._messageService.clear();
        //             this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Status Berhasil Diperbarui' });
        //             this.handleBackToList();
        //         }
        //     })
    }

    private deleteSupplier(uuid: string) {
        this._store
            .dispatch(new SetupSupplierActions.DeleteSupplier(uuid))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_supplier.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Dihapus' });
                    this.handleBackToList();
                }
            })
    }


}
