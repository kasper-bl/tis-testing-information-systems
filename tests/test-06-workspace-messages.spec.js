// tests/test-06-workspace-messages.spec.js
import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Тест 6: Сообщения в рабочем пространстве', () => {
    test('Работодатель и студент обмениваются сообщениями', async ({ page }) => {
        // ========== ЧАСТЬ 1: Работодатель отправляет сообщение ==========
        await login(page, 'employer');
        await page.goto('https://dev.profteam.su/account/responses');
        await page.waitForSelector('text=Отклики', { timeout: 10000 });
        
        // Переход в "Одобрены"
        await page.locator('text=Одобрены').click();
        await page.waitForTimeout(2000);
        await page.waitForSelector('.responses-list-item', { timeout: 10000 });
        
        const firstResponse = page.locator('.responses-list-item').first();
        const vacancyTitle = await firstResponse.locator('.responses-list-item__title').textContent();
        console.log(`📝 Работаем с вакансией: ${vacancyTitle}`);
        
        // Открываем рабочее пространство
        const workspaceButton = firstResponse.locator('button:has-text("Рабочее пространство")');
        await workspaceButton.waitFor({ state: 'visible', timeout: 5000 });
        await workspaceButton.click();
        await page.waitForTimeout(2000);
        
        // Отправляем сообщение от работодателя
        const messageInput = page.locator('textarea, input[type="text"]').first();
        await messageInput.waitFor({ state: 'visible', timeout: 5000 });
        
        const employerMessage = 'Господи работай';
        await messageInput.fill(employerMessage);
        await messageInput.press('Enter');
        
        await page.waitForTimeout(2000);
        console.log(`✅ Работодатель отправил сообщение: "${employerMessage}"`);
        
        // ========== ЧАСТЬ 2: Выход и вход студента ==========
        await page.click('button:has-text("Выйти")');
        await page.waitForTimeout(1000);
        
        await page.goto('https://dev.profteam.su/login');
        await page.fill('input[autocomplete="username"]', 'Sozpawka');
        await page.fill('input[autocomplete="current-password"]', 'Password1');
        await page.click('button:has-text("Войти")');
        await page.waitForURL('**/account/main**', { timeout: 10000 });
        console.log('✅ Вход выполнен как Sozpawka');
        
        // ========== ЧАСТЬ 3: Студент заходит в то же рабочее пространство ==========
        await page.goto('https://dev.profteam.su/account/responses');
        await page.waitForSelector('text=Отклики', { timeout: 10000 });
        
        // Переход в "Одобрены"
        await page.locator('text=Одобрены').click();
        await page.waitForTimeout(2000);
        await page.waitForSelector('.responses-list-item', { timeout: 10000 });
        
        // Находим ту же вакансию по названию
        const studentResponse = page.locator(`.responses-list-item:has-text("${vacancyTitle}")`).first();
        await expect(studentResponse).toBeVisible({ timeout: 5000 });
        
        // Открываем рабочее пространство
        const studentWorkspaceButton = studentResponse.locator('button:has-text("Рабочее пространство")');
        await studentWorkspaceButton.waitFor({ state: 'visible', timeout: 5000 });
        await studentWorkspaceButton.click();
        await page.waitForTimeout(2000);
        
        // ========== ЧАСТЬ 4: Студент отправляет ответное сообщение ==========
        const studentMessageInput = page.locator('textarea, input[type="text"]').first();
        await studentMessageInput.waitFor({ state: 'visible', timeout: 5000 });
        
        const studentMessage = 'Работает';
        await studentMessageInput.fill(studentMessage);
        await studentMessageInput.press('Enter');
        
        await page.waitForTimeout(2000);
        console.log(`✅ Студент отправил сообщение: "${studentMessage}"`);
        
        const messages = await page.locator(`text=${studentMessage}`).count();
        if (messages > 0) {
            console.log(`✅ Сообщение "${studentMessage}" отображается в чате`);
        }
        
        console.log(`✅✅✅ Тест завершен! Сообщения отправлены в рабочем пространстве вакансии "${vacancyTitle}"`);
    });
});