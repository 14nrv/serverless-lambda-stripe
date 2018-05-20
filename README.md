# serverless-lambda-stripe

## Build Setup
``` bash
# install dependencies
$ yarn global add serverless
$ yarn install
```

## Usage

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
