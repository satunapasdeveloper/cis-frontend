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
import { SetupKamarState, SetupKamarActions } from 'src/app/store/setup-data/kamar';
import { SetupKategoriKamarState } from 'src/app/store/setup-data/kategori-kamar';
import { SetupKelasState } from 'src/app/store/setup-data/kelas';
import { SetupPoliState } from 'src/app/store/setup-data/setup-poli';

@Component({
    selector: 'app-setup-kamar',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-kamar.component.html',
    styleUrl: './setup-kamar.component.scss'
})
export class SetupKamarComponent implements OnInit, OnDestroy {

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
        id: 'SetupKamar',
        column: [
            { field: 'kategori', headerName: 'Kategori', },
            { field: 'no_kamar', headerName: 'No. Kamar', class: 'text-blue-500 font-semibold' },
            { field: 'label_kamar', headerName: 'Label Kamar' },
            { field: 'no_lantai', headerName: 'No. Lantai' },
            { field: 'poli', headerName: 'Poli' },
            { field: 'nama_kelas', headerName: 'Kelas' },
            { field: 'gender', headerName: 'Gender' },
            { field: 'isolasi', headerName: 'Isolasi', renderAsCheckbox: true, class: 'text-center' },
            { field: 'status_aktif', headerName: 'Status', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. Kamar Disini'
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
            id: 'form_setup_kamar',
            fields: [
                {
                    id: 'id_kamar',
                    label: 'Kode Kamar',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_kategori',
                    label: 'Kategori',
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
                    id: 'no_kamar',
                    label: 'No. Kamar',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'label_kamar',
                    label: 'Label Kamar',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'no_lantai',
                    label: 'No. Lantai',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_poli',
                    label: 'Poli',
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
                    id: 'id_kelas',
                    label: 'Kelas',
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
                    id: 'gender',
                    label: 'Gender',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [
                            { name: 'Laki - Laki', value: 'laki-laki' },
                            { name: 'Perempuan', value: 'perempuan' },
                        ],
                        optionName: 'name',
                        optionValue: 'value',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'keterangan',
                    label: 'Keterangan',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'isolasi',
                    label: 'Isolasi',
                    required: false,
                    type: 'radio',
                    radioButtonProps: [
                        {
                            name: 'isolasi',
                            label: 'Tidak',
                            value: false,
                        },
                        {
                            name: 'isolasi',
                            label: 'Iya',
                            value: true,
                        }
                    ],
                    value: false,
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
        this.getAllKategori();
        this.getAllPoli();
        this.getAllKelas();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .select(SetupKamarState.kamarEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    console.log("get from setup kamar =>", result);
                    this.GridProps.dataSource = result;
                }
            });
    }

    private getAllKategori() {
        this._store
            .select(SetupKategoriKamarState.kategoriKamarEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_kategori');
                    this.FormProps.fields[index].dropdownProps = result.map((item: any) => {
                        return {
                            name: item.kategori,
                            value: item.id_kategori
                        }
                    })
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
                    this.FormProps.fields[index].dropdownProps = result.map((item: any) => {
                        return {
                            name: item.poli,
                            value: item.id_poli
                        }
                    })
                }
            });
    }

    private getAllKelas() {
        this._store
            .select(SetupKelasState.kelasEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_kelas');
                    this.FormProps.fields[index].dropdownProps = result.map((item: any) => {
                        return {
                            name: item.kelas,
                            value: item.id_kelas
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
                    this.deleteKamar(args.data.id_kamar);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    saveKamar(data: any) {
        this._store
            .dispatch(new SetupKamarActions.CreateKamar(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_kamar.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateKamar(data: any) {
        this._store
            .dispatch(new SetupKamarActions.UpdateKamar(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_kamar.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private deleteKamar(id_kamar: string) {
        this._store
            .dispatch(new SetupKamarActions.DeleteKamar(id_kamar))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_kamar.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Dihapus' });
                    this.handleBackToList();
                }
            })
    }

}
