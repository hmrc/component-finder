let logger

const consoleOutput = (value) => {
  if (value instanceof Error) {
    console.error(value)
  } else {
    console.log(value)
  }
}

class Logger {
  constructor (loggingLevel) {
    this.loggingLevel = loggingLevel
  }

  debug (value) {
    if (this.loggingLevel === 1) {
      consoleOutput(value)
    }
  }

  log (value) {
    consoleOutput(value)
  }
}

const setupLogger = (loggingLevel) => {
  if (logger instanceof Logger !== true) {
    logger = new Logger(loggingLevel)
  }
}

export {
  setupLogger,
  logger
}
