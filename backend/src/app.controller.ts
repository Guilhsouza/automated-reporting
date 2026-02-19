import { Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import axios, { AxiosRequestConfig } from 'axios'
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import express from 'express';
import qs from 'qs';
import * as cheerio from 'cheerio'
import XLSX from 'xlsx';

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

  @Post('loginAndGetData')
  async login(@Res() res: express.Response) {
    const login = await this.client.post('http://192.168.1.75/checkLogin.cgi',
      qs.stringify({
        i0023: '1643',
        i0025: '1643'
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        withCredentials: true
      }
    )
    this.list = []
    const collectInfo = await this.client.get('http://192.168.1.75/m_departmentid.html')
    const $ = cheerio.load(collectInfo.data)

    $('.ItemListComponent tbody tr').each((index, element) => {
      const row = $(element)

      const tdRow = row.find('td')

      const id = $(tdRow[0]).text().trim()
      const quantity = $(tdRow[1]).text().trim()

      const list = {
        id: id,
        qtt: quantity
      }

      this.list.push(list)

    })

    const worksheet = XLSX.utils.json_to_sheet(this.list)

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório de impressão')

    XLSX.utils.sheet_add_aoa(worksheet, [["Centro de custo", "Quantidade"]], { origin: 'A1' })

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=relatorio.xlsx'
    )

    res.send(buffer)
  }

  @Post('reportingFreshdesk')
  async reportingFreshdesk() {
    await this.appService.requestLast30DaysReport();
    return { message: 'Relatório solicitado. Verifique seu email.' };
  }
}
