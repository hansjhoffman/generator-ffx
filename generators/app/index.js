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
        type: "input",
        name: "projectName",
        message: "Your project name",
        default: "flatfile-x-config",
      },
      {
        type: "confirm",
        name: "includeExamples",
        message: "Would you like to include a folder with examples?",
      },
      {
        type: "list",
        name: "language",
        message: "Do you want to use JavaScript or TypeScript?",
        default: "ts",
        choices: [
          { name: "JavaScript", value: "js" },
          { name: "TypeScript", value: "ts" },
        ],
      },
      {
        type: "list",
        name: "pkgManager",
        message: "Which package manager do you want to use?",
        choices: [
          {
            name: "npm",
            value: "npm",
          },
          {
            name: "yarn",
            value: "yarn",
          },
        ],
        default: "yarn",
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    const pkgJson = {
      name: this.props.projectName,
      license: "UNLICENSED",
      scripts: {
        dev: "flatfile develop src/main.js",
        deploy: "flatfile deploy src/main.js",
      },
      devDependencies: {
        eslint: "^6.6.0",
        flatfile: "^3.4.10",
        prettier: "^2.8.8",
      },
      dependencies: {
        "@flatfile/api": "^1.5.7",
        "@flatfile/listener": "^0.3.3",
        axios: "^1.4.0",
        typescript: "^5",
      },
    };

    const filesForCopy = [
      ".editorconfig",
      ".prettierrc.toml",
      "tsconfig.json",
      "src",
    ];

    filesForCopy.map((f) => {
      this.fs.copy(this.templatePath(f), this.destinationPath(f));
    });

    // this.fs.copy(
    //   this.templatePath(".editorconfig"),
    //   this.destinationPath(".editorconfig"),
    // );

    // this.fs.copy(
    //   this.templatePath(".prettierrc.toml"),
    //   this.destinationPath(".prettierrc.toml"),
    // );

    // this.fs.copy(this.templatePath("main.ts"), this.destinationPath("main.ts"));

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }

  install() {
    this.installDependencies({
      npm: this.props.pkgManager === "npm",
      bower: false,
      yarn: this.props.pkgManager === "yarn",
    });
  }

  end() {
    this.log(`${chalk.green("\n\nSee ya!\n")}`);
  }
};
