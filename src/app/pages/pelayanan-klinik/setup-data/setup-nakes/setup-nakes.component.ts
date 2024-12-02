import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { NakesJadwalModel } from 'src/app/model/pages/setup-data/nakes-jadwal.model';
import { MinioService } from 'src/app/services/minio/minio.service';
import { NakesJadwalService } from 'src/app/services/pelayanan-klinik/setup-data/nakes-jadwal.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { SetupJabatanActions } from 'src/app/store/setup-data/jabatan';
import { SetupNakesState, SetupNakesActions } from 'src/app/store/setup-data/nakes';
import { SetupRoleActions } from 'src/app/store/setup-data/role';
import { SetupPoliActions } from 'src/app/store/setup-data/setup-poli';

@Component({
    selector: 'app-setup-nakes',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        DropdownModule,
        CalendarModule,
        TooltipModule
    ],
    templateUrl: './setup-nakes.component.html',
    styleUrl: './setup-nakes.component.scss'
})
export class SetupNakesComponent implements OnInit, OnDestroy {

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
        id: 'SetupNakes',
        column: [
            { field: 'nama', headerName: 'Nama', class: 'text-blue-500 font-semibold' },
            { field: 'username', headerName: 'Username', },
            { field: 'nama_jabatan', headerName: 'Jabatan', },
            { field: 'nama_poli', headerName: 'Poli', },
            { field: 'nama_role', headerName: 'Role', },
            { field: 'kode_dpjp', headerName: 'Kode DPJP', },
            { field: 'is_active', headerName: 'Status', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Ubah Status', 'Detail',],
        showPaging: true,
        showSearch: true,
        isCustomSearch: true,
        customSearchProps: [
            {
                id: 'nama',
                placeholder: 'Cari Nama Nakes Disini',
                type: 'text'
            },
            {
                id: 'nik',
                placeholder: 'Cari NIK Nakes Disini',
                type: 'text'
            },
            {
                id: 'username',
                placeholder: 'Cari Username Disini',
                type: 'text'
            },
        ],
        showSort: false,
        searchKeyword: 'nama',
        searchPlaceholder: 'Cari Nama Nakes Disini'
    };
    GridSelectedData: any;
    GridCustomSearchParams: any;
    GridPaginationData: any = { page: 1, count: 5 };

    FormState: 'insert' | 'update' = 'insert';

    IsDokter = false;

    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    FormBrigding: FormModel.IForm;
    @ViewChild('FormBrigdingComps') FormBridgingComps!: DynamicFormComponent;

    FormFoto: FormModel.IForm;
    @ViewChild('FormFotoComps') FormFotoComps!: DynamicFormComponent;

    HariDatasource: any[] = [
        { name: 'Minggu', value: 0 },
        { name: 'Senin', value: 1 },
        { name: 'Selasa', value: 2 },
        { name: 'Rabu', value: 3 },
        { name: 'Kamis', value: 4 },
        { name: 'Jumat', value: 5 },
        { name: 'Sabtu', value: 6 },
    ];

    JadwalNakesDatasource: any[] = [];

    constructor(
        private _store: Store,
        private _minioService: MinioService,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _nakesJadwalService: NakesJadwalService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_setup_nakes',
            fields: [
                {
                    id: 'id_nakes',
                    label: 'Kode Nakes',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'nik',
                    label: 'NIK',
                    required: true,
                    type: 'text',
                    value: '',
                    mask: '0000.0000.0000.0000',
                    dropSpecialCharacters: true,
                },
                {
                    id: 'nama',
                    label: 'Nama Lengkap',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_jabatan',
                    label: 'Jabatan',
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
                    id: 'id_role',
                    label: 'Role',
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
                    id: 'username',
                    label: 'Username',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'password',
                    label: 'Password',
                    required: true,
                    type: 'password',
                    value: '',
                },
                {
                    id: 'is_active',
                    label: 'Is Active',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FormBrigding = {
            id: 'form_bridging_nakes',
            fields: [
                {
                    id: 'kode_dpjp',
                    label: 'Kode DPJP',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_satu_sehat',
                    label: 'Id Satu Sehat',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'hfis',
                    label: 'HFIS',
                    required: true,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FormFoto = {
            id: 'form_foto_nakes',
            fields: [
                {
                    id: 'file_foto',
                    label: 'Foto',
                    required: true,
                    type: 'fileinput',
                    file_accept: 'image/*',
                    value: '',
                    onChange: (files: File) => {
                        if (files) {
                            const type = files.name.split("."),
                                fileName =
                                    this.FormState == 'insert' ?
                                        `nakes_${new Date().getTime()}.${type[1]}` :
                                        (this.FormFotoComps.FormGroup.get('file_foto_name')?.value ?
                                            this.FormFotoComps.FormGroup.get('file_foto_name')?.value :
                                            `nakes_${new Date().getTime()}.${type[1]}`);

                            this._minioService
                                .generatePresignedUrl('iptv', fileName)
                                .pipe(takeUntil(this.Destroy$))
                                .subscribe((result) => {
                                    if (result.data) {
                                        this.handleUploadFile(result.data, files, fileName);
                                    }
                                })
                        }
                    }
                },
                {
                    id: 'file_foto_url',
                    label: 'Image URL',
                    required: false,
                    hidden: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'file_foto_name',
                    label: 'Image Name',
                    required: false,
                    hidden: true,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-1 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
        this.getAllPoli();
        this.getAllRole();
        this.getAllJabatan();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .select(SetupNakesState.nakesState)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.entities;
                    this.GridProps.totalRows = result.totalRows;
                }
            });
    }

    private getAllPoli() {
        this._store
            .dispatch(new SetupPoliActions.GetAllActivePoli({ page: 1, count: 100 }))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_poli');
                    this.FormProps.fields[index].dropdownProps.options = result.setup_poli.actives.map((item: any) => {
                        return {
                            name: item.nama_poli,
                            value: item.id_poli
                        }
                    })
                }
            });
    }

    private getAllJabatan() {
        this._store
            .dispatch(new SetupJabatanActions.GetAllActiveJabatan({ page: 1, count: 100 }))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_jabatan');
                    this.FormProps.fields[index].dropdownProps.options = result.setup_jabatan.actives.map((item: any) => {
                        return {
                            name: item.nama_jabatan,
                            value: item.id_jabatan
                        }
                    })
                }
            });
    }

