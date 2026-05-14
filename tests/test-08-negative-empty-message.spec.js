// tests/test-08-negative-empty-message.spec.js
import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 8: Негативный - отправка пустого сообщения', () => {
    test('negative: cannot send empty message', async ({ page }) => {
        // ========== Вход как работодатель ==========
        await login(page, 'employer');
        
        // Переход в "Отклики"
        await page.locator('.menu-item:has-text("Отклики")').click();
        await expect(page).toHaveURL(/.*responses/);
        
        // Если есть иконка подтверждения - кликаем (для перехода в рабочее пространство)
        const confirmIcon = page.locator('.responses-list-item__action svg').first();
        if (await confirmIcon.isVisible().catch(() => false)) {
            await confirmIcon.click();
        }
        
        // Открываем рабочее пространство
        await page.locator('text=Рабочее пространство').first().click();
        await expect(page).toHaveURL(/\/workspaces\/\d+/);
        
        // Считаем сообщения до отправки
        const messagesBefore = await page.locator('.comment-item, .message-item').count();
        console.log(`📝 Сообщений до отправки: ${messagesBefore}`);
        
        // Нажимаем кнопку отправки (без ввода текста!)
        const sendButton = page.locator('.send-message-icon').first();
        await sendButton.click();
        
        await page.waitForTimeout(2000);
        
        // Считаем сообщения после отправки
        const messagesAfter = await page.locator('.comment-item, .message-item').count();
        console.log(`📝 Сообщений после отправки: ${messagesAfter}`);
        
        // Проверяем, что количество сообщений не изменилось (пустое сообщение не отправилось)
        expect(messagesAfter).toBe(messagesBefore);
        
        console.log(`✅ Пустое сообщение не отправилось - негативный тест пройден`);
    });
});