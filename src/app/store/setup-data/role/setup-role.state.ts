import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { RoleModel } from "src/app/model/pages/setup-data/role.model";
import { RoleService } from "src/app/services/pelayanan-klinik/setup-data/role.service";
import { SetupRoleActions } from "./setup-role.action";

interface SetupRoleStateModel {
    entities: RoleModel.IRole[];
    actives?: RoleModel.IRole[];
    single?: RoleModel.IRole;
    query?: RoleModel.IRoleQueryParams;
    totalRows?: number;
    success?: boolean;
}

@State<SetupRoleStateModel>({
    name: 'setup_role',
    defaults: {
        entities: [],
        actives: [],
        totalRows: 0,
        success: true
    }
})
@Injectable()
export class SetupRoleState {

    constructor(
        private _setupRoleService: RoleService,
    ) { }

    @Selector()
    static roleState(state: SetupRoleStateModel) {
        return state;
    }

    @Selector()
    static roleEntities(state: SetupRoleStateModel) {
        return state.entities;
    }

    @Selector()
    static roleTotalRows(state: SetupRoleStateModel) {
        return state.totalRows;
    }

    @Selector()
    static roleActives(state: SetupRoleStateModel) {
        return state.actives;
    }

    @Action(SetupRoleActions.GetAllRole)
    getAllRole(ctx: StateContext<SetupRoleStateModel>, actions: any) {
        return this._setupRoleService
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

    @Action(SetupRoleActions.GetAllActiveRole)
    getAllActiveRole(ctx: StateContext<SetupRoleStateModel>, actions: any) {
        return this._setupRoleService
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

    @Action(SetupRoleActions.GetByIdRole)
    getByIdRole(ctx: StateContext<SetupRoleStateModel>, actions: any) {
        return this._setupRoleService
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

    @Action(SetupRoleActions.CreateRole)
    createRole(ctx: StateContext<SetupRoleStateModel>, actions: any) {
        return this._setupRoleService
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
                        return ctx.dispatch(new SetupRoleActions.GetAllRole(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupRoleActions.UpdateRole)
    updateRole(ctx: StateContext<SetupRoleStateModel>, actions: any) {
        return this._setupRoleService
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
                        return ctx.dispatch(new SetupRoleActions.GetAllRole(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupRoleActions.UpdateStatusRole)
    updateStatusRole(ctx: StateContext<SetupRoleStateModel>, actions: any) {
        return this._setupRoleService
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
                        return ctx.dispatch(new SetupRoleActions.GetAllRole(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupRoleActions.DeleteRole)
    deleteRole(ctx: StateContext<SetupRoleStateModel>, actions: any) {
        return this._setupRoleService
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
                        return ctx.dispatch(new SetupRoleActions.GetAllRole(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

}