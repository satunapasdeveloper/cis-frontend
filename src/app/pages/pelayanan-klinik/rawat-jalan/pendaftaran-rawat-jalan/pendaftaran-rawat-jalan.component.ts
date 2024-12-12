import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { map, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { SearchPasienDialogComponent } from 'src/app/components/dialog/search-pasien-dialog/search-pasien-dialog.component';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { PendaftaranRawatJalanService } from 'src/app/services/pelayanan-klinik/rawat-jalan/pendaftaran-rawat-jalan.service';
import { NakesJadwalService } from 'src/app/services/pelayanan-klinik/setup-data/nakes-jadwal.service';
import { ManajemenAntrianService } from 'src/app/services/pendaftaran-klinik/antrian/manajemen-antrian.service';
import { SetupKelasActions, SetupKelasState } from 'src/app/store/setup-data/kelas';
import { SetupPenjaminActions, SetupPenjaminState } from 'src/app/store/setup-data/penjamin';
import { SetupPoliActions, SetupPoliState } from 'src/app/store/setup-data/setup-poli';

@Component({
    selector: 'app-pendaftaran-rawat-jalan',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        DynamicFormComponent,
        ButtonModule,
        DialogModule,
        SearchPasienDialogComponent
    ],
    templateUrl: './pendaftaran-rawat-jalan.component.html',
    styleUrl: './pendaftaran-rawat-jalan.component.scss'
})
export class PendaftaranRawatJalanComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Back',
            icon: 'pi pi-chevron-left'
        },
        {
            id: 'save_umum',
            title: 'Simpan',
            icon: 'pi pi-save'
        }
    ];

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    @ViewChild('DialogSearchPasienComps') DialogSearchPasienComps!: SearchPasienDialogComponent;

    ShowFormResult = false;
    FormResultProps: FormModel.IForm;
    @ViewChild('FormResultComps') FormResultComps!: DynamicFormComponent;

    constructor(
        private _store: Store,
        private _router: Router,
        private _messageService: MessageService,
        private _nakesJadwalService: NakesJadwalService,
        private _manajemenAntrianService: ManajemenAntrianService,
        private _pendaftaranRawatJalanService: PendaftaranRawatJalanService,
    ) {
        this.FormProps = {
            id: 'form_header_admisi_rawat_jalan',
            fields: [
                {
                    id: 'no_antrian',
                    label: 'No. Antrian',
                    required: true,
                    type: 'text',
                    value: '',
                    placeholder: 'Tekan enter untuk mencari nomor antrian',
                    onChange: (event) => {
                        this.getDetailAntrian(event, formatDate(new Date(), 'yyyy-MM-dd', 'en-US'));
                        this.ShowFormResult = event ? true : false;
                    }
                },
                {
                    id: 'no_rekam_medis',
                    label: 'No. Rekam Medis',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                    placeholder: 'Klik untuk mencari pasien',
                    onClick: () => {
                        this.DialogSearchPasienComps.ShowDialog = true;
                    }
                },
                {
                    id: 'no_rujukan',
                    label: 'No. Rujukan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'no_surat_kontrol',
                    label: 'No. Surat Kontrol',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_pasien',
                    label: 'Id Pasien',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-1 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };

        this.FormResultProps = {
            id: 'form_detail_admisi_rawat_jalan',
            fields: [
                {
                    id: 'nama_pasien',
                    label: 'Nama Pasien',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'id_penjamin',
                    label: 'Penjamin',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        optionName: 'nama_penjamin',
                        optionValue: 'id_penjamin',
                        options: []
                    },
                    value: '',
                },
                {
                    id: 'no_penjamin',
                    label: 'No. Kepesertaan Penjamin',
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
                        optionName: 'nama_poli',
                        optionValue: 'id_poli',
                        options: []
                    },
                    value: '',
                },
                {
                    id: 'id_dokter',
                    label: 'Dokter',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        optionName: 'nama',
                        optionValue: 'id_nakes',
                        options: [],
                        customField: {
                            title: 'nama',
                            subtitle: 'jadwal',
                        }
                    },
                    value: '',
                    onChange: (args) => {
                        if (args) {
                            this.FormResultComps.FormGroup.get('id_jadwal_dokter')?.setValue(args.id_nakes_jadwal);
                        }
                    }
                },
                {
                    id: 'id_jadwal_dokter',
                    label: 'Jadwal Dokter',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_kelas_rawat',
                    label: 'Kelas',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        optionName: 'nama_kelas',
                        optionValue: 'id_kelas',
                        options: []
                    },
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-3 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAllPenjamin();
        this.getAllPoli();
        this.getAllJadwalDokter();
        this.getAllKelas();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'save_umum') {
            this.onSaveUmum();
        };

        if (data.id == 'back') {
            this._router.navigate(['/pelayanan-klinik/rawat-jalan/pelayanan']);
        };
    }

    private getDetailAntrian(no_antrian: string, tanggal: string) {
        this._manajemenAntrianService
            .getDetailAntrian(no_antrian, tanggal)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.data) {
                    console.log(result.data);

                    // !! Check jenis antrian = BPJS or UMUM
                    if (result.data.jenis_antrian == 'BPJS') {
                        this.FormProps.fields[2].hidden = false;
                        this.FormProps.fields[3].hidden = false;
                        this.FormProps.class = "grid-rows-2 grid-cols-2";
                        this.ButtonNavigation = [
                            {
                                id: 'back',
                                title: 'Back',
                                icon: 'pi pi-chevron-left'
                            },
                            {
                                id: 'save_bpjs',
                                title: 'Simpan',
                                icon: 'pi pi-save'
                            }
                        ];
                    };

                    // !! Check jenis antrian = BPJS or UMUM
                    if (result.data.jenis_antrian == 'UMUM') {
                        this.FormProps.fields[2].hidden = true;
                        this.FormProps.fields[3].hidden = true;
                        this.FormProps.class = "grid-rows-1 grid-cols-2";
                        this.ButtonNavigation = [
                            {
                                id: 'back',
                                title: 'Back',
                                icon: 'pi pi-chevron-left'
                            },
                            {
                                id: 'save_umum',
                                title: 'Simpan',
                                icon: 'pi pi-save'
                            }
                        ];
                    };

                } else {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Nomor antrian tidak ditemukan' });
                }
            })
    }

    handleSelectLookupPasien(args: any) {
        console.log("pasien from lookup =>", args);
        this.FormComps.FormGroup.get('id_pasien')?.setValue(args.id_pasien);
        this.FormComps.FormGroup.get('no_rekam_medis')?.setValue(args.no_rekam_medis);
        this.FormResultComps.FormGroup.get('nama_pasien')?.setValue(args.nama_pasien);
        const id_pasien = args.id_pasien;
    }

    private getAllPenjamin() {
        this._store
            .select(SetupPenjaminState.penjaminActives)
            .pipe(
                takeUntil(this.Destroy$),
                switchMap((result) => {
                    if (result?.length) {
                        return of(result); // Use existing result
                    } else {
                        // Dispatch action and wait for the response
                        this._store.dispatch(new SetupPenjaminActions.GetAllActivePenjamin({ page: 1, count: 100 }));

                        return this._store
                            .select(SetupPenjaminState.penjaminActives)
                            .pipe(
                                take(1), // Take only the first emitted value
                                map((fetchedResult) => fetchedResult)
                            );
                    }
                })
            )
            .subscribe((options) => {
                const index = this.FormResultProps.fields.findIndex((field) => field.id === 'id_penjamin');
                if (index !== -1) {
                    this.FormResultProps.fields[index] = {
                        ...this.FormResultProps.fields[index], // Ensure immutability
                        dropdownProps: {
                            ...this.FormResultProps.fields[index].dropdownProps,
                            options,
                        },
                    };
                }
            });

    }

    private getAllPoli() {
        this._store
            .select(SetupPoliState.poliActives)
            .pipe(
                takeUntil(this.Destroy$),
                switchMap((result) => {
                    if (result?.length) {
                        return of(result); // Use existing result
                    } else {
                        // Dispatch action and wait for the response
                        this._store.dispatch(new SetupPoliActions.GetAllActivePoli({ page: 1, count: 100 }));

                        return this._store
                            .select(SetupPoliState.poliActives)
                            .pipe(
                                take(1), // Take only the first emitted value
                                map((fetchedResult) => fetchedResult)
                            );
                    }
                })
            )
            .subscribe((options) => {
                const index = this.FormResultProps.fields.findIndex((field) => field.id === 'id_poli');
                if (index !== -1) {
                    this.FormResultProps.fields[index] = {
                        ...this.FormResultProps.fields[index], // Ensure immutability
                        dropdownProps: {
                            ...this.FormResultProps.fields[index].dropdownProps,
                            options,
                        },
                    };
                }
            });

    }

    private getAllJadwalDokter() {
        this._nakesJadwalService
            .getAll({ page: 1, count: 100, id_hari: new Date().getDay() })
            .pipe(
                takeUntil(this.Destroy$),
                map((result: any) => {
                    result.data.rows = result.data.rows.map((item: any) => {
                        return {
                            id_nakes: item.id_nakes,
                            id_nakes_jadwal: item.id_nakes_jadwal,
                            nama: item.nakes.nama,
                            jadwal: `${item.jam_mulai} s/d ${item.jam_selesai}`,
                        }
                    });

                    return result.data.rows;
                })
            )
            .subscribe((result) => {
                const index = this.FormResultProps.fields.findIndex((field) => field.id === 'id_dokter');
                this.FormResultProps.fields[index].dropdownProps.options = result;
            })
    }

    private getAllKelas() {
        this._store
            .select(SetupKelasState.kelasActives)
            .pipe(
                takeUntil(this.Destroy$),
                switchMap((result) => {
                    if (result?.length) {
                        return of(result); // Use existing result
                    } else {
                        // Dispatch action and wait for the response
                        this._store.dispatch(new SetupKelasActions.GetAllActiveKelas({ page: 1, count: 100 }));

                        return this._store
                            .select(SetupKelasState.kelasActives)
                            .pipe(
                                take(1), // Take only the first emitted value
                                map((fetchedResult) => fetchedResult)
                            );
                    }
                })
            )
            .subscribe((options) => {
                const index = this.FormResultProps.fields.findIndex((field) => field.id === 'id_kelas_rawat');
                if (index !== -1) {
                    this.FormResultProps.fields[index] = {
                        ...this.FormResultProps.fields[index], // Ensure immutability
                        dropdownProps: {
                            ...this.FormResultProps.fields[index].dropdownProps,
                            options,
                        },
                    };
                }
            });

    }

    private onSaveUmum() {
        const payload = {
            ...this.FormComps.FormGroup.value,
            ...this.FormResultComps.FormGroup.value,
            tanggal_admisi: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
        };

        delete payload.no_rujukan;
        delete payload.no_surat_kontrol;

        this._pendaftaranRawatJalanService
            .createUmum(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil disimpan' });

                    setTimeout(() => {
                        this.handleClickButtonNavigation({ id: 'back', icon: 'back', title: 'back' })
                    }, 500);
                }
            })
    }
}
