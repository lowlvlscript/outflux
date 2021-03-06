import 'module-alias/register';
import { INFLUX } from '@root/config';
import { resolve } from 'path';
import puppeteer from 'puppeteer';

void (async () => {
	const browser = await puppeteer.launch({
		timeout: 0,
		dumpio: true,
		defaultViewport: {
			width: 1920,
			height: 1080
		}
	});
	const page = await browser.newPage();
	page.setDefaultNavigationTimeout(1200000);
	page.setDefaultTimeout(1200000);

	await page.goto(INFLUX.BASE_URL, { waitUntil: 'networkidle2' });

	await page.type('[name=username]', INFLUX.INFLUX_LOGIN_USERNAME);
	await page.type('[name=password]', INFLUX.INFLUX_LOGIN_PASSWORD);
	await page.click('.cf-button-primary');

	await page.waitForNavigation({
		waitUntil: ['load', 'domcontentloaded', 'networkidle2']
	});

	await page.goto(`${INFLUX.BASE_URL}/orgs/${INFLUX.ORG_ID}/dashboards/06009f370a5b0000`, { waitUntil: 'networkidle2' });
	await page.click('[data-testid=presentation-mode-toggle]');

	await page.waitFor(10000);

	await page.screenshot({ path: resolve(__dirname, '..', '..', '..', 'assets', 'heh.png') });

	await browser.close();
})();
