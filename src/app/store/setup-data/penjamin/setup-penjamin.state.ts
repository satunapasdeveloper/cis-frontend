import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { PenjaminModel } from "src/app/model/pages/setup-data/penjamin.model";
import { PenjaminService } from "src/app/services/pelayanan-klinik/setup-data/penjamin.service";
import { SetupPenjaminActions } from "./setup-penjamin.action";

interface SetupPenjaminStateModel {
    entities: PenjaminModel.IPenjamin[];
    actives?: PenjaminModel.IPenjamin[];
    single?: PenjaminModel.IPenjamin;
    query?: PenjaminModel.IPenjaminQueryParams;
    totalRows?: number;
    success?: boolean;
}

@State<SetupPenjaminStateModel>({
    name: 'setup_penjamin',
    defaults: {
        entities: [],
        actives: [],
        totalRows: 0,
        success: true
    }
})
@Injectable()
export class SetupPenjaminState {

    constructor(
        private _setupPenjaminService: PenjaminService,
    ) { }

    @Selector()
    static penjaminState(state: SetupPenjaminStateModel) {
        return state;
    }

    @Selector()
    static penjaminEntities(state: SetupPenjaminStateModel) {
        return state.entities;
    }

    @Selector()
    static penjaminTotalRows(state: SetupPenjaminStateModel) {
        return state.totalRows;
    }

    @Selector()
    static penjaminActives(state: SetupPenjaminStateModel) {
        return state.actives;
    }

    @Action(SetupPenjaminActions.GetAllPenjamin)
    getAllPenjamin(ctx: StateContext<SetupPenjaminStateModel>, actions: any) {
        return this._setupPenjaminService
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

    @Action(SetupPenjaminActions.GetAllActivePenjamin)
    getAllActivePenjamin(ctx: StateContext<SetupPenjaminStateModel>, actions: any) {
        return this._setupPenjaminService
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

    @Action(SetupPenjaminActions.GetByIdPenjamin)
    getByIdPenjamin(ctx: StateContext<SetupPenjaminStateModel>, actions: any) {
        return this._setupPenjaminService
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

    @Action(SetupPenjaminActions.CreatePenjamin)
    createPenjamin(ctx: StateContext<SetupPenjaminStateModel>, actions: any) {
        return this._setupPenjaminService
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
                        return ctx.dispatch(new SetupPenjaminActions.GetAllPenjamin(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupPenjaminActions.UpdatePenjamin)
    updatePenjamin(ctx: StateContext<SetupPenjaminStateModel>, actions: any) {
        return this._setupPenjaminService
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
                        return ctx.dispatch(new SetupPenjaminActions.GetAllPenjamin(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupPenjaminActions.UpdateStatusPenjamin)
    updateStatusPenjamin(ctx: StateContext<SetupPenjaminStateModel>, actions: any) {
        return this._setupPenjaminService
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
                        return ctx.dispatch(new SetupPenjaminActions.GetAllPenjamin(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupPenjaminActions.DeletePenjamin)
    deletePenjamin(ctx: StateContext<SetupPenjaminStateModel>, actions: any) {
        return this._setupPenjaminService
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
                        return ctx.dispatch(new SetupPenjaminActions.GetAllPenjamin(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

}