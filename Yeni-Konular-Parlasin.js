// ==UserScript==
// @name         Yeni Konular Parlasın
// @namespace    ---
// @version      1.3.3
// @description  Technopat, DonanımArşivi, Techolay yeni konular parlasın
// @author       XanthiN
// @match        https://www.technopat.net/sosyal/bolum/*
// @match        https://forum.donanimarsivi.com/*
// @match        https://techolay.net/sosyal/bolum/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {

    'use strict';

    const a = 1 * 60 * 60; // 1 saatin saniye cinsinden değeri a değişkenine atandı.
    const b = 4 * 60 * 60; // 4 saatin saniye cinsinden değeri b değişkenine atandı.
    const c = 24 * 60 * 60; // 24 saatin saniye cinsinden değeri c değişkenine atandı.
    const d = 48 * 60 * 60; // 48 saatin saniye cinsinden değeri d değişkenine atandı.

    // bu fonksiyon time elementinin data-timestamp değerini okuyup sayıya çevirir.
    function getTimestamp(timeEl){return parseInt(timeEl.getAttribute('data-timestamp'), 10);}

    // tüm script ana fonksiyon içine alındı. runScript çağırıldığında fonksiyon sıra ile çalışacak.
    function runScript() {

        // Date.now şimdiki zamanı Unix timestamp olarak verir, bine bölmek milisaniye cinsine çevirir, Math.floor ondalık kısmı atıp aşağı yuvarlar. Değer now değişkenine atanır
        const now = Math.floor(Date.now() / 1000);

        // _____ DONANIM ARŞİVİ ANA SAYFADAKİ SEKMELERE ÖZEL İŞLEMLERİN YAZILDIĞI KISIM _____
        if (location.hostname === 'forum.donanimarsivi.com') {
            // ana sayfa sekmelerindeki tüm konu satırlarını seçen bir döngüye başlar.
            document.querySelectorAll('li._xgtIstatistik-satir').forEach(item => {
                // satırdaki zaman elementini bulur ve timeEl değişkenine atar, element yoksa atlar.
                const timeEl = item.querySelector('time.u-dt');
                if (!timeEl) return;
                // zaman elementinin timestamp değerini alır ve timestamp değişkenine atar.
                const timestamp = getTimestamp(timeEl);
                // zaman elementi (timeEl) varsa timestamp da vardır, yine de garanti olsun diye kondu.
                if (!timestamp) return;
                // timestamp ileri tarihli ise veya 48 saatten eskiyse etiketi eklemeden atlar.
                if (timestamp > now || now - timestamp > d) return;
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

        // _____ GENEL ARKA PLAN RENKLENDİRME İŞLEMLERİNİN YAZILDIĞI KISIM _____
        // forum sayfalarındaki ve DA'da ana sayfa sekmelerindeki konu satırlarını seçen bir döngüye başlar.
        document.querySelectorAll('.structItem.structItem--thread, li._xgtIstatistik-satir').forEach(item => {
            // her çalışmada önceki renklendirmeleri temizler.
            item.style.boxShadow = '';
            item.style.borderLeft = '';
            item.style.borderRight = '';
            item.style.opacity = '';
            // Önceki HOT ikonunu temizle
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

            // konu tarihi şimdiki tarihten ileri ise arka planı gri olsun, değilse alttaki şartlardan devan eder. (DA'da sabit konu demek)
            if (timestamp > now) {
                // gri renk ve opaklığa ait css stil ayarlamaları.
                item.style.boxShadow = 'inset 0 0 0 9999px rgba(128, 128, 128, 0.5)';
                item.style.opacity = '0.33';
                return;
            }

            // eğer konu tarihi ile şimdiki zaman arasındaki fark en fazla 1 saat ise, koyu kırmızı arka plan + her iki kenarda kırmızı çizgi basılır.
            if (tarih <= a) {
                // kırmızı renk ve kenar çizgilerine ait css stil ayarlamaları.
                item.style.boxShadow = 'inset 0 0 0 9999px rgba(255, 0, 0, 0.25)';
                item.style.borderLeft = '2px solid rgba(255, 0, 0, 1)';
                item.style.borderRight = '2px solid rgba(255, 0, 0, 1)';
                // bu betik, eğer konu en az 10 mesaj almış ise "hızlı yükselen konu" etiketini basar. (satır satır detaylar sonra)
                if (item.classList.contains('structItem--thread')) {
                    const cevapEl = item.querySelector('.structItem-cell--meta dl:first-child dd');
                    const cevapSayisi = cevapEl ? parseInt(cevapEl.textContent.trim(), 10) : 0;
                    if (cevapSayisi >= 10) {
                        const minorHucre = item.querySelector('.structItem-minor');
                        if (minorHucre && !minorHucre.querySelector('._hotIkon')) {
                            const ikon = document.createElement('span');
                            ikon.className = '_hotIkon';
                            ikon.style.cssText = 'position:absolute; left:50%; top:80%; transform:translate(-50%, -50%); font-size:10px; font-style:italic; font-weight: bold; color:rgba(255,0,0,1); background:rgba(255,100,0,0.1); border-radius:5px; padding:1px 5px; pointer-events:none;';
                            ikon.textContent = '🔥 HIZLI YÜKSELİYOR! 🔥';
                            minorHucre.style.position = 'relative';
                            minorHucre.appendChild(ikon);
                        }
                    }
                }
            }

            // eğer konu tarihi ile şimdiki zaman arasındaki fark 1 ile 4 saat arasında ise, koyu yeşil arka plan + her iki kenarda yeşil çizgi basılır.
            else if (tarih <= b) {
                // yeşil renk ve kenar çizgilerine ait css stil ayarlamaları.
                item.style.boxShadow = 'inset 0 0 0 9999px rgba(0, 255, 0, 0.25)';
                item.style.borderLeft = '2px solid rgba(0, 255, 0, 1)';
                item.style.borderRight = '2px solid rgba(0, 255, 0, 1)';
                // bu betik, eğer konu en az 20 mesaj almış ise "ilgi çeken konu" etiketini basar. (satır satır detaylar sonra)
                if (item.classList.contains('structItem--thread')) {
                    const cevapEl = item.querySelector('.structItem-cell--meta dl:first-child dd');
                    const cevapSayisi = cevapEl ? parseInt(cevapEl.textContent.trim(), 10) : 0;
                    if (cevapSayisi >= 20) {
                        const minorHucre = item.querySelector('.structItem-minor');
                        if (minorHucre && !minorHucre.querySelector('._hotIkon')) {
                            const ikon = document.createElement('span');
                            ikon.className = '_hotIkon';
                            ikon.style.cssText = 'position:absolute; left:50%; top:80%; transform:translate(-50%, -50%); font-size:10px; font-style:italic; color:rgba(0,255,0,1); background:rgba(100,255,0,0.1); border-radius:5px; padding:1px 5px; pointer-events:none;';
                            ikon.textContent = 'İLGİ ÇEKEN KONU 🔥';
                            minorHucre.style.position = 'relative';
                            minorHucre.appendChild(ikon);
                        }
                    }
                }
            }

            // eğer konu tarihi ile şimdiki zaman arasındaki fark 4 ile 24 saat arasında ise, orta koyulukta yeşil arka plan basılır.
            else if (tarih <= c) {
                // yeşil renge ait css stil ayarlaması.
                item.style.boxShadow = 'inset 0 0 0 9999px rgba(0, 255, 0, 0.125)';
            }

            // eğer konu tarihi ile şimdiki zaman arasındaki fark 24 ile 48 saat arasında ise, zayıf koyulukta yeşil arka plan basılır.
            else if (tarih <= d) {
                // yeşil renge ait css stil ayarlaması.
                item.style.boxShadow = 'inset 0 0 0 9999px rgba(0, 255, 0, 0.06)';
            }
        });
    }

    // _____ FONKSİYON ÇAĞIRMA VE GÖZLEMCİYE AİT AYARLAMALARIN YAZILDIĞI KISIM _____
    // sayfa yüklendikten 250 milisaniye sonra runScript fonksiyonunu çalıştırır.
    setTimeout(runScript, 250);

    // Sekme değişimi ve dinamik içerik yüklemesi gibi DOM değişikliklerini izleyen gözlemci ekler.
    const observer = new MutationObserver(() => {
        // Kısa sürede art arda gelen DOM değişikliklerinde scriptin defalarca çalışmasını önler.
        clearTimeout(observer._timer);
        // Son DOM değişikliğinden 250 milisaniye sonra scripti çalıştır.
        observer._timer = setTimeout(runScript, 250);
    });

    // Gözlemciye ait ayarlar. Tüm sayfadaki her seviye değişikliği izlemesi söylenir. Değişiklik olduğunda üstte runScript tetiklenir.
    observer.observe(document.body, { childList: true, subtree: true });

})();