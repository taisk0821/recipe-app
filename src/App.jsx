import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Refrigerator, Flame, Plus, X, Minus, RotateCcw, Users, Soup,
  Clock, Dices, ShoppingCart, CheckCircle2, History, AlarmClock,
  Trash2, Camera, ImageOff, Menu, ChevronLeft,
} from "lucide-react";

const COLORS = {
  bg: "#283831",
  surface: "#34453C",
  surfaceAlt: "#3E5048",
  chalk: "#F4F1E8",
  accent: "#F2C14E",
  accent2: "#E8744A",
  muted: "#9FB0A4",
  border: "#46594F",
};

const DISPLAY_FONT = "'Yomogi', sans-serif";
const BODY_FONT = "'Zen Kaku Gothic New', sans-serif";
const MONO_FONT = "'JetBrains Mono', monospace";

const ALL_SEASONINGS = [
  "塩", "こしょう", "砂糖", "醤油", "味噌", "みりん", "酒",
  "サラダ油", "ごま油", "にんにく(チューブ)", "しょうが(チューブ)", "コンソメ",
];

const DEFAULT_SEASONINGS = ["塩", "こしょう", "砂糖", "醤油", "サラダ油"];

const MOODS = [
  { key: "gatsuri", label: "がっつり" },
  { key: "sappari", label: "さっぱり" },
  { key: "attaka", label: "あったか" },
  { key: "jitan", label: "時短" },
];

const UNITS = {
  卵: "個", 豚肉: "g", 鶏肉: "g", キャベツ: "g", にんじん: "本", 玉ねぎ: "個", ねぎ: "本",
  豆腐: "丁", ごはん: "杯", じゃがいも: "個", トマト: "個", なす: "本", もやし: "袋",
  納豆: "パック", 鮭: "切れ", ツナ: "缶", 牛乳: "ml", ベーコン: "枚", キムチ: "g", 大根: "cm",
};

const DEFAULT_QTY = {
  卵: 4, 豚肉: 200, 鶏肉: 300, キャベツ: 300, にんじん: 2, 玉ねぎ: 2, ねぎ: 1,
  豆腐: 1, ごはん: 2, じゃがいも: 3, トマト: 2, なす: 2, もやし: 1, 納豆: 3,
  鮭: 2, ツナ: 1, 牛乳: 200, ベーコン: 3, キムチ: 100, 大根: 10,
};

const STEP_QTY = {
  卵: 1, 豚肉: 50, 鶏肉: 50, キャベツ: 50, にんじん: 1, 玉ねぎ: 1, ねぎ: 1,
  豆腐: 1, ごはん: 1, じゃがいも: 1, トマト: 1, なす: 1, もやし: 1, 納豆: 1,
  鮭: 1, ツナ: 1, 牛乳: 50, ベーコン: 1, キムチ: 50, 大根: 5,
};

const ALL_INGREDIENTS = [
  "卵", "豚肉", "鶏肉", "キャベツ", "にんじん", "玉ねぎ", "ねぎ", "豆腐",
  "ごはん", "じゃがいも", "トマト", "なす", "もやし", "納豆", "鮭", "ツナ",
  "牛乳", "ベーコン", "キムチ", "大根",
];

