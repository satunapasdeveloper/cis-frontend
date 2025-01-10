import { Component } from '@angular/core';
import { VpPlanProcedureComponent } from './vp-plan-procedure/vp-plan-procedure.component';
import { VpPlanTindakanComponent } from './vp-plan-tindakan/vp-plan-tindakan.component';

@Component({
    selector: 'app-vp-plan',
    standalone: true,
    imports: [
        VpPlanProcedureComponent,
        VpPlanTindakanComponent,
    ],
    templateUrl: './vp-plan.component.html',
    styleUrl: './vp-plan.component.scss'
})
export class VpPlanComponent {

}
