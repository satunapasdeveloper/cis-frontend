import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { PurchasingOrderActions } from "./purchasing-order.action";
import { PurchasingOrderModel } from "src/app/model/pages/farmasi/purchasing/pemesanan-po.model";
import { PurchasingOrderService } from "src/app/services/farmasi/purchasing-order/purchasing-order.service";

interface PurchasingOrderStateModel {
    entities: PurchasingOrderModel.IPurchasingOrder[];
    single?: PurchasingOrderModel.IPurchasingOrder;
    success?: boolean;
    page?: string,
    totalRows?: number,
    totalPage?: number;
}

@State<PurchasingOrderStateModel>({
    name: 'purchasing_order',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class PurchasingOrderState {

    constructor(
        private _purchasingOrderService: PurchasingOrderService,
    ) { }

    @Selector()
    static purchasingOrderEntities(state: PurchasingOrderStateModel) {
        return state;
    }

    @Selector()
    static purchasingOrderSingle(state: PurchasingOrderStateModel) {
        return state.single;
    }

    @Action(PurchasingOrderActions.GetAllPurchasingOrder)
    getAllPurchasingOrder(ctx: StateContext<PurchasingOrderStateModel>, actions: any) {
        return this._purchasingOrderService
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

    @Action(PurchasingOrderActions.GetAllPurchasingOrder)
    getByIdPurchasingOrder(ctx: StateContext<PurchasingOrderStateModel>, actions: any) {
        return this._purchasingOrderService
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

    @Action(PurchasingOrderActions.CreatePurchasingOrder)
    createPurchasingOrder(ctx: StateContext<PurchasingOrderStateModel>, actions: any) {
        return this._purchasingOrderService
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
                        return ctx.dispatch(new PurchasingOrderActions.GetAllPurchasingOrder({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(PurchasingOrderActions.ValidasiPurchasingOrder)
    validasiPurchasingOrder(ctx: StateContext<PurchasingOrderStateModel>, actions: any) {
        return this._purchasingOrderService
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
                        return ctx.dispatch(new PurchasingOrderActions.GetAllPurchasingOrder({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(PurchasingOrderActions.CancelPurchasingOrder)
    cancelPurchasingOrder(ctx: StateContext<PurchasingOrderStateModel>, actions: any) {
        return this._purchasingOrderService
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
                        return ctx.dispatch(new PurchasingOrderActions.GetAllPurchasingOrder({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }
}