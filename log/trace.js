const util = require('util');

let isAlreadyInitialized = false;

export function startConsoleTracking(errorObservable: ErrorObservable) {
  originalConsoleError = console.error
  console.error = monitor((message?: any, ...optionalParams: any[]) => {
    originalConsoleError.apply(console, [message, ...optionalParams])
    // errorObservable.notify({
    //   context: {
    //     error: {
    //       origin: ErrorOrigin.CONSOLE,
    //     },
    //   },
    //   message: ['console error:', message, ...optionalParams].map(formatConsoleParameters).join(' '),
    //   startTime: performance.now(),
    // })
  })
}

export function startErrorCollection(configuration) {
  trackNetworkError(configuration, errorObservable, requestCompleteObservable)
  startConsoleTracking(errorObservable)
  startRuntimeErrorTracking(errorObservable)
}

export function startLogger(errorObservable, configuration, session, internalMonitoring) {
  let globalContext = {}

  internalMonitoring.setExternalContextProvider(
    () => deepMerge({ session_id: session.getId() }, globalContext, getRUMInternalContext() as Context) as Context
  )

  const batch = startLoggerBatch(configuration, session, () => globalContext)
  const handlers = {
    [HandlerType.console]: (message: LogsMessage) => console.log(`${message.status}: ${message.message}`),
    [HandlerType.http]: (message: LogsMessage) => batch.add(message),
    [HandlerType.silent]: noop,
  }
  const logger = new Logger(session, handlers)
  customLoggers = {}
  errorObservable.subscribe((e: ErrorMessage) =>
    logger.error(
      e.message,
      deepMerge(
        ({ date: getTimestamp(e.startTime), ...e.context } as unknown) as Context,
        getRUMInternalContext(e.startTime)
      )
    )
  )

  const globalApi: Partial<LogsGlobal> = {}
  globalApi.setLoggerGlobalContext = (context: Context) => {
    globalContext = context
  }
  globalApi.addLoggerGlobalContext = (key: string, value: ContextValue) => {
    globalContext[key] = value
  }
  globalApi.createLogger = makeCreateLogger(session, handlers)
  globalApi.getLogger = getLogger
  globalApi.logger = logger
  return globalApi
}

const configurationHandler = userConfiguration => {
  if (!checkIsNotLocalFile() || !canInitLogs(userConfiguration)) return;

  const { errorObservable, configuration, internalMonitoring } = commonInit(userConfiguration, buildEnv)
  const session = startLoggerSession(configuration, areCookiesAuthorized())
  const globalApi = startLogger(errorObservable, configuration, session, internalMonitoring)
  assign(datadogLogs, globalApi)
  isAlreadyInitialized = true
};

// function monitor(fn) {
//   return (function(this) { return fn.apply(this, arguments)});
// }

module.exports.init = function(config) {
  return (function(this) { return configurationHandler.apply(this, config)});
};

module.exports = (...contextData) => {
  try {
    const traceData = JSON.stringify({
      memory_usage: `${process.memoryUsage().heapUsed / 1024 / 1024} MB`,
      user_cpu_usage: `${process.cpuUsage().user / 1000} ms`,
      system_cpu_usage: `${process.cpuUsage().system / 1000} ms`,
      context_data: util.inspect(contextData, { maxArrayLength: 10, maxStringLength: 100, breakLength: `Infinity` }),
      trace_data: new Error().stack.split(`at`)[2].trim()
    });

    console.log(`- ${traceData}`);
    return traceData;
  } catch { /* Logging shouldn't create errors */ }
}
