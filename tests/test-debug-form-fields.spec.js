// tests/test-debug-form-fields.spec.js
import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('Диагностика: анализ формы создания вакансии', () => {
    test('Показывает все поля и кнопки на форме', async ({ page }) => {
        // Логинимся
        await login(page, 'employer');
        
        // Переходим на страницу вакансий
        await page.goto('https://dev.profteam.su/account/vacancies');
        await page.waitForTimeout(2000);
        
        // Нажимаем кнопку "Создать вакансию"
        await page.click('button:has-text("Создать вакансию")');
        await page.waitForTimeout(2000);
        
        console.log('\n========== АНАЛИЗ ФОРМЫ ==========\n');
        
        // 1. Находим все input поля
        const inputs = await page.$$eval('input', elements =>
            elements.map(el => ({
                type: el.type,
                placeholder: el.placeholder,
                className: el.className,
                visible: el.offsetParent !== null,
                value: el.value
            }))
        );
        
        console.log('📝 INPUT поля:');
        inputs.forEach((input, i) => {
            console.log(`  ${i + 1}. type="${input.type}", placeholder="${input.placeholder}", visible=${input.visible}`);
        });
        
        // 2. Находим все textarea поля
        const textareas = await page.$$eval('textarea', elements =>
            elements.map(el => ({
                placeholder: el.placeholder,
                className: el.className,
                visible: el.offsetParent !== null,
                textContent: el.textContent
            }))
        );
        
        console.log('\n📝 TEXTAREA поля:');
        textareas.forEach((ta, i) => {
            console.log(`  ${i + 1}. placeholder="${ta.placeholder}", visible=${ta.visible}`);
        });
        
        // 3. Находим все кнопки
        const buttons = await page.$$eval('button', elements =>
            elements.map(el => ({
                text: el.textContent?.trim(),
                disabled: el.disabled,
                visible: el.offsetParent !== null,
                className: el.className
            }))
        );
        
        console.log('\n🔘 КНОПКИ:');
        buttons.forEach((btn, i) => {
            console.log(`  ${i + 1}. text="${btn.text}", disabled=${btn.disabled}, visible=${btn.visible}`);
        });
        
        // 4. Находим все radio элементы
        const radios = await page.$$eval('input[type="radio"]', elements =>
            elements.map(el => ({
                name: el.name,
                value: el.value,
                checked: el.checked,
                label: el.nextElementSibling?.textContent?.trim() || 'нет подписи',
                visible: el.offsetParent !== null
            }))
        );
        
        console.log('\n⚪ RADIO кнопки:');
        radios.forEach((radio, i) => {
            console.log(`  ${i + 1}. label="${radio.label}", checked=${radio.checked}, visible=${radio.visible}`);
        });
        
        // 5. Находим все select/dropdown
        const selects = await page.$$eval('select', elements =>
            elements.map(el => ({
                name: el.name,
                visible: el.offsetParent !== null,
                options: Array.from(el.options).map(opt => opt.text)
            }))
        );
        
        console.log('\n📋 SELECT/DROPDOWN:');
        selects.forEach((select, i) => {
            console.log(`  ${i + 1}. name="${select.name}", options=${select.options.join(', ')}`);
        });
        
        // 6. Ищем элементы с ролью textbox (Playwright way)
        const textboxes = await page.locator('role=textbox').all();
        console.log(`\n📌 Playwright textbox элементы (${textboxes.length} шт.):`);
        for (let i = 0; i < textboxes.length; i++) {
            const placeholder = await textboxes[i].getAttribute('placeholder');
            const isVisible = await textboxes[i].isVisible();
            console.log(`  ${i + 1}. placeholder="${placeholder}", visible=${isVisible}`);
        }
        
        // 7. Делаем скриншот формы
        await page.screenshot({ path: 'form-debug.png', fullPage: true });
        console.log('\n📸 Скриншот сохранен: form-debug.png');
        
        // 8. HTML формы (первые 2000 символов)
        const formHtml = await page.locator('h2:has-text("Создать вакансию")').locator('..').innerHTML();
        console.log('\n📄 HTML формы (первые 1000 символов):');
        console.log(formHtml.substring(0, 1000));
        
        console.log('\n========== КОНЕЦ ДИАГНОСТИКИ ==========\n');
        
        // Не закрываем сразу, чтобы можно было посмотреть
        await page.waitForTimeout(5000);
    });
});