[![Build Status](https://img.shields.io/circleci/project/14nrv/serverless-lambda-stripe/dev.svg "Build Status")](https://circleci.com/gh/14nrv/serverless-lambda-stripe/tree/dev)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ab7adeab82d742094951/test_coverage)](https://codeclimate.com/github/14nrv/serverless-lambda-stripe/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/ab7adeab82d742094951/maintainability)](https://codeclimate.com/github/14nrv/serverless-lambda-stripe/maintainability)

# serverless-lambda-stripe

## Build Setup
``` bash
# install dependencies
$ yarn global add serverless
$ yarn install
```

## Usage

To run unit tests on your local

``` bash
$ yarn test
```

To run a function on your local

``` bash
$ sls invoke local --function createCharge
```

To simulate API Gateway locally using [serverless-offline](https://github.com/dherault/serverless-offline)

``` bash
$ yarn dev
````

Deploy to aws with node v8.10

``` bash
$ yarn deploy
```
