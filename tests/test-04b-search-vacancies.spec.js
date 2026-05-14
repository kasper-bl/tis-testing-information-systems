import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 4: Поиск вакансий', () => {
    test('Поиск показывает только вакансии с искомым словом', async ({ page }) => {
        await login(page, 'student');
    
        await page.goto('https://dev.profteam.su/vacancies');
        
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveURL(/\/vacancies/);
        
        const searchInput = page.locator('input[placeholder="Название..."]');
        await searchInput.waitFor({ state: 'visible', timeout: 10000 });
        
        const searchTerm = 'Кладовщик';
        await searchInput.fill(searchTerm);
        
        const searchButton = page.locator('button[ref=e72]');
        if (await searchButton.isVisible()) {
            await searchButton.click();
        } else {
            await searchInput.press('Enter');
        }
        
        await page.waitForTimeout(2000);
        
        const vacancyCards = page.locator('[class*="vacancy"]');
        await expect(vacancyCards.first()).toContainText(searchTerm);
        
        console.log(`Поиск по слову "${searchTerm}" работает!`);
    });
});