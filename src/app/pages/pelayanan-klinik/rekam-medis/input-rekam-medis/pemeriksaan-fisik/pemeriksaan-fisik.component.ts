import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { RekamMedisService } from 'src/app/services/pelayanan-klinik/rekam-medis/rekam-medis.service';
import { RekamMedisState } from 'src/app/store/rekam-medis';

@Component({
    selector: 'app-pemeriksaan-fisik',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        DashboardComponent,
        DashboardComponent,
        ReactiveFormsModule,
        DynamicFormComponent,
    ],
    templateUrl: './pemeriksaan-fisik.component.html',
    styleUrl: './pemeriksaan-fisik.component.scss'
})
export class PemeriksaanFisikComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    RiwayatPenyakitFilter = new BehaviorSubject<string>("");
    RiwayatPenyakitDatasource: any[] = [];
    RiwayatPenyakitPasien$ = new BehaviorSubject<any[]>([]);

    RiwayatPenyakitKeluargaFilter = new BehaviorSubject<string>("");
    RiwayatPenyakitKeluargaDatasource: any[] = [];
    RiwayatPenyakitKeluarga$ = new BehaviorSubject<any[]>([]);

    RiwayatAlergiMakananFilter = new BehaviorSubject<string>("");
    RiwayatAlergiMakananDatasource: any[] = [];
    RiwayatAlergiMakanan$ = new BehaviorSubject<any[]>([]);

    RiwayatAlergiObatFilter = new BehaviorSubject<string>("");
    RiwayatAlergiObatDatasource: any[] = [];
    RiwayatAlergiObat$ = new BehaviorSubject<any[]>([]);

    FormKeadaanUmumProps: FormModel.IForm;
    @ViewChild('FormKeadaanUmumComps') FormKeadaanUmumComps!: DynamicFormComponent;

    FormVitalSignProps: FormModel.IForm;
    @ViewChild('FormVitalSignComps') FormVitalSignComps!: DynamicFormComponent;

    BodyParts: any[] = this._rekamMedisService.BodyParts;
    CatatanKondisiTubuh$ = new BehaviorSubject<any[]>([]);

    constructor(
        private _store: Store,
        private _cdr: ChangeDetectorRef,
        private _rekamMedisService: RekamMedisService
    ) {
        this.FormProps = {
            id: 'form_assesment_pasien',
            fields: [
                {
                    id: 'id_register',
                    label: 'Id Register',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
                },
                {
                    id: 'keluhan_utama',
                    label: 'Keluhan Utama',
                    required: true,
                    type: 'textarea',
                    textareaRow: 3,
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-1 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };

        this.FormKeadaanUmumProps = {
            id: 'form_keadaan_umum',
            fields: [
                {
                    id: 'tinggi_badan_cm',
                    label: 'Tinggi Badan (cm)',
                    required: true,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'berat_badan_kg',
                    label: 'Berat Badan (kg)',
                    required: true,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'imt',
                    label: 'IMT',
                    required: true,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'kategori_imt',
                    label: 'Kategori IMT',
                    required: true,
                    type: 'text',
                    readonly: true,
                    value: "",
                },
                {
                    id: 'luas_permukaan_tubuh_cm',
                    label: 'Luas Permukaan Tubuh (cm)',
                    required: true,
                    type: 'number',
                    value: 0,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-3',
            state: 'write',
            defaultValue: null,
        };

        this.FormVitalSignProps = {
            id: 'form_vital_sign',
            fields: [
                {
                    id: 'sistole',
                    label: 'Sistole (mm/Hg)',
                    required: true,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'distole',
                    label: 'Diastole (mm/Hg)',
                    required: true,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'id_tingkat_kesadaran',
                    label: 'Tingkat Kesadaran',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: "tingkat_kesadaran",
                        optionValue: "id_tingkat_kesadaran"
                    },
                    value: "",
                },
                {
                    id: 'spO2',
                    label: 'SpO2 (%)',
                    required: false,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'suhu_tubuh',
                    label: 'Suhu Tubuh (°C)',
                    required: true,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'denyut_nadi',
                    label: 'Denyut Nadi (/menit)',
                    required: true,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'pernafasan_menit',
                    label: 'Pernafasan (/menit)',
                    required: true,
                    type: 'number',
                    value: 0,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-3 grid-cols-3',
            state: 'write',
            defaultValue: null,
        };

        this.RiwayatPenyakitFilter
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((result) => {
                if (result) {
                    this.getVariable('penyakit_pribadi', result);
                }
            });

        this.RiwayatPenyakitKeluargaFilter
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((result) => {
                if (result) {
                    this.getVariable('penyakit_keluarga', result);
                }
            });

        this.RiwayatAlergiMakananFilter
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((result) => {
                if (result) {
                    this.getVariable('alergi_makanan', result);
                }
            });

        this.RiwayatAlergiObatFilter
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((result) => {
                if (result) {
                    this.getVariable('alergi_obat', result);
                }
            });
    }

    ngOnInit(): void {
        this.handleAddCatatanTubuh();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getPemeriksaanFisik();
        }, 100);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getPemeriksaanFisik() {
        this._store
            .select(RekamMedisState.rekamMedisDetail)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result?.pemeriksaan_fisik) {
                    this.FormComps.FormGroup.patchValue({
                        id_pendaftaran: result.assesment!.id_pendaftaran,
                        tingkat_kesadaran: result.assesment!.kesadaran,
                        pernafasan: result.assesment!.pernafasan,
                        resiko_jatuh: result.assesment!.resiko_jatuh,
                        skala_nyeri: result.assesment!.nyeri,
                        batuk: result.assesment!.batuk,
                    });
                    this.FormKeadaanUmumComps.FormGroup.patchValue(result.pemeriksaan_fisik);
                    this.FormVitalSignComps.FormGroup.patchValue(result.pemeriksaan_fisik);

                    let pemeriksaan_fisik = result.pemeriksaan_fisik.kondisi_tubuh.map((item) => {
                        return {
                            ...item,
                            is_new: false,
                            is_edit: false
                        }
                    });

                    this.CatatanKondisiTubuh$.next(pemeriksaan_fisik);
                    this._cdr.detectChanges();
                }
            })
    }

    private getVariable(type: 'penyakit_pribadi' | 'penyakit_keluarga' | 'alergi_makanan' | 'alergi_obat', keyword: string) {
        if (type == 'penyakit_pribadi') {
            this._rekamMedisService
                .getRiwayatPenyakitPribadi(keyword)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    this.RiwayatPenyakitDatasource = result;
                })
        };

        if (type == 'penyakit_keluarga') {
            this._rekamMedisService
                .getRiwayatPenyakitKeluarga(keyword)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    this.RiwayatPenyakitKeluargaDatasource = result;
                })
        };

        if (type == 'alergi_makanan') {
            this._rekamMedisService
                .getRiwayatAlergiMakanan(keyword)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    this.RiwayatAlergiMakananDatasource = result;
                });
        };

        if (type == 'alergi_obat') {
            this._rekamMedisService
                .getRiwayatAlergiMakanan(keyword)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    this.RiwayatAlergiObatDatasource = result;
                });
        };
    }

    handleChangeFilter(type: 'penyakit_pribadi' | 'penyakit_keluarga' | 'alergi_makanan' | 'alergi_obat', args: any) {
        if (type == 'penyakit_pribadi') {
            this.RiwayatPenyakitFilter.next(args.filter);
        };

        if (type == 'penyakit_keluarga') {
            this.RiwayatPenyakitKeluargaFilter.next(args.filter);
        };

        if (type == 'alergi_makanan') {
            this.RiwayatAlergiMakananFilter.next(args.filter);
        };

        if (type == 'alergi_obat') {
            this.RiwayatAlergiObatFilter.next(args.filter);
        };
    }

    handleChangeRiwayatPenyakit(args: any, index: number) {
        if (args.value) {
            let riwayatPenyakit = [...this.RiwayatPenyakitPasien$.value];
            riwayatPenyakit[index] = { ...args.value };
            this.RiwayatPenyakitPasien$.next([]);
            this.RiwayatPenyakitPasien$.next(riwayatPenyakit);
        }
    }

    handleAddRiwayatPenyakit() {
        let riwayatPenyakit = [...this.RiwayatPenyakitPasien$.value];

        riwayatPenyakit = riwayatPenyakit.map((data: any) => {
            return {
                ...data,
                is_new: false,
                is_edit: false
            }
        });

        riwayatPenyakit.push({
            id: '',
            url: '',
            code: '',
            display: '',
            keterangan: '',
            jenis_data: '',
            is_new: true,
            is_edit: false
        });

        console.log("riwayat penyakit =>", riwayatPenyakit);

        this.RiwayatPenyakitPasien$.next([]);
        this.RiwayatPenyakitPasien$.next(riwayatPenyakit);
    }

    handleEditRiwayatPenyakit(index: number) {
        let value = this.RiwayatPenyakitPasien$.value.map((data: any, indexes: number) => {
            return {
                ...data,
                is_edit: indexes == index ? true : false
            }
        });

        this.RiwayatPenyakitPasien$.next([]);
        this.RiwayatPenyakitPasien$.next(value);
    }

    handleDeleteRiwayatPenyakit(index: number) {
        let value = this.RiwayatPenyakitPasien$.value;

        if (value.length > 0) {
            value.splice(index, 1);
            this.RiwayatPenyakitPasien$.next([]);
            this.RiwayatPenyakitPasien$.next(value);
        }
    }

    handleAddRiwayatPenyakitKeluarga() {
        let riwayatPenyakit = [...this.RiwayatPenyakitKeluarga$.value];

        riwayatPenyakit.push({
            id: '',
            url: '',
            code: '',
            display: '',
            keterangan: '',
            jenis_data: '',
            is_new: true,
            is_edit: false
        });

        this.RiwayatPenyakitKeluarga$.next([]);
        this.RiwayatPenyakitKeluarga$.next(riwayatPenyakit);
    }

    handleEditRiwayatPenyakitKeluarga(index: number) {
        let value = this.RiwayatPenyakitKeluarga$.value.map((data: any, indexes: number) => {
            return {
                ...data,
                is_edit: indexes == index ? true : false
            }
        });

        this.RiwayatPenyakitKeluarga$.next([]);
        this.RiwayatPenyakitKeluarga$.next(value);
    }

    handleDeleteRiwayatPenyakitKeluarga(index: number) {
        let value = this.RiwayatPenyakitKeluarga$.value;

        if (value.length > 0) {
            value.splice(index, 1);
            this.RiwayatPenyakitKeluarga$.next([]);
            this.RiwayatPenyakitKeluarga$.next(value);
        }
    }

    handleAddRiwayatAlergiMakanan() {
        let riwayatPenyakit = [...this.RiwayatAlergiMakanan$.value];

        riwayatPenyakit.push({
            id: '',
            url: '',
            code: '',
            display: '',
            keterangan: '',
            jenis_data: '',
            is_new: true,
            is_edit: false
        });

        this.RiwayatAlergiMakanan$.next([]);
        this.RiwayatAlergiMakanan$.next(riwayatPenyakit);
    }

    handleEditRiwayatAlergiMakanan(index: number) {
        let value = this.RiwayatAlergiMakanan$.value.map((data: any, indexes: number) => {
            return {
                ...data,
                is_edit: indexes == index ? true : false
            }
        });

        this.RiwayatAlergiMakanan$.next([]);
        this.RiwayatAlergiMakanan$.next(value);
    }

    handleDeleteRiwayatAlergiMakanan(index: number) {
        let value = this.RiwayatAlergiMakanan$.value;

        if (value.length > 0) {
            value.splice(index, 1);
            this.RiwayatAlergiMakanan$.next([]);
            this.RiwayatAlergiMakanan$.next(value);
        }
    }

    handleAddRiwayatAlergiObat() {
        let riwayatPenyakit = [...this.RiwayatAlergiObat$.value];

        riwayatPenyakit.push({
            id: '',
            url: '',
            code: '',
            display: '',
            keterangan: '',
            jenis_data: '',
            is_new: true,
            is_edit: false
        });

        this.RiwayatAlergiObat$.next([]);
        this.RiwayatAlergiObat$.next(riwayatPenyakit);
    }

    handleEditRiwayatAlergiObat(index: number) {
        let value = this.RiwayatAlergiObat$.value.map((data: any, indexes: number) => {
            return {
                ...data,
                is_edit: indexes == index ? true : false
            }
        });

        this.RiwayatAlergiObat$.next([]);
        this.RiwayatAlergiObat$.next(value);
    }

    handleDeleteRiwayatAlergiObat(index: number) {
        let value = this.RiwayatAlergiObat$.value;

        if (value.length > 0) {
            value.splice(index, 1);
            this.RiwayatAlergiObat$.next([]);
            this.RiwayatAlergiObat$.next(value);
        }
    }

    handleAddCatatanTubuh() {
        let catatan = [...this.CatatanKondisiTubuh$.value];

        catatan.push({
            kode_loinc: '',
            display_loinc: '',
            anggota_tubuh: '',
            catatan_kondisi: '',
            is_new: true,
            is_edit: false
        });

        this.CatatanKondisiTubuh$.next([]);
        this.CatatanKondisiTubuh$.next(catatan);
    }

    handleEditCatatanTubuh(index: number) {
        let value = this.CatatanKondisiTubuh$.value.map((data: any, indexes: number) => {
            return {
                ...data,
                is_edit: indexes == index ? true : false
            }
        });

        this.CatatanKondisiTubuh$.next([]);
        this.CatatanKondisiTubuh$.next(value);
    }

    handleDeleteCatatanTubuh(index: number) {
        let value = this.CatatanKondisiTubuh$.value;

        if (value.length > 0) {
            value.splice(index, 1);
            this.CatatanKondisiTubuh$.next([]);
            this.CatatanKondisiTubuh$.next(value);
        }
    }
}   
