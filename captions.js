/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 8. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Koordinatlar ne olur?', en: 'What happens to the coordinates?',
      note: 'A(1, 1), B(4, 1), C(1, 3) üçgenini taşıyınca koordinatlar nasıl değişir? Varsayalım: öteleme ekler ya da çıkarır, yansıma işaret değiştirir.' },
    { scene: 2, start: 10.8, end: 19.2, tr: '3 sola, 4 aşağı', en: '3 left, 4 down',
      note: 'Üçgeni 3 birim sola, 4 birim aşağı öteleyelim. A(1, 1) noktası A′(−2, −3) oldu.' },
    { scene: 2, start: 19.4, end: 27.8, tr: '(x − 3, y − 4)', en: '(x − 3, y − 4)',
      note: 'Her noktanın apsisinden 3, ordinatından 4 çıktı. Sağa-sola taşımak apsisi, yukarı-aşağı taşımak ordinatı değiştirir.' },
    { scene: 3, start: 28.8, end: 37.2, tr: 'x eksenine göre', en: 'In the x-axis',
      note: 'x eksenine göre yansıtalım. A(1, 1) noktası A′(1, −1) oldu.' },
    { scene: 3, start: 37.4, end: 45.8, tr: '(x, −y)', en: '(x, −y)',
      note: 'Apsis aynı kaldı, ordinatın işareti değişti. Nokta ve görüntüsü eksene eşit uzaklıkta.' },
    { scene: 4, start: 46.8, end: 55.0, tr: 'y eksenine göre', en: 'In the y-axis',
      note: 'Şimdi y eksenine göre yansıtalım. B(4, 1) noktası B′(−4, 1) oldu.' },
    { scene: 4, start: 55.2, end: 63.8, tr: '(−x, y)', en: '(−x, y)',
      note: 'Ordinat aynı kaldı, apsisin işareti değişti. Varsayımımız doğrulandı.' },
    { scene: 5, start: 64.8, end: 72.0, tr: 'Öteleme mi?', en: 'A translation?',
      note: 'DEF ile KLM üçgenlerini karşılaştıralım. Her noktada apsis 8 arttı, ordinat 5 azaldı: bu bir öteleme.' },
    { scene: 5, start: 72.2, end: 79.8, tr: 'Yansıma mı?', en: 'A reflection?',
      note: 'DEF ile PRS’de ordinatlar aynı, apsislerin işareti değişmiş: y eksenine göre yansıma.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Kurallar', en: 'The rules',
      note: 'Aklında kalsın: ötelemede koordinatlara sayı eklenir ya da çıkarılır; eksene göre yansımada bir koordinatın işareti değişir.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Koordinatlar anlatır!', en: 'Coordinates tell the story!',
      note: 'Koordinatlar dönüşümü anlatır!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
