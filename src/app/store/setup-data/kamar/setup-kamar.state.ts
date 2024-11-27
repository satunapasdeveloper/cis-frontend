import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { KamarModel } from "src/app/model/pages/setup-data/kamar.model";
import { KamarService } from "src/app/services/pelayanan-klinik/setup-data/kamar.service";
import { SetupKamarActions } from "./setup-kamar.action";

interface SetupKamarStateModel {
    entities: KamarModel.IKamar[];
    actives?: KamarModel.IKamar[];
    single?: KamarModel.IKamar;
    query?: KamarModel.IKamarQueryParams;
    totalRows?: number;
    success?: boolean;
}

@State<SetupKamarStateModel>({
    name: 'setup_kamar',
    defaults: {
        entities: [],
        actives: [],
        totalRows: 0,
        success: true
    }
})
@Injectable()
export class SetupKamarState {

    constructor(
        private _setupKamarService: KamarService,
    ) { }

    @Selector()
    static kamarState(state: SetupKamarStateModel) {
        return state;
    }

    @Selector()
    static kamarEntities(state: SetupKamarStateModel) {
        return state.entities;
    }

    @Selector()
    static kamarTotalRows(state: SetupKamarStateModel) {
        return state.totalRows;
    }

    @Selector()
    static kamarActives(state: SetupKamarStateModel) {
        return state.actives;
    }

    @Action(SetupKamarActions.GetAllKamar)
    getAllKamar(ctx: StateContext<SetupKamarStateModel>, actions: any) {
        return this._setupKamarService
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

    @Action(SetupKamarActions.GetAllActiveKamar)
    getAllActiveKamar(ctx: StateContext<SetupKamarStateModel>, actions: any) {
        return this._setupKamarService
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

    @Action(SetupKamarActions.GetByIdKamar)
    getByIdKamar(ctx: StateContext<SetupKamarStateModel>, actions: any) {
        return this._setupKamarService
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

    @Action(SetupKamarActions.CreateKamar)
    createKamar(ctx: StateContext<SetupKamarStateModel>, actions: any) {
        return this._setupKamarService
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
                        return ctx.dispatch(new SetupKamarActions.GetAllKamar(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupKamarActions.UpdateKamar)
    updateKamar(ctx: StateContext<SetupKamarStateModel>, actions: any) {
        return this._setupKamarService
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
                        return ctx.dispatch(new SetupKamarActions.GetAllKamar(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupKamarActions.UpdateStatusKamar)
    updateStatusKamar(ctx: StateContext<SetupKamarStateModel>, actions: any) {
        return this._setupKamarService
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
                        return ctx.dispatch(new SetupKamarActions.GetAllKamar(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupKamarActions.DeleteKamar)
    deleteKamar(ctx: StateContext<SetupKamarStateModel>, actions: any) {
        return this._setupKamarService
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
                        return ctx.dispatch(new SetupKamarActions.GetAllKamar(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

}