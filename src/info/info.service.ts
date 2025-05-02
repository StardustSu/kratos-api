/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';

@Injectable()
export class InfoService {

    private currentOnline = 0;

    public getCurrentOnline() {
        return this.currentOnline;
    }

    public setCurrentOnline(value: number) {
        this.currentOnline = value;
    }

}
