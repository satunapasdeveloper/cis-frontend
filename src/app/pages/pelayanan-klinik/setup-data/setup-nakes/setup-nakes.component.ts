import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { GridModel } from 'src/app/model/components/grid.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { MinioService } from 'src/app/services/minio/minio.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { SetupNakesState, SetupNakesActions } from 'src/app/store/setup-data/nakes';

@Component({
    selector: 'app-setup-nakes',
    standalone: true,
    imports: [
        CommonModule,
        DashboardComponent,
        GridComponent,
        DynamicFormComponent,
        ButtonModule,
        ConfirmDialogModule
    ],
    templateUrl: './setup-nakes.component.html',
    styleUrl: './setup-nakes.component.scss'
})
export class SetupNakesComponent implements OnInit, OnDestroy {

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
        id: 'SetupNakes',
        column: [
            { field: 'nama', headerName: 'Nama', },
            { field: 'jabatan', headerName: 'Jabatan', },
            { field: 'poli', headerName: 'Poli', },
            { field: 'role', headerName: 'Role', },
            { field: 'status_aktif', headerName: 'Status', renderAsCheckbox: true, class: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 14.5rem)",
        toolbar: ['Delete', 'Detail'],
        showPaging: true,
        showSearch: true,
        showSort: true,
        searchKeyword: 'nama',
        searchPlaceholder: 'Cari Nama Nakes Disini'
    };
    GridSelectedData: any;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _store: Store,
        private _minioService: MinioService,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _confirmationService: ConfirmationService,
    ) {
        this.FormProps = {
            id: 'form_setup_nakes',
            fields: [
                {
                    id: 'id_nakes',
                    label: 'Kode Nakes',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'nik',
                    label: 'Nama',
                    required: true,
                    type: 'text',
                    value: '',
                    mask: '0000.0000.0000.0000',
                    dropSpecialCharacters: true,
                },
                {
                    id: 'nama',
                    label: 'Nama Lengkap',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'foto',
                    label: 'Foto',
                    required: true,
                    type: 'fileinput',
                    file_accept: 'image/*',
                    value: '',
                    onChange: (files: File) => {
                        if (files) {
                            const type = files.name.split("."),
                                fileName =
                                    this.FormState == 'insert' ?
                                        `nakes_${new Date().getTime()}.${type[1]}` :
                                        this.FormComps.FormGroup.get('foto_name')?.value;

                            this._minioService
                                .generatePresignedUrl('iptv', fileName)
                                .pipe(takeUntil(this.Destroy$))
                                .subscribe((result) => {
                                    if (result.data) {
                                        this.handleUploadFile(result.data, files, fileName);
                                    }
                                })
                        }
                    }
                },
                {
                    id: 'foto_url',
                    label: 'Image URL',
                    required: false,
                    hidden: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'foto_name',
                    label: 'Image Name',
                    required: false,
                    hidden: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_jabatan',
                    label: 'Jabatan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'value',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'id_poli',
                    label: 'Poli',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'value',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'id_role',
                    label: 'Role',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [],
                        optionName: 'name',
                        optionValue: 'value',
                        autoDisplayFirst: false
                    },
                    value: '',
                },
                {
                    id: 'username',
                    label: 'Username',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'password',
                    label: 'Password',
                    required: true,
                    type: 'password',
                    value: '',
                },
                {
                    id: 'kode_dpjp',
                    label: 'Kode DPJP',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'id_satu_sehat',
                    label: 'Id Satu Sehat',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'hfis',
                    label: 'HFIS',
                    required: true,
                    type: 'text',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-11 grid-cols-1',
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
            .select(SetupNakesState.nakesEntities)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    console.log("get from setup poli =>", result);
                    this.GridProps.dataSource = result;
                }
            });
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
                    this.deleteNakes(args.data.id_nakes);
                }
            });
        }

        if (args.type == 'detail') {
            this.onRowDoubleClicked(args.data);
        }
    }

    private handleUploadFile(url: string, file: File, fileName: string) {
        this._utilityService.ShowLoading$.next(true);

        this._minioService
            .uploadFile(url, file)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                console.log("uploading file...");
                console.log("trying get url...");
                this.getUrlFileUploaded(fileName);
            })
    }

    private getUrlFileUploaded(fileName: string) {
        this._minioService
            .getUrlFile('iptv', fileName)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.data) {
                    this.FormComps.FormGroup.get('foto_url')?.setValue(result.data);
                    this.FormComps.FormGroup.get('foto_name')?.setValue(fileName);
                    this._utilityService.ShowLoading$.next(false);
                }
            })
    }

    saveNakes(data: any) {
        this._store
            .dispatch(new SetupNakesActions.CreateNakes(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_nakes.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Disimpan' });
                    this.handleBackToList();
                }
            })
    }

    updateNakes(data: any) {
        this._store
            .dispatch(new SetupNakesActions.UpdateNakes(data))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_nakes.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Diperbarui' });
                    this.handleBackToList();
                }
            })
    }

    private deleteNakes(id_nakes: string) {
        this._store
            .dispatch(new SetupNakesActions.DeleteNakes(id_nakes))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.setup_nakes.success) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data Berhasil Dihapus' });
                    this.handleBackToList();
                }
            })
    }

}
