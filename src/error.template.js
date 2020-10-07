// const template = ``

// let txt = `${FgGreen}
// 100| const beautify = require('js-beautify').js,
// 101|     fs = require('fs');
// 102| 
// ${FgRed}>${Reset}${FgGreen} 103| fs.readFile(__filename, 'utf8', function (err, data) {
// 104|     if (err) {
// 105|         throw err;
// 106|     }
// 107|     console.log(beautify(data, { indent_size: 2, space_in_empty_paren: true }));
// 108| });${Reset}
// `;

const Reset = "\x1b[0m"
const Bright = "\x1b[1m"
const Dim = "\x1b[2m"
const Underscore = "\x1b[4m"
const Blink = "\x1b[5m"
const Reverse = "\x1b[7m"
const Hidden = "\x1b[8m"

const FgBlack = "\x1b[30m"
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgYellow = "\x1b[33m"
const FgBlue = "\x1b[34m"
const FgMagenta = "\x1b[35m"
const FgCyan = "\x1b[36m"
const FgWhite = "\x1b[37m"

const BgBlack = "\x1b[40m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgBlue = "\x1b[44m"
const BgMagenta = "\x1b[45m"
const BgCyan = "\x1b[46m"
const BgWhite = "\x1b[47m"

const renderFile = function renderErrorTemplate(fileContent){
    // console.log('render', fileContent.length);
    let txt = '';
    for (let index = 0; index < fileContent.length; index++) {
        const line = fileContent[index];
        txt += renderLine(line)
    }
    return txt;
}

const renderLine = function renderErrorLineTemplate(line){
    // console.log('render line')
    if(line.current){
        return `${FgRed}> ${line.number}| ${line.content}${Reset}\n`;
    }
   // const arrow = line.current ? `${FgRed}>${Reset}` : ` `;
    return `${FgGreen}  ${line.number}| ${line.content}${Reset}\n`;
}

const renderStack = function renderStackTrace(stackArr){
    //console.log('Stack Trace')
    let txt = `\n${BgRed} ${FgWhite} Stack Trace ${Reset}\n`;
    for (const step of stackArr) {
        txt += " " + "\u21b3 " + step.type + '| ' + step.caller + ' - ' + step.name + ':' + step.line + "\n";
    }
    return txt;
}

const renderError = function renderError(name, message, appStack){
    let txt = '';
    txt += `${BgRed} ${FgWhite} ${name} ${Reset} ${FgRed} ${message} ${Reset}\n`
    txt += `${FgWhite} [ ${appStack[0].caller} ] at ${appStack[0].file}:${appStack[0].line}${Reset}\n`
    return txt;
}

module.exports = {
    renderError,
    renderFile,
    renderStack
}