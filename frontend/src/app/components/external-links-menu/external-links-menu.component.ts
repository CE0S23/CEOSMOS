import { Component } from '@angular/core';

export interface ExternalLink {
    id: string;
    name: string;
    url: string;
    icon: string;
    description: string;
    category: 'music' | 'images' | 'productivity' | 'inspiration';
    color: string;
}

@Component({
    selector: 'app-external-links-menu',
    templateUrl: './external-links-menu.component.html',
    styleUrls: ['./external-links-menu.component.scss']
})
export class ExternalLinksMenuComponent {
    isPanelOpen = false;

    externalLinks: ExternalLink[] = [
        // Música
        {
            id: 'lofi-girl',
            name: 'Lofi Girl',
            url: 'https://www.youtube.com/c/LofiGirl',
            icon: 'music_note',
            description: 'Música lo-fi para concentración',
            category: 'music',
            color: '#ff6b6b'
        },
        {
            id: 'brain-fm',
            name: 'Brain.fm',
            url: 'https://www.brain.fm/',
            icon: 'psychology',
            description: 'Música diseñada para enfoque',
            category: 'music',
            color: '#4ecdc4'
        },
        {
            id: 'noisli',
            name: 'Noisli',
            url: 'https://www.noisli.com/',
            icon: 'waves',
            description: 'Sonidos ambientales personalizables',
            category: 'music',
            color: '#95e1d3'
        },

        // Imágenes
        {
            id: 'unsplash',
            name: 'Unsplash',
            url: 'https://unsplash.com/',
            icon: 'photo_camera',
            description: 'Fotografías de alta calidad',
            category: 'images',
            color: '#a8e6cf'
        },
        {
            id: 'pexels',
            name: 'Pexels',
            url: 'https://www.pexels.com/',
            icon: 'image',
            description: 'Imágenes y videos gratuitos',
            category: 'images',
            color: '#ffd93d'
        },
        {
            id: 'nasa-apod',
            name: 'NASA APOD',
            url: 'https://apod.nasa.gov/apod/',
            icon: 'rocket_launch',
            description: 'Imagen astronómica del día',
            category: 'images',
            color: '#6c5ce7'
        },

        // Productividad
        {
            id: 'pomodoro',
            name: 'Pomofocus',
            url: 'https://pomofocus.io/',
            icon: 'timer',
            description: 'Técnica Pomodoro online',
            category: 'productivity',
            color: '#ff7675'
        },
        {
            id: 'notion',
            name: 'Notion',
            url: 'https://www.notion.so/',
            icon: 'description',
            description: 'Espacio de trabajo todo-en-uno',
            category: 'productivity',
            color: '#74b9ff'
        },

        // Inspiración
        {
            id: 'deep-work',
            name: 'Deep Work (Cal Newport)',
            url: 'https://www.calnewport.com/books/deep-work/',
            icon: 'menu_book',
            description: 'Libro sobre trabajo profundo',
            category: 'inspiration',
            color: '#a29bfe'
        },
        {
            id: 'flow-state',
            name: 'Flow Research',
            url: 'https://www.flowresearchcollective.com/',
            icon: 'trending_up',
            description: 'Investigación sobre el estado de flujo',
            category: 'inspiration',
            color: '#fd79a8'
        }
    ];

    selectedCategory: string = 'all';

    get filteredLinks(): ExternalLink[] {
        if (this.selectedCategory === 'all') {
            return this.externalLinks;
        }
        return this.externalLinks.filter(link => link.category === this.selectedCategory);
    }

    getCategoryLinks(category: string): ExternalLink[] {
        return this.externalLinks.filter(link => link.category === category);
    }

    openLink(url: string): void {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    setCategory(category: string): void {
        this.selectedCategory = category;
    }

    togglePanel(): void {
        this.isPanelOpen = !this.isPanelOpen;
    }

    closePanel(): void {
        this.isPanelOpen = false;
    }
}
