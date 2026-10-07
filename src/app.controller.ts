import { Controller, Get, Render } from '@nestjs/common';
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
            data: this.data.toSorted((a,b) => a.title.localeCompare(b.title))
        }
    }
}
