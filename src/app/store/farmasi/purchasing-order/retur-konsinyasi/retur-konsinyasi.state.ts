import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { ReturKonsinyasiActions } from "./retur-konsinyasi.action";
import { ReturKonsinyasiModel } from "src/app/model/pages/farmasi/purchasing/retur-konsinyasi.model";
import { ReturKonsinyasiService } from "src/app/services/farmasi/purchasing/retur-konsinyasi.service";

interface ReturKonsinyasiStateModel {
    entities: ReturKonsinyasiModel.IReturKonsinyasi[];
    single?: ReturKonsinyasiModel.IReturKonsinyasi;
    success?: boolean;
    page?: string,
    totalRows?: number,
    totalPage?: number;
}

@State<ReturKonsinyasiStateModel>({
    name: 'retur_konsinyasi',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class ReturKonsinyasiState {

    constructor(
        private _returKonsinyasiService: ReturKonsinyasiService,
    ) { }

    @Selector()
    static returKonsinyasiEntities(state: ReturKonsinyasiStateModel) {
        return state;
    }

    @Selector()
    static returKonsinyasiSingle(state: ReturKonsinyasiStateModel) {
        return state.single;
    }

    @Action(ReturKonsinyasiActions.GetAllReturKonsinyasi)
    getAllReturKonsinyasi(ctx: StateContext<ReturKonsinyasiStateModel>, actions: any) {
        return this._returKonsinyasiService
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

    @Action(ReturKonsinyasiActions.GetAllReturKonsinyasi)
    getByIdReturKonsinyasi(ctx: StateContext<ReturKonsinyasiStateModel>, actions: any) {
        return this._returKonsinyasiService
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

    @Action(ReturKonsinyasiActions.CreateReturKonsinyasi)
    createReturKonsinyasi(ctx: StateContext<ReturKonsinyasiStateModel>, actions: any) {
        return this._returKonsinyasiService
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
                        return ctx.dispatch(new ReturKonsinyasiActions.GetAllReturKonsinyasi({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(ReturKonsinyasiActions.ValidasiReturKonsinyasi)
    validasiReturKonsinyasi(ctx: StateContext<ReturKonsinyasiStateModel>, actions: any) {
        return this._returKonsinyasiService
            .validasi(actions.payload)
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
                        return ctx.dispatch(new ReturKonsinyasiActions.GetAllReturKonsinyasi({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(ReturKonsinyasiActions.CancelReturKonsinyasi)
    cancelReturKonsinyasi(ctx: StateContext<ReturKonsinyasiStateModel>, actions: any) {
        return this._returKonsinyasiService
            .cancel(actions.payload)
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
                        return ctx.dispatch(new ReturKonsinyasiActions.GetAllReturKonsinyasi({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }
}