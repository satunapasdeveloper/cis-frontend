import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { ReturPembelianActions } from "./retur-penerimaan.action";
import { ReturPembelianModel } from "src/app/model/pages/farmasi/purchasing/retur-penerimaan.model";
import { ReturPenerimaanService } from "src/app/services/farmasi/purchasing/retur-penerimaan.service";

interface ReturPenerimaanStateModel {
    entities: ReturPembelianModel.IReturPembelian[];
    single?: ReturPembelianModel.IReturPembelian;
    success?: boolean;
    page?: string,
    totalRows?: number,
    totalPage?: number;
}

@State<ReturPenerimaanStateModel>({
    name: 'retur_penerimaan',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class ReturPenerimaanState {

    constructor(
        private _returPenerimaanService: ReturPenerimaanService,
    ) { }

    @Selector()
    static returPenerimaanEntities(state: ReturPenerimaanStateModel) {
        return state;
    }

    @Selector()
    static returPenerimaanSingle(state: ReturPenerimaanStateModel) {
        return state.single;
    }

    @Action(ReturPembelianActions.GetAllReturPembelian)
    getAllReturPenerimaan(ctx: StateContext<ReturPenerimaanStateModel>, actions: any) {
        return this._returPenerimaanService
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

    @Action(ReturPembelianActions.GetAllReturPembelian)
    getByIdReturPenerimaan(ctx: StateContext<ReturPenerimaanStateModel>, actions: any) {
        return this._returPenerimaanService
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

    @Action(ReturPembelianActions.CreateReturPembelian)
    createReturPenerimaan(ctx: StateContext<ReturPenerimaanStateModel>, actions: any) {
        return this._returPenerimaanService
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
                        return ctx.dispatch(new ReturPembelianActions.GetAllReturPembelian({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(ReturPembelianActions.ValidasiReturPembelian)
    validasiReturPenerimaan(ctx: StateContext<ReturPenerimaanStateModel>, actions: any) {
        return this._returPenerimaanService
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
                        return ctx.dispatch(new ReturPembelianActions.GetAllReturPembelian({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(ReturPembelianActions.CancelReturPembelian)
    cancelReturPenerimaan(ctx: StateContext<ReturPenerimaanStateModel>, actions: any) {
        return this._returPenerimaanService
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
                        return ctx.dispatch(new ReturPembelianActions.GetAllReturPembelian({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }
}