const RECIPES = [
  {
    id: 1, name: "豚肉と野菜の味噌炒め", kcal: 450, time: 15, moods: ["gatsuri"],
    ingredients: [
      { name: "豚肉", amount: 200 }, { name: "キャベツ", amount: 150 }, { name: "にんじん", amount: 1 },
    ],
    seasonings: ["味噌", "みりん", "醤油", "サラダ油"],
    steps: [
      "豚肉200gは一口大、キャベツ150gはざく切り、にんじん1/2本は短冊切りにする",
      "味噌大さじ1と1/2・みりん大さじ1・醤油小さじ1を混ぜて合わせ調味料を作っておく",
      "フライパンにサラダ油大さじ1/2を熱し、豚肉を中火で2〜3分炒める",
      "肉の色が変わったらにんじん→キャベツの順に加え、2分ほど炒める",
      "合わせ調味料を回し入れ、全体に絡めながら1分炒めたら完成",
    ],
  },
  {
    id: 2, name: "オムレツ", kcal: 250, time: 10, moods: ["jitan"],
    ingredients: [{ name: "卵", amount: 2 }, { name: "牛乳", amount: 30 }],
    seasonings: ["塩", "こしょう", "バター"],
    steps: [
      "卵2個をボウルに割り、牛乳大さじ2・塩ひとつまみ・こしょう少々を加えてよく溶く",
      "フライパンを中火で熱し、バター10gを溶かす",
      "卵液を一気に流し込み、菜箸で大きく混ぜながら半熟状にする",
      "フライパンの奥に寄せて形を整え、手前に折りたたむ",
      "お皿に滑らせるように盛り付けて完成。お好みでケチャップを",
    ],
  },
  {
    id: 3, name: "野菜たっぷり卵チャーハン", kcal: 550, time: 15, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "卵", amount: 2 }, { name: "ごはん", amount: 2 },
      { name: "ねぎ", amount: 1 }, { name: "にんじん", amount: 1 },
    ],
    seasonings: ["塩", "こしょう", "醤油", "ごま油", "鶏ガラスープの素"],
    steps: [
      "にんじん1/3本はみじん切り、ねぎ1/2本は小口切りにする。卵2個は溶いておく",
      "フライパンにごま油大さじ1を強火で熱し、にんじんを1分炒める",
      "溶き卵を流し入れ、すぐに温かいごはん2杯分を加えて卵と絡めながら炒める",
      "鶏ガラスープの素小さじ1・塩こしょう少々で味付けし、ほぐしながら2分炒める",
      "ねぎを加え、鍋肌から醤油小さじ1を回し入れて香りを立たせたら完成",
    ],
  },
  {
    id: 4, name: "豆腐と卵のとろとろスープ", kcal: 150, time: 10, moods: ["attaka", "sappari", "jitan"],
    ingredients: [{ name: "豆腐", amount: 1 }, { name: "卵", amount: 1 }, { name: "ねぎ", amount: 1 }],
    seasonings: ["顆粒だし", "醤油", "塩"],
    steps: [
      "鍋に水400mlと顆粒だし小さじ1を入れて中火で沸かす",
      "豆腐1/2丁を1.5cm角に切って加え、1分ほど煮る",
      "醤油小さじ1・塩少々で味を整える",
      "溶き卵1個分を細く回し入れ、ふんわり浮いてきたら火を止める",
      "小口切りのねぎを散らして完成",
    ],
  },
  {
    id: 5, name: "鶏肉と玉ねぎの照り焼き", kcal: 400, time: 20, moods: ["gatsuri"],
    ingredients: [{ name: "鶏肉", amount: 300 }, { name: "玉ねぎ", amount: 1 }],
    seasonings: ["醤油", "みりん", "砂糖", "サラダ油"],
    steps: [
      "鶏肉300gは一口大に切り、玉ねぎ1/2個はくし切りにする",
      "醤油大さじ2・みりん大さじ2・砂糖大さじ1/2を混ぜてタレを作っておく",
      "フライパンにサラダ油小さじ1を熱し、鶏肉を皮目から中火で3〜4分焼く",
      "裏返して玉ねぎを加え、2分炒める",
      "タレを回し入れ、煮絡めながら照りが出るまで2〜3分加熱したら完成",
    ],
  },
  {
    id: 6, name: "キャベツと豚肉のミルフィーユ蒸し", kcal: 380, time: 20, moods: ["sappari", "attaka"],
    ingredients: [{ name: "豚肉", amount: 200 }, { name: "キャベツ", amount: 200 }],
    seasonings: ["酒", "塩", "ポン酢"],
    steps: [
      "キャベツ200gは大きめの葉のまま、豚肉200gと交互に4〜5層に重ねる",
      "重ねたものを5cm幅に切り、断面を上にして鍋に敷き詰める",
      "酒大さじ2と塩ひとつまみを全体に回しかける",
      "ふたをして中火で熱し、蒸気が出たら弱火にして8〜10分蒸し焼きにする",
      "豚肉に火が通ったら、ポン酢をかけていただく",
    ],
  },
  {
    id: 7, name: "納豆ごはん", kcal: 350, time: 3, moods: ["jitan", "sappari"],
    ingredients: [{ name: "納豆", amount: 2 }, { name: "ごはん", amount: 2 }],
    seasonings: [],
    steps: [
      "温かいごはんを茶碗に盛る",
      "納豆を50回ほどよく混ぜて粘りを出す",
      "付属のたれとからしを加えてさらに混ぜる",
      "ごはんにのせて完成。お好みで卵黄やねぎ、ごま油数滴も合う",
    ],
  },
  {
    id: 8, name: "もやしと豚肉のうま塩炒め", kcal: 420, time: 10, moods: ["gatsuri", "jitan"],
    ingredients: [{ name: "豚肉", amount: 200 }, { name: "もやし", amount: 1 }],
    seasonings: ["塩", "こしょう", "ごま油", "鶏ガラスープの素", "にんにく(チューブ)"],
    steps: [
      "豚肉200gは一口大に切り、塩こしょう少々をふっておく",
      "フライパンにごま油大さじ1とにんにくチューブ2cmを入れ、弱火で香りを出す",
      "豚肉を加えて中火で2〜3分炒める",
      "もやし1袋を加えて強火にし、1分半さっと炒める",
      "鶏ガラスープの素小さじ1・塩こしょうで味を整えたら完成。炒めすぎないのがコツ",
    ],
  },
  {
    id: 9, name: "トマトと卵の中華風炒め", kcal: 220, time: 10, moods: ["sappari", "jitan"],
    ingredients: [{ name: "トマト", amount: 2 }, { name: "卵", amount: 2 }],
    seasonings: ["塩", "砂糖", "ごま油", "鶏ガラスープの素"],
    steps: [
      "トマト2個はくし切り、卵2個は塩ひとつまみを加えて溶いておく",
      "フライパンにごま油大さじ1を強火で熱し、卵を半熟に炒めて一度取り出す",
      "同じフライパンでトマトを1分炒め、砂糖小さじ1/2と鶏ガラスープの素小さじ1/2を加える",
      "卵を戻し入れ、大きく混ぜて10秒で火を止める。卵に火を通しすぎないこと",
    ],
  },
  {
    id: 10, name: "じゃがいもと玉ねぎのコンソメスープ", kcal: 300, time: 20, moods: ["attaka"],
    ingredients: [
      { name: "じゃがいも", amount: 2 }, { name: "玉ねぎ", amount: 1 }, { name: "ベーコン", amount: 2 },
    ],
    seasonings: ["コンソメ", "塩", "こしょう", "サラダ油"],
    steps: [
      "じゃがいも2個は1.5cm角、玉ねぎ1/2個は薄切り、ベーコン2枚は1cm幅に切る",
      "鍋にサラダ油小さじ1を熱し、ベーコンと玉ねぎを2分炒める",
      "じゃがいもを加えてさっと炒め、水500mlとコンソメ小さじ2を加える",
      "沸騰したら弱火にし、じゃがいもが柔らかくなるまで10分煮る",
      "塩こしょうで味を整えたら完成",
    ],
  },
  {
    id: 11, name: "鮭の塩焼きと大根おろし", kcal: 280, time: 15, moods: ["sappari"],
    ingredients: [{ name: "鮭", amount: 2 }, { name: "大根", amount: 5 }],
    seasonings: ["塩", "醤油"],
    steps: [
      "鮭2切れに塩小さじ1/2をふり、10分置いて出てきた水分を拭き取る",
      "大根5cmは皮をむいてすりおろし、軽く水気を切る",
      "グリルまたはフライパンで、鮭を中火で片面4分ずつ焼く",
      "皮がパリッとして中まで火が通ったら皿に盛る",
      "大根おろしを添え、お好みで醤油を数滴たらして完成",
    ],
  },
  {
    id: 12, name: "キムチ豆腐チゲ風", kcal: 380, time: 15, moods: ["attaka", "gatsuri"],
    ingredients: [{ name: "豆腐", amount: 1 }, { name: "キムチ", amount: 150 }, { name: "豚肉", amount: 150 }],
    seasonings: ["味噌", "ごま油", "顆粒だし"],
    steps: [
      "豚肉150gは一口大に切る",
      "鍋にごま油大さじ1/2を熱し、豚肉を中火で2分炒める",
      "キムチ150gを加えて1分炒め、香りを出す",
      "水400mlと顆粒だし小さじ1を加えて煮立たせる",
      "豆腐1丁をスプーンですくって加え、味噌大さじ1を溶き入れて3分煮たら完成",
    ],
  },
  {
    id: 13, name: "ツナとキャベツのサラダ", kcal: 320, time: 10, moods: ["sappari", "jitan"],
    ingredients: [{ name: "ツナ", amount: 1 }, { name: "キャベツ", amount: 150 }],
    seasonings: ["マヨネーズ", "塩", "こしょう"],
    steps: [
      "キャベツ150gを千切りにし、塩小さじ1/4をふって5分置く",
      "しんなりしたら水分をぎゅっと絞る",
      "油を切ったツナ1缶とマヨネーズ大さじ2を加えて和える",
      "こしょう少々で味を整えたら完成。お好みで醤油数滴やごまも合う",
    ],
  },
  {
    id: 14, name: "なすと豚肉の味噌炒め", kcal: 430, time: 15, moods: ["gatsuri"],
    ingredients: [{ name: "なす", amount: 2 }, { name: "豚肉", amount: 200 }],
    seasonings: ["味噌", "みりん", "砂糖", "サラダ油"],
    steps: [
      "なす2本は乱切り、豚肉200gは一口大に切る",
      "味噌大さじ1と1/2・みりん大さじ1・砂糖小さじ1を混ぜておく",
      "フライパンにサラダ油大さじ1を熱し、なすを中火で3分炒めて一度取り出す",
      "豚肉を2〜3分炒め、火が通ったらなすを戻す",
      "合わせ調味料を加えて全体に絡め、1分炒めたら完成",
    ],
  },
  {
    id: 15, name: "卵とねぎのチャーハン風", kcal: 480, time: 10, moods: ["gatsuri", "jitan"],
    ingredients: [{ name: "卵", amount: 2 }, { name: "ねぎ", amount: 1 }, { name: "ごはん", amount: 2 }],
    seasonings: ["塩", "こしょう", "醤油", "サラダ油"],
    steps: [
      "ねぎ1/2本は小口切り、卵2個は溶いておく",
      "フライパンにサラダ油大さじ1を強火で熱し、溶き卵を流し入れる",
      "すぐに温かいごはん2杯分を加え、卵と絡めながらほぐし炒める",
      "塩こしょう少々で味付けし、パラッとするまで2分炒める",
      "ねぎを加え、鍋肌から醤油小さじ1を回し入れて香りづけしたら完成",
    ],
  },
];

