import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { UnitModel } from "src/app/model/pages/setup-data/unit.model";
import { SetupUnitService } from "src/app/services/pendaftaran-klinik/setup-data/setup-unit.service";
import { SetupUnitActions } from "./setup-unit.action";

interface SetupUnitStateModel {
    entities: UnitModel.IUnit[];
    actives?: UnitModel.IUnit[];
    single?: UnitModel.IUnit;
    query?: UnitModel.IUnitQueryParams;
    totalRows?: number;
    success?: boolean;
}

@State<SetupUnitStateModel>({
    name: 'setup_unit',
    defaults: {
        entities: [],
        actives: [],
        totalRows: 0,
        success: true
    }
})
@Injectable()
export class SetupUnitState {

    constructor(
        private _setupUnitService: SetupUnitService,
    ) { }

    @Selector()
    static unitState(state: SetupUnitStateModel) {
        return state;
    }

    @Selector()
    static unitEntities(state: SetupUnitStateModel) {
        return state.entities;
    }

    @Selector()
    static unitTotalRows(state: SetupUnitStateModel) {
        return state.totalRows;
    }

    @Selector()
    static unitActives(state: SetupUnitStateModel) {
        return state.actives;
    }

    @Action(SetupUnitActions.GetAllUnit)
    getAllUnit(ctx: StateContext<SetupUnitStateModel>, actions: any) {
        return this._setupUnitService
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

    @Action(SetupUnitActions.GetAllActiveUnit)
    getAllActiveKelas(ctx: StateContext<SetupUnitStateModel>, actions: any) {
        return this._setupUnitService
            .getAllActive(actions.payload)
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
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupUnitActions.GetAllUnit(state.query!));
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
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupUnitActions.GetAllUnit(state.query!));
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
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupUnitActions.GetAllUnit(state.query!));
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
                        const state = ctx.getState();
                        return ctx.dispatch(new SetupUnitActions.GetAllUnit(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

}