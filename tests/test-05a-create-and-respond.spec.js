// tests/test-05b-confirm-response.spec.js
import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 5b: Подтверждение отклика работодателем', () => {
    test('Работодатель подтверждает отклик на вакансию во вкладке "На рассмотрении"', async ({ page }) => {
        // ========== Вход как работодатель ==========
        await login(page, 'employer');
        
        // Переходим на страницу откликов
        await page.goto('https://dev.profteam.su/account/responses');
        await page.waitForSelector('text=Отклики', { timeout: 10000 });
        
        // ========== Переход на вкладку "На рассмотрении" ==========
        await page.locator('text=На рассмотрении').click();
        await page.waitForTimeout(2000);
        
        // Ждем появления карточек откликов
        await page.waitForSelector('.responses-list-item', { timeout: 10000 });
        
        // ========== Берем ПЕРВЫЙ отклик в списке ==========
        const firstResponse = page.locator('.responses-list-item').first();
        await expect(firstResponse).toBeVisible({ timeout: 5000 });
        
        // Запоминаем название вакансии (для отчета)
        const vacancyTitle = await firstResponse.locator('.responses-list-item__title').textContent();
        console.log(`📝 Подтверждаем отклик на вакансию: ${vacancyTitle}`);
        
        // ========== КЛИК ПО ПЕРВОЙ ИКОНКЕ ACTION (зеленая галочка - ПОДТВЕРЖДЕНИЕ) ==========
        // Берем первый блок с классом responses-list-item__action
        const confirmButton = firstResponse.locator('.responses-list-item__action').first();
        await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
        await confirmButton.click();
        
        await page.waitForTimeout(2000);
        
        console.log(`✅ Работодатель подтвердил отклик на вакансию "${vacancyTitle}"`);
    });
});