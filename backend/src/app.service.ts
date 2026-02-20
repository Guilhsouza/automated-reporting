import 'dotenv/config'
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { chromium } from 'playwright';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }

  async requestLast30DaysReport() {

    const browser = await chromium.launch({
      headless: false,
      slowMo: 300,
    });

    let context;

    if (fs.existsSync('freshdesk-session.json')) {
      context = await browser.newContext({
        storageState: 'freshdesk-session.json',
        acceptDownloads: true,
      });
    } else {
      context = await browser.newContext({
        acceptDownloads: true,
      });
    }

    const page = await context.newPage();

    await page.goto(
      'https://granvale-team.myfreshworks.com/login',
      { waitUntil: 'domcontentloaded' }
    );

    await page.waitForTimeout(3000);

    const isOnLoginPage = await page.locator('input[type="email"]').isVisible().catch(() => false);

    if (isOnLoginPage) {
      const email = this.configService.getOrThrow<string>('FD_EMAIL');
      const senha = this.configService.getOrThrow<string>('FD_PASSWORD');

      await page.fill('input[type="email"]', email);
      await page.click('button[type="submit"]');

      await page.waitForSelector('input[type="password"]', { timeout: 30000 });
      await page.fill('input[type="password"]', senha);
      await page.click('button[type="submit"]');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(4000);
    }

    await page.goto(
      'https://granvale.freshdesk.com/a/tickets/filters/search?orderBy=created_at&orderType=desc&ref=on_hold',
      { waitUntil: 'domcontentloaded' }
    );

    await page.waitForTimeout(4000);

    await context.storageState({ path: 'freshdesk-session.json' });

    const exportButton = page.locator('[data-test-id="ticket-list-export"]');
    await exportButton.waitFor({ state: 'visible', timeout: 15000 });
    await exportButton.click();
    await page.waitForSelector('h4:has-text("Exportar tickets")');

    await page.waitForSelector('input[name="exportformat"][value="xls"]', {
      state: 'attached',
      timeout: 5000
    });

    await page.locator('input[name="exportformat"][value="xls"]').check({ force: true });

    await page.getByRole('button', { name: /Nos últimos/i }).click();
    await page.getByText('Nos últimos 30 dias', { exact: true }).click();

    await page.getByText('Selecionar todos os campos').click();

    const fieldsToUncheck = [
      'outbound_count',
      'ticket_tags',
      'updated_at',
      'inbound_count',
    ];

    for (const field of fieldsToUncheck) {

      const container = page.locator(`[data-test-id="${field}"]`);

      await container.scrollIntoViewIfNeeded();
      await container.waitFor({ state: 'visible' });

      const checkbox = container.locator('input[type="checkbox"]');

      if (await checkbox.isChecked()) {
        await checkbox.click({ force: true });
        await page.waitForTimeout(300);
        console.log(`❌ Desmarcado: ${field}`);
      }
    }

    await page.locator('[data-test-id="export"]').click();

    await page.waitForTimeout(5000);

    await browser.close();
  }
}
