import { readFileSync as readFile } from 'fs'
import { resolve as resolvePath } from 'path'

if(!global['require-lite permanent storage']) global['require-lite permanent storage'] = {};

const maybeJSPaths = ['', '.js', '/index.js'];

function resolveJSFile(file){
    file = resolvePath(file);
    for(var i = 0; i < maybeJSPaths.length; i++){
        try{
            return readFile(file + maybeJSPaths[i], 'utf8')
        } catch(e){
            if(e.code !== 'ENOENT') throw e
        }
    }
    throw new Error('There is no module found by specifier ' + file)
}

function require(module){
    const callerFile = (new Error).stack.split(/\n/g)[2].split(/^\s*at\s.*?\(/)[1].split(/:\d+:\d+\)/)[0];
    const targetModulePath = module[0] === '.' ? resolvePath(callerFile, '..', module) : resolvePath(module);
    if(!(targetModulePath in global['require-lite permanent storage'])){
        const src = resolveJSFile(targetModulePath);
        const targetModule = new Function('__filename', '__dirname', 'module', 'exports', 'require', src);
        const moduleExport = { exports: {} };
        targetModule(targetModulePath, resolvePath(targetModulePath, '..'), moduleExport, moduleExport.exports, require);
        global['require-lite permanent storage'][targetModulePath] = moduleExport.exports;
    }
    return global['require-lite permanent storage'][targetModulePath];
}

export default require
