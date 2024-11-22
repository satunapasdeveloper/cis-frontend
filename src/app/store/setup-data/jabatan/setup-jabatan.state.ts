import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { JabatanModel } from "src/app/model/pages/setup-data/jabatan.model";
import { JabatanService } from "src/app/services/pelayanan-klinik/setup-data/jabatan.service";
import { SetupJabatanActions } from "./setup-jabatan.action";

interface SetupJabatanStateModel {
    entities: JabatanModel.IJabatan[];
    single?: JabatanModel.IJabatan;
    success?: boolean;
}

@State<SetupJabatanStateModel>({
    name: 'setup_jabatan',
    defaults: {
        entities: [],
        success: true
    }
})
@Injectable()
export class SetupJabatanState {

    constructor(
        private _setupJabatanService: JabatanService,
    ) { }

    @Selector()
    static jabatanEntities(state: SetupJabatanStateModel) {
        return state.entities;
    }

    @Action(SetupJabatanActions.GetAllJabatan)
    getAllJabatan(ctx: StateContext<SetupJabatanStateModel>) {
        return this._setupJabatanService
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

    @Action(SetupJabatanActions.GetByIdJabatan)
    getByIdJabatan(ctx: StateContext<SetupJabatanStateModel>, actions: any) {
        return this._setupJabatanService
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

    @Action(SetupJabatanActions.CreateJabatan)
    createJabatan(ctx: StateContext<SetupJabatanStateModel>, actions: any) {
        return this._setupJabatanService
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
                        return ctx.dispatch(new SetupJabatanActions.GetAllJabatan());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupJabatanActions.UpdateJabatan)
    updateJabatan(ctx: StateContext<SetupJabatanStateModel>, actions: any) {
        return this._setupJabatanService
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
                        return ctx.dispatch(new SetupJabatanActions.GetAllJabatan());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupJabatanActions.UpdateStatusJabatan)
    updateStatusJabatan(ctx: StateContext<SetupJabatanStateModel>, actions: any) {
        return this._setupJabatanService
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
                        return ctx.dispatch(new SetupJabatanActions.GetAllJabatan());
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupJabatanActions.DeleteJabatan)
    deleteJabatan(ctx: StateContext<SetupJabatanStateModel>, actions: any) {
        return this._setupJabatanService
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
                        return ctx.dispatch(new SetupJabatanActions.GetAllJabatan());
                    } else {
                        return of([]);
                    }
                })
            )
    }

}