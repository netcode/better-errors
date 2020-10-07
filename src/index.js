const fs = require('fs');
const errorTemplate = require('./error.template');
let config = {
    rootPath: require('path').dirname(require.main.filename || process.mainModule.filename),
    showStack: false
}

/**
 * Get the lines wrapping the error line
 * @param {Object} { file: string, line: number}
 */
const getFile = function getFileContent({file, line}){
    let fileContent = fs.readFileSync(file, 'utf8');
        fileContent = fileContent.split("\n");
    
    line  = line - 1; //unify starting line to start from 0
    const startLine = line - 3;
    const endLine = line + 5;
    
    return fileContent.map((contentLine, i) => {
        return { 
            number:i, //line number
            content: contentLine, //line contents
            current: i == line ? true: false //current error line
        }
    }).filter( line => line.number >= startLine && line.number <= endLine);
}


/**
 * see: https://nodejs.org/api/errors.html#errors_error_stack
 * Error: Things keep happening!
 *   at /home/gbusey/file.js:525:2
 *   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
 *   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
 *   at increaseSynergy (/home/gbusey/actors.js:701:6)
 */
const getStack = function getStackTrace(stack){
    let stackArr = stack.split("\n");
    stackArr.shift() //remove the first line of the err stack, its just the error name and message
    stackArr = stackArr.map(step => {
        let stackRegex = /at([^\/(]+)\(?([^:]+):([0-9]+):([0-9]+)/gmi
        let match = stackRegex.exec(step);

        let type = null;
        let file = null;

        if(match[2].indexOf('native') === 0){
            type = 'Native'
            file = 'v8'
        }
        if(match[2].indexOf('internal') === 0){
            type = 'Internal'
            file = match[2].replace('internal','')
        }
        if(match[2].indexOf('/') === 0){
            type = 'App'
            file = match[2];
            if(match[2].indexOf('node_modules') !== -1){
                type = 'Module'
                file = match[2].split('node_modules/')[1];
            }
        }

        return {
            type:type, //native, internal, module, application
            caller: match[1],
            file:file,
            name: file.replace(config.rootPath,''),
            line:match[3],
            column:match[4]
        }
    });

    return {
        fullStack: stackArr,
        appStack: stackArr.filter(step => step.type == 'App')
    }
}

// const format = function formatLines(){
//     let Reset = "\x1b[0m"
//     let Bright = "\x1b[1m"
//     let Dim = "\x1b[2m"
//     let Underscore = "\x1b[4m"
//     let Blink = "\x1b[5m"
//     let Reverse = "\x1b[7m"
//     let Hidden = "\x1b[8m"

//     let FgBlack = "\x1b[30m"
//     let FgRed = "\x1b[31m"
//     let FgGreen = "\x1b[32m"
//     let FgYellow = "\x1b[33m"
//     let FgBlue = "\x1b[34m"
//     let FgMagenta = "\x1b[35m"
//     let FgCyan = "\x1b[36m"
//     let FgWhite = "\x1b[37m"

//     let BgBlack = "\x1b[40m"
//     let BgRed = "\x1b[41m"
//     let BgGreen = "\x1b[42m"
//     let BgYellow = "\x1b[43m"
//     let BgBlue = "\x1b[44m"
//     let BgMagenta = "\x1b[45m"
//     let BgCyan = "\x1b[46m"
//     let BgWhite = "\x1b[47m"
// }

// class BetterError {
//     constructor(err){
//         this.err  = err;
//         for (const prop of Object.getOwnPropertyNames(err)) {
//             this[prop] = err[prop];
//         }
//     }

//     /**
//      * see: https://nodejs.org/api/errors.html#errors_error_stack
//      * Error: Things keep happening!
//      *   at /home/gbusey/file.js:525:2
//      *   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
//      *   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
//      *   at increaseSynergy (/home/gbusey/actors.js:701:6)
//      */
//     getStack(){
//         let stackArr = this.stack.split("\n");
//         stackArr.shift() //remove the first line of the err stack, its just the error name and message

//         // console.log(stackArr);

//         stackArr = stackArr.map(step => {
//             let stackRegex = /at([^\/(]+)\(?([^:]+):([0-9]+):([0-9]+)/gmi
//             let match = stackRegex.exec(step);

//             let type = null;
//             let file = null;
//             //match[2] = match[2].replace(rootPath,'');
//             if(match[2].indexOf('native') === 0){
//                 type = 'Native'
//                 file = 'v8'
//             }
//             if(match[2].indexOf('internal') === 0){
//                 type = 'Internal'
//                 file = match[2].replace('internal','')
//             }
//             if(match[2].indexOf('/') === 0){
//                 type = 'App'
//                 file = match[2];
//                 if(match[2].indexOf('node_modules') !== -1){
//                     type = 'Module'
//                     file = match[2].split('node_modules/')[1];
//                 }
//             }

//             return {
//                 type:type, //native, internal, module, application
//                 caller: match[1],
//                 file:file,
//                 name: file.replace(rootPath,''),
//                 line:match[3],
//                 column:match[4]

//             }
//         });

//         let appStack = stackArr.filter(step => step.type == 'App');
//         let err = errorTemplate.renderError(this.err.constructor.name , this.err.message, appStack)
//         console.log(err);

//         let fileContent = getFile(appStack[0]);
//         let txt = errorTemplate.renderFile(fileContent)
//         console.log(txt)
//         //console.log(require('path').dirname(require.main.filename || process.mainModule.filename))
//         // console.log(stackArr)

//         let stackTxt = errorTemplate.renderStack(stackArr);
//         //console.log(stackTxt)
//         console.log('---------------------------')
//         // console.log('Stack Trace')
//         // let tab = " ";
//         // for (const step of stackArr) {
//         //     console.log(tab + "\u21b3 " + step.type + ':' + step.name + ':' + step.line)
//         // }
        
//         // let txt = '';
//         // for (let index = 0; index < fileContent.length; index++) {
//         //     const line = fileContent[index];
//         //     if(line.current){
//         //         txt += '>' + line.i +  '| ' + line.content + "\n";    
//         //     }else{
//         //         txt += ' ' + line.i +  '| ' + line.content + "\n";
//         //     }
            
//         // }
        
//         // let fileContent = require('fs').readFileSync(applicationStack[0].file, 'utf8');
//         // fileContent = fileContent.split("\n");
//         // //extract file contents
//         // // const lineReader = require('readline').createInterface({
//         // //     input: require('fs').createReadStream(applicationStack[0].file)
//         // // });
//         // let i = 0;
//         // let txt = '';
//         // // lineReader.on('line', function (line) {
//         // for (const line of fileContent) {
//         //     i++;
//         //     if(i < applicationStack[0].line - 3) continue;
//         //     if(i > parseInt(applicationStack[0].line) + 5) continue;
//         //     if(applicationStack[0].line == i){
//         //         txt += '>' + i +  '| ' + line + "\n";    
//         //     }else{
//         //         txt += ' ' + i +  '| ' + line + "\n";
//         //     }
//         // }
            
//         // });

        
//     }

//     render(){
//         this.getStack()
//         return 'KatKooot';
//     }
// }

// function ZipCodeFormatException(value) {
//     this.value = value;
//     this.message = 'does not conform to the expected format for a zip code';
//     this.toString = function() {
//        return this.value + this.message;
//     };
//  }

// BetterError.prototype.toString = function() {
//     return 'Yalla';
// }

// class ErrFactory {
//     constructor(){
//     }
//     create(err){
//         let n = new BetterError();
//         n.overwrite(err)
//         return n;
//     }
// }

// errFactory = new ErrFactory()


const BetterError = function BetterError(err){
    let stackTrace = getStack(err.stack)
    let errTxt = '';
    //render title
    errTxt += errorTemplate.renderError(err.constructor.name , err.message, stackTrace.appStack);
    //render file
    let fileContent = getFile(stackTrace.appStack[0]);
    errTxt += errorTemplate.renderFile(fileContent)
    //render stacktrace if any
    if(config.showStack){
        errTxt += errorTemplate.renderStack(stackTrace.fullStack);
    }

    return errTxt;

    // let fileContent = getFile(appStack[0]);
    // let txt = errorTemplate.renderFile(fileContent)
}



// catch the uncaught errors that weren't wrapped in a domain or try catch statement
// do not use this in modules, but only in applications, as otherwise we could have multiple of these bound
process.on('uncaughtException', function(err) {
    // console.log('Trace');
    // let BE =  new BetterError(err)
    // // BE.overwrite(err);
    // console.log(BE.render());
    // throw errFactory.create(err)
    // throw new ZipCodeFormatException('koko');
    //the error is throwed so it should be throwed'
    console.error(BetterError(err))
});


module.exports.config = (userConfig) => {
    config.showStack = userConfig.showStack || false;
    config.rootPath = userConfig.rootPath || config.rootPath;
}