"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const path = require("path");
const yosay = require("yosay");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.testDirectory = "test";
    this.srcDirectory = "src";
  }

  prompting() {
    this.log(
      yosay(`Welcome to the badass ${chalk.red("flatfile-ffx")} generator!`),
    );

    const prompts = [
      {
        type: "input",
        name: "projectName",
        message: "Your project name",
        default: process.cwd().split(path.sep).pop() || "flatfile-x-config",
      },
      // {
      //   type: "input",
      //   name: "author",
      //   message: "Author",
      //   default: this.git.name() || "",
      // },
      // {
      //   type: "input",
      //   name: "email",
      //   message: "Email",
      //   default: this.git.email() || "",
      // },
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
        name: "includeExamples",
        message: "Would you like to include a folder with examples?",
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
        "**/*.{js,json,ts}": ["eslint --fix", "prettier --write"],
      },
    };

    if (this._isTypeScript()) {
      this.fs.copy(
        this.templatePath("ts/_editorconfig"),
        this.destinationPath(".editorconfig"),
      );

      this.fs.copy(
        this.templatePath("ts/_env.example"),
        this.destinationPath(".env.example"),
      );

      this.fs.copy(
        this.templatePath("ts/_gitignore"),
        this.destinationPath(".gitignore"),
      );

      this.fs.copy(
        this.templatePath("ts/_prettierrc.toml"),
        this.destinationPath(".prettierrc.toml"),
      );

      this.fs.copy(
        this.templatePath("ts/_eslintrc.js"),
        this.destinationPath(".eslintrc.js"),
      );

      this.fs.copy(
        this.templatePath("ts/_tsconfig.json"),
        this.destinationPath("tsconfig.json"),
      );

      this.fs.copy(this.templatePath("ts/src"), this.destinationPath("src"));

      if (this.props.includeTests) {
        this.fs.copy(
          this.templatePath("ts/test"),
          this.destinationPath("test"),
        );
      }

      if (this.props.includeExamples) {
        this.fs.copy(
          this.templatePath("ts/examples"),
          this.destinationPath("examples"),
        );
      }

      // this.fs.copyTpl(
      //   this.templatePath("js/README.md"),
      //   this.destinationPath("", "README.md"),
      // );
    } else {
      this.fs.copy(
        this.templatePath("js/_editorconfig"),
        this.destinationPath(".editorconfig"),
      );

      this.fs.copy(
        this.templatePath("js/_env.example"),
        this.destinationPath(".env.example"),
      );

      this.fs.copy(
        this.templatePath("js/_gitignore"),
        this.destinationPath(".gitignore"),
      );

      this.fs.copy(
        this.templatePath("js/_prettierrc.toml"),
        this.destinationPath(".prettierrc.toml"),
      );

      this.fs.copy(
        this.templatePath("js/_eslintrc.js"),
        this.destinationPath(".eslintrc.js"),
      );

      this.fs.copy(this.templatePath("js/src"), this.destinationPath("src"));

      if (this.props.includeTests) {
        this.fs.copy(
          this.templatePath("js/test"),
          this.destinationPath("test"),
        );
      }

      if (this.props.includeExamples) {
        this.fs.copy(
          this.templatePath("js/examples"),
          this.destinationPath("examples"),
        );
      }

      // this.fs.copyTpl(
      //   this.templatePath("js/README.md"),
      //   this.destinationPath("", "README.md"),
      // );
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
