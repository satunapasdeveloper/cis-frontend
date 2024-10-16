import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { Subject } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';

@Component({
    selector: 'app-dokter',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        DropdownModule,
        CalendarModule,
        FormsModule,
    ],
    templateUrl: './dokter.component.html',
    styleUrl: './dokter.component.scss'
})
export class DokterComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'add',
            title: 'Tambah',
            icon: 'pi pi-plus'
        }
    ];

    GridProps: GridModel.IGrid = {
        id: 'Dokter',
        column: [
            { field: 'kode_dokter', headerName: 'Kode Dokter', },
            { field: 'nama_dokter', headerName: 'Nama Dokter', },
            { field: 'no_handphone', headerName: 'No. Handphone', },
            { field: 'nama_poli', headerName: 'Nama Poli', },
            { field: 'status_active', headerName: 'Status Aktif', renderAsCheckbox: true },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: true,
        searchKeyword: 'nama_dokter',
        searchPlaceholder: 'Cari Nama Dokter Disini'
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    JadwalDokter: any[] = [
        {
            hari: new Date().getDay(),
            jam_mulai: '10:00',
            jam_selesai: '12:00',
        }
    ];

    Hari: any[] = [
        {
            value: 0,
            label: 'Minggu'
        },
        {
            value: 1,
            label: 'Senin'
        },
        {
            value: 2,
            label: 'Selasa'
        },
        {
            value: 3,
            label: 'Rabu'
        },
        {
            value: 4,
            label: 'Kamis'
        },
        {
            value: 5,
            label: 'Jumat'
        },
        {
            value: 6,
            label: 'Sabtu'
        },
    ];

    constructor(
        private _store: Store,
        private _messageService: MessageService,
    ) {
        this.FormProps = {
            id: 'form_setup_dokter',
            fields: [
                {
                    id: 'kode_dokter',
                    label: 'Kode Dokter',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'nama_dokter',
                    label: 'Nama Dokter',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'nama_poli',
                    label: 'Poli',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'value',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'alamat',
                    label: 'Alamat',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'no_handphone',
                    label: 'No. Handphone',
                    required: false,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'no_ijin_praktek',
                    label: 'No. Ijin Praktek',
                    required: false,
                    type: 'text',
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
        this.getAll();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        // this._store
        //     .select(SetupWilayahState.provinsiEntities)
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         if (result) {
        //             console.log("get prov from setup poli =>", result);
        //             this.GridProps.dataSource = result;
        //         }
        //     })

        this.GridProps.dataSource = [
            {
                kode_dokter: 'DKT001',
                nama_dokter: 'dr. Lalisa Manobal, Sp.PD',
                no_handphone: '085156781165',
                nama_poli: 'POLI PENYAKIT DALAM',
                status_active: true
            },
            {
                kode_dokter: 'DKT002',
                nama_dokter: 'dr. Kim Jisoo, Sp.OG',
                no_handphone: '085156781165',
                nama_poli: 'POLI KANDUNGAN',
                status_active: true
            },
            {
                kode_dokter: 'DKT003',
                nama_dokter: 'dr. Park Rose, Sp.A',
                no_handphone: '085156781165',
                nama_poli: 'POLI ANAK',
                status_active: true
            },
            {
                kode_dokter: 'DKT004',
                nama_dokter: 'dr. Kim Jennie',
                no_handphone: '085156781165',
                nama_poli: 'POLI UMUM',
                status_active: true
            },
        ]
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];
        };

        if (data.id == 'save') {
            const formValue = this.FormComps.FormGroup.value;
            this.savePoli(formValue);
        };

        if (data.id == 'update') {
            const formValue = this.FormComps.FormGroup.value;
            this.updatePoli(formValue);
        };
    }

    handleBackToList() {
        this.FormComps.onResetForm();

        this.PageState = 'list';
        this.ButtonNavigation = [
            {
                id: 'add',
                title: 'Tambah',
                icon: 'pi pi-plus'
            }
        ];
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form';

        // ** Ganti button navigation bar data
        this.ButtonNavigation = [
            {
                id: 'back',
                icon: 'pi pi-chevron-left',
                title: 'Kembali'
            },
            {
                id: 'update',
                icon: 'pi pi-save',
                title: 'Update'
            },
        ];

        // ** Set value ke Dynamic form components
        setTimeout(() => {
            this.FormComps.FormGroup.patchValue(args);
        }, 100);
    }

    onToolbarClicked(args: any): void {
        if (args.id == 'delete') {
            console.log(this.GridSelectedData);
            this.deletePoli(this.GridSelectedData.kode_wilayah);
        }
    }

    handleAddNewJadwal() {
        this.JadwalDokter.push({
            hari: new Date().getDay(),
            jam_mulai: '10:00',
            jam_selesai: '12:00',
        });
    }

    handleDeleteJadwal(index: number) {
        if (this.JadwalDokter.length > 1) {
            this.JadwalDokter.splice(index, 1);
        }
    }

    private savePoli(data: any) {
        // this._store
        //     .dispatch(new SetupWilayahActions.CreatePoli(data))
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         console.log(result);

        //         if (result.setup_wilayah.success) {
        //             // ** Reset Form 
        //             this.FormComps.onResetForm();

        //             // ** Kembali ke list
        //             this.PageState = 'list';

        //             // ** Reset Button Navigation
        //             this.ButtonNavigation = [
        //                 {
        //                     id: 'add',
        //                     title: 'Tambah',
        //                     icon: 'pi pi-plus'
        //                 }
        //             ];
        //         }
        //     })
    }

    private updatePoli(data: any) {
        // this._store
        //     .dispatch(new SetupWilayahActions.UpdatePoli(data))
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         if (result.setup_wilayah.success) {
        //             // ** Reset Form 
        //             this.FormComps.onResetForm();

        //             // ** Kembali ke list
        //             this.PageState = 'list';

        //             // ** Reset Button Navigation
        //             this.ButtonNavigation = [
        //                 {
        //                     id: 'add',
        //                     title: 'Tambah',
        //                     icon: 'pi pi-plus'
        //                 }
        //             ];
        //         }
        //     })
    }

    private deletePoli(kode_wilayah: string) {
        // this._store
        //     .dispatch(new SetupWilayahActions.DeletePoli(kode_wilayah))
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         console.log("store =>", result);

        //         if (result.setup_wilayah.success) {

        //         }
        //     })
    }

}
