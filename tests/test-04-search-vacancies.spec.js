// tests/test-04-search-vacancies.spec.js
import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 4: Поиск вакансий', () => {
    test('Поиск показывает только вакансии с искомым словом', async ({ page }) => {
        // 1. Логинимся как студент
        await login(page, 'student');
        
        // 2. Переходим на публичную страницу вакансий (не личный кабинет!)
        await page.goto('https://dev.profteam.su/vacancies');
        
        // 3. Ждем полной загрузки страницы
        await page.waitForLoadState('networkidle');
        
        // 4. Проверяем, что мы действительно на странице вакансий (а не редиректнуло)
        await expect(page).toHaveURL(/\/vacancies/);
        
        // 5. Ждем появления поля поиска (из snapshot видно, что оно есть)
        // В snapshot поле имеет placeholder "Название..."
        const searchInput = page.locator('input[placeholder="Название..."]');
        await searchInput.waitFor({ state: 'visible', timeout: 10000 });
        
        // 6. Вводим поисковый запрос
        const searchTerm = 'Кладовщик';
        await searchInput.fill(searchTerm);
        
        // 7. Нажимаем кнопку поиска (лупа) или Enter
        const searchButton = page.locator('button[ref=e72]');
        if (await searchButton.isVisible()) {
            await searchButton.click();
        } else {
            await searchInput.press('Enter');
        }
        
        // 8. Ждем результаты поиска
        await page.waitForTimeout(2000);
        
        // 9. Проверяем, что в результатах есть вакансии с искомым словом
        const vacancyCards = page.locator('[class*="vacancy"]');
        await expect(vacancyCards.first()).toContainText(searchTerm);
        
        console.log(`Поиск по слову "${searchTerm}" работает!`);
    });
});