// tests/test-05-full-respond-flow.spec.js
import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 5: Полный цикл создания и отклика на вакансию', () => {
    test('Работодатель создаёт вакансию, студент откликается', async ({ page }) => {
        const uniqueTitle = `Тестовая вакансия ${Date.now()}`;
        
        console.log(`📝 Уникальное название: ${uniqueTitle}`);
        
        // ========== ЧАСТЬ 1: Работодатель создаёт вакансию ==========
        await login(page, 'employer');
        await page.goto('https://dev.profteam.su/account/vacancies');
        
        // Создаём вакансию
        await page.click('button:has-text("Создать вакансию")');
        await page.waitForSelector('h2:has-text("Создать вакансию")', { timeout: 5000 });
        
        await page.locator('input[placeholder="Кладовщик"]').first().fill(uniqueTitle);
        await page.locator('textarea[placeholder="Ваши требования"]').first().fill('Тестовые требования');
        await page.locator('textarea[placeholder="Обязанности сотрудника"]').first().fill('Тестовые обязанности');
        
        await expect(page.getByRole('button', { name: 'Обновить вакансию' })).toBeEnabled({ timeout: 5000 });
        await page.click('button:has-text("Обновить вакансию")');
        
        await page.waitForTimeout(2000);
        
        // Закрываем форму
        const closeButton = page.locator('img[alt="close"], .modal-close');
        if (await closeButton.isVisible().catch(() => false)) {
            await closeButton.click();
            await page.waitForTimeout(1000);
        }
        
        // Публикуем вакансию
        const vacancyCard = page.locator(`h2:has-text("${uniqueTitle}")`).locator('..').locator('..');
        const publishButton = vacancyCard.locator('button:has-text("Опубликовать")');
        await publishButton.waitFor({ state: 'visible', timeout: 5000 });
        await publishButton.click();
        
        await page.waitForTimeout(2000);
        
        console.log(`✅ Вакансия "${uniqueTitle}" создана и опубликована`);
        
        // ========== ЧАСТЬ 2: Выход и вход студента ==========
        await page.click('button:has-text("Выйти")');
        await page.waitForTimeout(1000);
        
        await page.goto('https://dev.profteam.su/login');
        await page.fill('input[autocomplete="username"]', 'Sozpawka');
        await page.fill('input[autocomplete="current-password"]', 'Password1');
        await page.click('button:has-text("Войти")');
        await page.waitForURL('**/account/main**', { timeout: 10000 });
        
        console.log('✅ Вход выполнен как Sozpawka');
        
        // ========== ЧАСТЬ 3: Студент ищет и откликается ==========
        await page.goto('https://dev.profteam.su/vacancies');
        await page.waitForLoadState('networkidle');
        
        // Поиск вакансии
        const searchInput = page.locator('input[placeholder="Название..."]');
        await searchInput.fill(uniqueTitle);
        await searchInput.press('Enter');
        
        await page.waitForTimeout(2000);
        
        // Проверяем, что вакансия найдена
        await expect(page.locator(`h2:has-text("${uniqueTitle}")`)).toBeVisible({ timeout: 5000 });
        
        // Нажимаем "Откликнуться"
        const respondButton = page.locator('button:has-text("Откликнуться")').first();
        await respondButton.click();
        
        await page.waitForTimeout(2000);
        
        // Проверяем, что кнопка изменилась на "Вы уже откликнулись!" (отклик успешен)
        const successIndicator = page.locator('button:has-text("Вы уже откликнулись")');
        await expect(successIndicator).toBeVisible({ timeout: 5000 });
        
        console.log(`✅ Студент успешно откликнулся на вакансию "${uniqueTitle}"`);
    });
});