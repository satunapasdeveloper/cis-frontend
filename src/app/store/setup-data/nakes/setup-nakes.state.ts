import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { NakesModel } from "src/app/model/pages/setup-data/nakes.model";
import { NakesService } from "src/app/services/pelayanan-klinik/setup-data/nakes.service";
import { SetupNakesActions } from "./setup-nakes.action";

interface SetupNakesStateModel {
    entities: NakesModel.INakes[];
    actives?: NakesModel.INakes[];
    single?: NakesModel.INakes;
    query?: NakesModel.INakesQueryParams;
    totalRows?: number;
    success?: boolean;
}

@State<SetupNakesStateModel>({
    name: 'setup_nakes',
    defaults: {
        entities: [],
        actives: [],
        totalRows: 0,
        success: true
    }
})
@Injectable()
export class SetupNakesState {

    constructor(
        private _setupNakesService: NakesService,
    ) { }

    @Selector()
    static nakesState(state: SetupNakesStateModel) {
        return state;
    }

    @Selector()
    static nakesEntities(state: SetupNakesStateModel) {
        return state.entities;
    }

    @Selector()
    static nakesTotalRows(state: SetupNakesStateModel) {
        return state.totalRows;
    }

    @Selector()
    static nakesActives(state: SetupNakesStateModel) {
        return state.actives;
    }

    @Action(SetupNakesActions.GetAllNakes)
    getAllNakes(ctx: StateContext<SetupNakesStateModel>, actions: any) {
        return this._setupNakesService
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

    @Action(SetupNakesActions.GetAllActiveNakes)
    getAllActiveNakes(ctx: StateContext<SetupNakesStateModel>, actions: any) {
        return this._setupNakesService
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
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupNakesActions.GetAllNakes(state.query!));
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
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupNakesActions.GetAllNakes(state.query!));
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
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupNakesActions.GetAllNakes(state.query!));
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
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupNakesActions.GetAllNakes(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

}