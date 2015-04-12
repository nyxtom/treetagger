/*
 * treetagger
 * https://github.com/nyxtom/treetagger
 *
 * Copyright (c) 2015 Thomas Holloway, Mathieu Prevel
 * Licensed under the MIT license.
 */

'use strict';

var events = require('events'),
    util = require('util'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn;

var languages = {
    'utf8': [ 'bulgarian', 'english', 'finnish', 'galician', 'italian', 'polish', 'slovak',
	'swahili', 'dutch', 'estonian', 'french', 'german', 'latin', 'russian' , 'spanish' ]
};

function TreeTagger(options) {
    events.EventEmitter.call(this);
    this.options = options || {};
    this.encoding = this.options.encoding || 'utf8';
    this.language = this.options.language || 'english';
    this.paths = ['.', '/usr/bin', '/usr/local/bin', '/opt/local/bin',
                  '/Applications/bin', '~/bin', '~/Applications/bin' ];
    this.envVars = ["TREETAGGER", "TREETAGGER_HOME"];

    // Validate the given encoding and language selected
    if (!this.encoding in languages) {
        throw new Error("Unsupported encoding detected " + this.encoding);
    }
    if (languages[this.encoding].indexOf(this.language) < 0) {
        throw new Error("Unsupported language detected " + this.language + " for encoding " + this.encoding);
    }

    // Set the appropriate bin path
    this.binPath = 'tree-tagger-' + this.language;

    this.binPath = findPath(this.binPath, this.paths, this.envVars);
};

TreeTagger.prototype.split = function (text) {
    var results = [];
    var lines = text.trim().split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var items = line.split('\t');
        var item = {};
        item.t = items[0];
        item.pos = items[1];
        item.l = items[2];
        results.push(item);
    }
    return results;
};

TreeTagger.prototype.tag = function (text, callback) {
    var proc = spawn(this.binPath);
    var stdout = [], stderr = [], size = 0;
    var _this = this;
    proc.stdout.on('data', function (buffer) {
        size += buffer.length;
        stdout[stdout.length] = buffer;
    });
    proc.stderr.on('data', function (buffer) {
        stderr[stderr.length] = buffer;
    });
    proc.on('error', function (err) {
        callback(err);
    });
    var exitCode;
    proc.on('exit', function (code) {
        exitCode = code;
    });
    proc.on('close', function () {
        if (exitCode > 0) {
            callback(new Error(stderr.join("")));
        }
        else {
            var buffer = new Buffer(size);
            var start = 0;
            for (var i = 0, l = stdout.length; i < l; i++) {
                var chunk = stdout[i];
                chunk.copy(buffer, start);
                start += chunk.length;
            }
            var output = buffer.toString();
            var results = _this.split(output);
            callback(null, results);
        }
    });

    proc.stdin.setEncoding(_this.encoding)
    proc.stdin.write(text);
    proc.stdin.end();
};

function findPath(binName, paths, envVars) {
    for (var i = 0; i < paths.length; i++) {
        var p = path.join(paths[i], binName);
        if (fs.existsSync(p)) {
            return p;
        }
    }

    for (var i = 0; i < envVars.length; i++) {
        var envVar = envVars[i];
        if (envVar in process.env) {
            var p = path.join(process.env[envVar], binName);
            if (fs.existsSync(p)) {
                return p;
            }
        }
    }

    throw new Error(binName + " was not found on the executable PATH directive");
};

module.exports = TreeTagger;
