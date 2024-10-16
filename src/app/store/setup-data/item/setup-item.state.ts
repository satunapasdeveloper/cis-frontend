import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { ItemService } from "src/app/services/setup-data/item.service";
import { SetupItemActions } from "./setup-item.action";
import { ItemModel } from "src/app/model/pages/setup-data/item.model";

interface SetupItemStateModel {
    entities: ItemModel.IItem[];
    single?: ItemModel.IItem;
    success?: boolean;
}

@State<SetupItemStateModel>({
    name: 'setup_item',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class SetupItemState {

    constructor(
        private _itemService: ItemService,
    ) { }

    @Selector()
    static itemEntities(state: SetupItemStateModel) {
        return state.entities;
    }

    @Action(SetupItemActions.GetAllItem)
    getAllItem(ctx: StateContext<SetupItemStateModel>) {
        return this._itemService
            .getAll()
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

    @Action(SetupItemActions.GetByIdItem)
    getByIdItem(ctx: StateContext<SetupItemStateModel>, actions: any) {
        return this._itemService
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
        return this._itemService
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
                        return ctx.dispatch(new SetupItemActions.GetAllItem());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupItemActions.UpdateItem)
    updateItem(ctx: StateContext<SetupItemStateModel>, actions: any) {
        return this._itemService
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
                        return ctx.dispatch(new SetupItemActions.GetAllItem());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupItemActions.UpdateStatusItem)
    updateStatusItem(ctx: StateContext<SetupItemStateModel>, actions: any) {
        return this._itemService
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
                        return ctx.dispatch(new SetupItemActions.GetAllItem());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupItemActions.DeleteItem)
    deleteItem(ctx: StateContext<SetupItemStateModel>, actions: any) {
        return this._itemService
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
                        return ctx.dispatch(new SetupItemActions.GetAllItem());
                    } else {
                        return of([]);
                    }
                })
            )
    }

}