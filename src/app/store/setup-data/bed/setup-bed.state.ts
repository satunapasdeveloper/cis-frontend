import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { BedModel } from "src/app/model/pages/setup-data/bed.model";
import { BedService } from "src/app/services/pelayanan-klinik/setup-data/bed.service";
import { SetupBedActions } from "./setup-bed.action";

interface SetupBedStateModel {
    entities: BedModel.IBed[];
    single?: BedModel.IBed;
    success?: boolean;
}

@State<SetupBedStateModel>({
    name: 'setup_bed',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class SetupBedState {

    constructor(
        private _setupBedService: BedService,
    ) { }

    @Selector()
    static bedEntities(state: SetupBedStateModel) {
        return state.entities;
    }

    @Action(SetupBedActions.GetAllBed)
    getAllBed(ctx: StateContext<SetupBedStateModel>) {
        return this._setupBedService
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
                        return ctx.dispatch(new SetupBedActions.GetAllBed());
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
                        return ctx.dispatch(new SetupBedActions.GetAllBed());
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
                        return ctx.dispatch(new SetupBedActions.GetAllBed());
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
                        return ctx.dispatch(new SetupBedActions.GetAllBed());
                    } else {
                        return of([]);
                    }
                })
            )
    }

}