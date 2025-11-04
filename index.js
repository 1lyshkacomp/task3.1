// index.js

require('dotenv').config(); // Завантажуємо BOT_TOKEN з .env

const TelegramBot = require('node-telegram-bot-api');

// Токен бота з .env
const token = process.env.BOT_TOKEN;

// Створюємо екземпляр бота
const bot = new TelegramBot(token, { polling: true });

// --- Конфігурація контенту ---
const aboutText = "Я — Node.js розробник-початківець. Це мій перший Telegram-бот, створений в рамках курсу Foxminded.";
const socialLinks = [
    { text: 'GitHub', url: 'https://github.com/...' },
    { text: 'LinkedIn', url: 'https://linkedin.com/...' }
    // Додай свої реальні посилання
];

const commandsList = [
    { command: '/about', description: 'Коротка інформація про мене' },
    { command: '/links', description: 'Список соціальних мереж' },
    { command: '/help', description: 'Показати список команд' }
];

// --- Обробники команд ---

// Обробка /start та /help
bot.onText(/\/start|\/help/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = "Вітаю! Я — демонстраційний бот. Використовуйте кнопки нижче, щоб дізнатися про мене більше:";

    // Створюємо клавіатуру (Reply Markup)
    const replyMarkup = {
        keyboard: [
            [{ text: '/about' }],
            [{ text: '/links' }, { text: '/help' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    };

    bot.sendMessage(chatId, welcomeMessage, { reply_markup: replyMarkup });
});

// Обробка /about
bot.onText(/\/about/, (msg) => {
    bot.sendMessage(msg.chat.id, aboutText);
});

// Обробка /links
bot.onText(/\/links/, (msg) => {
    const chatId = msg.chat.id;
    let linksMessage = "Мої профілі:\n";

    // Створюємо інлайн-клавіатуру для посилань (краще, ніж просто текст)
    const inlineKeyboard = {
        inline_keyboard: socialLinks.map(link => [{ text: link.text, url: link.url }])
    };

    bot.sendMessage(chatId, linksMessage, { reply_markup: inlineKeyboard });
});


// Обробка помилок
bot.on('polling_error', (error) => {
    console.error("Polling Error:", error.code);
});

console.log('Bot is running...');