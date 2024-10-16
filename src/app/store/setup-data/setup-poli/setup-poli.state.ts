import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PoliModel } from "src/app/model/pages/setup-data/poli.model";
import { PoliService } from "src/app/services/setup-data/poli.service";
import { SetupPoliActions } from "./setup-poli.action";
import { of, switchMap, tap } from "rxjs";

interface SetupPoliStateModel {
    entities: PoliModel.IPoli[];
    success?: boolean;
}

@State<SetupPoliStateModel>({
    name: 'setup_poli',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class SetupPoliState {

    constructor(
        private _poliService: PoliService,
    ) { }

    @Selector()
    static poliEntities(state: SetupPoliStateModel) {
        return state.entities;
    }

    @Action(SetupPoliActions.GetAllPoli)
    getAllPoli(ctx: StateContext<SetupPoliStateModel>) {
        return this._poliService
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

    @Action(SetupPoliActions.CreatePoli)
    createPoli(ctx: StateContext<SetupPoliStateModel>, actions: any) {
        return this._poliService
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
                        return ctx.dispatch(new SetupPoliActions.GetAllPoli());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupPoliActions.UpdatePoli)
    updatePoli(ctx: StateContext<SetupPoliStateModel>, actions: any) {
        return this._poliService
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
                        return ctx.dispatch(new SetupPoliActions.GetAllPoli());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupPoliActions.DeletePoli)
    deletePoli(ctx: StateContext<SetupPoliStateModel>, actions: any) {
        return this._poliService
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
                        return ctx.dispatch(new SetupPoliActions.GetAllPoli());
                    } else {
                        return of([]);
                    }
                })
            )
    }
}