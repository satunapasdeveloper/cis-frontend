import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { ManajemenUserModel } from "src/app/model/pages/setup-data/manajemen-user.model";
import { ManajemenUserService } from "src/app/services/setup-data/manajemen-user.service";
import { ManajemenUserActions } from "./manajemen-user.action";

interface ManajemenUserStateModel {
    entities: ManajemenUserModel.IUser[];
    dokters?: ManajemenUserModel.IUser[] | any[];
    single?: ManajemenUserModel.IUser;
    success?: boolean;
}

@State<ManajemenUserStateModel>({
    name: 'manajemen_user',
    defaults: {
        entities: [],
        dokters: [],
        success: true
    }
})
@Injectable()
export class ManajemenUserState {

    constructor(
        private _manajemenUserService: ManajemenUserService,
    ) { }

    @Selector()
    static allUserEntities(state: ManajemenUserStateModel) {
        return state.entities;
    }

    @Selector()
    static userDokterEntities(state: ManajemenUserStateModel) {
        return state.dokters;
    }

    @Action(ManajemenUserActions.GetAllUser)
    getAllUser(ctx: StateContext<ManajemenUserStateModel>) {
        return this._manajemenUserService
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

    @Action(ManajemenUserActions.GetAllUserDokter)
    getAllDokter(ctx: StateContext<ManajemenUserStateModel>) {
        return this._manajemenUserService
            .getAllDokter()
            .pipe(
                tap((result: any) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        dokters: result,
                    });
                })
            )
    }

    @Action(ManajemenUserActions.GetByIdUser)
    getByIdUser(ctx: StateContext<ManajemenUserStateModel>, actions: any) {
        return this._manajemenUserService
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

    @Action(ManajemenUserActions.CreateUser)
    createUser(ctx: StateContext<ManajemenUserStateModel>, actions: any) {
        return this._manajemenUserService
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
                        return ctx.dispatch(new ManajemenUserActions.GetAllUser());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(ManajemenUserActions.UpdateUser)
    updateUser(ctx: StateContext<ManajemenUserStateModel>, actions: any) {
        return this._manajemenUserService
            .update(actions.uuid, actions.payload)
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
                        return ctx.dispatch(new ManajemenUserActions.GetAllUser());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(ManajemenUserActions.UpdateUserDokter)
    updateUserDokter(ctx: StateContext<ManajemenUserStateModel>, actions: any) {
        return this._manajemenUserService
            .updateDokter(actions.uuid, actions.payload)
            .pipe(
                tap((result) => {
                    console.log("result update dokter =>", result);

                    const state = ctx.getState();
                    if (result.responseResult) {
                        ctx.setState({
                            ...state,
                            dokters: result.data,
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
                        return ctx.dispatch(new ManajemenUserActions.GetAllUserDokter());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(ManajemenUserActions.UpdateStatusUser)
    updateStatusUser(ctx: StateContext<ManajemenUserStateModel>, actions: any) {
        return this._manajemenUserService
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
                        return ctx.dispatch(new ManajemenUserActions.GetAllUser());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(ManajemenUserActions.DeleteUser)
    deleteUser(ctx: StateContext<ManajemenUserStateModel>, actions: any) {
        return this._manajemenUserService
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
                        return ctx.dispatch(new ManajemenUserActions.GetAllUser());
                    } else {
                        return of([]);
                    }
                })
            )
    }

}