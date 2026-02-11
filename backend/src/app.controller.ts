import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios, { AxiosResponse } from 'axios'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('login')
  async login() {
    const login = await axios.post('http://192.168.1.75/checkLogin.cgi',
      {
        i0023: '1643',
        i0025: '1643'
      }
    )
    return login.data
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
