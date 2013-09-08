# treetagger 

Node.js module for interfacing with the TreeTagger toolkit by Helmut Schmid.

## Getting Started
Install the module with: `npm install treetagger`

```javascript
var treetagger = require('treetagger');
treetagger.tag("This is a test!", function (err, results) {
    console.log(results);
});

/*
[ { t: 'This', pos: 'DT', l: 'this' },
  { t: 'is', pos: 'VBZ', l: 'be' },
  { t: 'a', pos: 'DT', l: 'a' },
  { t: 'test', pos: 'NN', l: 'test' },
  { t: '!', pos: 'SENT', l: '!' } ]
*/

```

## License
Copyright (c) 2013 Thomas Holloway  
Licensed under the MIT license.
