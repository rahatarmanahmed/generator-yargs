# <%= commandName %>

<%= description %>

## Installation

To install from npm, run

`npm install -g <%= commandName %>`

## Usage

`<%= commandName %> args...`

 - `args...`: a list of arguments
 
<% if(lang !== 'JavaScript') { %>
## Building

To compile the source just run `npm run build`.
<% } %>
