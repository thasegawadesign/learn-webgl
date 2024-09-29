import * as fs from 'fs';

const root = resolve(__dirname, 'src');
const pages = resolve(__dirname, 'src', 'pages');
const outDir = resolve(__dirname, 'dist');

const pageDirNameList = fs.readdirSync(pages);

const pageConfig = pageDirNameList.reduce((arr, pageName) => {
  arr[pageName] = resolve(root, 'pages', pageName, 'index.html');
  return arr;
}, {});

const pageListHtml = pageDirNameList
  .map(
    (pageName) =>
      `<li><a href="./pages/${pageName}/index.html">${pageName}</a></li>`
  )
  .join('');

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        /<ul id="pageIndex"><\/ul>/,
        `<ul id="pageIndex">${pageListHtml}</ul>`
      );
    },
  };
};

export default defineConfig({
  root,
  build: {
    outDir,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        ...pageConfig,
      },
    },
  },
  plugins: [htmlPlugin()],
});
