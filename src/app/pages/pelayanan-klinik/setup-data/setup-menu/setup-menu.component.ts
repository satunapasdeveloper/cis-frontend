import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SetupMenuService } from 'src/app/services/pelayanan-klinik/setup-data/setup-menu.service';

@Component({
    selector: 'app-setup-menu',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-menu.component.html',
    styleUrl: './setup-menu.component.scss'
})
export class SetupMenuComponent implements OnInit, OnDestroy {

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
        id: 'SetupMenu',
        column: [
            { field: 'id_menu', headerName: '#' },
            { field: 'urut', headerName: 'No. Urut' },
            { field: 'caption', headerName: 'Menu', class: 'text-blue-500 font-semibold' },
            { field: 'icon', headerName: 'Icon' },
            { field: 'url', headerName: 'URL' },
            { field: 'id_parent', headerName: 'id_parent' },
            { field: 'is_active', headerName: 'Status', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Ubah Status', 'Detail'],
        showPaging: false,
        showSearch: true,
        showSort: false,
        searchKeyword: 'nomor_menu',
        searchPlaceholder: 'Cari Nama Menu Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _messageService: MessageService,
        private _setupMenuService: SetupMenuService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_setup_menu',
            fields: [
                {
                    id: 'id_menu',
                    label: 'Id Menu',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_parent',
                    label: 'Parent',
                    required: false,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'value',
                        autoDisplayFirst: false,
                        customField: {
                            title: 'caption',
                            subtitle: 'url',
                        }
                    },
                    onChange: (args: any) => {
                        if (args) {
                            this.FormComps.FormGroup.get('is_parent')?.setValue(false);
                        } else {
                            this.FormComps.FormGroup.get('is_parent')?.setValue(true);
                        };
                    },
                    value: '',
                },
                {
                    id: 'urut',
                    label: 'No. Urut',
                    required: true,
                    type: 'number',
                    value: '',
                },
                {
                    id: 'caption',
                    label: 'Nama Menu',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'icon',
                    label: 'Icon',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'url',
                    label: 'URL',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'is_admin',
                    label: 'Hanya Untuk Admin',
                    required: true,
                    type: 'radio',
                    radioButtonProps: [
                        {
                            name: 'is_admin',
                            label: 'Tidak',
                            value: false,
                        },
                        {
                            name: 'is_admin',
                            label: 'Iya',
                            value: true,
                        }
                    ],
                    value: false,
                },
                {
                    id: 'is_client',
                    label: 'Hanya Untuk User',
                    required: true,
                    type: 'radio',
                    radioButtonProps: [
                        {
                            name: 'is_client',
                            label: 'Tidak',
                            value: false,
                        },
                        {
                            name: 'is_client',
                            label: 'Iya',
                            value: true,
                        }
                    ],
                    value: false,
                },
                {
                    id: 'is_active',
                    label: 'Is Active',
                    required: false,
                    type: 'text',
                    value: '',
                    hidden: true,
                },
                {
                    id: 'is_parent',
                    label: 'Is Parent',
                    required: false,
                    type: 'text',
                    value: true,
                    hidden: true,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-7 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
        this.getAllMenuActive();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._setupMenuService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data.rows;
                }
            });
    }

    private getAllMenuActive() {
        this._setupMenuService
            .getAllActive()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.data.rows.length) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_parent');
                    this.FormProps.fields[index].dropdownProps.options = result.data.rows.map((item: any) => {
                        return {
                            name: item.caption,
                            value: item.id_menu,
                            caption: item.caption,
                            id_parent: item.id_parent,
                            url: item.url,
                        }
                    })
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

            this.getAll();
            this.getAllMenuActive();

        }, 100);
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
            this.FormComps.FormGroup.patchValue(args);
        }, 500);
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
                    console.log("data =>", args.data);
                    this.updateStatusMenu(args.data);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    saveMenu(data: any) {
        this._setupMenuService
            .create(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateMenu(data: any) {
        this._setupMenuService
            .update(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusMenu(data: any) {
        this._setupMenuService
            .updateStatus(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

}
