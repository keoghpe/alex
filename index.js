/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module alex
 * @fileoverview
 *   alex checks your (or someone else’s) writing for possible
 *   inconsiderate wording.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var bail = require('bail');
var mdast = require('mdast');
var bridge = require('mdast-util-to-nlcst');
var retext = require('retext');
var parser = require('retext-english');
var equality = require('retext-equality');
var sort = require('vfile-sort');

/*
 * Processor.
 */

var markdown = mdast();
var english = retext().use(parser).use(equality);

/**
 * alex.
 *
 * Read markdown as input, converts to natural language,
 * then detect violations.
 *
 * @example
 *   alex('We’ve confirmed his identity.').messages;
 *   // [ { [1:17-1:20: `his` may be insensitive, use `their`, `theirs` instead]
 *   //   name: '1:17-1:20',
 *   //   file: '',
 *   //   reason: '`his` may be insensitive, use `their`, `theirs` instead',
 *   //   line: 1,
 *   //   column: 17,
 *   //   fatal: false } ]
 *
 * @param {string|VFile} value - Content
 * @return {VFile} - Result.
 */
function alex(value) {
    var result;

    /*
     * All callbacks are in fact completely sync.
     */

    markdown.process(value, function (err, file) {
        bail(err);

        bridge(file);

        english.run(file);

        sort(file);

        result = file;
    });

    return result;
}

/*
 * Expose.
 */

module.exports = alex;
