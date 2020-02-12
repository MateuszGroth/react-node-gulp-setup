# React with node+express+ejs using gulp

### Pros

- style injection instead of realoading the browser
- easy changes to `gulpfile.js`
- uses browsersync

### Cons

- has to create temporary js files to browserify them after
- can not split js files into chunks to `lazy load` them after

## Setup

> start node server on first cmd

```shell
    node index.js
```

> start gulp on second cmd

```shell
    npm run gulp
```
