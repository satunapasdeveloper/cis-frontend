import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { RekamMedisService } from 'src/app/services/rekam-medis/rekam-medis.service';
import { RekamMedisState } from 'src/app/store/rekam-medis';

@Component({
    selector: 'app-diagnosis',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        ButtonModule
    ],
    templateUrl: './diagnosis.component.html',
    styleUrl: './diagnosis.component.scss'
})
export class DiagnosisComponent implements OnInit, AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    Icd10: any[] = [];

    DiagnosaDatasource: any[] = [];

    JenisDiagnosa: any[] = [
        { label: 'Diagnosa Utama / Primer', value: 'Diagnosa Utama / Primer' },
        { label: 'Diagnosa Tambahan / Sekunder', value: 'Diagnosa Tambahan / Sekunder' },
    ];

    KeywordSearch$ = new BehaviorSubject(null);

    constructor(
        private _store: Store,
        private _activatedRoute: ActivatedRoute,
        private _rekamMedisService: RekamMedisService
    ) {
        this.KeywordSearch$
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((result) => {
                if (result) {
                    this.getAllIcd10(result);
                }
            })
    }

    ngOnInit(): void {
        // this.getAllIcd10();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getDiagnosis();
        }, 100);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getDiagnosis() {
        this._store
            .select(RekamMedisState.rekamMedisDetail)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result?.diagnosisi) {
                    this.DiagnosaDatasource = (<any>result.diagnosisi)['diagnosisi'].map((item: any) => {
                        return {
                            ...item,
                            is_new: false,
                            is_edit: false
                        }
                    });
                }
            })
    }

    handleSearchIcd10(args: any) {
        this.KeywordSearch$.next(args.filter);
    }

    handleChangeIcd10(args: any, index: number) {
        if (args.value) {
            const kode_icd10 = args.value.split("-")[0];
            const display_icd10 = args.value.split("-")[1];

            this.DiagnosaDatasource[index].kode_icd10 = kode_icd10;
            this.DiagnosaDatasource[index].display_icd10 = display_icd10;

            console.log("diagnosa =>", this.DiagnosaDatasource);
        }
    }

    private getAllIcd10(keyword?: string) {
        this._rekamMedisService
            .getAllIcd10(keyword)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.Icd10 = result.data.map((item) => {
                    return {
                        ...item,
                        joined: `${item.kode_icd_10} - ${item.nama_icd_10}`
                    }
                });
            })
    }

    handleAddDiagnosa() {
        let data = [...this.DiagnosaDatasource];
        data.push({
            id_pendaftaran: this._activatedRoute.snapshot.queryParams['id'],
            kode_icd10: '',
            display_icd10: '',
            jenis_diagnosis: '',
            keterangan: '',
            is_new: true,
            is_edit: false
        });

        this.DiagnosaDatasource = data;
    };

    handleEditDiagnosa(index: number) {
        let value = this.DiagnosaDatasource.map((data: any, indexes: number) => {
            return {
                ...data,
                is_edit: indexes == index ? true : false
            }
        });

        this.DiagnosaDatasource = value;
    }

    handleDeleteDiagnosa(index: number) {
        if (this.DiagnosaDatasource.length > 0) {
            let data = JSON.parse(JSON.stringify(this.DiagnosaDatasource));
            data.splice(index, 1);

            this.DiagnosaDatasource = data;
        }
    }
}
