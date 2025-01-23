import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Subject, takeUntil } from 'rxjs';
import { SetupRutePemberianObatService } from 'src/app/services/farmasi/setup-data/setup-rute-pemberian-obat.service';
import { SetupSatuanService } from 'src/app/services/inventory/setup-data/setup-satuan.service';
import { SetupStockroomService } from 'src/app/services/inventory/setup-data/setup-stockroom.service';
import { ItemService } from 'src/app/services/pelayanan-klinik/setup-data/item.service';
import { NakesService } from 'src/app/services/pelayanan-klinik/setup-data/nakes.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ResepService } from 'src/app/services/pelayanan-klinik/rekam-medis/resep.service';
@Component({
    selector: 'app-vp-plan-resep',
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
    templateUrl: './vp-plan-resep.component.html',
    styleUrl: './vp-plan-resep.component.scss'
})
export class VpPlanResepComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    DataResepByIdRegister: any[] = [];

    ResepDatasource: any[] = [];

    NakesDatasource: any[] = [];
    StockroomDatasource: any[] = [];
    ItemDatasource: any[] = [];
    RutePemberianObatDatasource: any[] = [];
    WaktuPemberianObatDatasource: any[] = [
        { name: 'Pagi', value: 'Pagi' },
        { name: 'Siang', value: 'Siang' },
        { name: 'Sore', value: 'Sore' },
        { name: 'Malam', value: 'Malam' },
    ];
    SediaanDatasource: any[] = [
        { name: 'Puyer', value: 'Puyer' },
        { name: 'Kapsul', value: 'Kapsul' },
        { name: 'Tablet', value: 'Tablet' },
    ];
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

    ShowDialogBatal = false;
    SelectedResep: any;
    ReasonCanceled = "";

    constructor(
        private _formBuilder: FormBuilder,
        private _itemService: ItemService,
        private _resepService: ResepService,
        private _nakesService: NakesService,
        private _messageService: MessageService,
        private _activatedRoute: ActivatedRoute,
        private _setupSatuanService: SetupSatuanService,
        private _confirmationService: ConfirmationService,
        private _setupStockroomService: SetupStockroomService,
        private _setupRutePemberianObatService: SetupRutePemberianObatService,
    ) {
        this.FormResep = this._formBuilder.group({
            id_register: [this._activatedRoute.snapshot.queryParams['id_register'], []],
            id_petugas: ['', [Validators.required]],
            tanggal_resep: ['', [Validators.required]],
            jumlah_item: [0, [Validators.required]],
            total_harga: [0, [Validators.required]],
            keterangan: ["", [Validators.required]],
        });

        this.FormDetail = this._formBuilder.group({
            is_racikan: [false, []],
            id_item: ['', [Validators.required]],
            selected_item: [null, [Validators.required]],
            nama_obat: ['', [Validators.required]],
            sediaan: ['', []],
            satuan: ['', []],
            qty: ['', [Validators.required]],
            harga: ['', []],
            subtotal: ['', []],
            aturan_pakai: ['', [Validators.required]],
            rute_pemberian_obat: ['', [Validators.required]],
            waktu_pemberian_obat: ['', [Validators.required]],
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

        this._resepService
            .getResep(id_register)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.DataResepByIdRegister = result.data;
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

        // // ** Stockroom
        // this._setupStockroomService
        //     .getAllActive({ page: 1, count: 100 })
        //     .pipe(takeUntil(this.Destroy$))
        //     .subscribe((result) => {
        //         if (result.responseResult) {
        //             this.StockroomDatasource = result.data.rows;
        //         }
        //     });

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

        // ** Rute Pemberian Obat
        this._setupRutePemberianObatService
            .getAllActive({ page: 1, count: 100 })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.RutePemberianObatDatasource = result.data.rows;
                }
            });
    }

    handleCreateNewResep() {
        this.IsFormResepEdit = false
        this.ShowDialogForm = true;
        // this.FormResep.patchValue({} as any);
    }

    handleAddNewObat(args?: any, index?: number) {
        if (this.ResepDatasource.length == 0) {
            if (this.IsShowFormDetail) {

                if (args.is_racikan) {
                    args.detail_racikan = this.DetailRacikanResep;
                    args.qty = this.DetailRacikanResep.reduce((total, item) => {
                        return total + item.qty;
                    }, 0);
                    args.subtotal = this.DetailRacikanResep.reduce((total, item) => {
                        return total + item.subtotal;
                    }, 0);
                }

                this.ResepDatasource.push(args);
                this.handleResetFormDetail();
            } else {
                this.IsShowFormDetail = true;
            }
        } else {
            if (args.is_racikan) {
                args.detail_racikan = this.DetailRacikanResep;
                args.qty = this.DetailRacikanResep.reduce((total, item) => {
                    return total + item.qty;
                }, 0);
                args.subtotal = this.DetailRacikanResep.reduce((total, item) => {
                    return total + item.subtotal;
                }, 0);
            }

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
        this.DetailRacikanResep = data.is_racikan && data.detail_racikan ? data.detail_racikan : [];
    }

    handleDeleteObat(index: number) {
        this.ResepDatasource.splice(index, 1);
        this.onCountFooter();
    }

    handleUpdateObat(args: any, index: number) {
        if (args.is_racikan) {
            args.detail_racikan = this.DetailRacikanResep;
            args.qty = this.DetailRacikanResep.reduce((total, item) => {
                return total + item.qty;
            }, 0);
            args.subtotal = this.DetailRacikanResep.reduce((total, item) => {
                return total + item.subtotal;
            }, 0);
        }

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

    handleAddNewRacikan() {
        this.DetailRacikanResep.push({
            id_item: 0,
            nama_obat: '',
            selected_item: {},
            satuan: '',
            qty: 0,
            harga: 0,
            subtotal: 0,
            kapasitas: 0,
            dosis_persen: 0,
            dosis: 0
        })
    }

    handleDeleteRacikan(index: number) {
        this.DetailRacikanResep.splice(index, 1);
    }

    handleChangeObatRacikan(args: any, index: number) {
        if (args.value) {
            const data = args.value;
            this.DetailRacikanResep[index].id_item = data.id_item;
            this.DetailRacikanResep[index].nama_obat = data.nama_item;
            this.DetailRacikanResep[index].satuan = data.satuan_jual;
            this.DetailRacikanResep[index].qty = 1;
            this.DetailRacikanResep[index].harga = data.harga_netto ? data.harga_netto : 0;
            this.DetailRacikanResep[index].kapasitas = data.kapasitas ? data.kapasitas : 0;
            this.DetailRacikanResep[index].dosis_persen = 1;

            setTimeout(() => {
                this.handleCountQtyRacikan(index);
            }, 100);
        } else {
            this.DetailRacikanResep.splice(index, 1);
            this.handleAddNewRacikan();
        }
    }

    handleCountQtyRacikan(index: number) {
        const qtyResep = this.FormDetail.get('qty')?.value;

        let data = JSON.parse(JSON.stringify(this.DetailRacikanResep[index]));

        data.dosis = Math.ceil(data.kapasitas / data.dosis_persen);
        this.DetailRacikanResep[index].dosis = data.dosis;

        data.qty = Math.ceil(qtyResep / (data.kapasitas / data.dosis));
        this.DetailRacikanResep[index].qty = data.qty;

        console.log("racikan =>", this.DetailRacikanResep[index]);
    }

    handleCountSubtotalRacikan(index: number) {
        let data = JSON.parse(JSON.stringify(this.DetailRacikanResep[index])),
            qty = data.qty,
            harga = data.harga;

        this.DetailRacikanResep[index].subtotal = qty * harga;
    }

    handleResetFormDetail() {
        this.FormDetail.get('id_item')?.setValue('');
        this.FormDetail.get('selected_item')?.setValue(null);
        this.FormDetail.get('nama_obat')?.setValue('');
        this.FormDetail.get('sediaan')?.setValue('');
        this.FormDetail.get('satuan')?.setValue('');
        this.FormDetail.get('qty')?.setValue('');
        this.FormDetail.get('harga')?.setValue('');
        this.FormDetail.get('subtotal')?.setValue('');
        this.FormDetail.get('aturan_pakai')?.setValue('');
        this.FormDetail.get('rute_pemberian_obat')?.setValue('');
        this.FormDetail.get('waktu_pemberian_obat')?.setValue('');
        this.DetailRacikanResep = [];
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
            detail_resep: this.ResepDatasource
        };

        this._resepService
            .create(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Resep Berhasil Disimpan' });
                    this.handleResetFormDetail();
                    this.ShowDialogForm = false;
                    this.getAllResep();
                }
            })
    }

    handleEditResep() {
        const payload = {
            ...this.FormResep.value,
            detail_resep: this.ResepDatasource
        };
    }

    handleOpenDialogBatalResep(args: any) {
        this.SelectedResep = args;
        this.ReasonCanceled = "";
        this.ShowDialogBatal = true;
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
