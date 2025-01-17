const command = "ls /";

// require("child_process").execSync("/usr/bin/gnome-calculator");

// global.process.mainModule.constructor._load('child_process').execSync(command);

require("child_process").exec(command, (error, stdout, stderr) => {console.log(stdout);});
