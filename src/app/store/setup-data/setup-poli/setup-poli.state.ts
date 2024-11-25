import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PoliModel } from "src/app/model/pages/setup-data/poli.model";
import { PoliService } from "src/app/services/pelayanan-klinik/setup-data/poli.service";
import { SetupPoliActions } from "./setup-poli.action";
import { of, switchMap, tap } from "rxjs";

interface SetupPoliStateModel {
    entities: PoliModel.IPoli[];
    actives?: PoliModel.IPoli[];
    single?: PoliModel.IPoli;
    query?: PoliModel.IPoliQueryParams;
    totalRows?: number;
    success?: boolean;
}

@State<SetupPoliStateModel>({
    name: 'setup_poli',
    defaults: {
        entities: [],
        actives: [],
        totalRows: 0,
        success: true
    }
})
@Injectable()
export class SetupPoliState {

    constructor(
        private _poliService: PoliService,
    ) { }

    @Selector()
    static poliState(state: SetupPoliStateModel) {
        return state;
    }

    @Selector()
    static poliEntities(state: SetupPoliStateModel) {
        return state.entities;
    }

    @Selector()
    static poliTotalRows(state: SetupPoliStateModel) {
        return state.totalRows;
    }

    @Selector()
    static poliActives(state: SetupPoliStateModel) {
        return state.actives;
    }

    @Action(SetupPoliActions.GetAllPoli)
    getAllPoli(ctx: StateContext<SetupPoliStateModel>, actions: any) {
        return this._poliService
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

    @Action(SetupPoliActions.GetAllActivePoli)
    getAllActivePoli(ctx: StateContext<SetupPoliStateModel>, actions: any) {
        return this._poliService
            .getAllActive(actions.payload)
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

    @Action(SetupPoliActions.CreatePoli)
    createPoli(ctx: StateContext<SetupPoliStateModel>, actions: any) {
        return this._poliService
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
                        return ctx.dispatch(new SetupPoliActions.GetAllPoli(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupPoliActions.UpdatePoli)
    updatePoli(ctx: StateContext<SetupPoliStateModel>, actions: any) {
        return this._poliService
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
                        return ctx.dispatch(new SetupPoliActions.GetAllPoli(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupPoliActions.UpdateStatusPoli)
    updateStatusPoli(ctx: StateContext<SetupPoliStateModel>, actions: any) {
        return this._poliService
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
                        return ctx.dispatch(new SetupPoliActions.GetAllPoli(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupPoliActions.DeletePoli)
    deletePoli(ctx: StateContext<SetupPoliStateModel>, actions: any) {
        return this._poliService
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
                        return ctx.dispatch(new SetupPoliActions.GetAllPoli(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }
}