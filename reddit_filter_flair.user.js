// ==UserScript==
// @name         Reddit - Filter Flair
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/Reddit-Filter-Flair/raw/master/reddit_filter_flair.user.js
// @version      1.0
// @author       LenAnderson
// @match        https://www.reddit.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    let hide = JSON.parse(localStorage.getItem('reddit-filterFlair-hides')||'[]');

    Array.from(document.querySelectorAll('#siteTable > .thing')).forEach(thing => {
        let flairEl = thing.querySelector('.linkflairlabel');
        let sub = thing.getAttribute('data-subreddit').toLowerCase();
        if (flairEl) {
            let flair = flairEl.title.toLowerCase();
            if (hide.find(it => (it.sub.toLowerCase()==sub || it.sub=='') && it.flair.toLowerCase() == flair)) {
                thing.style.display = 'none';
                if (localStorage.getItem('reddit-filterFlair-showTiny')==1) {
                    let clone = flairEl.cloneNode(true);
                    let tiny = document.createElement('div');
                    tiny.style.opacity = '0.5';
                    clone.style.cursor = 'pointer';
                    flairEl.style.cursor = 'pointer';
                    clone.addEventListener('click', ()=>{
                        thing.style.display = thing.style.display=='none' ? '' : 'none';
                        tiny.style.display = thing.style.display=='none' ? '' : 'none';
                    });
                    flairEl.addEventListener('click', ()=>{
                        thing.style.display = thing.style.display=='none' ? '' : 'none';
                        tiny.style.display = thing.style.display=='none' ? '' : 'none';
                    });
                    tiny.appendChild(clone);
                    tiny.appendChild(document.createTextNode(thing.querySelector('.title').textContent.trim()));
                    thing.parentElement.insertBefore(tiny, thing);
                }
            }
        }
    });


    let tinyCmd;
    let addShowTinyCmd;
    let addHideTinyCmd;
    addShowTinyCmd = ()=>{
        tinyCmd = GM_registerMenuCommand('Show where posts where hidden', ()=>{
            localStorage.setItem('reddit-filterFlair-showTiny', 1);
            GM_unregisterMenuCommand(tinyCmd);
            addHideTinyCmd();
        });
    };
    addHideTinyCmd = ()=>{
        tinyCmd = GM_registerMenuCommand("Don't show where posts where hidden", ()=>{
            localStorage.setItem('reddit-filterFlair-showTiny', 0);
            GM_unregisterMenuCommand(tinyCmd);
            addShowTinyCmd();
        });
    };
    (localStorage.getItem('reddit-filterFlair-showTiny')==1 ? addHideTinyCmd : addShowTinyCmd)();

    GM_registerMenuCommand('Configure flairs to hide', ()=>{
        let window = open('about:blank', 'Reddit - Filter Flair - Preferences', 'resizable,innerHeight=800,innerWidth=555,centerscreen,menubar=no,toolbar=no,location=no');
        let body = window.document.body;
        let hides = JSON.parse(localStorage.getItem('reddit-filterFlair-hides')||'[]');
        hides.forEach(h=>{
            let row = document.createElement('div'); {
                row.classList.add('row');
                let sub = document.createElement('input'); {
                    sub.placeholder = 'subreddit (leave empty for all)';
                    sub.style.width = '200px';
                    sub.name = 'sub';
                    sub.value = h.sub;
                    row.appendChild(sub);
                }
                let flair = document.createElement('input'); {
                    flair.placeholder = 'flair';
                    flair.style.width = '200px';
                    flair.name = 'flair';
                    flair.value = h.flair;
                    row.appendChild(flair);
                }
                let rem = document.createElement('button'); {
                    rem.textContent = 'X';
                    rem.addEventListener('click', ()=>row.remove());
                    row.appendChild(rem);
                }
                body.appendChild(row);
            }
        });
        let acts = document.createElement('div'); {
            let add = document.createElement('button'); {
                add.textContent = 'Add Flair';
                add.addEventListener('click', ()=>{
                    let row = document.createElement('div'); {
                        row.classList.add('row');
                        let sub = document.createElement('input'); {
                            sub.placeholder = 'subreddit (leave empty for all)';
                    sub.style.width = '200px';
                            sub.name = 'sub';
                            row.appendChild(sub);
                        }
                        let flair = document.createElement('input'); {
                            flair.placeholder = 'flair';
                            flair.style.width = '200px';
                            flair.name = 'flair';
                            row.appendChild(flair);
                        }
                        let rem = document.createElement('button'); {
                            rem.textContent = 'X';
                            rem.addEventListener('click', ()=>row.remove());
                            row.appendChild(rem);
                        }
                        body.insertBefore(row, acts);
                    }
                });
                acts.appendChild(add);
            }
            let save = document.createElement('button'); {
                save.textContent = 'Save';
                save.addEventListener('click', ()=>{
                    localStorage.setItem('reddit-filterFlair-hides', JSON.stringify(Array.from(body.querySelectorAll('.row')).map(row=>{
                        return {
                            sub: row.querySelector('[name="sub"]').value.trim(),
                            flair: row.querySelector('[name="flair"]').value.trim()
                        };
                    })));
                });
                acts.appendChild(save);
            }
            body.appendChild(acts);
        }
    });
})();;
