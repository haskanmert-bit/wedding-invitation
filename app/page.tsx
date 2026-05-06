"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Clock3,
  Flower2,
  Gift,
  Globe,
  Heart,
  MapPin,
  Menu,
  Sparkles,
  UtensilsCrossed,
  Wine,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uiText } from "@/data/site-content";

type SiteSettings = {
  bride_name_tr: string;
  bride_name_ru: string;
  groom_name_tr: string;
  groom_name_ru: string;
  hero_note_tr: string;
  hero_note_ru: string;
  intro_tr: string;
  intro_ru: string;
  date_label_tr: string;
  date_label_ru: string;
  day_label_tr: string;
  day_label_ru: string;
  month_label_tr: string;
  month_label_ru: string;
  time_label_tr: string;
  time_label_ru: string;
  venue_tr: string;
  venue_ru: string;
  city_tr: string;
  city_ru: string;
  map_url: string;
  countdown_target: string | null;
};

type MealOptionRow = {
  id: string;
  category: "meal" | "drink";
  option_label: string;
  sort_order: number;
  is_active: boolean;
};

type RsvpForm = {
  guest_name: string;
  attending: "yes" | "no";
  meal_choice: string;
  drink_choice: string;
  note: string;
};

function SatinBackground({ hidden = false }: { hidden?: boolean }) {
  if (hidden) return null;

  return (
    <>
      <div
        className="absolute inset-0 opacity-95"
        style={{
          background:
            "linear-gradient(135deg, #d8cec3 0%, #f8f4ed 16%, #d7c8ba 34%, #f7f1e8 52%, #d2c1b3 72%, #fbf8f3 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 18% 15%, rgba(255,255,255,0.88), transparent 24%), radial-gradient(circle at 82% 22%, rgba(255,255,255,0.45), transparent 18%), radial-gradient(circle at 28% 82%, rgba(255,255,255,0.4), transparent 20%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(120deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 1px, transparent 1px, transparent 24px)",
        }}
      />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 bg-white" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 bg-white" />
    </>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
      <p className="uppercase tracking-[0.35em] text-[11px] text-stone-500 mb-3">
        {eyebrow}
      </p>
      <h2 className="text-3xl md:text-5xl font-serif-lux text-stone-900 leading-tight">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-stone-600 leading-7">{subtitle}</p>
      ) : null}
    </div>
  );
}

function LangSwitch({
  lang,
  setLang,
}: {
  lang: "tr" | "ru";
  setLang: (lang: "tr" | "ru") => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-stone-300 bg-white/80 p-1 shadow-sm backdrop-blur">
      <button
        onClick={() => setLang("tr")}
        className={`rounded-full px-4 py-2 text-sm transition ${
          lang === "tr" ? "bg-stone-900 text-white" : "text-stone-700"
        }`}
      >
        TR
      </button>
      <button
        onClick={() => setLang("ru")}
        className={`rounded-full px-4 py-2 text-sm transition ${
          lang === "ru" ? "bg-stone-900 text-white" : "text-stone-700"
        }`}
      >
        RU
      </button>
    </div>
  );
}

function Countdown({
  target,
  labels,
}: {
  target: string;
  labels: { d: string; h: string; m: string; s: string };
}) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const update = () => {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [target]);

  const items = [
    { value: timeLeft.d, label: labels.d },
    { value: timeLeft.h, label: labels.h },
    { value: timeLeft.m, label: labels.m },
    { value: timeLeft.s, label: labels.s },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 max-w-xl mx-auto md:mx-0 mt-8">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[1.15rem] border border-white/50 bg-white/45 backdrop-blur px-2 py-4 text-center shadow-sm"
        >
          <div className="text-2xl md:text-3xl font-light text-stone-900">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 mt-1">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <span className="w-12 h-px bg-stone-300" />
      <Heart className="w-4 h-4 text-stone-500" />
      <span className="w-12 h-px bg-stone-300" />
    </div>
  );
}

function InvitationFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-stone-200 bg-[#f7f4ee] p-4 shadow-sm">
      <div className="border border-stone-400/60 px-6 py-10 md:px-10 md:py-14 bg-[#f7f4ee]">
        {children}
      </div>
    </div>
  );
}

