const chalk = require('chalk')

class Logger {

    logRequestMessage({ hostname, path, method, status }) {
        if (status >= 200 && status < 300) {
            console.log(chalk.green(this.getRequestLogMessage({ hostname, path, method, status })))
        } else {
            console.log(chalk.red(this.getRequestLogMessage({ hostname, path, method, status })))
        }
    }

    getRequestLogMessage(data) {
        return `${data.method} | ${data.hostname}${data.path} | ${data.status}`
    }
}

export default Logger