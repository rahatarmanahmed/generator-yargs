'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var YargsGenerator = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.option("coffee", {
      desc: "Generate a project for CoffeeScript",
      type: "boolean",
      default: false
    });
  },

  initializing: function () {
    this.pkg = require('../package.json');
    
  },

  prompting: function () {
    var done = this.async();

    this.useCoffee = !!this.options['coffee'];

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the great Yargs command generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'author',
        message: 'Who is the author?',
        default: "Linus Torvalds"
      },
      {
        type: 'input',
        name: 'commandName',
        message: 'What should your command be called?',
        default: "rm-rf-slash"
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe what your command does.',
        default: "Formats your hard drive."
      }
    ];

    if(!this.useCoffee)
      prompts.push({
        type: 'confirm',
        name: 'useCoffee',
        message: "Would you like to use CoffeeScript?",
        default: false
      })

    this.prompt(prompts, function (props) {
      for(var key in props){
        this[key] = props[key];
      }
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.template('_package.json', 'package.json');
      this.template('.gitignore', '.gitignore');
      this.template('.npmignore', '.npmignore');
      this.dest.mkdir('src');

      if(this.useCoffee)
      {
        this.src.copy('Gruntfile.coffee', 'Gruntfile.coffee')
        this.src.copy('src/index.coffee', 'src/index.coffee');
      }
      else
      {
        this.src.copy('src/index.js', 'src/index.js');
      }
    },

  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = YargsGenerator;
