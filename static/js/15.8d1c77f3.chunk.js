(this["webpackJsonpdeixa-xastro-minting-dapp"]=this["webpackJsonpdeixa-xastro-minting-dapp"]||[]).push([[15],{1550:function(n,r){},1836:function(n,r,t){"use strict";t.r(r),function(n){t.d(r,"getED25519Key",(function(){return o}));var a=t(33),e=t(1621),i=t.n(e).a.lowlevel;function o(r){var t;t="string"===typeof r?n.from(r,"hex"):r;var e=new Uint8Array(64),o=[i.gf(),i.gf(),i.gf(),i.gf()],c=new Uint8Array([].concat(Object(a.a)(new Uint8Array(t)),Object(a.a)(new Uint8Array(32)))),f=new Uint8Array(32);i.crypto_hash(e,c,32),e[0]&=248,e[31]&=127,e[31]|=64,i.scalarbase(o,e),i.pack(f,o);for(var s=0;s<32;s+=1)c[s+32]=f[s];return{sk:n.from(c),pk:n.from(f)}}}.call(this,t(26).Buffer)}}]);
//# sourceMappingURL=15.8d1c77f3.chunk.js.map