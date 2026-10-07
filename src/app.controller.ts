import { Body, Controller, Get, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service.js';

import DATA from '../public/wiki_articles.json' with {type: 'json'};

type ArticleView = typeof DATA[number];
type CreateArticleViewDTO = { [k in keyof ArticleView]?: string }

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

    @Get('new')
    @Render('new')
    getNew() {
        return {}

    }

    @Post('new')
    @Render('new')
    postNew(@Body() body: CreateArticleViewDTO) {
        const title = body.title ?? '';
        const url = body.url ?? '';
        const views = +(body.views ?? '');

        const errors = [!title && 'title too short'
            , !url.startsWith('https://') && 'url must start with "https://"'
            , Number.isNaN(views) && 'views is not a valid number']
            .filter(Boolean)
            .join('\n');

        const success = !errors;
        const message = success ? 'success' : errors;

        if (success) {
            this.data.push({ title, url, views });
            return { success, message };

        }
        else {
            return { titleValue: title, urlValue: url, viewsValue: body.views, success, message };

        }
    }
}
