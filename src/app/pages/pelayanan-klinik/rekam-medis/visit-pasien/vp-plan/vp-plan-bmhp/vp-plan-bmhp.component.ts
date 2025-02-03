import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Subject, takeUntil } from 'rxjs';
import { SetupRutePemberianObatService } from 'src/app/services/farmasi/setup-data/setup-rute-pemberian-obat.service';
import { SetupSatuanService } from 'src/app/services/inventory/setup-data/setup-satuan.service';
import { SetupStockroomService } from 'src/app/services/inventory/setup-data/setup-stockroom.service';
import { BmhpService } from 'src/app/services/pelayanan-klinik/rekam-medis/bmhp.service';
import { ResepService } from 'src/app/services/pelayanan-klinik/rekam-medis/resep.service';
import { ItemService } from 'src/app/services/pelayanan-klinik/setup-data/item.service';
import { NakesService } from 'src/app/services/pelayanan-klinik/setup-data/nakes.service';

@Component({
    selector: 'app-vp-plan-bmhp',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        CalendarModule,
        InputTextModule,
        InputNumberModule,
        InputSwitchModule,
        InputTextareaModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
    ],
    templateUrl: './vp-plan-bmhp.component.html',
    styleUrl: './vp-plan-bmhp.component.scss'
})
export class VpPlanBmhpComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    DataResepByIdRegister: any[] = [];

    ResepDatasource: any[] = [];

    NakesDatasource: any[] = [];
    StockroomDatasource: any[] = [];
    ItemDatasource: any[] = [];
    SatuanDatasource: any[] = [];

    ShowDialogForm = false;
    IsFormResepEdit = false;
    FormResep: FormGroup;

    FormResepDetail: any[] = [];

    IsShowFormDetail: boolean = false;
    IsFormDetailEdit = false;
    SelectedFormDetailIndex: number = 0;
    FormDetail: FormGroup;

    DetailRacikanResep: any[] = [];

    @ViewChild('ConfirmDialogBmhpComps') ConfirmDialogBmhpComps!: ConfirmDialog;

    ShowDialogBatal = false;
    SelectedResep: any;
    ReasonCanceled = "";

    constructor(
        private _formBuilder: FormBuilder,
        private _itemService: ItemService,
        private _bmhpService: BmhpService,
        private _resepService: ResepService,
        private _nakesService: NakesService,
        private _messageService: MessageService,
        private _activatedRoute: ActivatedRoute,
        private _setupSatuanService: SetupSatuanService,
        private _confirmationService: ConfirmationService,
        private _setupStockroomService: SetupStockroomService,
    ) {
        this.FormResep = this._formBuilder.group({
            id_register: [this._activatedRoute.snapshot.queryParams['id_register'], []],
            id_dokter: ['', [Validators.required]],
            id_stokroom: ['', [Validators.required]],
            tanggal_penjualan: ['', [Validators.required]],
            jumlah_item: [0, [Validators.required]],
            total_harga: [0, [Validators.required]],
        });

        this.FormDetail = this._formBuilder.group({
            id_item: ['', [Validators.required]],
            selected_item: [null, [Validators.required]],
            nama_obat: ['', [Validators.required]],
            satuan: ['', []],
            qty: ['', [Validators.required]],
            harga: ['', []],
            subtotal: ['', []],
        });
    }

    ngOnInit() {
        this.getAllData();
        this.getAllResep();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAllResep() {
        const id_register = this._activatedRoute.snapshot.queryParams['id_register'];

        this._bmhpService
            .getAll(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    console.log("data =>", result.data.rows);
                    this.DataResepByIdRegister = result.data.rows;
                }
            })
    }

    private getAllData() {
        // ** Nakes 
        this._nakesService
            .getAllActive({ page: 1, count: 100 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.NakesDatasource = result.data.rows;
                }
            });

        // ** Stockroom
        this._setupStockroomService
            .getAllActive({ page: 1, count: 100 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.StockroomDatasource = result.data.rows;
                }
            });

        // ** Item
        this._itemService
            .getAllActive({ page: 1, count: 100 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.ItemDatasource = result.data.rows;
                }
            });

        // ** Satuan
        this._setupSatuanService
            .getAllActive({ page: 1, count: 100 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.SatuanDatasource = result.data.rows;
                }
            });
    }

    handleCreateNewResep() {
        this.IsFormResepEdit = false
        this.ShowDialogForm = true;
    }

    handleAddNewObat(args?: any, index?: number) {
        if (this.ResepDatasource.length == 0) {
            if (this.IsShowFormDetail) {
                this.ResepDatasource.push(args);
                this.handleResetFormDetail();
            } else {
                this.IsShowFormDetail = true;
            }
        } else {
            this.ResepDatasource.push(args);
            this.handleResetFormDetail();
        }

        this.onCountFooter();
    }

    handleEditObat(index: number) {
        this.IsFormDetailEdit = true;
        this.SelectedFormDetailIndex = index;
        const data = this.ResepDatasource[index];
        this.FormDetail.patchValue(data);
    }

    handleDeleteObat(index: number) {
        this.ResepDatasource.splice(index, 1);
        this.onCountFooter();
    }

    handleUpdateObat(args: any, index: number) {
        this.ResepDatasource[index] = args;
        this.handleResetFormDetail();
        this.IsFormDetailEdit = false;
        this.onCountFooter();
    }

    handleChangeIsRacikan(args: any) {
        if (args) {
            this.handleResetFormDetail();
        }

        this.DetailRacikanResep = [];
    }

    handleChangeObat(args: any) {
        if (args.value) {
            this.FormDetail.get('id_item')?.setValue(args.value.id_item);
            this.FormDetail.get('nama_obat')?.setValue(args.value.nama_item);
            this.FormDetail.get('satuan')?.setValue(args.value.satuan_jual);
            this.FormDetail.get('qty')?.setValue(1);
            this.FormDetail.get('harga')?.setValue(args.value.harga_netto ? args.value.harga_netto : 0);
        }
    }

    handleCountSubtotalObat() {
        const qty = this.FormDetail.get('qty')?.value,
            harga = this.FormDetail.get('harga')?.value;

        this.FormDetail.get('subtotal')?.setValue(qty * harga);
    }

    handleResetFormDetail() {
        this.FormDetail.get('id_item')?.setValue('');
        this.FormDetail.get('selected_item')?.setValue(null);
        this.FormDetail.get('nama_obat')?.setValue('');
        this.FormDetail.get('satuan')?.setValue('');
        this.FormDetail.get('qty')?.setValue('');
        this.FormDetail.get('harga')?.setValue('');
        this.FormDetail.get('subtotal')?.setValue('');
    }

    private onCountFooter() {
        let jumlah_item = this.ResepDatasource.reduce((total, item) => {
            return total + item.qty;
        }, 0);

        this.FormResep.get('jumlah_item')?.setValue(jumlah_item);

        let total_harga = this.ResepDatasource.reduce((total, item) => {
            return total + item.subtotal;
        }, 0);

        this.FormResep.get('total_harga')?.setValue(total_harga);
    }

    handleSaveResep() {
        const payload = {
            ...this.FormResep.value,
            detail_bmhp: this.ResepDatasource.map((item: any) => {
                return {
                    id_item: item.id_item,
                    nama_obat: item.nama_obat,
                    satuan: item.satuan,
                    qty: item.qty,
                    harga: item.harga,
                    subtotal: item.subtotal,
                }
            })
        };

        this._bmhpService
            .create(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'BMHP Berhasil Disimpan' });
                    this.handleResetFormDetail();
                    this.ShowDialogForm = false;
                    this.getAllResep();
                }
            })
    }

    handleEditResep() {
        const payload = {
            ...this.FormResep.value,
            detail_bmhp: this.ResepDatasource.map((item: any) => {
                return {
                    id_item: item.id_item,
                    nama_obat: item.nama_obat,
                    satuan: item.satuan,
                    qty: item.qty,
                    harga: item.harga,
                    subtotal: item.subtotal,
                }
            })
        };
    }

    handleOpenDialogBatalResep(args: any) {
        this.SelectedResep = args;
        this.ReasonCanceled = "";
        this.ShowDialogBatal = true;
    }

    handleValidasiResep(args: any) {
        this._confirmationService.confirm({
            target: this.ConfirmDialogBmhpComps as any,
            message: 'Data akan divalidasi',
            header: 'Apakah Anda Yakin?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: "p-button-danger p-button-sm",
            rejectButtonStyleClass: "p-button-secondary p-button-sm",
            acceptIcon: "none",
            acceptLabel: 'Iya Saya Yakin',
            rejectIcon: "none",
            rejectLabel: 'Tidak, Kembali',
            accept: () => {
                this._bmhpService
                    .validasi(args.id_penjualan_obat)
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.responseResult) {
                            this._confirmationService.close();
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil divalidasi' });
                            this.getAllResep();
                        }
                    })
            }
        });
    }

    handleCancelResep(reason_canceled: string) {
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
                    id_resep: this.SelectedResep.id_resep,
                    reason_canceled
                };

                this._resepService
                    .cancel(payload.id_resep, payload.reason_canceled)
                    .pipe(takeUntil(this.Destroy$))
                    .subscribe((result) => {
                        if (result.responseResult) {
                            this._confirmationService.close();
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil dibatalkan' });
                            this.ShowDialogBatal = false;
                            this.getAllResep();
                        }
                    })
            }
        });
    }

}
