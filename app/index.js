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
  },

  prompting: function () {
    var done = this.async();

    this.useCoffee = this.options['coffee'];

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

    if(!this.useCoffee)
      prompts.push({
        type: 'confirm',
        name: 'useCoffee',
        message: 'Would you like to use CoffeeScript?',
        default: false
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
        this.templatePath('_.npmignore'),
        this.destinationPath('.npmignore'),
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
      if(this.useCoffee) {
        this.fs.copy(
          this.templatePath('src/index.coffee'),
          this.destinationPath('src/'+this.commandName+'.coffee')
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
