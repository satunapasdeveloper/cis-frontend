import { CommonModule, formatDate } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { map, Subject, takeUntil } from 'rxjs';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';
import { RekamMedisState } from 'src/app/store/rekam-medis';
import { ManajemenUserState } from 'src/app/store/setup-data/manajemen-user';
import { SetupTindakanMedisState } from 'src/app/store/setup-data/tindakan-medis';

@Component({
    selector: 'app-tindakan',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        InputSwitchModule,
        DropdownModule,
        CalendarModule
    ],
    templateUrl: './tindakan.component.html',
    styleUrl: './tindakan.component.scss'
})
export class TindakanComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    FormTindakan: FormGroup;

    PetugasDatasource: any[] = [];

    TindakanMedisDatasource: any[] = [];

    TindakanForSave: any[] = [];

    BmhpDatasource: any[] = [];

    BmhpForSave: any[] = [];

    constructor(
        private _store: Store,
        private _formBuilder: FormBuilder,
        private _rekamMedisService: RekamMedisService,
    ) {
        this.FormTindakan = this._formBuilder.group({
            id_pendaftaran: [false, []],
            is_ada_kie: [false, []],
            keterangan_kie: ['', []],
            is_ada_tindakan: [false, []],
            tanggal_tindakan: [null, []],
            waktu_tindakan: [null, []],
            petugas: [null, []],
            tindakan: [[], []],
            bmhp: [[], []]
        })
    };

    ngOnInit(): void {
        this.getBmhp();
        this.getSetupTindakanMedis();
        this.getUser();
    }

    ngAfterViewInit(): void {
        this.getTindakan();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getBmhp() {
        this._rekamMedisService
            .getAllBmhp()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.BmhpDatasource = result.data;
            })
    }

    private getSetupTindakanMedis() {
        this._store
            .select(SetupTindakanMedisState.TindakanMedisEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.TindakanMedisDatasource = result;
            })
    }

    private getTindakan() {
        this._store
            .select(RekamMedisState.rekamMedisDetail)
            .pipe(
                takeUntil(this.Destroy$),
                map((result) => {
                    return result?.tindakan ? result.tindakan : null;
                })
            )
            .subscribe((result) => {
                if (result) {
                    this.FormTindakan.get('id_pendaftaran')?.setValue(result.id_pendaftaran);
                    this.FormTindakan.get('is_ada_kie')?.setValue(result.kie.catatan ? true : false);
                    this.FormTindakan.get('keterangan_kie')?.setValue(result.kie.catatan);
                    this.FormTindakan.get('is_ada_tindakan')?.setValue(result.tindakan.length ? true : false);
                    this.FormTindakan.get('tanggal_tindakan')?.setValue(result.tanggal ? new Date(result.tanggal) : null);
                    this.FormTindakan.get('waktu_tindakan')?.setValue(result.tanggal ? new Date(result.tanggal) : null);
                    this.FormTindakan.get('petugas')?.setValue(result.id_user);

                    this.TindakanForSave = result.tindakan.map((item: any) => {
                        return {
                            id_tindakan: item.id_tindakan,
                            kode_icd9: item.kode_icd9,
                            display_icd9: item.display_icd9,
                            tindakan: item.tindakan,
                            petugas: 0,
                            qty: item.qty,
                            harga: item.harga,
                            total: item.total,
                            is_new: false,
                            is_edit: false
                        }
                    });

                    this.BmhpForSave = result.bmhp.map((item: any) => {
                        return {
                            id_item: item.id_item,
                            kode_kfa: item.kode_kfa,
                            nama_item: item.nama_item,
                            qty: item.qty,
                            harga: item.harga,
                            total: item.total,
                            is_new: false,
                            is_edit: false
                        }
                    })
                }
            })
    }

    private getUser() {
        this._store
            .select(ManajemenUserState.allUserEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.PetugasDatasource = result;
                }
            })
    }

    handleAddTindakan() {
        this.TindakanForSave.push({
            id_tindakan: this.TindakanForSave.length + 1,
            kode_icd9: '',
            display_icd9: '',
            petugas: 0,
            qty: 0,
            harga: 0,
            total: 0,
            is_new: true,
            is_edit: false
        });
    }

    handleEditTindakan(index: number) {
        let value = this.TindakanForSave.map((data: any, indexes: number) => {
            return {
                ...data,
                is_edit: indexes == index ? true : false
            }
        });

        this.TindakanForSave = value;
    }

    handleDeleteTindakan(index: number) {
        if (this.TindakanForSave.length > 1) {
            this.TindakanForSave.splice(index, 1);
        }
    }

    handleChangeTindakanMedisDropdown(args: any, index: number) {
        this.TindakanForSave[index].id_tindakan = args.value.id_tindakan;
        this.TindakanForSave[index].tindakan = args.value.tindakan;
        this.TindakanForSave[index].kode_icd9 = args.value.kode_icd_9;
        this.TindakanForSave[index].display_icd9 = args.value.nama_icd_9;
        this.TindakanForSave[index].harga = args.value.harga;
    }

    handleChangeTindakanMedisQty(args: any, index: number) {
        const harga = this.TindakanForSave[index].harga ? parseFloat(this.TindakanForSave[index].harga) : 0;
        this.TindakanForSave[index].total = args * harga;
    }

    handleAddBmhp() {
        this.BmhpForSave.push({
            id_item: this.BmhpForSave.length + 1,
            kode_kfa: '',
            nama_item: '',
            qty: 0,
            harga: 0,
            total: 0,
            is_new: true,
            is_edit: false
        });
    }

    handleEditBmhp(index: number) {
        let value = this.BmhpForSave.map((data: any, indexes: number) => {
            return {
                ...data,
                is_edit: indexes == index ? true : false
            }
        });

        this.BmhpForSave = value;
    }

    handleDeleteBmhp(index: number) {
        if (this.BmhpForSave.length > 1) {
            this.BmhpForSave.splice(index, 1);
        }
    }

    handleChangeBmhpDropdown(args: any, index: number) {
        this.BmhpForSave[index].id_item = args.value.id_item;
        this.BmhpForSave[index].kode_kfa = args.value.kode_kfa;
        this.BmhpForSave[index].nama_item = args.value.nama_item;
        this.BmhpForSave[index].harga = args.value.harga_jual;
    }

    handleChangeBmhpQty(args: any, index: number) {
        const harga = this.BmhpForSave[index].harga ? parseFloat(this.BmhpForSave[index].harga) : 0;
        this.BmhpForSave[index].total = args * harga;
    }

    getTindakanForRekamMedis() {
        const bmhp_for_save = JSON.parse(JSON.stringify(this.BmhpForSave));
        const tindakan_for_save = JSON.parse(JSON.stringify(this.TindakanForSave));

        const
            tanggal_tindakan = this.FormTindakan.get('tanggal_tindakan')?.value,
            waktu_tindakan = this.FormTindakan.get('waktu_tindakan')?.value,
            bmhp = bmhp_for_save.map((item: any) => {
                delete item.is_new;
                delete item.is_edit;

                return {
                    ...item,
                }
            }),
            tindakan = tindakan_for_save.map((item: any) => {
                delete item.is_new;
                delete item.is_edit;
                delete item.petugas;

                return {
                    ...item,
                }
            });

        return {
            id_pendaftaran: this.FormTindakan.get('id_pendaftaran')?.value,
            kie: {
                catatan: this.FormTindakan.get('keterangan_kie')?.value
            },
            tindakan: tindakan,
            bmhp: bmhp,
            tanggal: tanggal_tindakan ? formatDate(tanggal_tindakan, 'yyyy-MM-dd', 'EN') : null,
            waktu: waktu_tindakan ? formatDate(waktu_tindakan, 'HH:mm', 'EN') : null,
            id_user: this.FormTindakan.get('petugas')?.value,
        }
    }

    get is_ada_kie(): AbstractControl {
        return this.FormTindakan.get('is_ada_kie') as AbstractControl
    }

    get keterangan_kie(): AbstractControl {
        return this.FormTindakan.get('keterangan_kie') as AbstractControl
    }

    get is_ada_tindakan(): AbstractControl {
        return this.FormTindakan.get('is_ada_tindakan') as AbstractControl
    }

    get tindakan(): AbstractControl {
        return this.FormTindakan.get('tindakan') as AbstractControl
    }

    get bmhp(): AbstractControl {
        return this.FormTindakan.get('bmhp') as AbstractControl
    }
}
