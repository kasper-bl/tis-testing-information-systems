// tests/test-02-create-vacancy-positive.spec.js
import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 2: Создание вакансии (позитивный)', () => {
    test('Работодатель может создать новую вакансию', async ({ page }) => {
        await login(page, 'employer');
        await page.goto('https://dev.profteam.su/account/vacancies');
        await page.click('button:has-text("Создать вакансию")');
        await page.waitForSelector('h2:has-text("Создать вакансию")', { timeout: 5000 });
        
        const uniqueTitle = `Тестовая вакансия ${Date.now()}`;
        
        // Название - первый input с нужным placeholder
        await page.locator('input[placeholder="Кладовщик"]').first().fill(uniqueTitle);
        
        // Тип занятости - кликаем по "Очный"
        await page.locator('text="Очный"').first().click();
        
        // Требования - первый textarea с нужным placeholder
        await page.locator('textarea[placeholder="Ваши требования"]').first().fill(
            'Опыт работы от 1 года\nЗнание Playwright'
        );
        
        // Обязанности - первый textarea с нужным placeholder
        await page.locator('textarea[placeholder="Обязанности сотрудника"]').first().fill(
            'Писать автотесты\nАнализировать результаты'
        );
        
        // Ждем активации кнопки
        await expect(page.getByRole('button', { name: 'Обновить вакансию' })).toBeEnabled({ timeout: 5000 });
        
        // Нажимаем кнопку
        await page.click('button:has-text("Обновить вакансию")');
        
        await page.waitForTimeout(2000);
        
        // Проверяем
        await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });
        
        console.log(`✅ Вакансия "${uniqueTitle}" успешно создана!`);
    });
});