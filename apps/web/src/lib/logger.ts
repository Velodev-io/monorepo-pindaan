import pino from 'pino';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
        },
    },
});
