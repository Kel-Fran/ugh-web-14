import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service.js';

import DATA from '../public/wiki_articles.json' with {type: 'json'};

type ArticleView = typeof DATA[number];

@Controller()
export class AppController {
    data: ArticleView[] = DATA;
    constructor(private readonly appService: AppService) { }

    @Get()
    @Render('home')
    getHello() {
        return {
            data: this.data.toSorted((a, b) => a.title.localeCompare(b.title))
        }
    }

    @Get('filter')
    @Render('filter')
    getFilter(@Query('minViews') minViews: string) {
        const n = +minViews;
        const min = Number.isNaN(n) ? 0 : n;
        return {
            data: this.data.filter(it => it.views >= min).toSorted((a, b) => b.views - a.views),
            value: min,

        }

    }
}
