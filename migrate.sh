#/bin/bash

cp ../tip-jar/svelte.config.js .
cp ../tip-jar/jsconfig.js .
cp ../tip-jar/vite.config.js .
cp ../tip-jar/src/app.postcss ./src/
rm -rf ./src/app.css 
cp ../tip-jar/src/app.html ./src 
npx svelte-migrate routes
npx svelte-add@latest tailwindcss
rm -rf ./package-lock.json node_modules
npm install