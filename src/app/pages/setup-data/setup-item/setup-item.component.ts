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
import { ItemService } from 'src/app/services/setup-data/item.service';
import { SetupItemActions, SetupItemState } from 'src/app/store/setup-data/item';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-setup-item',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
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
            { field: 'kode_kfa', headerName: 'Kode Item', class: 'font-semibold' },
            { field: 'nama_item', headerName: 'Nama Item', },
            { field: 'kategori', headerName: 'Kategori', },
            { field: 'satuan', headerName: 'Satuan', },
            { field: 'harga_jual', headerName: 'Harga Jual', format: 'currency' },
            { field: 'is_active', headerName: 'Status Aktif', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', "Ubah Status", 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: true,
        searchKeyword: 'nama_item',
        searchPlaceholder: 'Cari Nama Item Disini'
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    KfaKeywordSearch$ = new BehaviorSubject(null);

    constructor(
        private _store: Store,
        private _itemService: ItemService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_setup_item',
            fields: [
                {
                    id: 'kategori',
                    label: 'Kategori',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [
                            { name: 'Obat', value: 'OBAT' },
                            { name: 'BMHP', value: 'BMHP' },
                        ],
                        optionName: 'name',
                        optionValue: 'value',
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
                        this.FormComps.FormGroup.get('kode_kfa')?.setValue(args ? args.kode_kfa : "");
                        this.FormComps.FormGroup.get('satuan')?.setValue(args ? args.satuan : "");
                    }
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
                    id: 'satuan',
                    label: 'Satuan',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'harga_jual',
                    label: 'Harga Jual',
                    required: false,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'uuid',
                    label: 'UUID',
                    hidden: true,
                    required: false,
                    type: 'text',
                    value: "",
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-5 grid-cols-1',
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
                    console.log("get data from setup item =>", result);
                    this.GridProps.dataSource = result;
                }
            });
    }

    private getAllKfa(keyword: string) {
        this._itemService
            .getAllIcd9(keyword)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'nama_item');
                    this.FormProps.fields[index].dropdownProps.options = result.data;
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
            this.getAllKfa(args.nama_item);
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
                    this.deleteItem(args.data.uuid);
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
                    this.updateStatusItem(args.data.uuid);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    saveItem(data: any) {
        this._store
            .dispatch(new SetupItemActions.CreateItem(data))
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
        this._store
            .dispatch(new SetupItemActions.UpdateItem(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_item.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusItem(uuid: string) {
        this._store
            .dispatch(new SetupItemActions.UpdateStatusItem(uuid))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_item.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Status Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private deleteItem(uuid: string) {
        this._store
            .dispatch(new SetupItemActions.DeleteItem(uuid))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_item.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Dihapus' });
                    this.handleBackToList();
                }
            })
    }

}
