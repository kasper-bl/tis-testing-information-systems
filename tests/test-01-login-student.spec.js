// tests/test-01-login-employer.spec.js
import { test, expect } from '@playwright/test';

test.describe('Тест 1: Логин работодателя', () => {
    test('Работодатель может войти в систему', async ({ page }) => {
        await page.goto('https://dev.profteam.su/login');
        await page.fill('input[autocomplete="username"]', 'testerEmployer');
        await page.fill('input[autocomplete="current-password"]', 'Password1');
        
        // Используем селектор, который точно найдет кнопку "Войти"
        await page.click('button:has-text("Войти")');
        
        // Ждем перехода (не таймаут, а ожидание ухода с логина)
        await page.waitForFunction(
            () => !window.location.href.includes('/login'),
            { timeout: 10000 }
        );
        
        expect(page.url()).not.toContain('/login');
        console.log('✅ Логин успешен! URL:', page.url());
    });
});