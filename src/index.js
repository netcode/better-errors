const fs = require('fs');
const { argv } = require('process');
const path = require('path');
const errorTemplate = require('./error.template');

const config = {
  rootPath: path.dirname(require.main.filename || process.mainModule.filename),
  showStack: argv.reduce((_, a) => a === '--show-stack') || false,
};

/**
 * Get the lines wrapping the error line
 * @param {Object} { file: string, line: number}
 */
const getFile = function getFileContent({ file, line }) {
  let fileContent = fs.readFileSync(file, 'utf8');
  fileContent = fileContent.split('\n');
  const startLine = Number(line) - 3;
  const endLine = Number(line) + 5;
  return fileContent.map((contentLine, i) => ({
    // increase it by one because the array start at 0 and file start at 1
    number: ++i, /* eslint-disable-line no-plusplus,no-param-reassign */
    content: contentLine, // line contents
    current: i === Number(line), // current error line
  })).filter((lineObj) => lineObj.number >= startLine && lineObj.number <= endLine);
};

/**
 * see: https://nodejs.org/api/errors.html#errors_error_stack
 * Error: Things keep happening!
 *   at /home/gbusey/file.js:525:2
 *   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
 *   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
 *   at increaseSynergy (/home/gbusey/actors.js:701:6)
 */
const getStack = function getStackTrace(stack) {
  let stackArr = stack.split('\n');
  stackArr.shift(); // remove the first line of the err stack, its just the error name and message
  stackArr = stackArr.map((step) => {
    const stackRegex = /at([^/(]+)\(?([^:]+):?([0-9]+)?:?([0-9]+)?/gmi;
    const match = stackRegex.exec(step);

    let type = null;
    let file = null;

    if (match[2].indexOf('native') === 0) {
      type = 'Native';
      file = 'v8';
    }
    if (match[2].indexOf('internal') === 0) {
      type = 'Internal';
      file = match[2].replace('internal', '');
    }
    if (match[2].indexOf('/') === 0) {
      type = 'App';
      file = match[2]; /* eslint-disable-line prefer-destructuring */
      if (match[2].indexOf('node_modules') !== -1) {
        type = 'Module';
        file = match[2].split('node_modules/')[1]; /* eslint-disable-line prefer-destructuring */
      }
    }

    return {
      type, // native, internal, module, application
      caller: match[1],
      file,
      name: file ? file.replace(config.rootPath, '') : 'Unknown',
      line: match[3],
      column: match[4],
    };
  });

  return {
    fullStack: stackArr,
    appStack: stackArr.filter((step) => step.type === 'App'),
  };
};

/**
 *
 * @param {*} err
 */
const BetterError = function BetterError(err) {
  const stackTrace = getStack(err.stack);

  let errTxt = '';
  // render title
  errTxt += errorTemplate.renderError(err.constructor.name, err.message, stackTrace.appStack);
  if (stackTrace.appStack[0]) {
    // render file
    const fileContent = getFile(stackTrace.appStack[0]);
    errTxt += errorTemplate.renderFile(fileContent);
  }

  // render stacktrace if any
  if (config.showStack) {
    errTxt += errorTemplate.renderStack(stackTrace.fullStack);
  }

  return errTxt;
};

// catch the uncaught errors that weren't wrapped in a domain or try catch statement
process.setUncaughtExceptionCaptureCallback((err) => {
  process.stderr.write(BetterError(err));
});

module.exports.BetterError = BetterError;
