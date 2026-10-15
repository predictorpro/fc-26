/* Настройки сайта. Меняй только значения в кавычках. */
window.CONFIG = {

  /* Ссылка на таблицу-приёмник из Google Apps Script (см. README.md, шаг 2).
     Пока пусто — сайт работает в демо-режиме, и ответы видны только на твоём устройстве. */
  API_URL: "https://script.google.com/macros/s/AKfycbx8cnEcKXBlw4zT092WhvuL2wFq2SdiABRU0dCHG7zBYJVnI_r30S5ibGmL9Nm9C8o/exec",

  /* Дата и время начала с часовым поясом, например "2026-10-20T19:00:00+05:00".
     Если поставить null — вместо даты и таймера будет надпись «Дату и время сообщим отдельно». */
  EVENT_ISO: "2026-10-15T16:10:00+05:00",
  TZ_LABEL: "UTC+5",

  /* До какого момента можно выбрать и сменить клуб. После этого выбор фиксируется.
     Такое же время должно стоять в TEAM_LOCK_ISO в apps-script.gs. Если поставить null — ограничения нет. */
  TEAM_LOCK_ISO: "2026-10-15T16:00:00+05:00",

  TOURNAMENT: "TR League 1X",
  GAME: "FC 26",
  PLACE: "Офис, PS-рум",
  FORMAT: "Лига: каждый с каждым, два круга",
  DURATION: "Игра в течение дня",
  RULE: "Матчи нужно обязательно доигрывать до конца.",

  /* Приглашённые. slug — латиницей, без пробелов: он попадает в ссылку (?to=slug).
     Если добавляешь человека, добавь его slug и в ALLOWED_SLUGS в apps-script.gs. */
  INVITEES: [
    { slug: "daniil", name: "Даниил" },
    { slug: "vitaliy", name: "Виталий" },
    { slug: "bogdan", name: "Богдан" },
    { slug: "ruslan", name: "Руслан" },
    { slug: "adil", name: "Адиль" },
    { slug: "adilet", name: "Адилет" },
    { slug: "eraly", name: "Ералы" },
    { slug: "ilyas", name: "Ильяс" },
    { slug: "nurmuhamed", name: "Нурмухамед" },
    { slug: "nursultan", name: "Нурсултан" },
    { slug: "batyrjamal", name: "Батырджамаль" },
    { slug: "rinat", name: "Ринат" },
    { slug: "ualihan", name: "Уалихан" },
    { slug: "mark", name: "Марк" },
    { slug: "magzhan", name: "Магжан" },
    { slug: "dias", name: "Диас" },
    { slug: "nariman", name: "Нариман" },
    { slug: "nikita", name: "Никита" }
  ],

  /* Свои логотипы клубов (необязательно). Положи PNG-файлы в папку logos рядом с index.html
     и впиши "logos" ниже. Имя файла: название клуба латиницей через дефис, например
     logos/real-madrid.png или logos/manchester-city.png. Если файла нет, показывается
     обычная эмблема из инициалов клуба. */
  LOGOS_DIR: ""
};
