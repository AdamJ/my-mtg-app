if(!self.define){let e,i={};const n=(n,f)=>(n=new URL(n+".js",f).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(f,r)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let a={};const o=e=>n(e,s),c={module:{uri:s},exports:a,require:o};i[s]=Promise.all(f.map((e=>c[e]||o(e)))).then((e=>(r(...e),a)))}}define(["./workbox-74f2ef77"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"25f44ee5c540ec2ff4f2430f9d074f62"},{url:"assets/index-B5inz6uQ.js",revision:null},{url:"assets/index-ShrEqmlM.css",revision:null},{url:"assets/mana-CylcniHU.svg",revision:null},{url:"assets/mplantin-D6SO6wSc.svg",revision:null},{url:"favicon.ico",revision:"d7044b52b88d12f2902a39dda73e561f"},{url:"index.html",revision:"edcade56b02ed346a76d99878193fd7b"},{url:"maskable-icon-512x512.png",revision:"42613de7beebf9b5013c33ff21dba0cf"},{url:"pwa-192x192.png",revision:"1ba8834526320cbf8e3ec711bf80ac4e"},{url:"pwa-512x512.png",revision:"d879bd82e07892719d4b3f6b5671d722"},{url:"pwa-64x64.png",revision:"b3180964f5ff4e22b8aeb9c1ef0f0671"},{url:"registerSW.js",revision:"8dbb98619cb1ae22ecfcdfdab53d0a08"},{url:"tap-icon.png",revision:"4f8702c61e42bc3fc048f93a7afa2621"},{url:"tap-icon.svg",revision:"9a498185810b511321458c121165c5f7"},{url:"tap-icon@2x.png",revision:"193b5d66eaa591a07d59fa3b0e85a746"},{url:"tap-icon@3x.png",revision:"a8cd525044d84253a0991bb2e8e3922e"},{url:"vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"apple-touch-icon-180x180.png",revision:"25f44ee5c540ec2ff4f2430f9d074f62"},{url:"favicon.ico",revision:"d7044b52b88d12f2902a39dda73e561f"},{url:"maskable-icon-512x512.png",revision:"42613de7beebf9b5013c33ff21dba0cf"},{url:"pwa-192x192.png",revision:"1ba8834526320cbf8e3ec711bf80ac4e"},{url:"pwa-512x512.png",revision:"d879bd82e07892719d4b3f6b5671d722"},{url:"pwa-64x64.png",revision:"b3180964f5ff4e22b8aeb9c1ef0f0671"},{url:"robots.txt",revision:"1030d9a1ea2224647585eefb7ba37e39"},{url:"tap-icon.png",revision:"4f8702c61e42bc3fc048f93a7afa2621"},{url:"tap-icon.svg",revision:"9a498185810b511321458c121165c5f7"},{url:"manifest.webmanifest",revision:"74fb7d269ff6a97590a717013763a5dd"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((({url:e})=>!!e.pathname.match(/^.*\.(?:eot|otf|woff|woff2|ttf|svg|png|jpe?g|gif|webp|ico|webm|mp3|mp4)$/i)),new e.CacheFirst({cacheName:"static-resources",plugins:[new e.ExpirationPlugin({maxEntries:30,maxAgeSeconds:31536e3})]}),"GET")}));
