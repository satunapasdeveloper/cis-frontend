import { NgModule, ModuleWithProviders } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { environment } from "src/environments/environment";
import { SETUP_DATA_STATE } from "./setup-data";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { RekamMedisState } from "./rekam-medis";
import { BerandaState } from "./beranda";

const STATES = [
    ...SETUP_DATA_STATE,
    RekamMedisState,
    BerandaState
];

@NgModule({
    imports: [
        NgxsModule.forRoot([...STATES], {
            developmentMode: !environment.production,
        }),
        // NgxsLoggerPluginModule.forRoot(),
    ],
})
export class StateModule {
    static forRoot(): ModuleWithProviders<StateModule> {
        return {
            ngModule: StateModule,
        }
    }
}