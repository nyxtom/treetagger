# treetagger [![Build Status](https://secure.travis-ci.org/nyxtom/treetagger.png?branch=master)](http://travis-ci.org/nyxtom/treetagger)

Node.js module for interfacing with the TreeTagger toolkit by Helmut Schmid.

## Getting Started
Install the module with: `npm install treetagger`

```javascript
var treetagger = require('treetagger');
treetagger.tag("This is a test!", function (err, buffer) {
    console.log(buffer.toString());
});

/*
This  DT  this
is  VBZ be
a   DT  a
test    NN  test
!   SENT    !
*/

```

## License
Copyright (c) 2013 Thomas Holloway  
Licensed under the MIT license.
