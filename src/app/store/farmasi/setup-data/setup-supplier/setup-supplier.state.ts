import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetupSupplierActions } from "./setup-supplier.action";
import { of, switchMap, tap } from "rxjs";
import { SetupSupplierService } from "src/app/services/farmasi/setup-data/setup-supplier.service";
import { SupplierModel } from "src/app/model/pages/farmasi/setup-data/setup-supplier.model";

interface SetupSupplierStateModel {
    entities: SupplierModel.ISupplier[];
    success?: boolean;
    page?: string;
    totalRows?: number;
    totalPage?: number;
}

@State<SetupSupplierStateModel>({
    name: 'setup_supplier',
    defaults: {
        entities: [],
        success: true,
    }
})
@Injectable()
export class SetupSupplierState {

    constructor(
        private _setupSupplierService: SetupSupplierService,
    ) { }

    @Selector()
    static supplierEntities(state: SetupSupplierStateModel) {
        return state;
    }

    @Action(SetupSupplierActions.GetAllSupplier)
    getAllSupplier(ctx: StateContext<SetupSupplierStateModel>, actions: any) {
        return this._setupSupplierService
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

    @Action(SetupSupplierActions.CreateSupplier)
    createSupplier(ctx: StateContext<SetupSupplierStateModel>, actions: any) {
        return this._setupSupplierService
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
                        return ctx.dispatch(new SetupSupplierActions.GetAllSupplier({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupSupplierActions.UpdateSupplier)
    updateSupplier(ctx: StateContext<SetupSupplierStateModel>, actions: any) {
        return this._setupSupplierService
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
                        return ctx.dispatch(new SetupSupplierActions.GetAllSupplier({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupSupplierActions.DeleteSupplier)
    deleteSupplier(ctx: StateContext<SetupSupplierStateModel>, actions: any) {
        return this._setupSupplierService
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
                        return ctx.dispatch(new SetupSupplierActions.GetAllSupplier({ count: 10, page: 1 }));
                    } else {
                        return of([]);
                    }
                })
            )
    }
}