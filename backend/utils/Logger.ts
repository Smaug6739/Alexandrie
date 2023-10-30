export default class Logger {
  // Info, Warning, Error, Debug, Success
  private static colors = {
    info: '\x1b[36m%s\x1b[0m',
    warn: '\x1b[33m%s\x1b[0m',
    error: '\x1b[31m%s\x1b[0m',
    debug: '\x1b[34m%s\x1b[0m',
    success: '\x1b[32m%s\x1b[0m',
    reset: '\x1b[0m',
  };

  public static info(message: string, details?: string): void {
    console.log(Logger.colors.info, message, Logger.colors.reset, details ? details : '');
  }

  public static warn(message: string, details?: string): void {
    console.log(Logger.colors.warn, message, Logger.colors.reset, details ? details : '');
  }

  public static error(message: string, details?: string): void {
    console.log(Logger.colors.error, message, Logger.colors.reset, details ? details : '');
  }

  public static debug(message: string, details?: string): void {
    console.log(Logger.colors.debug, message, Logger.colors.reset, details ? details : '');
  }

  public static success(message: string, details?: string): void {
    console.log(Logger.colors.success, message, Logger.colors.reset, details ? details : '');
  }
}
