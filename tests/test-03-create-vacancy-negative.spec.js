// tests/test-03-create-vacancy-negative.spec.js
import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 3: Создание вакансии (негативный)', () => {
    test('Нельзя создать вакансию с пустым названием', async ({ page }) => {
        await login(page, 'employer');
        await page.goto('https://dev.profteam.su/account/vacancies');
        await page.click('button:has-text("Создать вакансию")');
        await page.waitForSelector('h2:has-text("Создать вакансию")', { timeout: 5000 });
        
        // НЕ заполняем название (оставляем пустым)
        
        // Заполняем остальные поля
        await page.locator('text="Очный"').first().click();
        await page.locator('textarea[placeholder="Ваши требования"]').first().fill(
            'Опыт работы от 1 года\nЗнание Playwright'
        );
        await page.locator('textarea[placeholder="Обязанности сотрудника"]').first().fill(
            'Писать автотесты\nАнализировать результаты'
        );
        
        // Проверяем, что кнопка НЕ активна (остается disabled)
        const saveButton = page.getByRole('button', { name: 'Обновить вакансию' });
        await expect(saveButton).toBeDisabled({ timeout: 5000 });
        
        // Вариант 1: проверяем, что поле названия все еще видимо (форма не закрылась)
        const titleField = page.locator('input[placeholder="Кладовщик"]').first();
        await expect(titleField).toBeVisible();
        
        // Вариант 2: используем getByRole для заголовка (более надежно)
        await expect(page.getByRole('heading', { name: 'Создать вакансию' }).first()).toBeVisible();
        
        console.log('✅ Негативный тест пройден: нельзя создать вакансию с пустым названием');
    });
});