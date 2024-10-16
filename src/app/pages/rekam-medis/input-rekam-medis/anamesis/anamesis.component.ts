import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { FormModel } from 'src/app/model/components/form.model';
import { RekamMedisState } from 'src/app/store/rekam-medis';

@Component({
    selector: 'app-anamesis',
    standalone: true,
    imports: [
        DynamicFormComponent
    ],
    templateUrl: './anamesis.component.html',
    styleUrl: './anamesis.component.scss'
})
export class AnamesisComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _store: Store,
        private _cdr: ChangeDetectorRef,
    ) {
        this.FormProps = {
            id: 'form_anamesis_rekam_medis',
            fields: [
                {
                    id: 'id_pendaftaran',
                    label: 'Id Pendaftaran',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'keluhan_utama',
                    label: 'Keluhan Utama',
                    required: true,
                    type: 'textarea',
                    textareaRow: 3,
                    value: '',
                },
                {
                    id: 'riwayat_penyakit',
                    label: 'Riwayat Penyakit',
                    required: true,
                    type: 'textarea',
                    textareaRow: 3,
                    value: '',
                },
                {
                    id: 'is_ada_riwayat_penyakit_terdahulu',
                    label: 'Ada Riwayat Penyakit Terdahulu',
                    required: false,
                    type: 'switch',
                    hideLabel: true,
                    value: false,
                    onChange: (args: any) => {
                        if (args.checked) {
                            this.FormProps.fields[4].hidden = false;
                        } else {
                            this.FormProps.fields[4].hidden = true;
                        }
                    }
                },
                {
                    id: 'riwayat_penyakit_terdahulu',
                    label: 'Ada Riwayat Penyakit Terdahulu',
                    required: false,
                    type: 'textarea',
                    textareaRow: 2,
                    hideLabel: true,
                    value: "",
                    hidden: true,
                },
                {
                    id: 'is_ada_riwayat_alergi',
                    label: 'Ada Riwayat Alergi',
                    required: false,
                    type: 'switch',
                    hideLabel: true,
                    value: false,
                    onChange: (args: any) => {
                        if (args.checked) {
                            this.FormProps.fields[6].hidden = false;
                        } else {
                            this.FormProps.fields[6].hidden = true;
                        }
                    }
                },
                {
                    id: 'riwayat_alergi',
                    label: 'Ada Riwayat Alergi',
                    required: false,
                    type: 'textarea',
                    textareaRow: 2,
                    hideLabel: true,
                    value: "",
                    hidden: true,
                },
                {
                    id: 'is_ada_riwayat_pengobatan',
                    label: 'Ada Riwayat Pengobatan',
                    required: false,
                    type: 'switch',
                    hideLabel: true,
                    value: false,
                    onChange: (args: any) => {
                        if (args.checked) {
                            this.FormProps.fields[8].hidden = false;
                            this.FormProps.class = 'grid-rows-8 grid-cols-1';
                        } else {
                            this.FormProps.fields[8].hidden = true;
                            this.FormProps.class = 'grid-rows-7 grid-cols-1';
                        }
                    }
                },
                {
                    id: 'riwayat_pengobatan',
                    label: 'Ada Riwayat Pengobatan',
                    required: false,
                    type: 'textarea',
                    textareaRow: 2,
                    hideLabel: true,
                    value: "",
                    hidden: true,
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-6 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.getAnamesis();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAnamesis() {
        this._store
            .select(RekamMedisState.rekamMedisDetail)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result?.anamnesis) {
                    let data = {
                        ...result.anamnesis,
                        is_ada_riwayat_penyakit_terdahulu: result.anamnesis.riwayat_penyakit_terdahulu ? true : false,
                        is_ada_riwayat_alergi: result.anamnesis.riwayat_alergi ? true : false,
                        is_ada_riwayat_pengobatan: result.anamnesis.riwayat_pengobatan ? true : false,
                    };

                    if (data.is_ada_riwayat_penyakit_terdahulu) {
                        this.FormProps.fields[4].hidden = false;
                    } else {
                        this.FormProps.fields[4].hidden = true;
                    }

                    if (data.is_ada_riwayat_alergi) {
                        this.FormProps.fields[6].hidden = false;
                    } else {
                        this.FormProps.fields[6].hidden = true;
                    }

                    if (data.is_ada_riwayat_pengobatan) {
                        this.FormProps.fields[8].hidden = false;
                    } else {
                        this.FormProps.fields[8].hidden = true;
                    };

                    const not_hidden = this.FormProps.fields.filter(item => !item.hidden);
                    this.FormProps.class = `grid-rows-${not_hidden.length} grid-cols-1`;

                    this.FormComps.FormGroup.patchValue(data);

                    this._cdr.detectChanges();
                }
            })
    }
}
