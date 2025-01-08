import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { ItemService } from 'src/app/services/pelayanan-klinik/setup-data/item.service';
import { SetupItemActions, SetupItemState } from 'src/app/store/setup-data/item';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SetupSupplierState } from 'src/app/store/farmasi/setup-data/setup-supplier';
import { SetupGroupItemService } from 'src/app/services/inventory/setup-data/setup-group-item.service';
import { SetupSatuanService } from 'src/app/services/inventory/setup-data/setup-satuan.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-setup-item',
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        CommonModule,
        GridComponent,
        DropdownModule,
        InputNumberModule,
        DashboardComponent,
        ConfirmDialogModule,
        DynamicFormComponent,
    ],
    templateUrl: './setup-item.component.html',
    styleUrl: './setup-item.component.scss'
})
export class SetupItemComponent implements OnInit, OnDestroy {

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
        id: 'Setup_Item',
        column: [
            { field: 'kode_kfa', headerName: 'Kode Item', class: 'font-semibold', width: '10%' },
            { field: 'nama_item', headerName: 'Nama Item', width: '30%' },
            { field: 'golongan', headerName: 'Golongan', width: '12%' },
            { field: 'satuan_jual', headerName: 'Satuan', width: '12%' },
            { field: 'harga_beli_terakhir', headerName: 'Harga Beli Terakhir', format: 'currency', width: '20%' },
            { field: 'is_active', headerName: 'Status Aktif', renderAsCheckbox: true, class: 'text-center', width: '12%' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', "Ubah Status", 'Detail'],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'kode_item',
                placeholder: 'Cari Kode Item Disini',
                type: 'text'
            },
            {
                id: 'nama_item',
                placeholder: 'Cari Nama Item Disini',
                type: 'text'
            },
            {
                id: 'kode_kfa',
                placeholder: 'Cari Kode KFA Disini',
                type: 'text'
            },
        ],
        showSort: false,
        searchKeyword: 'nama_item',
        searchPlaceholder: 'Cari Nama Item Disini',
        totalRows: 0
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    KfaKeywordSearch$ = new BehaviorSubject(null);

    SatuanDatasource: any[] = [];

    DetailSatuan: any[] = [];

