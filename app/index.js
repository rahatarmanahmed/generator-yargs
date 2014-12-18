'use strict';
var util = require('util');
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var defaultBaseName = path.basename(process.cwd())

var YargsGenerator = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.option('coffee', {
      desc: 'Generate a project for CoffeeScript',
      type: 'boolean',
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
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.template('_package.json', this.pathPrefix+'package.json');
      this.template('_.gitignore', this.pathPrefix+'.gitignore');
      this.template('_.npmignore', this.pathPrefix+'.npmignore');
      this.template('_README.md', this.pathPrefix+'README.md');
      this.dest.mkdir(this.pathPrefix+'bin');
      this.template('bin/_index.js', this.pathPrefix+'bin/index.js');
      this.dest.mkdir(this.pathPrefix+'src');
      if(this.useCoffee)
      {
        this.src.copy('Gruntfile.coffee', this.pathPrefix+'Gruntfile.coffee')
        this.src.copy('src/index.coffee', this.pathPrefix+'src/'+this.commandName+'.coffee');
      }
      else
      {
        this.src.copy('src/index.js', this.pathPrefix+'src/'+this.commandName+'.js');
      }
    },

  },

  end: function () {
    var npmdir = process.cwd() + '/' + this.pathPrefix;
    process.chdir(npmdir);
    this.installDependencies();
  }
});

module.exports = YargsGenerator;
