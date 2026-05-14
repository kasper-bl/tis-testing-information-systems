// tests/test-07b-reject-status.spec.js
import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 7b: Отказ в вакансии (смена статуса)', () => {
    test('Работодатель меняет статус на "В вакансии отказано"', async ({ page }) => {
        // ========== Вход как работодатель ==========
        await login(page, 'employer');
        
        // Переходим на страницу откликов
        await page.goto('https://dev.profteam.su/account/responses');
        await page.waitForSelector('text=Отклики', { timeout: 10000 });
        
        // Переход в "Одобрены"
        await page.locator('text=Одобрены').click();
        await page.waitForTimeout(2000);
        await page.waitForSelector('.responses-list-item', { timeout: 10000 });
        
        // Берем первую одобренную вакансию
        const firstResponse = page.locator('.responses-list-item').first();
        const vacancyTitle = await firstResponse.locator('.responses-list-item__title').textContent();
        console.log(`📝 Работаем с вакансией: ${vacancyTitle}`);
        
        // Открываем рабочее пространство
        const workspaceButton = firstResponse.locator('button:has-text("Рабочее пространство")');
        await workspaceButton.waitFor({ state: 'visible', timeout: 5000 });
        await workspaceButton.click();
        await page.waitForTimeout(2000);
        
        // ========== КЛИК ПО КНОПКЕ "В вакансии отказано" ==========
        const rejectButton = page.locator('button:has-text("В вакансии отказано")');
        await rejectButton.waitFor({ state: 'visible', timeout: 5000 });
        await rejectButton.click();
        
        await page.waitForTimeout(2000);
        
        // ========== ПРОВЕРКА: надпись "В вакансии отказано" ==========
        const successMessage = page.locator('text=В вакансии отказано');
        await expect(successMessage).toBeVisible({ timeout: 5000 });
        
        console.log(`✅ Статус изменен на "В вакансии отказано" для вакансии "${vacancyTitle}"`);
    });
});