#!/usr/bin/env node
<%= useCoffee ? "require('../lib/"+commandName+"');" : "require('../src/"+commandName+"');" %>