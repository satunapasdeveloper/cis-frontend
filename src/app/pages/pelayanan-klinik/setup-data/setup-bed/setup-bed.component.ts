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
import { SetupKamarState } from 'src/app/store/setup-data/kamar';

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
            { field: 'no_kamar', headerName: 'No. Kamar', },
            { field: 'nomor_bed', headerName: 'No. Bed', },
            { field: 'tampilkan_di_antrian', headerName: 'Tampilkan Di Antrian', renderAsCheckbox: true, class: 'text-center' },
            { field: 'sesuai_sk', headerName: 'Sesuai SK', renderAsCheckbox: true, class: 'text-center' },
            { field: 'status_aktif', headerName: 'Status', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: true,
        searchKeyword: 'nomor_bed',
        searchPlaceholder: 'Cari No. Bed Disini'
    };
    GridSelectedData: any;

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
                    id: 'id_kamar',
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
                    id: 'nomor_bed',
                    label: 'No. Bed',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'tampilkan_di_antrian',
                    label: 'Tampilkan Di Antrian',
                    required: false,
                    type: 'radio',
                    radioButtonProps: [
                        {
                            name: 'tampilkan_di_antrian',
                            label: 'Tidak',
                            value: false,
                        },
                        {
                            name: 'tampilkan_di_antrian',
                            label: 'Iya',
                            value: true,
                        }
                    ],
                    value: false,
                },
                {
                    id: 'sesuai_sk',
                    label: 'Sesuai SK',
                    required: false,
                    type: 'radio',
                    radioButtonProps: [
                        {
                            name: 'sesuai_sk',
                            label: 'Tidak',
                            value: false,
                        },
                        {
                            name: 'sesuai_sk',
                            label: 'Iya',
                            value: true,
                        }
                    ],
                    value: false,
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
        this.getAllKamar();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .select(SetupBedState.bedEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    console.log("get from setup poli =>", result);
                    this.GridProps.dataSource = result;
                }
            });
    }

    private getAllKamar() {
        this._store
            .select(SetupKamarState.kamarEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_kamar');
                    this.FormProps.fields[index].dropdownProps = result.map((item: any) => {
                        return {
                            name: item.no_kamar,
                            value: item.id_kamar
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
                    this.deleteBed(args.data.id_bed);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
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

    private deleteBed(id_bed: string) {
        this._store
            .dispatch(new SetupBedActions.DeleteBed(id_bed))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_bed.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Dihapus' });
                    this.handleBackToList();
                }
            })
    }

}
