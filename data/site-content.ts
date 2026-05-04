import {
  CalendarDays,
  Clock3,
  Flower2,
  Gift,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";

export const siteData = {
  countdownTarget: "2026-06-06T18:00:00",
  mapUrl: "https://maps.app.goo.gl/kw8iyZMpxoR11MBU7",

  bride: {
    tr: "NADEZHDA",
    ru: "НАДЕЖДА",
  },

  groom: {
    tr: "MERT",
    ru: "МЕРТ",
  },

  heroNote: {
    tr: "Hayatımızın en özel gününde sizleri aramızda görmekten büyük mutluluk duyacağız.",
    ru: "Мы будем счастливы видеть вас рядом с нами в самый особенный день нашей жизни.",
  },

  intro: {
    tr: "Sevgili ailemiz ve yakınlarımız,\n\nHayatlarımızı birleştireceğimiz bu özel günde sevincimizi ve mutluluğumuzu sizlerle paylaşmaktan onur duyarız. En güzel anılarımızdan birine tanıklık etmeniz bizim için çok kıymetli olacaktır.",
    ru: "Дорогие родные и близкие!\n\nС огромной радостью приглашаем вас разделить с нами один из самых важных и счастливых дней нашей жизни. Для нас будет большой честью видеть вас рядом в этот особенный момент.",
  },

  dateLabel: {
    tr: "06.06.2026",
    ru: "06.06.2026",
  },

  dayLabel: {
    tr: "Cumartesi",
    ru: "Суббота",
  },

  monthLabel: {
    tr: "Haziran",
    ru: "ИЮНЬ",
  },

  timeLabel: {
    tr: "18:00",
    ru: "18:00",
  },

  venue: {
    tr: "FUGA BEACH",
    ru: "FUGA BEACH",
  },

  city: {
    tr: "ALANYA",
    ru: "АЛАНЬЯ",
  },

  eventCards: {
    tr: [
      { icon: CalendarDays, label: "Tarih", value: "06.06.2026" },
      { icon: Clock3, label: "Saat", value: "18:00" },
      { icon: MapPin, label: "Mekan", value: "FUGA BEACH · ALANYA" },
    ],
    ru: [
      { icon: CalendarDays, label: "Дата", value: "06.06.2026" },
      { icon: Clock3, label: "Время", value: "18:00" },
      { icon: MapPin, label: "Место", value: "FUGA BEACH · АЛАНЬЯ" },
    ],
  },

  schedule: [
    {
      icon: Heart,
      time: "18:00",
      tr: {
        title: "Misafir Karşılama",
        note: "Karşılama ve ilk buluşma anı.",
      },
      ru: {
        title: "Сбор гостей",
        note: "Встреча гостей и первые приветствия.",
      },
    },
    {
      icon: Sparkles,
      time: "18:30",
      tr: {
        title: "Nikah Töreni",
        note: "Hayatımızın en özel anı.",
      },
      ru: {
        title: "Торжественная церемония",
        note: "Самый особенный момент нашего дня.",
      },
    },
    {
      icon: Flower2,
      time: "19:15",
      tr: {
        title: "Kokteyl",
        note: "İkramlar ve fotoğraf anıları.",
      },
      ru: {
        title: "Фуршет",
        note: "Угощения, общение и фотографии.",
      },
    },
  ],

  dressCodeText: {
    tr: "Bizim için en önemlisi sizin katılımınız. Yine de isterseniz kıyafetlerinizde düğünümüzün renk paletini ve stilini yansıtabilirsiniz.",
    ru: "Для нас главное — ваше присутствие. Но мы будем рады, если в своих нарядах вы поддержите цветовую гамму и стиль нашей свадьбы.",
  },

  palette: ["#2d221f", "#7c6352", "#c8b299", "#efe7da"],

  notes: {
    tr: [
      {
        icon: Sparkles,
        title: "Zarif Atmosfer",
        text: "Krem, bej ve kahve tonları davetimizin görsel dünyasına uyum sağlar.",
      },
      {
        icon: Flower2,
        title: "Doğal Şıklık",
        text: "Sade, şık ve yumuşak tonlarda seçimler konseptle en iyi uyumu yakalar.",
      },
      {
        icon: Gift,
        title: "En Güzel Hediye",
        text: "Bu özel günde yanımızda olmanız bizim için en kıymetli mutluluktur.",
      },
    ],
    ru: [
      {
        icon: Sparkles,
        title: "Элегантная атмосфера",
        text: "Кремовые, бежевые и кофейные оттенки красиво поддержат стиль приглашения.",
      },
      {
        icon: Flower2,
        title: "Естественная изысканность",
        text: "Лаконичные и мягкие оттенки лучше всего подчеркнут концепцию праздника.",
      },
      {
        icon: Gift,
        title: "Самый ценный подарок",
        text: "Ваше присутствие рядом с нами в этот день — самая большая радость для нас.",
      },
    ],
  },
} as const;

export const uiText = {
  tr: {
    invitation: "Dijital Düğün Davetiyesi",
    details: "Detaylar",
    invite: "Davet",
    timeline: "Program",
    dressCode: "Dress Code",
    tips: "İpuçları",
    location: "Konum",
    openMap: "Haritayı Aç",
    seeDetails: "Detayları Gör",
    eventTitle: "Düğün Detayları",
    eventSubtitle: "Bu özel güne ait tüm temel bilgileri burada bulabilirsiniz.",
    inviteTitle: "Sevgili ailemiz ve yakınlarımız",
    timelineTitle: "Zaman Akışı",
    timelineSubtitle: "Kutlama akışımız aşağıdaki şekilde planlanmıştır.",
    dressTitle: "Dress Code",
    tipsTitle: "İpuçları",
    tipsSubtitle: "Kutlama öncesinde işinize yarayabilecek küçük notlar.",
    locationTitle: "Konum",
    locationText: "Sizi bu özel günde aramızda görmek bizi çok mutlu edecek.",
    countdown: {
      d: "Gün",
      h: "Saat",
      m: "Dakika",
      s: "Saniye",
    },
    menu: "Menü",
    close: "Kapat",
    footer: "Sevgiyle hazırlanmış dijital davetiye",
  },

  ru: {
    invitation: "Цифровое свадебное приглашение",
    details: "Детали",
    invite: "Приглашение",
    timeline: "Тайминг",
    dressCode: "Дресс-код",
    tips: "Подсказки",
    location: "Локация",
    openMap: "Открыть карту",
    seeDetails: "Смотреть детали",
    eventTitle: "Детали свадьбы",
    eventSubtitle: "Здесь собрана вся основная информация об этом особенном дне.",
    inviteTitle: "Дорогие родные и близкие!",
    timelineTitle: "Тайминг",
    timelineSubtitle: "Праздничная программа запланирована следующим образом.",
    dressTitle: "ДРЕСС-КОД",
    tipsTitle: "ПОДСКАЗКИ",
    tipsSubtitle: "Небольшие заметки, которые могут быть полезны перед праздником.",
    locationTitle: "ЛОКАЦИЯ",
    locationText: "Мы будем счастливы видеть вас рядом с нами в этот особенный день.",
    countdown: {
      d: "Дней",
      h: "Часов",
      m: "Минут",
      s: "Секунд",
    },
    menu: "Меню",
    close: "Закрыть",
    footer: "Цифровое приглашение, созданное с любовью",
  },
} as const;