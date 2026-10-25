(function(){
'use strict';

var CDN = 'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/';
var P   = window.SQD_PUZZLES;
var D   = window.SQD_DATA;
var TOTAL = P.length;

var db = null, refs = [], idx = 0, queries = 0;
var solved = {}, history = {};
var $ = function(id){ return document.getElementById(id); };
var STYLES = ['notionists','avataaars','bottts','pixel-art','adventurer'];
var LEVELS = ['Débutant','Intermédiaire','Avancé'];
var profile = {name:'Détective', avatar:{style:'notionists', seed:'Détective'}, level:0};
var avatarSalt = '';
var customAvatar = null;
var avatarBusy = false;

function isPhoto(avatar){
  return avatar && typeof avatar.photo === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(avatar.photo) && avatar.photo.length < 300000;
}
function importAvatar(file, statusId, apply){
  if(!file || avatarBusy) return;
  var status = $(statusId);
  if(!/^image\//.test(file.type) || file.size > 15*1024*1024){
    status.textContent = 'Choisis une image de moins de 15 Mo.';
    return;
  }
  avatarBusy = true;
  $('profileForm').querySelector('button[type="submit"]').disabled = true;
  status.textContent = 'Préparation de l’image…';
  var url = URL.createObjectURL(file);
  var img = new Image();
  function finish(){
    URL.revokeObjectURL(url);
    avatarBusy = false;
    $('profileForm').querySelector('button[type="submit"]').disabled = false;
  }
  img.onload = function(){
    try{
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = 256;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#14171c';
      ctx.fillRect(0,0,256,256);
      var side = Math.min(img.naturalWidth,img.naturalHeight);
      ctx.drawImage(img,(img.naturalWidth-side)/2,(img.naturalHeight-side)/2,side,side,0,0,256,256);
      apply({photo:canvas.toDataURL('image/jpeg',0.85)});
      status.textContent = 'Image enregistrée dans ce navigateur uniquement.';
    }catch(e){ status.textContent = 'Impossible d’enregistrer cette image. Essaie une autre image ou libère du stockage dans le navigateur.'; }
    finish();
  };
  img.onerror = function(){ status.textContent = 'Image illisible. Essaie un fichier JPG, PNG ou WebP.'; finish(); };
  img.src = url;
}

function avatarURL(avatar){
  if(isPhoto(avatar)) return avatar.photo;
  return 'https://api.dicebear.com/9.x/' + avatar.style + '/svg?seed=' + encodeURIComponent(avatar.seed);
}
function paintAvatar(id, name, avatar){
  var holder = $(id);
  var initials = name.trim().split(/\s+/).map(function(word){ return Array.from(word)[0]; }).slice(0,2).join('').toLocaleUpperCase('fr');
  holder.textContent = initials || 'D';
  holder.setAttribute('aria-label', id === 'playerAvatar' ? 'Importer une photo de profil pour ' + name : 'Avatar de ' + name);
  if(id !== 'playerAvatar') holder.setAttribute('role', 'img');
  var img = document.createElement('img');
  img.alt = '';
  img.referrerPolicy = 'no-referrer';
  img.onerror = function(){ img.remove(); };
  img.src = avatarURL(avatar);
  holder.appendChild(img);
}
function saveProfile(){
  try{ localStorage.setItem('sqd_profile', JSON.stringify(profile)); }catch(e){}
}
function renderProfile(){
  $('playerName').textContent = profile.name;
  $('levelBtn').textContent = 'Niveau : ' + LEVELS[profile.level];
  paintAvatar('playerAvatar', profile.name, profile.avatar);
}
function previewAvatar(){
  var name = $('detectiveName').value.trim() || 'Détective';
  var avatar = customAvatar || {style:$('avatarStyle').value, seed:name + avatarSalt};
  paintAvatar('avatarPreview', name, avatar);
  return avatar;
}
function randomSalt(){ return '-' + Math.random().toString(36).slice(2,10); }
function finishWelcome(skip){
  if(skip){
    profile = {name:'Détective', avatar:{style:STYLES[Math.floor(Math.random()*STYLES.length)], seed:'Détective' + randomSalt()}, level:0};
  }else{
    profile = {name:$('detectiveName').value.trim().slice(0,20) || 'Détective', avatar:previewAvatar(), level:Number(new FormData($('profileForm')).get('startLevel'))};
  }
  saveProfile();
  renderProfile();
  $('welcome').close();
  idx = todayIndex();
  if(db) render();
}
function initProfile(){
  var stored = null;
  try{ stored = JSON.parse(localStorage.getItem('sqd_profile')); }catch(e){}
  var valid = stored && typeof stored.name === 'string' && stored.name.trim() && [0,1,2].indexOf(stored.level) !== -1 && stored.avatar && (isPhoto(stored.avatar) || (STYLES.indexOf(stored.avatar.style) !== -1 && typeof stored.avatar.seed === 'string'));
  if(valid){ profile = {name:stored.name.trim().slice(0,20), avatar:stored.avatar, level:stored.level}; }
  renderProfile();
  $('detectiveName').addEventListener('input', function(){ avatarSalt = ''; previewAvatar(); });
  $('avatarStyle').onchange = function(){ customAvatar = null; $('avatarStatus').textContent = ''; previewAvatar(); };
  $('shuffleAvatar').onclick = function(){ customAvatar = null; avatarSalt = randomSalt(); $('avatarStatus').textContent = ''; previewAvatar(); };
  $('importAvatarBtn').onclick = function(){ $('avatarFile').click(); };
  $('avatarFile').onchange = function(){
    importAvatar(this.files[0], 'avatarStatus', function(avatar){
      // Vérifie la place disponible avant de valider la photo.
      localStorage.setItem('sqd_avatar_check', JSON.stringify(avatar));
      localStorage.removeItem('sqd_avatar_check');
      customAvatar = avatar;
      previewAvatar();
    });
    this.value = '';
  };
  $('playerAvatar').onclick = function(){ $('profileAvatarFile').click(); };
  $('profileAvatarFile').onchange = function(){
    importAvatar(this.files[0], 'profileAvatarStatus', function(avatar){
      var updated = {name:profile.name, avatar:avatar, level:profile.level};
      localStorage.setItem('sqd_profile', JSON.stringify(updated));
      profile = updated;
      renderProfile();
    });
    this.value = '';
  };
  $('profileForm').onsubmit = function(e){ e.preventDefault(); finishWelcome(false); };
  $('skipWelcome').onclick = function(){ finishWelcome(true); };
  $('welcome').addEventListener('cancel', function(e){ e.preventDefault(); finishWelcome(true); });
  $('levelBtn').onclick = function(){
    $('levelForm').elements.level.value = String(profile.level);
    $('levelDialog').showModal();
  };
  $('cancelLevel').onclick = function(){ $('levelDialog').close(); };
  $('levelForm').onsubmit = function(e){
    e.preventDefault();
    var level = Number(new FormData($('levelForm')).get('level'));
    if(level !== profile.level){
      profile.level = level;
      saveProfile();
      renderProfile();
      idx = todayIndex();
      if(db) render();
    }
    $('levelDialog').close();
    $('levelBtn').focus();
  };
  if(!valid){ previewAvatar(); $('welcome').showModal(); }
}

function load(){
  try{ solved  = JSON.parse(localStorage.getItem('sqd_solved')  || '{}'); }catch(e){ solved = {}; }
  try{ history = JSON.parse(localStorage.getItem('sqd_history') || '{}'); }catch(e){ history = {}; }
}
function save(){
  try{
    localStorage.setItem('sqd_solved',  JSON.stringify(solved));
    localStorage.setItem('sqd_history', JSON.stringify(history));
  }catch(e){}
}
function dayKey(d){
  d = d || new Date();
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}
function dayOfYear(){
  var n = new Date();
  return Math.floor((Date.UTC(n.getFullYear(),n.getMonth(),n.getDate()) - Date.UTC(n.getFullYear(),0,0)) / 864e5);
}
function todayIndex(){ return (dayOfYear() % 10) + profile.level * 10; }

function streak(){
  var s;
  try{ s = JSON.parse(localStorage.getItem('sqd_streak') || 'null'); }catch(e){ s = null; }
  var t = dayKey();
  if(!s){ s = {last:t, count:1}; }
  else if(s.last !== t){
    var y = new Date(); y.setDate(y.getDate()-1);
    s = {last:t, count: s.last === dayKey(y) ? s.count+1 : 1};
  }
  try{ localStorage.setItem('sqd_streak', JSON.stringify(s)); }catch(e){}
  return s.count;
}

function track(ev, props){
  if(typeof window.plausible === 'function') window.plausible(ev, {props: props || {}});
}
function msg(kind, html){
  var f = $('feedback');
  f.className = 'feedback ' + kind;
  f.innerHTML = html;
}
function showGrid(res){
  var g = $('grid');
  if(!res){ g.className = 'grid'; return; }
  var h = '<thead><tr>' + res.columns.map(function(c){
    return '<th>' + c + '</th>';
  }).join('') + '</tr></thead><tbody>';
  res.values.slice(0,15).forEach(function(r){
    h += '<tr>' + r.map(function(v){
      return '<td>' + (v === null ? 'NULL' : String(v)) + '</td>';
    }).join('') + '</tr>';
  });
  g.innerHTML = h + '</tbody>';
  g.className = 'grid on';
}
function unlocked(i){
  return i >= 0 && i < Math.min(TOTAL, (profile.level + 1) * 10);
}

function renderSchema(){
  $('schema').innerHTML = D.TABLES.map(function(t){
    var cols = t.cols.map(function(c){
      var k = (c === 'id' || /_id$/.test(c)) ? 'k' : '';
      return k ? '<span class="'+k+'">'+c+'</span>' : c;
    }).join(', ');
    return '<span class="t">'+t.name+'</span>('+cols+')';
  }).join('\n');
}

function renderHeader(){
  $('caseNum').textContent = String(idx+1).padStart(2,'0') + ' / ' + TOTAL;
  var s = 0;
  try{ s = JSON.parse(localStorage.getItem('sqd_streak')).count; }catch(e){}
  $('streakVal').textContent = s + ' j';
}

function render(){
  queries = 0;
  var p = P[idx];
  $('caseTag').textContent   = p.tag;
  $('caseId').textContent    = 'dossier ' + String(idx+1).padStart(2,'0');
  $('caseTitle').textContent = p.titre;
  $('caseBrief').innerHTML   = p.enonce;
  $('hintBox').textContent   = 'Indice : ' + p.indice;
  $('hintBox').className     = 'hint';
  $('feedback').className    = 'feedback';
  $('grid').className        = 'grid';
  $('editor').value = '';
  $('prevBtn').disabled = idx === 0;
  $('nextBtn').disabled = !unlocked(idx+1);

  renderHeader();

  if(solved[idx]){ showReport(); } else { $('report').className = 'report'; }
  renderArchive();
  track('case_open', {case: idx+1, tag: p.tag});
}

function renderArchive(){
  var a = $('archive'), h = '';
  for(var i=0;i<TOTAL;i++){
    var cls = 'chip';
    if(solved[i]) cls += ' done';
    if(!unlocked(i)) cls += ' locked';
    if(i === idx) cls += ' current';
    h += '<button type="button" class="'+cls+'" data-i="'+i+'" aria-label="Dossier '+(i+1)+(solved[i] ? ', résolu' : '')+'"'+(!unlocked(i) ? ' disabled' : '')+'>'+ (solved[i] ? '✓' : String(i+1).padStart(2,'0'))+'</button>';
  }
  a.innerHTML = h;
  Array.prototype.forEach.call(a.children, function(c){
    c.onclick = function(){
      var i = +c.dataset.i;
      if(unlocked(i)){ idx = i; render(); window.scrollTo({top:0, behavior:'smooth'}); }
    };
  });
}

function run(fromSolution){
  if(!db) return;
  var sql = $('editor').value.trim();
  if(!sql){ msg('ko','Écris une requête avant d\'exécuter.'); return; }

  var res;
  try{
    var out = db.exec(sql);
    res = out.length ? out[out.length-1] : null;
  }catch(e){
    msg('ko', '<b>Erreur SQL.</b> ' + String(e.message || e));
    showGrid(null); return;
  }
  if(!res){ msg('ko','Aucun résultat. As-tu bien utilisé <code>SELECT</code> ?'); showGrid(null); return; }

  showGrid(res);

  var exp = refs[idx];
  var n   = exp.columns.length;
  var A   = res.values.map(function(r){ return r.slice(0,n).map(String); });
  var B   = exp.values.map(function(r){ return r.map(String); });
  var ok;

  if(res.columns.length !== n || A.length !== B.length){ ok = false; }
  else if(P[idx].ordered){ ok = JSON.stringify(A) === JSON.stringify(B); }
  else{
    var srt = function(x){ return JSON.stringify(x.map(function(y){ return JSON.stringify(y); }).sort()); };
    ok = srt(A) === srt(B);
  }

  if(!fromSolution) queries++;
  track('query_run', {case: idx+1, ok: ok});

  if(ok){
    if(!solved[idx]){
      solved[idx] = true;
      history[dayKey()] = true;
      if(idx === todayIndex()) streak();
      save();
    }
    msg('ok', '<b>Affaire résolue.</b> ' + A.length + ' ligne' + (A.length>1?'s':'') + ', exactement ce qu\'il fallait.');
    if(window.confetti) window.confetti({particleCount:60, spread:55, origin:{y:.65}});
    renderHeader(); renderArchive(); showReport();
    track('puzzle_solved', {case: idx+1, queries: queries});
  }else{
    var extra = A.length !== B.length
      ? ' Ta requête renvoie ' + A.length + ' ligne' + (A.length>1?'s':'') + ', le dossier en attend ' + B.length + '.'
      : '';
    msg('ko', '<b>Pas encore.</b>' + extra + ' Relis la question et vérifie tes filtres.');
  }
}

function showReport(){
  var done = !!solved[idx];
  var grid = '';
  for(var d=6; d>=0; d--){
    var dt = new Date(); dt.setDate(dt.getDate()-d);
    grid += history[dayKey(dt)] ? '🟩' : '⬜';
  }
  var total = Object.keys(solved).length;
  var s = 0;
  try{ s = JSON.parse(localStorage.getItem('sqd_streak')).count; }catch(e){}

  var txt =
    profile.name + '\n' +
    'SQL Detective · dossier ' + String(idx+1).padStart(2,'0') + '/' + TOTAL + '\n' +
    (done ? '✅ résolu' + (queries ? ' en ' + queries + ' requête' + (queries>1?'s':'') : '') : '⬜ non résolu') + '\n' +
    grid + '\n' +
    'série : ' + s + ' jour' + (s>1?'s':'') + ' · ' + total + '/' + TOTAL + ' dossiers classés\n' +
    'Titre : ' + P[idx].titre + '\n' +
    'à toi de jouer : https://kevinjoseph-dataportfolio.github.io/sql-detective';

  $('reportCard').textContent = txt;
  $('report').className = 'report on';
}

function boot(){
  if(typeof initSqlJs !== 'function'){ setTimeout(boot, 150); return; }

  load();
  renderSchema();

  initSqlJs({ locateFile: function(f){ return CDN + f; } }).then(function(SQL){
    db = new SQL.Database();
    db.run(D.SEED.join('\n'));
    refs = P.map(function(p){ return db.exec(p.ref)[0]; });

    idx = todayIndex();
    if(solved[idx] === undefined && unlocked(idx)) streak();
    render();

    $('runBtn').onclick   = function(){ run(false); };
    $('hintBtn').onclick  = function(){ $('hintBox').classList.toggle('on'); };
    $('solBtn').onclick   = function(){ $('editor').value = P[idx].ref; run(true); };
    $('resetBtn').onclick = function(){
      db.run('DROP TABLE IF EXISTS suspects; DROP TABLE IF EXISTS alibis; DROP TABLE IF EXISTS transactions; DROP TABLE IF EXISTS vehicules;');
      db.run(D.SEED.join('\n'));
      msg('ko','Base réinitialisée.');
    };
    $('prevBtn').onclick    = function(){ if(idx>0){ idx--; render(); } };
    $('nextBtn').onclick    = function(){ if(unlocked(idx+1)){ idx++; render(); } };
    $('archiveBtn').onclick = function(){ $('archive').classList.toggle('on'); };
    $('copyBtn').onclick    = function(){
      var b = $('copyBtn');
      var t = $('reportCard').textContent;
      if(navigator.clipboard){
        navigator.clipboard.writeText(t).then(function(){
          b.textContent = 'Copié';
          setTimeout(function(){ b.textContent = 'Copier'; }, 1400);
        });
      }
      track('share_click', {case: idx+1});
    };
    $('editor').addEventListener('keydown', function(e){
      if((e.ctrlKey || e.metaKey) && e.key === 'Enter'){ e.preventDefault(); run(false); }
    });

    track('game_start');
  }).catch(function(e){
    $('caseTitle').textContent = 'Moteur SQLite indisponible';
    $('caseBrief').textContent = String(e);
  });
}

initProfile();
boot();
})();

