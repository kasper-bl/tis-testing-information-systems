import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 8b: Отказ в вакансии (смена статуса)', () => {
    test('Работодатель меняет статус на "В вакансии отказано"', async ({ page }) => {
        await login(page, 'employer');
        
        await page.goto('https://dev.profteam.su/account/responses');
        await page.waitForSelector('text=Отклики', { timeout: 10000 });
        
        await page.locator('text=Одобрены').click();
        await page.waitForTimeout(2000);
        await page.waitForSelector('.responses-list-item', { timeout: 10000 });
        
        const firstResponse = page.locator('.responses-list-item').first();
        const vacancyTitle = await firstResponse.locator('.responses-list-item__title').textContent();

        const workspaceButton = firstResponse.locator('button:has-text("Рабочее пространство")');
        await workspaceButton.waitFor({ state: 'visible', timeout: 5000 });
        await workspaceButton.click();
        await page.waitForTimeout(2000);
        
        const rejectButton = page.locator('button:has-text("В вакансии отказано")');
        await rejectButton.waitFor({ state: 'visible', timeout: 5000 });
        await rejectButton.click();
        
        await page.waitForTimeout(2000);

        const successMessage = page.locator('text=В вакансии отказано');
        await expect(successMessage).toBeVisible({ timeout: 5000 });
        
        console.log(`Статус изменен на "В вакансии отказано" для вакансии "${vacancyTitle}"`);
    });
});