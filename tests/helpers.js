export const users = {
    student: { username: 'testerStudent', password: 'Password1' },
    employer: { username: 'testerEmployer', password: 'Password1' },
    admin: { username: 'testerAdmin', password: 'Password1' }
};

export async function login(page, role) {
    const user = users[role];
    
    await page.goto('https://dev.profteam.su/login');
    await page.fill('input[autocomplete="username"]', user.username);
    await page.fill('input[autocomplete="current-password"]', user.password);
    
    // Кликаем конкретно по кнопке с текстом "Войти"
    await page.click('button:has-text("Войти")');
    
    // Ждем ухода со страницы логина
    await page.waitForFunction(
        () => !window.location.href.includes('/login'),
        { timeout: 10000 }
    );
    
    console.log(`✅ Логин выполнен как ${role}, URL: ${page.url()}`);
}