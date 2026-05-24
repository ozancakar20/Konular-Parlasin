// ==UserScript==
// @name         Yeni Konular Parlasın
// @namespace    https://greasyfork.org/tr/users/1558243
// @version      2.0
// @description  Technopat, DonanımArşivi, Techolay için çeşitli görsel geliştirmeler yapar.
// @author       XanthiN
// @match        https://www.technopat.net/sosyal/*
// @match        https://forum.donanimarsivi.com/*
// @match        https://techolay.net/sosyal/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561979/Yeni%20Konular%20Parlas%C4%B1n.user.js
// @updateURL https://update.greasyfork.org/scripts/561979/Yeni%20Konular%20Parlas%C4%B1n.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */

(function () {

    'use strict';

    const a = 1 * 60 * 60; // 1 saatin saniye cinsinden değeri a değişkenine atandı.
    const b = 4 * 60 * 60; // 4 saatin saniye cinsinden değeri b değişkenine atandı.
    const c = 24 * 60 * 60; // 24 saatin saniye cinsinden değeri c değişkenine atandı.

    // bu fonksiyon, time elementinin data-timestamp değerini okuyup sayıya çevirir.
    function getTimestamp(timeEl){return parseInt(timeEl.getAttribute('data-timestamp'), 10);}

    // ___ ANA FONKSİYON BAŞLANGICI ___
    function runScript() {

        // Date.now şimdiki zamanı Unix timestamp olarak verir, bine bölmek milisaniye cinsine çevirir, Math.floor ondalık kısmı atıp aşağı yuvarlar. Değer now değişkenine atanır
        const now = Math.floor(Date.now() / 1000);

        // ----- GENEL ARKA PLAN RENKLENDİRME İŞLEMLERİ -----

        // Sayfalardaki konu satırlarını seçen bir döngüye başlar.
        document.querySelectorAll('.structItem.structItem--thread, li._xgtIstatistik-satir').forEach(item => {
            // script her çalıştığında önce renklendirmeleri temizler.
            item.style.boxShadow = '';
            item.style.borderLeft = '';
            item.style.borderRight = '';
            item.style.opacity = '';
            // script her çalıştığında önce etiketleri temizler.
            const eskiIkon = item.querySelector('._hotIkon');
            if (eskiIkon) eskiIkon.remove();
            // bu elemente uygun sabit konular varsa bunları atlar. (Technopat için)
            if (item.classList.contains('structItem--sticky')) return;
            // satırdaki zaman elementini bulur ve timeEl değişkenine atar, element yoksa atlar.
            const timeEl = item.querySelector('time.u-dt');
            if (!timeEl) return;
            // zaman elementinin timestamp değerini alır ve geçersiz timestamp ise bu satırı atlar.
            const timestamp = getTimestamp(timeEl);
            if (!timestamp) return;
            // konunun açılma yaşının kaç saniye olduğunu hesaplar ve değeri tarih değişkenine atar.
            const tarih = now - timestamp;

            // eğer konu tarihi şimdiki tarihten ileri ise arka planı gri olsun, değilse alttaki şartlardan devan eder. (DA'da sabit konu demek)
            if (timestamp > now) {
                // gri renk ve opaklığa ait css stil ayarlamaları.
                item.style.boxShadow = 'inset 0 0 0 9999px rgba(128,128,128,0.5)';
                item.style.opacity = '0.25';
                return;
            }

            // etiketlerin görüneceği meta alanını konumlandıran fonksiyon
            function etiketAlani(metaHucre) {
                if (!metaHucre || metaHucre.querySelector('._hotIkon')) {return false;}
                metaHucre.style.position = 'relative';
                metaHucre.style.overflow = 'hidden';
                metaHucre.querySelectorAll('dl').forEach(dl => {
                    dl.style.position = 'relative';
                    dl.style.top = '-10px';
                });
                return true;
            }

            // konunun cevap sayısını alan fonksiyon
            function alCevapSayisi(item) {
                const cevapEl = item.querySelector('.structItem-cell--meta dl:first-child dd');
                if (!cevapEl) {return 0;}
                const text = cevapEl.textContent.trim().toUpperCase();
                if (/[A-Z]/.test(text)) {return 1000;}
                return parseInt(text, 10) || 0;
            }

            // eğer konu tarihi 0 ile 1 saat aralığında ise
            if (tarih <= a) {
                // koyu kırmızı arka plan + her iki kenarda kırmızı çizgi basılır.
                item.style.boxShadow =   'inset 0 0 0 9999px rgba(255,0,0,0.3)';
                item.style.borderLeft =  '2px solid rgba(255,0,0,1)';
                item.style.borderRight = '2px solid rgba(255,0,0,1)';
                // eğer konu en az 10 mesaj almış ise textContent'deki etiketi basar.
                if (item.classList.contains('structItem--thread')) {
                    if (alCevapSayisi(item) >= 10) {
                        const metaHucre = item.querySelector('.structItem-cell--meta');
                        if (etiketAlani(metaHucre)) {
                            const ikon = document.createElement('div');
                            ikon.className = '_hotIkon';
                            ikon.style.cssText = ` position:absolute; bottom:3px; left:50%; transform:translateX(-50%); text-align:center; font-size:10px; font-weight:bold; color:rgba(255,0,0,1); background:rgba(255,0,0,0.25); border-radius:10px; padding:0.5px 5px; pointer-events:none; white-space:nowrap; `;
                            ikon.textContent = 'HIZLI YÜKSELİYOR 🚀';
                            metaHucre.appendChild(ikon);
                        }
                    }
                }
            }

            // eğer konu tarihi 1 ile 4 saat aralığında ise
            else if (tarih <= b) {
                // koyu yeşil arka plan + her iki kenarda yeşil çizgi basılır.
                item.style.boxShadow =   'inset 0 0 0 9999px rgba(0,255,0,0.3)';
                item.style.borderLeft =  '2px solid rgba(0,255,0,1)';
                item.style.borderRight = '2px solid rgba(0,255,0,1)';
                // eğer konu en az 20 mesaj almış ise textContent'deki etiketi basar.
                if (item.classList.contains('structItem--thread')) {
                    if (alCevapSayisi(item) >= 20) {
                        const metaHucre = item.querySelector('.structItem-cell--meta');
                        if (etiketAlani(metaHucre)) {
                            const ikon = document.createElement('div');
                            ikon.className = '_hotIkon';
                            ikon.style.cssText = ` position:absolute; bottom:3px; left:50%; transform:translateX(-50%); text-align:center; font-size:10px; font-weight:bold; color:rgba(0,255,0,1); background:rgba(255,165,0,0.5); border-radius:10px; padding:0.5px 5px; pointer-events:none; white-space:nowrap; `;
                            ikon.textContent = 'DİKKAT ÇEKİYOR ⚡';
                            metaHucre.appendChild(ikon);
                        }
                    }
                }
            }

            // eğer konu tarihi 4 ile 24 saat aralığında ise
            else if (tarih <= c) {
                // orta koyulukta yeşil arka plan basılır.
                item.style.boxShadow = 'inset 0 0 0 9999px rgba(0,255,0,0.125)';
                // eğer konu en az 30 mesaj almış ise textContent'deki etiketi basar.
                if (item.classList.contains('structItem--thread')) {
                    if (alCevapSayisi(item) >= 30) {
                        const metaHucre = item.querySelector('.structItem-cell--meta');
                        if (etiketAlani(metaHucre)) {
                            const ikon = document.createElement('div');
                            ikon.className = '_hotIkon';
                            ikon.style.cssText = ` position:absolute; bottom:3px; left:50%; transform:translateX(-50%); text-align:center; font-size:10px; font-weight:bold; color:rgba(0,255,0,1); background:rgba(255,165,0,0.33); border-radius:10px; padding:0.5px 5px; pointer-events:none; white-space:nowrap; `;
                            ikon.textContent = 'POPÜLER KONU 🔥';
                            metaHucre.appendChild(ikon);
                        }
                    }
                }
            }

            // 24 saatten eski ise
            else {
                // eğer konu en az 50 mesaj almış ise textContent'deki etiketi basar.
                if (item.classList.contains('structItem--thread')) {
                    if (alCevapSayisi(item) >= 50) {
                        const metaHucre = item.querySelector('.structItem-cell--meta');
                        if (etiketAlani(metaHucre)) {
                            const ikon = document.createElement('div');
                            ikon.className = '_hotIkon';
                            ikon.style.cssText = ` position:absolute; bottom:3px; left:50%; transform:translateX(-50%); text-align:center; font-size:10px; font-weight:bold; color:rgba(255,255,255,1); background:rgba(128,128,128,0.25); border-radius:10px; padding:0.5px 5px; pointer-events:none; white-space:nowrap; `;
                            ikon.textContent = 'ÇOK KONUŞULAN 💬';
                            metaHucre.appendChild(ikon);
                        }
                    }
                }
            }
        });

        // ----- DONANIM ARŞİVİ ANA SAYFADAKİ SEKMELERE ÖZEL İŞLEMLER -----

        if (location.hostname === 'forum.donanimarsivi.com') {
            // ana sayfa sekmelerindeki tüm konu satırlarını seçen bir döngüye başlar.
            document.querySelectorAll('li._xgtIstatistik-satir').forEach(item => {
                // satırdaki zaman elementini bulur ve timeEl değişkenine atar, element yoksa atlar.
                const timeEl = item.querySelector('time.u-dt');
                if (!timeEl) return;
                // zaman elementinin timestamp değerini alır ve timestamp değişkenine atar.
                const timestamp = getTimestamp(timeEl);
                // timestamp geçerli mi diye tekrar kontrol eder.
                if (!timestamp) return;
                // timestamp ileri tarihli ise veya 24 saatten eskiyse etiketi eklemeden atlar.
                if (timestamp > now || now - timestamp > c) return;
                // etiketin ekleneceği item elementi içindeki uygun classlara sahip hücreleri bulup zamanHucresi değişkenine atar.
                const zamanHucresi = item.querySelector('div._xgtIstatistik-satir--hucre._xgtIstatistik-satir--zaman');
                // zamanHucresi var mı bakar ve daha önce etiket eklenmemiş ise devam eder.
                if (zamanHucresi && !zamanHucresi.querySelector('._sonMesajEtiketi')) {
                    // Uyarı etiketini oluşturur.
                    const etiket = document.createElement('div');
                    // tekrar eklenmemesi için kontrol amacıyla etikete class atanır.
                    etiket.className = '_sonMesajEtiketi';
                    // basılacak etiket mesajına ait çeşitli css stil ayarlamaları.
                    etiket.style.cssText = `position:absolute; left:50%; transform:translateX(-50%); bottom:0px; font-size:9px; font-style:italic; color:rgba(255,255,255,1); text-shadow: 0 0 5px rgba(255,255,255,1); white-space:nowrap; padding:0; pointer-events:auto; cursor:help;`;
                    // basılacak etiket metni.
                    etiket.textContent = 'renk bu mesaj tarihine göre';
                    // etiket metni üzerine fare ile gelindiğinde çıkacak olan açıklama.
                    etiket.title = 'Ana sayfadaki bu sekmelerde konuların açılış tarihi bilgisi yer almadığı için, Script son mesajın gönderim tarihine göre renklendirme yapıyor.';
                    // gönderim saatini belirten değerin (örneğin: "5 dakika önce") kutu içinde konumlandırmasını ayarlar.
                    zamanHucresi.style.position = 'relative';
                    // üstte belirtilen değerin biraz yukarıya kaymasını, böylece basılan etiket metninin daha rahat okunmasını sağlar.
                    timeEl.style.cssText = 'position:absolute; transform:translateX(-50%); top:0px;';
                    // etiketi zamanHucresi'ne basan asıl kod satırı.
                    zamanHucresi.appendChild(etiket);
                }
            });
        }

        // ----- KONU İÇİNDEKİ TAKİP ET VE TAKİBİ BIRAK TUŞLARINI RENKLENDİME -----

        // data-sk-watch özelliğine sahip tüm buton linklerini seçer
        document.querySelectorAll('a.button--link[data-sk-watch]').forEach(btn => {
            // buton içindeki .button-text span'ini bulur
            const span = btn.querySelector('.button-text');
            // span varsa onun yazısını alır, yoksa butonun kendi yazısını alır ve temizler
            const metin = (span ? span.textContent : btn.textContent).trim();
            // takip durumunu ifade eden metinler listesi
            const takipMetinleri = ['Takip', 'Takip et'];
            // metin takip metinlerinden biriyse yeşil arka plan uygular
            if (takipMetinleri.includes(metin)) {
                btn.style.background =   'rgba(0,255,0,0.25)';
                btn.style.borderRadius = '5px';
            }
            // değilse kırmızı arka plan uygular
            else {
                btn.style.background =   'rgba(255,0,0,0.25)';
                btn.style.borderRadius = '5px';
            }
        });
    }
    // ___ ANA FONKSİYON SONU ___

    // ----- ÇANA TIKLAYINCA KONU TAKİBİNİ BIRAKMA -----

    // takip edilen konu kartlarını seçer
    document.querySelectorAll('.structItem.structItem--thread').forEach(item => {
        // konu zaten takip ediliyor mu ikonunu bulur
        const watched = item.querySelector('.structItem-status--watched');
        // takip yoksa bu konuyu atlar
        if (!watched) return;
        // daha önce işaretlenmiş (linklenmiş) ise tekrar işlem yapmaz
        if (watched.dataset.watchLinked) return;
        // konuya ait ana linki bulur, link yok ise işlem durur
        const konuLink = item.querySelector('a[data-tp-primary="on"]');
        if (!konuLink) return;
        // takip bırakma URL’sini oluşturur
        const watchUrl = konuLink.href.replace('/unread', '') + '/watch';
        // ikonun tıklanabilir olduğunu belirtir
        watched.style.cursor = 'pointer';
        // kullanıcıya hover açıklaması gösterir
        watched.title = 'Takibi bırak';
        // takip bırakma tıklama olayı ekler
        watched.addEventListener('click', async (e) => {
            // sayfanın varsayılan tıklama davranışını ve olayın üst elementlere yayılmasını engeller
            e.preventDefault();
            e.stopPropagation();
            // konu adını alır
            const konuAdi = konuLink.textContent.trim();
            // kullanıcıdan onay ister, iptal eder ise işlem durur
            const onay = confirm(`\n${konuAdi}\n\n adlı konunun takibini bırakmak istiyor musunuz?`);
            if (!onay) return;
            // sayfadaki CSRF token değerini alır
            const token = document.querySelector('input[name="_xfToken"]')?.value;
            // token yoksa direkt sayfayı watch URL’sine yönlendirir
            if (!token) { window.location.href = watchUrl; return; }
            // takip kaldırma işlemini dener
            try {
                // takip bırakma isteğini sunucuya gönderir
                const response = await fetch(watchUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `_xfToken=${encodeURIComponent(token)}&stop=1`
                });
                // istek başarısızsa kullanıcıya hata mesajı gösterir ve işlemi durdurur
                if (!response.ok) {alert('Takip bırakılırken hata oluştu.');return;}

                // ----- ÇANA TIKLADIKTAN SONRA EMOJİ (İSTENİRSE) DEĞİŞİR VE BİR ANİMASYON İLE KAYBOLUR -----

                // emoji elementini bulur, yok ise oluşturur
                let emoji = watched.querySelector('._watchEmoji');
                if (!emoji) {
                    emoji = document.createElement('span');
                    emoji.className = '_watchEmoji';
                    watched.appendChild(emoji);
                }
                // emoji içeriğini ayarlar
                emoji.textContent = '🔔';
                // emoji stilini belirler
                emoji.style.cssText = `font-style: normal; line-height: 1;`;
                // çana tıklanınca animasyon başlatır
                const anim = watched.animate([
                    { filter: 'blur(0)',   opacity: 1, transform: 'scale(1)'},
                    { filter: 'blur(6px)', opacity: 0, transform: 'scale(3) translateX(-10px) translateY(-10px)'},
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                });
                // animasyon bittikten sonra konuyu DOM’dan kaldırır
                anim.finished.then(() => {
                    const li = watched.closest('li');
                    if (li) li.remove();
                });
                // state güncellemesi (UI için bilgilendirme)
                watched.title = 'Takip bırakıldı';
            }
            // istek sırasında hata oluşursa "başarısız oldu" yazar.
            catch (err) {
                console.error(err);
                alert('İstek başarısız oldu.');
            }
        });
        // aynı elemana tekrar event eklenmesini engeller, script tekrar çalışsa bile duplicate listener oluşmaz
        watched.dataset.watchLinked = '1';

        // ----- SİTENİN EMOJİSİ YERİNE BASILACAK EMOJİYİ EKLE VE ÜZERİNE GELİNCE BİR ANİMASYON OLSUN -----

        // Sayfada _customWatchBellStyle id’li bir <style> var mı diye bakıyor. Amaç aynı CSS’in tekrar tekrar eklenmesini engellemek.
        if (!document.querySelector('#_customWatchBellStyle')) {
            const style = document.createElement('style');
            style.id = '_customWatchBellStyle';
            // Bu bölüm sistem ikonunu kaldırıyor sadece istenen emoji görünsün diye çalışıyor. Çan ikonu _customWatchBell ::before veya ::after ile çiziliyor.
            // customWatchBell ilk betiği, dış kapsayıcıyı stilize ediyor. / ._watchEmoji betiği, içteki emojiyi stilize ediyor. / zilSalla bir animasyon oluşturuyor ve fare üzerine gelince oynatıyor.
            style.textContent = `
            .structItem-status--watched._customWatchBell::before,
            .structItem-status--watched._customWatchBell::after {
                display: none !important;
                content: none !important;
            }
            .structItem-status--watched._customWatchBell {
                font-style:normal !important;
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                padding: 0;
                margin: 0;
            }
            .structItem-status--watched._customWatchBell ._watchEmoji {
                display: inline-flex;
                line-height: 1;
                position: relative;
                left:1px;
            }
            @keyframes zilSalla {
                0%    { transform: rotate(0deg);   }
                15%   { transform: rotate(20deg);  }
                30%   { transform: rotate(-16deg); }
                45%   { transform: rotate(12deg);  }
                60%   { transform: rotate(-8deg);  }
                75%   { transform: rotate(4deg);   }
                100%  { transform: rotate(0deg);   }
            }
            .structItem-status--watched._customWatchBell:hover ._watchEmoji {
                animation: zilSalla 1s ease-in-out 2;
                transform-origin: top center;
            }`;
            // Oluşturulan CSS aktif hale geliyor.
            document.head.appendChild(style);
        }
        // Bu class sayesinde yazdığın CSS sadece bu elementte çalışıyor.
        watched.classList.add('_customWatchBell');
        // Aynı 🔔 emojisini ikinci kez eklememek için kontrol ediyor.
        if (!watched.querySelector('._watchEmoji')) {
            // Yeni bir <span> oluşturuyor.
            const emoji = document.createElement('span');
            // CSS’in bunu hedefleyebilmesi için class ekliyor.
            emoji.className = '_watchEmoji';
            // Zil emojisini yerleştiriyor.
            emoji.textContent = '🔔';
            // Emoji’yi ikona ekliyor.
            watched.appendChild(emoji);
        }
    });

    // ----- FONKSİYON ÇAĞIRMA VE OBSERVER'A AİT AYARLAMALAR -----

    // sayfa yüklendikten 200ms sonra runScript fonksiyonunu çalıştırır.
    setTimeout(runScript, 200);
    // Sekme değişimi ve dinamik içerik yüklemesi gibi DOM değişikliklerini izleyen gözlemci ekler.
    const observer = new MutationObserver(() => {
        // Kısa sürede art arda gelen DOM değişikliklerinde scriptin defalarca çalışmasını önler.
        clearTimeout(observer._timer);
        // Son DOM değişikliğinden 100ms sonra scripti çalıştır.
        observer._timer = setTimeout(runScript, 100);
    });
    // Gözlemciye ait ayarlar. Tüm sayfadaki her seviye değişikliği izlemesi söylenir. Değişiklik olduğunda üstte runScript tetiklenir.
    observer.observe(document.body, { childList: true, subtree: true });

})();
