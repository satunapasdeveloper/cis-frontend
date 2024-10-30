import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { PenerimaanKonsinyasiActions } from "./penerimaan-konsinyasi.action";
import { PenerimaanKonsinyasiModel } from "src/app/model/pages/farmasi/purchasing/penerimaan-konsinyasi.model";
import { PenerimaanKonsinyasiService } from "src/app/services/farmasi/purchasing/penerimaan-konsinyasi.service";

interface PenerimaanKonsinyasiStateModel {
    entities: PenerimaanKonsinyasiModel.IPenerimaanKonsinyasi[];
    single?: PenerimaanKonsinyasiModel.IPenerimaanKonsinyasi;
    success?: boolean;
    page?: string,
    totalRows?: number,
    totalPage?: number;
}

@State<PenerimaanKonsinyasiStateModel>({
    name: 'penerimaan_konsinyasi',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class PenerimaanKonsinyasiState {

    constructor(
        private _penerimaanKonsinyasiService: PenerimaanKonsinyasiService,
    ) { }

    @Selector()
    static penerimaanKonsinyasiEntities(state: PenerimaanKonsinyasiStateModel) {
        return state;
    }

    @Selector()
    static penerimaanKonsinyasiSingle(state: PenerimaanKonsinyasiStateModel) {
        return state.single;
    }

    @Action(PenerimaanKonsinyasiActions.GetAllPenerimaanKonsinyasi)
    getAllPenerimaanKonsinyasi(ctx: StateContext<PenerimaanKonsinyasiStateModel>, actions: any) {
        return this._penerimaanKonsinyasiService
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

    @Action(PenerimaanKonsinyasiActions.GetAllPenerimaanKonsinyasi)
    getByIdPenerimaanKonsinyasi(ctx: StateContext<PenerimaanKonsinyasiStateModel>, actions: any) {
        return this._penerimaanKonsinyasiService
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

    @Action(PenerimaanKonsinyasiActions.CreatePenerimaanKonsinyasi)
    createPenerimaanKonsinyasi(ctx: StateContext<PenerimaanKonsinyasiStateModel>, actions: any) {
        return this._penerimaanKonsinyasiService
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
                        return ctx.dispatch(new PenerimaanKonsinyasiActions.GetAllPenerimaanKonsinyasi({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(PenerimaanKonsinyasiActions.ValidasiPenerimaanKonsinyasi)
    validasiPenerimaanKonsinyasi(ctx: StateContext<PenerimaanKonsinyasiStateModel>, actions: any) {
        return this._penerimaanKonsinyasiService
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
                        return ctx.dispatch(new PenerimaanKonsinyasiActions.GetAllPenerimaanKonsinyasi({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(PenerimaanKonsinyasiActions.CancelPenerimaanKonsinyasi)
    cancelPenerimaanKonsinyasi(ctx: StateContext<PenerimaanKonsinyasiStateModel>, actions: any) {
        return this._penerimaanKonsinyasiService
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
                        return ctx.dispatch(new PenerimaanKonsinyasiActions.GetAllPenerimaanKonsinyasi({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }
}