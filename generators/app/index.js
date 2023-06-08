"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const path = require("path");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the groovy ${chalk.red("flatfile-ffx")} generator!`),
    );

    const prompts = [
      {
        type: "input",
        name: "projectName",
        message: "Your project name",
        default: process.cwd().split(path.sep).pop() || "flatfile-x-config",
      },
      {
        type: "confirm",
        name: "includeExamples",
        message: "Would you like to include a folder with examples?",
      },
      {
        type: "list",
        name: "template",
        message: "Choose template",
        default: "ts",
        choices: [
          { name: "JavaScript", value: "js" },
          { name: "TypeScript", value: "ts" },
          { name: "TypeScript (fp-ts)", value: "fp-ts" },
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
      {
        type: "confirm",
        name: "includeTests",
        message: "Would you auto-configure tests?",
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  _isTypeScript() {
    return this.props.template === "ts" || this.props.template === "fp-ts";
  }

  _getFileExtension() {
    return this._isTypeScript() ? "ts" : "js";
  }

  writing() {
    const pkgJson = {
      name: this.props.projectName,
      version: "0.0.0",
      description: "Flatfile X configuration",
      license: "UNLICENSED",
      engines: {
        node: ">=16.0.0",
      },
      main: `src/main.${this._getFileExtension()}`,
      scripts: {
        dev: `flatfile develop src/main.${this._getFileExtension()}`,
        deploy: `flatfile deploy src/main.${this._getFileExtension()}`,
        format: `prettier --write '{src,test}/**/*.${this._getFileExtension()}'`,
        lint: `eslint '{src,test}/**/*.${this._getFileExtension()}'`,
        "lint:fix": `eslint '{src,test}/**/*.${this._getFileExtension()}' --fix`,
        test: this.props.includeTests ? "jest" : undefined,
        "test:watch": this.props.includeTests ? "jest --watch" : undefined,
      },
      devDependencies: {
        "@types/jest": this.props.includeTests ? "^29.5.2" : undefined,
        "@types/node": this._isTypeScript() ? "^18" : undefined,
        "@typescript-eslint/eslint-plugin": this._isTypeScript()
          ? "^5.59.9"
          : undefined,
        "@typescript-eslint/parser": this._isTypeScript()
          ? "^5.59.9"
          : undefined,
        eslint: "^6.6.0",
        "eslint-plugin-import": "^2.27.5",
        "eslint-plugin-prettier": "^4.2.1",
        flatfile: "^3.4.10",
        jest: this.props.includeTests ? "^29.5.0" : undefined,
        "lint-staged": "^13.2.2",
        prettier: "^2.8.8",
        typescript: this._isTypeScript() ? "^5" : undefined,
      },
      dependencies: {
        "@flatfile/api": "^1.5.7",
        "@flatfile/listener": "^0.3.3",
        "fp-ts": this.props.template === "fp-ts" ? "^2.16.0" : undefined,
      },
      "lint-staged": {
        "**/*.{js,ts}": ["eslint --fix", "prettier --write"],
      },
    };

    this.fs.copy(
      this.templatePath(".editorconfig"),
      this.destinationPath(".editorconfig"),
    );

    this.fs.copy(
      this.templatePath(".env.example"),
      this.destinationPath(".env.example"),
    );

    this.fs.copy(
      this.templatePath(".gitignore"),
      this.destinationPath(".gitignore"),
    );

    this.fs.copy(
      this.templatePath(".prettierrc.toml"),
      this.destinationPath(".prettierrc.toml"),
    );

    // fix this to copy 1 for JS and another for TS
    this.fs.copy(
      this.templatePath(".eslintrc.js"),
      this.destinationPath(".eslintrc.js"),
    );

    if (this._isTypeScript()) {
      this.fs.copy(
        this.templatePath("tsconfig.json"),
        this.destinationPath("tsconfig.json"),
      );
    }

    // fix this to copy 1 for JS and another for TS
    this.fs.copy(this.templatePath("src"), this.destinationPath("src"));

    // fix this to copy 1 for JS and another for TS
    if (this.props.includeTests) {
      this.fs.copy(this.templatePath("test"), this.destinationPath("test"));
    }

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }

  install() {
    this.installDependencies({
      npm: this.props.pkgManager === "npm",
      bower: false,
      yarn: this.props.pkgManager === "yarn",
    });
  }

  _gitInit() {
    const result = this.spawnCommandSync("which", ["git"]);

    if (result?.status === 0) {
      this.spawnCommandSync("git", ["init"]);
      this.spawnCommandSync("git", ["add", "--all"]);
      this.spawnCommandSync("git", ["commit", "-m", "initial"]);
    }
  }

  end() {
    this._gitInit();

    this.log(`${chalk.green("\n\nSee ya!\n")}`);
  }
};
