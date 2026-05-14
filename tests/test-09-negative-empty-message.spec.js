import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 8: Негативный - отправка пустого сообщения', () => {
    test('negative: cannot send empty message', async ({ page }) => {
        await login(page, 'employer');
        
        await page.locator('.menu-item:has-text("Отклики")').click();
        await expect(page).toHaveURL(/.*responses/);
        
        const confirmIcon = page.locator('.responses-list-item__action svg').first();
        if (await confirmIcon.isVisible().catch(() => false)) {
            await confirmIcon.click();
        }
        
        await page.locator('text=Рабочее пространство').first().click();
        await expect(page).toHaveURL(/\/workspaces\/\d+/);
        
        const messagesBefore = await page.locator('.comment-item, .message-item').count();
        console.log(`Сообщений до отправки: ${messagesBefore}`);
        
        const sendButton = page.locator('.send-message-icon').first();
        await sendButton.click();
        
        await page.waitForTimeout(2000);
        
        const messagesAfter = await page.locator('.comment-item, .message-item').count();

        expect(messagesAfter).toBe(messagesBefore);
        
        console.log(`Пустое сообщение не отправилось - негативный тест пройден`);
    });
});