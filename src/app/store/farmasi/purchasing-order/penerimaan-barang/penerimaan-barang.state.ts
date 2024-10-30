import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { PenerimaanBarangActions } from "./penerimaan-barang.action";
import { PenerimaanBarangModel } from "src/app/model/pages/farmasi/purchasing/penerimaan-barang.model";
import { PenerimaanBarangService } from "src/app/services/farmasi/purchasing/penerimaan-barang.service";

interface PenerimaanBarangStateModel {
    entities: PenerimaanBarangModel.IPenerimaanBarang[];
    single?: PenerimaanBarangModel.IPenerimaanBarang;
    success?: boolean;
    page?: string,
    totalRows?: number,
    totalPage?: number;
}

@State<PenerimaanBarangStateModel>({
    name: 'penerimaan_barang',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class PenerimaanBarangState {

    constructor(
        private _penerimaanBarangService: PenerimaanBarangService,
    ) { }

    @Selector()
    static penerimaanBarangEntities(state: PenerimaanBarangStateModel) {
        return state;
    }

    @Selector()
    static penerimaanBarangSingle(state: PenerimaanBarangStateModel) {
        return state.single;
    }

    @Action(PenerimaanBarangActions.GetAllPenerimaanBarang)
    getAllPenerimaanBarang(ctx: StateContext<PenerimaanBarangStateModel>, actions: any) {
        return this._penerimaanBarangService
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

    @Action(PenerimaanBarangActions.GetAllPenerimaanBarang)
    getByIdPenerimaanBarang(ctx: StateContext<PenerimaanBarangStateModel>, actions: any) {
        return this._penerimaanBarangService
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

    @Action(PenerimaanBarangActions.CreatePenerimaanBarang)
    createPenerimaanBarang(ctx: StateContext<PenerimaanBarangStateModel>, actions: any) {
        return this._penerimaanBarangService
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
                        return ctx.dispatch(new PenerimaanBarangActions.GetAllPenerimaanBarang({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(PenerimaanBarangActions.ValidasiPenerimaanBarang)
    validasiPenerimaanBarang(ctx: StateContext<PenerimaanBarangStateModel>, actions: any) {
        return this._penerimaanBarangService
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
                        return ctx.dispatch(new PenerimaanBarangActions.GetAllPenerimaanBarang({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(PenerimaanBarangActions.CancelPenerimaanBarang)
    cancelPenerimaanBarang(ctx: StateContext<PenerimaanBarangStateModel>, actions: any) {
        return this._penerimaanBarangService
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
                        return ctx.dispatch(new PenerimaanBarangActions.GetAllPenerimaanBarang({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }
}