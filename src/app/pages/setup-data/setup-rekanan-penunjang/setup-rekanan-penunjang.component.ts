import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { RekananPenunjangActions, RekananPenunjangState } from 'src/app/store/setup-data/rekanan-penunjang';

@Component({
    selector: 'app-setup-rekanan-penunjang',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-rekanan-penunjang.component.html',
    styleUrl: './setup-rekanan-penunjang.component.scss'
})
export class SetupRekananPenunjangComponent implements OnInit, OnDestroy {

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
        id: 'Setup_Rekanan_Penunjang',
        column: [
            { field: 'kode_rekanan', headerName: 'Kode Rekanan', class: 'font-semibold' },
            { field: 'nama_rekanan', headerName: 'Nama Rekanan', },
            { field: 'alamat', headerName: 'Alamat', },
            { field: 'no_telepon', headerName: 'No. Telepon', },
            { field: 'is_active', headerName: 'Status Aktif', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Ubah Status', 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: true,
        searchKeyword: 'nama_rekanan',
        searchPlaceholder: 'Cari Nama Rekanan Disini'
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _store: Store,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService
    ) {
        this.FormProps = {
            id: 'form_setup_rekanan_penunjang',
            fields: [
                {
                    id: 'id_rekanan_penunjang',
                    label: 'Id',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'kode_rekanan',
                    label: 'Kode Rekanan',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'nama_rekanan',
                    label: 'Nama Rekanan',
                    required: true,
                    type: 'text',
                    value: ''
                },
                {
                    id: 'alamat',
                    label: 'Alamat',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'no_telp',
                    label: 'No. Telepon',
                    required: false,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-4 grid-cols-1',
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
        this._store
            .select(RekananPenunjangState.rekananPenunjangEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.GridProps.dataSource = result;
                }
            })
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'add') {
            this.PageState = 'form';
            this.ButtonNavigation = [];
        };
    }

    handleBackToList() {
        this.FormComps.onResetForm();

        setTimeout(() => {
            this.PageState = 'list';
            this.FormState = 'insert';
            this.ButtonNavigation = [
                {
                    id: 'add',
                    title: 'Tambah',
                    icon: 'pi pi-plus'
                }
            ];
        }, 100);
    }

    onCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.PageState = 'form';
        this.FormState = 'update';
        // ** Set value ke Dynamic form components
        setTimeout(() => {
            setTimeout(() => {
                this.FormComps.FormGroup.patchValue(args);
            }, 500);
        }, 100);
    }

    onToolbarClicked(args: any): void {
        if (args.type == 'delete') {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                message: 'Data yang dihapus tidak bisa dikembalikan',
                header: 'Apakah Anda Yakin?',
                icon: 'pi pi-info-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Iya Saya Yakin',
                rejectIcon: "none",
                rejectLabel: 'Tidak, Kembali',
                accept: () => {
                    this.deleteRekananPenunjang(args.data.id_rekanan_penunjang);
                }
            });
        }

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
                    this.updateRekananPenunjang(args.data.id_rekanan_penunjang);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    saveRekananPenunjang(data: any) {
        this._store
            .dispatch(new RekananPenunjangActions.CreateRekananPenunjang(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.rekanan_penunjang.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateRekananPenunjang(data: any) {
        this._store
            .dispatch(new RekananPenunjangActions.UpdateRekananPenunjang(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.rekanan_penunjang.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    deleteRekananPenunjang(id_rekanan_penunjang: string) {
        this._store
            .dispatch(new RekananPenunjangActions.DeleteRekananPenunjang(id_rekanan_penunjang))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.rekanan_penunjang.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Dihapus' });
                    this.getAll();
                }
            })
    }


}
