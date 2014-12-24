rmdir /S /Q build

mkdir build
cp index.html ./build/index.html
cp ./css/base.css ./build/base.css

browserify ./src/app.js -t [reactify --es6] -do ./build/bundle.js

// ./node_modules/.bin/server

