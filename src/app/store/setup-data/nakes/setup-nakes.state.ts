import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { NakesModel } from "src/app/model/pages/setup-data/nakes.model";
import { NakesService } from "src/app/services/pelayanan-klinik/setup-data/nakes.service";
import { SetupNakesActions } from "./setup-nakes.action";

interface SetupNakesStateModel {
    entities: NakesModel.INakes[];
    single?: NakesModel.INakes;
    success?: boolean;
}

@State<SetupNakesStateModel>({
    name: 'setup_nakes',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class SetupNakesState {

    constructor(
        private _setupNakesService: NakesService,
    ) { }

    @Selector()
    static nakesEntities(state: SetupNakesStateModel) {
        return state.entities;
    }

    @Action(SetupNakesActions.GetAllNakes)
    getAllNakes(ctx: StateContext<SetupNakesStateModel>) {
        return this._setupNakesService
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

    @Action(SetupNakesActions.GetByIdNakes)
    getByIdNakes(ctx: StateContext<SetupNakesStateModel>, actions: any) {
        return this._setupNakesService
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

    @Action(SetupNakesActions.CreateNakes)
    createNakes(ctx: StateContext<SetupNakesStateModel>, actions: any) {
        return this._setupNakesService
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
                        return ctx.dispatch(new SetupNakesActions.GetAllNakes());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupNakesActions.UpdateNakes)
    updateNakes(ctx: StateContext<SetupNakesStateModel>, actions: any) {
        return this._setupNakesService
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
                        return ctx.dispatch(new SetupNakesActions.GetAllNakes());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupNakesActions.UpdateStatusNakes)
    updateStatusNakes(ctx: StateContext<SetupNakesStateModel>, actions: any) {
        return this._setupNakesService
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
                        return ctx.dispatch(new SetupNakesActions.GetAllNakes());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupNakesActions.DeleteNakes)
    deleteNakes(ctx: StateContext<SetupNakesStateModel>, actions: any) {
        return this._setupNakesService
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
                        return ctx.dispatch(new SetupNakesActions.GetAllNakes());
                    } else {
                        return of([]);
                    }
                })
            )
    }

}