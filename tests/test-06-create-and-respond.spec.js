import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 6: Подтверждение отклика работодателем', () => {
    test('Работодатель подтверждает отклик на вакансию во вкладке', async ({ page }) => {
        await login(page, 'employer');
        
        await page.goto('https://dev.profteam.su/account/responses');
        await page.waitForSelector('text=Отклики', { timeout: 10000 });
        
        await page.locator('text=На рассмотрении').click();
        await page.waitForTimeout(2000);
        
        await page.waitForSelector('.responses-list-item', { timeout: 10000 });
        
        const firstResponse = page.locator('.responses-list-item').first();
        await expect(firstResponse).toBeVisible({ timeout: 5000 });
        
        const vacancyTitle = await firstResponse.locator('.responses-list-item__title').textContent();
        console.log(`Подтверждаем отклик на вакансию: ${vacancyTitle}`);
        
        const confirmButton = firstResponse.locator('.responses-list-item__action').first();
        await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
        await confirmButton.click();
        
        await page.waitForTimeout(2000);
        
        console.log(`Работодатель подтвердил отклик на вакансию "${vacancyTitle}"`);
    });
});