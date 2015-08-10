#!/usr/bin/env node
<%= lang !== 'JavaScript' ? "require('../lib/"+commandName+"');" : "require('../src/"+commandName+"');" %>
