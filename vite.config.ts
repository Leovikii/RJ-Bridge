import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import UnoCSS from 'unocss/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'DLsite Plus',
        namespace: 'Leovikii',
        author: 'Leovikii',
        description: {
          '': 'Extract RJ codes on South Plus forums, automatically fetch and display DLSite work information.',
          'zh': '在南+论坛提取RJ号，自动获取并显示DLSite作品信息。',
          'zh-CN': '在南+论坛提取RJ号，自动获取并显示DLSite作品信息。'
        },
        match: [
          '*://*.south-plus.net/*',
          '*://*.spring-plus.net/*',
          '*://*.level-plus.net/*',
          '*://*.imoutolove.me/*'
        ],
        require: [
          'https://greasyfork.org/scripts/474128-dlsite-plus/code/DLsite%20Plus.user.js'
        ],
        icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='64' y2='64' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0%25' stop-color='%23f472b6'/%3E%3Cstop offset='100%25' stop-color='%233b82f6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='16' fill='url(%23g)'/%3E%3Ctext x='32' y='44' font-family='Arial,sans-serif' font-weight='900' font-size='32' fill='%23fff' text-anchor='middle' letter-spacing='1'%3ERJ%3C/text%3E%3C/svg%3E",
        version: '1.0.0',
        connect: [
          'dlsite.com',
          'media.ci-en.jp',
          '*'
        ],
        grant: [
          'GM_setClipboard',
          'GM_openInTab',
          'GM_setValue',
          'GM_getValue',
          'GM_deleteValue',
          'GM_addElement',
          'GM.xmlHttpRequest',
          'GM_xmlhttpRequest',
          'GM_registerMenuCommand',
          'GM_unregisterMenuCommand'
        ],
        'run-at': 'document-start',

      },
    }),
  ],
});
