import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil, switchMap, of, take, map } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { InformasiPasienComponent } from 'src/app/components/layout/informasi-pasien/informasi-pasien.component';
import { FormModel } from 'src/app/model/components/form.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { SetupNakesState, SetupNakesActions } from 'src/app/store/setup-data/nakes';
import { SetupPoliState, SetupPoliActions } from 'src/app/store/setup-data/setup-poli';

@Component({
    selector: 'app-surat-rujukan-keluar',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DashboardComponent,
        ConfirmDialogModule,
        DynamicFormComponent,
        InformasiPasienComponent,
    ],
    templateUrl: './surat-rujukan-keluar.component.html',
    styleUrl: './surat-rujukan-keluar.component.scss'
})
export class SuratRujukanKeluarComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Kembali',
            icon: 'pi pi-chevron-left'
        },
        {
            id: 'save',
            title: 'Simpan',
            icon: 'pi pi-save'
        },
        {
            id: 'print',
            title: 'Cetak',
            icon: 'pi pi-print'
        },
    ];

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    Pasien = JSON.parse(localStorage.getItem('_SPSH_') as any);

    SelectedPoli: any;

    SelectedDokter: any;

    constructor(
        private _store: Store,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_surat_kontrol',
            fields: [
                {
                    id: 'id_surat_rujukan_keluar',
                    label: 'ID Surat Rujukan Keluar',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'tanggal_pembuatan_rujukan',
                    label: 'Tgl. Pembuatan Rujukan',
                    required: true,
                    type: 'datetime',
                    value: '',
                },
                {
                    id: 'tanggal_rencana_kunjungan',
                    label: 'Tgl. Rencana Kunjungan',
                    required: true,
                    type: 'datetime',
                    value: '',
                },
                {
                    id: 'id_ppk_di_rujuk',
                    label: 'PPK Di Rujuk',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama_poli',
                        optionValue: 'id_poli',
                    },
                },
                {
                    id: 'id_jenis_pelayanan',
                    label: 'Jenis Pelayanan',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama',
                        optionValue: 'id_nakes',
                    },
                },
                {
                    id: 'catatan',
                    label: 'Catatan',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_diagnosa_icd_10',
                    label: 'Diagnosa Rujukan ICD 10',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama',
                        optionValue: 'id_nakes',
                    },
                },
                {
                    id: 'id_tipe_rujukan',
                    label: 'Tipe Rujukan',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama',
                        optionValue: 'id_nakes',
                    },
                },
                {
                    id: 'id_poli_rujukan',
                    label: 'Poli Rujukan',
                    required: true,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'nama',
                        optionValue: 'id_nakes',
                    },
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAll();
        // this.getAllPoli();
        // this.getAllDokter();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        const id_register = this._activatedRoute.snapshot.queryParams['id_register'];

        // this._diagnosaService
        //     .getAll(query)
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         if (result) {
        //             this.GridProps.dataSource = result.data.rows;
        //             this.GridProps.totalRows = result.data.totalRows;
        //         }
        //     });
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
            .subscribe((options: any) => {
                const index = this.FormProps.fields.findIndex((item) => item.id == 'id_poli');
                this.FormProps.fields[index].dropdownProps.options = options;
            });
    }

    private getAllDokter() {
        this._store
            .select(SetupNakesState.nakesActives)
            .pipe(
                takeUntil(this.Destroy$),
                switchMap((result) => {
                    if (result?.length) {
                        return of(result); // Use existing result
                    } else {
                        // Dispatch action and wait for the response
                        this._store.dispatch(new SetupNakesActions.GetAllActiveNakes({ page: 1, count: 100 }));

                        return this._store
                            .select(SetupNakesState.nakesActives)
                            .pipe(
                                take(1), // Take only the first emitted value
                                map((fetchedResult) => fetchedResult)
                            );
                    }
                })
            )
            .subscribe((options: any) => {
                const index = this.FormProps.fields.findIndex((item) => item.id == 'id_dokter');
                this.FormProps.fields[index].dropdownProps.options = options;
            });
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];
        };

        if (data.id == 'back') {
            this._router.navigateByUrl('/pelayanan-klinik/rawat-jalan/antrian-poliklinik');
        }
    }

    private saveSuratKontrol(data: any) {
        // this._diagnosaService
        //     .create(data)
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         if (result.responseResult) {
        //             this._messageService.clear();
        //             this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
        //             this.handleBackToList();
        //         }
        //     })
    }

    private updateSuratKontrol(data: any) {
        // this._diagnosaService
        //     .update(data)
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         if (result.responseResult) {
        //             this._messageService.clear();
        //             this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
        //             this.handleBackToList();
        //         }
        //     })
    }

}
