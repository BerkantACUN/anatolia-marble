# Anatolia Marble — Website

Statik, 4 dilli (EN varsayılan · TR · ES · FR) tanıtım sitesi.
Framework yok — saf HTML + CSS + JavaScript. Herhangi bir hosting'e yüklenebilir.

## Yapı

```
site/
├── index.html          Anasayfa (slider, slogan, hikaye, ürün aileleri, vizyon/misyon)
├── products.html       Ürünler (kategori filtresi, ?cat=marble gibi linklenebilir)
├── services.html       Hizmetler (Taş Danışmanlığı + Taş Denetimi)
├── about.html          Hakkımızda (eski sitenin metinleri, değerler)
├── contact.html        İletişim (form → WhatsApp'a yönlendirir)
└── assets/
    ├── css/            base.css (tema/tokenlar) + components.css (bölümler)
    ├── js/             i18n.js (çeviri motoru) · lang-en/tr/es/fr.js (metinler) · main.js (etkileşim)
    └── img/            Optimize edilmiş görseller + logo + favicon
```

## Yayınlama

`site/` klasörünün **içeriğini** hosting'in kök dizinine (ör. `public_html/`) yükleyin.
Build adımı yoktur. Yüklemeden önce eski WordPress dosyalarını yedekleyip kaldırın.

## Sık yapılacak değişiklikler

| Ne | Nerede |
|----|--------|
| WhatsApp numarası | `assets/js/main.js` içindeki `WA_NUMBER` **ve** HTML'lerdeki `wa.me/905324768556` linkleri |
| Instagram / LinkedIn profilleri | Tüm HTML'lerde `href="#"` olan sosyal ikon linkleri (şimdilik boş) |
| E-posta | HTML'lerde `info@anatoliamarble.com` araması yapın |
| Metinler / çeviriler | `assets/js/lang-en.js`, `lang-tr.js`, `lang-es.js`, `lang-fr.js` |
| Yeni ürün ekleme | `products.html` içinde bir `<article class="product-card" data-cat="...">` bloğunu kopyalayın; görseli `assets/img/` klasörüne koyun. Kategori değerleri: `marble`, `travertine`, `limestone`, `onyx`, `andesite` |

## Notlar

- Ürün görselleri şimdilik örnektir (`prod.lead` metninde belirtiliyor). Gerçek stok
  fotoğrafları gelince `assets/img/product-*.jpg` dosyalarını değiştirmek yeterli.
- Onyx ve Andesite görselleri prosedürel SVG doku — gerçek fotoğraf gelince
  `product-onyx.svg` / `product-andesite.svg` referanslarını `.jpg` ile değiştirin.
- Dil seçimi `localStorage` ile hatırlanır; ilk ziyaret her zaman İngilizce açılır.
- Slogan ("Purity set in stone") marka kimliği olarak tüm dillerde İngilizce bırakıldı.
