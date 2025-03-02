import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Subject, takeUntil, switchMap, of, take, map } from 'rxjs';
import { SearchPasienDialogComponent } from 'src/app/components/dialog/search-pasien-dialog/search-pasien-dialog.component';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { PendaftaranRawatJalanModel } from 'src/app/model/pages/pelayanan/rawat-jalan/pendaftara-rawat-jalan.model';
import { PendaftaranRawatInapService } from 'src/app/services/pelayanan-klinik/rawat-inap/pendaftaran-rawat-inap.service';
import { AsalRujukanService } from 'src/app/services/pelayanan-klinik/setup-data/asal-rujukan.service';
import { NakesJadwalService } from 'src/app/services/pelayanan-klinik/setup-data/nakes-jadwal.service';
import { ManajemenAntrianService } from 'src/app/services/pendaftaran-klinik/antrian/manajemen-antrian.service';
import { SetupBedActions, SetupBedState } from 'src/app/store/setup-data/bed';
import { SetupKamarActions, SetupKamarState } from 'src/app/store/setup-data/kamar';
import { SetupKelasState, SetupKelasActions } from 'src/app/store/setup-data/kelas';
import { SetupPenjaminState, SetupPenjaminActions } from 'src/app/store/setup-data/penjamin';
import { SetupPoliState, SetupPoliActions } from 'src/app/store/setup-data/setup-poli';

@Component({
    selector: 'app-pendaftaran-rawat-inap',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        DynamicFormComponent,
        ButtonModule,
        DialogModule,
        SearchPasienDialogComponent
    ],
    templateUrl: './pendaftaran-rawat-inap.component.html',
    styleUrl: './pendaftaran-rawat-inap.component.scss'
})
export class PendaftaranRawatInapComponent implements OnInit, OnDestroy {

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

    IsPendaftaranBpjs = false;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    @ViewChild('DialogSearchPasienComps') DialogSearchPasienComps!: SearchPasienDialogComponent;

    ShowFormResult = false;
    FormResultProps: FormModel.IForm;
    @ViewChild('FormResultComps') FormResultComps!: DynamicFormComponent;

    ShowDialogCekPasienBpjs = false;
    ResultCekPasienBpjs!: PendaftaranRawatJalanModel.CekPasienBpjs['data'];

    IsPendfataranBpjsWithSep = false;

