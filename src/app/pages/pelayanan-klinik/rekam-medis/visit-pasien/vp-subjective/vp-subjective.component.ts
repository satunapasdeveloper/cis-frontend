import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, BehaviorSubject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { FormModel } from 'src/app/model/components/form.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { RekamMedisService } from 'src/app/services/pelayanan-klinik/rekam-medis/rekam-medis.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-vp-subjective',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        DynamicFormComponent,
    ],
    templateUrl: './vp-subjective.component.html',
    styleUrl: './vp-subjective.component.scss'
})
export class VpSubjectiveComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    AssesmentAwalId: any = null;

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

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
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
        this.getVariable('tingkat_kesadaran', '');
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.FormComps.FormGroup.get('id_register')?.setValue(this._activatedRoute.snapshot.queryParams['id_register']);
            this.handleCheckIsAssesmentAwalExist(this._activatedRoute.snapshot.queryParams['id_register']);
        }, 1000);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private handleCheckIsAssesmentAwalExist(id_register: number) {
        this._rekamMedisService
            .getAssesment(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                result.data.id_tingkat_kesadaran = result.data.id_tingkat_kesadaran.toString();
                this.AssesmentAwalId = result.data.id_assessment_awal;
                this.FormComps.FormGroup.patchValue(result.data);
                this.RiwayatPenyakitPasien$.next(result.data.riwayat_penyakit_pribadi);
                this.RiwayatPenyakitKeluarga$.next(result.data.riwayat_penyakit_keluarga);
                this.RiwayatAlergiMakanan$.next(result.data.alergi_makanan);
                this.RiwayatAlergiObat$.next(result.data.kfa_alergi_obat);
            })
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'back') {
            this._router.navigateByUrl("/pelayanan-klinik/rawat-jalan/antrian-poliklinik");
        };

        if (data.id == 'save') {
            this.handleSave();
        };

        if (data.id == 'update') {
            this.handleUpdate();
        };
    }

    private getVariable(type: 'penyakit_pribadi' | 'penyakit_keluarga' | 'alergi_makanan' | 'alergi_obat' | 'tingkat_kesadaran', keyword: string) {
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
                .getRiwayatAlergiObat(keyword)
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

    // ** Riwayat Penyakit Keluarga
    handleChangeRiwayatPenyakitKeluarga(args: any, index: number) {
        if (args.value) {
            let riwayatPenyakit = [...this.RiwayatPenyakitKeluarga$.value];
            riwayatPenyakit[index] = { ...args.value };
            this.RiwayatPenyakitKeluarga$.next([]);
            this.RiwayatPenyakitKeluarga$.next(riwayatPenyakit);
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

    // ** Riwayat Alergi Makanan
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

    handleChangeRiwayatAlergiMakanan(args: any, index: number) {
        if (args.value) {
            let riwayatPenyakit = [...this.RiwayatAlergiMakanan$.value];
            riwayatPenyakit[index] = { ...args.value };
            this.RiwayatAlergiMakanan$.next([]);
            this.RiwayatAlergiMakanan$.next(riwayatPenyakit);
        }
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

    // ** Riwayat Alergi Obat
    handleChangeRiwayatAlergiObat(args: any, index: number) {
        if (args.value) {
            let riwayatPenyakit = [...this.RiwayatAlergiObat$.value];
            riwayatPenyakit[index] = { ...args.value };
            this.RiwayatAlergiObat$.next([]);
            this.RiwayatAlergiObat$.next(riwayatPenyakit);
        }
    }

    handleAddRiwayatAlergiObat() {
        let riwayatPenyakit = [...this.RiwayatAlergiObat$.value];

        riwayatPenyakit.push({
            id: '',
            kategori: '',
            kode_kfa: '',
            nama_item: '',
            satuan: '',
            type: '',
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

    private handleSave() {
        const payload = {
            ...this.FormComps.FormGroup.value,
            riwayat_penyakit_pribadi: this.RiwayatPenyakitPasien$.value,
            riwayat_penyakit_keluarga: this.RiwayatPenyakitKeluarga$.value,
            alergi_makanan: this.RiwayatAlergiMakanan$.value,
            kfa_alergi_obat: this.RiwayatAlergiObat$.value,
        };

        !environment.production && console.log("save payload =>", payload);

        this._rekamMedisService
            .createAssesment(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Assesment Awal Berhasil Disimpan' });

                    setTimeout(() => {
                        this.handleClickButtonNavigation({ id: 'back', icon: '', title: '' });
                    }, 1000);
                }
            })
    }

    private handleUpdate() {
        const payload = {
            id_assessment_awal: this.AssesmentAwalId,
            ...this.FormComps.FormGroup.value,
            riwayat_penyakit_pribadi: this.RiwayatPenyakitPasien$.value,
            riwayat_penyakit_keluarga: this.RiwayatPenyakitKeluarga$.value,
            alergi_makanan: this.RiwayatAlergiMakanan$.value,
            kfa_alergi_obat: this.RiwayatAlergiObat$.value,
        };

        !environment.production && console.log("update payload =>", payload);

        this._rekamMedisService
            .updateAssesment(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Assesment Awal Berhasil Diperbarui' });

                    setTimeout(() => {
                        this.handleClickButtonNavigation({ id: 'back', icon: '', title: '' });
                    }, 1000);
                }
            })
    }
}
