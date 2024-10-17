import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetupPabrikActions } from "./setup-pabrik.action";
import { of, switchMap, tap } from "rxjs";
import { SetupPabrikService } from "src/app/services/farmasi/setup-data/setup-pabrik.service";
import { PabrikModel } from "src/app/model/pages/farmasi/setup-data/setup-pabrik.model";

interface SetupPabrikStateModel {
    entities: PabrikModel.IPabrik[];
    success?: boolean;
    page?: string,
    totalRows?: number,
    totalPage?: number;
}

@State<SetupPabrikStateModel>({
    name: 'setup_pabrik',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class SetupPabrikState {

    constructor(
        private _setupPabrikService: SetupPabrikService,
    ) { }

    @Selector()
    static pabrikEntities(state: SetupPabrikStateModel) {
        return state;
    }

    @Action(SetupPabrikActions.GetAllPabrik)
    getAllPabrik(ctx: StateContext<SetupPabrikStateModel>, actions: any) {
        return this._setupPabrikService
            .getAll(actions.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        entities: result.data.rows,
                        page: result.data.page,
                        totalRows: result.data.totalRows,
                        totalPage: Math.ceil(result.data.totalRows / actions.payload.count)
                    });
                })
            )
    }

    @Action(SetupPabrikActions.CreatePabrik)
    createPabrik(ctx: StateContext<SetupPabrikStateModel>, actions: any) {
        return this._setupPabrikService
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
                        return ctx.dispatch(new SetupPabrikActions.GetAllPabrik({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupPabrikActions.UpdatePabrik)
    updatePabrik(ctx: StateContext<SetupPabrikStateModel>, actions: any) {
        return this._setupPabrikService
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
                        return ctx.dispatch(new SetupPabrikActions.GetAllPabrik({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupPabrikActions.DeletePabrik)
    deletePabrik(ctx: StateContext<SetupPabrikStateModel>, actions: any) {
        return this._setupPabrikService
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
                        return ctx.dispatch(new SetupPabrikActions.GetAllPabrik({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }
}