    constructor(
        private _store: Store,
        private _router: Router,
        private _messageService: MessageService,
        private _nakesJadwalService: NakesJadwalService,
        private _asalRujukanService: AsalRujukanService,
        private _manajemenAntrianService: ManajemenAntrianService,
        private _pendaftaranRawatInapService: PendaftaranRawatInapService,
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
                    onChange: (args) => {
                        const index = this.FormResultProps.fields.findIndex((field) => field.id === 'id_dokter');

                        if (args) {
                            this.FormResultProps.fields[index].type = 'select';
                            this.FormResultProps.fields[index].readonly = false;
                            this.getAllJadwalDokter(args.id_poli);
                        } else {
                            this.FormResultProps.fields[index].type = 'text';
                            this.FormResultProps.fields[index].readonly = true;
                        }
                    }
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
                {
                    id: 'id_bed_kamar',
                    label: 'Kamar',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        optionName: 'label_kamar',
                        optionValue: 'id_bed_kamar',
                        options: []
                    },
                    value: '',
                    onChange: (args) => {
                        if (args) {
                            this._store.dispatch(new SetupBedActions.GetAllActiveBed({ page: 1, count: 100 }));
                            this.getAllBed(args.id_bed_kamar)
                        }
                    }
                },
                {
                    id: 'id_bed',
                    label: 'Tempat Tidur',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        optionName: 'no_bed',
                        optionValue: 'id_bed',
                        options: []
                    },
                    value: '',
                },
                {
                    id: 'id_dokter',
                    label: 'Dokter',
                    required: true,
                    type: 'text',
                    readonly: true,
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
                            this.FormResultComps.FormGroup.get('kode_dpjp')?.setValue(args.kode_dpjp);
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
                    id: 'kode_dpjp',
                    label: 'Kode DPJP',
                    required: false,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_asal_rujukan',
                    label: 'Asal Rujukan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        optionName: 'asal_rujukan',
                        optionValue: 'id_asal_rujukan',
                        options: []
                    },
                    value: '',
                    hidden: true,
                },
                {
                    id: 'is_katarak',
                    label: 'Apakah Katarak',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        optionName: 'name',
                        optionValue: 'value',
                        options: [
                            { name: 'Tidak', value: false },
                            { name: 'Iya', value: true },
                        ]
                    },
                    value: '',
                    hidden: true,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAllPenjamin();
        this.getAllPoli();
        this.getAllKelas();
        this.getAllAsalRujukan();
        this.getAllBedKamar();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'save_umum') {
            this.onSaveUmum();
        };

        if (data.id == 'save_with_sep') {
            this.onSaveWithSep();
        };

        if (data.id == 'save_without_sep') {
            this.onSaveWithoutSep();
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
                    const indexAsalRujukan = this.FormResultProps.fields.findIndex((field) => field.id === 'id_asal_rujukan');

                    // !! Check jenis antrian = BPJS or UMUM
                    if (result.data.jenis_antrian == 'BPJS') {
                        this.FormResultProps.fields[indexAsalRujukan].hidden = false;
                        this.IsPendaftaranBpjs = true;
                        this.ButtonNavigation = [
                            {
                                id: 'back',
                                title: 'Back',
                                icon: 'pi pi-chevron-left'
                            }
                        ];
                    };

                    // !! Check jenis antrian = BPJS or UMUM
                    if (result.data.jenis_antrian == 'UMUM') {
                        this.FormResultProps.fields[indexAsalRujukan].hidden = true;
                        this.IsPendaftaranBpjs = false;
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
        this.FormComps.FormGroup.get('id_pasien')?.setValue(args.id_pasien);
        this.FormComps.FormGroup.get('no_rekam_medis')?.setValue(args.no_rekam_medis);
        this.FormResultComps.FormGroup.get('nama_pasien')?.setValue(args.nama_pasien);

        const id_pasien = args.id_pasien;

        if (this.IsPendaftaranBpjs) {
            this.onCheckPasienBpjs(id_pasien);
        }
    }

    private getAllBedKamar() {
        this._store
            .select(SetupKamarState.kamarActives)
            .pipe(
                takeUntil(this.Destroy$),
                switchMap((result) => {
                    if (result?.length) {
                        return of(result); // Use existing result
                    } else {
                        // Dispatch action and wait for the response
                        this._store.dispatch(new SetupKamarActions.GetAllActiveKamar({ page: 1, count: 100 }));

                        return this._store
                            .select(SetupKamarState.kamarActives)
                            .pipe(
                                take(1), // Take only the first emitted value
                                map((fetchedResult) => fetchedResult)
                            );
                    }
                })
            )
            .subscribe((options) => {
                const index = this.FormResultProps.fields.findIndex((field) => field.id === 'id_bed_kamar');
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

    private getAllBed(id_bed_kamar: any) {
        this._store
            .select(SetupBedState.bedActives)
            .pipe(
                takeUntil(this.Destroy$),
                switchMap((result) => {
                    if (result?.length) {
                        return of(result); // Use existing result
                    } else {
                        // Dispatch action and wait for the response
                        this._store.dispatch(new SetupBedActions.GetAllActiveBed({ page: 1, count: 100 }));

                        return this._store
                            .select(SetupBedState.bedActives)
                            .pipe(
                                take(1), // Take only the first emitted value
                                map((fetchedResult) => fetchedResult)
                            );
                    }
                })
            )
            .subscribe((options) => {
                const index = this.FormResultProps.fields.findIndex((field) => field.id === 'id_bed');
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

    private getAllJadwalDokter(id_poli: string) {
        this._nakesJadwalService
            .getByPoliAndHari(id_poli, new Date().getDay().toString())
            .pipe(
                takeUntil(this.Destroy$),
                map((result: any) => {
                    return result.data ? result.data.map((item: any) => {
                        return {
                            id_nakes: item.id_nakes,
                            id_nakes_jadwal: item.id_nakes_jadwal,
                            nama: item.nakes.nama,
                            jadwal: `${item.jam_mulai} s/d ${item.jam_selesai}`,
                            kode_dpjp: item.nakes.kode_dpjp
                        }
                    }) : [];
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

        delete payload.nama_pasien;
        delete payload.no_penjamin;
        delete payload.no_rekam_medis;
        delete payload.no_rujukan;
        delete payload.no_surat_kontrol;
        delete payload.kode_dpjp;
        delete payload.is_katarak;

        this._pendaftaranRawatInapService
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

    // ** BPJS METHOD WILL BE HERE **
    private getAllAsalRujukan() {
        this._asalRujukanService
            .getAllActive({ page: 1, count: 1000 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                const index = this.FormResultProps.fields.findIndex((field) => field.id === 'id_asal_rujukan');
                this.FormResultProps.fields[index].dropdownProps.options = result.data.rows;
            })
    }

    private onCheckPasienBpjs(id_pasien: string, no_rujukan?: string) {
        this._pendaftaranRawatInapService
            .cekPasienBpjs(id_pasien, no_rujukan)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    result.data.no_rujukan = result.data.log_cek.find((item: any) => item.status == 1 && item.title == "Cek rujukan pasien")?.no_rujukan || '';
                    this.ResultCekPasienBpjs = result.data;
                    this.ShowDialogCekPasienBpjs = true;
                }
            })
    }

    handleCloseDialogCekPasienBpjs(with_sep: boolean) {
        this.IsPendfataranBpjsWithSep = with_sep;

        const dataPenjamin = this.FormResultProps.fields.find((field) => field.id === 'id_penjamin')?.dropdownProps.options;
        const id_penjamin_bpjs = dataPenjamin.find((item: any) => item.nama_penjamin.toLowerCase() == 'bpjs')?.id_penjamin;
        this.FormResultComps.FormGroup.get('id_penjamin')?.setValue(id_penjamin_bpjs);
        this.FormResultComps.FormGroup.get('no_penjamin')?.setValue(this.ResultCekPasienBpjs.no_kartu_bpjs);

        const indexIsKatarak = this.FormResultProps.fields.findIndex((field) => field.id === 'is_katarak');

        if (with_sep) {
            this.ButtonNavigation = [
                {
                    id: 'back',
                    title: 'Back',
                    icon: 'pi pi-chevron-left'
                },
                {
                    id: 'save_with_sep',
                    title: 'Buat SEP & Simpan Pendaftaran',
                    icon: 'pi pi-save'
                }
            ];

            this.FormProps.fields[2].hidden = false;
            this.FormProps.fields[3].hidden = false;
            this.FormProps.class = "grid-rows-2 grid-cols-2";
            this.FormComps.FormGroup.get('no_rujukan')?.setValue(this.ResultCekPasienBpjs.no_rujukan);

            this.FormResultProps.fields[indexIsKatarak].hidden = false;
            this.FormResultProps.class = "grid-rows-5 grid-cols-2";
        }

        if (!with_sep) {
            this.ButtonNavigation = [
                {
                    id: 'back',
                    title: 'Back',
                    icon: 'pi pi-chevron-left'
                },
                {
                    id: 'save_without_sep',
                    title: 'Simpan Pendaftaran Tanpa SEP',
                    icon: 'pi pi-save'
                }
            ];

            this.FormProps.fields[2].hidden = true;
            this.FormProps.fields[3].hidden = true;
            this.FormProps.class = "grid-rows-1 grid-cols-2";
            this.FormComps.FormGroup.get('no_rujukan')?.setValue('');

            this.FormResultProps.fields[indexIsKatarak].hidden = true;
            this.FormResultProps.class = "grid-rows-5 grid-cols-2";
        }

        this.ShowDialogCekPasienBpjs = false;
    }

    private onSaveWithoutSep() {
        let payload = {
            ...this.FormComps.FormGroup.value,
            ...this.FormResultComps.FormGroup.value,
            tanggal_admisi: new Date(),
            log_cek_bpjs: this.ResultCekPasienBpjs.log_cek
        };

        delete payload.nama_pasien;
        delete payload.no_penjamin;
        delete payload.no_rekam_medis;
        delete payload.no_rujukan;
        delete payload.no_surat_kontrol;
        delete payload.kode_dpjp;
        delete payload.is_katarak;

        this._pendaftaranRawatInapService
            .createBpjsTanpaSep(payload)
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

    private onSaveWithSep() {
        let payload = {
            ...this.FormComps.FormGroup.value,
            ...this.FormResultComps.FormGroup.value,
            tanggal_admisi: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
            log_cek_bpjs: this.ResultCekPasienBpjs.log_cek
        };

        delete payload.nama_pasien;
        delete payload.no_penjamin;
        delete payload.no_rekam_medis;

        this._pendaftaranRawatInapService
            .createBpjsDenganSep(payload)
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
