import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';
import { RekamMedisState } from 'src/app/store/rekam-medis';

@Component({
    selector: 'app-pemeriksaan-fisik',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        DashboardComponent,
        DynamicFormComponent,
        FormsModule,
        InputTextModule,
        DropdownModule,
        ButtonModule
    ],
    templateUrl: './pemeriksaan-fisik.component.html',
    styleUrl: './pemeriksaan-fisik.component.scss'
})
export class PemeriksaanFisikComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

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
                    id: 'id_pendaftaran',
                    label: 'Id Pendaftaran',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
                },
                {
                    id: 'tingkat_kesadaran',
                    label: 'Tingkat Kesadaran',
                    required: true,
                    type: 'radio',
                    radioButtonProps: [],
                    value: '',
                },
                {
                    id: 'pernafasan',
                    label: 'Pernafasan',
                    required: true,
                    type: 'radio',
                    radioButtonProps: [],
                    value: '',
                },
                {
                    id: 'resiko_jatuh',
                    label: 'Risiko Jatuh',
                    required: true,
                    type: 'radio',
                    radioButtonProps: [],
                    value: '',
                },
                {
                    id: 'skala_nyeri',
                    label: 'Skala Nyeri',
                    required: true,
                    type: 'radio',
                    radioButtonProps: [],
                    value: '',
                },
                {
                    id: 'batuk',
                    label: 'Batuk',
                    required: true,
                    type: 'radio',
                    radioButtonProps: [],
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-5 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };

        this.FormKeadaanUmumProps = {
            id: 'form_keadaan_umum',
            fields: [
                {
                    id: 'tinggi_badan',
                    label: 'Tinggi Badan (cm)',
                    required: true,
                    type: 'number',
                    value: 0,
                },
                {
                    id: 'berat_badan',
                    label: 'Berat Badan (kg)',
                    required: true,
                    type: 'number',
                    value: 0,
                }
            ],
            style: 'not_inline',
            class: 'grid-rows-1 grid-cols-2',
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
            class: 'grid-rows-3 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getVariable();
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

    private getVariable() {
        this._store
            .select(RekamMedisState.rekamMedisVariable)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                const tingkat_kesadaran_index = this.FormProps.fields.findIndex(item => item.id == 'tingkat_kesadaran');
                this.FormProps.fields[tingkat_kesadaran_index].radioButtonProps = result?.kesadaran.map((item) => {
                    return {
                        ...item,
                        name: 'tingkat_kesadaran',
                        label: item.title
                    }
                });

                const pernafasan_index = this.FormProps.fields.findIndex(item => item.id == 'pernafasan');
                this.FormProps.fields[pernafasan_index].radioButtonProps = result?.pernafasan.map((item) => {
                    return {
                        ...item,
                        name: 'pernafasan',
                        label: item.title
                    }
                });

                const resiko_jatuh_index = this.FormProps.fields.findIndex(item => item.id == 'resiko_jatuh');
                this.FormProps.fields[resiko_jatuh_index].radioButtonProps = result?.resiko_jatuh.map((item) => {
                    return {
                        ...item,
                        name: 'resiko_jatuh',
                        label: item.title
                    }
                });

                const nyeri_index = this.FormProps.fields.findIndex(item => item.id == 'skala_nyeri');
                this.FormProps.fields[nyeri_index].radioButtonProps = result?.nyeri.map((item) => {
                    return {
                        ...item,
                        name: 'skala_nyeri',
                        label: item.title
                    }
                });

                const batuk_index = this.FormProps.fields.findIndex(item => item.id == 'batuk');
                this.FormProps.fields[batuk_index].radioButtonProps = result?.batuk.map((item) => {
                    return {
                        ...item,
                        name: 'batuk',
                        label: item.title
                    }
                });
            })
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
