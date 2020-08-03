const util = require('util');

module.exports = (...contextData) => {
  try {
    const traceData = {
      memory_usage: `${process.memoryUsage().heapUsed / 1024 / 1024} MB`,
      user_cpu_usage: `${process.cpuUsage().user / 1000} ms`,
      system_cpu_usage: `${process.cpuUsage().system / 1000} ms`,
      context_data: util.inspect(contextData, { maxArrayLength: 10, maxStringLength: 100, breakLength: `Infinity` }),
      trace_data: new Error().stack.split(`at`)[2].trim()
    };

    console.log(`- ${JSON.stringify(traceData)}`);
    return traceData;
  } catch { /* Ignore any errors created by logging process */ }
};
