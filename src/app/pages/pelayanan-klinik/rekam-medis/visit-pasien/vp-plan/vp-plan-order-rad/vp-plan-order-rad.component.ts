import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { SetupGrupTarifService } from 'src/app/services/billing/setup-data/setup-grup-tarif.service';
import { SetupTarifService } from 'src/app/services/billing/setup-data/setup-tarif.service';
import { RadiologiService } from 'src/app/services/pelayanan-klinik/rekam-medis/radiologi.service';

@Component({
    selector: 'app-vp-plan-order-rad',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        ButtonModule,
        DialogModule,
        GridComponent,
        TabViewModule,
        InputNumberModule,
        ConfirmDialogModule,
        DynamicFormComponent,
        CheckboxModule,
    ],
    templateUrl: './vp-plan-order-rad.component.html',
    styleUrl: './vp-plan-order-rad.component.scss'
})
export class VpPlanOrderRadComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    PageState: 'list' | 'form' = 'list';

    GridProps: GridModel.IGrid = {
        id: 'TransaksiPemasukanGrid',
        column: [
            { field: 'tanggal_order_penunjang', headerName: 'Tgl. Order', class: 'text-blue-500 font-semibold', format: 'datetime' },
            { field: 'nomor_order_penunjang', headerName: 'No. Order' },
            { field: 'nama_tarif', headerName: 'Nama Tarif' },
            { field: 'qty_order', headerName: 'Qty', format: 'number', class: 'text-end' },
            { field: 'is_active', headerName: 'Status', class: 'text-center', renderAsCheckbox: true },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Cancel'],
        showPaging: false,
        showSearch: false,
        isCustomSearch: false,
        customSearchProps: [
            {
                id: 'no_bed',
                placeholder: 'Cari No. Bed Disini',
                type: 'text'
            },
        ],
        showSort: false,
        searchKeyword: 'nomor_bed',
        searchPlaceholder: 'Cari No. Bed Disini'
    };
    GridSelectedData: any;

    ShowDialogForm = false;
    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    SelectedGrupTarif: any;
    GrupTarifDatasource: any[] = [];

    TarifDatasource: any[] = [];

    ShowDialogBatal = false;
    ReasonCanceled = "";

    DetailPenunjangDatasource: any[] = [];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private _radiologiService: RadiologiService,
        private _setupTarifService: SetupTarifService,
        private _confirmationService: ConfirmationService,
        private _setupGrupTarifService: SetupGrupTarifService,
    ) {
        this.FormProps = {
            id: 'form_order_radiologi',
            fields: [
                {
                    id: 'id_register',
                    label: 'ID Register',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_poli_order',
                    label: 'ID Poli Order',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_kelas_order',
                    label: 'ID Kelas Order',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'tanggal_order_penunjang',
                    label: 'Tgl. Order',
                    required: true,
                    type: 'date',
                    value: '',
                },
                {
                    id: 'kode_grup_penunjang',
                    label: 'Kode Grup Penunjang',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'keterangan',
                    label: 'Keterangan',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'keterangan_sample',
                    label: 'Keterangan Sample',
                    required: true,
                    type: 'text',
                    value: '',
                },

            ],
            style: 'not_inline',
            class: 'grid-rows-3 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit() {
        this.getAll();
        this.getAllJenisTarif();
    }

    ngOnDestroy() {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAll() {
        const id_register = this._activatedRoute.snapshot.queryParams['id_register'];

        this._radiologiService
            .getAll(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result.data;
                }
            });
    }

    private getAllJenisTarif() {
        this._setupGrupTarifService
            .getJenisTarif()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const labJenis = result.data.find((item: any) => item.name.toLowerCase().includes('rad'));
                    if (labJenis) {
                        this.getGrupTarif(labJenis.name)
                    }
                }
            });
    }

    private getGrupTarif(jenis_tarif: string) {
        this._setupGrupTarifService
            .getAll(jenis_tarif)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GrupTarifDatasource = result.data;
                }
            });
    }

    handleAddNewOrder() {
        this.FormState = 'insert';
        this.ShowDialogForm = true;
        this.FormComps.FormGroup.reset();
        this.FormComps.FormGroup.get('id_register')?.setValue(this._activatedRoute.snapshot.queryParams['id_register']);
        this.FormComps.FormGroup.get('id_poli_order')?.setValue(this._activatedRoute.snapshot.queryParams['id_poli']);
        this.FormComps.FormGroup.get('id_kelas_order')?.setValue(this._activatedRoute.snapshot.queryParams['id_kelas']);
    }

    handleClickGrupTarif(args: any) {
        const query = {
            jenis_rawat: this._activatedRoute.snapshot.queryParams['jenis_rawat'],
            jenis_tarif: 'Radiologi',
            id_poli: this._activatedRoute.snapshot.queryParams['id_poli'],
            id_kelas: this._activatedRoute.snapshot.queryParams['id_kelas'],
            id_tarif_grup: args.id_tarif_grup
        };

        this._setupTarifService
            .getAllForTindakanMedis(query)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.TarifDatasource = result.data.map((item: any) => {
                        return {
                            ...item,
                            checked: this.DetailPenunjangDatasource.findIndex((tarif: any) => { return tarif.id_tarif_berlaku == item.id_tarif_berlaku }) > -1 ? true : false
                        }
                    });
                }
            })
    }

    handleChangeCheckboxTarif(tarif: any) {
        const indexTarif = this.TarifDatasource.findIndex(item => item.id_tarif_berlaku == tarif.id_tarif_berlaku);
        this.TarifDatasource[indexTarif].checked = !tarif.checked;

        if (this.TarifDatasource[indexTarif].checked) {
            this.DetailPenunjangDatasource.push({
                id_tarif_berlaku: tarif.id_tarif_berlaku,
                id_tarif: tarif.id_tarif,
                nama_tarif: tarif.nama_tarif,
                qty_order: 1,
                qty: 1,
                harga: tarif.nominal_tarif,
                diskon_dokter: 0,
                iur_biaya: 0,
                subtotal: 1 * tarif.nominal_tarif,
                subsidi: 0,
            });
        } else {
            const index = this.DetailPenunjangDatasource.findIndex(item => item.id_tarif_berlaku == tarif.id_tarif_berlaku);
            this.DetailPenunjangDatasource.splice(index, 1);
        }
    }

    handleChangeQtyOrderDetaiPenunjang(args: any, index: number) {
        if (args) {
            this.DetailPenunjangDatasource[index].qty_order = args;
            this.DetailPenunjangDatasource[index].subtotal = args * parseFloat(this.DetailPenunjangDatasource[index].harga);
        }
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        // setTimeout(() => {
        //     let data = JSON.parse(JSON.stringify(args));
        //     data.tanggal_transaksi = data.tanggal_transaksi ? new Date(data.tanggal_transaksi) : null;
        //     data.total = args.harga * args.qty;
        //     this.FormComps.FormGroup.patchValue(data);
        //     this.FormState = 'update';
        //     this.ShowDialogForm = true;
        // }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'cancel') {
            this.ReasonCanceled = "";
            this.ShowDialogBatal = true;
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    handleSaveOrderLab(args: any) {
        const payload = {
            ...args,
            kode_grup_penunjang: 'RAD',
            detail_penunjang: this.DetailPenunjangDatasource
        };

        this._radiologiService
            .create(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Order Berhasil Disimpan' });
                    this.FormComps.FormGroup.reset();
                    this.DetailPenunjangDatasource = [];
                    this.ShowDialogForm = false;
                    this.getAll();
                }
            })
    }

    handleCancelOrder(reason_canceled: string) {
        this._confirmationService.confirm({
            target: (<any>event).target as EventTarget,
            message: 'Data akan dibatalkan',
            header: 'Apakah Anda Yakin?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: "p-button-danger p-button-sm",
            rejectButtonStyleClass: "p-button-secondary p-button-sm",
            acceptIcon: "none",
            acceptLabel: 'Iya Saya Yakin',
            rejectIcon: "none",
            rejectLabel: 'Tidak, Kembali',
            accept: () => {
                const payload = {
                    id_order_penunjang: this.GridSelectedData.id_order_penunjang,
                    reason_canceled
                };

                this._radiologiService
                    .cancel(payload)
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.responseResult) {
                            this._confirmationService.close();
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil dibatalkan' });
                            this.ShowDialogBatal = false;
                            this.getAll();
                        }
                    })
            }
        });
    }
}
