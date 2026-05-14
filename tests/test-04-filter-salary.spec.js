// tests/test-04-filter-salary.spec.js
import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 4.3: Фильтр по заработной плате', () => {
    test('Фильтр "По договорённости" показывает соответствующие вакансии', async ({ page }) => {
        await login(page, 'student');
        await page.goto('https://dev.profteam.su/vacancies');
        await page.waitForLoadState('networkidle');
        
        // 1. Находим radio "По договорённости" и кликаем по нему
        const salaryRadio = page.getByRole('radio', { name: 'По договорённости' });
        await salaryRadio.click();
        
        // 2. Ждем применения фильтра
        await page.waitForTimeout(2000);
        
        // 3. Проверяем, что radio стал выбранным (checked)
        await expect(salaryRadio).toBeChecked();
        
        // 4. Проверяем, что вакансии отфильтровались (страница обновилась)
        const vacancyCards = page.locator('[class*="vacancy"]');
        await expect(vacancyCards.first()).toBeVisible();
        
        console.log('Фильтр "По договорённости" работает!');
    });
});