import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { Subject, BehaviorSubject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { ManajemenUserService } from 'src/app/services/setup-data/manajemen-user.service';
import { ManajemenUserActions, ManajemenUserState } from 'src/app/store/setup-data/manajemen-user';
import { SetupPoliState } from 'src/app/store/setup-data/setup-poli';

@Component({
    selector: 'app-manajemen-user',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        DropdownModule,
        FormsModule,
        CalendarModule,
    ],
    templateUrl: './manajemen-user.component.html',
    styleUrl: './manajemen-user.component.scss'
})
export class ManajemenUserComponent implements OnInit, OnDestroy {

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
        id: 'Setup_User',
        column: [
            { field: 'nik', headerName: 'NIK', class: 'font-semibold' },
            { field: 'nama', headerName: 'Nama Lengkap', },
            { field: 'jenis_kelamin', headerName: 'Gender', },
            { field: 'role', headerName: 'Role', },
            { field: 'poli', headerName: 'Nama Poli', },
            { field: 'is_active', headerName: 'Status Aktif', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', "Ubah Status", 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: true,
        searchKeyword: 'nama_User',
        searchPlaceholder: 'Cari Nama User Disini'
    };
    GridSelectedData: any;

    IsDokter = false;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    JadwalDokter: any[] = [];

    Hari: any[] = [
        {
            value: 0,
            label: 'Minggu'
        },
        {
            value: 1,
            label: 'Senin'
        },
        {
            value: 2,
            label: 'Selasa'
        },
        {
            value: 3,
            label: 'Rabu'
        },
        {
            value: 4,
            label: 'Kamis'
        },
        {
            value: 5,
            label: 'Jumat'
        },
        {
            value: 6,
            label: 'Sabtu'
        },
    ];

    constructor(
        private _store: Store,
        private _router: Router,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _manajemenUserService: ManajemenUserService,
    ) {
        this.FormProps = {
            id: 'form_manajemen_user',
            fields: [
                {
                    id: 'nama',
                    label: 'Nama Lengkap',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'nik',
                    label: 'No. Identitas',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'his_number',
                    label: 'HIS Number',
                    required: false,
                    type: 'text',
                    value: "",
                },
                {
                    id: 'no_hp',
                    label: 'No. Handphone',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'tanggal_lahir',
                    label: 'Tgl. Lahir',
                    required: false,
                    type: 'date',
                    value: '',
                },
                {
                    id: 'jenis_kelamin',
                    label: 'Gender',
                    required: false,
                    type: 'radio',
                    radioButtonProps: [
                        {
                            name: 'jenis_kelamin',
                            label: 'Laki - Laki',
                            value: 'LAKI - LAKI'
                        },
                        {
                            name: 'jenis_kelamin',
                            label: 'Perempuan',
                            value: 'PEREMPUAN'
                        },
                    ],
                    value: '',
                },
                {
                    id: 'id_role',
                    label: 'Role',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'role',
                        optionValue: 'id_role',
                        autoDisplayFirst: false
                    },
                    value: '',
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
                    hidden: false
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
            class: 'grid-rows-6 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
        this.getAllRole();
        this.getAllPoli();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        this._store
            .select(ManajemenUserState.allUserEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    console.log("get data from manajemen user =>", result);
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

    private getAllRole() {
        this._manajemenUserService
            .getAllRole()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_role');
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
            const index = this.FormProps.fields.findIndex(item => item.id == 'password');
            this.FormProps.fields[index].hidden = false;

            this.FormProps.class = 'grid-rows-6 grid-cols-2';

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
        const index = this.FormProps.fields.findIndex(item => item.id == 'password');
        this.FormProps.fields[index].hidden = true;

        this.FormProps.class = 'grid-rows-5 grid-cols-2';

        this.IsDokter = args.id_role == 1 ? true : false;

        this.PageState = 'form';
        this.FormState = 'update';
        this.ButtonNavigation = [];

        this.getByIdUser(args.uuid);
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
                    this.deleteUser(args.data.uuid);
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
                    this.updateStatusUser(args.data.uuid);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    private getByIdUser(uuid: string) {
        this._store
            .dispatch(new ManajemenUserActions.GetByIdUser(uuid))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.manajemen_user.single) {
                    // ** Set value ke Dynamic form components
                    this.FormComps.FormGroup.patchValue({
                        ...result.manajemen_user.single,
                        tanggal_lahir: new Date(result.manajemen_user.single.tanggal_lahir)
                    });

                    this.JadwalDokter = [];

                    result.manajemen_user.single.jadwal.forEach((item: any) => {
                        item.jam_buka.forEach((day: any) => {
                            this.JadwalDokter.push({
                                id_hari: day.id_hari,
                                hari: item.hari,
                                jam_mulai: new Date(formatDate(new Date(), 'yyyy-MM-dd', 'EN') + 'T' + day.jam_mulai + '.000Z'),
                                jam_selesai: new Date(formatDate(new Date(), 'yyyy-MM-dd', 'EN') + 'T' + day.jam_selesai + '.000Z'),
                            })
                        });
                    });
                }
            });
    }

    saveUser(data: any) {
        this._store
            .dispatch(new ManajemenUserActions.CreateUser(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.manajemen_user.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateUser(data: any) {
        const payload = {
            his_number: data.his_number,
            nik: data.nik,
            nama: data.nama,
            no_hp: data.no_hp,
            tanggal_lahir: data.tanggal_lahir,
            jenis_kelamin: data.jenis_kelamin,
            id_role: data.id_role,
            id_poli: data.id_poli,
            jadwal: []
        };

        this._store
            .dispatch(new ManajemenUserActions.UpdateUser(data.uuid, payload))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.manajemen_user.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    updateUserDokter(data: any) {
        const payload: any = {
            nik: data.nik,
            his_number: data.his_number,
            nama: data.nama,
            no_hp: data.no_hp,
            tanggal_lahir: data.tanggal_lahir,
            jenis_kelamin: data.jenis_kelamin,
            id_role: data.id_role,
            id_poli: data.id_poli,
            jadwal: this.JadwalDokter
                .map((item: any) => {
                    return {
                        id_hari: item.id_hari,
                        hari: this.Hari.find(day => day.value == item.id_hari).label,
                        jam_mulai: formatDate(new Date(item.jam_mulai), 'HH:mm', 'EN'),
                        jam_selesai: formatDate(new Date(item.jam_selesai), 'HH:mm', 'EN'),
                    }
                }).reduce((acc: any, curr: any) => {
                    const { id_hari, hari, jam_mulai, jam_selesai } = curr;
                    const existingDay = acc.find((day: any) => day.id_hari === id_hari);

                    if (existingDay) {
                        existingDay.jam_buka.push({
                            id_hari,
                            jam_mulai,
                            jam_selesai,
                        });
                    } else {
                        acc.push({
                            id_hari,
                            hari,
                            jam_buka: [{
                                id_hari,
                                jam_mulai,
                                jam_selesai,
                            }]
                        });
                    }

                    return acc;
                }, [])
        };

        this._store
            .dispatch(new ManajemenUserActions.UpdateUserDokter(data.uuid, payload))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                // console.log("result update dokter =>", result);

                if (result.manajemen_user.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private updateStatusUser(uuid: string) {
        this._store
            .dispatch(new ManajemenUserActions.UpdateStatusUser(uuid))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.manajemen_user.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Status Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private deleteUser(uuid: string) {
        this._store
            .dispatch(new ManajemenUserActions.DeleteUser(uuid))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.manajemen_user.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Dihapus' });
                    this.handleBackToList();
                }
            })
    }

    handleAddNewJadwal() {
        this.JadwalDokter.push({
            hari: null,
            jam_mulai: null,
            jam_selesai: null,
        });
    }

    handleDeleteJadwal(index: number) {
        if (this.JadwalDokter.length > 1) {
            this.JadwalDokter.splice(index, 1);
        }
    }

}
