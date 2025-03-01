import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { TelaahResepService } from 'src/app/services/farmasi/telaah-resep/telaah-resep.service';
import { ResepService } from 'src/app/services/pelayanan-klinik/rekam-medis/resep.service';

@Component({
    selector: 'app-telaah-resep',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        FormsModule,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule,
        PaginatorModule,
        CheckboxModule,
        InputTextareaModule,
    ],
    templateUrl: './telaah-resep.component.html',
    styleUrl: './telaah-resep.component.scss'
})
export class TelaahResepComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'back',
            title: 'Kembali',
            icon: 'pi pi-chevron-left'
        },
        {
            id: 'batal',
            title: 'Batalkan Resep',
            icon: 'pi pi-ban'
        },
        {
            id: 'simpan',
            title: 'Simpan',
            icon: 'pi pi-save'
        },
    ];

    GridProps: GridModel.IGrid = {
        id: 'TelaahResep',
        column: [
            { field: 'nama_obat', headerName: 'Nama Obat', class: 'text-xs' },
            { field: 'aturan_pakai', headerName: 'Aturan Pakai', class: 'text-xs' },
            { field: 'rute_pemberian_obat', headerName: 'Rute Pemberian', class: 'text-xs' },
            { field: 'qty', headerName: 'Qty', format: 'number', class: 'text-end text-xs' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        showPaging: false,
        showSearch: false,
        showSort: false,
        searchKeyword: 'nama_pabrik',
        searchPlaceholder: 'Cari Nama Pabrik Disini',
        totalRows: 0,
    };

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    SetupTelaahResep: any[] = [];

    SelectedSetupTelaah: any[] = [];

    KeteranganTelaah: string = "";

    constructor(
        private _router: Router,
        private _resepService: ResepService,
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _telaahResepService: TelaahResepService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_informasi_resep',
            fields: [
                {
                    id: 'nama_stokroom',
                    label: 'Stokroom',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_poli',
                    label: 'Poli',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_dokter',
                    label: 'Dokter',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_petugas',
                    label: 'Petugas',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
                {
                    id: 'nama_pasien',
                    label: 'Pasien',
                    required: false,
                    type: 'text',
                    value: '',
                    readonly: true,
                },
            ],
            style: 'inline',
            class: 'grid-rows-5 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAllSetupTelaah();
        this.getAll();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        const id_resep = this._activatedRoute.snapshot.queryParams['id_resep'];

        this._resepService
            .getByIdResep(id_resep)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.FormComps.FormGroup.patchValue({
                        nama_stokroom: result.data.stokroom.nama_stokroom,
                        nama_poli: "-",
                        nama_dokter: result.data.dokter.nama,
                        nama_petugas: result.data.petugas.nama,
                        nama_pasien: "John Doe",
                    })
                    this.GridProps.dataSource = result.data.detail_resep;
                }
            })

    }

    private getAllSetupTelaah() {
        this._telaahResepService
            .getAllSetupTelaahResep()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.SetupTelaahResep = result.data.flatMap((item: any) =>
                        item.details.map((detail: any) => ({
                            ...detail,
                            checked: false
                        }))
                    );
                }
            })
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'back') {
            this._router.navigateByUrl("/farmasi/antrian");
        };

        if (data.id == 'simpan') {
            this.handleSaveTelaah();
        }
    }

    handleChangeSetupTelaah(id_telaah: number) {
        const index = this.SelectedSetupTelaah.findIndex(item => item.id_telaah == id_telaah);

        const indexSetup = this.SetupTelaahResep.findIndex(item => item.id_telaah == id_telaah);

        if (index > -1) {
            this.SelectedSetupTelaah.splice(index, 1);

            if (indexSetup > -1) {
                this.SetupTelaahResep[indexSetup].checked = false;
            }
        } else {
            this.SelectedSetupTelaah.push({
                id_telaah: id_telaah
            });

            if (indexSetup > -1) {
                this.SetupTelaahResep[indexSetup].checked = true;
            }
        }
    }

    private handleSaveTelaah() {
        const payload = {
            id_register: this._activatedRoute.snapshot.queryParams['id_register'],
            id_resep: this._activatedRoute.snapshot.queryParams['id_resep'],
            keterangan_telaah: this.KeteranganTelaah,
            detail_telaah: this.SelectedSetupTelaah
        };

        this._telaahResepService
            .create(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Telaah Resep Berhasil Disimpan' });

                    setTimeout(() => {
                        this.handleClickButtonNavigation({ id: 'back', title: 'Kembali', icon: 'pi pi-chevron-left' })
                    }, 1500);
                }
            })
    }

    private handleBatalResep(data: any) {

    }

}