const isQuantifiable = (name) => Object.prototype.hasOwnProperty.call(DEFAULT_QTY, name);

const resizeImage = (file, maxWidth, quality) =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const w = Math.min(img.width, maxWidth);
      const h = Math.round((img.height / img.width) * w);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = url;
  });

const LS = {
  get: (key, fallback) => {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

const NAV_ITEMS = [
  { page: "pantry",   label: "調味料棚",     icon: Soup },
  { page: "shopping", label: "買い物リスト",  icon: ShoppingCart },
  { page: "history",  label: "履歴",          icon: History },
];

export default function FridgeMenuApp() {
  const [fridge, setFridge] = useState(() => LS.get("fridge", {}));
  const [useSoon, setUseSoon] = useState(new Set());
  const [pantry, setPantry] = useState(() => new Set(LS.get("pantry", DEFAULT_SEASONINGS)));
  const [servings, setServings] = useState(() => LS.get("servings", 2));
  const [moodFilter, setMoodFilter] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [hasDecided, setHasDecided] = useState(false);
  const [randomPick, setRandomPick] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [customSeasoningInput, setCustomSeasoningInput] = useState("");
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [history, setHistory] = useState(() => {
    let t = 0;
    return LS.get("history", []).map((h) => ({ ...h, uid: h.uid ?? --t, at: new Date(h.at) }));
  });
  const [shoppingList, setShoppingList] = useState(() => LS.get("shoppingList", []));
  const [shoppingInput, setShoppingInput] = useState("");
  const [shoppingMemo, setShoppingMemo] = useState(() => LS.get("shoppingMemo", ""));
  const [currentPage, setCurrentPage] = useState("main");
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const fileInputRef = useRef(null);
  const pendingUidRef = useRef(null);

  useEffect(() => { LS.set("fridge", fridge); }, [fridge]);
  useEffect(() => { LS.set("pantry", [...pantry]); }, [pantry]);
  useEffect(() => { LS.set("servings", servings); }, [servings]);
  useEffect(() => { LS.set("history", history.map((h) => ({ ...h, at: h.at.toISOString() }))); }, [history]);
  useEffect(() => { LS.set("shoppingList", shoppingList); }, [shoppingList]);
  useEffect(() => { LS.set("shoppingMemo", shoppingMemo); }, [shoppingMemo]);

  const selectedNames = Object.keys(fridge);
  const recentIds = new Set(history.slice(-3).map((h) => h.id));

  const toggleIngredient = (name) => {
    setFridge((prev) => {
      const next = { ...prev };
      if (name in next) {
        delete next[name];
        setUseSoon((s) => { const ns = new Set(s); ns.delete(name); return ns; });
      } else {
        next[name] = isQuantifiable(name) ? DEFAULT_QTY[name] : true;
      }
      return next;
    });
  };

  const toggleUseSoon = (name) => {
    setUseSoon((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const toggleSeasoning = (name) => {
    setPantry((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const updateQty = (name, delta) => {
    setFridge((prev) => {
      const step = STEP_QTY[name] || 1;
      const cur = prev[name] || 0;
      return { ...prev, [name]: Math.max(step, cur + delta * step) };
    });
  };

  const addCustom = () => {
    const value = customInput.trim();
    if (value && !(value in fridge)) setFridge((prev) => ({ ...prev, [value]: true }));
    setCustomInput("");
  };

  const addCustomSeasoning = () => {
    const value = customSeasoningInput.trim();
    if (value && !pantry.has(value)) setPantry((prev) => new Set([...prev, value]));
    setCustomSeasoningInput("");
  };

  const addToShoppingList = (item) => {
    setShoppingList((prev) => (prev.includes(item) ? prev : [...prev, item]));
  };

  const removeFromShoppingList = (item) => {
    setShoppingList((prev) => prev.filter((i) => i !== item));
  };

  const addShoppingItem = () => {
    const value = shoppingInput.trim();
    if (value && !shoppingList.includes(value)) {
      setShoppingList((prev) => [...prev, value]);
    }
    setShoppingInput("");
  };

  const markAsMade = (recipe) => {
    const uid = Date.now();
    pendingUidRef.current = uid;
    setHistory((prev) => [...prev, { uid, id: recipe.id, name: recipe.name, at: new Date() }]);
    fileInputRef.current?.click();
  };

  const deleteHistory = (uid) => {
    if (!window.confirm("この履歴を削除しますか？")) return;
    setHistory((prev) => prev.filter((h) => h.uid !== uid));
  };

  const deletePhoto = (uid) => {
    setHistory((prev) => prev.map((h) => h.uid === uid ? { ...h, photo: undefined } : h));
  };

  const changePhoto = (uid) => {
    pendingUidRef.current = uid;
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    const uid = pendingUidRef.current;
    pendingUidRef.current = null;
    if (!file || !uid) return;
    const resized = await resizeImage(file, 400, 0.75);
    setHistory((prev) => prev.map((h) => h.uid === uid ? { ...h, photo: resized } : h));
  };

  const navigate = (page) => { setCurrentPage(page); setSideMenuOpen(false); };

  const sortedRecipes = useMemo(() => {
    const factor = servings / 2;
    return RECIPES.map((r) => {
      const details = r.ingredients.map((ing) => {
        const required = Math.max(1, Math.round(ing.amount * factor));
        const have = fridge[ing.name] || 0;
        let status;
        if (have <= 0) status = "missing";
        else if (have >= required) status = "ok";
        else status = "insufficient";
        return { ...ing, have, required, status };
      });
      const missingSeasonings = (r.seasonings || []).filter((s) => !pantry.has(s));
      const ingScore = details.reduce((sum, d) => {
        if (d.status === "ok") return sum + 1;
        if (d.status === "insufficient") return sum + d.have / d.required;
        return sum;
      }, 0);
      let coverage = ingScore / details.length;
      coverage *= 1 - Math.min(0.3, missingSeasonings.length * 0.05);
      const useSoonHit = details.filter((d) => useSoon.has(d.name) && d.status !== "missing").length;
      coverage += useSoonHit * 0.25;
      if (recentIds.has(r.id)) coverage *= 0.4;
      const okCount = details.filter((d) => d.status === "ok").length;
      return { ...r, details, missingSeasonings, coverage, okCount, useSoonHit, displayKcal: Math.round(r.kcal * factor) };
    })
      .filter((r) => r.okCount > 0 || r.details.some((d) => d.status === "insufficient"))
      .filter((r) => (moodFilter ? r.moods.includes(moodFilter) : true))
      .sort((a, b) => b.coverage - a.coverage || a.time - b.time);
  }, [fridge, pantry, servings, moodFilter, useSoon, history]);

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(sortedRecipes.length / pageSize));
  const candidates = randomPick
    ? sortedRecipes.filter((r) => r.id === randomPick).length
      ? sortedRecipes.filter((r) => r.id === randomPick)
      : sortedRecipes.slice(0, 1)
    : sortedRecipes.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

  const handleDecide = () => { setHasDecided(true); setRandomPick(null); setPageIndex(0); setExpandedSteps({}); };

  const handleRandom = () => {
    if (sortedRecipes.length === 0) { setHasDecided(true); return; }
    const pool = sortedRecipes.slice(0, Math.min(6, sortedRecipes.length));
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setRandomPick(pick.id);
    setHasDecided(true);
    setExpandedSteps({});
  };

  const handleRefresh = () => { setPageIndex((p) => (p + 1) % totalPages); setExpandedSteps({}); };
  const toggleSteps = (id) => { setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] })); };

  const iconBtn = (label, onClick, icon, color) => (
    <button onClick={onClick}
      className="chalk-btn flex items-center justify-center rounded-full"
      style={{ width: "1.8rem", height: "1.8rem", backgroundColor: COLORS.surface, flexShrink: 0 }}
      aria-label={label}>
      {React.createElement(icon, { size: 13, style: { color } })}
    </button>
  );

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: BODY_FONT, color: COLORS.chalk }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yomogi&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=JetBrains+Mono:wght@500;700&display=swap');
        @keyframes draw-circle { to { stroke-dashoffset: 0; } }
        .circle-path {
          stroke-dasharray: 900; stroke-dashoffset: 900;
          animation: draw-circle 0.9s ease-out forwards; animation-delay: 0.25s;
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.5s ease-out forwards; }
        .chip { transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease; }
        .chalk-btn:active { transform: translateY(1px); }
        .bg-texture {
          background-image: radial-gradient(${COLORS.surfaceAlt}55 1px, transparent 1px);
          background-size: 18px 18px;
        }
        .side-drawer {
          position: fixed; top: 0; left: 0; height: 100%; width: 260px; z-index: 50;
          background-color: ${COLORS.surface};
          border-right: 1px solid ${COLORS.border};
          transition: transform 0.25s ease;
        }
      `}</style>

      {/* Overlay */}
      {sideMenuOpen && (
        <div onClick={() => setSideMenuOpen(false)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", zIndex: 40 }} />
      )}

      {/* Side drawer */}
      <nav className="side-drawer" style={{ transform: sideMenuOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={{ padding: "4.5rem 1.25rem 1.5rem" }}>
          <p style={{ color: COLORS.muted, fontFamily: MONO_FONT, fontSize: "0.7rem", letterSpacing: "0.18em", marginBottom: "1.25rem" }}>
            MENU
          </p>
          {NAV_ITEMS.map(({ page, label, icon: Icon }) => {
            const badge =
              page === "pantry" ? `${pantry.size}種類` :
              page === "shopping" && shoppingList.length > 0 ? `${shoppingList.length}件` :
              page === "history" && history.length > 0 ? `${history.length}件` : null;
            const active = currentPage === page;
            return (
              <button key={page} onClick={() => navigate(page)}
                className="chalk-btn w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-sm font-bold"
                style={{
                  backgroundColor: active ? COLORS.surfaceAlt : "transparent",
                  color: active ? COLORS.accent : COLORS.chalk,
                  textAlign: "left",
                }}>
                <Icon size={17} style={{ color: active ? COLORS.accent : COLORS.muted, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{ color: COLORS.muted, fontFamily: MONO_FONT, fontSize: "0.7rem" }}>{badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Hamburger — fixed top-right */}
      <button onClick={() => setSideMenuOpen(true)}
        className="chalk-btn"
        aria-label="メニューを開く"
        style={{
          position: "fixed", top: "1.1rem", right: "1.1rem", zIndex: 45,
          width: "2.4rem", height: "2.4rem",
          backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
          borderRadius: "0.6rem",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
        <Menu size={18} style={{ color: COLORS.chalk }} />
      </button>

      {/* Page content */}
      <div className="max-w-md mx-auto px-5" style={{ paddingTop: "4.5rem", paddingBottom: "3rem" }}>

        {/* ── MAIN ── */}
        {currentPage === "main" && (
          <>
            <header className="mb-8">
              <p style={{ color: COLORS.muted, fontFamily: MONO_FONT, fontSize: "0.7rem", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
                TODAY&apos;S MENU
              </p>
              <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: "2.4rem", lineHeight: 1.3, color: COLORS.chalk }}>
                今日のごはん、<br />決めました。
              </h1>
              <p className="mt-3 text-sm" style={{ color: COLORS.muted }}>
                冷蔵庫の中身を選ぶだけ。あとはおまかせ。
              </p>
            </header>

            {/* 人数 */}
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Users size={18} style={{ color: COLORS.accent }} />
                <h2 className="text-sm font-bold">何人前つくる?</h2>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button key={n} onClick={() => setServings(n)}
                    className="chalk-btn flex-1 py-2 rounded-lg text-sm border"
                    style={{
                      backgroundColor: servings === n ? COLORS.accent : "transparent",
                      color: servings === n ? COLORS.bg : COLORS.chalk,
                      borderColor: servings === n ? COLORS.accent : COLORS.border,
                      fontWeight: servings === n ? 700 : 400,
                      fontFamily: MONO_FONT,
                    }}>
                    {n}人前
                  </button>
                ))}
              </div>
            </section>

            {/* きぶん */}
            <section className="mb-6">
              <h2 className="text-sm font-bold mb-3">今日のきぶん</h2>
              <div className="flex gap-2">
                {MOODS.map((m) => {
                  const active = moodFilter === m.key;
                  return (
                    <button key={m.key} onClick={() => setMoodFilter(active ? null : m.key)}
                      className="chip chalk-btn flex-1 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: active ? COLORS.accent2 : "transparent",
                        color: active ? COLORS.bg : COLORS.chalk,
                        borderColor: active ? COLORS.accent2 : COLORS.border,
                        fontWeight: active ? 700 : 400,
                      }}>
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 選んだ食材 */}
            {selectedNames.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Refrigerator size={18} style={{ color: COLORS.accent }} />
                  <h2 className="text-sm font-bold">選んだ食材と個数</h2>
                </div>
                <p className="text-xs mb-3" style={{ color: COLORS.muted }}>
                  ⏰マークをタップすると「早く使い切りたい食材」として優先されるよ
                </p>
                <div className="flex flex-col gap-2">
                  {selectedNames.map((name) => {
                    const quantifiable = isQuantifiable(name);
                    const unit = UNITS[name] || "";
                    const soon = useSoon.has(name);
                    return (
                      <div key={name} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: COLORS.surface, border: `1px solid ${soon ? COLORS.accent2 : COLORS.border}` }}>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <button onClick={() => toggleUseSoon(name)}
                            className="chalk-btn flex-shrink-0 flex items-center justify-center rounded-full"
                            style={{ width: "1.8rem", height: "1.8rem", backgroundColor: soon ? COLORS.accent2 : COLORS.surfaceAlt }}
                            aria-label={`${name}を使い切り優先にする`}>
                            <AlarmClock size={14} style={{ color: soon ? COLORS.bg : COLORS.muted }} />
                          </button>
                          <span className="text-sm truncate">{name}</span>
                          {soon && <span className="text-xs flex-shrink-0" style={{ color: COLORS.accent2 }}>早めに使う</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {quantifiable ? (
                            <>
                              <button onClick={() => updateQty(name, -1)}
                                className="chalk-btn flex items-center justify-center rounded-full"
                                style={{ width: "1.8rem", height: "1.8rem", backgroundColor: COLORS.surfaceAlt }}
                                aria-label={`${name}を減らす`}>
                                <Minus size={14} style={{ color: COLORS.chalk }} />
                              </button>
                              <span style={{ fontFamily: MONO_FONT, fontSize: "0.85rem", minWidth: "3.2rem", textAlign: "center" }}>
                                {fridge[name]}{unit}
                              </span>
                              <button onClick={() => updateQty(name, 1)}
                                className="chalk-btn flex items-center justify-center rounded-full"
                                style={{ width: "1.8rem", height: "1.8rem", backgroundColor: COLORS.surfaceAlt }}
                                aria-label={`${name}を増やす`}>
                                <Plus size={14} style={{ color: COLORS.chalk }} />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs" style={{ color: COLORS.muted, fontFamily: MONO_FONT }}>あり</span>
                          )}
                          <button onClick={() => toggleIngredient(name)}
                            className="chalk-btn flex items-center justify-center rounded-full"
                            style={{ width: "1.8rem", height: "1.8rem" }}
                            aria-label={`${name}を削除`}>
                            <X size={14} style={{ color: COLORS.muted }} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 食材追加 */}
            <section className="mb-6">
              <h2 className="text-sm font-bold mb-3">食材を追加する</h2>
              <div className="flex flex-wrap gap-2">
                {ALL_INGREDIENTS.filter((ing) => !(ing in fridge)).map((ing) => (
                  <button key={ing} onClick={() => toggleIngredient(ing)}
                    className="chip chalk-btn px-3 py-1.5 rounded-full text-sm border flex items-center gap-1"
                    style={{ backgroundColor: "transparent", color: COLORS.chalk, borderColor: COLORS.border }}>
                    <Plus size={12} />
                    {ing}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustom()}
                  placeholder="その他の食材を入力"
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.chalk, fontFamily: BODY_FONT }} />
                <button onClick={addCustom}
                  className="chalk-btn px-3 py-2 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}` }}
                  aria-label="食材を追加">
                  <Plus size={18} style={{ color: COLORS.chalk }} />
                </button>
              </div>
            </section>

            {/* 決定ボタン */}
            <div className="flex flex-col gap-2 mb-8">
              <button onClick={handleDecide} disabled={selectedNames.length === 0}
                className="chalk-btn w-full py-3 rounded-xl text-base font-bold"
                style={{
                  backgroundColor: selectedNames.length === 0 ? COLORS.surfaceAlt : COLORS.accent,
                  color: selectedNames.length === 0 ? COLORS.muted : COLORS.bg,
                  cursor: selectedNames.length === 0 ? "not-allowed" : "pointer",
                }}>
                今日のごはんを決める
              </button>
              <button onClick={handleRandom} disabled={selectedNames.length === 0}
                className="chalk-btn w-full py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "transparent",
                  color: selectedNames.length === 0 ? COLORS.muted : COLORS.accent2,
                  border: `2px dashed ${selectedNames.length === 0 ? COLORS.border : COLORS.accent2}`,
                  cursor: selectedNames.length === 0 ? "not-allowed" : "pointer",
                }}>
                <Dices size={20} />
                もう何も考えたくない(おまかせ1択)
              </button>
            </div>

            {/* 候補表示 */}
            {hasDecided && candidates.length > 0 && (
              <div className="flex flex-col gap-4 mb-8">
                {randomPick && (
                  <p className="text-center fade-up" style={{ color: COLORS.accent2, fontFamily: DISPLAY_FONT, fontSize: "1.2rem" }}>
                    今日はこれ!考えるのおしまい!
                  </p>
                )}
                {candidates.map((recipe, index) => {
                  const isTop = (index === 0 && pageIndex === 0) || !!randomPick;
                  const open = !!expandedSteps[recipe.id];
                  const made = history.some((h) => h.id === recipe.id);
                  return (
                    <section key={recipe.id} className="fade-up rounded-2xl p-5 bg-texture"
                      style={{ backgroundColor: COLORS.surface, border: `1px solid ${isTop ? COLORS.accent : COLORS.border}`, animationDelay: `${index * 0.08}s` }}>
                      <div className="flex items-center justify-between mb-4">
                        <p style={{ color: isTop ? COLORS.accent : COLORS.muted, fontFamily: MONO_FONT, fontSize: "0.7rem", letterSpacing: "0.2em" }}>
                          {randomPick ? "運命の一品" : isTop ? "本日のおすすめ" : `候補 ${pageIndex * pageSize + index + 1}`}
                        </p>
                        {recipe.useSoonHit > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                            style={{ backgroundColor: COLORS.accent2, color: COLORS.bg }}>
                            <AlarmClock size={11} />使い切り
                          </span>
                        )}
                      </div>

                      {isTop ? (
                        <div className="relative inline-block mb-1">
                          <svg viewBox="0 0 300 110" className="absolute"
                            style={{ top: "-18%", left: "-8%", width: "116%", height: "140%", overflow: "visible", pointerEvents: "none" }}>
                            <path className="circle-path"
                              d="M 18 58 C 16 22, 90 4, 152 7 C 232 11, 292 28, 282 58 C 292 92, 220 112, 150 109 C 70 113, 12 96, 18 58 Z"
                              fill="none" stroke={COLORS.accent2} strokeWidth="4" strokeLinecap="round" />
                          </svg>
                          <h3 style={{ fontFamily: DISPLAY_FONT, fontSize: "1.9rem", color: COLORS.chalk, position: "relative" }}>{recipe.name}</h3>
                        </div>
                      ) : (
                        <h3 style={{ fontFamily: DISPLAY_FONT, fontSize: "1.5rem", color: COLORS.chalk }}>{recipe.name}</h3>
                      )}

                      <div className="flex items-center gap-4 mt-3 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Flame size={16} style={{ color: COLORS.accent2 }} />
                          <span style={{ fontFamily: MONO_FONT, fontSize: "0.9rem", color: COLORS.accent2, fontWeight: 700 }}>約{recipe.displayKcal}kcal</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} style={{ color: COLORS.accent }} />
                          <span style={{ fontFamily: MONO_FONT, fontSize: "0.9rem", color: COLORS.accent, fontWeight: 700 }}>約{recipe.time}分</span>
                        </div>
                        <span className="text-xs" style={{ color: COLORS.muted }}>
                          {recipe.moods.map((m) => MOODS.find((x) => x.key === m)?.label).join("・")}
                        </span>
                      </div>

                      <div className="mb-2">
                        <p className="text-xs mb-1.5" style={{ color: COLORS.muted }}>
                          必要な食材({servings}人前)。足りないものはタップで買い物リストへ
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {recipe.details.map((d) => {
                            const lacking = d.status !== "ok";
                            let bg = COLORS.surfaceAlt, color = COLORS.muted, border = "none";
                            if (d.status === "ok") { bg = COLORS.accent; color = COLORS.bg; }
                            else if (d.status === "insufficient") { bg = "transparent"; color = COLORS.accent2; border = `1px solid ${COLORS.accent2}`; }
                            else { bg = "transparent"; color = COLORS.muted; border = `1px solid ${COLORS.border}`; }
                            const unit = UNITS[d.name] || "";
                            const label = d.status === "insufficient"
                              ? `${d.name} ${d.required}${unit}(持ってる${d.have}${unit})`
                              : `${d.name} ${d.required}${unit}`;
                            return (
                              <button key={d.name} onClick={() => lacking && addToShoppingList(d.name)}
                                className="px-2.5 py-1 rounded-full text-xs"
                                style={{ backgroundColor: bg, color, border, fontFamily: BODY_FONT, cursor: lacking ? "pointer" : "default" }}>
                                {label}{lacking ? " +" : ""}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {recipe.seasonings.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs mb-1.5" style={{ color: COLORS.muted }}>使う調味料</p>
                          <div className="flex flex-wrap gap-1.5">
                            {recipe.seasonings.map((s) => {
                              const has = pantry.has(s);
                              return (
                                <button key={s} onClick={() => !has && addToShoppingList(s)}
                                  className="px-2.5 py-1 rounded-full text-xs"
                                  style={{
                                    backgroundColor: has ? COLORS.surfaceAlt : "transparent",
                                    color: has ? COLORS.chalk : COLORS.accent2,
                                    border: has ? "none" : `1px solid ${COLORS.accent2}`,
                                    fontFamily: BODY_FONT, cursor: has ? "default" : "pointer",
                                  }}>
                                  {has ? s : `${s} ✕なし +`}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-3">
                        <button onClick={() => toggleSteps(recipe.id)}
                          className="chalk-btn flex-1 py-2.5 rounded-lg text-sm font-bold"
                          style={{ backgroundColor: COLORS.surfaceAlt, color: COLORS.chalk }}>
                          {open ? "作り方を閉じる" : "作り方を見る"}
                        </button>
                        <button onClick={() => markAsMade(recipe)}
                          className="chalk-btn flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5"
                          style={{
                            backgroundColor: made ? COLORS.accent : "transparent",
                            color: made ? COLORS.bg : COLORS.accent,
                            border: made ? "none" : `1px solid ${COLORS.accent}`,
                          }}>
                          <CheckCircle2 size={15} />
                          {made ? "作った!" : "これ作った"}
                        </button>
                      </div>

                      {open && (
                        <>
                          <p className="text-xs mt-3 mb-2" style={{ color: COLORS.muted }}>
                            ※分量は2人前基準。人数に合わせて調整してね
                          </p>
                          <ol className="mb-2 space-y-2">
                            {recipe.steps.map((step, idx) => (
                              <li key={idx} className="flex gap-2.5 text-sm" style={{ color: COLORS.chalk }}>
                                <span className="flex-shrink-0 flex items-center justify-center rounded-full"
                                  style={{ width: "1.4rem", height: "1.4rem", backgroundColor: COLORS.accent, color: COLORS.bg, fontFamily: MONO_FONT, fontSize: "0.7rem", fontWeight: 700 }}>
                                  {idx + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </>
                      )}
                    </section>
                  );
                })}

                {!randomPick && totalPages > 1 && (
                  <button onClick={handleRefresh}
                    className="chalk-btn w-full py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5"
                    style={{ color: COLORS.muted, border: `1px solid ${COLORS.border}` }}>
                    <RotateCcw size={14} />
                    ほかの3件を見る ({pageIndex + 1}/{totalPages})
                  </button>
                )}
                {randomPick && (
                  <button onClick={handleRandom}
                    className="chalk-btn w-full py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5"
                    style={{ color: COLORS.accent2, border: `1px dashed ${COLORS.accent2}` }}>
                    <Dices size={14} />もう一回まわす
                  </button>
                )}
              </div>
            )}

            {hasDecided && candidates.length === 0 && (
              <section className="fade-up rounded-2xl p-5 text-center mb-8"
                style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.muted }}>
                <p style={{ fontSize: "0.95rem" }}>
                  その条件で作れる料理が見つからなかった…<br />
                  食材を増やすか、きぶんフィルターを外してみて。
                </p>
              </section>
            )}
          </>
        )}

        {/* ── PANTRY ── */}
        {currentPage === "pantry" && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Soup size={20} style={{ color: COLORS.accent }} />
                <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: "2rem", color: COLORS.chalk }}>調味料棚</h1>
              </div>
              <p className="text-sm" style={{ color: COLORS.muted }}>{pantry.size}種類 登録中</p>
            </div>
            <p className="text-xs mb-4" style={{ color: COLORS.muted }}>
              家にある調味料を登録しておくと、レシピ提案のときに考慮されます。
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {ALL_SEASONINGS.map((s) => {
                const has = pantry.has(s);
                return (
                  <button key={s} onClick={() => toggleSeasoning(s)}
                    className="chip chalk-btn px-3 py-1.5 rounded-full text-sm border"
                    style={{
                      backgroundColor: has ? COLORS.accent : "transparent",
                      color: has ? COLORS.bg : COLORS.chalk,
                      borderColor: has ? COLORS.accent : COLORS.border,
                      fontWeight: has ? 700 : 400,
                    }}>
                    {s}
                  </button>
                );
              })}
              {[...pantry].filter((s) => !ALL_SEASONINGS.includes(s)).map((s) => (
                <button key={s} onClick={() => toggleSeasoning(s)}
                  className="chip chalk-btn px-3 py-1.5 rounded-full text-sm border flex items-center gap-1"
                  style={{ backgroundColor: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent, fontWeight: 700 }}>
                  {s}<X size={10} />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={customSeasoningInput}
                onChange={(e) => setCustomSeasoningInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomSeasoning()}
                placeholder="その他の調味料を追加"
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={{ backgroundColor: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, color: COLORS.chalk, fontFamily: BODY_FONT }} />
              <button onClick={addCustomSeasoning}
                className="chalk-btn px-3 py-2 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}` }}
                aria-label="調味料を追加">
                <Plus size={18} style={{ color: COLORS.chalk }} />
              </button>
            </div>
          </>
        )}

        {/* ── SHOPPING ── */}
        {currentPage === "shopping" && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart size={20} style={{ color: COLORS.accent }} />
              <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: "2rem", color: COLORS.chalk }}>買い物リスト</h1>
            </div>

            {/* 手動追加入力 */}
            <div className="flex gap-2 mb-4">
              <input value={shoppingInput}
                onChange={(e) => setShoppingInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addShoppingItem()}
                placeholder="追加したいものを入力"
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.chalk, fontFamily: BODY_FONT }} />
              <button onClick={addShoppingItem}
                className="chalk-btn px-3 py-2 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}` }}
                aria-label="リストに追加">
                <Plus size={18} style={{ color: COLORS.chalk }} />
              </button>
            </div>

            {/* リスト */}
            {shoppingList.length === 0 ? (
              <p className="text-sm mb-6" style={{ color: COLORS.muted }}>
                リストは空です。上の入力欄から追加するか、レシピ画面で足りない食材・調味料をタップしてください。
              </p>
            ) : (
              <div className="flex flex-col gap-2 mb-6">
                {shoppingList.map((item) => (
                  <div key={item} className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                    <span className="text-sm">{item}</span>
                    <button onClick={() => removeFromShoppingList(item)}
                      className="chalk-btn" aria-label={`${item}をリストから削除`}>
                      <X size={16} style={{ color: COLORS.muted }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* フリーメモ */}
            <div>
              <p className="text-xs mb-2" style={{ color: COLORS.muted }}>メモ</p>
              <textarea
                value={shoppingMemo}
                onChange={(e) => setShoppingMemo(e.target.value)}
                placeholder="自由にメモを書けます"
                rows={5}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                style={{
                  backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  color: COLORS.chalk, fontFamily: BODY_FONT, lineHeight: 1.7,
                }} />
            </div>
          </>
        )}

        {/* ── HISTORY ── */}
        {currentPage === "history" && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <History size={20} style={{ color: COLORS.accent }} />
              <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: "2rem", color: COLORS.chalk }}>作ったごはんの記録</h1>
            </div>
            {history.length === 0 ? (
              <p className="text-sm" style={{ color: COLORS.muted }}>
                まだ記録がありません。レシピ画面で「これ作った」を押すと記録されます。
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  {[...history].reverse().map((h, i) => (
                    <div key={h.uid ?? i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                      {h.photo ? (
                        <button onClick={() => setLightboxPhoto(h.photo)} className="flex-shrink-0" aria-label="写真を拡大表示">
                          <img src={h.photo} alt={h.name}
                            style={{ width: "2.8rem", height: "2.8rem", objectFit: "cover", borderRadius: "0.4rem" }} />
                        </button>
                      ) : (
                        <div className="flex-shrink-0"
                          style={{ width: "2.8rem", height: "2.8rem", borderRadius: "0.4rem", backgroundColor: COLORS.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "1.1rem" }}>🍽</span>
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="text-sm truncate">{h.name}</p>
                        <p className="text-xs" style={{ color: COLORS.muted, fontFamily: MONO_FONT }}>
                          {h.at.getMonth() + 1}/{h.at.getDate()} {String(h.at.getHours()).padStart(2, "0")}:{String(h.at.getMinutes()).padStart(2, "0")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {iconBtn("写真を変更", () => changePhoto(h.uid), Camera, COLORS.accent)}
                        {h.photo && iconBtn("写真を削除", () => deletePhoto(h.uid), ImageOff, COLORS.muted)}
                        {iconBtn("履歴を削除", () => deleteHistory(h.uid), Trash2, COLORS.accent2)}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-4" style={{ color: COLORS.muted }}>
                  最近作った料理は、次の提案でちょっと出にくくなるよ
                </p>
              </>
            )}
          </>
        )}

      </div>

      <input ref={fileInputRef} type="file" accept="image/*"
        onChange={handlePhotoSelected} style={{ display: "none" }} aria-hidden="true" />

      {lightboxPhoto && (
        <div onClick={() => setLightboxPhoto(null)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: "1rem", cursor: "zoom-out" }}>
          <img src={lightboxPhoto} alt="料理の写真"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "0.5rem" }} />
        </div>
      )}
    </div>
  );
}
