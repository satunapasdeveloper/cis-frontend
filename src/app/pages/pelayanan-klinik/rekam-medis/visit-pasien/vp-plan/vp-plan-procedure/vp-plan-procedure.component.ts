import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ProcedureService } from 'src/app/services/pelayanan-klinik/rekam-medis/procedure.service';

@Component({
    selector: 'app-vp-plan-procedure',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
    ],
    templateUrl: './vp-plan-procedure.component.html',
    styleUrl: './vp-plan-procedure.component.scss'
})
export class VpPlanProcedureComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ProcedureDatasource: any[] = [];

    ProcedureForSave: any[] = [];

    Icd9KeywordSearch$ = new BehaviorSubject(null);

    constructor(
        private _messageService: MessageService,
        private _activatedRouter: ActivatedRoute,
        private _procedureService: ProcedureService,
    ) {
        this.Icd9KeywordSearch$
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((result) => {
                if (result) {
                    this.getAllProcedure(result);
                }
            })
    }

    ngOnInit() {
        this.getProcedureByIdRegister();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAllProcedure(keyword: string) {
        this._procedureService
            .getIcd9(keyword)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.ProcedureDatasource = result.data.rows;
            })
    }

    private getProcedureByIdRegister() {
        this._procedureService
            .getProcedure(this._activatedRouter.snapshot.queryParams['id_register'])
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this.ProcedureForSave = result.data.map((data: any) => {
                        return {
                            kode_icd_9: data.kode_icd_9,
                            nama_icd_9: data.nama_icd_9,
                            sab_icd_9: data.sab_icd_9,
                            is_new: false,
                            is_edit: false
                        }
                    })
                }
            })
    }

    handleAddProcedure() {
        this.ProcedureForSave.push({
            kode_icd_9: '',
            nama_icd_9: '',
            sab_icd_9: '',
            is_new: true,
            is_edit: false
        });
    }

    handleEditProcedure(index: number, data: any) {
        this.Icd9KeywordSearch$.next(null);
        this.Icd9KeywordSearch$.next(data.nama_icd_9);

        setTimeout(() => {
            let value = this.ProcedureForSave.map((data: any, indexes: number) => {
                return {
                    ...data,
                    is_edit: indexes == index ? true : false
                }
            });

            this.ProcedureForSave = value;
        }, 1000);
    }

    handleDeleteProcedure(index: number) {
        if (this.ProcedureForSave.length > 1) {
            this.ProcedureForSave.splice(index, 1);
        }
    }

    handleFilterProcedureDropdown(args: any) {
        this.Icd9KeywordSearch$.next(args.filter);
    }

    handleChangeProcedureDropdown(args: any, index: number) {
        this.ProcedureForSave[index].kode_icd_9 = args.value.kode_icd_9;
        this.ProcedureForSave[index].nama_icd_9 = args.value.nama_icd_9;
        this.ProcedureForSave[index].sab_icd_9 = args.value.sab_icd_9;
        this.ProcedureForSave[index].is_new = false;
        this.ProcedureForSave[index].is_edit = false;
    }

    private handleUpdateProcedure() {
        let payload = {
            id_register: this._activatedRouter.snapshot.queryParams['id_register'],
            detail: this.ProcedureForSave.map((data: any) => {
                return {
                    kode_icd_9: data.kode_icd_9,
                    nama_icd_9: data.nama_icd_9,
                    sab_icd_9: data.sab_icd_9
                }
            })
        }

        this._procedureService
            .updateProcedure(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Procedure Berhasil Diperbarui' });
                }
            })
    }
}
