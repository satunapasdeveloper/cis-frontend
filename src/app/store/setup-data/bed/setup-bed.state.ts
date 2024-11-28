import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { BedModel } from "src/app/model/pages/setup-data/bed.model";
import { BedService } from "src/app/services/pelayanan-klinik/setup-data/bed.service";
import { SetupBedActions } from "./setup-bed.action";

interface SetupBedStateModel {
    entities: BedModel.IBed[];
    actives?: BedModel.IBed[];
    single?: BedModel.IBed;
    query?: BedModel.IBedQueryParams;
    totalRows?: number;
    success?: boolean;
}

@State<SetupBedStateModel>({
    name: 'setup_bed',
    defaults: {
        entities: [],
        actives: [],
        totalRows: 0,
        success: true
    }
})
@Injectable()
export class SetupBedState {

    constructor(
        private _setupBedService: BedService,
    ) { }

    @Selector()
    static bedState(state: SetupBedStateModel) {
        return state;
    }

    @Selector()
    static bedEntities(state: SetupBedStateModel) {
        return state.entities;
    }

    @Selector()
    static bedTotalRows(state: SetupBedStateModel) {
        return state.totalRows;
    }

    @Selector()
    static bedActives(state: SetupBedStateModel) {
        return state.actives;
    }


    @Action(SetupBedActions.GetAllBed)
    getAllBed(ctx: StateContext<SetupBedStateModel>, actions: any) {
        return this._setupBedService
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

    @Action(SetupBedActions.GetAllActiveBed)
    getAllActiveBed(ctx: StateContext<SetupBedStateModel>, actions: any) {
        return this._setupBedService
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

    @Action(SetupBedActions.GetByIdBed)
    getByIdBed(ctx: StateContext<SetupBedStateModel>, actions: any) {
        return this._setupBedService
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

    @Action(SetupBedActions.CreateBed)
    createBed(ctx: StateContext<SetupBedStateModel>, actions: any) {
        return this._setupBedService
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
                        return ctx.dispatch(new SetupBedActions.GetAllBed(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupBedActions.UpdateBed)
    updateBed(ctx: StateContext<SetupBedStateModel>, actions: any) {
        return this._setupBedService
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
                        return ctx.dispatch(new SetupBedActions.GetAllBed(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupBedActions.UpdateStatusBed)
    updateStatusBed(ctx: StateContext<SetupBedStateModel>, actions: any) {
        return this._setupBedService
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
                        return ctx.dispatch(new SetupBedActions.GetAllBed(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupBedActions.DeleteBed)
    deleteBed(ctx: StateContext<SetupBedStateModel>, actions: any) {
        return this._setupBedService
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
                        return ctx.dispatch(new SetupBedActions.GetAllBed(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

}