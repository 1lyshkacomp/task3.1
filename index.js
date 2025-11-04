// index.js (Режим Polling - Коректна версія для CodeSandbox)

require('dotenv').config(); 
const TelegramBot = require('node-telegram-bot-api');

// Токен береться зі змінних оточення BOT_TOKEN
const token = process.env.BOT_TOKEN; 

// --- 1. СТВОРЕННЯ ЕКЗЕМПЛЯРУ БОТА З POLLING ---
// !!! ПОЛІНГ: Режим опитування, єдиний, що може працювати тут !!!
const bot = new TelegramBot(token, { polling: true }); 

console.log('Bot is running in Polling mode...');

// --- 2. СТАТИЧНІ ДАНІ ---
const aboutText = "Я — Node.js розробник-початківець. Це мій перший Telegram-бот, створений в рамках курсу.";
const socialLinks = [
    { text: 'GitHub', url: 'https://github.com/1lyshkacomp' }, 
    { text: 'LinkedIn', url: 'http://www.linkedin.com/in/iIliia-andriienko-918b8b93/' }
];

// --- 3. ОБРОБНИКИ КОМАНД ---

// Обробка /start та /help
bot.onText(/\/start|\/help/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = "Вітаю! Доступні команди:";

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
    let linksMessage = "Мої профілі:";

    const inlineKeyboard = {
        inline_keyboard: socialLinks.map(link => [{ text: link.text, url: link.url }])
    };

    bot.sendMessage(chatId, linksMessage, { reply_markup: inlineKeyboard });
});

// Обробка помилок Polling
bot.on('polling_error', (error) => {
    // Виводить помилки, але не зупиняє програму через дрібні збої
    console.error("Polling Error:", error.code, error.message);
});