export default function Page() {
  const [lang, setLang] = useState<"tr" | "ru">("tr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [mealOptions, setMealOptions] = useState<any[]>([]);
  const [drinkOptions, setDrinkOptions] = useState<any[]>([]);
  // 🔥 FALLBACK OPTIONS (Supabase çalışmazsa)
const fallbackMealOptions = [
  { id: "fish", option_label: "fish", label_tr: "Balık", label_ru: "Рыба" },
  { id: "meat", option_label: "meat", label_tr: "Et", label_ru: "Мясо" },
  { id: "chicken", option_label: "chicken", label_tr: "Tavuk", label_ru: "Птица" },
];

const fallbackDrinkOptions = [
  { id: "non_alcoholic", option_label: "non_alcoholic", label_tr: "Alkolsüz", label_ru: "Безалкогольные напитки" },
  { id: "beer", option_label: "beer", label_tr: "Bira", label_ru: "Пиво" },
  { id: "sparkling", option_label: "sparkling", label_tr: "Alkollü Şampanya", label_ru: "Игристое" },
  { id: "red_wine", option_label: "red_wine", label_tr: "Kırmızı Şarap", label_ru: "Красное вино" },
  { id: "white_wine", option_label: "white_wine", label_tr: "Beyaz Şarap", label_ru: "Белое вино" },
  { id: "raki", option_label: "raki", label_tr: "Rakı", label_ru: "Ракы" },
  { id: "gin", option_label: "gin", label_tr: "Cin", label_ru: "Джин" },
  { id: "vodka", option_label: "vodka", label_tr: "Vodka", label_ru: "Водка" },
  { id: "cognac", option_label: "cognac", label_tr: "Konyak", label_ru: "Коньяк" },
];

// 👇 HANGİ DATA VARSA ONU KULLAN
const visibleMealOptions = mealOptions.length > 0 ? mealOptions : fallbackMealOptions;
const visibleDrinkOptions = drinkOptions.length > 0 ? drinkOptions : fallbackDrinkOptions;
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState("");

  const [rsvpForm, setRsvpForm] = useState<RsvpForm>({
    guest_name: "",
    attending: "yes",
    meal_choice: "",
    drink_choice: "",
    note: "",
  });

  const [settings, setSettings] = useState<SiteSettings>({
    bride_name_tr: "NADEZHDA",
    bride_name_ru: "НАДЕЖДА",
    groom_name_tr: "MERT",
    groom_name_ru: "МЕРТ",
    hero_note_tr:
      "Hayatımızın en özel gününde sizleri aramızda görmekten büyük mutluluk duyacağız.",
    hero_note_ru:
      "Мы будем счастливы видеть вас рядом с нами в самый особенный день нашей жизни.",
    intro_tr:
      "Sevgili ailemiz ve yakınlarımız,\n\nHayatlarımızı birleştireceğimiz bu özel günde sevincimizi ve mutluluğumuzu sizlerle paylaşmaktan onur duyarız.",
    intro_ru:
      "Pодные и близкие!\n\nС огромной радостью приглашаем вас разделить с нами один из самых важных и счастливых дней нашей жизни.",
    date_label_tr: "06.06.2026",
    date_label_ru: "06.06.2026",
    day_label_tr: "Cumartesi",
    day_label_ru: "Суббота",
    month_label_tr: "Haziran",
    month_label_ru: "ИЮНЬ",
    time_label_tr: "18:00",
    time_label_ru: "18:00",
    venue_tr: "FUGA BEACH",
    venue_ru: "FUGA BEACH",
    city_tr: "ALANYA",
    city_ru: "АЛАНЬЯ",
    map_url: "https://maps.app.goo.gl/kw8iyZMpxoR11MBU7",
    countdown_target: "2026-06-06T18:00:00+03:00",
  });

  const t = uiText[lang];
  const sections = useMemo(
    () => [
      { id: "details", label: t.details },
      { id: "invite", label: t.invite },
      { id: "timeline", label: t.timeline },
      { id: "dress", label: t.dressCode },
      { id: "rsvp", label: lang === "tr" ? "Menü Seçimi" : "Выбор меню" },
      { id: "location", label: t.location },
    ],
    [t, lang]
  );

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("slug", "main")
      .single();

    if (data) {
      setSettings({
        bride_name_tr: data.bride_name_tr ?? "",
        bride_name_ru: data.bride_name_ru ?? "",
        groom_name_tr: data.groom_name_tr ?? "",
        groom_name_ru: data.groom_name_ru ?? "",
        hero_note_tr: data.hero_note_tr ?? "",
        hero_note_ru: data.hero_note_ru ?? "",
        intro_tr: data.intro_tr ?? "",
        intro_ru: data.intro_ru ?? "",
        date_label_tr: data.date_label_tr ?? "",
        date_label_ru: data.date_label_ru ?? "",
        day_label_tr: data.day_label_tr ?? "",
        day_label_ru: data.day_label_ru ?? "",
        month_label_tr: data.month_label_tr ?? "",
        month_label_ru: data.month_label_ru ?? "",
        time_label_tr: data.time_label_tr ?? "",
        time_label_ru: data.time_label_ru ?? "",
        venue_tr: data.venue_tr ?? "",
        venue_ru: data.venue_ru ?? "",
        city_tr: data.city_tr ?? "",
        city_ru: data.city_ru ?? "",
        map_url: data.map_url ?? "",
        countdown_target: data.countdown_target ?? null,
      });
    }

    const { data: designData } = await supabase
      .from("design_settings")
      .select("hero_background_path")
      .eq("slug", "main")
      .single();

    if (designData?.hero_background_path) {
      const { data: publicUrlData } = supabase.storage
        .from("site-assets")
        .getPublicUrl(designData.hero_background_path);

      setBackgroundImageUrl(publicUrlData.publicUrl);
    }

 const { data: optionData } = await supabase
  .from("meal_options")
  .select("id, category, option_label, label_tr, label_ru, sort_order, is_active")
  .eq("is_active", true)
  .order("sort_order", { ascending: true });

if (optionData) {
  const activeOptions = optionData as any[];

  const meals = activeOptions.filter((item) => item.category === "meal");
  const drinks = activeOptions.filter((item) => item.category === "drink");

  setMealOptions(meals);
  setDrinkOptions(drinks);

  setRsvpForm((prev) => ({
    ...prev,
    meal_choice: prev.meal_choice || meals[0]?.option_label || "",
    drink_choice: prev.drink_choice || drinks[0]?.option_label || "",
  }));
}

    setLoading(false);
  }

  function updateRsvpField<K extends keyof RsvpForm>(key: K, value: RsvpForm[K]) {
    setRsvpForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleRsvpSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!rsvpForm.guest_name.trim()) {
      setRsvpMessage(
        lang === "tr" ? "Lütfen ad soyad giriniz." : "Пожалуйста, укажите имя и фамилию."
      );
      return;
    }

    setSubmittingRsvp(true);
    setRsvpMessage("");

    const { error } = await supabase.from("rsvp_responses").insert({
      guest_name: rsvpForm.guest_name,
      attending: rsvpForm.attending === "yes",
      meal_choice: rsvpForm.attending === "yes" ? rsvpForm.meal_choice : null,
      drink_choice: rsvpForm.attending === "yes" ? rsvpForm.drink_choice : null,
      note: rsvpForm.note,
    });

    if (error) {
      setRsvpMessage(
        lang === "tr"
          ? "Gönderim sırasında bir hata oluştu."
          : "Во время отправки произошла ошибка."
      );
      setSubmittingRsvp(false);
      return;
    }

    setRsvpMessage(
      lang === "tr"
        ? "Cevabınız başarıyla kaydedildi. Teşekkür ederiz."
        : "Ваш ответ успешно сохранен. Спасибо."
    );

    setRsvpForm({
      guest_name: "",
      attending: "yes",
      meal_choice: mealOptions[0] || "",
      drink_choice: drinkOptions[0] || "",
      note: "",
    });

    setSubmittingRsvp(false);
  }

  const eventCards =
    lang === "tr"
      ? [
          { icon: CalendarDays, label: "Tarih", value: settings.date_label_tr },
          { icon: Clock3, label: "Saat", value: settings.time_label_tr },
          {
            icon: MapPin,
            label: "Mekan",
            value: `${settings.venue_tr} · ${settings.city_tr}`,
          },
        ]
      : [
          { icon: CalendarDays, label: "Дата", value: settings.date_label_ru },
          { icon: Clock3, label: "Время", value: settings.time_label_ru },
          {
            icon: MapPin,
            label: "Место",
            value: `${settings.venue_ru} · ${settings.city_ru}`,
          },
        ];

  const schedule =
    lang === "tr"
      ? [
          {
            icon: Heart,
            time: "18:00",
            title: "Misafir Karşılama",
            note: "Karşılama ve ilk buluşma anı.",
          },
          {
            icon: Sparkles,
            time: "18:30",
            title: "Nikah Töreni",
            note: "Hayatımızın en özel anı.",
          },
          {
            icon: Flower2,
            time: "19:15",
            title: "Kokteyl",
            note: "İkramlar ve fotoğraf anıları.",
          },
        ]
      : [
          {
            icon: Heart,
            time: "18:00",
            title: "Сбор гостей",
            
          },
          {
            icon: Sparkles,
            time: "18:30",
            title: "Торжественная церемония",
            
          },
          {
            icon: Flower2,
            time: "19:15",
            title: "Праздничный банкет",
            
          },
        ];

  const notes =
    lang === "tr"
      ? [
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
        ]
      : [
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
        ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-stone-800"
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        backgroundColor: "#f4efe7",
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Great+Vibes&family=Inter:wght@300;400;500;600&display=swap');
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-serif-lux { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/40 bg-[#f4efe7]/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-stone-800" />
            <span className="text-sm md:text-base tracking-[0.25em] uppercase text-stone-700 font-serif-lux">
              {lang === "tr" ? settings.bride_name_tr : settings.bride_name_ru} &{" "}
              {lang === "tr" ? settings.groom_name_tr : settings.groom_name_ru}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-stone-700">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="hover:text-stone-950 transition"
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LangSwitch lang={lang} setLang={setLang} />
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-stone-300 bg-white/70"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t.close : t.menu}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-[#f7f3ed] px-4 py-4 space-y-4">
            <LangSwitch lang={lang} setLang={setLang} />
            <div className="grid gap-3 text-sm">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-stone-700"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden">
        <SatinBackground hidden={!!backgroundImageUrl} />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          ><div className="hidden md:block h-8" />
          </motion.div>

          <motion.div
  initial={{ opacity: 0, scale: 0.97 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.9, delay: 0.1 }}
  className="flex justify-center md:justify-start md:-order-1"
>
            <div className="w-full max-w-md rounded-[2rem] border border-stone-300/70 shadow-[0_25px_60px_rgba(60,40,20,0.15)] overflow-hidden bg-[#ebe3d8]">
              <div
                className="h-[600px] p-8 flex flex-col justify-between"
                style={{
                  background:
                    "radial-gradient(circle at 18% 12%, rgba(255,255,255,0.78), transparent 24%), linear-gradient(145deg, #d9cec1 0%, #faf7f2 24%, #cdbdad 48%, #f8f3ec 70%, #cab7aa 100%)",
                }}
              ><p className="uppercase tracking-[0.42em] text-[11px] text-stone-600 mb-8 text-center">
  {lang === "tr" ? "DÜĞÜN DAVETİYESİ" : "СВАДЕБНОЕ ПРИГЛАШЕНИЕ"}
</p>
                <div className="text-center mt-6">
                  <div className="w-20 h-20 rounded-full border border-white/60 bg-white/30 backdrop-blur mx-auto mb-6 flex items-center justify-center shadow-sm">
                    <Heart className="w-7 h-7 text-stone-700" />
                  </div>
                  <h3 className="mt-6 text-6xl font-script text-stone-900">
                    {lang === "tr" ? settings.bride_name_tr : settings.bride_name_ru}
                  </h3>
                  <p className="mt-1 text-stone-500 font-serif-lux text-xl">&</p>
                  <h3 className="text-6xl font-script text-stone-900">
                    {lang === "tr" ? settings.groom_name_tr : settings.groom_name_ru}
                  </h3>
                </div>
                <div className="text-center mb-6 mt-10">
                  <p className="text-sm uppercase tracking-[0.25em] text-stone-500">
                    {lang === "tr" ? settings.day_label_tr : settings.day_label_ru}
                  </p>
                  <p className="text-4xl md:text-5xl font-light mt-2 text-stone-900 font-serif-lux">
                    {lang === "tr" ? "6 Haziran 2026" : "6 июня 2026"}
                  </p>
                  <p className="mt-3 tracking-[0.25em] uppercase text-sm text-stone-500">
                    {lang === "tr" ? settings.city_tr : settings.city_ru}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
<section id="invite" className="max-w-4xl mx-auto px-6 py-10 md:py-20">
        <OrnamentalDivider />
        <InvitationFrame>
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-serif-lux text-stone-900 leading-tight uppercase tracking-[0.08em]">
              {t.inviteTitle}
            </h2>
            <p className="mt-8 text-stone-700 leading-8 max-w-2xl mx-auto whitespace-pre-line text-lg">
              {lang === "tr" ? settings.intro_tr : settings.intro_ru}
            </p>
          </div>
        </InvitationFrame>
      </section>
      <section id="details" className="max-w-5xl mx-auto px-6 py-20">
        <SectionTitle eyebrow={t.details} title={t.eventTitle} subtitle={t.eventSubtitle} />
        <div className="grid md:grid-cols-3 gap-6">
          {eventCards.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.label}
                className="rounded-3xl border-stone-200 bg-white/70 backdrop-blur shadow-sm"
              >
                <CardContent className="p-6">
                  <Icon className="w-6 h-6 mb-4" />
                  <h3 className="text-xl font-medium">{item.label}</h3>
                  <p className="mt-2 text-stone-600">{item.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="timeline" className="max-w-4xl mx-auto px-6 py-20">
        <SectionTitle eyebrow={t.timeline} title={t.timelineTitle} subtitle={t.timelineSubtitle} />
        <div className="relative ml-4 md:ml-0">
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-stone-300 md:left-1/2 md:-translate-x-1/2" />
          <div className="space-y-8">
            {schedule.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={`${item.time}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="relative grid md:grid-cols-2 gap-6 items-center"
                >
                  <div className={`md:text-right ${index % 2 ? "md:order-2 md:text-left" : ""}`}>
                    <div className="inline-block rounded-[1.5rem] bg-white/80 border border-stone-200 px-5 py-4 shadow-sm ml-10 md:ml-0 min-w-[250px]">
                      <div className="flex items-center gap-3 justify-start md:justify-end">
                        <Icon className="w-4 h-4 text-stone-700" />
                        <p className="text-2xl font-light text-stone-900">{item.time}</p>
                      </div>
                      <h3 className="mt-2 text-lg font-medium">{item.title}</h3>
                      <p className="mt-1 text-stone-600"></p>
                    </div>
                  </div>
                  <div className={`${index % 2 ? "md:order-1" : ""}`} />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-[#f4efe7] bg-stone-800 md:left-1/2 md:-translate-x-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="dress" className="max-w-5xl mx-auto px-6 py-20">
       <SectionTitle
  eyebrow={t.dressCode}
  title={t.dressTitle}
  subtitle={
    lang === "tr"
      ? "Bizim için en önemli şey sizin orada olmanız!\n\nAncak davetimizin konseptine uyum sağlamanız ve akşam kombinlerinizde belirtilen tonlara yer vermeniz bizi çok mutlu eder.\n\nLütfen önerilen renk paletini referans alın — bu renklerin en açık ve zarif tonlarından daha koyu ve derin tonlarına kadar tüm geçişler uygundur."
      : "Для нас главное — ваше присутствие!\n\nНо мы будем очень признательны, если вы поддержите стилистику нашего мероприятия в своих вечерних образах и подберёте одежду в указанных оттенках.\n\nПожалуйста, ориентируйтесь на предложенную цветовую гамму — допустимы все оттенки этих цветов: от самых нежных и светлых до более темных и глубоких."
  }
/>
 <div className="flex flex-wrap justify-center gap-6 mb-10">
  {[
    { color: "#1a1a1a", label: "Black" },
    { color: "#2f3e2c", label: "Olive Green" },
    { color: "#556b4f", label: "Sage Green" },
    { color: "#8b6f47", label: "Mocha Brown" },
    { color: "#e6dcc9", label: "Sand Beige" },
  ].map((item) => (
    <div key={item.color} className="relative group text-center">
      
      <div
        className="w-16 h-28 rounded-full shadow-inner border border-stone-200 transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: item.color }}
      />

      {/* Hover text */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {item.label}
      </div>

    </div>
  ))}
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
  <img
    src="/dresscode-1.jpeg.jpeg"
    alt="Dress Code Inspiration"
    className="rounded-[2rem] shadow-lg w-full h-auto object-cover"
  />

  <img
    src="/dresscode-2.jpeg.jpeg"
    alt="Dress Code Inspiration"
    className="rounded-[2rem] shadow-lg w-full h-auto object-cover"
  />
</div>
      </section>

    <section id="rsvp" className="max-w-4xl mx-auto px-6 py-20">
  
  <div className="text-center mb-12">
    <h2 className="text-3xl font-light tracking-wide">
      {lang === "tr" ? "Katılım ve Menü Seçimi" : "Подтверждение участия"}
    </h2>
  </div>

  <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-stone-200">

    {/* Katılım Butonları */}
    <div className="flex gap-4 mb-8 justify-center">
      
      <button
        type="button"
        onClick={() => updateRsvpField("attending", "yes")}
        className={`px-6 py-3 rounded-2xl transition ${
          rsvpForm.attending === "yes"
            ? "bg-stone-900 text-white"
            : "bg-white border border-stone-300"
        }`}
      >
        {lang === "tr" ? "Katılıyorum" : "Я приду"}
      </button>

      <button
        type="button"
        onClick={() => updateRsvpField("attending", "no")}
        className={`px-6 py-3 rounded-2xl transition ${
          rsvpForm.attending === "no"
            ? "bg-stone-900 text-white"
            : "bg-white border border-stone-300"
        }`}
      >
        {lang === "tr" ? "Katılamıyorum" : "Не смогу прийти"}
      </button>

    </div>

    {/* Eğer katılıyorsa */}
    {rsvpForm.attending === "yes" && (

      <div className="grid md:grid-cols-2 gap-6">

        {/* Yemek */}
        <div>
          <label className="block text-sm mb-2">
            {lang === "tr" ? "Yemek Seçimi" : "Выбор блюда"}
          </label>

          <select
            value={rsvpForm.meal_choice}
            onChange={(e) => updateRsvpField("meal_choice", e.target.value)}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none"
          >
          {visibleMealOptions.map((option) => (
  <option key={option.id} value={option.option_label}>
    {lang === "tr" ? option.label_tr : option.label_ru}
  </option>
))}
          </select>
        </div>

        {/* İçecek */}
        <div>
          <label className="block text-sm mb-2">
            {lang === "tr" ? "İçecek Seçimi" : "Выбор напитка"}
          </label>

          <select
            value={rsvpForm.drink_choice}
            onChange={(e) => updateRsvpField("drink_choice", e.target.value)}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none"
          >
           {visibleDrinkOptions.map((option) => (
  <option key={option.id} value={option.option_label}>
    {lang === "tr" ? option.label_tr : option.label_ru}
  </option>
))}
          </select>
        </div>

      </div>
    )}

    {/* Not */}
    <div className="mt-6">
      <label className="block text-sm mb-2">
        {lang === "tr"
          ? "Alerji / Özel Not"
          : "Аллергия / Особые примечания"}
      </label>

      <textarea
        value={rsvpForm.note}
        onChange={(e) => updateRsvpField("note", e.target.value)}
        placeholder={
          lang === "tr"
            ? "Varsa bize iletmek istediğiniz not..."
            : "Если есть, можете оставить комментарий..."
        }
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 min-h-[120px] outline-none"
      />
    </div>

  </div>

</section>

<section id="photos" className="max-w-5xl mx-auto px-6 py-24">

  <div className="text-center mb-14">
    <h2 className="text-3xl font-light tracking-wide">
      {lang === "tr" ? "Fotoğraflar & Anılar" : "Фото и воспоминания"}
    </h2>
  </div>

  <div className="grid md:grid-cols-2 gap-10 items-center">

    {/* FOTOĞRAFLAR */}
    <div className="bg-white/50 backdrop-blur-xl rounded-[2rem] p-8 border border-stone-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

      <h3 className="text-lg font-medium mb-3">
        📸 {lang === "tr" ? "Düğün Fotoğrafları" : "Свадебные фотографии"}
      </h3>

      <p className="text-sm text-stone-600 mb-6 leading-relaxed">
        {lang === "tr"
          ? "Fotoğraflar hazır olduğunda buradan indirebilirsiniz."
          : "По ссылке ниже вы сможете скачать фотографии, как только они будут готовы."}
      </p>

      <div className="flex items-center gap-6">

        {/* QR */}
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://disk.yandex.kz/d/vkmwf_6ImPCqVQ`}
          alt="QR"
          className="rounded-xl border"
        />

        {/* BUTON */}
        <a
          href="https://disk.yandex.kz/d/vkmwf_6ImPCqVQ"
          target="_blank"
          className="px-6 py-3 rounded-2xl bg-stone-900 text-white hover:opacity-90 transition"
        >
          {lang === "tr" ? "Aç" : "Открыть"}
        </a>

      </div>

    </div>


    {/* YÜKLEME */}
    <div className="bg-white/50 backdrop-blur-xl rounded-[2rem] p-8 border border-stone-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

      <h3 className="text-lg font-medium mb-3">
        🎥 {lang === "tr" ? "Sizin Fotoğraf & Videolarınız" : "Ваши фото и видео"}
      </h3>

      <p className="text-sm text-stone-600 mb-6 leading-relaxed">
        {lang === "tr"
          ? "Çektiğiniz fotoğraf ve videoları bizimle paylaşabilirsiniz."
          : "Будем рады, если вы загрузите сюда ваши фото и видео!"}
      </p>

      <div className="flex items-center gap-6">

        {/* QR */}
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://disk.yandex.kz/d/f-cHd4Dqx9idXg`}
          alt="QR"
          className="rounded-xl border"
        />

        {/* BUTON */}
        <a
          href="https://disk.yandex.kz/d/f-cHd4Dqx9idXg"
          target="_blank"
          className="px-6 py-3 rounded-2xl border border-stone-300 hover:bg-stone-100 transition"
        >
          {lang === "tr" ? "Yükle" : "Загрузить"}
        </a>

      </div>

    </div>

  </div>
<section id="location" className="max-w-5xl mx-auto px-6 py-24">
  <div className="text-center mb-14">
    <h2 className="text-3xl md:text-4xl font-light tracking-wide">
      {lang === "tr" ? "Konum" : "Локация"}
    </h2>
  </div>

  <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow text-center">

    <h3 className="text-xl font-medium mb-4">
      Fuga Beach Club
    </h3>

    <p className="text-stone-600 mb-6">
      {lang === "tr"
        ? "Düğünümüz Fuga Beach Club’da gerçekleşecektir."
        : "Наша свадьба состоится в Fuga Beach Club."}
    </p>

    <a
      href="https://www.google.com/maps/place/FUGA+BEACH+CLUB+RESTAURANT/@36.5750178,31.8923091"
      target="_blank"
      className="inline-block bg-black text-white px-6 py-3 rounded-full"
    >
      {lang === "tr" ? "Haritada Aç" : "Открыть на карте"}
    </a>

  </div>
</section>
</section>
<section className="max-w-4xl mx-auto px-6 pb-16">
  <div className="rounded-[2rem] border border-stone-200 bg-white/70 backdrop-blur shadow-sm p-8 text-center">
    <p className="uppercase tracking-[0.35em] text-[11px] text-stone-500 mb-6">
      {lang === "tr" ? "DÜĞÜNE KALAN SÜRE" : "ДО СВАДЬБЫ ОСТАЛОСЬ"}
    </p>

    <Countdown
      target={settings.countdown_target ?? "2026-06-06T18:00:00+03:00"}
      labels={t.countdown}
    />
  </div>
</section>
      <footer className="pb-10 px-6 text-center text-sm text-stone-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="w-4 h-4" />
          <span>{t.footer}</span>
        </div>
        <p>
          {(lang === "tr" ? settings.bride_name_tr : settings.bride_name_ru)} &{" "}
          {(lang === "tr" ? settings.groom_name_tr : settings.groom_name_ru)} •{" "}
          {(lang === "tr" ? settings.date_label_tr : settings.date_label_ru)} •{" "}
          {(lang === "tr" ? settings.venue_tr : settings.venue_ru)}
        </p>
      </footer>
    </div>
  );
}