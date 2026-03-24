import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface InspirationQuote {
    id: string;
    text: string;
    author: string;
    category: 'focus' | 'creativity' | 'motivation';
}

export interface CosmosImage {
    id: string;
    url: string;
    title: string;
    category: 'space' | 'nature' | 'architecture' | 'art';
}

export interface MusicPlaylist {
    id: string;
    name: string;
    url: string;
    type: 'lofi' | 'alpha' | 'ambient';
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class InspirationService {

    private quotes: InspirationQuote[] = [
        {
            id: '1',
            text: 'El trabajo profundo es como un superpoder en nuestra economía cada vez más competitiva.',
            author: 'Cal Newport',
            category: 'focus'
        },
        {
            id: '2',
            text: 'La creatividad es la inteligencia divirtiéndose.',
            author: 'Albert Einstein',
            category: 'creativity'
        },
        {
            id: '3',
            text: 'El enfoque es la nueva moneda de la economía del conocimiento.',
            author: 'Nir Eyal',
            category: 'focus'
        },
        {
            id: '4',
            text: 'En el estado de flujo, el tiempo desaparece y solo existe el presente.',
            author: 'Mihaly Csikszentmihalyi',
            category: 'motivation'
        }
    ];

    private images: CosmosImage[] = [
        {
            id: '1',
            url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
            title: 'Vía Láctea',
            category: 'space'
        },
        {
            id: '2',
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
            title: 'Montañas Serenas',
            category: 'nature'
        },
        {
            id: '3',
            url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
            title: 'Tierra desde el Espacio',
            category: 'space'
        },
        {
            id: '4',
            url: 'https://images.unsplash.com/photo-1464802686167-b939a6910659',
            title: 'Aurora Boreal',
            category: 'space'
        },
        {
            id: '5',
            url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
            title: 'Bosque Tranquilo',
            category: 'nature'
        },
        {
            id: '6',
            url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
            title: 'Océano Cósmico',
            category: 'nature'
        },
        {
            id: '7',
            url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
            title: 'Arquitectura Moderna',
            category: 'architecture'
        },
        {
            id: '8',
            url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5',
            title: 'Diseño Minimalista',
            category: 'architecture'
        },
        {
            id: '9',
            url: 'https://images.unsplash.com/photo-1545127398-14699f92334b',
            title: 'Arte Abstracto',
            category: 'art'
        },
        {
            id: '10',
            url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
            title: 'Galaxia Espiral',
            category: 'space'
        },
        {
            id: '11',
            url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
            title: 'Lago Cristalino',
            category: 'nature'
        },
        {
            id: '12',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
            title: 'Arte Digital',
            category: 'art'
        }
    ];

    private playlists: MusicPlaylist[] = [
        {
            id: '1',
            name: 'Lofi Hip Hop Radio',
            url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
            type: 'lofi',
            description: 'Beats relajantes para estudiar y trabajar'
        },
        {
            id: '2',
            name: 'Alpha Waves Focus',
            url: 'https://www.youtube.com/watch?v=WPni755-Krg',
            type: 'alpha',
            description: 'Frecuencias alfa para concentración profunda'
        },
        {
            id: '3',
            name: 'Ambient Space Music',
            url: 'https://www.youtube.com/watch?v=1-RW82JF7EM',
            type: 'ambient',
            description: 'Música espacial ambiental'
        },
        {
            id: '4',
            name: 'Jazz para Estudiar',
            url: 'https://www.youtube.com/watch?v=Dx5qFachd3A',
            type: 'lofi',
            description: 'Música de jazz suave para concentración'
        },
        {
            id: '5',
            name: 'Deep Focus Mix',
            url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
            type: 'alpha',
            description: 'Ondas binaurales para trabajo profundo'
        },
        {
            id: '6',
            name: 'Cosmic Ambient',
            url: 'https://www.youtube.com/watch?v=mvvFMilNDfE',
            type: 'ambient',
            description: 'Sonidos del cosmos para relajación'
        },
        {
            id: '7',
            name: 'Lofi Beats - Tarde de Estudio',
            url: 'https://www.youtube.com/watch?v=lTRiuFIWV54',
            type: 'lofi',
            description: 'Ritmos lo-fi perfectos para estudiar'
        },
        {
            id: '8',
            name: 'Concentración Total',
            url: 'https://www.youtube.com/watch?v=kJF-O4_xwrg',
            type: 'alpha',
            description: 'Música diseñada para máxima concentración'
        },
        {
            id: '9',
            name: 'Sonidos de la Naturaleza',
            url: 'https://www.youtube.com/watch?v=eKFTSSKCzWA',
            type: 'ambient',
            description: 'Lluvia y sonidos naturales para meditar'
        }
    ];

    constructor() { }

    getRandomQuote(): Observable<InspirationQuote> {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        return of(this.quotes[randomIndex]);
    }

    getQuotesByCategory(category: string): Observable<InspirationQuote[]> {
        const filtered = this.quotes.filter(q => q.category === category);
        return of(filtered);
    }

    getImages(): Observable<CosmosImage[]> {
        return of(this.images);
    }

    getImagesByCategory(category: string): Observable<CosmosImage[]> {
        const filtered = this.images.filter(img => img.category === category);
        return of(filtered);
    }

    getPlaylists(): Observable<MusicPlaylist[]> {
        return of(this.playlists);
    }

    getPlaylistsByType(type: string): Observable<MusicPlaylist[]> {
        const filtered = this.playlists.filter(p => p.type === type);
        return of(filtered);
    }
}
