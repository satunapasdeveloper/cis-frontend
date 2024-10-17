import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { SetupGolonganService } from "src/app/services/farmasi/setup-data/setup-golongan.service";
import { SetupGolonganActions } from "./setup-golongan.action";
import { GolonganModel } from "src/app/model/pages/farmasi/setup-data/setup-golongan.model";

interface SetupGolonganStateModel {
    entities: GolonganModel.IGolongan[];
    success?: boolean;
}

@State<SetupGolonganStateModel>({
    name: 'setup_golongan',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class SetupGolonganState {

    constructor(
        private _setupGolonganService: SetupGolonganService,
    ) { }

    @Selector()
    static golonganEntities(state: SetupGolonganStateModel) {
        return state.entities;
    }

    @Action(SetupGolonganActions.GetAllGolongan)
    getAllGolongan(ctx: StateContext<SetupGolonganStateModel>) {
        return this._setupGolonganService
            .getAll({ count: 100, page: 1 })
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

    @Action(SetupGolonganActions.CreateGolongan)
    createGolongan(ctx: StateContext<SetupGolonganStateModel>, actions: any) {
        return this._setupGolonganService
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
                        return ctx.dispatch(new SetupGolonganActions.GetAllGolongan({ count: 100, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupGolonganActions.UpdateGolongan)
    updateGolongan(ctx: StateContext<SetupGolonganStateModel>, actions: any) {
        return this._setupGolonganService
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
                        return ctx.dispatch(new SetupGolonganActions.GetAllGolongan({ count: 100, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupGolonganActions.DeleteGolongan)
    deleteGolongan(ctx: StateContext<SetupGolonganStateModel>, actions: any) {
        return this._setupGolonganService
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
                        return ctx.dispatch(new SetupGolonganActions.GetAllGolongan({ count: 100, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }
}