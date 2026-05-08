"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type FormState = {
  bride_name_tr: string;
  bride_name_ru: string;
  groom_name_tr: string;
  groom_name_ru: string;
  date_label_tr: string;
  date_label_ru: string;
  time_label_tr: string;
  time_label_ru: string;
  venue_tr: string;
  venue_ru: string;
  city_tr: string;
  city_ru: string;
  map_url: string;
  hero_note_tr: string;
  hero_note_ru: string;
  intro_tr: string;
  intro_ru: string;
};

type RsvpResponse = {
  id: string;
  guest_name: string | null;
  attending: boolean | null;
  meal_choice: string | null;
  drink_choice: string | null;
  note: string | null;
  created_at: string | null;
};

type MealOption = {
  id: string;
  category: "meal" | "drink";
  option_label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string | null;
};

type NewOptionForm = {
  category: "meal" | "drink";
  option_label: string;
  sort_order: string;
};

const initialForm: FormState = {
  bride_name_tr: "",
  bride_name_ru: "",
  groom_name_tr: "",
  groom_name_ru: "",
  date_label_tr: "",
  date_label_ru: "",
  time_label_tr: "",
  time_label_ru: "",
  venue_tr: "",
  venue_ru: "",
  city_tr: "",
  city_ru: "",
  map_url: "",
  hero_note_tr: "",
  hero_note_ru: "",
  intro_tr: "",
  intro_ru: "",
};

const fields: { key: keyof FormState; label: string; textarea?: boolean }[] = [
  { key: "bride_name_tr", label: "Gelin Adı (TR)" },
  { key: "bride_name_ru", label: "Gelin Adı (RU)" },
  { key: "groom_name_tr", label: "Damat Adı (TR)" },
  { key: "groom_name_ru", label: "Damat Adı (RU)" },
  { key: "date_label_tr", label: "Tarih (TR)" },
  { key: "date_label_ru", label: "Tarih (RU)" },
  { key: "time_label_tr", label: "Saat (TR)" },
  { key: "time_label_ru", label: "Saat (RU)" },
  { key: "venue_tr", label: "Mekan (TR)" },
  { key: "venue_ru", label: "Mekan (RU)" },
  { key: "city_tr", label: "Şehir (TR)" },
  { key: "city_ru", label: "Şehir (RU)" },
  { key: "map_url", label: "Harita Linki" },
  { key: "hero_note_tr", label: "Hero Yazısı (TR)", textarea: true },
  { key: "hero_note_ru", label: "Hero Yazısı (RU)", textarea: true },
  { key: "intro_tr", label: "Davet Metni (TR)", textarea: true },
  { key: "intro_ru", label: "Davet Metni (RU)", textarea: true },
];

