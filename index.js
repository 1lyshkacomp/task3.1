// index.js (Фінальна Webhook-версія для Cloud Run)

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const logger = require('./logger'); // Імпорт логера

// --- ЗМІННІ КОНФІГУРАЦІЇ ---
const token = process.env.BOT_TOKEN;
// Cloud Run зазвичай використовує 8080. Використовуємо 8080 як стандарт.
const port = process.env.PORT || 8080; 

// Якщо publicUrl не вказано (як у Cloud Run), Webhook не встановлюється
// Встановлення Webhook робимо вручну після деплою
const publicUrl = process.env.PUBLIC_URL || ''; 
const webhookPath = '/bot/' + token; 

// --- 1. СТВОРЕННЯ ЕКЗЕМПЛЯРУ БОТА ТА ВЕБ-СЕРВЕРА ---
const bot = new TelegramBot(token); // Без POLLING
const app = express();

// Встановлюємо Webhook (якщо PUBLIC_URL задано)
if (publicUrl) {
    bot.setWebHook(publicUrl + webhookPath)
       .then(() => logger.info(`Webhook встановлено на: ${publicUrl + webhookPath}`))
       // Заміна console.error
       .catch(error => logger.error({ error: error.message }, "Помилка встановлення Webhook"));
} else {
    logger.warn("PUBLIC_URL не задано. Webhook не встановлюється автоматично.");
}

// Для парсингу вхідних JSON-даних від Telegram
app.use(express.json()); 

// 2. ОБРОБКА WEBHOOK
app.post(webhookPath, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
    // Логуємо, що ми отримали оновлення
    logger.info({ updateId: req.body.update_id }, "Отримано оновлення від Telegram");
});

// 3. ЗАПУСК СЕРВЕРА
app.listen(port, () => {
    // Заміна console.log
    logger.info('Express server is running on port %d', port); 
});

// --- СТАТИЧНІ ДАНІ ---
const aboutText = "Я — Node.js розробник-початківець. Це мій перший Telegram-бот, створений в рамках курсу.";
const socialLinks = [
    { text: 'GitHub', url: 'https://github.com/1lyshkacomp' }, 
    { text: 'LinkedIn', url: 'http://www.linkedin.com/in/iIliia-andriienko-918b8b93/' }
];

// --- Обробники команд (Твій код) ---

bot.onText(/\/start|\/help/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = "Вітаю! Доступні команди:";
    // Логуємо команду
    logger.info({ chatId: chatId, command: '/start_or_help' }, "Отримано команду /start або /help");

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

bot.onText(/\/about/, (msg) => {
    logger.info({ chatId: msg.chat.id, command: '/about' }, "Отримано команду /about");
    bot.sendMessage(msg.chat.id, aboutText);
});

bot.onText(/\/links/, (msg) => {
    const chatId = msg.chat.id;
    logger.info({ chatId: chatId, command: '/links' }, "Отримано команду /links");
    let linksMessage = "Мої профілі:";

    const inlineKeyboard = {
        inline_keyboard: socialLinks.map(link => [{ text: link.text, url: link.url }])
    };

    bot.sendMessage(chatId, linksMessage, { reply_markup: inlineKeyboard });
});