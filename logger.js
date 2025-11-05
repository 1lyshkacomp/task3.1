// logger.js

const pino = require('pino');

// Перевіряємо, чи встановлена змінна оточення PRETTY_LOGGING
const isPretty = process.env.PRETTY_LOGGING === 'true';

const logger = pino({
    // Встановлюємо мінімальний рівень логування (LOG_LEVEL=debug/info/error)
    level: process.env.LOG_LEVEL || 'info', 
    
    // Конфігурація для форматування виводу
    transport: isPretty ? {
        // Використовуємо pino-pretty лише у режимі розробки
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname' 
        }
    } : undefined // У продакшені (на Cloud Run) використовуємо чистий JSON
});

module.exports = logger;