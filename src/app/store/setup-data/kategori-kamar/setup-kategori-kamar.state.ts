import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, switchMap, tap } from "rxjs";
import { KategoriKamarModel } from "src/app/model/pages/setup-data/kategori-kamar.model";
import { SetupKategoriKamarService } from "src/app/services/pelayanan-klinik/setup-data/setup-kategori-kamar.service";
import { SetupKategoriKamarActions } from "./setup-kategori-kamar.action";

interface SetupKategoriKamarStateModel {
    entities: KategoriKamarModel.IKategoriKamar[];
    actives?: KategoriKamarModel.IKategoriKamar[];
    single?: KategoriKamarModel.IKategoriKamar;
    query?: KategoriKamarModel.IKategoriKamarQueryParams;
    totalRows?: number;
    success?: boolean;
}

@State<SetupKategoriKamarStateModel>({
    name: 'setup_kategori_kamar',
    defaults: {
        entities: [],
        actives: [],
        totalRows: 0,
        success: true
    }
})
@Injectable()
export class SetupKategoriKamarState {

    constructor(
        private _setupKategoriKamarService: SetupKategoriKamarService,
    ) { }

    @Selector()
    static kategoriKamarState(state: SetupKategoriKamarStateModel) {
        return state;
    }

    @Selector()
    static kategoriKamarEntities(state: SetupKategoriKamarStateModel) {
        return state.entities;
    }

    @Selector()
    static kategoriKamarTotalRows(state: SetupKategoriKamarStateModel) {
        return state.totalRows;
    }

    @Selector()
    static kategoriKamarActives(state: SetupKategoriKamarStateModel) {
        return state.actives;
    }

    @Action(SetupKategoriKamarActions.GetAllKategoriKamar)
    getAllKategoriKamar(ctx: StateContext<SetupKategoriKamarStateModel>, actions: any) {
        return this._setupKategoriKamarService
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

    @Action(SetupKategoriKamarActions.GetAllActiveKategoriKamar)
    getAllActiveKategoriKamar(ctx: StateContext<SetupKategoriKamarStateModel>, actions: any) {
        return this._setupKategoriKamarService
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

    @Action(SetupKategoriKamarActions.GetByIdKategoriKamar)
    getByIdKategoriKamar(ctx: StateContext<SetupKategoriKamarStateModel>, actions: any) {
        return this._setupKategoriKamarService
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

    @Action(SetupKategoriKamarActions.CreateKategoriKamar)
    createKategoriKamar(ctx: StateContext<SetupKategoriKamarStateModel>, actions: any) {
        return this._setupKategoriKamarService
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
                        return ctx.dispatch(new SetupKategoriKamarActions.GetAllKategoriKamar(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupKategoriKamarActions.UpdateKategoriKamar)
    updateKategoriKamar(ctx: StateContext<SetupKategoriKamarStateModel>, actions: any) {
        return this._setupKategoriKamarService
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
                        return ctx.dispatch(new SetupKategoriKamarActions.GetAllKategoriKamar(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupKategoriKamarActions.UpdateStatusKategoriKamar)
    updateStatusKategoriKamar(ctx: StateContext<SetupKategoriKamarStateModel>, actions: any) {
        return this._setupKategoriKamarService
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
                        return ctx.dispatch(new SetupKategoriKamarActions.GetAllKategoriKamar(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

    @Action(SetupKategoriKamarActions.DeleteKategoriKamar)
    deleteKategoriKamar(ctx: StateContext<SetupKategoriKamarStateModel>, actions: any) {
        return this._setupKategoriKamarService
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
                        return ctx.dispatch(new SetupKategoriKamarActions.GetAllKategoriKamar(state.query!));
                    } else {
                        return of([]);
                    }
                })
            )
    }

}