import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 3: Создание вакансии (негативный)', () => {
    test('Нельзя создать вакансию с пустым названием', async ({ page }) => {
        await login(page, 'employer');
        await page.goto('https://dev.profteam.su/account/vacancies');
        await page.click('button:has-text("Создать вакансию")');
        await page.waitForSelector('h2:has-text("Создать вакансию")', { timeout: 5000 });
        
        await page.locator('text="Очный"').first().click();
        await page.locator('textarea[placeholder="Ваши требования"]').first().fill(
            'Опыт работы от 1 года'
        );
        await page.locator('textarea[placeholder="Обязанности сотрудника"]').first().fill(
            'Писать автотесты'
        );
        
        const saveButton = page.getByRole('button', { name: 'Обновить вакансию' });
        await expect(saveButton).toBeDisabled({ timeout: 5000 });
        
        const titleField = page.locator('input[placeholder="Кладовщик"]').first();
        await expect(titleField).toBeVisible();
        
        await expect(page.getByRole('heading', { name: 'Создать вакансию' }).first()).toBeVisible();
        
        console.log('Негативный тест пройден: нельзя создать вакансию с пустым названием');
    });
});