var TreeTagger = require("./");
var tagger = new TreeTagger();
tagger.tag("This is a test!", function (err, results) {
    console.log(results);
});
