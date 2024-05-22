# [ssciwr.github.io/research-software-directory-visualization](https://ssciwr.github.io/research-software-directory-visualization/)

[![Build and deploy to gh-pages](https://github.com/ssciwr/research-software-directory-visualization/actions/workflows/deploy.yml/badge.svg)](https://github.com/ssciwr/research-software-directory-visualization/actions/workflows/deploy.yml)

An interactive visualization of the [SSC Research Software Directory](https://www.ssc.uni-heidelberg.de/en/research-software-directory)

The data used to generate it can be edited at [ssciwr/research-software-directory/data.yml](https://github.com/ssciwr/research-software-directory/blob/main/data.yml)

## Overview

Implemented in javascript and SVG using [svg.js](https://svgjs.dev/)

## Deployment

On every commit to the main branch, the [deploy.yml](https://github.com/ssciwr/research-software-directory-visualization/actions/workflows/deploy.yml) action builds website & deploys to gh-pages at [ssciwr.github.io/research-software-directory-visualization](https://ssciwr.github.io/research-software-directory-visualization/)

## How to build and edit locally

Initial setup:

- clone this repo
  - `git clone https://github.com/ssciwr/research-software-directory-visualization.git`
  - `cd research-software-directory-visualization`
- (optional) install pre-commit to auto-format code
  - `pip install pre-commit`
  - `pre-commit install`
- install [pnpm](https://pnpm.io/installation)
  - windows: `iwr https://get.pnpm.io/install.ps1 -useb | iex`
  - linux/macOS: `curl -fsSL https://get.pnpm.io/install.sh | sh -`
- install website dependencies
  - `pnpm install`

To build from source, start local http-server, open website in browser, monitor & re-build modified source files:

- `pnpm start`
