import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-informasi-pasien',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TooltipModule,
    ],
    templateUrl: './informasi-pasien.component.html',
    styleUrl: './informasi-pasien.component.scss'
})
export class InformasiPasienComponent implements OnInit {

    Pasien: any;

    ToggleCard = true;

    ngOnInit(): void {
        this.Pasien = localStorage.getItem("_SPSH_") ? JSON.parse(localStorage.getItem("_SPSH_") as any) : null;
    }

    toggleCard() {
        this.ToggleCard = !this.ToggleCard;
        const el = document.getElementById('cardPasien') as HTMLElement;

        if (this.ToggleCard) {
            el.classList.remove("hidden");
            el.classList.add("flex");
        } else {
            el.classList.remove("flex");
            el.classList.add("hidden");
        }
    }
}
