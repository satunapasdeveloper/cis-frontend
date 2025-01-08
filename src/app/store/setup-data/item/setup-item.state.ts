import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { ItemService } from "src/app/services/pelayanan-klinik/setup-data/item.service";
import { SetupItemActions } from "./setup-item.action";
import { ItemModel } from "src/app/model/pages/setup-data/item.model";

interface SetupItemStateModel {
    entities: ItemModel.IItem[];
    actives?: ItemModel.IItem[];
    single?: ItemModel.IItem;
    query?: ItemModel.IItemParams;
    totalRows?: number;
    success?: boolean;
}

@State<SetupItemStateModel>({
    name: 'setup_item',
    defaults: {
        entities: [],
        actives: [],
        totalRows: 0,
        success: true
    }
})
@Injectable()
export class SetupItemState {

    constructor(
        private _setupItemService: ItemService,
    ) { }
    @Selector()
    static itemState(state: SetupItemStateModel) {
        return state;
    }

    @Selector()
    static itemEntities(state: SetupItemStateModel) {
        return state.entities;
    }

    @Selector()
    static itemTotalRows(state: SetupItemStateModel) {
        return state.totalRows;
    }

    @Selector()
    static itemActives(state: SetupItemStateModel) {
        return state.actives;
    }

    @Action(SetupItemActions.GetAllItem)
    getAllItem(ctx: StateContext<SetupItemStateModel>, actions: any) {
        return this._setupItemService
            .getAll(actions.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        entities: result.data.rows,
                        totalRows: result.data.totalRows,
                        query: actions.payload
                    });
                })
            )
    }

    @Action(SetupItemActions.GetAllActiveItem)
    getAllActiveItem(ctx: StateContext<SetupItemStateModel>, actions: any) {
        return this._setupItemService
            .getAllActive(actions.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        actives: result.data.rows,
                    });
                })
            )
    }

    @Action(SetupItemActions.GetByIdItem)
    getByIdItem(ctx: StateContext<SetupItemStateModel>, actions: any) {
        return this._setupItemService
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

    @Action(SetupItemActions.CreateItem)
    createItem(ctx: StateContext<SetupItemStateModel>, actions: any) {
        return this._setupItemService
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
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupItemActions.GetAllItem(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupItemActions.UpdateItem)
    updateItem(ctx: StateContext<SetupItemStateModel>, actions: any) {
        return this._setupItemService
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
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupItemActions.GetAllItem(state.query!));

                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupItemActions.UpdateStatusItem)
    updateStatusItem(ctx: StateContext<SetupItemStateModel>, actions: any) {
        return this._setupItemService
            .updateStatus(actions.payload)
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
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupItemActions.GetAllItem(state.query!));

                    } else {
                        return of([]);
                    }
                })
            )
    }

}