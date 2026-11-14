// Location coordinates below come from the individual CMWP property map embeds, checked 2026-11-14.
// JOYJOY_CMWP_IMPORT_V1 — проверенные карточки из раздела «Продажа» cmwp.uz, 14.11.2026.
// Предложения и цены могут меняться. Обновлять по источнику перед публикацией.
export type PropertyType = 'office' | 'retail' | 'warehouse' | 'industrial' | 'building' | 'land' | 'other';
export type PropertyStatus = 'available' | 'reserved' | 'sold';
export interface Listing {
 slug: string; title: string; city: string; district: string; address: string;
 type: PropertyType; status: PropertyStatus; area: number; priceUsd: number | null;
 images: string[]; description: string; features: string[]; sourceUrl?: string;
 capRate?: number; lat?: number; lng?: number;
}
export const listings: Listing[] = [
  {
    "slug": "ea-insurance",
    "title": "EA Insurance",
    "city": "Ташкент",
    "district": "",
    "address": "ул. Абдуллы Кадыри, 3а",
    "lat": 41.321696,
    "lng": 69.284203,
    "type": "office",
    "status": "available",
    "area": 3891,
    "priceUsd": 10000000,
    "images": [
      "https://api.cmwp.uz/storage/projects/previews/XEWPucaGYCBDeiahf8B0YPlpQ6vzaswETgQwOPG8.webp"
    ],
    "description": "Офисное здание рядом с Алайским рынком, продаётся целиком. В здании предусмотрены рабочие пространства, подземный паркинг и ресторанная зона.",
    "features": [
      "Здание целиком",
      "Класс B+",
      "2019 год",
      "Потолки 3 м",
      "Подземный паркинг"
    ],
    "sourceUrl": "https://cmwp.uz/sales/ea-insurance"
  },
  {
    "slug": "tashkent-furniture-factory",
    "title": "Мебельный завод в Ташкенте",
    "city": "Ташкент",
    "district": "",
    "address": "2-й тупик Олтинводий",
    "lat": 41.2561706,
    "lng": 69.2417376,
    "type": "warehouse",
    "status": "available",
    "area": 87000,
    "priceUsd": null,
    "images": [
      "https://api.cmwp.uz/storage/projects/previews/ncPUvnE8tLGIOfohZSSBUZLAppinhIB3u1Fu4Tp3.webp"
    ],
    "description": "Производственный комплекс Built-to-Suit на участке 8,7 га вблизи международного аэропорта. Есть подъезд железнодорожной ветки, система пожаротушения и доклевеллеры. На сайте также упоминается возможность краткосрочной аренды.",
    "features": [
      "Земельный участок 8,7 га",
      "Производственное назначение",
      "Железнодорожный подъезд",
      "Автоматическое пожаротушение"
    ],
    "sourceUrl": "https://cmwp.uz/sales/tashkent-furniture-factory"
  },
  {
    "slug": "daho-block-e",
    "title": "DAHO · Блок E",
    "city": "Ташкент",
    "district": "",
    "address": "пересечение улиц Саида Барака и Тараса Шевченко",
    "lat": 41.296862,
    "lng": 69.281666,
    "type": "office",
    "status": "available",
    "area": 388,
    "priceUsd": null,
    "images": [
      "https://api.cmwp.uz/storage/projects/previews/s3ycojaN7vQySqIJOFtRqFaWVW6d2waewpUEfnTV.jpg"
    ],
    "description": "Офисное помещение № 12-1 на 12 этаже многофункционального комплекса DAHO в центре Ташкента. Проект объединяет жильё, офисы и торговые помещения.",
    "features": [
      "12 этаж",
      "2026 год",
      "Комплекс бизнес/премиум-класса",
      "Инженерные подключения"
    ],
    "sourceUrl": "https://cmwp.uz/sales/daho-block-e"
  },
  {
    "slug": "nur",
    "title": "Nur",
    "city": "Ташкент",
    "district": "",
    "address": "ул. Лашкарбеги, 1",
    "lat": 41.322444,
    "lng": 69.287314,
    "type": "retail",
    "status": "available",
    "area": 2200,
    "priceUsd": null,
    "images": [
      "https://api.cmwp.uz/storage/projects/previews/BjhsHbiq5XRHraU4br1nNo2TVtIuUGfQpurhhslH.webp"
    ],
    "description": "Коммерческие помещения на первых этажах жилого комплекса Nur. Возможны торговля, общепит и сервисные функции. Площадь 2 200 м² указана на странице объекта; размеры отдельных блоков уточняются.",
    "features": [
      "Коммерческие помещения на первых этажах",
      "2024 год",
      "Требует ремонта",
      "Класс B+"
    ],
    "sourceUrl": "https://cmwp.uz/sales/nur"
  },
  {
    "slug": "floor-sale-at-trilliant-business-center",
    "title": "Продажа этажа в БЦ Trilliant",
    "city": "Ташкент",
    "district": "",
    "address": "ул. Шахрисабз, 2",
    "lat": 41.3159695,
    "lng": 69.2831597,
    "type": "office",
    "status": "available",
    "area": 1674,
    "priceUsd": null,
    "images": [
      "https://api.cmwp.uz/storage/projects/previews/TZbGGnP5yhx1g8fGqJACkHAaIaTsdxHNFmhNeX8K.webp"
    ],
    "description": "Готовый офисный этаж класса А с отделкой, мебелью, переговорными и панорамным остеклением. На сайте CMWP указана стоимость $5 800 без единицы измерения; общая стоимость требует подтверждения.",
    "features": [
      "2023 год",
      "Класс A",
      "С ремонтом и мебелью",
      "Высота потолков 4,4 м",
      "До 200 рабочих мест"
    ],
    "sourceUrl": "https://cmwp.uz/sales/floor-sale-at-trilliant-business-center"
  },
  {
    "slug": "center-one-4th-office-floor",
    "title": "Center One · 4-й офисный этаж",
    "city": "Ташкент",
    "district": "",
    "address": "пересечение улиц Садыка Азимова и Махтумкулли",
    "lat": 41.3069467,
    "lng": 69.2922911,
    "type": "office",
    "status": "available",
    "area": 1457,
    "priceUsd": null,
    "images": [
      "https://api.cmwp.uz/storage/projects/previews/FFXCKpJh9zmBBmUqITcmw2keuEBruAPjMxYTdQRe.jpg"
    ],
    "description": "Четвёртый офисный этаж комплекса Center One, с панорамными окнами по периметру, санузлами и лифтовыми холлами. Рядом Eco Park и деловая инфраструктура центрального Ташкента.",
    "features": [
      "4 этаж",
      "2028 год (указан на CMWP)",
      "Панорамное остекление",
      "Паркинг и системы безопасности"
    ],
    "sourceUrl": "https://cmwp.uz/sales/center-one-4th-office-floor"
  },
  {
    "slug": "building-on-koratosh-massif",
    "title": "Здание на массиве Коратош",
    "city": "Ташкент",
    "district": "",
    "address": "ул. Коратош",
    "lat": 41.316926,
    "lng": 69.2402002,
    "type": "office",
    "status": "available",
    "area": 2595,
    "priceUsd": null,
    "images": [
      "https://api.cmwp.uz/storage/projects/previews/6jAnP0UTL8GCyfNmZdluscAbhNpqAcsV46pcoofF.webp"
    ],
    "description": "Отдельное здание недалеко от метро Дружба Народов и Tashkent City. В окружении есть кафе, рестораны и фитнес-клубы.",
    "features": [
      "2015 год",
      "Класс B",
      "Потолки 3 м",
      "Возможность изменения планировки"
    ],
    "sourceUrl": "https://cmwp.uz/sales/building-on-koratosh-massif"
  },
  {
    "slug": "cambridge-residence",
    "title": "Cambridge Residence",
    "city": "Ташкент",
    "district": "",
    "address": "пересечение МКАД и ул. Шимолий",
    "lat": 41.3501358,
    "lng": 69.2556152,
    "type": "retail",
    "status": "available",
    "area": 1472,
    "priceUsd": null,
    "images": [
      "https://api.cmwp.uz/storage/projects/previews/RFlsjHLJ7A3qrKlDXqqXOD8vJjKV8NKBjr5Y1dWM.webp"
    ],
    "description": "Трёхэтажное здание на территории жилого комплекса Cambridge Residence, подходящее для коммерческого или офисного использования.",
    "features": [
      "3 этажа",
      "Комплекс из 11 домов",
      "220 квартир в жилом комплексе"
    ],
    "sourceUrl": "https://cmwp.uz/sales/cambridge-residence"
  },
  {
    "slug": "building-on-ipak-yoli",
    "title": "Здание на Ипак Йоли",
    "city": "Ташкент",
    "district": "",
    "address": "ул. Мирзо Улугбека, 32",
    "lat": 41.3199262,
    "lng": 69.3197825,
    "type": "office",
    "status": "available",
    "area": 10.19,
    "priceUsd": null,
    "images": [
      "https://api.cmwp.uz/storage/projects/previews/YbtQeTzd69bBJji5IL2EzJ1l3RaYnt8zGLJFvP2R.webp"
    ],
    "description": "Здание с модернизированными офисами, парковкой и помещением под столовую рядом с метро Буюк Ипак Йули. В источнике указана площадь 10,19 м², которая выглядит нетипично для здания и требует проверки.",
    "features": [
      "Класс B",
      "Потолки 2,8 м",
      "Площадь 10,19 м² требует уточнения",
      "Парковочная зона"
    ],
    "sourceUrl": "https://cmwp.uz/sales/building-on-ipak-yoli"
  },
  {
    "slug": "sarbon-business-center",
    "title": "Бизнес-центр Sarbon",
    "city": "Ташкент",
    "district": "Новый Ташкент",
    "address": "Новый Ташкент, центральная часть мастер-плана",
    "lat": 41.2861155,
    "lng": 69.414938,
    "type": "office",
    "status": "available",
    "area": 16768,
    "priceUsd": null,
    "images": [
      "https://api.cmwp.uz/storage/projects/previews/q8o5s5fhIiotadgFd7ZaTeNSaOmROag1YL6ByDfH.jpg"
    ],
    "description": "Проект отдельно стоящего бизнес-центра в Новом Ташкенте: офисы, торговая зона на первом уровне и подземный паркинг. Предлагается продажа всего здания.",
    "features": [
      "2028 год (проект)",
      "12 надземных этажей",
      "15 115 м² офисов",
      "1 653 м² коммерческих помещений"
    ],
    "sourceUrl": "https://cmwp.uz/sales/sarbon-business-center"
  },
  {
    "slug": "bukhara",
    "title": "Бухаро",
    "city": "Ташкент",
    "district": "",
    "address": "ул. Бухара, 1",
    "lat": 41.3083236,
    "lng": 69.2777413,
    "type": "office",
    "status": "available",
    "area": 14760,
    "priceUsd": null,
    "images": [
      "https://api.cmwp.uz/storage/projects/previews/aNwrPqAYxY9n8aySh2RZnBn3G2MDXvuRPny4DpbG.webp"
    ],
    "description": "Офисное здание в центральной части Ташкента с четырьмя лифтами, системой чиллер-фанкойл и центральным инженерным обеспечением.",
    "features": [
      "2014 год",
      "Четыре лифта",
      "Центральное водоснабжение",
      "Климатические системы"
    ],
    "sourceUrl": "https://cmwp.uz/sales/bukhara"
  }
];
export function getListing(slug: string): Listing | undefined {
  return listings.find((item) => item.slug === slug);
}
