import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DropdownModule } from 'primeng/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { SetupGrupTarifService } from 'src/app/services/billing/setup-data/setup-grup-tarif.service';
import { SetupTarifService } from 'src/app/services/billing/setup-data/setup-tarif.service';

@Component({
    selector: 'app-setup-tarif',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        ButtonModule,
        DialogModule,
        GridComponent,
        DropdownModule,
        PanelMenuModule,
        DashboardComponent,
        ConfirmDialogModule,
        DynamicFormComponent,
    ],
    templateUrl: './setup-tarif.component.html',
    styleUrl: './setup-tarif.component.scss'
})
export class SetupTarifComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    JenisTarif: string = '';
    JenisTarifDatasource: any[] = [];

    GrupTarifDatasource: any[] = [];
    SelectedGrupTarif: any;

    GridTarifProps: GridModel.IGrid = {
        id: 'SetupTarif',
        column: [
            { field: 'kode_tarif', headerName: 'Kode Tarif', class: 'text-blue-500 font-semibold' },
            { field: 'nama_tarif', headerName: 'Nama Tarif' },
            { field: 'nama_tarif_kelompok', headerName: 'Kelompok Tarif' },
            { field: 'jenis_rawat', headerName: 'Jenis Rawat' },
            { field: 'is_active', headerName: 'Status', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Ubah Status', 'Detail'],
        showPaging: false,
        showSearch: false,
        isCustomSearch: false,
        showSort: false,
        searchKeyword: 'no_kamar',
        searchPlaceholder: 'Cari No. KelompokTarif Disini'
    };
    GridSelectedData: any;

    ShowDialogFormGrupTarif: boolean = false;
    DialogFormGrupTarifState: 'child' | 'parent' = 'parent';

    FormGrupTarifState: 'insert' | 'update' = 'insert';
    FormGrupTarifProps: FormModel.IForm;
    @ViewChild('FormGrupTarifComps') FormGrupTarifComps!: DynamicFormComponent;

    FormTarifState: 'insert' | 'update' = 'insert';
    FormTarifProps: FormModel.IForm;
    @ViewChild('FormTarifComps') FormTarifComps!: DynamicFormComponent;

    constructor(
        private _messageService: MessageService,
        private _setupTarifService: SetupTarifService,
        private _confirmationService: ConfirmationService,
        private _setupGrupTarifService: SetupGrupTarifService,
    ) {
        this.FormGrupTarifProps = {
            id: 'form_setup_grup_tarif',
            fields: [
                {
                    id: 'id_tarif_grup',
                    label: 'ID',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_tarif_grup_parent',
                    label: 'ID PARENT',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'jenis_tarif',
                    label: 'Jenis Tarif',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true
                },
                {
                    id: 'kode_tarif_grup_parent',
                    label: 'Kode Grup Tarif Parent',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'nama_tarif_grup_parent',
                    label: 'Nama Grup Tarif Parent',
                    required: true,
                    type: 'text',
                    value: '',
                    readonly: true,
                    hidden: true,
                },
                {
                    id: 'kode_tarif_grup',
                    label: 'Kode Grup Tarif',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'nama_tarif_grup',
                    label: 'Nama Grup Tarif',
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

        this.FormTarifProps = {
            id: 'form_setup_grup_tarif',
            fields: [
                {
                    id: 'id_tarif_grup',
                    label: 'ID',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'id_tarif_grup_parent',
                    label: 'ID PARENT',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'jenis_tarif',
                    label: 'Jenis Tarif',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'kode_tarif_grup_parent',
                    label: 'Kode Grup Tarif Parent',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
                },
                {
                    id: 'nama_tarif_grup_parent',
                    label: 'Nama Grup Tarif Parent',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
                },
                {
                    id: 'kode_tarif_grup',
                    label: 'Kode Grup Tarif',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'nama_tarif_grup',
                    label: 'Nama Grup Tarif',
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

    ngOnInit(): void {
        this.getAllJenisTarif();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAllJenisTarif() {
        this._setupGrupTarifService
            .getJenisTarif()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.JenisTarifDatasource = result.data;
                }
            });
    }

    handleChangeJenisTarif(args: any) {
        if (args.value) {
            this.getAllGrupTarif(args.value);
        }
    }

    private getAllGrupTarif(jenis_tarif: string) {
        this._setupGrupTarifService
            .getAll(jenis_tarif)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GrupTarifDatasource = result.data;
                    console.log("grup tarif =>", this.GrupTarifDatasource);
                }
            });
    }

    handleActionGrupTarif(args: any, state: 'child' | 'parent', action: 'insert' | 'update') {
        this.ShowDialogFormGrupTarif = true;
        this.FormGrupTarifComps.FormGroup.reset();

        this.DialogFormGrupTarifState = state;
        this.FormGrupTarifState = action;

        if (state == 'parent') {
            this.FormGrupTarifComps.FormGroup.get('jenis_tarif')?.setValue(this.JenisTarif);
            this.FormGrupTarifProps.fields[3].hidden = true;
            this.FormGrupTarifProps.fields[4].hidden = true;

            if (action == 'update') {
                this.FormGrupTarifComps.FormGroup.patchValue(args);
            }
        }

        if (state == 'child') {
            this.FormGrupTarifComps.FormGroup.get('jenis_tarif')?.setValue(this.JenisTarif);
            this.FormGrupTarifComps.FormGroup.get('id_tarif_grup_parent')?.setValue(args.id_tarif_grup);
            this.FormGrupTarifComps.FormGroup.get('kode_tarif_grup_parent')?.setValue(args.kode_tarif_grup);
            this.FormGrupTarifComps.FormGroup.get('nama_tarif_grup_parent')?.setValue(args.nama_tarif_grup);
            this.FormGrupTarifComps.FormGroup.get('kode_tarif_grup')?.setValue(`${args.kode_tarif_grup}.`);
            this.FormGrupTarifProps.fields[2].hidden = true;
            this.FormGrupTarifProps.fields[3].hidden = false;
            this.FormGrupTarifProps.fields[4].hidden = false;
            this.FormGrupTarifProps.class = 'grid-rows-2 grid-cols-2';

            if (action == 'update') {
                this.FormGrupTarifComps.FormGroup.patchValue(args);
            }
        }
    }

    handleSaveGrupTarifParent(args: any) {
        const { id_tarif_grup, id_tarif_grup_parent, kode_tarif_grup_parent, nama_tarif_grup_parent, ...data } = args;

        this._setupGrupTarifService
            .createParent(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil disimpan' });
                    this.getAllGrupTarif(this.JenisTarif);
                    this.ShowDialogFormGrupTarif = false;
                }
            })
    }

    handleSaveGrupTarifChild(args: any) {
        const { id_tarif_grup, kode_tarif_grup_parent, nama_tarif_grup_parent, ...data } = args;

        this._setupGrupTarifService
            .createChild(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil disimpan' });
                    this.getAllGrupTarif(this.JenisTarif);
                    this.ShowDialogFormGrupTarif = false;
                }
            })
    }

    handleUpdateGrupTarif(args: any) {
        let { kode_tarif_grup_parent, nama_tarif_grup_parent, ...data } = args;

        this._setupGrupTarifService
            .update({
                ...data,
                is_active: true
            })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.responseResult) {
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data berhasil disimpan' });
                    this.getAllGrupTarif(this.JenisTarif);
                    this.ShowDialogFormGrupTarif = false;
                }
            })
    }

    // ** Tarif
    handleGetAllTarif(data: any) {
        console.log("selected grup tarif =>", data);
        this.SelectedGrupTarif = data;

        this._setupTarifService
            .getAllActive({ page: 1, count: 1000, id_tarif_grup: data.id_tarif_grup })
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.GridTarifProps.dataSource = result.data.rows;
            })
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.FormTarifState = 'update';
        setTimeout(() => {
            this.FormTarifComps.FormGroup.patchValue(args);
        }, 500);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'ubah status') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Data akan diubah statusnya',
                header: 'Apakah Anda Yakin?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Iya Saya Yakin',
                rejectIcon: "none",
                rejectLabel: 'Tidak, Kembali',
                accept: () => {
                    // this.updateStatusKelompokTarif(args.data);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

}
