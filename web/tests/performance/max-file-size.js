#!/usr/bin/env node
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */


/* eslint-disable import/no-commonjs*/
const fs = require('fs')
const path = require('path')
const walk = require('walk')
const chalk = require('chalk')
const gzipSize = require('gzip-size')

/* eslint-disable no-undef */
/* Path to build directory */
const buildDir = process.argv[2] || 'build'

/* Path to JSON containing file size thresholds */
const configFile = process.argv[3] || path.resolve(__dirname, 'gzip-size-config.json')

// A number denoting maximum file size in bytes.
const FILE_SIZE_LIMIT = parseInt(process.env.file_size_limit || process.env.npm_package_config_file_size_limit)

/**
Run the following with npm run test:max-file-size.
This test will traverse the build folder and verify that built files are smaller than a threshold defined in package.json's file_size_limit.
If a JSON containing file names and sizes (eg. gzip-size-config.json) is passed in,
it also verifies the gzipped files within the build folder against the maximum file sizes set in gzip-size-config.json
*/
const checkFileSize = function(buildDir, configFile) {
    let config
    let files
    /* Parse the JSON containing file names and their expected gzipped sizes */
    try {
        config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
        files = config.files
    } catch (e) {
        console.log(`Could not read JSON file at ${configFile}`)
        console.log(`Usage: npm run test:max-file-size path/to/build/directory path/to/config/json`)
    }
    let failure = false

    const options = {
        listeners: {
            file: (root, fileStats, next) => {
                const filePath = path.join(root, fileStats.name)
                const fileStat = fs.statSync(filePath)

                /* Checks each minified file - if it's over size limit before gzip compression */
                if (fileStat.size > FILE_SIZE_LIMIT) {
                    failure = true
                    console.log(chalk.red(`${filePath} is ${fileStat.size} bytes. It is too big!\n`))
                }

                if (config) {
                    /* Checks the file's gzipped size - if it's in the list of files in gzip-size-config.json */
                    for (const file in files) {
                        if (fileStats.name === file) {
                            /* Get the gzipped file size and parse gzip-size-config.json*/
                            const source = fs.readFileSync(filePath, 'utf8')
                            const gzipped = gzipSize.sync(source)
                            const fileMax = files[file]
                            if (gzipped > fileMax) {
                                failure = true
                                console.log(chalk.red(`${filePath} is ${gzipped} bytes when gzipped. It should be less than ${fileMax} bytes!\n`))
                            }
                        }
                    }
                }


                next()
            },
            errors: (root, nodeStatsArray, next) => {
                next()
            },
            end: () => {
                if (failure === false) {
                    console.log(chalk.green(`Success! All files are below the size threshold.`))
                } else {
                    console.log(chalk.red(`Run 'npm run analyze-build' to see what is contributing to large files.`))
                }
            }
        }
    }
    walk.walkSync(buildDir, options)

    if (failure) {
        process.exit(1)
    } else {
        process.exit(0)
    }
}

if (fs.existsSync(buildDir)) {
    console.log(`Verifying file sizes are below threshold...`)
    checkFileSize(buildDir, configFile)
} else {
    console.log(`Run 'npm run prod:build' to generate a build, then 'npm run test:max-file-size path/to/build/directory path/to/config/json'`)
}
