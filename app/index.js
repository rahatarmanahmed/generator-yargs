'use strict';
var util = require('util');
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');

var defaultBaseName = path.basename(process.cwd())

var YargsGenerator = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.option('coffee', {
      desc: 'Generate a project with CoffeeScript',
      type: 'boolean',
      default: false
    });
    this.option('es6', {
      desc: 'Generate a project with ES6 (Babel)',
      type: 'boolean',
      default: false
    });
  },

  prompting: function () {
    var done = this.async();

    if(this.options['coffee']) {
      this.lang = 'CoffeeScript'
    }
    if(this.options['es6']) {
      this.lang = 'ES6'
    }

    var prompts = [
      {
        type: 'input',
        name: 'author',
        message: 'Who is the author?',
        default: 'Linus Torvalds'
      },
      {
        type: 'input',
        name: 'commandName',
        message: 'What should your command be called?',
        default: path.basename(process.cwd())
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe what your command does.',
        default: 'Formats your hard drive.'
      }
    ];

    if(!(this.options['coffee'] || this.options['es6']))
      prompts.push({
        type: 'list',
        name: 'lang',
        message: 'Would you like to use JavaScript, ES6 (Babel), or CoffeeScript?',
        choices: [
          'JavaScript',
          'ES6',
          'CoffeeScript'
        ],
        default: 'JavaScript'
      })

    this.prompt(prompts, function (props) {
      for(var key in props){
        this[key] = props[key];
      }
      this.pathPrefix = this.commandName+'/';
      if(this.commandName == defaultBaseName && fs.readdirSync('.').length == 0)
        this.pathPrefix = './'
      this.destinationRoot(this.pathPrefix);
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_.gitignore'),
        this.destinationPath('.gitignore'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_README.md'),
        this.destinationPath('README.md'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('bin/_index.js'),
        this.destinationPath('bin/index.js'),
        this
      );
      if(this.lang === 'CoffeeScript') {
        this.fs.copy(
          this.templatePath('src/index.coffee'),
          this.destinationPath('src/'+this.commandName+'.coffee')
        );
        this.fs.copyTpl(
          this.templatePath('_.npmignore'),
          this.destinationPath('.npmignore'),
          this
        );
      }
      else if(this.lang === 'ES6') {
        this.fs.copy(
          this.templatePath('src/index.es6'),
          this.destinationPath('src/'+this.commandName+'.js')
        );
        this.fs.copyTpl(
          this.templatePath('_.npmignore'),
          this.destinationPath('.npmignore'),
          this
        );
      }
      else {
        this.fs.copy(
          this.templatePath('src/index.js'),
          this.destinationPath('src/'+this.commandName+'.js')
        );
      }
    },

  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = YargsGenerator;
