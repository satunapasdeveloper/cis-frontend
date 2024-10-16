import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { TindakanMedisService } from 'src/app/services/setup-data/tindakan-medis.service';
import { SetupPoliActions, SetupPoliState } from 'src/app/store/setup-data/setup-poli';
import { SetupTindakanMedisActions, SetupTindakanMedisState } from 'src/app/store/setup-data/tindakan-medis';

@Component({
    selector: 'app-setup-tindakan-medis',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-tindakan-medis.component.html',
    styleUrl: './setup-tindakan-medis.component.scss'
})
export class SetupTindakanMedisComponent implements OnInit, OnDestroy {

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
        id: 'Setup_Tindakan_Medis',
        column: [
            { field: 'tindakan', headerName: 'Nama Tindakan Medis', class: 'font-semibold' },
            { field: 'nama_icd_9', headerName: 'Nama ICD-9', },
            { field: 'poli', headerName: 'Poli', },
            { field: 'harga', headerName: 'Harga', format: 'currency' },
            { field: 'is_active', headerName: 'Status Aktif', renderAsCheckbox: true, },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', "Ubah Status", 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: true,
        searchKeyword: 'nama_tindakan_medis',
        searchPlaceholder: 'Cari Nama Tindakan Medis Disini'
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    KfaKeywordSearch$ = new BehaviorSubject(null);

    constructor(
        private _store: Store,
        private _router: Router,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _tindakanMedisService: TindakanMedisService,
    ) {
        this.FormProps = {
            id: 'form_setup_tindakan_medis',
            fields: [
                {
                    id: 'tindakan',
                    label: 'Nama Tindakan Medis',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'icd_9',
                    label: 'Display ICD 9',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'kode_icd9',
                    label: 'Kode ICD 9',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_icd_9',
                        optionValue: 'kode_icd_9',
                        autoDisplayFirst: false
                    },
                    value: '',
                    onFilter: (args) => {
                        this.KfaKeywordSearch$.next(args.filter);
                    },
                    onChange: (args) => {
                        console.log(args);
                        this.FormComps.FormGroup.get('icd_9')?.setValue(args ? args.id : null);
                    }
                },
                {
                    id: 'id_poli',
                    label: 'Nama Poli',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'poli',
                        optionValue: 'id_poli',
                        autoDisplayFirst: false,
                        customField: {
                            title: 'poli',
                            subtitle: 'kode_poli',
                            footer: {
                                label: 'Tambah Poli',
                                method: () => { this._router.navigateByUrl('setup-data/setup-poli') }
                            }
                        }
                    },
                    value: '',
                },
                {
                    id: 'harga',
                    label: 'Harga',
                    required: false,
                    type: 'number',
                    value: 0,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-1',
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
                    this.getAllIc9(result);
                }
            })
    }

    ngOnInit(): void {
        this.getAll();
        this.getAllPoli();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .select(SetupTindakanMedisState.TindakanMedisEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    console.log("get from setup tindakan medis =>", result);
                    this.GridProps.dataSource = result;
                }
            });
    }

    private getAllPoli() {
        this._store
            .select(SetupPoliState.poliEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_poli');
                    this.FormProps.fields[index].dropdownProps.options = result;
                }
            });
    }

    private getAllIc9(keyword: string) {
        this._tindakanMedisService
            .getAllIcd9(keyword)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'kode_icd9');
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
            this.getAllIc9(args.nama_item);
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
                    this.deleteTindakanMedis(args.data.uuid);
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

    saveTindakanMedis(data: any) {
        this._store
            .dispatch(new SetupTindakanMedisActions.CreateTindakanMedis(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_tindakan_medis.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateTindakanMedis(data: any) {
        this._store
            .dispatch(new SetupTindakanMedisActions.UpdateTindakanMedis(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_tindakan_medis.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusItem(uuid: string) {
        this._store
            .dispatch(new SetupTindakanMedisActions.UpdateStatusTindakanMedis(uuid))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_tindakan_medis.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Status Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private deleteTindakanMedis(uuid: string) {
        this._store
            .dispatch(new SetupTindakanMedisActions.DeleteTindakanMedis(uuid))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_tindakan_medis.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Dihapus' });
                    this.handleBackToList();
                }
            })
    }
}
