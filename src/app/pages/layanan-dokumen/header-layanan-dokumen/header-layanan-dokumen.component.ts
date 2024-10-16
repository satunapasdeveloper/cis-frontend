import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
    selector: 'app-header-layanan-dokumen',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './header-layanan-dokumen.component.html',
    styleUrl: './header-layanan-dokumen.component.scss'
})
export class HeaderLayananDokumenComponent {

    UserData$ = this._authenticationService.getUserData();

    constructor(
        private _authenticationService: AuthenticationService,
    ) { }
}
