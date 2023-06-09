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
      yosay(`Welcome to the badass ${chalk.red("Flatfile 'X'")} generator!`),
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
        type: "list",
        name: "envManager",
        message: "Which environment manger do you want to use?",
        choices: [
          {
            name: "asdf",
            value: "asdf",
          },
          {
            name: "nix",
            value: "nix",
          },
          {
            name: "nvm",
            value: "nvm",
          },
          {
            name: "volta",
            value: "volta",
          },
        ],
        default: "nix",
      },
      {
        type: "confirm",
        name: "includeExamples",
        message: "Would you like to include a folder with examples?",
        default: true,
      },
      {
        type: "confirm",
        name: "includeTests",
        message: "Would you auto-configure tests?",
        default: true,
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
        compile: this._isTypeScript() ? "tsc" : undefined,
        deploy:
          `${this._isTypeScript() ? "yarn compile && " : ""}` +
          `flatfile deploy src/main.${this._getFileExtension()}`,
        dev: `flatfile develop src/main.${this._getFileExtension()}`,
        format: `prettier --write '{src,test,examples}/**/*.${this._getFileExtension()}'`,
        lint: `eslint '{src,test,examples}/**/*.${this._getFileExtension()}'`,
        "lint:fix": `eslint '{src,test,examples}/**/*.${this._getFileExtension()}' --fix`,
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
        "esbuild-jest":
          this._isTypeScript() && this.props.includeTests
            ? "^0.5.0"
            : undefined,
        eslint: "^6.6.0",
        "eslint-plugin-import": "^2.27.5",
        "eslint-plugin-prettier": "^4.2.1",
        flatfile: "^3.4.10",
        jest: this.props.includeTests ? "^29.5.0" : undefined,
        "lint-staged": "^13.2.2",
        prettier: "^2.8.8",
        "ts-node":
          this._isTypeScript() && this.props.includeTests
            ? "^10.9.1"
            : undefined,
        typescript: this._isTypeScript() ? "^5" : undefined,
      },
      dependencies: {
        "@flatfile/api": "^1.5.7",
        "@flatfile/listener": "^0.3.3",
        "fp-ts": this.props.template === "fp-ts" ? "^2.16.0" : undefined,
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

        this.fs.copy(
          this.templatePath("ts/jest.config.ts"),
          this.destinationPath("jest.config.ts"),
        );
      }

      if (this.props.includeExamples) {
        this.fs.copy(
          this.templatePath("ts/examples"),
          this.destinationPath("examples"),
        );
      }

      this.fs.copyTpl(
        this.templatePath("ts/README.md"),
        this.destinationPath("README.md"),
        this.props,
      );
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

        this.fs.copy(
          this.templatePath("js/jest.config.js"),
          this.destinationPath("jest.config.js"),
        );
      }

      if (this.props.includeExamples) {
        this.fs.copy(
          this.templatePath("js/examples"),
          this.destinationPath("examples"),
        );
      }

      this.fs.copyTpl(
        this.templatePath("js/README.md"),
        this.destinationPath("README.md"),
        this.props,
      );
    }

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);

    this.fs.extendJSON(
      this.destinationPath("package.json"),
      this._isTypeScript()
        ? {
            "lint-staged": {
              "**/*.{json,ts}": ["eslint --fix", "prettier --write"],
            },
          }
        : {
            "lint-staged": {
              "**/*.{js,json}": ["eslint --fix", "prettier --write"],
            },
          },
    );

    this.fs.extendJSON(this.destinationPath("package.json"), {
      volta:
        this.props.envManager === "volta"
          ? {
              node: "18.12.1",
              npm: this.props.pkgManager === "npm" ? "8.19.2" : undefined,
              yarn: this.props.pkgManager === "yarn" ? "1.22.19" : undefined,
            }
          : undefined,
    });

    if (this.props.envManager === "nvm") {
      this.fs.copy(this.templatePath("_nvmrc"), this.destinationPath(".nvmrc"));
    }

    if (this.props.envManager === "asdf") {
      this.fs.copy(
        this.templatePath("_tool-versions"),
        this.destinationPath(".tool-versions"),
      );
    }

    if (this.props.envManager === "nix") {
      this.fs.copy(
        this.templatePath("_shell.nix"),
        this.destinationPath("shell.nix"),
      );

      this.fs.copy(
        this.templatePath("_envrc.example"),
        this.destinationPath(".envrc.example"),
      );

      this.fs.copy(
        this.templatePath("_envrc.example"),
        this.destinationPath(".envrc"),
      );

      this.fs.copy(this.templatePath("_nix"), this.destinationPath("nix"));
    }
  }

  install() {
    this._envSetup(); // this needs to wait for completion before proceeding

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

  _envSetup() {
    if (this.props.envManager === "nvm") {
      this.spawnCommandSync("nvm", ["use"]);
    }

    if (this.props.envManager === "nix") {
      this.spawnCommandSync("direnv", ["allow"]);
    }
  }

  end() {
    this._gitInit();

    this.log(`${chalk.green("\n\nSee ya!\n")}`);
  }
};
