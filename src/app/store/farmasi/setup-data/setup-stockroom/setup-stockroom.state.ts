import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetupStockroomActions } from "./setup-stockroom.action";
import { of, switchMap, tap } from "rxjs";
import { SetupStockroomService } from "src/app/services/farmasi/setup-data/setup-stockroom.service";
import { StockroomModel } from "src/app/model/pages/farmasi/setup-data/setup-stockroom.model";

interface SetupStockroomStateModel {
    entities: StockroomModel.IStockroom[];
    success?: boolean;
    page?: string,
    totalRows?: number,
    totalPage?: number;
}

@State<SetupStockroomStateModel>({
    name: 'setup_stockroom',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class SetupStockroomState {

    constructor(
        private _setupStockroomService: SetupStockroomService,
    ) { }

    @Selector()
    static stockroomEntities(state: SetupStockroomStateModel) {
        return state;
    }

    @Action(SetupStockroomActions.GetAllStockroom)
    getAllStockroom(ctx: StateContext<SetupStockroomStateModel>, actions: any) {
        return this._setupStockroomService
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

    @Action(SetupStockroomActions.CreateStockroom)
    createStockroom(ctx: StateContext<SetupStockroomStateModel>, actions: any) {
        return this._setupStockroomService
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
                        return ctx.dispatch(new SetupStockroomActions.GetAllStockroom({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupStockroomActions.UpdateStockroom)
    updateStockroom(ctx: StateContext<SetupStockroomStateModel>, actions: any) {
        return this._setupStockroomService
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
                        return ctx.dispatch(new SetupStockroomActions.GetAllStockroom({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupStockroomActions.DeleteStockroom)
    deleteStockroom(ctx: StateContext<SetupStockroomStateModel>, actions: any) {
        return this._setupStockroomService
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
                        return ctx.dispatch(new SetupStockroomActions.GetAllStockroom({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }
}