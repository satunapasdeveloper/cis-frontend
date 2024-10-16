import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { TindakanMedisModel } from "src/app/model/pages/setup-data/tindakan-medis.model";
import { TindakanMedisService } from "src/app/services/setup-data/tindakan-medis.service";
import { SetupTindakanMedisActions } from "./setup-tindakan-medis.action";

interface SetupTindakanMedisStateModel {
    entities: TindakanMedisModel.ITindakanMedis[];
    single?: TindakanMedisModel.ITindakanMedis;
    success?: boolean;
}

@State<SetupTindakanMedisStateModel>({
    name: 'setup_tindakan_medis',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class SetupTindakanMedisState {

    constructor(
        private _tindakanMedisService: TindakanMedisService,
    ) { }

    @Selector()
    static TindakanMedisEntities(state: SetupTindakanMedisStateModel) {
        return state.entities;
    }

    @Action(SetupTindakanMedisActions.GetAllTindakanMedis)
    getAllTindakanMedis(ctx: StateContext<SetupTindakanMedisStateModel>) {
        return this._tindakanMedisService
            .getAll()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        entities: result.data,
                    });
                })
            )
    }

    @Action(SetupTindakanMedisActions.GetByIdTindakanMedis)
    getByIdTindakanMedis(ctx: StateContext<SetupTindakanMedisStateModel>, actions: any) {
        return this._tindakanMedisService
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

    @Action(SetupTindakanMedisActions.CreateTindakanMedis)
    createTindakanMedis(ctx: StateContext<SetupTindakanMedisStateModel>, actions: any) {
        return this._tindakanMedisService
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
                        return ctx.dispatch(new SetupTindakanMedisActions.GetAllTindakanMedis());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupTindakanMedisActions.UpdateTindakanMedis)
    updateTindakanMedis(ctx: StateContext<SetupTindakanMedisStateModel>, actions: any) {
        return this._tindakanMedisService
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
                        return ctx.dispatch(new SetupTindakanMedisActions.GetAllTindakanMedis());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupTindakanMedisActions.UpdateStatusTindakanMedis)
    updateStatusTindakanMedis(ctx: StateContext<SetupTindakanMedisStateModel>, actions: any) {
        return this._tindakanMedisService
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
                        return ctx.dispatch(new SetupTindakanMedisActions.GetAllTindakanMedis());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupTindakanMedisActions.DeleteTindakanMedis)
    deleteTindakanMedis(ctx: StateContext<SetupTindakanMedisStateModel>, actions: any) {
        return this._tindakanMedisService
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
                        return ctx.dispatch(new SetupTindakanMedisActions.GetAllTindakanMedis());
                    } else {
                        return of([]);
                    }
                })
            )
    }

}