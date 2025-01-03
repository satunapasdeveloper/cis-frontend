import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
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
import { SetupBedState, SetupBedActions } from 'src/app/store/setup-data/bed';
import { SetupKamarActions, SetupKamarState } from 'src/app/store/setup-data/kamar';

@Component({
    selector: 'app-setup-bed',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-bed.component.html',
    styleUrl: './setup-bed.component.scss'
})
export class SetupBedComponent implements OnInit, OnDestroy {

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
        id: 'SetupBed',
        column: [
            { field: 'no_kamar', headerName: 'No. Kamar', class: 'text-blue-500 font-semibold' },
            { field: 'no_bed', headerName: 'No. Bed' },
            { field: 'is_tampilkan_antrian', headerName: 'Tampilkan Di Antrian', renderAsCheckbox: true, class: 'text-center' },
            { field: 'is_sesuai_sk', headerName: 'Sesuai SK', renderAsCheckbox: true, class: 'text-center' },
            { field: 'is_active', headerName: 'Status', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Ubah Status', 'Detail'],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'no_bed',
                placeholder: 'Cari No. Bed Disini',
                type: 'text'
            },
        ],
        showSort: false,
        searchKeyword: 'nomor_bed',
        searchPlaceholder: 'Cari No. Bed Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _store: Store,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_setup_bed',
            fields: [
                {
                    id: 'id_bed',
                    label: 'Kode Bed',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_bed_kamar',
                    label: 'Kamar',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'value',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'no_bed',
                    label: 'No. Bed',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'is_tampilkan_antrian',
                    label: 'Tampilkan Di Antrian',
                    required: false,
                    type: 'radio',
                    radioButtonProps: [
                        {
                            name: 'is_tampilkan_antrian',
                            label: 'Tidak',
                            value: false,
                        },
                        {
                            name: 'is_tampilkan_antrian',
                            label: 'Iya',
                            value: true,
                        }
                    ],
                    value: false,
                },
                {
                    id: 'is_sesuai_sk',
                    label: 'Sesuai SK',
                    required: false,
                    type: 'radio',
                    radioButtonProps: [
                        {
                            name: 'is_sesuai_sk',
                            label: 'Tidak',
                            value: false,
                        },
                        {
                            name: 'is_sesuai_sk',
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
            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
        this.getKamarActiveState();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .select(SetupBedState.bedState)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.entities;
                    this.GridProps.totalRows = result.totalRows;
                }
            });
    }

    private getKamarActiveState() {
        this._store
            .select(SetupKamarState.kamarActives)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result?.length) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_bed_kamar');
                    this.FormProps.fields[index].dropdownProps.options = result.map((item: any) => {
                        return {
                            name: item.no_kamar,
                            value: item.id_bed_kamar
                        }
                    })
                } else {
                    this.getAllKamarActive();
                }
            });
    }

    private getAllKamarActive() {
        this._store
            .dispatch(new SetupKamarActions.GetAllActiveKamar({ page: 1, count: 100 }))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_bed_kamar');
                    this.FormProps.fields[index].dropdownProps.options = result.setup_kamar.actives.map((item: any) => {
                        return {
                            name: item.no_kamar,
                            value: item.id_bed_kamar
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
                    this.updateStatusBed(args.data);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    onPageChanged(args: any) {
        this.GridPaginationData = { page: args.page + 1, count: args.rows };
        this._store.dispatch(new SetupBedActions.GetAllBed({ ...this.GridPaginationData, ...this.GridCustomSearchParams }))
    }

    onSearchGrid(args: any) {
        this.GridCustomSearchParams = args;
        this._store.dispatch(new SetupBedActions.GetAllBed({ ...this.GridPaginationData, ...this.GridCustomSearchParams }))
    }

    saveBed(data: any) {
        this._store
            .dispatch(new SetupBedActions.CreateBed(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_bed.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateBed(data: any) {
        this._store
            .dispatch(new SetupBedActions.UpdateBed(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_bed.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusBed(data: any) {
        this._store
            .dispatch(new SetupBedActions.UpdateStatusBed(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_bed.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

}
