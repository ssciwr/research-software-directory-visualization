# [ssciwr.github.io/research-software-directory-visualization](https://ssciwr.github.io/research-software-directory-visualization/)

[![Build and deploy to gh-pages](https://github.com/ssciwr/research-software-directory-visualization/actions/workflows/deploy.yml/badge.svg)](https://github.com/ssciwr/research-software-directory-visualization/actions/workflows/deploy.yml)

# Work in progress!

Prototype of an interactive visualization of the [SSC Research Software Directory](https://www.ssc.uni-heidelberg.de/en/research-software-directory)

## Overview

Implemented in javascript and SVG using [svg.js](https://svgjs.dev/)

- [main](https://github.com/ssciwr/research-software-directory-visualization/tree/main) branch contains the source code
  - contents can be edited in [src/data/data.json](src/data/data.json)
- [gh-pages](https://github.com/ssciwr/research-software-directory-visualization/tree/gh-pages) branch contains the generated website
- uses [npm](https://www.npmjs.com/) and [webpack](https://webpack.js.org/) to manage the build and dependencies

## Online preview

On every commit to the main branch:

- [deploy.yml](https://github.com/ssciwr/research-software-directory-visualization/actions/workflows/deploy.yml) action builds website & deploys to the [gh-pages](https://github.com/ssciwr/research-software-directory-visualization/tree/gh-pages) branch
- github pages hosts these files at [ssciwr.github.io/research-software-directory-visualization](https://ssciwr.github.io/research-software-directory-visualization/)

## How to build and view locally

Initial setup:

- clone this repo
  - `git clone https://github.com/ssciwr/research-software-directory-visualization.git`
  - `cd research-software-directory-visualization`
- (optional) install pre-commit to auto-format code
  - `pip install pre-commit`
  - `pre-commit install`
- install node
  - macOS: `brew install node`
  - windows: https://nodejs.org/en/
  - ubuntu: `sudo apt install nodejs npm`
  - conda: `conda install nodejs -c conda-forge`
- install website node dependencies
  - `npm install`

To build from source, start local http-server, open website in browser, monitor & re-build modified source files:

- `npm start`
