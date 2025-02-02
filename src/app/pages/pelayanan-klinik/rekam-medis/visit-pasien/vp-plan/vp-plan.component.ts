import { Component } from '@angular/core';
import { VpPlanProcedureComponent } from './vp-plan-procedure/vp-plan-procedure.component';
import { VpPlanTindakanComponent } from './vp-plan-tindakan/vp-plan-tindakan.component';
import { VpPlanResepComponent } from './vp-plan-resep/vp-plan-resep.component';
import { VpPlanOrderLabComponent } from './vp-plan-order-lab/vp-plan-order-lab.component';
import { VpPlanOrderRadComponent } from './vp-plan-order-rad/vp-plan-order-rad.component';
import { VpPlanBmhpComponent } from './vp-plan-bmhp/vp-plan-bmhp.component';

@Component({
    selector: 'app-vp-plan',
    standalone: true,
    imports: [
        VpPlanBmhpComponent,
        VpPlanResepComponent,
        VpPlanTindakanComponent,
        VpPlanOrderLabComponent,
        VpPlanOrderRadComponent,
        VpPlanProcedureComponent,
    ],
    templateUrl: './vp-plan.component.html',
    styleUrl: './vp-plan.component.scss'
})
export class VpPlanComponent {

}
