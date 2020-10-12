const Reset = '\x1b[0m';
// const Bright = '\x1b[1m';
// const Dim = '\x1b[2m';
// const Underscore = '\x1b[4m';
// const Blink = '\x1b[5m';
// const Reverse = '\x1b[7m';
// const Hidden = '\x1b[8m';

// const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
// const FgYellow = '\x1b[33m';
// const FgBlue = '\x1b[34m';
// const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

// const BgBlack = '\x1b[40m';
const BgRed = '\x1b[41m';
// const BgGreen = '\x1b[42m';
// const BgYellow = '\x1b[43m';
// const BgBlue = '\x1b[44m';
// const BgMagenta = '\x1b[45m';
// const BgCyan = '\x1b[46m';
// const BgWhite = '\x1b[47m';

/**
 *
 * @param {*} line
 */
const renderCodeLine = function renderErrorLineTemplate(line) {
  if (line.current) {
    return `${FgRed}> ${line.number}| ${line.content}${Reset}\n`;
  }
  return `${FgGreen}  ${line.number}| ${line.content}${Reset}\n`;
};

/**
 *
 * @param {*} fileContent
 */
const renderFile = function renderErrorTemplate(fileContent) {
  let txt = '\n';
  for (let index = 0; index < fileContent.length; index += 1) {
    const line = fileContent[index];
    txt += renderCodeLine(line);
  }
  return txt;
};

/**
 *
 * @param {*} stackArr
 */
const renderStack = function renderStackTrace(stackArr) {
  let txt = `\n${BgRed} ${FgWhite} Stack Trace ${Reset}\n`;
  for (const step of stackArr) {
    txt += step.type === 'App' ? `${FgWhite}` : '';
    txt += ` \u21b3 ${step.type}| ${step.caller} - ${step.name}:${step.line} ${Reset}\n`;
  }
  return txt;
};

/**
 *
 * @param {*} name
 * @param {*} message
 * @param {*} appStack
 */
const renderError = function renderError(name, message, appStack) {
  let txt = '';
  txt += `\n${BgRed} ${FgWhite} ${name} ${Reset} ${FgRed} ${message} ${Reset}\n`;
  if (appStack[0]) {
    txt += `\n${FgCyan}${appStack[0].caller}${Reset} \n ${FgWhite}at ${appStack[0].file}:${appStack[0].line}${Reset}\n`;
  }
  return txt;
};

module.exports = {
  renderError,
  renderFile,
  renderStack,
};
