import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';
import { RekamMedisState } from 'src/app/store/rekam-medis';

@Component({
    selector: 'app-dialog-resep-racikan',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        InputNumberModule,
        CheckboxModule,
        ButtonModule,
        RadioButtonModule
    ],
    templateUrl: './dialog-resep-racikan.component.html',
    styleUrl: './dialog-resep-racikan.component.scss'
})
export class DialogResepRacikanComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ShowDialog = false;

    KeywordSearch$ = new BehaviorSubject(null);

    @ViewChild('DropdownObatComps') DropdownObatComps!: Dropdown;

    ObatRacikans: any[] = [];

    ObatDatasource: any[] = [];

    SelectedObat: any;

    WaktuPemberianObat: any[] = []

    WaktuSpesifikPemberianObat: any[] = [];

    RutePemberianObat: any[] = [];

    FormState: 'insert' | 'update' = 'insert';

    FormResep: FormGroup;

    @Output('onSave') onSave = new EventEmitter<any>();

    ObatEditedIndex: number = 0;

    constructor(
        private _store: Store,
        private _formBuilder: FormBuilder,
        private _rekamMedisService: RekamMedisService
    ) {
        this.FormResep = this._formBuilder.group({
            nama_racikan: ['', []],
            obats: [[], []],
            aturan_pakai: ["", []],
            waktu_pemberian_obat: [[], []],
            waktu_spesifik_pemberian_obat: [[], []],
            rute_pemberian_obat: ["", []],
        });

        this.KeywordSearch$
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((result) => {
                if (result) {
                    this.getItemObat(result);
                }
            })
    }

    ngOnInit(): void {
        this.getVariable();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleSearchItemObat(args: any) {
        this.KeywordSearch$.next(args.filter);
    }

    private getItemObat(keyword?: string) {
        this._rekamMedisService
            .getAllObat(keyword)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.ObatDatasource = result.data;
            })
    }

    private getVariable() {
        this._store
            .select(RekamMedisState.rekamMedisVariable)
            .pipe(
                takeUntil(this.Destroy$),
                map((result) => {
                    return {
                        rute_pemberian: result?.rute_pemberian,
                        waktu: result?.waktu,
                        waktu_spesifik: result?.waktu_spesifik,
                    }
                })
            )
            .subscribe((result) => {
                this.WaktuPemberianObat = result.waktu as any;
                this.WaktuSpesifikPemberianObat = result.waktu_spesifik as any;
                this.RutePemberianObat = result.rute_pemberian as any;
            })
    }

    handleOpenDialog(state: 'insert' | 'update', index?: number, data?: any) {
        this.FormState = state;

        if (state == 'update') {
            this.FormResep.setValue(data);
            this.ObatRacikans = data.obats;
            this.ObatEditedIndex = index!;
        } else {
            this.FormResep.reset();
            this.ObatEditedIndex = 0;
            this.FormResep = this._formBuilder.group({
                nama_racikan: ['', []],
                aturan_pakai: ["", []],
                waktu_pemberian_obat: [[], []],
                waktu_spesifik_pemberian_obat: [[], []],
                rute_pemberian_obat: ["", []],
            });

            setTimeout(() => {
                this.ObatRacikans = [];
            }, 100);
        }

        this.ShowDialog = true;
    }

    handleCloseDialog() {
        this.ShowDialog = false;
    }

    handleAddObat() {
        this.ObatRacikans.push({
            id_item: "",
            nama_obat: "",
            qty: 0,
            harga: 0,
            subtotal: 0
        })
    }

    handleDeleteObat(index: number) {
        this.ObatRacikans.splice(index, 1);
    }

    handleChangeObat(args: any, index: number) {
        if (args.value) {
            this.ObatRacikans[index].id_item = args.value.id_item;
            this.ObatRacikans[index].nama_obat = args.value.nama_item;
            this.ObatRacikans[index].qty = 1;
            this.ObatRacikans[index].harga = args.value.harga_jual;
            this.ObatRacikans[index].subtotal = args.value.harga_jual;
        }
    }

    handleChangeQty(args: any, index: number) {
        if (parseInt(args) > 0) {
            this.ObatRacikans[index].qty = parseInt(args);
            this.ObatRacikans[index].subtotal = parseInt(args) * parseFloat(this.ObatRacikans[index].harga);

            console.log(this.ObatRacikans[index]);
        }
    }

    handleSave(data: any) {
        if (this.FormResep.valid) {
            data.obats = this.ObatRacikans;
            this.onSave.emit({ state: this.FormState, index: this.ObatEditedIndex, data: data });
            this.handleCloseDialog();
        }
    }
}
