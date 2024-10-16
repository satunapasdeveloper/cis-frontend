import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { RekananPenunjangModel } from "src/app/model/pages/setup-data/rekanan-penunjang.model";
import { RekananPenunjangService } from "src/app/services/setup-data/rekanan-penunjang.service";
import { RekananPenunjangActions } from "./rekanan-penunjang.action";

interface RekananPenunjangStateModel {
    entities: RekananPenunjangModel.IRekananPenunjang[];
    success?: boolean;
}

@State<RekananPenunjangStateModel>({
    name: 'rekanan_penunjang',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class RekananPenunjangState {

    constructor(
        private _rekananPenunjangService: RekananPenunjangService,
    ) { }

    @Selector()
    static rekananPenunjangEntities(state: RekananPenunjangStateModel) {
        return state.entities;
    }

    @Action(RekananPenunjangActions.GetAllRekananPenunjang)
    getAllRekananPenunjang(ctx: StateContext<RekananPenunjangStateModel>) {
        return this._rekananPenunjangService
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

    @Action(RekananPenunjangActions.CreateRekananPenunjang)
    createRekananPenunjang(ctx: StateContext<RekananPenunjangStateModel>, actions: any) {
        return this._rekananPenunjangService
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
                        return ctx.dispatch(new RekananPenunjangActions.GetAllRekananPenunjang());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(RekananPenunjangActions.UpdateRekananPenunjang)
    updateRekananPenunjang(ctx: StateContext<RekananPenunjangStateModel>, actions: any) {
        return this._rekananPenunjangService
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
                        return ctx.dispatch(new RekananPenunjangActions.GetAllRekananPenunjang());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(RekananPenunjangActions.DeleteRekananPenunjang)
    deleteRekananPenunjang(ctx: StateContext<RekananPenunjangStateModel>, actions: any) {
        return this._rekananPenunjangService
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
                        return ctx.dispatch(new RekananPenunjangActions.GetAllRekananPenunjang());
                    } else {
                        return of([]);
                    }
                })
            )
    }
}