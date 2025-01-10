import { Component } from '@angular/core';
import { VpPlanProcedureComponent } from './vp-plan-procedure/vp-plan-procedure.component';

@Component({
    selector: 'app-vp-plan',
    standalone: true,
    imports: [
        VpPlanProcedureComponent,
    ],
    templateUrl: './vp-plan.component.html',
    styleUrl: './vp-plan.component.scss'
})
export class VpPlanComponent {

}
