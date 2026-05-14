import { test, expect } from '@playwright/test';

test.describe('Тест 10: Негативный - логин с пустым паролем', () => {
    test('Нельзя войти с пустым паролем - кнопка неактивна', async ({ page }) => {
        await page.goto('https://dev.profteam.su/login');
        await page.fill('input[autocomplete="username"]', 'testerEmployer');
        await page.fill('input[autocomplete="current-password"]', '');
        
        const loginButton = page.locator('button:has-text("Войти")');
        await expect(loginButton).toBeDisabled();

        expect(page.url()).toContain('/login');
        
        console.log('Негативный тест пройден: кнопка неактивна при пустом пароле');
    });
});