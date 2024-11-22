import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { UnitModel } from "src/app/model/pages/setup-data/unit.model";
import { SetupUnitService } from "src/app/services/pendaftaran-klinik/setup-data/setup-unit.service";
import { SetupUnitActions } from "./setup-unit.action";

interface SetupUnitStateModel {
    entities: UnitModel.IUnit[];
    single?: UnitModel.IUnit;
    success?: boolean;
}

@State<SetupUnitStateModel>({
    name: 'setup_unit',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class SetupUnitState {

    constructor(
        private _setupUnitService: SetupUnitService,
    ) { }

    @Selector()
    static unitEntities(state: SetupUnitStateModel) {
        return state.entities;
    }

    @Action(SetupUnitActions.GetAllUnit)
    getAllUnit(ctx: StateContext<SetupUnitStateModel>) {
        return this._setupUnitService
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

    @Action(SetupUnitActions.GetByIdUnit)
    getByIdUnit(ctx: StateContext<SetupUnitStateModel>, actions: any) {
        return this._setupUnitService
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

    @Action(SetupUnitActions.CreateUnit)
    createUnit(ctx: StateContext<SetupUnitStateModel>, actions: any) {
        return this._setupUnitService
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
                        return ctx.dispatch(new SetupUnitActions.GetAllUnit());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupUnitActions.UpdateUnit)
    updateUnit(ctx: StateContext<SetupUnitStateModel>, actions: any) {
        return this._setupUnitService
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
                        return ctx.dispatch(new SetupUnitActions.GetAllUnit());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupUnitActions.UpdateStatusUnit)
    updateStatusUnit(ctx: StateContext<SetupUnitStateModel>, actions: any) {
        return this._setupUnitService
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
                        return ctx.dispatch(new SetupUnitActions.GetAllUnit());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupUnitActions.DeleteUnit)
    deleteUnit(ctx: StateContext<SetupUnitStateModel>, actions: any) {
        return this._setupUnitService
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
                        return ctx.dispatch(new SetupUnitActions.GetAllUnit());
                    } else {
                        return of([]);
                    }
                })
            )
    }

}