export default function AdminPage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(initialForm);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [responses, setResponses] = useState<RsvpResponse[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(true);

  const [options, setOptions] = useState<MealOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [newOption, setNewOption] = useState<NewOptionForm>({
    category: "meal",
    option_label: "",
    sort_order: "1",
  });
  const [optionMessage, setOptionMessage] = useState("");
  const [addingOption, setAddingOption] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/admin/login");
      return;
    }

    setAuthChecked(true);
    await Promise.all([loadSettings(), loadResponses(), loadOptions()]);
  }

  async function loadSettings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("slug", "main")
      .single();

    if (error) {
      setMessage("Veriler yüklenemedi: " + error.message);
      setLoading(false);
      return;
    }

    setForm({
      bride_name_tr: data?.bride_name_tr ?? "",
      bride_name_ru: data?.bride_name_ru ?? "",
      groom_name_tr: data?.groom_name_tr ?? "",
      groom_name_ru: data?.groom_name_ru ?? "",
      date_label_tr: data?.date_label_tr ?? "",
      date_label_ru: data?.date_label_ru ?? "",
      time_label_tr: data?.time_label_tr ?? "",
      time_label_ru: data?.time_label_ru ?? "",
      venue_tr: data?.venue_tr ?? "",
      venue_ru: data?.venue_ru ?? "",
      city_tr: data?.city_tr ?? "",
      city_ru: data?.city_ru ?? "",
      map_url: data?.map_url ?? "",
      hero_note_tr: data?.hero_note_tr ?? "",
      hero_note_ru: data?.hero_note_ru ?? "",
      intro_tr: data?.intro_tr ?? "",
      intro_ru: data?.intro_ru ?? "",
    });

    setLoading(false);
  }

  async function loadResponses() {
    setLoadingResponses(true);

    const { data, error } = await supabase
      .from("rsvp_responses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setResponses(data);

    setLoadingResponses(false);
  }

  async function loadOptions() {
    setLoadingOptions(true);

    const { data, error } = await supabase
      .from("meal_options")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });

    if (!error && data) setOptions(data);

    setLoadingOptions(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function updateField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("site_settings")
      .update(form)
      .eq("slug", "main");

    if (error) {
      setMessage("Kaydetme hatası: " + error.message);
      setSaving(false);
      return;
    }

    setMessage("Başarıyla kaydedildi.");
    setSaving(false);
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const fileExt = file.name.split(".").pop() || "jpg";
    const filePath = `design/hero-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage("Görsel yüklenemedi: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("design_settings")
      .update({ hero_background_path: filePath })
      .eq("slug", "main");

    if (updateError) {
      setMessage("Görsel yüklendi ama DB’ye yazılamadı: " + updateError.message);
      setUploading(false);
      return;
    }

    setMessage("Görsel başarıyla yüklendi.");
    setUploading(false);
  }

  async function handleAddOption() {
    if (!newOption.option_label.trim()) {
      setOptionMessage("Lütfen seçenek adı girin.");
      return;
    }

    setAddingOption(true);
    setOptionMessage("");

    const { error } = await supabase.from("meal_options").insert({
      category: newOption.category,
      option_label: newOption.option_label.trim(),
      sort_order: Number(newOption.sort_order) || 0,
      is_active: true,
    });

    if (error) {
      setOptionMessage("Seçenek eklenemedi: " + error.message);
      setAddingOption(false);
      return;
    }

    setNewOption({ category: "meal", option_label: "", sort_order: "1" });
    setOptionMessage("Seçenek eklendi.");
    setAddingOption(false);
    loadOptions();
  }

  async function toggleOptionActive(option: MealOption) {
    const { error } = await supabase
      .from("meal_options")
      .update({ is_active: !option.is_active })
      .eq("id", option.id);

    if (error) {
      setOptionMessage("Durum değiştirilemedi: " + error.message);
      return;
    }

    loadOptions();
  }

  async function deleteOption(id: string) {
    const ok = confirm("Bu seçeneği silmek istediğinizden emin misiniz?");
    if (!ok) return;

    const { error } = await supabase.from("meal_options").delete().eq("id", id);

    if (error) {
      setOptionMessage("Silinemedi: " + error.message);
      return;
    }

    setOptionMessage("Seçenek silindi.");
    loadOptions();
  }

  function formatDate(value: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleString("tr-TR");
  }

  function exportToCSV() {
    const rows = [
      ["Tarih", "Misafir", "Katılım", "Yemek", "İçecek", "Not"],
      ...responses.map((item) => [
        formatDate(item.created_at),
        item.guest_name || "",
        item.attending === true ? "Katılıyor" : item.attending === false ? "Katılmıyor" : "",
        item.meal_choice || "",
        item.drink_choice || "",
        item.note || "",
      ]),
    ];

    const csv =
      "\uFEFF" +
      rows
        .map((row) =>
          row
            .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
            .join(";")
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `misafir-cevaplari-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  const stats = useMemo(() => {
    const total = responses.length;
    const attending = responses.filter((x) => x.attending === true).length;
    const notAttending = responses.filter((x) => x.attending === false).length;

 const mealCounts: Record<string, number> = {};
const drinkCounts: Record<string, number> = {};

responses.forEach((item: any) => {
  if (item.guests && Array.isArray(item.guests)) {
    item.guests.forEach((guest: any) => {
      if (guest.meal_choice) {
        mealCounts[guest.meal_choice] =
          (mealCounts[guest.meal_choice] || 0) + 1;
      }

      if (guest.drink_choice) {
        drinkCounts[guest.drink_choice] =
          (drinkCounts[guest.drink_choice] || 0) + 1;
      }
    });
  }
});

    return { total, attending, notAttending, mealCounts, drinkCounts };
  }, [responses]);

  const mealList = options.filter((item) => item.category === "meal");
  const drinkList = options.filter((item) => item.category === "drink");

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-stone-100 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-6">
          Yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-semibold text-stone-900">Admin Panel</h1>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100"
            >
              Çıkış Yap
            </button>
          </div>

          <div className="grid gap-6">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-2">{field.label}</label>

                {field.textarea ? (
                  <textarea
                    className="w-full border rounded-xl px-4 py-3 min-h-[120px]"
                    value={form[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                  />
                ) : (
                  <input
                    className="w-full border rounded-xl px-4 py-3"
                    value={form[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-2">Arka Plan Görseli Yükle</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="rounded-xl bg-stone-900 text-white px-5 py-3 disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : uploading ? "Yükleniyor..." : "Kaydet"}
              </button>

              {message ? <p className="text-sm text-stone-700">{message}</p> : null}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-stone-900 mb-6">Dashboard</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl bg-stone-50 border p-5">
              <p className="text-sm text-stone-500">Toplam Cevap</p>
              <p className="text-4xl font-semibold mt-2">{stats.total}</p>
            </div>

            <div className="rounded-2xl bg-stone-50 border p-5">
              <p className="text-sm text-stone-500">Katılıyor</p>
              <p className="text-4xl font-semibold mt-2">{stats.attending}</p>
            </div>

            <div className="rounded-2xl bg-stone-50 border p-5">
              <p className="text-sm text-stone-500">Katılmıyor</p>
              <p className="text-4xl font-semibold mt-2">{stats.notAttending}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border p-5">
              <h3 className="text-xl font-semibold mb-4">Yemek Dağılımı</h3>
              {Object.entries(stats.mealCounts).length === 0 ? (
                <p className="text-sm text-stone-500">Henüz yemek seçimi yok.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(stats.mealCounts).map(([name, count]) => (
                    <div key={name} className="flex justify-between border-b py-2">
                      <span>{name}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border p-5">
              <h3 className="text-xl font-semibold mb-4">İçecek Dağılımı</h3>
              {Object.entries(stats.drinkCounts).length === 0 ? (
                <p className="text-sm text-stone-500">Henüz içecek seçimi yok.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(stats.drinkCounts).map(([name, count]) => (
                    <div key={name} className="flex justify-between border-b py-2">
                      <span>{name}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-stone-900 mb-6">
            Yemek ve İçecek Seçenekleri
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <select
              className="w-full border rounded-xl px-4 py-3"
              value={newOption.category}
              onChange={(e) =>
                setNewOption((prev) => ({
                  ...prev,
                  category: e.target.value as "meal" | "drink",
                }))
              }
            >
              <option value="meal">Yemek</option>
              <option value="drink">İçecek</option>
            </select>

            <input
              className="w-full border rounded-xl px-4 py-3"
              value={newOption.option_label}
              onChange={(e) =>
                setNewOption((prev) => ({ ...prev, option_label: e.target.value }))
              }
              placeholder="Örn: Vegan"
            />

            <input
              className="w-full border rounded-xl px-4 py-3"
              value={newOption.sort_order}
              onChange={(e) =>
                setNewOption((prev) => ({ ...prev, sort_order: e.target.value }))
              }
              placeholder="Sıra"
            />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleAddOption}
              disabled={addingOption}
              className="rounded-xl bg-stone-900 text-white px-5 py-3 disabled:opacity-60"
            >
              {addingOption ? "Ekleniyor..." : "Yeni Seçenek Ekle"}
            </button>

            {optionMessage ? <p className="text-sm text-stone-700">{optionMessage}</p> : null}
          </div>

          {loadingOptions ? (
            <p>Seçenekler yükleniyor...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Yemek Seçenekleri", list: mealList },
                { title: "İçecek Seçenekleri", list: drinkList },
              ].map((group) => (
                <div key={group.title} className="rounded-2xl border p-5">
                  <h3 className="text-xl font-semibold mb-4">{group.title}</h3>

                  <div className="space-y-3">
                    {group.list.map((item) => (
                      <div key={item.id} className="rounded-xl border bg-stone-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">{item.option_label}</p>
                            <p className="text-xs text-stone-500">
                              Sıra: {item.sort_order} • {item.is_active ? "Aktif" : "Pasif"}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleOptionActive(item)}
                              className="rounded-lg border px-3 py-2 text-sm"
                            >
                              {item.is_active ? "Pasif Yap" : "Aktif Yap"}
                            </button>

                            <button
                              onClick={() => deleteOption(item.id)}
                              className="rounded-lg border border-red-300 text-red-600 px-3 py-2 text-sm"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {group.list.length === 0 ? (
                      <p className="text-sm text-stone-500">Seçenek yok.</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-stone-900">Gelen Anket Cevapları</h2>

            <div className="flex gap-3">
              <button onClick={loadResponses} className="rounded-xl border px-4 py-2 text-sm">
                Yenile
              </button>

              <button
                onClick={exportToCSV}
                className="rounded-xl bg-green-700 text-white px-4 py-2 text-sm"
              >
                Excel / CSV İndir
              </button>
            </div>
          </div>

          {loadingResponses ? (
            <p>Cevaplar yükleniyor...</p>
          ) : responses.length === 0 ? (
            <p>Henüz cevap gelmedi.</p>
          ) : (
            <div className="grid gap-4">
              {responses.map((item) => (
                <div key={item.id} className="rounded-2xl border bg-stone-50 p-5">
                  <div className="flex justify-between gap-3 mb-3">
                    <h3 className="text-lg font-semibold">{item.guest_name || "-"}</h3>
                    <span className="text-xs text-stone-500">{formatDate(item.created_at)}</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <strong>Katılım:</strong>{" "}
                      {item.attending === true
                        ? "Katılıyor"
                        : item.attending === false
                        ? "Katılmıyor"
                        : "-"}
                    </div>

                    <div>
                      <strong>Yemek:</strong> {item.meal_choice || "-"}
                    </div>

                    <div>
                      <strong>İçecek:</strong> {item.drink_choice || "-"}
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <strong>Not:</strong>
                    <p className="mt-1 whitespace-pre-line">{item.note || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}