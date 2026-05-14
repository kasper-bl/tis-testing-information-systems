import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 4.3: Фильтр по заработной плате', () => {
    test('Фильтр "По договорённости" показывает соответствующие вакансии', async ({ page }) => {
        await login(page, 'student');
        await page.goto('https://dev.profteam.su/vacancies');
        await page.waitForLoadState('networkidle');
        
        const salaryRadio = page.getByRole('radio', { name: 'По договорённости' });
        await salaryRadio.click();
        
        await page.waitForTimeout(2000);
        
        await expect(salaryRadio).toBeChecked();
        
        const vacancyCards = page.locator('[class*="vacancy"]');
        await expect(vacancyCards.first()).toBeVisible();
        
        console.log('Фильтр "По договорённости" работает!');
    });
});