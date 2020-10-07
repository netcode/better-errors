const util = require('util')
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"


// catch the uncaught errors that weren't wrapped in a domain or try catch statement
// do not use this in modules, but only in applications, as otherwise we could have multiple of these bound
process.on('uncaughtException', function(err) {
    
    // handle the error safely
    // console.log('lplp',err)
    // const stack = {}
    // err.captureStackTrace(stack)
    //console.log(Object.keys(err))
    // const { address ,
    // code ,
    // dest ,
    // errno ,
    // info ,
    // message, 
    // path ,
    // port ,
    // syscall } = err;
    // console.log(address ,
    //     code ,
    //     dest ,
    //     errno ,
    //     info ,
    //     message, 
    //     path ,
    //     port ,
    //     syscall) 
    // console.error('There was an error', {
    //     code: err.code,
    //     message: err.message,
    //     stack: err.stack,
    //     f: err
    // });
    // logz(err.constructor.name);
    // logz(err.message, FgYellow)
    //console.log(typeof err.stack)
    let stackArr = err.stack.split("\n");
    stackArr.shift()
    

    //stackArr = stackArr.map(line => line.split('('))
    let stackArrFlat = stackArr.map(line => {
        // let match = line.matchAll(//gi);
       // console.log(line);
        const regex = /\s*at\s([^\s]+)\s\(([^:]+):([0-9]+):([0-9]+)\)/gmi;
        //const regexp = RegExp('\s*at\s([^\s]+)\s\(([^:]+):([0-9]+):([0-9]+)\)','gi');
        // const str = 'table football, foosball';
        let match = regex.exec(line);
        //match.shift()
        return {
            object: match[1],
            file: match[2],
            line: FgMagenta +  match[3] + ':' + match[4] + Reset
        }
        // return match;
    });

    // console.log(stackArr)
    // console.log(
    //     FgRed + '%s\x1b[0m:' + FgYellow +  ' %s\x1b[0m', 
    //     err.constructor.name, 
    //     err.message
    // )
    console.log('')
    console.log(BgRed + FgWhite + ' %s ' + Reset + ' '  + FgRed + ' %s ' + Reset, err.constructor.name, err.message)
    console.log('')

    const regex = /\s*at\s([^\s]+)\s\(([^:]+):([0-9]+):([0-9]+)\)/gmi;
    let match = regex.exec(stackArr[0]);
        

    console.log(`${FgWhite} [ %s ] ${Reset} \n${FgWhite} %s:%s${Reset}`, match[1], match[2], match[3] )


    let txt = `${FgGreen}
      100| const beautify = require('js-beautify').js,
      101|     fs = require('fs');
      102| 
    ${FgRed}>${Reset}${FgGreen} 103| fs.readFile(__filename, 'utf8', function (err, data) {
      104|     if (err) {
      105|         throw err;
      106|     }
      107|     console.log(beautify(data, { indent_size: 2, space_in_empty_paren: true }));
      108| });${Reset}
    `;

    
    console.log(txt);

    console.log('StackTrace: %s Application , %s Internal Nodejs, %s External modules Calls', 2, 5, 6)
    console.log('To Print the full stack trace, use --full-stacktrace flag')
    // let stackTrace = `
    // ${BgRed}${FgWhite}Object.<anonymous> [index.js:159:7]${Reset}${FgRed}=>${Reset} ${BgRed}${FgWhite}Module._compile [internal]${Reset}${FgRed}=>${Reset} ${BgRed}${FgWhite}Object.Module._extensions..js [internal]${Reset}${FgRed}=>${Reset}
    // ${BgRed}${FgWhite}Module.load [internal]${Reset}${FgRed}=>${Reset}
    // ${BgRed}${FgWhite}tryModuleLoad [internal]${Reset}${FgRed}=>${Reset}
    // ${BgRed}${FgWhite}Function.Module._load [internal]${Reset}${FgRed}=>${Reset}
    // ${BgRed}${FgWhite}Function.Module.runMain [internal]${Reset}${FgRed}=>${Reset}
    // ${BgRed}${FgWhite}startup [internal]${Reset}${FgRed}=>${Reset}
    // ${BgRed}${FgWhite}bootstrapNodeJSCore [internal]${Reset}${FgRed}=>${Reset}
    // `

    // console.log(stackTrace)

    // const beautify = require('js-beautify').js,
    //       fs = require('fs');
 
    // fs.readFile(__filename, 'utf8', function (err, data) {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log(beautify(data, { indent_size: 2, space_in_empty_paren: true }));
    // });

    // console.log("")
    // const structDatas = [
    //     { handler: 'http', endpoint: 'http://localhost:3000/path', method: 'ALL' },
    //     { handler: 'event', endpoint: 'http://localhost:3000/event', method: 'POST' },
    //     { handler: 'GCS', endpoint: 'http://localhost:3000/GCS', method: 'POST' }
    // ];
    //console.table(stackArr);
    // console.log('ST',stack)
})

// try{
    // const x = 1
    // x = 2;
// } catch(e) {
//     //console.log('HJELLO ')
// }

if(1 == 1){
throw new Error('database failed to connect');
}



