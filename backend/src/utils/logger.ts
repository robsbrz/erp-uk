type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    private log(level: LogLevel, message: string, meta?: any) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            context: this.context,
            message,
            ...(meta && { meta })
        };

        if (process.env.NODE_ENV === 'production') {
            // Em produção, você pode enviar para um serviço de logging
            console.log(JSON.stringify(logEntry));
        } else {
            // Em desenvolvimento, formatação mais legível
            const colorize = (str: string, color: string) => `${color}${str}\x1b[0m`;
            const colors = {
                info: '\x1b[36m',  // cyan
                warn: '\x1b[33m',  // yellow
                error: '\x1b[31m', // red
                debug: '\x1b[35m'  // magenta
            };

            console.log(
                `${colorize(timestamp, '\x1b[90m')} [${colorize(level.toUpperCase(), colors[level])}] ` +
                `${colorize(this.context, '\x1b[32m')}: ${message}` +
                (meta ? `\n${JSON.stringify(meta, null, 2)}` : '')
            );
        }
    }

    info(message: string, meta?: any) {
        this.log('info', message, meta);
    }

    warn(message: string, meta?: any) {
        this.log('warn', message, meta);
    }

    error(message: string, meta?: any) {
        this.log('error', message, meta);
    }

    debug(message: string, meta?: any) {
        if (process.env.NODE_ENV !== 'production') {
            this.log('debug', message, meta);
        }
    }
}

export const createLogger = (context: string) => new Logger(context);
