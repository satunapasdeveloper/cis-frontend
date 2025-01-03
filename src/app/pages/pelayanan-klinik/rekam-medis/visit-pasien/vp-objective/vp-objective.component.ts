import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { FormModel } from 'src/app/model/components/form.model';
import { RekamMedisService } from 'src/app/services/pelayanan-klinik/rekam-medis/rekam-medis.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-vp-objective',
    standalone: true,
    imports: [
        DynamicFormComponent,
    ],
    templateUrl: './vp-objective.component.html',
    styleUrl: './vp-objective.component.scss'
})
export class VpObjectiveComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    FormKeadaanUmumProps: FormModel.IForm;
    @ViewChild('FormKeadaanUmumComps') FormKeadaanUmumComps!: DynamicFormComponent;

    FormVitalSignProps: FormModel.IForm;
    @ViewChild('FormVitalSignComps') FormVitalSignComps!: DynamicFormComponent;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _rekamMedisService: RekamMedisService
    ) {
        this.FormKeadaanUmumProps = {
            id: 'form_keadaan_umum',
            fields: [
                {
                    id: 'tinggi_badan_cm',
                    label: 'Tinggi Badan (cm)',
                    required: true,
                    type: 'number',
                    value: 0,
                    onChange: (args: any) => {
                        this.onCountIndeksMasaTubuh(args, this.FormKeadaanUmumComps.FormGroup.get('berat_badan_kg')?.value);
                    }
                },
                {
                    id: 'berat_badan_kg',
                    label: 'Berat Badan (kg)',
                    required: true,
                    type: 'number',
                    value: 0,
                    onChange: (args: any) => {
                        this.onCountIndeksMasaTubuh(this.FormKeadaanUmumComps.FormGroup.get('tinggi_badan_cm')?.value, args);
                    }
                },
                {
                    id: 'imt',
                    label: 'IMT',
                    required: true,
                    type: 'number',
                    value: 0,
                    readonly: true,
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
                    readonly: true,
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
                    id: 'diastole',
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
                        optionName: "keterangan",
                        optionValue: "id"
                    },
                    value: "",
                },
                {
                    id: 'spo2',
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
                    id: 'pernapasan_per_menit',
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
    }

    ngOnInit(): void {
        this.getVariable('tingkat_kesadaran', '');
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
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
                this.FormKeadaanUmumComps.FormGroup.patchValue(result.data);
                this.FormVitalSignComps.FormGroup.patchValue(result.data);
            })
    }

    private getVariable(type: 'penyakit_pribadi' | 'penyakit_keluarga' | 'alergi_makanan' | 'alergi_obat' | 'tingkat_kesadaran', keyword: string) {
        if (type == 'tingkat_kesadaran') {
            this._rekamMedisService
                .getRiwayatTingkatKesadaran()
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    const index = this.FormVitalSignProps.fields.findIndex(item => item.id == 'id_tingkat_kesadaran');
                    this.FormVitalSignProps.fields[index].dropdownProps!.options = result;
                });
        };
    }

    private onCountIndeksMasaTubuh(tinggi_badan_cm: number, berat_badan_kg: number) {
        let tinggi_badan = (tinggi_badan_cm / 100) * (tinggi_badan_cm / 100);
        const imt = parseFloat((berat_badan_kg / tinggi_badan).toFixed(2));
        const bsa = parseFloat(Math.sqrt((berat_badan_kg * tinggi_badan) / 3600).toFixed(2));

        if (imt >= 18.5 && imt <= 25) {
            this.FormKeadaanUmumComps.FormGroup.get('kategori_imt')?.setValue('Normal');
        }

        if (imt > 25 && imt <= 27) {
            this.FormKeadaanUmumComps.FormGroup.get('kategori_imt')?.setValue('Gemuk');
        }

        if (imt > 27) {
            this.FormKeadaanUmumComps.FormGroup.get('kategori_imt')?.setValue('Obesitas');
        }

        this.FormKeadaanUmumComps.FormGroup.get('imt')?.setValue(imt);

        this.FormKeadaanUmumComps.FormGroup.get('luas_permukaan_tubuh_cm')?.setValue(bsa * 10000);
    }

    private handleSave() {
        const payload = {
            ...this.FormKeadaanUmumComps.FormGroup.value,
            ...this.FormVitalSignComps.FormGroup.value,
        };

        !environment.production && console.log("save payload =>", payload);

        this._rekamMedisService
            .createAssesment(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Assesment Awal Berhasil Disimpan' });

                }
            })
    }

    private handleUpdate() {
        const payload = {
            ...this.FormKeadaanUmumComps.FormGroup.value,
            ...this.FormVitalSignComps.FormGroup.value,
        };

        !environment.production && console.log("update payload =>", payload);

        this._rekamMedisService
            .updateAssesment(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Assesment Awal Berhasil Diperbarui' });

                }
            })
    }
}