    constructor(
        private _store: Store,
        private _itemService: ItemService,
        private _messageService: MessageService,
        private _satuanService: SetupSatuanService,
        private _grupItemService: SetupGroupItemService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_setup_item',
            fields: [
                {
                    id: 'detail_jenis',
                    label: 'Jenis Item',
                    required: true,
                    type: 'multiselect',
                    dropdownProps: {
                        options: [],
                        optionName: 'jenis',
                        optionValue: 'jenis',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'nama_item',
                    label: 'Nama Item',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_item',
                        optionValue: 'nama_item',
                        autoDisplayFirst: false
                    },
                    value: '',
                    onFilter: (args) => {
                        this.KfaKeywordSearch$.next(args.filter);
                    },
                    onChange: (args) => {
                        this.FormComps.FormGroup.get('kategori')?.setValue(args ? args.kategori : null);
                        this.FormComps.FormGroup.get('kode_item')?.setValue(args ? args.kode_kfa : "");
                        this.FormComps.FormGroup.get('kode_kfa')?.setValue(args ? args.kode_kfa : "");
                        this.FormComps.FormGroup.get('satuan_jual')?.setValue(args ? args.satuan : "");
                        this.FormComps.FormGroup.get('display_kfa')?.setValue(args ? args : {});
                    }
                },
                {
                    id: 'kode_item',
                    label: 'Kode Item',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: false
                },
                {
                    id: 'kode_kfa',
                    label: 'Kode Item KFA',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'satuan_jual',
                    label: 'Satuan Jual',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'kandungan',
                    label: 'Kandungan',
                    required: false,
                    type: 'text',
                    value: "",
                },
                {
                    id: 'kapasitas',
                    label: 'Kapasitas',
                    required: false,
                    type: 'number',
                    value: "",
                },
                {
                    id: 'golongan',
                    label: 'Golongan Item',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'golongan',
                        optionValue: 'golongan',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'id_item_grup',
                    label: 'Grup Item',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_grup',
                        optionValue: 'id_item_grup',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'id_supplier',
                    label: 'Supplier',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_supplier',
                        optionValue: 'id_supplier',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'catatan',
                    label: 'Catatan',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'is_obat_darurat_urgensi',
                    label: 'Obat Darurat Urgensi',
                    required: false,
                    type: 'radio',
                    value: false,
                    radioButtonProps: [
                        { name: 'is_obat_darurat_urgensi', label: 'Iya', value: true },
                        { name: 'is_obat_darurat_urgensi', label: 'Tidak', value: false },
                    ]
                },
                {
                    id: 'is_hight_alert',
                    label: 'High Alert',
                    required: false,
                    type: 'radio',
                    value: false,
                    radioButtonProps: [
                        { name: 'is_hight_alert', label: 'Iya', value: true },
                        { name: 'is_hight_alert', label: 'Tidak', value: false },
                    ]
                },
                {
                    id: 'is_lasa',
                    label: 'LASA',
                    required: false,
                    type: 'radio',
                    value: false,
                    radioButtonProps: [
                        { name: 'is_lasa', label: 'Iya', value: true },
                        { name: 'is_lasa', label: 'Tidak', value: false },
                    ]
                },
                {
                    id: 'id_item',
                    label: 'Id Item',
                    hidden: true,
                    required: false,
                    type: 'text',
                    value: "",
                },
                {
                    id: 'display_kfa',
                    label: 'Display KFA',
                    hidden: true,
                    required: false,
                    type: 'text',
                    value: "",
                },
                {
                    id: 'is_active',
                    label: 'Is Active',
                    hidden: true,
                    required: false,
                    type: 'text',
                    value: "",
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-7 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.KfaKeywordSearch$
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((result) => {
                if (result) {
                    this.getAllKfa(result);
                }
            })
    }

    ngOnInit(): void {
        this.getAll();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .select(SetupItemState.itemEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result;
                }
            });

        this._itemService
            .getAllJenis()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'detail_jenis');
                    this.FormProps.fields[index].dropdownProps.options = result.data;
                }
            });

        this._itemService
            .getAllGolongan()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'golongan');
                    this.FormProps.fields[index].dropdownProps.options = result.data;
                }
            });

        this._grupItemService
            .getAllActive({ page: 1, count: 10000 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_item_grup');
                    this.FormProps.fields[index].dropdownProps.options = result.data.rows;
                }
            });

        this._store
            .select(SetupSupplierState.supplierEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_supplier');
                    this.FormProps.fields[index].dropdownProps.options = result.entities;
                }
            });

        this._satuanService
            .getAllActive({ page: 1, count: 1000 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.SatuanDatasource = result.data.rows;
                }
            });
    }

    private getAllKfa(keyword: string) {
        this._itemService
            .getAllKfa(keyword)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'nama_item');
                    this.FormProps.fields[index].dropdownProps.options = result.data.rows;
                }
            });
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];
            this.DetailSatuan = [];
        };
    }

    handleBackToList() {
        this.FormComps.onResetForm();
        this.DetailSatuan = [];

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
            this.getAllKfa(args.nama_item);
            setTimeout(() => {
                let data = JSON.parse(JSON.stringify(args));
                data.detail_jenis = data.detail_jenis.map((item: any) => item.jenis);
                this.FormComps.FormGroup.patchValue(data);
                this.DetailSatuan = data.detail_satuan;
            }, 500);
        }, 100);
    }

    onToolbarClicked(args: any): void {
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
                    this.updateStatusItem(args.data.uuid);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    saveItem(data: any) {
        delete data.is_active;

        let payload = {
            ...data,
            is_obat_darurat_urgensi: data.is_obat_darurat_urgensi ? true : false,
            is_hight_alert: data.is_hight_alert ? true : false,
            is_lasa: data.is_lasa ? true : false,
            detail_jenis: data.detail_jenis.map((item: any) => {
                return { jenis: item }
            }),
            detail_satuan: this.DetailSatuan.map((item: any) => {
                return {
                    id_satuan: item.id_satuan,
                    isi: item.isi
                }
            })
        };

        this._store
            .dispatch(new SetupItemActions.CreateItem(payload))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_item.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateItem(data: any) {
        let payload = {
            ...data,
            is_obat_darurat_urgensi: data.is_obat_darurat_urgensi ? true : false,
            is_hight_alert: data.is_hight_alert ? true : false,
            is_lasa: data.is_lasa ? true : false,
            detail_jenis: data.detail_jenis.map((item: any) => {
                return { jenis: item }
            }),
            detail_satuan: this.DetailSatuan.map((item: any) => {
                return {
                    id_satuan: item.id_satuan,
                    isi: item.isi
                }
            })
        };

        this._store
            .dispatch(new SetupItemActions.UpdateItem(payload))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_item.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusItem(data: any) {
        this._store
            .dispatch(new SetupItemActions.UpdateStatusItem(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_item.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Status Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    handleAddNewSatuan() {
        this.DetailSatuan.push({
            id_satuan: 0,
            nama_satuan: "",
            isi: 0,
        });
    }

    handleDeleteSatuan(index: number) {
        if (this.DetailSatuan.length > 1) {
            this.DetailSatuan.splice(index, 1);
        }
    }
}
