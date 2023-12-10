let requestId = 0;

export default class Logger {
  module = 'init';
  submodule = '';

  setSubmoduleId() {
    this.submodule = requestId.toString().padStart(6);
    requestId++;
  }

  log(...data: any[]) {
    console.log(
      `L${new Date().toISOString()}`,
      `[${this.module}: ${this.submodule}]`,
      ...data,
    );
  }

  ok(...data: any[]) {
    console.info(
      `I${new Date().toISOString()}`,
      `[${this.module}: ${this.submodule}]`,
      ...data,
    );
  }

  warn(...data: any[]) {
    console.warn(
      `W${new Date().toISOString()}`,
      `[${this.module}: ${this.submodule}]`,
      ...data,
    );
  }

  error(...data: any[]) {
    console.error(
      `E${new Date().toISOString()}`,
      `[${this.module}: ${this.submodule}]`,
      ...data,
    );
  }
}

function testLogger() {
  const logger = new Logger();
  logger.module = 'clientRequestId';
  logger.submodule = 'mmm';

  logger.log('my log');
  logger.warn('my warn');
  logger.error('my error');
}

// testLogger();
