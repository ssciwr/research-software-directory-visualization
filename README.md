# [ssciwr.github.io/research-software-directory-visualization](https://ssciwr.github.io/research-software-directory-visualization/)

[![Build and deploy to gh-pages](https://github.com/ssciwr/research-software-directory-visualization/actions/workflows/deploy.yml/badge.svg)](https://github.com/ssciwr/research-software-directory-visualization/actions/workflows/deploy.yml)

# Work in progress!

Prototype implementation for an interactive presentation of https://www.ssc.uni-heidelberg.de/en/research-software-directory

## Overview

Implemented in javascript and SVG using [svg.js](https://svgjs.dev/)

- [main](https://github.com/ssciwr/research-software-directory-visualization/tree/main) branch contains the source code
  - contents can be edited in [src/data/data.json](https://github.com/ssciwr/research-software-directory-visualization/blob/main/src/data/data.json)
- [gh-pages](https://github.com/ssciwr/research-software-directory-visualization/tree/gh-pages) branch contains the generated website
- uses [npm](https://www.npmjs.com/) and [webpack](https://webpack.js.org/) to manage the build and dependencies

## Online preview

On every commit to the main branch:

- [deploy.yml](https://github.com/ssciwr/research-software-directory-visualization/actions/workflows/deploy.yml) action builds website & deploys to the [gh-pages](https://github.com/ssciwr/research-software-directory-visualization/tree/gh-pages) branch
- github pages hosts these files at [ssciwr.github.io/research-software-directory-visualization](https://ssciwr.github.io/research-software-directory-visualization/)

## How to deploy

- copy the files from the [gh-pages](https://github.com/ssciwr/research-software-directory-visualization/tree/gh-pages) branch
- contents can be edited in [data.json](https://github.com/ssciwr/research-software-directory-visualization/blob/gh-pages/fileadmin/templates/iwr_vis/data.json)
- to change the location of the image files
  - edit [image_base_url](https://github.com/ssciwr/research-software-directory-visualization/blob/gh-pages/fileadmin/templates/iwr_vis/data.json#L2)
- to change the location of data.json
  - find `"fileadmin/templates/iwr_vis/data.json"` in [bundle.js](https://github.com/ssciwr/research-software-directory-visualization/blob/gh-pages/bundle.js) and replace with desired url

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

Other commands:

- remove any existing build
  - `npm run clean`
- build website in `dist` folder
  - `npm run build`
- start a http-server serving files from the `dist` folder at `http://localhost:8080/` & open in browser
  - `npm run serve`
- monitor changes to source code & automatically re-build modified files
  - `npm run autobuild`
