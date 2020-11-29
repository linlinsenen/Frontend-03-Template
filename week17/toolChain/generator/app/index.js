var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }
    /*
    async method1() {
      const answers = await this.prompt([
        {
          type: "input",
          name: "name",
          message: "Your project name",
          default: this.appname // Default to current folder name
        },
        {
          type: "confirm",
          name: "cool",
          message: "Would you like to enable the Cool feature?"
        }
      ]);
      this.log('app name', answers.name);
      this.log('cool feature', answers.cool);
    }*/
    
    initPackage() {
        const pkgJson = {
            devDependencies: {
                eslint: '^3.15.0'
            },
            dependencies: {
                react: '^17.0.0'
            }
        }
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
        this.npmInstall();
    }
    writing() {
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('public/index.html'), {
                title: 'Templating with Yeoman'
            }
        );
    }
};