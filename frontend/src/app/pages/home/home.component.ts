import { Component, OnInit } from '@angular/core';
import { InspirationService, InspirationQuote } from '../../services/inspiration.service';
import { SearchResult } from '../../services/search.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    currentQuote?: InspirationQuote;
    selectedImage?: SearchResult;
    selectedMusic?: SearchResult;

    constructor(private inspirationService: InspirationService) { }

    ngOnInit(): void {
        this.loadRandomQuote();
    }

    loadRandomQuote(): void {
        this.inspirationService.getRandomQuote().subscribe(quote => {
            this.currentQuote = quote;
        });
    }

    onSearchResultSelected(result: SearchResult): void {
        if (result.type === 'image') {
            this.selectedImage = result;
            this.showImagePreview(result);
        } else if (result.type === 'music') {
            this.selectedMusic = result;
            this.playMusic(result);
        }
    }

    private showImagePreview(result: SearchResult): void {
        console.log('Imagen seleccionada:', result);
        // Aquí podrías abrir un modal, cambiar el fondo, etc.
        // Por ahora, abrimos en nueva pestaña
        window.open(result.url, '_blank');
    }

    private playMusic(result: SearchResult): void {
        console.log('Música seleccionada:', result);
        // Aquí podrías reproducir música en el player
        // Por ahora, abrimos en nueva pestaña
        window.open(result.url, '_blank');
    }
}
