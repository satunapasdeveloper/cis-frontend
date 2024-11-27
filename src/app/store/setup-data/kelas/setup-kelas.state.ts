import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { KelasModel } from "src/app/model/pages/setup-data/kelas.model";
import { SetupKelasActions } from "./setup-kelas.action";
import { SetupKelasService } from "src/app/services/pendaftaran-klinik/setup-data/setup-kelas.service";

interface SetupKelasStateModel {
    entities: KelasModel.IKelas[];
    actives?: KelasModel.IKelas[];
    single?: KelasModel.IKelas;
    query?: KelasModel.IKelasQueryParams;
    totalRows?: number;
    success?: boolean;
}

@State<SetupKelasStateModel>({
    name: 'setup_kelas',
    defaults: {
        entities: [],
        actives: [],
        totalRows: 0,
        success: true
    }
})
@Injectable()
export class SetupKelasState {

    constructor(
        private _setupKelasService: SetupKelasService,
    ) { }

    @Selector()
    static kelasState(state: SetupKelasStateModel) {
        return state;
    }

    @Selector()
    static kelasEntities(state: SetupKelasStateModel) {
        return state.entities;
    }

    @Selector()
    static kelasTotalRows(state: SetupKelasStateModel) {
        return state.totalRows;
    }

    @Selector()
    static kelasActives(state: SetupKelasStateModel) {
        return state.actives;
    }

    @Action(SetupKelasActions.GetAllKelas)
    getAllKelas(ctx: StateContext<SetupKelasStateModel>, actions: any) {
        return this._setupKelasService
            .getAll(actions.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        entities: result.data.rows,
                        totalRows: result.data.totalRows,
                        query: actions.payload
                    });
                })
            )
    }

    @Action(SetupKelasActions.GetAllActiveKelas)
    getAllActiveKelas(ctx: StateContext<SetupKelasStateModel>, actions: any) {
        return this._setupKelasService
            .getAllActive(actions.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        actives: result.data.rows,
                    });
                })
            )
    }

    @Action(SetupKelasActions.GetByIdKelas)
    getByIdKelas(ctx: StateContext<SetupKelasStateModel>, actions: any) {
        return this._setupKelasService
            .getById(actions.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        single: result.data,
                    });
                })
            )
    }

    @Action(SetupKelasActions.CreateKelas)
    createKelas(ctx: StateContext<SetupKelasStateModel>, actions: any) {
        return this._setupKelasService
            .create(actions.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    if (result.responseResult) {
                        ctx.setState({
                            ...state,
                            entities: result.data,
                            success: true
                        })
                    } else {
                        ctx.patchState({
                            ...state,
                            success: false
                        })
                    }
                }),
                switchMap((result: any) => {
                    if (result.responseResult) {
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupKelasActions.GetAllKelas(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupKelasActions.UpdateKelas)
    updateKelas(ctx: StateContext<SetupKelasStateModel>, actions: any) {
        return this._setupKelasService
            .update(actions.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    if (result.responseResult) {
                        ctx.setState({
                            ...state,
                            entities: result.data,
                            success: true
                        })
                    } else {
                        ctx.patchState({
                            ...state,
                            success: false
                        })
                    }
                }),
                switchMap((result: any) => {
                    if (result.responseResult) {
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupKelasActions.GetAllKelas(state.query!));

                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupKelasActions.UpdateStatusKelas)
    updateStatusKelas(ctx: StateContext<SetupKelasStateModel>, actions: any) {
        return this._setupKelasService
            .updateStatus(actions.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    if (result.responseResult) {
                        ctx.setState({
                            ...state,
                            entities: result.data,
                            success: true
                        })
                    } else {
                        ctx.patchState({
                            ...state,
                            success: false
                        })
                    }
                }),
                switchMap((result: any) => {
                    if (result.responseResult) {
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupKelasActions.GetAllKelas(state.query!));

                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupKelasActions.DeleteKelas)
    deleteKelas(ctx: StateContext<SetupKelasStateModel>, actions: any) {
        return this._setupKelasService
            .delete(actions.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    if (result.responseResult) {
                        ctx.setState({
                            ...state,
                            entities: result.data,
                            success: true
                        })
                    } else {
                        ctx.patchState({
                            ...state,
                            success: false
                        })
                    }
                }),
                switchMap((result: any) => {
                    if (result.responseResult) {
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupKelasActions.GetAllKelas(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

}