    private getAllRole() {
        this._store
            .dispatch(new SetupRoleActions.GetAllActiveRole({ page: 1, count: 100 }))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_role');
                    this.FormProps.fields[index].dropdownProps.options = result.setup_role.actives.map((item: any) => {
                        return {
                            name: item.nama_role,
                            value: item.id_role
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
        this.IsDokter = args.nama_role.toLowerCase() == 'dokter';

        this.PageState = 'form';
        this.FormState = 'update';
        this.ButtonNavigation = [];
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            this.FormComps.FormGroup.patchValue(args);
            this.FormBridgingComps.FormGroup.patchValue(args);
            this.FormFotoComps.FormGroup.patchValue(args);
            this.FormFotoComps.ImagePreviews['file_foto'] = args.file_foto_url;
            this.getJadwalNakes(args.id_nakes);
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
                    this.updateStatusNakes(args.data);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    private handleUploadFile(url: string, file: File, fileName: string) {
        this._utilityService.ShowLoading$.next(true);

        this._minioService
            .uploadFile(url, file)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                console.log("uploading file...");
                console.log("trying get url...");
                this.getUrlFileUploaded(fileName);
            })
    }

    private getUrlFileUploaded(fileName: string) {
        this._minioService
            .getUrlFile('iptv', fileName)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.data) {
                    this.FormFotoComps.FormGroup.get('file_foto_url')?.setValue(result.data);
                    this.FormFotoComps.FormGroup.get('file_foto_name')?.setValue(fileName);
                    this._utilityService.ShowLoading$.next(false);
                }
            })
    }

    onPageChanged(args: any) {
        this.GridPaginationData = { page: args.page + 1, count: args.rows };
        this._store.dispatch(new SetupNakesActions.GetAllNakes({ ...this.GridPaginationData, ...this.GridCustomSearchParams }))
    }

    onSearchGrid(args: any) {
        this.GridCustomSearchParams = args;
        this._store.dispatch(new SetupNakesActions.GetAllNakes({ ...this.GridPaginationData, ...this.GridCustomSearchParams }))
    }

    saveNakes(data: any) {
        const payload = {
            ...data,
            ...this.FormBridgingComps.FormGroup.value,
            ...this.FormFotoComps.FormGroup.value
        };

        this._store
            .dispatch(new SetupNakesActions.CreateNakes(payload))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_nakes.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateNakes(data: any) {
        const payload = {
            ...data,
            ...this.FormBridgingComps.FormGroup.value,
            ...this.FormFotoComps.FormGroup.value
        };

        this._store
            .dispatch(new SetupNakesActions.UpdateNakes(payload))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_nakes.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusNakes(data: any) {
        const payload = {
            ...data,
            ...this.FormBridgingComps.FormGroup.value,
            ...this.FormFotoComps.FormGroup.value
        };

        this._store
            .dispatch(new SetupNakesActions.UpdateStatusNakes(payload))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_kamar.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private getJadwalNakes(id_nakes: number) {
        this._nakesJadwalService
            .getAll({ page: 1, count: 100, id_nakes: id_nakes })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.JadwalNakesDatasource = result.data.rows.map((item: any) => {
                        return {
                            ...item,
                            is_new: false,
                            is_edit: false
                        }
                    }).sort((a, b) => {
                        return a.urut - b.urut
                    })
                }
            })
    }

    handleAddJadwal() {
        let data = [...this.JadwalNakesDatasource];
        data.push({
            id_nakes: this.FormComps.FormGroup.get('id_nakes')?.value,
            id_hari: new Date().getDay(),
            jam_mulai: null,
            jam_selesai: null,
            urut: this.JadwalNakesDatasource.length + 1,
            is_active: true,
            is_new: true,
            is_edit: false
        });

        this.JadwalNakesDatasource = data;
    }

    handleFormatDisplayHari(id_hari: number) {
        return this.HariDatasource.find(item => item.value == id_hari).name;
    }

    handleSaveJadwal(index: number) {
        if (this.JadwalNakesDatasource[index].id_nakes_jadwal) {
            const payload = {
                id_nakes_jadwal: this.JadwalNakesDatasource[index].id_nakes_jadwal,
                id_nakes: this.JadwalNakesDatasource[index].id_nakes,
                id_hari: this.JadwalNakesDatasource[index].id_hari,
                jam_mulai: formatDate(this.JadwalNakesDatasource[index].jam_mulai, 'HH:mm', 'EN'),
                jam_selesai: formatDate(this.JadwalNakesDatasource[index].jam_selesai, 'HH:mm', 'EN'),
                urut: this.JadwalNakesDatasource[index].urut,
                is_active: this.JadwalNakesDatasource[index].is_active,
            };

            this._nakesJadwalService
                .update(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Jadwal berhasil diperbarui' });
                        this.getJadwalNakes(payload.id_nakes);
                    }
                })
        } else {
            const payload = {
                id_nakes: this.JadwalNakesDatasource[index].id_nakes,
                id_hari: this.JadwalNakesDatasource[index].id_hari,
                jam_mulai: formatDate(this.JadwalNakesDatasource[index].jam_mulai, 'HH:mm', 'EN'),
                jam_selesai: formatDate(this.JadwalNakesDatasource[index].jam_selesai, 'HH:mm', 'EN'),
                urut: this.JadwalNakesDatasource[index].urut,
                is_active: this.JadwalNakesDatasource[index].is_active,
            };

            this._nakesJadwalService
                .create(payload)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Jadwal berhasil ditambahkan' });
                        this.getJadwalNakes(payload.id_nakes);
                    }
                })
        }
    }

    handleEditJadwal(index: number) {
        let value = this.JadwalNakesDatasource.map((data: any, indexes: number) => {
            if (indexes == index) {
                const current_date = formatDate(new Date(), 'yyyy-MM-dd', 'EN');

                const jam_mulai = new Date(`${current_date}T${data.jam_mulai}`);
                const jam_selesai = new Date(`${current_date}T${data.jam_selesai}`);

                return {
                    ...data,
                    jam_mulai: jam_mulai,
                    jam_selesai: jam_selesai,
                    is_edit: indexes == index ? true : false
                }
            } else {
                return data;
            }
        });

        this.JadwalNakesDatasource = value;
    }

    handleDeleteJadwal(index: number) {
        if (this.JadwalNakesDatasource[index].id_nakes_jadwal) {
            this.JadwalNakesDatasource = this.JadwalNakesDatasource.map((item: any, indexes: number) => {
                if (indexes == index) {
                    return {
                        ...item,
                        jam_mulai: formatDate(item.jam_mulai, 'HH:mm:ss', 'EN'),
                        jam_selesai: formatDate(item.jam_selesai, 'HH:mm:ss', 'EN'),
                        is_edit: false,
                        is_new: false
                    }
                } else {
                    return item;
                }
            });

        } else {
            if (this.JadwalNakesDatasource.length > 0) {
                let data = JSON.parse(JSON.stringify(this.JadwalNakesDatasource));
                data.splice(index, 1);

                this.JadwalNakesDatasource = data;
            }
        }
    }

    handleUbahStatusJadwal(index: number) {
        const payload = {
            ...this.JadwalNakesDatasource[index],
            is_active: !this.JadwalNakesDatasource[index].is_active,
        };

        this._nakesJadwalService
            .update(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Jadwal berhasil diperbarui' });
                    this.getJadwalNakes(payload.id_nakes);
                }
            })
    }
}
