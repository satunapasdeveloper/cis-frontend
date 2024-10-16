import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { PendaftaranService } from 'src/app/services/pendaftaran/pendaftaran.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { ManajemenUserState } from 'src/app/store/setup-data/manajemen-user';
import { SetupPoliState } from 'src/app/store/setup-data/setup-poli';

@Component({
    selector: 'app-tambah-antrian',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        DynamicFormComponent,
        ButtonModule,
    ],
    templateUrl: './tambah-antrian.component.html',
    styleUrl: './tambah-antrian.component.scss'
})
export class TambahAntrianComponent implements OnInit, OnDestroy {

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

    SelectedPasien: any;

    SearchJadwalParams = new BehaviorSubject({ id_hari: 0, id_poli: 0 });

    constructor(
        private _store: Store,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _pendaftaranService: PendaftaranService,
    ) {
        this.FormProps = {
            id: 'form_tambah_antrean',
            fields: [
                {
                    id: 'id_pasien',
                    label: 'Pasien',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'debitur',
                    label: 'Debitur',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [
                            { value: 'Mandiri', label: 'Mandiri' },
                            { value: 'BPJS', label: 'BPJS' },
                            { value: 'Asuransi Lain', label: 'Asuransi Lain' },
                        ],
                        optionName: 'label',
                        optionValue: 'value',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'tanggal_visit',
                    label: 'Tanggal Kunjungan',
                    required: true,
                    type: 'date',
                    value: '',
                    onChange: (args: any) => {
                        this.SearchJadwalParams.next({
                            ...this.SearchJadwalParams.value,
                            id_hari: args ? new Date(args).getDay() : 0
                        });
                    }
                },
                {
                    id: 'id_poli',
                    label: 'Poli',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'poli',
                        optionValue: 'id_poli',
                        autoDisplayFirst: false
                    },
                    value: '',
                    onChange: (args: any) => {
                        this.SearchJadwalParams.next({
                            ...this.SearchJadwalParams.value,
                            id_poli: args ? parseInt(args.id_poli) : 0
                        });
                    }
                },
                {
                    id: 'id_jadwal_dokter',
                    label: 'Pilih Dokter',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama',
                        optionValue: 'id_jadwal_dokter',
                        autoDisplayFirst: false,
                        customField: {
                            title: 'nama',
                            subtitle: 'jam_praktek',
                        }
                    },
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        const no_rm = this._activatedRoute.snapshot.queryParams['no_rm'];
        // console.log("no rekam medis =>", no_rm);

        this.SelectedPasien = JSON.parse(localStorage.getItem('_SPSH_') as any);
        // console.log("selected pasien =>", this.SelectedPasien);

        this.getAllPoli();

        this.SearchJadwalParams
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.id_poli > 0 && result.id_hari > 0) {
                    this.getAllJadwalDokter(result);
                }
            })
    }

    private getAllJadwalDokter(payload: any) {
        this._pendaftaranService
            .getJadwalDokter(payload)
            .subscribe((result) => {
                if (result.responseResult) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_jadwal_dokter');
                    this.FormProps.fields[index].dropdownProps.options = result.data.map((item: any) => {
                        return {
                            ...item,
                            jam_praktek: `${item.jam_mulai} s.d ${item.jam_selesai}`
                        }
                    });
                }
            })
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

    handleBackToList() {
        this._router.navigateByUrl('antrian');
    }

    handleCreatePendaftaran() {
        this.FormComps.FormGroup.get('id_pasien')?.setValue(this.SelectedPasien.id_pasien);

        const data = this.FormComps.FormGroup.value;

        data.id_poli = parseInt(data.id_poli);
        data.id_pasien = parseInt(data.id_pasien);
        data.id_jadwal_dokter = parseInt(data.id_jadwal_dokter);
        data.tanggal_visit = this._utilityService.onFormatDate(new Date(data.tanggal_visit), 'yyyy-MM-DD');

        this._pendaftaranService
            .create(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });

                    setTimeout(() => {
                        this.handleBackToList();
                    }, 500);
                }
            })
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }
}
