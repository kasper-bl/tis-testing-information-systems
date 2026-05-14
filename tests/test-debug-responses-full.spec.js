// tests/test-debug-responses-full.spec.js
import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('ПОЛНАЯ ДИАГНОСТИКА страницы откликов', () => {
    test('Показывает ВСЕ элементы и их атрибуты', async ({ page }) => {
        // Логинимся как работодатель
        await login(page, 'employer');
        
        // Переходим на страницу откликов
        await page.goto('https://dev.profteam.su/account/responses');
        await page.waitForTimeout(3000);
        
        console.log('\n' + '='.repeat(60));
        console.log('ПОЛНАЯ ДИАГНОСТИКА СТРАНИЦЫ ОТКЛИКОВ');
        console.log('='.repeat(60));
        console.log('URL:', page.url());
        
        // ============================================================
        // 1. ВСЕ ВКЛАДКИ
        // ============================================================
        console.log('\n📑 ВКЛАДКИ:');
        const tabs = await page.$$eval('[class*="tab"], [class*="navigation"] [class*="item"]', 
            elements => elements.map(el => ({
                text: el.textContent?.trim(),
                className: el.className,
                visible: el.offsetParent !== null
            }))
        );
        tabs.forEach((tab, i) => {
            if (tab.visible && tab.text) {
                console.log(`  ${i + 1}. "${tab.text}" | class: ${tab.className}`);
            }
        });
        
        // ============================================================
        // 2. ВСЕ КАРТОЧКИ (article) и их содержимое
        // ============================================================
        console.log('\n📇 КАРТОЧКИ ОТКЛИКОВ:');
        const articles = await page.$$eval('article', elements => 
            elements.map((el, idx) => ({
                index: idx,
                fullText: el.textContent?.trim().substring(0, 300),
                innerHTML: el.innerHTML.substring(0, 500),
                className: el.className
            }))
        );
        
        console.log(`Найдено карточек: ${articles.length}`);
        articles.forEach((article, i) => {
            console.log(`\n--- КАРТОЧКА ${i + 1} ---`);
            console.log(`Текст: ${article.fullText}`);
            console.log(`HTML (первые 300 символов): ${article.innerHTML.substring(0, 300)}`);
        });
        
        // ============================================================
        // 3. ВСЕ ЭЛЕМЕНТЫ В КАРТОЧКЕ (по типам)
        // ============================================================
        console.log('\n🔍 ДЕТАЛЬНЫЙ АНАЛИЗ ПЕРВОЙ КАРТОЧКИ:');
        
        const firstCard = page.locator('article').first();
        
        // Все img
        const imgs = await firstCard.$$eval('img', elements =>
            elements.map(el => ({
                src: el.src,
                alt: el.alt,
                className: el.className,
                visible: el.offsetParent !== null
            }))
        );
        console.log(`\n🖼️ IMG (${imgs.length} шт.):`);
        imgs.forEach((img, i) => {
            console.log(`  ${i + 1}. src: "${img.src?.split('/').pop()}", alt: "${img.alt}", visible: ${img.visible}`);
        });
        
        // Все svg
        const svgs = await firstCard.$$eval('svg', elements =>
            elements.map(el => ({
                viewBox: el.getAttribute('viewBox'),
                className: el.className,
                parentClass: el.parentElement?.className,
                visible: el.offsetParent !== null
            }))
        );
        console.log(`\n🎨 SVG (${svgs.length} шт.):`);
        svgs.forEach((svg, i) => {
            console.log(`  ${i + 1}. viewBox: "${svg.viewBox}", class: "${svg.className}", parent: "${svg.parentClass}"`);
        });
        
        // Все div с классом base-icon
        const baseIcons = await firstCard.$$eval('.base-icon', elements =>
            elements.map(el => ({
                className: el.className,
                innerHTML: el.innerHTML.substring(0, 200),
                visible: el.offsetParent !== null
            }))
        );
        console.log(`\n🔘 BASE-ICON (${baseIcons.length} шт.):`);
        baseIcons.forEach((icon, i) => {
            console.log(`  ${i + 1}. class: "${icon.className}"`);
            console.log(`     inner: ${icon.innerHTML}`);
        });
        
        // Все кнопки
        const buttons = await firstCard.$$eval('button', elements =>
            elements.map(el => ({
                text: el.textContent?.trim(),
                disabled: el.disabled,
                className: el.className,
                visible: el.offsetParent !== null
            }))
        );
        console.log(`\n🔘 BUTTONS (${buttons.length} шт.):`);
        buttons.forEach((btn, i) => {
            console.log(`  ${i + 1}. text: "${btn.text}", disabled: ${btn.disabled}, visible: ${btn.visible}`);
        });
        
        // ============================================================
        // 4. БЛОК ДЕЙСТВИЙ (последний элемент в карточке)
        // ============================================================
        console.log('\n⚡ БЛОК ДЕЙСТВИЙ (последний элемент карточки):');
        const lastChild = await firstCard.locator('> :last-child').innerHTML();
        console.log(`HTML: ${lastChild.substring(0, 500)}`);
        
        // ============================================================
        // 5. ПРОВЕРКА РАЗНЫХ СЕЛЕКТОРОВ
        // ============================================================
        console.log('\n🔎 ПРОВЕРКА СЕЛЕКТОРОВ:');
        
        const selectors = [
            'svg',
            'img',
            '.base-icon',
            '.base-icon svg',
            '.base-icon img',
            '[class*="action"]',
            '[class*="icon"]'
        ];
        
        for (const selector of selectors) {
            const count = await firstCard.locator(selector).count();
            const isVisible = count > 0 ? await firstCard.locator(selector).first().isVisible().catch(() => false) : false;
            console.log(`  "${selector}" -> найдено: ${count}, видимый: ${isVisible}`);
        }
        
        // ============================================================
        // 6. КЛИК ПО ИКОНКЕ (пробуем все варианты)
        // ============================================================
        console.log('\n🖱️ ПРОБУЕМ КЛИКНУТЬ ПО ИКОНКЕ ПОДТВЕРЖДЕНИЯ:');
        
        // Пробуем разные варианты
        const possibleClickTargets = [
            { name: 'svg', selector: 'svg' },
            { name: 'первый img', selector: 'img' },
            { name: 'второй img', selector: 'img', index: 1 },
            { name: 'base-icon', selector: '.base-icon' },
            { name: 'base-icon svg', selector: '.base-icon svg' }
        ];
        
        for (const target of possibleClickTargets) {
            const element = target.index !== undefined 
                ? firstCard.locator(target.selector).nth(target.index)
                : firstCard.locator(target.selector).first();
            
            const count = await firstCard.locator(target.selector).count();
            if (count > (target.index || 0)) {
                const isVisible = await element.isVisible().catch(() => false);
                console.log(`  ${target.name}: найдено=${count}, видимо=${isVisible}`);
                if (isVisible) {
                    const tagName = await element.evaluate(el => el.tagName);
                    console.log(`     -> тег: ${tagName}, можно кликнуть!`);
                }
            } else {
                console.log(`  ${target.name}: НЕ найдено (нужен индекс ${target.index || 0})`);
            }
        }
        
        // ============================================================
        // 7. СКРИНШОТЫ
        // ============================================================
        await page.screenshot({ path: 'responses-full-page.png', fullPage: true });
        console.log('\n📸 Скриншот всей страницы: responses-full-page.png');
        
        // Скриншот только первой карточки
        const cardBox = await firstCard.boundingBox();
        if (cardBox) {
            await page.screenshot({ path: 'first-card.png', clip: cardBox });
            console.log('📸 Скриншот первой карточки: first-card.png');
        }
        
        // ============================================================
        // 8. HTML ВСЕЙ СТРАНИЦЫ (для анализа)
        // ============================================================
        const html = await page.content();
        const fs = require('fs');
        fs.writeFileSync('responses-page.html', html);
        console.log('\n📄 HTML страницы сохранён: responses-page.html');
        
        console.log('\n' + '='.repeat(60));
        console.log('КОНЕЦ ДИАГНОСТИКИ');
        console.log('='.repeat(60) + '\n');
        
        await page.waitForTimeout(5000);
    });
});