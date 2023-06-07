"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the groovy ${chalk.red("flatfile-x")} generator!`),
    );

    const prompts = [
      {
        type: "confirm",
        name: "someAnswer",
        message: "Would you like to enable this option?",
        default: true,
      },
    ];

    return this.prompt(prompts).then((props) => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const pkgJson = {
      devDependencies: {
        eslint: "^6.6.0",
        prettier: "^2.8.8",
      },
      dependencies: {
        "@flatfile/api": "^1.5.7",
        axios: "^1.4.0",
        typescript: "^5.1.3",
      },
    };

    this.fs.copy(
      this.templatePath(".editorconfig"),
      this.destinationPath(".editorconfig"),
    );

    this.fs.copy(
      this.templatePath(".prettierrc.toml"),
      this.destinationPath(".prettierrc.toml"),
    );

    this.fs.copy(this.templatePath("main.ts"), this.destinationPath("main.ts"));

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }

  install() {
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true,
    });
  }
};
