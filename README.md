# node-sass-endpoint

Easily serve a SASS file as CSS from an express endpoint. No grunt/gulp, no build files, no required configuration – just pure data.

### Dependencies

- [node-sass](https://www.npmjs.com/package/node-sass) (taken care of by npm install)
- ES6 `Set` and `Object.assign` (either use node v4.0+ or a polyfill)

## Usage

The easy version:

```javascript
// server.js
var sass = require('node-sass-endpoint');
var app  = express();

app.get('/app.css',
  sass.serve('./client/app.scss'));

console.log("Listening on port 5555...");
app.listen(5555);
```

Now any GET request to `localhost:5555/app.css` will compile and serve the SASS file located at `./client/app.scss`. Any `@import` statements within `app.scss` will be included in the `app.css` output.

## Advanced Usage

```javascript
app.get(
  '/app.css',
  sass.serve('./client/app.scss', {
    watchDir: './client/',       // <-- defaults to parent folder of scss file
    includePaths: ['./client/'], // <-- defaults to parent folder of scss file
    debug: false                 // <-- defaults to false
  })
);
```
