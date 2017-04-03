import test from 'ava'
import sinon from 'sinon'

const loggingModulePath = './../lib/utils/logging'
const spyConsoleLog = sinon.spy(console, 'log')
const spyConsoleError = sinon.spy(console, 'error')
let loggingModule

test.beforeEach(t => {
  loggingModule = require(loggingModulePath)
})

test.afterEach(t => {
  // Remove module from require cache to be able to reset loggingLevel
  delete require.cache[require.resolve(loggingModulePath)]

  spyConsoleLog.reset()
  spyConsoleError.reset()
})

test('logger.log() should call console.log() as expected', t => {
  const logMessage = 'example log message'

  loggingModule.setupLogger(0)
  loggingModule.logger.log(logMessage)

  t.is(loggingModule.logger.loggingLevel, 0)
  t.true(spyConsoleLog.calledOnce)
  t.is(spyConsoleLog.getCall(0).args[0], logMessage)
})

test('logger.log() should call console.error() as expected', t => {
  const logErrorMessage = 'example log error message'

  loggingModule.setupLogger(0)
  loggingModule.logger.log(Error(logErrorMessage))

  t.is(loggingModule.logger.loggingLevel, 0)
  t.true(spyConsoleError.calledOnce)
  t.is(spyConsoleError.getCall(0).args[0].message, logErrorMessage)
})

test('logger.debug() should call console.log() as expected', t => {
  const debugLogMessage = 'example debug log message'

  loggingModule.setupLogger(1)
  loggingModule.logger.debug(debugLogMessage)

  t.is(loggingModule.logger.loggingLevel, 1)
  t.true(spyConsoleLog.calledOnce)
  t.is(spyConsoleLog.getCall(0).args[0], debugLogMessage)
})

test('logger.debug() should call console.error() as expected', t => {
  const debugLogMessage = 'example debug log message'

  loggingModule.setupLogger(1)
  loggingModule.logger.debug(Error(debugLogMessage))

  t.is(loggingModule.logger.loggingLevel, 1)
  t.true(spyConsoleError.calledOnce)
  t.is(spyConsoleError.getCall(0).args[0].message, debugLogMessage)
})

test('logger.debug() should not be called when loggingLevel is 0', t => {
  const debugLogMessage = 'example debug log message'

  loggingModule.setupLogger(0)
  loggingModule.logger.debug(debugLogMessage)

  t.is(loggingModule.logger.loggingLevel, 0)
  t.true(spyConsoleError.notCalled)
})
