import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { RekamMedisActions, RekamMedisState } from 'src/app/store/rekam-medis';

@Component({
    selector: 'app-assesment-awal',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        DynamicFormComponent,
        ButtonModule,
    ],
    templateUrl: './assesment-awal.component.html',
    styleUrl: './assesment-awal.component.scss'
})
export class AssesmentAwalComponent implements OnInit {

    Destroy$ = new Subject();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Kembali',
            icon: 'pi pi-chevron-left'
        }
    ];

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    FormKeadaanUmumProps: FormModel.IForm;
    @ViewChild('FormKeadaanUmumComps') FormKeadaanUmumComps!: DynamicFormComponent;

    FormVitalSignProps: FormModel.IForm;
    @ViewChild('FormVitalSignComps') FormVitalSignComps!: DynamicFormComponent;

    SelectedPasien: any;

    constructor(
        private _store: Store,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
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
                    id: 'kesadaran',
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
                    id: 'nyeri',
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
        const id = this._activatedRoute.snapshot.queryParams['id'];
        // console.log("no id medis =>", id);

        this.SelectedPasien = JSON.parse(localStorage.getItem('_SPSH_') as any);
        // console.log("selected pasien =>", this.SelectedPasien);

        this.getVariable();
    }

    handleBackToList() {
        this._router.navigateByUrl('antrian');
    }

    private getVariable() {
        this._store
            .select(RekamMedisState.rekamMedisVariable)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                const tingkat_kesadaran_index = this.FormProps.fields.findIndex(item => item.id == 'kesadaran');
                this.FormProps.fields[tingkat_kesadaran_index].radioButtonProps = result?.kesadaran.map((item) => {
                    return {
                        ...item,
                        name: 'kesadaran',
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

                const nyeri_index = this.FormProps.fields.findIndex(item => item.id == 'nyeri');
                this.FormProps.fields[nyeri_index].radioButtonProps = result?.nyeri.map((item) => {
                    return {
                        ...item,
                        name: 'nyeri',
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

    handleSaveAssesmentAwal() {
        let payload = {
            ...this.FormComps.FormGroup.value,
            ...this.FormKeadaanUmumComps.FormGroup.value,
            ...this.FormVitalSignComps.FormGroup.value,
        };

        payload.id_pendaftaran = this.SelectedPasien.id_pendaftaran;

        this._store
            .dispatch(new RekamMedisActions.CreateAssessment(payload))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.rekam_medis.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Data Berhasil Disimpan' });
                }
            });
    }
}
