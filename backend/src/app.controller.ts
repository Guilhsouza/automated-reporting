import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios, { AxiosRequestConfig } from 'axios'
import qs from 'qs';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

interface AxiosCookiesConfig extends AxiosRequestConfig {
  jar: CookieJar
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  private jar = new CookieJar();

  private client = wrapper(axios.create({
    jar: this.jar,
    withCredentials: true
  }));

  @Post('login')
  async login() {
    const login = await this.client.post('http://192.168.1.75/checkLogin.cgi',
      qs.stringify({
        i0023: '1643',
        i0025: '1643'
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-unrlencoded"
        },
        withCredentials: true
      }
    )
    return login.data
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
