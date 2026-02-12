import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios, { AxiosRequestConfig } from 'axios'
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import qs from 'qs';
import * as cheerio from 'cheerio'

interface AxiosCookiesConfig extends AxiosRequestConfig {
  jar: CookieJar
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  private list: Object[] = [];
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
    this.list = []
    const collectInfo = await this.client.get('http://192.168.1.75/m_departmentid.html')
    const $ = cheerio.load(collectInfo.data)

    const tableInfo = $('.ItemListComponent tbody tr').each((index, element) => {
      const row = $(element, element)

      const tdRow = row.find('td')

      const id = $(tdRow[0]).text().trim()
      const quantity = $(tdRow[1]).text().trim()

      const list = {
        id: id,
        qtt: quantity
      }

      this.list.push(list)

    }).html()

    return this.list
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
