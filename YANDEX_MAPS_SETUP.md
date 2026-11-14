# JoyJoy — Яндекс Карты (JavaScript API 3.0)

1. Получите ключ JavaScript API на https://developer.tech.yandex.ru/ или через Yandex Maps API Dashboard. Проверьте тариф и условия использования.
2. В настройках ключа заполните **HTTP Referer**: URL сайта JoyJoy и домен предварительного просмотра StackBlitz (с учётом подсказок Яндекса по формату домена). JS API 3.0 требует этого ограничения.
3. В StackBlitz добавьте в `.env` (файл **не** коммитить):

```env
PUBLIC_YANDEX_MAPS_API_KEY=ваш_ключ
```

4. Перезапустите `npm run dev` или выполните `npm run build && npm run preview`.
5. Карта использует **Yandex Maps JavaScript API v3**, стандартный слой со встроенной чёрно-белой `customization`. Дополнительный Map ID не нужен.
6. Метки отображаются только при подтверждённых `lat` и `lng` в `src/data/listings.ts`. Для всех текущих 11 объектов CMWP точных координат в базе нет. Не подставляйте произвольные точки.
7. Публичный браузерный API-ключ доступен пользователям сайта; обязательно ограничьте его HTTP Referer. При отсутствии ключа каталог работает, карта показывает пояснение.

Документация: https://yandex.ru/maps-api/docs/js-api/common/quickstart.html
Стили: https://yandex.ru/maps-api/docs/js-api/map/customization.html
