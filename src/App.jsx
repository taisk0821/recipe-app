import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Refrigerator, Flame, Plus, X, Minus, RotateCcw, Users, Soup,
  Clock, Dices, ShoppingCart, CheckCircle2, History, AlarmClock,
  Trash2, Camera, ImageOff, Menu, ChevronLeft,
  HardDrive, Download, Upload, Home, Search, CalendarDays,
} from "lucide-react";

const COLORS = {
  bg: "#2E3D36",
  surface: "#384E45",
  surfaceAlt: "#42594F",
  chalk: "#F4F1E8",
  accent: "#F2C14E",
  accent2: "#E8744A",
  muted: "#8FA89E",
  border: "#4E675D",
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

const RECIPE_EMOJIS = {
  1: "🥘", 2: "🍳", 3: "🍚", 4: "🍲", 5: "🍗",
  6: "🥬", 7: "🥢", 8: "🥩", 9: "🍅", 10: "🥣",
  11: "🐟", 12: "🌶️", 13: "🥗", 14: "🍆", 15: "🍳",
  16: "🥘", 17: "🍲", 18: "🥬", 19: "🐟", 20: "🍳",
  21: "🥚", 22: "🥩", 23: "🍖", 24: "🌶️", 25: "🍜",
  26: "🍗", 27: "🍔", 28: "🥕", 29: "🌿", 30: "🥛",
  31: "🍅", 32: "🍝", 33: "🍜", 34: "🍚", 35: "🍝",
  36: "🥢", 37: "🥘", 38: "🥗", 39: "🐠", 40: "🥕",
  41: "🐟", 42: "🥩", 43: "🍱", 44: "🥬", 45: "🥩",
  46: "🐠", 47: "🍗", 48: "🍲", 49: "🍳", 50: "🌶️",
  51: "🦐", 52: "🥘", 53: "🥛", 54: "🥘", 55: "🦐",
  56: "🍜", 57: "🍜", 58: "🍝", 59: "🍅", 60: "🍗",
  61: "🥦", 62: "🌭", 63: "🥦", 64: "🥢", 65: "🌿",
  66: "🍲", 67: "🐟", 68: "🐷", 69: "🍅", 70: "🥚",
  71: "🍛", 72: "🥣", 73: "🎃", 74: "🥣", 75: "🧅",
  76: "🥬", 77: "🍲", 78: "🥚", 79: "🍡", 80: "🌿",
  81: "🎃", 82: "🥩", 83: "🐟", 84: "🐟", 85: "🍔",
  86: "🥦", 87: "🌶️",
  88: "🍜", 89: "🍜", 90: "🍜", 91: "🍜", 92: "🍜",
  93: "🍜", 94: "🍜", 95: "🍜",
  96: "🍝", 97: "🍝", 98: "🍝", 99: "🍝", 100: "🍝",
  101: "🍚", 102: "🍚", 103: "🍚", 104: "🍚", 105: "🍚",
  106: "🍳", 107: "🌶️", 108: "🦐", 109: "🍳",
  110: "🦐", 111: "🍗", 112: "🍖", 113: "🐟", 114: "🥔",
  115: "🦐", 116: "🍗", 117: "🥚", 118: "🍗", 119: "🥢",
  120: "🥢", 121: "🥟", 122: "🐟", 123: "🐟", 124: "🍗",
  125: "🥩", 126: "🍆", 127: "🥢", 128: "🍗", 129: "🦐",
  130: "🌭", 131: "🥩",
  132: "🍗", 133: "🥕", 134: "🌿", 135: "🥩", 136: "🌿",
  137: "🥬", 138: "🍗", 139: "🍢", 140: "🥬", 141: "🥬",
  142: "🥢", 143: "🥕", 144: "🥒", 145: "🥢", 146: "🥚",
  147: "🥕", 148: "🌿", 149: "🥦", 150: "🥢", 151: "🥢",
  152: "🍗", 153: "🍆",
  154: "🌿", 155: "🍛", 156: "🍜", 157: "🍚", 158: "🥩",
  159: "🍳", 160: "🍗", 161: "🥘", 162: "🍖", 163: "🥩",
  164: "🦐", 165: "🌶️", 166: "🥢", 167: "🥬", 168: "🍗",
  169: "🥩", 170: "🍖", 171: "🍗", 172: "🍅", 173: "🍝",
  174: "🥔", 175: "🐟",
};

const CARD_GRADIENTS = [
  "linear-gradient(140deg, #4B6050 0%, #354A3C 100%)",
  "linear-gradient(140deg, #5C4A36 0%, #453828 100%)",
  "linear-gradient(140deg, #3A4E5C 0%, #2C3E4A 100%)",
  "linear-gradient(140deg, #5A4E30 0%, #443C22 100%)",
  "linear-gradient(140deg, #4E3845 0%, #3A2C38 100%)",
];

const RECIPE_SEARCH_TERMS = {
  1: "miso pork stir fry japanese",
  2: "omelette egg dish",
  3: "egg fried rice japanese",
  4: "tofu soup japanese",
  5: "teriyaki chicken japanese",
  6: "steamed pork cabbage",
  7: "natto rice bowl japanese",
  8: "bean sprouts pork stir fry",
  9: "tomato egg chinese stir fry",
  10: "potato onion soup",
  11: "grilled salmon japanese",
  12: "kimchi tofu stew korean",
  13: "tuna salad fresh",
  14: "eggplant stir fry miso",
  15: "fried rice egg green onion",
  16: "nikujaga japanese beef potato stew",
  17: "tonjiru pork miso soup japanese",
  18: "spinach sesame ohitashi japanese",
  19: "yellowtail teriyaki buri japanese",
  20: "oyakodon chicken egg rice bowl",
  21: "tamagoyaki japanese rolled egg",
  22: "gyudon beef rice bowl japanese",
  23: "pork donburi rice bowl japanese",
  24: "mapo tofu chinese spicy",
  25: "yaki udon stir fry noodles",
  26: "karaage japanese fried chicken",
  27: "hambagu japanese hamburger steak",
  28: "kinpira gobo burdock carrot japanese",
  29: "nira egg chive stir fry chinese",
  30: "cream stew japanese white",
  31: "chicken tomato stew italian",
  32: "hiyashi chuka cold noodles summer",
  33: "miso ramen noodle soup bowl",
  34: "somen thin noodles japanese summer",
  35: "spaghetti aglio olio garlic",
  36: "scrambled tofu japanese iridofu",
  37: "daikon radish pork stew japanese",
  38: "potato salad japanese creamy",
  39: "salmon miso butter vegetable",
  40: "carrot egg stir fry okinawa",
  41: "saba mackerel miso simmered japanese",
  42: "sukiyaki beef napa cabbage japanese hot pot",
  43: "atsuage thick tofu pork sweet soy",
  44: "komatsuna spinach mustard greens egg stir fry",
  45: "shogayaki ginger pork japanese",
  46: "buri daikon simmered fish japanese",
  47: "chicken miso yaki japanese grilled",
  48: "napa cabbage tofu chinese soup",
  49: "soboro don chicken minced rice bowl",
  50: "butakimchi pork kimchi rice bowl",
  51: "shrimp egg chinese stir fry donburi",
  52: "pot au feu french stew bacon vegetable",
  53: "soy milk hot pot nabe japanese",
  54: "happosai chinese stir fry shrimp",
  55: "ebi chili shrimp chili sauce chinese",
  56: "yakisoba stir fry noodles japanese",
  57: "tantanmen sesame miso noodle soup",
  58: "carbonara pasta egg bacon creamy",
  59: "minestrone vegetable tomato soup italian",
  60: "chicken piccata egg flour pan fried",
  61: "broccoli gratin white sauce baked",
  62: "sausage potato saute pan fried",
  63: "broccoli egg chinese stir fry",
  64: "tofu steak teriyaki sauce japanese",
  65: "komatsuna pork garlic stir fry",
  66: "mizutaki chicken hot pot japanese clear broth",
  67: "ishikari nabe salmon miso hot pot hokkaido",
  68: "pork nira garlic cabbage hot pot japanese",
  69: "tomato hot pot nabe chicken vegetable",
  70: "egg drop tofu nabe japanese clear soup",
  71: "curry hot pot nabe japanese pork potato",
  72: "kenchinjiru tofu vegetable miso soup japanese",
  73: "pumpkin potage soup creamy",
  74: "pork cabbage consomme soup",
  75: "french onion soup gratin baked",
  76: "spinach egg chinese soup",
  77: "chicken daikon japanese clear soup",
  78: "tamagoyaki sweet egg bento japanese",
  79: "tsukune chicken meatball skewer japanese",
  80: "renkon lotus root kinpira stir fry",
  81: "kabocha pumpkin simmered sweet soy japanese",
  82: "beef shigureni ginger sweet soy japanese",
  83: "salmon nanban pickled vinegar japanese",
  84: "chikuwa fish cake stir fry japanese",
  85: "tofu hamburger steak japanese",
  86: "broccoli sesame salad ohitashi japanese",
  87: "green pepper beef stir fry chinese",
  88: "curry udon noodle soup japanese",
  89: "nikomi udon simmered noodles japanese",
  90: "tsukimi udon egg noodle soup japanese",
  91: "kitsune udon tofu puff noodle soup",
  92: "zaru soba cold buckwheat noodles japanese",
  93: "tonkotsu ramen pork broth noodles japanese",
  94: "shio ramen salt broth noodles japanese clear",
  95: "shoyu ramen soy sauce broth noodles japanese",
  96: "napolitan spaghetti ketchup japanese pasta",
  97: "tuna tomato pasta spaghetti italian",
  98: "shrimp tomato cream pasta italian",
  99: "chicken butter soy sauce pasta japanese",
  100: "bolognese meat sauce spaghetti pasta",
  101: "takikomi gohan chicken rice japanese",
  102: "salmon takikomi gohan rice japanese",
  103: "shrimp pilaf fried rice butter",
  104: "tomato risotto italian parmesan rice",
  105: "bacon cream risotto butter",
  106: "pork fried rice chinese wok",
  107: "kimchi fried rice korean spicy",
  108: "shrimp fried rice chinese wok",
  109: "omurice japanese omelette ketchup rice",
  110: "shrimp fry breaded deep fried ebi furai",
  111: "chicken katsu breaded fried cutlet japanese",
  112: "pork katsu don rice bowl tonkatsu",
  113: "salmon fry breaded fish",
  114: "korokke croquette potato ground beef japanese",
  115: "kakiage mixed tempura shrimp onion",
  116: "tatsuta age marinated fried chicken japanese",
  117: "chawanmushi savory egg custard steamed japanese",
  118: "steamed chicken sesame sauce yodare",
  119: "pork roll steam vegetables japanese",
  120: "steamed tofu chinese sauce ginger scallion",
  121: "steamed tofu ground pork chinese",
  122: "grilled mackerel salt saba shioyaki japanese",
  123: "salmon butter soy sauce pan fried",
  124: "chicken honey mustard grilled",
  125: "pork miso marinated grilled yakitori",
  126: "eggplant dengaku miso grilled japanese",
  127: "atsuage teriyaki thick fried tofu pan",
  128: "roasted chicken potato onion oven baked",
  129: "shrimp broccoli ajillo garlic oil",
  130: "sausage potato carrot oven roasted",
  131: "pork saute pan fried simple butter garlic",
  132: "chikuzen ni chicken vegetable simmered japanese",
  133: "kiriboshi daikon dried radish carrot simmered",
  134: "hijiki seaweed carrot aburaage simmered japanese",
  135: "kakuni braised pork belly soy sauce ginger",
  136: "konnyaku konjac stir fried simmered soy sauce",
  137: "pork napa cabbage layered simmered japanese",
  138: "chicken potato japanese simmered stew",
  139: "oden japanese winter hot pot daikon egg",
  140: "spinach ohitashi blanched japanese side",
  141: "komatsuna greens ohitashi blanched japanese",
  142: "shiraae tofu spinach white sesame japanese",
  143: "daikon namasu carrot radish pickled vinegar",
  144: "cucumber asazuke quick pickled japanese",
  145: "agedashi tofu deep fried broth japanese",
  146: "ajitsuke tamago marinated soy sauce egg ramen",
  147: "carrot kinpira stir fried sweet soy japanese",
  148: "gobo burdock sesame miso dressed japanese",
  149: "broccoli ohitashi blanched soy japanese",
  150: "tofu dengaku miso grilled tofu japanese",
  151: "aburaage fried tofu sweet soy simmered",
  152: "chicken daikon sweet soy simmered japanese",
  153: "eggplant miso simmered nasu japanese",
  154: "pad kra pao thai basil chicken fried rice",
  155: "green curry thai coconut milk chicken",
  156: "pho vietnamese chicken noodle soup",
  157: "bibimbap korean rice bowl vegetables egg",
  158: "bulgogi korean marinated beef grilled",
  159: "nasi goreng indonesian fried rice shrimp",
  160: "samgyetang korean ginseng chicken soup",
  161: "twice cooked pork huiguorou cabbage pepper chinese",
  162: "sweet sour pork chinese vinegar karaage",
  163: "beef broccoli chinese stir fry",
  164: "shrimp salt stir fry chinese garlic",
  165: "pork miso spicy stir fry chinese",
  166: "harusame spring noodles pork soup chinese",
  167: "stuffed cabbage roll consomme western",
  168: "chicken doria rice gratin japanese",
  169: "beef stew brown sauce western",
  170: "meatball tomato sauce italian",
  171: "tandoori chicken indian spice yogurt",
  172: "ratatouille french vegetable tomato stew",
  173: "pasta chicken macaroni gratin white sauce",
  174: "hash brown potato pancake crispy",
  175: "salmon cream sauce white butter french",
};

const UNSPLASH_CACHE_KEY = "unsplash_cache_v10";
const UNSPLASH_CACHE_TTL = 24 * 60 * 60 * 1000;

const UNITS = {
  卵: "個", 豚肉: "g", 鶏肉: "g", キャベツ: "g", にんじん: "本", 玉ねぎ: "個", ねぎ: "本",
  豆腐: "丁", ごはん: "杯", じゃがいも: "個", トマト: "個", なす: "本", もやし: "袋",
  納豆: "パック", 鮭: "切れ", ツナ: "缶", 牛乳: "ml", ベーコン: "枚", キムチ: "g", 大根: "cm",
  牛肉: "g", ひき肉: "g", ほうれん草: "袋", うどん: "玉", 中華麺: "玉",
  そうめん: "束", スパゲッティ: "g", ごぼう: "本", ぶり: "切れ", にら: "袋",
  さば: "切れ", 白菜: "g", 小松菜: "袋", えび: "g", ウインナー: "本", ブロッコリー: "個", 厚揚げ: "個",
  かぼちゃ: "個", れんこん: "g", ちくわ: "本", ピーマン: "個",
  そば: "束", 油揚げ: "枚", 米: "合",
  こんにゃく: "枚", 切り干し大根: "g", ひじき: "g", きゅうり: "本",
  春雨: "g",
};

const DEFAULT_QTY = {
  卵: 4, 豚肉: 200, 鶏肉: 300, キャベツ: 300, にんじん: 2, 玉ねぎ: 2, ねぎ: 1,
  豆腐: 1, ごはん: 2, じゃがいも: 3, トマト: 2, なす: 2, もやし: 1, 納豆: 3,
  鮭: 2, ツナ: 1, 牛乳: 200, ベーコン: 3, キムチ: 100, 大根: 10,
  牛肉: 200, ひき肉: 200, ほうれん草: 1, うどん: 2, 中華麺: 2,
  そうめん: 3, スパゲッティ: 200, ごぼう: 1, ぶり: 2, にら: 1,
  さば: 2, 白菜: 200, 小松菜: 1, えび: 150, ウインナー: 4, ブロッコリー: 1, 厚揚げ: 1,
  かぼちゃ: 1, れんこん: 150, ちくわ: 3, ピーマン: 3,
  そば: 2, 油揚げ: 2, 米: 2,
  こんにゃく: 1, 切り干し大根: 30, ひじき: 20, きゅうり: 2,
  春雨: 50,
};

const STEP_QTY = {
  卵: 1, 豚肉: 50, 鶏肉: 50, キャベツ: 50, にんじん: 1, 玉ねぎ: 1, ねぎ: 1,
  豆腐: 1, ごはん: 1, じゃがいも: 1, トマト: 1, なす: 1, もやし: 1, 納豆: 1,
  鮭: 1, ツナ: 1, 牛乳: 50, ベーコン: 1, キムチ: 50, 大根: 5,
  牛肉: 50, ひき肉: 50, ほうれん草: 1, うどん: 1, 中華麺: 1,
  そうめん: 1, スパゲッティ: 50, ごぼう: 1, ぶり: 1, にら: 1,
  さば: 1, 白菜: 50, 小松菜: 1, えび: 50, ウインナー: 2, ブロッコリー: 1, 厚揚げ: 1,
  かぼちゃ: 1, れんこん: 50, ちくわ: 1, ピーマン: 1,
  そば: 1, 油揚げ: 1, 米: 1,
  こんにゃく: 1, 切り干し大根: 10, ひじき: 5, きゅうり: 1,
  春雨: 25,
};

const ALL_INGREDIENTS = [
  "卵", "豚肉", "鶏肉", "キャベツ", "にんじん", "玉ねぎ", "ねぎ", "豆腐",
  "ごはん", "じゃがいも", "トマト", "なす", "もやし", "納豆", "鮭", "ツナ",
  "牛乳", "ベーコン", "キムチ", "大根",
  "牛肉", "ひき肉", "ほうれん草", "うどん", "中華麺", "そうめん", "スパゲッティ",
  "ごぼう", "ぶり", "にら",
  "さば", "白菜", "小松菜", "えび", "ウインナー", "ブロッコリー", "厚揚げ",
  "かぼちゃ", "れんこん", "ちくわ", "ピーマン",
  "そば", "油揚げ", "米",
  "こんにゃく", "切り干し大根", "ひじき", "きゅうり",
  "春雨",
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
  {
    id: 16, name: "肉じゃが", kcal: 420, time: 30, moods: ["gatsuri", "attaka"],
    ingredients: [
      { name: "牛肉", amount: 200 }, { name: "じゃがいも", amount: 3 },
      { name: "玉ねぎ", amount: 1 }, { name: "にんじん", amount: 1 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "サラダ油", "顆粒だし"],
    steps: [
      "牛肉200gは食べやすい大きさに、じゃがいも3個は4等分、玉ねぎ1/2個はくし切り、にんじん1本は乱切りにする",
      "鍋にサラダ油大さじ1を熱し、牛肉を中火で1〜2分炒める。色が変わったら野菜を加える",
      "さらに2分炒め、水250ml・醤油大さじ2・みりん大さじ2・砂糖大さじ1・酒大さじ1・顆粒だし小さじ1を加える",
      "沸騰したらアクを取り、落としぶた(またはキッチンペーパー)をして弱火で15分煮る",
      "じゃがいもに竹串が通ったら完成。汁気が多い場合は中火で少し煮詰めて",
    ],
  },
  {
    id: 17, name: "豚汁", kcal: 280, time: 20, moods: ["attaka"],
    ingredients: [
      { name: "豚肉", amount: 150 }, { name: "大根", amount: 5 },
      { name: "にんじん", amount: 1 }, { name: "じゃがいも", amount: 1 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["味噌", "ごま油", "顆粒だし", "しょうが(チューブ)"],
    steps: [
      "豚肉150gは3cm幅に切る。大根5cmはいちょう切り、にんじん1/2本は半月切り、玉ねぎ1/4個はくし切り、じゃがいも1個は1.5cm角に切る",
      "鍋にごま油小さじ1を熱し、豚肉を中火で2分炒める",
      "野菜を加えてさっと炒め、水600mlと顆粒だし小さじ2を加える",
      "沸騰したらアクを取り、弱火で野菜が柔らかくなるまで10分煮る",
      "火を弱め、味噌大さじ2をとき入れる。しょうがチューブ1cmを加えて火を止め完成",
    ],
  },
  {
    id: 18, name: "ほうれん草のごまあえ", kcal: 80, time: 8, moods: ["sappari", "jitan"],
    ingredients: [{ name: "ほうれん草", amount: 1 }],
    seasonings: ["醤油", "砂糖", "みりん"],
    steps: [
      "ほうれん草1袋を沸騰したお湯で1〜2分茹でる",
      "すぐに冷水に取り、冷めたら水気をしっかり絞る",
      "4cm幅に切る",
      "醤油小さじ2・砂糖小さじ1・みりん小さじ1を混ぜてたれを作る",
      "ほうれん草とたれを和えて器に盛る。すりごまをたっぷり振ると風味アップ",
    ],
  },
  {
    id: 19, name: "ぶりの照り焼き", kcal: 340, time: 15, moods: ["sappari", "gatsuri"],
    ingredients: [{ name: "ぶり", amount: 2 }],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "サラダ油"],
    steps: [
      "ぶり2切れに塩少々をふって5分おき、出てきた水分をペーパーで拭き取る",
      "醤油大さじ1と1/2・みりん大さじ1・砂糖小さじ1・酒大さじ1を混ぜてタレを作る",
      "フライパンにサラダ油小さじ1を中火で熱し、ぶりを皮目から3分焼く",
      "裏返してさらに2分焼き、余分な油をペーパーで拭き取る",
      "タレを加えて弱中火で絡め、照りが出たら完成。大根おろしを添えると◎",
    ],
  },
  {
    id: 20, name: "親子丼", kcal: 530, time: 15, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "鶏肉", amount: 200 }, { name: "卵", amount: 3 },
      { name: "玉ねぎ", amount: 1 }, { name: "ごはん", amount: 2 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "顆粒だし"],
    steps: [
      "鶏肉200gは一口大に切り、玉ねぎ1/2個は薄切りにする",
      "小鍋に水100ml・醤油大さじ2・みりん大さじ2・砂糖大さじ1/2・酒大さじ1・顆粒だし小さじ1を合わせて沸かす",
      "玉ねぎを加えて2分、鶏肉を加えて火が通るまで5分煮る",
      "溶き卵3個分を2回に分けて回し入れ、ふたをして30秒ほどで半熟にする",
      "温かいごはん2杯に半分ずつのせて完成。三つ葉をのせると本格的",
    ],
  },
  {
    id: 21, name: "だし巻き卵", kcal: 160, time: 10, moods: ["jitan", "sappari"],
    ingredients: [{ name: "卵", amount: 3 }],
    seasonings: ["顆粒だし", "砂糖", "醤油", "サラダ油"],
    steps: [
      "卵3個をよく溶き、水大さじ2・顆粒だし小さじ1/2・砂糖大さじ1/2・醤油小さじ1/2を加えて混ぜる",
      "卵焼き器にサラダ油を薄く引き、中弱火で熱する",
      "卵液の1/3量を流し入れ、半熟になったら奥から手前に3〜4回折り畳む",
      "奥に移して油を薄く引き、残りの卵液を2回に分けて同様に焼く",
      "巻き簾で形を整え、粗熱が取れたら切り分けて完成。お弁当にも◎",
    ],
  },
  {
    id: 22, name: "牛丼", kcal: 590, time: 15, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "牛肉", amount: 200 }, { name: "玉ねぎ", amount: 1 }, { name: "ごはん", amount: 2 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "顆粒だし"],
    steps: [
      "玉ねぎ1/2個を薄切りにする。牛肉200gは食べやすい大きさにほぐしておく",
      "鍋に水150ml・醤油大さじ2・みりん大さじ2・砂糖大さじ1・酒大さじ1・顆粒だし小さじ1を入れて沸かす",
      "玉ねぎを加えて中火で2〜3分煮る",
      "牛肉をほぐしながら加え、アクを取りながら2〜3分煮る",
      "汁気をほどよく煮詰め、温かいごはん2杯にのせて完成。紅しょうが・七味はお好みで",
    ],
  },
  {
    id: 23, name: "豚バラ丼", kcal: 620, time: 12, moods: ["gatsuri"],
    ingredients: [
      { name: "豚肉", amount: 250 }, { name: "玉ねぎ", amount: 1 }, { name: "ごはん", amount: 2 },
    ],
    seasonings: ["醤油", "みりん", "酒", "砂糖", "ごま油"],
    steps: [
      "豚肉250gは4〜5cm幅に切り、玉ねぎ1/2個は薄切りにする",
      "醤油大さじ2・みりん大さじ1・酒大さじ1・砂糖小さじ1を混ぜてタレを作る",
      "フライパンにごま油小さじ1を熱し、豚肉を中火で3分炒める",
      "玉ねぎを加えてしんなりするまで2分炒め、タレを回し入れる",
      "照りが出るまで炒め合わせ、温かいごはんにのせて完成。七味をかけると◎",
    ],
  },
  {
    id: 24, name: "麻婆豆腐", kcal: 380, time: 15, moods: ["gatsuri", "attaka"],
    ingredients: [{ name: "豆腐", amount: 1 }, { name: "ひき肉", amount: 150 }],
    seasonings: ["味噌", "醤油", "ごま油", "砂糖", "酒", "にんにく(チューブ)", "しょうが(チューブ)", "鶏ガラスープの素"],
    steps: [
      "豆腐1丁を2cm角に切り、キッチンペーパーで軽く水気を取る",
      "フライパンにごま油大さじ1・にんにくチューブ2cm・しょうがチューブ1cmを入れ、弱火で香りを出す",
      "ひき肉150gを加えて中火でしっかり炒める",
      "水150ml・鶏ガラスープの素小さじ1・味噌大さじ1・醤油大さじ1・砂糖小さじ1・酒大さじ1を加えて煮立てる",
      "豆腐を加えて3分煮る。お好みで水溶き片栗粉でとろみをつけたら完成",
    ],
  },
  {
    id: 25, name: "焼きうどん", kcal: 480, time: 12, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "うどん", amount: 2 }, { name: "豚肉", amount: 150 }, { name: "キャベツ", amount: 100 },
    ],
    seasonings: ["醤油", "ごま油", "酒", "塩", "こしょう", "鶏ガラスープの素"],
    steps: [
      "豚肉150gは一口大、キャベツ100gはざく切りにする",
      "フライパンにごま油大さじ1を熱し、豚肉を中火で2分炒める",
      "キャベツを加えて1分炒め、うどん2玉を加える",
      "酒大さじ1を振りかけ、ほぐしながら炒める",
      "醤油大さじ1・鶏ガラスープの素小さじ1・塩こしょう少々で味を整えたら完成。かつお節と青のりをかけると◎",
    ],
  },
  {
    id: 26, name: "鶏のから揚げ", kcal: 500, time: 25, moods: ["gatsuri"],
    ingredients: [{ name: "鶏肉", amount: 300 }],
    seasonings: ["醤油", "酒", "にんにく(チューブ)", "しょうが(チューブ)", "サラダ油"],
    steps: [
      "鶏肉300gを一口大に切り、醤油大さじ2・酒大さじ1・にんにくチューブ2cm・しょうがチューブ1cmと混ぜて10分漬け込む",
      "漬け込んだ鶏肉に片栗粉(大さじ4程度)をまぶし、薄く均一につける",
      "フライパンにサラダ油を2〜3cm深さに入れ、170℃(菜箸を入れて細かい泡が出る状態)に熱する",
      "鶏肉を入れて3〜4分、触らずに揚げる",
      "裏返してさらに2〜3分揚げ、きつね色になったら取り出す。レモンを添えて完成",
    ],
  },
  {
    id: 27, name: "和風ハンバーグ", kcal: 450, time: 25, moods: ["gatsuri"],
    ingredients: [
      { name: "ひき肉", amount: 300 }, { name: "玉ねぎ", amount: 1 }, { name: "卵", amount: 1 },
    ],
    seasonings: ["塩", "こしょう", "醤油", "みりん", "砂糖", "酒", "サラダ油"],
    steps: [
      "玉ねぎ1/2個をみじん切りにし、サラダ油少々で透き通るまで炒めて冷ます",
      "ひき肉300g・炒めた玉ねぎ・卵1個・塩小さじ1/4・こしょう少々を混ぜ、粘りが出るまでこねる",
      "2等分にして小判形に整え、中央を少しくぼませる",
      "フライパンにサラダ油少々を熱し、中火で3分焼く。裏返してふたをし、弱火で7分蒸し焼きにする",
      "醤油大さじ2・みりん大さじ2・砂糖大さじ1/2・酒大さじ1を合わせて煮詰め、タレとして完成",
    ],
  },
  {
    id: 28, name: "きんぴらごぼう", kcal: 160, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "ごぼう", amount: 1 }, { name: "にんじん", amount: 1 }],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "ごま油"],
    steps: [
      "ごぼう1本はよく洗ってささがきまたは細切りにし、水にさらしてアクを抜く",
      "にんじん1/2本は細切りにする",
      "フライパンにごま油大さじ1を熱し、水気を切ったごぼうを中火で2〜3分炒める",
      "にんじんを加えてさらに1分炒め、醤油大さじ1・みりん大さじ1・砂糖小さじ1・酒大さじ1を加える",
      "汁気がなくなるまで炒め合わせたら完成。お好みで一味唐辛子を振っても◎",
    ],
  },
  {
    id: 29, name: "にら玉炒め", kcal: 250, time: 8, moods: ["jitan", "gatsuri"],
    ingredients: [{ name: "にら", amount: 1 }, { name: "卵", amount: 3 }],
    seasonings: ["塩", "こしょう", "ごま油", "鶏ガラスープの素", "醤油"],
    steps: [
      "にら1袋を4cm幅に切る。卵3個を溶いて塩こしょう少々を加える",
      "フライパンにごま油大さじ1を強火で熱し、溶き卵を流し入れる",
      "大きくかき混ぜながら半熟状にし、一度取り出す",
      "同じフライパンでにらを強火で30秒炒め、鶏ガラスープの素小さじ1/2を振る",
      "卵を戻し入れて大きく混ぜ、鍋肌から醤油少々を回し入れて完成",
    ],
  },
  {
    id: 30, name: "クリームシチュー", kcal: 420, time: 30, moods: ["attaka"],
    ingredients: [
      { name: "鶏肉", amount: 200 }, { name: "じゃがいも", amount: 2 },
      { name: "玉ねぎ", amount: 1 }, { name: "にんじん", amount: 1 }, { name: "牛乳", amount: 200 },
    ],
    seasonings: ["塩", "こしょう", "コンソメ", "バター", "サラダ油"],
    steps: [
      "鶏肉200gは一口大、じゃがいも2個は乱切り、玉ねぎ1/2個はくし切り、にんじん1本は乱切りにする",
      "鍋にサラダ油大さじ1を熱し、鶏肉を中火で2分炒める。野菜を加えてさらに2分炒める",
      "水400ml・コンソメ小さじ4を加え、沸騰したら弱火で15分煮る",
      "別の器でバター大さじ1と薄力粉大さじ2を混ぜてレンジで1分加熱し、牛乳200mlで溶く",
      "鍋に加えてよく混ぜ、塩こしょうで味を整えて完成。市販のシチュールーを使ってもOK",
    ],
  },
  {
    id: 31, name: "鶏肉のトマト煮込み", kcal: 380, time: 25, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "鶏肉", amount: 300 }, { name: "トマト", amount: 2 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["塩", "こしょう", "コンソメ", "砂糖", "醤油", "サラダ油", "にんにく(チューブ)"],
    steps: [
      "鶏肉300gは一口大に切り、塩こしょう少々をふる。玉ねぎ1/2個は薄切り、トマト2個はざく切りにする",
      "フライパンにサラダ油大さじ1とにんにくチューブ1cmを入れ、中火で鶏肉を2分炒める",
      "玉ねぎを加えて2分炒め、トマトを加えてざっと混ぜる",
      "コンソメ小さじ2・砂糖小さじ1を加え、ふたをして弱火で10分煮込む",
      "塩こしょうで味を整え、お好みで醤油少々を加えて和風にアレンジしても◎",
    ],
  },
  {
    id: 32, name: "冷やし中華", kcal: 450, time: 15, moods: ["sappari"],
    ingredients: [
      { name: "中華麺", amount: 2 }, { name: "卵", amount: 2 }, { name: "ツナ", amount: 1 },
    ],
    seasonings: ["醤油", "ごま油", "砂糖", "みりん"],
    steps: [
      "卵2個で薄焼き卵を作り、冷めたら細切り(錦糸卵)にする",
      "中華麺2玉を表示時間通り茹で、流水でよく洗い、冷水で締める",
      "醤油大さじ2・ごま油大さじ1・砂糖大さじ1・みりん大さじ1・水大さじ2を混ぜてタレを作る(酢大さじ2があればさらに◎)",
      "皿に麺を盛り、錦糸卵と油を切ったツナを彩りよく並べる",
      "タレをかけて完成。もやしやきゅうりを加えると豪華",
    ],
  },
  {
    id: 33, name: "味噌ラーメン", kcal: 520, time: 15, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "中華麺", amount: 2 }, { name: "もやし", amount: 1 },
      { name: "ねぎ", amount: 1 }, { name: "豚肉", amount: 100 },
    ],
    seasonings: ["味噌", "ごま油", "鶏ガラスープの素", "にんにく(チューブ)", "醤油"],
    steps: [
      "鍋に水700ml・鶏ガラスープの素小さじ2を入れて沸かす",
      "味噌大さじ2・醤油小さじ1・ごま油小さじ1・にんにくチューブ1cmを加えてよく混ぜてスープを作る",
      "別鍋で中華麺2玉を茹でて水気を切る",
      "豚肉100gともやし1/2袋をごま油で炒め、塩こしょうで味付けする",
      "丼に麺を盛り、スープを注ぐ。炒めた豚肉ともやし・ねぎ(小口切り)をトッピングして完成",
    ],
  },
  {
    id: 34, name: "そうめん", kcal: 350, time: 8, moods: ["sappari", "jitan"],
    ingredients: [{ name: "そうめん", amount: 3 }],
    seasonings: ["醤油", "みりん", "顆粒だし"],
    steps: [
      "鍋にたっぷりの湯を沸かし、そうめん3束を入れて1〜2分茹でる",
      "流水でよく揉み洗いしてぬめりを取り、氷水で締める",
      "小鍋に醤油大さじ2・みりん大さじ1を入れて一度煮立て、水200mlと顆粒だし小さじ1を加えてつゆを作る(市販のめんつゆでもOK)",
      "器に氷を入れてそうめんを盛り、つゆを注ぐ",
      "ねぎ・しょうがなどの薬味を添えて完成",
    ],
  },
  {
    id: 35, name: "ペペロンチーノ", kcal: 480, time: 15, moods: ["jitan", "sappari"],
    ingredients: [{ name: "スパゲッティ", amount: 200 }],
    seasonings: ["塩", "こしょう", "サラダ油", "にんにく(チューブ)", "醤油"],
    steps: [
      "大きな鍋に湯を沸かし、塩(水1Lに大さじ1)を加えてスパゲッティ200gを表示時間通り茹でる",
      "フライパンにサラダ油(またはオリーブ油)大さじ2・にんにくチューブ3cmを入れ、弱火で香りを出す",
      "茹で汁大さじ3を加えてなじませる",
      "茹で上がったパスタを加えてよく絡め、塩こしょうで味を整える",
      "仕上げに鍋肌から醤油少々を回し入れて和風にしたら完成",
    ],
  },
  {
    id: 36, name: "炒り豆腐", kcal: 200, time: 12, moods: ["sappari", "jitan"],
    ingredients: [
      { name: "豆腐", amount: 1 }, { name: "卵", amount: 2 }, { name: "にんじん", amount: 1 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "ごま油", "顆粒だし"],
    steps: [
      "豆腐1丁をキッチンペーパーで包み、5分重しを乗せて水気を切る",
      "にんじん1/3本は細切りにする",
      "フライパンにごま油小さじ1を熱し、にんじんを中火で1分炒める",
      "豆腐を手で粗くほぐしながら加え、2〜3分炒める",
      "醤油大さじ1・みりん大さじ1・砂糖小さじ1・顆粒だし小さじ1/2を加えて炒め合わせ、溶き卵2個を回し入れて半熟で火を止めて完成",
    ],
  },
  {
    id: 37, name: "大根と豚肉の煮物", kcal: 320, time: 25, moods: ["attaka", "sappari"],
    ingredients: [{ name: "大根", amount: 10 }, { name: "豚肉", amount: 150 }],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "顆粒だし"],
    steps: [
      "大根10cmを2〜3cm厚さの半月切りにして面取りをする。電子レンジで4分加熱して火を通しやすくする",
      "豚肉150gは一口大に切る",
      "鍋に水300ml・顆粒だし小さじ1・醤油大さじ2・みりん大さじ2・砂糖大さじ1・酒大さじ1を入れて煮立てる",
      "大根と豚肉を加え、弱火で落としぶたをして15〜20分煮る",
      "大根が柔らかくなり、煮汁が程よく絡んだら完成。ゆずこしょうを少し添えても美味しい",
    ],
  },
  {
    id: 38, name: "ポテトサラダ", kcal: 280, time: 20, moods: ["sappari", "jitan"],
    ingredients: [
      { name: "じゃがいも", amount: 3 }, { name: "玉ねぎ", amount: 1 }, { name: "ベーコン", amount: 2 },
    ],
    seasonings: ["塩", "こしょう", "マヨネーズ"],
    steps: [
      "じゃがいも3個を一口大に切り、柔らかくなるまで茹でる(またはレンジで5〜6分加熱)",
      "熱いうちに塩少々を振り、フォークで粗くつぶす",
      "玉ねぎ1/4個を薄切りにして塩少々でもみ、水で洗って絞る",
      "ベーコン2枚をフライパンでカリカリに炒める",
      "じゃがいもが冷めたら玉ねぎ・ベーコン・マヨネーズ大さじ3・塩こしょう少々を混ぜて完成",
    ],
  },
  {
    id: 39, name: "鮭とキャベツのちゃんちゃん焼き風", kcal: 380, time: 20, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "鮭", amount: 2 }, { name: "キャベツ", amount: 200 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["味噌", "みりん", "砂糖", "酒", "バター", "ごま油"],
    steps: [
      "味噌大さじ3・みりん大さじ1・砂糖大さじ1/2・酒大さじ1を混ぜて合わせ味噌を作る",
      "キャベツ200gはざく切り、玉ねぎ1/2個は薄切りにする",
      "フライパンにごま油小さじ1を熱し、鮭2切れを中火で両面2分ずつ焼いて一度取り出す",
      "同じフライパンでキャベツと玉ねぎを2〜3分炒め、鮭を戻し入れる",
      "合わせ味噌を全体に回しかけ、バター10gをのせてふたをして3分蒸らし、全体に絡めて完成",
    ],
  },
  {
    id: 40, name: "にんじんしりしり", kcal: 200, time: 10, moods: ["sappari", "jitan"],
    ingredients: [
      { name: "にんじん", amount: 2 }, { name: "卵", amount: 2 }, { name: "ツナ", amount: 1 },
    ],
    seasonings: ["塩", "こしょう", "醤油", "ごま油", "みりん"],
    steps: [
      "にんじん2本を千切り(またはピーラーで薄切り)にする",
      "フライパンにごま油大さじ1を熱し、にんじんを中火で3〜4分炒める",
      "油を切ったツナを加えてさらに1分炒める",
      "醤油大さじ1・みりん大さじ1を加えて炒め合わせ、塩こしょうで味を整える",
      "溶き卵2個を回し入れ、大きくかき混ぜながら半熟で火を止めて完成",
    ],
  },
  {
    id: 41, name: "さばの味噌煮", kcal: 320, time: 20, moods: ["attaka", "sappari"],
    ingredients: [{ name: "さば", amount: 2 }],
    seasonings: ["味噌", "みりん", "砂糖", "醤油", "酒", "しょうが(チューブ)"],
    steps: [
      "さば2切れに塩少々をふって5分おき、熱湯をさっとかけて臭みを抜く",
      "鍋に酒大さじ3・水大さじ3・みりん大さじ2・砂糖大さじ1を合わせて沸かす",
      "さばを皮目を上にして並べ、しょうがチューブ3cmを加えてふたをし、中火で5分煮る",
      "味噌大さじ2・醤油小さじ1を溶き入れ、スプーンで煮汁をかけながら5分煮詰める",
      "煮汁にとろみが出たら完成。ねぎを散らすと風味アップ",
    ],
  },
  {
    id: 42, name: "牛肉と白菜のすき焼き風", kcal: 480, time: 20, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "牛肉", amount: 200 }, { name: "白菜", amount: 200 },
      { name: "ねぎ", amount: 1 }, { name: "豆腐", amount: 1 }, { name: "卵", amount: 2 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "酒"],
    steps: [
      "白菜200gはざく切り、ねぎ1本は斜め切り、豆腐1丁は4等分にする",
      "醤油大さじ3・みりん大さじ2・砂糖大さじ1・酒大さじ2を合わせてわりしたを作る",
      "フライパン(または鍋)を中火で熱し、牛肉200gをさっと炒める",
      "白菜・ねぎ・豆腐を加え、わりしたを回し入れてふたをして5〜6分煮る",
      "溶き卵2個を器に用意し、すき焼き風につけて食べる",
    ],
  },
  {
    id: 43, name: "厚揚げと豚肉の甘辛煮", kcal: 400, time: 15, moods: ["gatsuri", "jitan"],
    ingredients: [{ name: "厚揚げ", amount: 1 }, { name: "豚肉", amount: 150 }],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "ごま油", "しょうが(チューブ)"],
    steps: [
      "厚揚げ1個は食べやすい大きさに切り、豚肉150gは一口大に切る",
      "フライパンにごま油小さじ1を熱し、豚肉を中火で2分炒める",
      "厚揚げを加えてさらに2分炒める",
      "醤油大さじ2・みりん大さじ1・砂糖大さじ1/2・酒大さじ1・しょうがチューブ1cmを加えて絡める",
      "煮汁が少なくなるまで2〜3分炒め煮にしたら完成",
    ],
  },
  {
    id: 44, name: "小松菜と卵のさっと炒め", kcal: 180, time: 8, moods: ["sappari", "jitan"],
    ingredients: [{ name: "小松菜", amount: 1 }, { name: "卵", amount: 2 }],
    seasonings: ["塩", "こしょう", "ごま油", "醤油", "鶏ガラスープの素"],
    steps: [
      "小松菜1袋を4〜5cm幅に切り、茎と葉に分けておく。卵2個を溶いておく",
      "フライパンにごま油大さじ1を強火で熱し、溶き卵を流し入れる",
      "大きくかき混ぜながら半熟にし、一度取り出す",
      "同じフライパンで小松菜の茎を1分、葉を30秒炒め、鶏ガラスープの素小さじ1/2・塩こしょう少々を振る",
      "卵を戻し入れてさっと混ぜ、鍋肌から醤油少々を回し入れて完成",
    ],
  },
  {
    id: 45, name: "豚肉のしょうが焼き", kcal: 440, time: 12, moods: ["gatsuri", "jitan"],
    ingredients: [{ name: "豚肉", amount: 250 }, { name: "玉ねぎ", amount: 1 }],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "サラダ油", "しょうが(チューブ)"],
    steps: [
      "豚肉250gは薄切りを使う。玉ねぎ1/2個は薄切りにする",
      "醤油大さじ2・みりん大さじ1・砂糖小さじ1・酒大さじ1・しょうがチューブ3cmを混ぜてタレを作る",
      "フライパンにサラダ油大さじ1/2を熱し、玉ねぎを中火でしんなりするまで炒める",
      "豚肉を広げて加え、色が変わるまで2〜3分炒める",
      "タレを回し入れ、照りが出るまで炒め合わせたら完成。千切りキャベツを添えると◎",
    ],
  },
  {
    id: 46, name: "ぶりと大根の煮付け", kcal: 290, time: 25, moods: ["attaka", "sappari"],
    ingredients: [{ name: "ぶり", amount: 2 }, { name: "大根", amount: 10 }],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "顆粒だし", "しょうが(チューブ)"],
    steps: [
      "大根10cmはいちょう切りにし、電子レンジで4〜5分加熱して柔らかくしておく",
      "ぶり2切れに塩少々をふって5分おき、熱湯をかけて霜降りにする",
      "鍋に水200ml・醤油大さじ2・みりん大さじ2・砂糖大さじ1・酒大さじ2・顆粒だし小さじ1・しょうがチューブ2cmを合わせて沸かす",
      "大根を加えて2〜3分煮たら、ぶりを皮目を上にして並べる",
      "落としぶたをして弱中火で10〜12分、煮汁が少なくなるまで煮たら完成",
    ],
  },
  {
    id: 47, name: "鶏肉の味噌焼き", kcal: 380, time: 20, moods: ["gatsuri", "sappari"],
    ingredients: [{ name: "鶏肉", amount: 300 }],
    seasonings: ["味噌", "みりん", "砂糖", "酒", "ごま油", "にんにく(チューブ)"],
    steps: [
      "鶏肉300gは一口大に切る",
      "味噌大さじ2・みりん大さじ1・砂糖小さじ1・酒大さじ1・ごま油小さじ1・にんにくチューブ1cmを混ぜてタレを作る",
      "鶏肉とタレをビニール袋に入れてよく揉み込み、10分漬け込む",
      "フライパンを中火で熱し、鶏肉を皮目から3〜4分焼く",
      "裏返してふたをし、弱火で5〜6分蒸し焼きにしたら完成",
    ],
  },
  {
    id: 48, name: "白菜と豆腐の中華スープ", kcal: 150, time: 12, moods: ["attaka", "sappari", "jitan"],
    ingredients: [
      { name: "白菜", amount: 150 }, { name: "豆腐", amount: 1 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["鶏ガラスープの素", "塩", "こしょう", "ごま油", "しょうが(チューブ)"],
    steps: [
      "白菜150gはざく切り、豆腐1/2丁は1.5cm角、ねぎ1/3本は小口切りにする",
      "鍋に水500mlと鶏ガラスープの素小さじ2を入れて沸かす",
      "白菜を加えて2分煮る",
      "豆腐を加えてさらに2分煮、塩こしょう少々としょうがチューブ1cmで味を整える",
      "ごま油数滴をたらしてねぎを散らしたら完成",
    ],
  },
  {
    id: 49, name: "鶏そぼろ丼", kcal: 540, time: 15, moods: ["jitan", "gatsuri"],
    ingredients: [
      { name: "ひき肉", amount: 200 }, { name: "卵", amount: 2 }, { name: "ごはん", amount: 2 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "サラダ油"],
    steps: [
      "ひき肉200gをフライパンに入れ、酒大さじ1・醤油大さじ1と1/2・みりん大さじ1・砂糖大さじ1/2を加える",
      "菜箸4〜5本で混ぜながら中火で炒り、水分がなくなるまでそぼろ状にして取り出す",
      "同じフライパンにサラダ油小さじ1を熱し、溶き卵2個に塩少々を加えたものを流し入れる",
      "菜箸で素早く混ぜながら半熟状の炒り卵を作る",
      "温かいごはん2杯に鶏そぼろと炒り卵を盛って完成",
    ],
  },
  {
    id: 50, name: "豚キムチ丼", kcal: 560, time: 12, moods: ["gatsuri", "attaka"],
    ingredients: [
      { name: "豚肉", amount: 200 }, { name: "キムチ", amount: 150 },
      { name: "玉ねぎ", amount: 1 }, { name: "ごはん", amount: 2 },
    ],
    seasonings: ["ごま油", "醤油", "みりん"],
    steps: [
      "豚肉200gは一口大、玉ねぎ1/2個は薄切りにする",
      "フライパンにごま油大さじ1を熱し、豚肉を中火で2〜3分炒める",
      "玉ねぎを加えてしんなりするまで炒める",
      "キムチ150gを加えてさっと炒め合わせ、醤油大さじ1・みりん大さじ1/2で味を整える",
      "温かいごはん2杯にのせて完成。仕上げにごま油を少したらすと香ばしい",
    ],
  },
  {
    id: 51, name: "えびと卵の中華丼", kcal: 420, time: 15, moods: ["sappari", "jitan"],
    ingredients: [
      { name: "えび", amount: 150 }, { name: "卵", amount: 3 },
      { name: "ねぎ", amount: 1 }, { name: "ごはん", amount: 2 },
    ],
    seasonings: ["塩", "こしょう", "ごま油", "鶏ガラスープの素", "酒", "醤油"],
    steps: [
      "えび150gは背わたを取り、酒少々と塩少々で下味をつける。卵3個を溶く",
      "フライパンにごま油大さじ1を熱し、えびを中火で1〜2分炒めて一度取り出す",
      "同じフライパンで溶き卵を半熟に炒め、えびを戻す",
      "水100ml・鶏ガラスープの素小さじ1・醤油小さじ1・塩こしょう少々を加えてさっと煮る",
      "ごはんにかけてねぎ(小口切り)を散らして完成",
    ],
  },
  {
    id: 52, name: "ポトフ", kcal: 300, time: 30, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "ベーコン", amount: 3 }, { name: "じゃがいも", amount: 2 },
      { name: "にんじん", amount: 1 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["コンソメ", "塩", "こしょう"],
    steps: [
      "じゃがいも2個は半分、にんじん1本は大きめの乱切り、玉ねぎ1/2個はくし切り、ベーコン3枚は4〜5cm幅に切る",
      "鍋にすべての材料と水700ml・コンソメ小さじ4を入れて中火にかける",
      "沸騰したらアクを取り、ふたをして弱火で20分煮る",
      "野菜が柔らかくなったら塩こしょうで味を整える",
      "器に盛って完成。マスタードを添えるとより本格的",
    ],
  },
  {
    id: 53, name: "豆乳鍋", kcal: 380, time: 20, moods: ["attaka"],
    ingredients: [
      { name: "豚肉", amount: 150 }, { name: "白菜", amount: 200 },
      { name: "豆腐", amount: 1 }, { name: "牛乳", amount: 200 },
    ],
    seasonings: ["味噌", "顆粒だし", "ごま油", "塩", "にんにく(チューブ)"],
    steps: [
      "白菜200gはざく切り、豆腐1丁は4等分、豚肉150gは一口大にする",
      "鍋に顆粒だし小さじ2・水400mlを沸かし、豚肉を入れてアクを取りながら2分煮る",
      "白菜を加えて2分煮る",
      "牛乳200ml(または豆乳)・味噌大さじ1と1/2・にんにくチューブ1cmを加えてよく混ぜる",
      "豆腐を加え、沸騰直前で火を弱め、ごま油を数滴たらして完成",
    ],
  },
  {
    id: 54, name: "八宝菜", kcal: 320, time: 15, moods: ["sappari", "jitan"],
    ingredients: [
      { name: "えび", amount: 100 }, { name: "白菜", amount: 150 },
      { name: "にんじん", amount: 1 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["塩", "こしょう", "ごま油", "鶏ガラスープの素", "醤油", "酒"],
    steps: [
      "えび100gは背わたを取る。白菜150gはざく切り、にんじん1/2本は短冊切り、玉ねぎ1/4個は薄切りにする",
      "フライパンにごま油大さじ1を熱し、にんじんと玉ねぎを中火で2分炒める",
      "えびを加えて色が変わるまで炒め、白菜を加える",
      "酒大さじ1・鶏ガラスープの素小さじ1・醤油小さじ1・水大さじ2を加えてさっと炒め煮にする",
      "塩こしょうで味を整え、水溶き片栗粉少々でとろみをつけたら完成",
    ],
  },
  {
    id: 55, name: "エビチリ風", kcal: 280, time: 15, moods: ["sappari", "gatsuri"],
    ingredients: [{ name: "えび", amount: 200 }, { name: "玉ねぎ", amount: 1 }],
    seasonings: ["醤油", "砂糖", "酒", "サラダ油", "にんにく(チューブ)", "しょうが(チューブ)", "鶏ガラスープの素"],
    steps: [
      "えび200gは背わたを取り、酒少々と塩少々で下味をつける。玉ねぎ1/4個はみじん切りにする",
      "醤油大さじ1・砂糖大さじ1・酒大さじ1・鶏ガラスープの素小さじ1・水大さじ2を混ぜてチリソースを作る",
      "フライパンにサラダ油大さじ1・にんにくチューブ2cm・しょうがチューブ1cmを入れ、弱火で香りを出す",
      "えびと玉ねぎを加えて中火で2〜3分炒める",
      "チリソースを加えて全体に絡め、水溶き片栗粉でとろみをつけたら完成",
    ],
  },
  {
    id: 56, name: "焼きそば", kcal: 500, time: 12, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "中華麺", amount: 2 }, { name: "豚肉", amount: 150 }, { name: "キャベツ", amount: 100 },
    ],
    seasonings: ["醤油", "ごま油", "塩", "こしょう", "みりん"],
    steps: [
      "豚肉150gは一口大、キャベツ100gはざく切りにする",
      "フライパンにごま油大さじ1を熱し、豚肉を中火で2分炒める",
      "キャベツを加えてさっと炒め、中華麺2玉を加える",
      "水大さじ2を振ってほぐしながら炒める",
      "醤油大さじ1・みりん大さじ1・塩こしょう少々で味付けしたら完成。かつお節・青のりをかけると◎",
    ],
  },
  {
    id: 57, name: "担々麺風スープ麺", kcal: 540, time: 15, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "中華麺", amount: 2 }, { name: "ひき肉", amount: 150 }, { name: "もやし", amount: 1 },
    ],
    seasonings: ["味噌", "醤油", "ごま油", "砂糖", "鶏ガラスープの素", "にんにく(チューブ)", "しょうが(チューブ)"],
    steps: [
      "フライパンにごま油小さじ1・にんにくチューブ1cm・しょうがチューブ1cmを入れ、弱火で炒める",
      "ひき肉150gを加えて中火でそぼろ状になるまで炒める",
      "醤油大さじ1・味噌大さじ1・砂糖小さじ1を加えて炒め合わせる",
      "別鍋で水700ml・鶏ガラスープの素小さじ2を沸かし、もやし半袋を加えて1分煮る",
      "茹でた中華麺2玉を器に盛り、スープを注ぎ、炒めたひき肉をのせて完成",
    ],
  },
  {
    id: 58, name: "カルボナーラ", kcal: 580, time: 15, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "スパゲッティ", amount: 200 }, { name: "卵", amount: 3 }, { name: "ベーコン", amount: 3 },
    ],
    seasonings: ["塩", "こしょう", "サラダ油", "バター"],
    steps: [
      "大きな鍋に湯を沸かし、塩(水1Lに大さじ1)を加えてスパゲッティ200gを表示通り茹でる",
      "卵3個と塩少々・こしょうたっぷりを混ぜてソースを作る",
      "フライパンにバター10gを熱し、ベーコン3枚(1cm幅)を中火で炒める",
      "茹で汁大さじ3を加えてフライパンを弱火にし、スパゲッティを加えてよく絡める",
      "火を止めてからソースを加え、余熱で素早く混ぜたら完成。半熟状がクリーミーに仕上がるコツ",
    ],
  },
  {
    id: 59, name: "ミネストローネ", kcal: 250, time: 25, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "トマト", amount: 2 }, { name: "玉ねぎ", amount: 1 },
      { name: "にんじん", amount: 1 }, { name: "ベーコン", amount: 2 },
    ],
    seasonings: ["塩", "こしょう", "コンソメ", "砂糖", "サラダ油", "にんにく(チューブ)"],
    steps: [
      "トマト2個はざく切り、玉ねぎ1/2個・にんじん1/2本は1cm角、ベーコン2枚は1cm幅に切る",
      "鍋にサラダ油大さじ1とにんにくチューブ1cmを入れ、ベーコン→玉ねぎ→にんじんの順に中火で炒める",
      "トマトを加えてつぶしながら炒め、水500mlとコンソメ小さじ3を加える",
      "沸騰したらアクを取り、弱火で15分煮る",
      "砂糖小さじ1/2・塩こしょうで味を整えたら完成",
    ],
  },
  {
    id: 60, name: "鶏肉のピカタ", kcal: 420, time: 20, moods: ["sappari", "jitan"],
    ingredients: [{ name: "鶏肉", amount: 300 }, { name: "卵", amount: 2 }],
    seasonings: ["塩", "こしょう", "醤油", "サラダ油", "バター"],
    steps: [
      "鶏肉300gを薄く開いて(なければ叩いて薄くして)塩こしょう少々をふる",
      "卵2個を溶き、塩少々を加える",
      "鶏肉に薄力粉(大さじ2程度)を薄くまぶし、溶き卵にくぐらせる",
      "フライパンにサラダ油大さじ1・バター10gを中火で熱し、鶏肉を3〜4分焼く",
      "裏返して3〜4分焼き、中まで火が通ったら完成。醤油数滴をかけてどうぞ",
    ],
  },
  {
    id: 61, name: "ブロッコリーとベーコンのグラタン", kcal: 380, time: 25, moods: ["attaka", "jitan"],
    ingredients: [
      { name: "ブロッコリー", amount: 1 }, { name: "ベーコン", amount: 3 }, { name: "牛乳", amount: 200 },
    ],
    seasonings: ["塩", "こしょう", "コンソメ", "バター"],
    steps: [
      "ブロッコリー1個は小房に分けて電子レンジで2〜3分加熱し、ベーコン3枚は2cm幅に切る",
      "鍋にバター大さじ1を熱し、薄力粉大さじ2を加えてよく炒める",
      "牛乳200mlを少しずつ加えながら混ぜ、コンソメ小さじ2・塩こしょう少々で味付けしてホワイトソースを作る",
      "耐熱皿にブロッコリーとベーコンを並べ、ホワイトソースをかける",
      "チーズ(あれば)を乗せてオーブントースターで10〜12分焼いたら完成",
    ],
  },
  {
    id: 62, name: "ウインナーとじゃがいものソテー", kcal: 350, time: 15, moods: ["jitan", "sappari"],
    ingredients: [{ name: "ウインナー", amount: 4 }, { name: "じゃがいも", amount: 3 }],
    seasonings: ["塩", "こしょう", "サラダ油", "醤油", "バター"],
    steps: [
      "じゃがいも3個は1cm厚さの輪切りにし、電子レンジで4〜5分加熱して柔らかくする",
      "ウインナー4本は斜めに切り込みを入れる",
      "フライパンにサラダ油大さじ1を熱し、じゃがいもを中火で両面2分ずつ焼いて焼き色をつける",
      "ウインナーを加えてさらに2分炒める",
      "バター10gを加えてとかし、醤油小さじ1・塩こしょう少々で味を整えたら完成",
    ],
  },
  {
    id: 63, name: "ブロッコリーと卵の中華炒め", kcal: 220, time: 10, moods: ["sappari", "jitan"],
    ingredients: [{ name: "ブロッコリー", amount: 1 }, { name: "卵", amount: 3 }],
    seasonings: ["塩", "こしょう", "ごま油", "鶏ガラスープの素", "醤油"],
    steps: [
      "ブロッコリー1/2個は小房に分けて電子レンジで2分加熱し、卵3個を溶いておく",
      "フライパンにごま油大さじ1を強火で熱し、溶き卵を流し入れる",
      "大きくかき混ぜながら半熟状にし、一度取り出す",
      "同じフライパンでブロッコリーを1分炒め、鶏ガラスープの素小さじ1/2・塩こしょう少々を振る",
      "卵を戻し入れて大きく混ぜ、鍋肌から醤油少々を回し入れたら完成",
    ],
  },
  {
    id: 64, name: "豆腐ステーキ", kcal: 200, time: 12, moods: ["sappari", "jitan"],
    ingredients: [{ name: "豆腐", amount: 1 }],
    seasonings: ["醤油", "みりん", "砂糖", "ごま油", "顆粒だし"],
    steps: [
      "豆腐1丁をキッチンペーパーで包んで重しを乗せ、10〜15分水切りする",
      "1〜2cm厚さに切り、両面に薄く片栗粉をまぶす",
      "フライパンにごま油大さじ1を中火で熱し、豆腐を並べる",
      "両面こんがりきつね色になるまで3〜4分ずつ焼く",
      "醤油大さじ1・みりん大さじ1・砂糖小さじ1/2・顆粒だし少々を混ぜたタレを回し入れて絡め完成",
    ],
  },
  {
    id: 65, name: "豚肉と小松菜のにんにく炒め", kcal: 380, time: 10, moods: ["gatsuri", "jitan"],
    ingredients: [{ name: "豚肉", amount: 200 }, { name: "小松菜", amount: 1 }],
    seasonings: ["醤油", "塩", "こしょう", "ごま油", "にんにく(チューブ)", "酒"],
    steps: [
      "豚肉200gは一口大に切り、小松菜1袋は4〜5cm幅に切って茎と葉に分けておく",
      "フライパンにごま油大さじ1・にんにくチューブ2cmを入れ、弱火で香りを出す",
      "豚肉を加えて中火で2〜3分炒め、酒大さじ1を振る",
      "小松菜の茎を加えて1分炒め、葉を加えてさらに30秒炒める",
      "醤油大さじ1・塩こしょう少々で味を整えたら完成",
    ],
  },
  // ── 鍋料理 ──────────────────────────────────────
  {
    id: 66, name: "水炊き鍋", kcal: 340, time: 20, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "鶏肉", amount: 300 }, { name: "白菜", amount: 200 },
      { name: "豆腐", amount: 1 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["顆粒だし", "塩", "醤油", "ごま油"],
    steps: [
      "鶏肉300gは一口大に切る。白菜200gはざく切り、ねぎ1本は斜め薄切り、豆腐1丁は4等分にする",
      "土鍋(または鍋)に水600mlと顆粒だし小さじ2を入れて沸かす",
      "鶏肉を加えてアクを取りながら3〜4分煮る",
      "白菜・豆腐・ねぎを加え、ふたをして弱中火で5〜6分煮る",
      "塩少々で味を整え、食べるときにポン酢やごまだれをつけていただく",
    ],
  },
  {
    id: 67, name: "石狩鍋", kcal: 380, time: 25, moods: ["attaka"],
    ingredients: [
      { name: "鮭", amount: 3 }, { name: "白菜", amount: 200 },
      { name: "玉ねぎ", amount: 1 }, { name: "豆腐", amount: 1 },
    ],
    seasonings: ["味噌", "顆粒だし", "バター", "酒", "みりん"],
    steps: [
      "鮭3切れは食べやすい大きさに切り、酒少々をふる。白菜200gはざく切り、玉ねぎ1/2個はくし切り、豆腐1丁は4等分にする",
      "鍋に水600ml・顆粒だし小さじ2を入れて沸かし、玉ねぎと白菜を加えて2〜3分煮る",
      "鮭と豆腐を加えてさらに5〜6分煮る",
      "味噌大さじ2〜3・みりん大さじ1を溶き入れ、味を整える",
      "仕上げにバター10gをのせて完成。溶かしながら食べると風味豊か",
    ],
  },
  {
    id: 68, name: "モツ鍋風豚鍋", kcal: 420, time: 20, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "豚肉", amount: 250 }, { name: "キャベツ", amount: 200 }, { name: "にら", amount: 1 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "鶏ガラスープの素", "にんにく(チューブ)"],
    steps: [
      "豚肉250gは食べやすい大きさに切る。キャベツ200gはざく切り、にら1袋は5cm幅に切る",
      "鍋に水700ml・鶏ガラスープの素大さじ1・醤油大さじ2・みりん大さじ1・砂糖大さじ1/2・酒大さじ1を合わせて沸かす",
      "にんにくチューブ3cmを加えて香りを出す",
      "豚肉とキャベツを加えてふたをし、中火で7〜8分煮る",
      "にらを加えてさっと煮たら完成。仕上げに白ごまを振ると◎",
    ],
  },
  {
    id: 69, name: "トマト鍋", kcal: 350, time: 20, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "鶏肉", amount: 250 }, { name: "玉ねぎ", amount: 1 },
      { name: "トマト", amount: 2 }, { name: "豆腐", amount: 1 },
    ],
    seasonings: ["コンソメ", "塩", "こしょう", "にんにく(チューブ)", "サラダ油"],
    steps: [
      "鶏肉250gは一口大、玉ねぎ1/2個はくし切り、トマト2個はくし切り、豆腐1丁は4等分にする",
      "鍋にサラダ油大さじ1・にんにくチューブ1cmを入れ、弱火で炒める",
      "玉ねぎ→鶏肉の順に中火で炒め、鶏肉の色が変わったらトマトを加えてつぶしながら炒める",
      "水400ml・コンソメ小さじ3を加えて沸かし、ふたをして弱火で10分煮る",
      "豆腐を加えてさらに3分煮、塩こしょうで味を整えたら完成",
    ],
  },
  {
    id: 70, name: "かき玉鍋", kcal: 240, time: 15, moods: ["attaka", "sappari", "jitan"],
    ingredients: [
      { name: "卵", amount: 3 }, { name: "白菜", amount: 150 },
      { name: "ねぎ", amount: 1 }, { name: "豆腐", amount: 1 },
    ],
    seasonings: ["鶏ガラスープの素", "醤油", "塩", "こしょう", "ごま油"],
    steps: [
      "白菜150gはざく切り、ねぎ1/2本は小口切り、豆腐1/2丁は2cm角に切る",
      "鍋に水700ml・鶏ガラスープの素小さじ2を入れて沸かす",
      "白菜と豆腐を加えて3〜4分煮る",
      "醤油小さじ1・塩こしょう少々で味を整え、溶き卵3個を細く回し入れる",
      "卵がふわっと固まったらねぎを散らし、ごま油を数滴たらして完成",
    ],
  },
  {
    id: 71, name: "カレー鍋", kcal: 480, time: 25, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "豚肉", amount: 200 }, { name: "玉ねぎ", amount: 1 },
      { name: "にんじん", amount: 1 }, { name: "じゃがいも", amount: 2 },
    ],
    seasonings: ["コンソメ", "醤油", "塩", "こしょう", "サラダ油"],
    steps: [
      "豚肉200gは一口大、玉ねぎ1個はくし切り、にんじん1本は乱切り、じゃがいも2個は一口大に切る",
      "鍋にサラダ油大さじ1を熱し、玉ねぎと豚肉を中火で3〜4分炒める",
      "にんじんとじゃがいもを加えてさっと炒める",
      "水700ml・コンソメ小さじ4・カレー粉大さじ1(好みで)を加えて沸かす",
      "ふたをして弱火で15分、野菜が柔らかくなるまで煮たら完成",
    ],
  },
  // ── 汁物・スープ ─────────────────────────────────
  {
    id: 72, name: "けんちん汁", kcal: 160, time: 20, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "豆腐", amount: 1 }, { name: "にんじん", amount: 1 },
      { name: "大根", amount: 8 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["醤油", "みりん", "酒", "ごま油", "顆粒だし", "塩"],
    steps: [
      "豆腐1/2丁はキッチンペーパーで水切りし、手でほぐす。にんじん1/2本・大根8cmはいちょう切りにする",
      "鍋にごま油大さじ1を熱し、にんじんと大根を中火で2分炒める",
      "豆腐を加えてほぐしながら炒め合わせる",
      "水700ml・顆粒だし小さじ2・酒大さじ1を加えて沸かし、弱火で10分煮る",
      "醤油大さじ1・みりん大さじ1・塩少々で味を整え、ねぎ(小口切り)を散らして完成",
    ],
  },
  {
    id: 73, name: "かぼちゃのポタージュ", kcal: 220, time: 20, moods: ["attaka"],
    ingredients: [
      { name: "かぼちゃ", amount: 1 }, { name: "玉ねぎ", amount: 1 }, { name: "牛乳", amount: 200 },
    ],
    seasonings: ["コンソメ", "バター", "塩", "こしょう"],
    steps: [
      "かぼちゃ1/4個は種を取って電子レンジで5〜6分加熱し、皮をむいて一口大に切る",
      "玉ねぎ1/4個はみじん切りにし、鍋にバター10gを熱してしんなりするまで炒める",
      "かぼちゃと水300ml・コンソメ小さじ2を加えて中火で5分煮る",
      "粗熱が取れたらミキサー(またはハンドブレンダー)で滑らかにする",
      "鍋に戻して牛乳200mlを加え、弱火で温め、塩こしょうで味を整えたら完成",
    ],
  },
  {
    id: 74, name: "豚肉とキャベツのコンソメスープ", kcal: 200, time: 15, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "豚肉", amount: 150 }, { name: "キャベツ", amount: 150 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["コンソメ", "塩", "こしょう", "サラダ油"],
    steps: [
      "豚肉150gは一口大、キャベツ150gはざく切り、玉ねぎ1/4個は薄切りにする",
      "鍋にサラダ油大さじ1/2を熱し、豚肉を中火で2分炒める",
      "玉ねぎを加えてしんなりするまで炒める",
      "キャベツと水600ml・コンソメ小さじ3を加えて沸かす",
      "沸騰したらアクを取り、弱火で8〜10分煮て、塩こしょうで味を整えたら完成",
    ],
  },
  {
    id: 75, name: "オニオングラタン風スープ", kcal: 180, time: 25, moods: ["attaka"],
    ingredients: [
      { name: "玉ねぎ", amount: 2 }, { name: "ベーコン", amount: 2 },
    ],
    seasonings: ["コンソメ", "バター", "塩", "こしょう", "醤油"],
    steps: [
      "玉ねぎ2個は薄切り、ベーコン2枚は1cm幅に切る",
      "鍋にバター15gを弱火で熱し、玉ねぎを20〜25分、きつね色になるまでゆっくり炒める",
      "ベーコンを加えてさっと炒め、水600ml・コンソメ小さじ3を加えて沸かす",
      "弱火で5分煮て、塩こしょうと醤油少々で味を整える",
      "耐熱カップに注ぎ、食パン少々とチーズ(あれば)をのせてトースターで焼くと本格的に",
    ],
  },
  {
    id: 76, name: "ほうれん草と卵の中華スープ", kcal: 130, time: 10, moods: ["attaka", "sappari", "jitan"],
    ingredients: [
      { name: "ほうれん草", amount: 1 }, { name: "卵", amount: 2 },
    ],
    seasonings: ["鶏ガラスープの素", "塩", "こしょう", "ごま油", "醤油"],
    steps: [
      "ほうれん草1袋を3〜4cm幅に切る。卵2個を溶いておく",
      "鍋に水600ml・鶏ガラスープの素小さじ2を入れて沸かす",
      "ほうれん草を加えて1〜2分煮る",
      "醤油小さじ1・塩こしょう少々で味を整え、溶き卵を細く回し入れる",
      "卵がふわっと浮いたらごま油数滴をたらして完成",
    ],
  },
  {
    id: 77, name: "鶏肉と大根の和風スープ", kcal: 210, time: 20, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "鶏肉", amount: 200 }, { name: "大根", amount: 8 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["醤油", "みりん", "顆粒だし", "塩", "酒"],
    steps: [
      "鶏肉200gは一口大、大根8cmは半月切り、ねぎ1/2本は斜め切りにする",
      "鍋に水700ml・顆粒だし小さじ2・酒大さじ2を入れて沸かす",
      "鶏肉と大根を加え、アクを取りながら中火で10〜12分煮る",
      "大根が柔らかくなったら醤油大さじ1・みりん大さじ1・塩少々で味を整える",
      "ねぎを加えてひと煮立ちさせたら完成",
    ],
  },
  // ── お弁当のおかず ────────────────────────────────
  {
    id: 78, name: "甘い卵焼き", kcal: 190, time: 10, moods: ["jitan", "sappari"],
    ingredients: [{ name: "卵", amount: 3 }],
    seasonings: ["砂糖", "醤油", "みりん", "サラダ油"],
    steps: [
      "卵3個を溶き、砂糖大さじ1・醤油小さじ1/2・みりん小さじ1・水大さじ1を加えてよく混ぜる",
      "卵焼き器(または小さいフライパン)にサラダ油をなじませ、中火で熱する",
      "卵液の1/3量を流し入れ、半熟になったら奥から手前に巻く",
      "卵を奥に寄せて油を足し、残りの卵液を2回に分けて同様に巻き重ねる",
      "巻き簾(またはラップ)で形を整えて2〜3分おき、食べやすく切ったら完成",
    ],
  },
  {
    id: 79, name: "鶏ひき肉のつくね", kcal: 300, time: 20, moods: ["jitan", "gatsuri"],
    ingredients: [{ name: "ひき肉", amount: 200 }],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "サラダ油", "しょうが(チューブ)"],
    steps: [
      "ひき肉200g・しょうがチューブ2cm・塩少々・酒大さじ1を混ぜてよくこねる",
      "8〜10等分にして小判形に成形する",
      "フライパンにサラダ油大さじ1/2を熱し、中火で両面2〜3分ずつ焼いて中まで火を通す",
      "醤油大さじ1・みりん大さじ1・砂糖大さじ1/2を合わせ、フライパンに加えて絡める",
      "照りが出たら完成。お弁当にも◎",
    ],
  },
  {
    id: 80, name: "れんこんのきんぴら", kcal: 140, time: 15, moods: ["jitan", "sappari"],
    ingredients: [{ name: "れんこん", amount: 150 }],
    seasonings: ["醤油", "みりん", "砂糖", "ごま油", "酒"],
    steps: [
      "れんこん150gは皮をむいて薄い半月切りにし、水にさらしてアクを抜く",
      "フライパンにごま油大さじ1を熱し、れんこんの水気をきって中火で2〜3分炒める",
      "酒大さじ1・醤油大さじ1・みりん大さじ1・砂糖小さじ1を加えて炒め合わせる",
      "汁気がなくなるまで2〜3分炒めたら完成",
      "仕上げに白ごまを振ると風味アップ。お弁当にも最適",
    ],
  },
  {
    id: 81, name: "かぼちゃの煮物", kcal: 170, time: 20, moods: ["attaka", "sappari"],
    ingredients: [{ name: "かぼちゃ", amount: 1 }],
    seasonings: ["醤油", "みりん", "砂糖", "顆粒だし"],
    steps: [
      "かぼちゃ1/4個は一口大(3〜4cm角)に切る。皮を一部そぎ取ると煮崩れしにくい",
      "鍋にかぼちゃを皮目を下にして並べ、水200ml・顆粒だし小さじ1を加える",
      "醤油大さじ1・みりん大さじ1・砂糖大さじ1を加えて中火にかける",
      "沸騰したらふたをして弱火で12〜15分、竹串がすっと通るまで煮る",
      "ふたを外して煮汁が少なくなるまで3〜4分煮詰めたら完成",
    ],
  },
  {
    id: 82, name: "牛肉のしぐれ煮", kcal: 280, time: 15, moods: ["jitan", "sappari"],
    ingredients: [{ name: "牛肉", amount: 200 }],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "しょうが(チューブ)"],
    steps: [
      "牛肉200gは食べやすい大きさに切る(薄切り切り落としが最適)",
      "フライパンに牛肉を広げ、酒大さじ2・しょうがチューブ3cmを加えて中火で炒める",
      "肉の色が変わったら醤油大さじ2・みりん大さじ1・砂糖大さじ1を加える",
      "中火で炒め続け、汁気がほぼなくなるまで煮詰める",
      "照りが出たら完成。ごはんのお供・お弁当のおかずとして最適",
    ],
  },
  {
    id: 83, name: "鮭の南蛮漬け風", kcal: 290, time: 20, moods: ["sappari", "jitan"],
    ingredients: [
      { name: "鮭", amount: 2 }, { name: "玉ねぎ", amount: 1 }, { name: "にんじん", amount: 1 },
    ],
    seasonings: ["醤油", "砂糖", "酒", "サラダ油", "塩", "こしょう"],
    steps: [
      "玉ねぎ1/2個は薄切り、にんじん1/3本は細切りにする",
      "醤油大さじ2・砂糖大さじ1・酢大さじ2・水大さじ2を合わせてつけ汁を作る",
      "鮭2切れに塩こしょうをふり、薄く薄力粉をまぶす",
      "フライパンにサラダ油大さじ1を熱し、鮭を中火で両面3分ずつ焼いて火を通す",
      "鮭とスライスした野菜をつけ汁に漬け、30分以上おいて完成",
    ],
  },
  {
    id: 84, name: "ちくわの磯辺炒め", kcal: 160, time: 8, moods: ["jitan", "sappari"],
    ingredients: [{ name: "ちくわ", amount: 3 }],
    seasonings: ["ごま油", "醤油", "みりん", "塩", "こしょう"],
    steps: [
      "ちくわ3本を斜め薄切りにする",
      "フライパンにごま油小さじ1を熱し、ちくわを中火でさっと炒める",
      "醤油小さじ1・みりん小さじ1を加えて炒め合わせる",
      "塩こしょう少々で味を整える",
      "仕上げに青のり(あれば)をふって完成。お弁当のすき間埋めに最適",
    ],
  },
  {
    id: 85, name: "豆腐ハンバーグ", kcal: 300, time: 20, moods: ["jitan", "sappari"],
    ingredients: [{ name: "豆腐", amount: 1 }, { name: "ひき肉", amount: 150 }],
    seasonings: ["醤油", "みりん", "砂糖", "サラダ油", "しょうが(チューブ)", "塩", "こしょう"],
    steps: [
      "豆腐1/2丁をキッチンペーパーで包んで電子レンジで2分加熱し、水気をきる",
      "ひき肉150g・豆腐・しょうがチューブ1cm・塩こしょう少々をよくこねて4等分し小判形に成形する",
      "フライパンにサラダ油大さじ1/2を熱し、中火で両面3分ずつ焼いて中まで火を通す",
      "醤油大さじ1・みりん大さじ1・砂糖小さじ1/2を合わせてフライパンに回し入れ絡める",
      "照りが出たら完成。ふわふわ食感でヘルシー",
    ],
  },
  {
    id: 86, name: "ブロッコリーのごまあえ", kcal: 110, time: 10, moods: ["jitan", "sappari"],
    ingredients: [{ name: "ブロッコリー", amount: 1 }],
    seasonings: ["醤油", "ごま油", "砂糖", "顆粒だし"],
    steps: [
      "ブロッコリー1/2個を小房に分け、電子レンジで2〜3分加熱する",
      "または沸騰した湯で2〜3分ゆでて水気をきる",
      "醤油大さじ1・ごま油小さじ1・砂糖小さじ1/2・顆粒だし少々を混ぜてたれを作る",
      "温かいうちにブロッコリーとたれをよく和える",
      "白ごまをたっぷりふって完成。冷めてもおいしいのでお弁当にも◎",
    ],
  },
  {
    id: 87, name: "ピーマンと牛肉の細切り炒め", kcal: 360, time: 12, moods: ["jitan", "gatsuri"],
    ingredients: [{ name: "牛肉", amount: 200 }, { name: "ピーマン", amount: 3 }],
    seasonings: ["醤油", "みりん", "砂糖", "ごま油", "酒", "しょうが(チューブ)"],
    steps: [
      "牛肉200gとピーマン3個をそれぞれ細切りにする",
      "牛肉に酒大さじ1・醤油小さじ1・しょうがチューブ1cmをもみ込んで5分おく",
      "フライパンにごま油大さじ1を強火で熱し、牛肉を炒めて一度取り出す",
      "同じフライパンでピーマンを1〜2分炒め、牛肉を戻す",
      "醤油大さじ1・みりん大さじ1/2・砂糖小さじ1を加えて手早く炒め合わせて完成",
    ],
  },
  // ── 麺類 ────────────────────────────────────────
  {
    id: 88, name: "カレーうどん", kcal: 510, time: 15, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "うどん", amount: 2 }, { name: "豚肉", amount: 150 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["顆粒だし", "醤油", "みりん", "砂糖", "サラダ油"],
    steps: [
      "豚肉150gは一口大、玉ねぎ1/2個は薄切りにする",
      "鍋にサラダ油大さじ1/2を熱し、豚肉と玉ねぎを中火で炒める",
      "水600ml・顆粒だし小さじ2を加えて沸かす",
      "カレー粉大さじ1・醤油大さじ2・みりん大さじ1・砂糖小さじ1を加えてよく混ぜ、水溶き片栗粉大さじ1でとろみをつける",
      "別鍋でうどん2玉をゆでて器に盛り、カレースープをかけて完成",
    ],
  },
  {
    id: 89, name: "煮込みうどん", kcal: 530, time: 20, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "うどん", amount: 2 }, { name: "豚肉", amount: 150 },
      { name: "白菜", amount: 150 }, { name: "卵", amount: 2 },
    ],
    seasonings: ["顆粒だし", "醤油", "みりん", "砂糖", "酒"],
    steps: [
      "豚肉150gは一口大、白菜150gはざく切りにする",
      "鍋に水700ml・顆粒だし小さじ2・醤油大さじ2・みりん大さじ1・砂糖小さじ1・酒大さじ1を合わせて沸かす",
      "豚肉と白菜を加えて3〜4分煮る",
      "うどん2玉を加え、ほぐしながら3〜4分煮込む",
      "卵2個を割り入れ、好みのかたさに火を通したら完成",
    ],
  },
  {
    id: 90, name: "月見うどん", kcal: 360, time: 10, moods: ["attaka", "sappari", "jitan"],
    ingredients: [
      { name: "うどん", amount: 2 }, { name: "卵", amount: 2 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["顆粒だし", "醤油", "みりん", "塩"],
    steps: [
      "鍋に水700ml・顆粒だし小さじ2を沸かし、醤油大さじ2・みりん大さじ1・塩少々でつゆを作る",
      "別鍋でうどん2玉を表示通りゆでて水気をきる",
      "うどんを器に盛り、つゆを注ぐ",
      "中央に卵を1個ずつ割り入れる",
      "ねぎ(小口切り)を散らして完成。卵をかき混ぜながら食べる",
    ],
  },
  {
    id: 91, name: "きつねうどん", kcal: 400, time: 12, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "うどん", amount: 2 }, { name: "油揚げ", amount: 2 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["顆粒だし", "醤油", "みりん", "砂糖", "酒"],
    steps: [
      "油揚げ2枚を熱湯をかけて油抜きし、醤油大さじ1・みりん大さじ1・砂糖大さじ1・酒大さじ1・水100mlで甘辛く煮ておく",
      "鍋に水700ml・顆粒だし小さじ2を沸かし、醤油大さじ2・みりん大さじ1・塩少々でつゆを作る",
      "別鍋でうどん2玉をゆでて水気をきる",
      "器にうどんを盛り、つゆを注ぐ",
      "煮た油揚げとねぎ(小口切り)をのせて完成",
    ],
  },
  {
    id: 92, name: "ざるそば", kcal: 320, time: 10, moods: ["sappari", "jitan"],
    ingredients: [{ name: "そば", amount: 2 }, { name: "ねぎ", amount: 1 }],
    seasonings: ["醤油", "みりん", "顆粒だし", "砂糖"],
    steps: [
      "醤油大さじ2・みりん大さじ2・顆粒だし小さじ1・砂糖小さじ1・水200mlを小鍋で沸かしてめんつゆを作り、冷蔵庫で冷やす",
      "大きな鍋に湯を沸かし、そば2束を袋の表示通りゆでる",
      "ゆでたらすぐにざるにあけ、流水でよく洗って粗熱と滑りを取る",
      "氷水でしっかり冷やして水気をきる",
      "器に盛り、冷やしためんつゆとねぎ(小口切り)、わさび(あれば)を添えて完成",
    ],
  },
  {
    id: 93, name: "とんこつ風ラーメン", kcal: 560, time: 20, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "中華麺", amount: 2 }, { name: "豚肉", amount: 150 },
      { name: "もやし", amount: 1 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["醤油", "塩", "こしょう", "ごま油", "鶏ガラスープの素"],
    steps: [
      "豚肉150gは薄切りにし、もやし1袋はそのまま、ねぎ1/3本は小口切りにする",
      "鍋に水700ml・鶏ガラスープの素大さじ1と1/2・牛乳100ml(あれば)・塩少々を合わせて沸かす",
      "豚肉を加えて3〜4分煮る",
      "別鍋でもやしをさっとゆで、中華麺2玉を表示通りゆでる",
      "器に麺を盛ってスープを注ぎ、豚肉・もやし・ねぎをのせ、ごま油を数滴たらして完成",
    ],
  },
  {
    id: 94, name: "塩ラーメン", kcal: 420, time: 15, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "中華麺", amount: 2 }, { name: "ねぎ", amount: 1 }, { name: "ベーコン", amount: 2 },
    ],
    seasonings: ["鶏ガラスープの素", "塩", "こしょう", "ごま油", "酒"],
    steps: [
      "ねぎ1/3本は小口切り、ベーコン2枚は細切りにする",
      "鍋に水700ml・鶏ガラスープの素小さじ2・酒大さじ1を入れて沸かす",
      "ベーコンを加えて2〜3分煮る",
      "塩小さじ1/2・こしょう少々で味を整える",
      "茹でた中華麺2玉を器に盛ってスープを注ぎ、ねぎとごま油数滴をのせて完成",
    ],
  },
  {
    id: 95, name: "醤油ラーメン", kcal: 470, time: 15, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "中華麺", amount: 2 }, { name: "ねぎ", amount: 1 },
      { name: "ベーコン", amount: 2 }, { name: "卵", amount: 2 },
    ],
    seasonings: ["醤油", "みりん", "顆粒だし", "ごま油", "塩", "酒"],
    steps: [
      "卵2個を10分ほど固ゆでにして半分に切る。ねぎ1/3本は小口切り、ベーコンは細切りにする",
      "鍋に水700ml・顆粒だし小さじ2・醤油大さじ2・みりん大さじ1・酒大さじ1を合わせて沸かす",
      "ベーコンを加えて2〜3分煮て、塩少々で味を整える",
      "中華麺2玉を表示通りゆでて器に盛る",
      "スープを注ぎ、ゆで卵・ねぎをのせ、ごま油数滴を回しかけて完成",
    ],
  },
  // ── パスタ ──────────────────────────────────────
  {
    id: 96, name: "ナポリタン", kcal: 530, time: 20, moods: ["jitan", "gatsuri"],
    ingredients: [
      { name: "スパゲッティ", amount: 200 }, { name: "玉ねぎ", amount: 1 },
      { name: "ベーコン", amount: 3 }, { name: "トマト", amount: 1 },
    ],
    seasonings: ["塩", "こしょう", "サラダ油", "バター", "コンソメ"],
    steps: [
      "玉ねぎ1/2個は薄切り、ベーコン3枚は1cm幅、トマト1個はざく切りにする",
      "大きな鍋に湯を沸かし、塩(水1Lに大さじ1)を加えてスパゲッティ200gをゆでる",
      "フライパンにサラダ油大さじ1・バター10gを熱し、玉ねぎとベーコンを中火で炒める",
      "トマトを加えてつぶしながら炒め、ケチャップ大さじ3・コンソメ小さじ1・塩こしょう少々で味付けする",
      "ゆでたスパゲッティを加えてよく絡めて完成",
    ],
  },
  {
    id: 97, name: "ツナとトマトのパスタ", kcal: 490, time: 15, moods: ["sappari", "jitan"],
    ingredients: [
      { name: "スパゲッティ", amount: 200 }, { name: "ツナ", amount: 1 }, { name: "トマト", amount: 2 },
    ],
    seasonings: ["塩", "こしょう", "サラダ油", "にんにく(チューブ)", "醤油"],
    steps: [
      "トマト2個はざく切りにする。スパゲッティ200gを塩湯でゆでておく",
      "フライパンにサラダ油大さじ1・にんにくチューブ2cmを入れ、弱火で香りを出す",
      "トマトを加えて中火でつぶしながら5分炒める",
      "汁気をきったツナを加えてほぐしながら混ぜる",
      "ゆでたスパゲッティを加え、醤油小さじ1・塩こしょうで味を整えて完成",
    ],
  },
  {
    id: 98, name: "えびのトマトクリームパスタ", kcal: 580, time: 20, moods: ["gatsuri", "sappari"],
    ingredients: [
      { name: "スパゲッティ", amount: 200 }, { name: "えび", amount: 150 },
      { name: "トマト", amount: 2 }, { name: "牛乳", amount: 150 },
    ],
    seasonings: ["塩", "こしょう", "バター", "にんにく(チューブ)", "コンソメ"],
    steps: [
      "えび150gは背わたを取り、塩少々をふる。トマト2個はざく切りにする",
      "スパゲッティ200gを塩湯でゆでておく",
      "フライパンにバター15g・にんにくチューブ2cmを熱し、えびを中火で炒めて取り出す",
      "同じフライパンでトマトをつぶしながら炒め、コンソメ小さじ1・牛乳150mlを加えて5分煮詰める",
      "えびを戻し入れ、ゆでたスパゲッティを加えて塩こしょうで味を整えたら完成",
    ],
  },
  {
    id: 99, name: "鶏肉のバター醤油パスタ", kcal: 550, time: 20, moods: ["jitan", "gatsuri"],
    ingredients: [
      { name: "スパゲッティ", amount: 200 }, { name: "鶏肉", amount: 200 },
    ],
    seasonings: ["醤油", "バター", "塩", "こしょう", "サラダ油", "にんにく(チューブ)"],
    steps: [
      "鶏肉200gは一口大に切り、塩こしょうをふる",
      "スパゲッティ200gを塩湯でゆでておく(ゆで汁を大さじ3取っておく)",
      "フライパンにサラダ油大さじ1・にんにくチューブ1cmを熱し、鶏肉を中火で両面3〜4分焼く",
      "バター大さじ1を加えて溶かし、醤油大さじ1・1/2とゆで汁大さじ3を加えてソースを作る",
      "ゆでたスパゲッティを加えて絡め、塩こしょうで味を整えたら完成",
    ],
  },
  {
    id: 100, name: "ボロネーゼ", kcal: 610, time: 25, moods: ["gatsuri", "attaka"],
    ingredients: [
      { name: "スパゲッティ", amount: 200 }, { name: "ひき肉", amount: 200 },
      { name: "玉ねぎ", amount: 1 }, { name: "トマト", amount: 2 },
    ],
    seasonings: ["醤油", "塩", "こしょう", "サラダ油", "コンソメ", "にんにく(チューブ)"],
    steps: [
      "玉ねぎ1/2個はみじん切り、トマト2個はざく切りにする",
      "フライパンにサラダ油大さじ1・にんにくチューブ1cmを熱し、玉ねぎを弱火で5分炒める",
      "ひき肉200gを加えて中火でそぼろ状になるまで炒める",
      "トマトを加えてつぶしながら炒め、コンソメ小さじ2・醤油小さじ1・塩こしょう少々で味付けして10〜15分煮詰める",
      "塩湯でゆでたスパゲッティ200gを加えて絡めて完成",
    ],
  },
  // ── 炊き込みご飯・チャーハン・リゾット ───────────────
  {
    id: 101, name: "鶏肉の炊き込みご飯", kcal: 490, time: 40, moods: ["attaka", "jitan"],
    ingredients: [{ name: "鶏肉", amount: 200 }, { name: "米", amount: 2 }],
    seasonings: ["醤油", "みりん", "酒", "顆粒だし", "しょうが(チューブ)"],
    steps: [
      "米2合を洗って30分浸水させ、水気をきる",
      "鶏肉200gは1cm角に切り、醤油大さじ1/2・酒大さじ1/2で下味をつける",
      "炊飯器に米・水350ml(通常より少なめ)・醤油大さじ1・みりん大さじ1・顆粒だし小さじ1・しょうがチューブ2cmを入れて混ぜる",
      "鶏肉を上にのせて普通に炊く",
      "炊き上がったらさっくりと混ぜて完成",
    ],
  },
  {
    id: 102, name: "鮭の炊き込みご飯", kcal: 440, time: 40, moods: ["attaka", "sappari"],
    ingredients: [{ name: "鮭", amount: 2 }, { name: "米", amount: 2 }],
    seasonings: ["醤油", "みりん", "酒", "顆粒だし", "塩"],
    steps: [
      "米2合を洗って30分浸水させ、水気をきる",
      "鮭2切れに塩少々をふっておく",
      "炊飯器に米・水360ml・醤油大さじ1・みりん大さじ1・酒大さじ1・顆粒だし小さじ1を入れて混ぜる",
      "鮭を皮目を下にしてのせ、普通に炊く",
      "炊き上がったら鮭の骨を取りながらほぐし混ぜて完成。三つ葉があれば添えると◎",
    ],
  },
  {
    id: 103, name: "えびピラフ", kcal: 510, time: 35, moods: ["jitan", "sappari"],
    ingredients: [
      { name: "えび", amount: 150 }, { name: "玉ねぎ", amount: 1 },
      { name: "ベーコン", amount: 2 }, { name: "米", amount: 2 },
    ],
    seasonings: ["コンソメ", "バター", "塩", "こしょう", "サラダ油"],
    steps: [
      "えび150gは背わたを取る。玉ねぎ1/4個はみじん切り、ベーコン2枚は1cm幅に切る。米2合は研いで水気をきる",
      "フライパンにバター10gを熱し、玉ねぎとベーコンを中火で炒める",
      "えびを加えて色が変わるまで炒め、塩こしょう少々をふる",
      "炊飯器に米・水380ml・コンソメ小さじ3・バター10gを入れ、炒めた具をのせて炊く",
      "炊き上がったらさっくり混ぜて完成",
    ],
  },
  {
    id: 104, name: "トマトリゾット", kcal: 420, time: 20, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "ごはん", amount: 2 }, { name: "玉ねぎ", amount: 1 },
      { name: "トマト", amount: 2 }, { name: "牛乳", amount: 100 },
    ],
    seasonings: ["コンソメ", "バター", "塩", "こしょう", "にんにく(チューブ)"],
    steps: [
      "玉ねぎ1/4個はみじん切り、トマト2個はざく切りにする",
      "鍋にバター10g・にんにくチューブ1cmを熱し、玉ねぎを弱火で3分炒める",
      "トマトを加えてつぶしながら炒め、水300ml・コンソメ小さじ2を加えて煮立てる",
      "ごはん2杯を加えてほぐしながら中火で5〜6分煮る",
      "牛乳100mlを加えてさらに2分煮、塩こしょうで味を整えたら完成。チーズをかけると◎",
    ],
  },
  {
    id: 105, name: "ベーコンリゾット", kcal: 440, time: 15, moods: ["attaka"],
    ingredients: [
      { name: "ごはん", amount: 2 }, { name: "ベーコン", amount: 3 },
      { name: "玉ねぎ", amount: 1 }, { name: "牛乳", amount: 150 },
    ],
    seasonings: ["コンソメ", "バター", "塩", "こしょう"],
    steps: [
      "玉ねぎ1/4個はみじん切り、ベーコン3枚は1cm幅に切る",
      "鍋にバター10gを熱し、玉ねぎとベーコンを中火で3分炒める",
      "水300ml・コンソメ小さじ2を加えて沸かす",
      "ごはん2杯を加えてほぐしながら5分煮る",
      "牛乳150mlを加えてとろっとするまで2〜3分煮込み、塩こしょうで味を整えたら完成",
    ],
  },
  {
    id: 106, name: "豚肉チャーハン", kcal: 560, time: 12, moods: ["jitan", "gatsuri"],
    ingredients: [
      { name: "ごはん", amount: 2 }, { name: "豚肉", amount: 150 },
      { name: "玉ねぎ", amount: 1 }, { name: "卵", amount: 2 },
    ],
    seasonings: ["醤油", "塩", "こしょう", "ごま油", "サラダ油"],
    steps: [
      "豚肉150gは小さく切り、塩こしょう少々をふる。玉ねぎ1/4個はみじん切り。卵2個は溶く",
      "フライパンにサラダ油大さじ1を強火で熱し、豚肉を炒めて取り出す",
      "同じフライパンに油を足し、玉ねぎを炒め、溶き卵を加えて半熟にする",
      "ごはん2杯を加えてほぐしながら強火で炒める",
      "豚肉を戻し、醤油大さじ1・塩こしょう少々で味を整え、仕上げにごま油少々をたらして完成",
    ],
  },
  {
    id: 107, name: "キムチチャーハン", kcal: 520, time: 10, moods: ["jitan", "gatsuri"],
    ingredients: [
      { name: "ごはん", amount: 2 }, { name: "キムチ", amount: 100 },
      { name: "卵", amount: 2 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["醤油", "ごま油", "塩", "こしょう", "サラダ油"],
    steps: [
      "キムチ100gは細かく刻む。ねぎ1/4本は小口切り。卵2個は溶く",
      "フライパンにサラダ油大さじ1を強火で熱し、溶き卵を流し入れて半熟にする",
      "ごはん2杯を加えてほぐしながら炒める",
      "キムチを加えて強火で炒め合わせる",
      "ねぎを加え、醤油小さじ1・塩こしょう少々・ごま油数滴で味を整えて完成",
    ],
  },
  {
    id: 108, name: "えびチャーハン", kcal: 490, time: 12, moods: ["jitan", "gatsuri"],
    ingredients: [
      { name: "ごはん", amount: 2 }, { name: "えび", amount: 150 },
      { name: "卵", amount: 2 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["醤油", "塩", "こしょう", "ごま油", "サラダ油", "酒"],
    steps: [
      "えび150gは背わたを取り、酒少々と塩少々で下味をつける。ねぎ1/4本は小口切り。卵2個は溶く",
      "フライパンにサラダ油大さじ1を強火で熱し、えびをさっと炒めて取り出す",
      "同じフライパンに油を足し、溶き卵を流し入れてふんわり炒める",
      "ごはん2杯を加えて強火でほぐしながら炒める",
      "えびを戻し、醤油大さじ1・塩こしょう少々で味付けし、ねぎとごま油少々を加えて完成",
    ],
  },
  {
    id: 109, name: "オムライス", kcal: 590, time: 20, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "ごはん", amount: 2 }, { name: "鶏肉", amount: 150 },
      { name: "玉ねぎ", amount: 1 }, { name: "卵", amount: 3 },
    ],
    seasonings: ["醤油", "塩", "こしょう", "バター", "サラダ油", "コンソメ"],
    steps: [
      "鶏肉150gは1cm角、玉ねぎ1/4個はみじん切りにする",
      "フライパンにバター10gを熱し、鶏肉と玉ねぎを中火で炒め、ケチャップ大さじ2・醤油小さじ1・塩こしょうで味付けしてチキンライスを作る",
      "別のフライパンにバター10gを熱し、溶き卵3個(塩少々入り)を流し入れる",
      "半熟状になったらチキンライス2杯分を中央にのせて包む",
      "皿に盛り、ケチャップを好みでかけて完成",
    ],
  },
  // ── 揚げ物 ──────────────────────────────────────
  {
    id: 110, name: "えびフライ", kcal: 340, time: 20, moods: ["gatsuri", "sappari"],
    ingredients: [{ name: "えび", amount: 200 }, { name: "卵", amount: 1 }],
    seasonings: ["塩", "こしょう", "サラダ油"],
    steps: [
      "えび200gは背わたを取り、尾を残して殻をむく。腹側に浅く切り込みを入れてまっすぐにする",
      "えびに塩こしょうをふり、薄力粉→溶き卵→パン粉の順に衣をつける",
      "フライパンにサラダ油を1〜2cm深さに入れて170〜180℃に熱する",
      "えびを入れて片面2〜3分ずつ揚げ、こんがりきつね色になったら取り出す",
      "油をきって盛り付け、タルタルソース(マヨネーズ+ゆで卵みじん切り)やレモンを添えて完成",
    ],
  },
  {
    id: 111, name: "チキンカツ", kcal: 480, time: 20, moods: ["gatsuri"],
    ingredients: [{ name: "鶏肉", amount: 300 }, { name: "卵", amount: 1 }],
    seasonings: ["塩", "こしょう", "サラダ油", "醤油"],
    steps: [
      "鶏肉300gを薄く開き(観音開き)、塩こしょう少々をふる",
      "薄力粉→溶き卵→パン粉の順に衣をつける",
      "フライパンにサラダ油を1〜2cm深さに入れて170℃に熱する",
      "鶏肉を入れて中火で片面3〜4分ずつ、中まで火が通るまで揚げる",
      "油をきってひと口大に切り、ソースや醤油をかけて完成",
    ],
  },
  {
    id: 112, name: "ポークカツ丼", kcal: 680, time: 25, moods: ["gatsuri"],
    ingredients: [
      { name: "豚肉", amount: 200 }, { name: "卵", amount: 3 },
      { name: "玉ねぎ", amount: 1 }, { name: "ごはん", amount: 2 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "顆粒だし", "サラダ油"],
    steps: [
      "豚肉200gは1cm厚さのロース肉を使い、塩こしょうをふって薄力粉→溶き卵→パン粉で衣をつける",
      "サラダ油で170〜180℃で両面合計6〜8分揚げ、油をきって2〜3cm幅に切る",
      "小鍋に水150ml・顆粒だし小さじ1・醤油大さじ2・みりん大さじ2・砂糖大さじ1を合わせて沸かす",
      "玉ねぎ1/2個(薄切り)を加えて2分煮、カツをのせる",
      "溶き卵2個を回し入れて半熟状にし、ごはんの上にのせて完成",
    ],
  },
  {
    id: 113, name: "鮭のフライ", kcal: 370, time: 20, moods: ["sappari", "jitan"],
    ingredients: [{ name: "鮭", amount: 2 }, { name: "卵", amount: 1 }],
    seasonings: ["塩", "こしょう", "サラダ油"],
    steps: [
      "鮭2切れに塩こしょう少々をふり、5分おく",
      "薄力粉→溶き卵→パン粉の順に衣をつける",
      "フライパンにサラダ油を1〜2cm深さに入れて170℃に熱する",
      "鮭を入れて片面3〜4分ずつ、こんがりと揚げる",
      "油をきって盛り付け、タルタルソースやレモンを添えて完成",
    ],
  },
  {
    id: 114, name: "じゃがいもコロッケ", kcal: 400, time: 30, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "じゃがいも", amount: 3 }, { name: "ひき肉", amount: 100 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["塩", "こしょう", "サラダ油", "バター"],
    steps: [
      "じゃがいも3個は皮をむいて茹でてつぶし、塩こしょうとバター10gで味付けする",
      "フライパンにサラダ油少々を熱し、みじん切りの玉ねぎ1/4個とひき肉100gを炒め、塩こしょうで味付けしてじゃがいもに混ぜる",
      "6〜8等分にして楕円形に成形し、薄力粉→溶き卵→パン粉の順に衣をつける",
      "フライパンにサラダ油を1〜2cm深さに熱し、170℃で両面3〜4分ずつ揚げる",
      "きつね色になったら油をきって盛り付け、ソースをかけて完成",
    ],
  },
  {
    id: 115, name: "かき揚げ", kcal: 320, time: 20, moods: ["sappari", "jitan"],
    ingredients: [{ name: "えび", amount: 100 }, { name: "玉ねぎ", amount: 1 }],
    seasonings: ["塩", "サラダ油", "顆粒だし", "醤油", "みりん"],
    steps: [
      "えび100gは背わたを取って2cm幅に切る。玉ねぎ1/4個は薄切りにする",
      "薄力粉大さじ3・冷水大さじ3を混ぜて衣を作る(混ぜすぎない)",
      "えびと玉ねぎを衣と合わせる",
      "フライパンにサラダ油を2〜3cm深さに入れて170〜180℃に熱し、スプーンで一口大ずつ落として揚げる",
      "両面3〜4分ずつ揚げてきつね色になったら取り出し、天つゆ(水・顆粒だし・醤油・みりん各適量)と合わせて完成",
    ],
  },
  {
    id: 116, name: "竜田揚げ", kcal: 460, time: 25, moods: ["gatsuri"],
    ingredients: [{ name: "鶏肉", amount: 300 }],
    seasonings: ["醤油", "みりん", "酒", "しょうが(チューブ)", "サラダ油"],
    steps: [
      "鶏肉300gを一口大に切る",
      "醤油大さじ2・みりん大さじ1・酒大さじ1・しょうがチューブ2cmを合わせたタレに15〜20分漬け込む",
      "タレの汁気をきり、片栗粉をまんべんなくまぶす",
      "フライパンにサラダ油を1〜2cm深さに入れて180℃に熱し、鶏肉を入れる",
      "中火で片面3〜4分ずつ、こんがりするまで揚げたら油をきって完成",
    ],
  },
  // ── 蒸し料理 ────────────────────────────────────
  {
    id: 117, name: "茶碗蒸し", kcal: 130, time: 25, moods: ["sappari", "attaka"],
    ingredients: [{ name: "卵", amount: 2 }, { name: "えび", amount: 4 }, { name: "ねぎ", amount: 1 }],
    seasonings: ["顆粒だし", "醤油", "みりん", "塩", "酒"],
    steps: [
      "だし汁200ml(水200ml+顆粒だし小さじ1)・醤油小さじ1・みりん小さじ1・酒小さじ1・塩少々を合わせて冷ます",
      "卵2個を溶いてだし汁と合わせ、こし器で漉す",
      "えびは背わたを取り、下味に酒少々をふる",
      "耐熱の器にえびとねぎ(小口切り)を入れ、卵液を注ぐ",
      "フライパンに水を張ってふたをし、弱火で12〜15分蒸したら完成。表面がぷるっとしたらOK",
    ],
  },
  {
    id: 118, name: "よだれ鶏", kcal: 310, time: 20, moods: ["sappari", "jitan"],
    ingredients: [{ name: "鶏肉", amount: 300 }],
    seasonings: ["醤油", "ごま油", "砂糖", "酒", "にんにく(チューブ)", "しょうが(チューブ)"],
    steps: [
      "鶏肉300gに酒大さじ1・塩少々をふり、耐熱皿に入れてラップをして電子レンジで6〜7分加熱する",
      "または鍋でお湯を沸かし、しょうがチューブを加えた湯に鶏肉を入れてふたをし弱火で15分蒸し煮にする",
      "粗熱が取れたら食べやすく裂く",
      "醤油大さじ1と1/2・砂糖大さじ1・ごま油大さじ1・にんにくチューブ2cm・しょうがチューブ1cmを混ぜてソースを作る",
      "鶏肉を器に盛り、ソースをかけ、ねぎ(あれば)を散らして完成",
    ],
  },
  {
    id: 119, name: "豚バラの野菜蒸し巻き", kcal: 350, time: 20, moods: ["sappari", "jitan"],
    ingredients: [{ name: "豚肉", amount: 200 }, { name: "キャベツ", amount: 150 }],
    seasonings: ["醤油", "ごま油", "みりん", "しょうが(チューブ)", "塩", "こしょう"],
    steps: [
      "キャベツ150gはざく切りにし、電子レンジで2分加熱して水気を軽くしぼる",
      "豚バラ肉200gを広げ、塩こしょうをふってキャベツを手前に置いてくるりと巻く",
      "フライパンに並べ、水大さじ2を加えてふたをして中火で5〜6分蒸し焼きにする",
      "肉に火が通ったらふたを外して余分な水分を飛ばす",
      "醤油大さじ1・みりん大さじ1・ごま油少々・しょうがチューブ1cmを混ぜたタレをかけて完成",
    ],
  },
  {
    id: 120, name: "中華蒸し豆腐", kcal: 160, time: 12, moods: ["sappari", "jitan", "attaka"],
    ingredients: [{ name: "豆腐", amount: 1 }, { name: "ねぎ", amount: 1 }],
    seasonings: ["醤油", "ごま油", "しょうが(チューブ)", "にんにく(チューブ)", "塩", "砂糖"],
    steps: [
      "豆腐1丁をキッチンペーパーで軽く水気をふき、耐熱皿にのせる",
      "電子レンジで2〜3分加熱し、出てきた水気をふき取る",
      "醤油大さじ1・砂糖小さじ1/2・しょうがチューブ2cm・にんにくチューブ1cmを混ぜてソースを作る",
      "豆腐にソースをかける",
      "ごま油大さじ1を小鍋で煙が出るほど熱し、豆腐の上にジュッとかけ、ねぎ(小口切り)を散らして完成",
    ],
  },
  {
    id: 121, name: "豆腐とひき肉の蒸し物", kcal: 280, time: 18, moods: ["sappari", "jitan"],
    ingredients: [{ name: "豆腐", amount: 1 }, { name: "ひき肉", amount: 150 }],
    seasonings: ["醤油", "みりん", "酒", "ごま油", "しょうが(チューブ)", "塩", "こしょう"],
    steps: [
      "豆腐1丁は水気をきって4〜6等分に切り、耐熱皿に並べる",
      "ひき肉150g・醤油小さじ1・みりん小さじ1・酒大さじ1・しょうがチューブ1cm・塩こしょう少々を合わせてよく混ぜる",
      "豆腐の上にひき肉を等分にのせる",
      "フライパンに水を張ってふたをし、弱火で10〜12分蒸す",
      "ごま油を数滴たらし、仕上げに醤油少々をかけて完成",
    ],
  },
  // ── 焼き料理 ────────────────────────────────────
  {
    id: 122, name: "さばの塩焼き", kcal: 260, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "さば", amount: 2 }],
    seasonings: ["塩", "こしょう", "ごま油"],
    steps: [
      "さば2切れの両面に塩を薄くふり、10〜15分おいて水気をふき取る",
      "魚焼きグリル(またはフライパン)を中火で熱する",
      "皮目を下にして並べ、中火で5〜6分焼く",
      "裏返して3〜4分焼き、中まで火が通ったら取り出す",
      "大根おろし(あれば)とレモンを添えて完成",
    ],
  },
  {
    id: 123, name: "鮭のバター醤油焼き", kcal: 310, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "鮭", amount: 2 }],
    seasonings: ["醤油", "バター", "みりん", "塩", "こしょう"],
    steps: [
      "鮭2切れに塩こしょうをふり、薄く薄力粉をまぶす",
      "フライパンにバター15gを中火で熱し、鮭を皮目から3〜4分焼く",
      "裏返してさらに3〜4分焼く",
      "醤油大さじ1・みりん大さじ1を加えて絡める",
      "照りが出たら盛り付けて完成。きのこや玉ねぎを一緒に焼いても美味しい",
    ],
  },
  {
    id: 124, name: "鶏肉のハニーマスタード風焼き", kcal: 400, time: 20, moods: ["sappari", "gatsuri"],
    ingredients: [{ name: "鶏肉", amount: 300 }],
    seasonings: ["醤油", "みりん", "砂糖", "サラダ油", "にんにく(チューブ)"],
    steps: [
      "鶏肉300gは一口大に切り、塩こしょう少々をふる",
      "醤油大さじ1・みりん大さじ1・砂糖大さじ1(はちみつ代わり)・にんにくチューブ1cmを合わせてタレを作る",
      "鶏肉をタレに10分漬け込む",
      "フライパンにサラダ油大さじ1/2を熱し、鶏肉を皮目から中火で4〜5分焼く",
      "裏返してふたをし、弱火で5〜6分蒸し焼きにして照りが出るまでタレを絡めたら完成",
    ],
  },
  {
    id: 125, name: "豚肉のみそ漬け焼き", kcal: 420, time: 25, moods: ["jitan", "gatsuri"],
    ingredients: [{ name: "豚肉", amount: 250 }],
    seasonings: ["味噌", "みりん", "砂糖", "酒", "ごま油"],
    steps: [
      "豚肉250gは厚め(1〜1.5cm)のロース肉を使う",
      "味噌大さじ2・みりん大さじ1・砂糖大さじ1/2・酒大さじ1・ごま油小さじ1を合わせてみそタレを作る",
      "豚肉の両面にみそタレを塗り、冷蔵庫で最低30分(できれば半日)漬け込む",
      "フライパンを中火で熱し、みそタレを軽くふき取った豚肉を並べる",
      "ふたをして弱火で6〜7分、裏返してさらに5〜6分焼いて中まで火を通したら完成",
    ],
  },
  {
    id: 126, name: "なすの田楽焼き", kcal: 180, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "なす", amount: 3 }],
    seasonings: ["味噌", "みりん", "砂糖", "ごま油"],
    steps: [
      "なす3本を縦半分に切り、皮目に格子状の切り込みを入れる",
      "味噌大さじ2・みりん大さじ1・砂糖大さじ1を合わせて田楽みそを作る",
      "フライパンにごま油大さじ1を熱し、なすを切り口を下にして中火で3〜4分焼く",
      "裏返して皮目を2〜3分焼く",
      "なすが柔らかくなったら切り口に田楽みそを塗り、オーブントースターで2〜3分焼いたら完成",
    ],
  },
  {
    id: 127, name: "厚揚げの照り焼き", kcal: 250, time: 12, moods: ["jitan", "sappari"],
    ingredients: [{ name: "厚揚げ", amount: 1 }],
    seasonings: ["醤油", "みりん", "砂糖", "ごま油"],
    steps: [
      "厚揚げ1個を食べやすい大きさ(1.5cm厚さ)に切る",
      "フライパンにごま油大さじ1/2を熱し、厚揚げを中火で両面2〜3分ずつ焼いて焼き色をつける",
      "醤油大さじ1・みりん大さじ1・砂糖小さじ1/2を合わせたタレを加える",
      "タレをからめながら2〜3分炒め煮にして照りを出す",
      "器に盛り、ねぎや七味唐辛子(あれば)をふって完成",
    ],
  },
  {
    id: 128, name: "鶏肉のオーブン焼き", kcal: 450, time: 35, moods: ["gatsuri", "attaka"],
    ingredients: [
      { name: "鶏肉", amount: 300 }, { name: "玉ねぎ", amount: 1 }, { name: "じゃがいも", amount: 2 },
    ],
    seasonings: ["醤油", "みりん", "サラダ油", "にんにく(チューブ)", "塩", "こしょう"],
    steps: [
      "鶏肉300gは一口大、玉ねぎ1/2個はくし切り、じゃがいも2個は一口大に切る",
      "醤油大さじ2・みりん大さじ1・サラダ油大さじ1・にんにくチューブ2cm・塩こしょう少々を合わせてタレを作る",
      "鶏肉・玉ねぎ・じゃがいもをタレに15〜20分漬け込む",
      "耐熱皿に並べてオーブン(またはオーブントースター)200℃で20〜25分焼く",
      "途中で一度裏返し、鶏肉に火が通り野菜が柔らかくなったら完成",
    ],
  },
  {
    id: 129, name: "えびとブロッコリーのアヒージョ風", kcal: 280, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "えび", amount: 150 }, { name: "ブロッコリー", amount: 1 }],
    seasonings: ["塩", "こしょう", "サラダ油", "にんにく(チューブ)"],
    steps: [
      "えび150gは背わたを取る。ブロッコリー1/2個は小房に分ける",
      "小さいフライパン(またはスキレット)にサラダ油大さじ3・にんにくチューブ3cmを入れて弱火にかける",
      "にんにくの香りが出たらえびを加え、弱火で3〜4分じっくり火を通す",
      "ブロッコリーを加えてさらに3〜4分加熱する",
      "塩こしょうで味を整えて完成。バゲットがあれば一緒に",
    ],
  },
  {
    id: 130, name: "ウインナーと野菜のオーブン焼き", kcal: 300, time: 25, moods: ["jitan", "attaka"],
    ingredients: [
      { name: "ウインナー", amount: 6 }, { name: "じゃがいも", amount: 2 }, { name: "にんじん", amount: 1 },
    ],
    seasonings: ["塩", "こしょう", "サラダ油", "コンソメ"],
    steps: [
      "じゃがいも2個は一口大、にんじん1本は乱切りに切る",
      "電子レンジで4〜5分加熱して半分ほど火を通す",
      "ウインナー6本は斜めに切り込みを入れる",
      "すべてをボウルに入れ、サラダ油大さじ1・コンソメ小さじ1・塩こしょう少々を絡める",
      "耐熱皿に並べてオーブントースターまたはオーブン200℃で15〜18分焼いたら完成",
    ],
  },
  {
    id: 131, name: "ポークソテー", kcal: 400, time: 15, moods: ["jitan", "gatsuri"],
    ingredients: [{ name: "豚肉", amount: 250 }],
    seasonings: ["塩", "こしょう", "サラダ油", "にんにく(チューブ)", "醤油", "バター"],
    steps: [
      "豚肉250g(厚切りロースや肩ロース)を常温に戻す。筋切りのため端に切り込みを数か所入れる",
      "塩こしょうをしっかりふる",
      "フライパンにサラダ油大さじ1・にんにくチューブ2cmを入れて中火で熱する",
      "豚肉を入れ、押しながら強火で2〜3分焼いて焼き色をつける",
      "裏返して弱火にし、バター10gを加えてアロゼ(バターをすくいかける)しながら3〜4分焼いたら完成",
    ],
  },
  // ── 煮物 ────────────────────────────────────────
  {
    id: 132, name: "筑前煮", kcal: 320, time: 30, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "鶏肉", amount: 300 }, { name: "にんじん", amount: 1 },
      { name: "ごぼう", amount: 1 }, { name: "こんにゃく", amount: 1 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "顆粒だし", "サラダ油"],
    steps: [
      "鶏肉300gは一口大、にんじん1本は乱切り、ごぼう1/2本は斜め切りにして水にさらす。こんにゃく1枚は手でちぎって塩もみし、下茹でする",
      "フライパンにサラダ油大さじ1を熱し、鶏肉を中火で炒めて表面を焼き固める",
      "にんじん・ごぼう・こんにゃくを加えてさらに2〜3分炒める",
      "水300ml・顆粒だし小さじ1・醤油大さじ2・みりん大さじ2・砂糖大さじ1・酒大さじ1を加えて中火で沸かす",
      "落としぶたをして弱火で15〜20分、野菜が柔らかくなるまで煮たら完成",
    ],
  },
  {
    id: 133, name: "切り干し大根の煮物", kcal: 130, time: 25, moods: ["sappari", "jitan"],
    ingredients: [
      { name: "切り干し大根", amount: 30 }, { name: "にんじん", amount: 1 }, { name: "油揚げ", amount: 1 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "顆粒だし", "ごま油"],
    steps: [
      "切り干し大根30gを水で20分戻して水気をしぼる。にんじん1/3本は細切り、油揚げ1枚は熱湯で油抜きして細切りにする",
      "鍋にごま油大さじ1を熱し、切り干し大根とにんじんを中火で2〜3分炒める",
      "油揚げを加えてさっと炒め合わせる",
      "水300ml・顆粒だし小さじ1・醤油大さじ1と1/2・みりん大さじ1・砂糖小さじ1を加えて沸かす",
      "落としぶたをして弱火で10〜15分、煮汁がほぼなくなるまで煮たら完成",
    ],
  },
  {
    id: 134, name: "ひじき煮", kcal: 110, time: 25, moods: ["sappari", "jitan"],
    ingredients: [
      { name: "ひじき", amount: 20 }, { name: "にんじん", amount: 1 }, { name: "油揚げ", amount: 1 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "顆粒だし", "ごま油"],
    steps: [
      "ひじき20gを水で20〜30分戻して水気をきる。にんじん1/3本は細切り、油揚げ1枚は油抜きして細切りにする",
      "鍋にごま油大さじ1を熱し、にんじんを中火で1〜2分炒める",
      "ひじきと油揚げを加えてさっと炒め合わせる",
      "水200ml・顆粒だし小さじ1・醤油大さじ1と1/2・みりん大さじ1・砂糖小さじ1を加えて煮立てる",
      "落としぶたをして弱火で10〜12分、煮汁が少なくなるまで煮たら完成",
    ],
  },
  {
    id: 135, name: "豚の角煮", kcal: 580, time: 60, moods: ["attaka", "gatsuri"],
    ingredients: [{ name: "豚肉", amount: 400 }],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "しょうが(チューブ)"],
    steps: [
      "豚バラ400gを5cm角に切り、鍋に入れて水から茹でて沸騰後10分下茹でし、湯を捨てて洗う",
      "鍋に豚肉・水400ml・酒大さじ3・しょうがチューブ3cmを入れて沸かし、弱火で30〜40分煮る",
      "豚肉が箸で崩れるくらい柔らかくなったら、醤油大さじ3・みりん大さじ2・砂糖大さじ1を加える",
      "弱火で10〜15分、煮汁にとろみが出るまで絡めながら煮詰める",
      "器に盛り、ゆで卵や青ねぎを添えて完成。翌日は更に味が染みて美味しい",
    ],
  },
  {
    id: 136, name: "こんにゃくの炒り煮", kcal: 80, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "こんにゃく", amount: 1 }],
    seasonings: ["醤油", "みりん", "砂糖", "ごま油", "酒"],
    steps: [
      "こんにゃく1枚をスプーンなどで一口大にちぎり、塩小さじ1/2でもんで5分おき、水洗いする",
      "鍋に湯を沸かし、こんにゃくを2〜3分下茹でして水気をきる",
      "フライパンにごま油小さじ1を熱し、こんにゃくを中火で2〜3分炒って水分を飛ばす",
      "醤油大さじ1・みりん大さじ1・砂糖小さじ1・酒大さじ1を加えて炒め合わせる",
      "煮汁がほぼなくなるまで炒り煮にしたら完成。七味唐辛子をふると◎",
    ],
  },
  {
    id: 137, name: "白菜と豚肉の重ね煮", kcal: 320, time: 20, moods: ["attaka", "sappari"],
    ingredients: [{ name: "豚肉", amount: 200 }, { name: "白菜", amount: 300 }],
    seasonings: ["顆粒だし", "醤油", "酒", "塩", "ごま油"],
    steps: [
      "白菜300gを葉と芯に切り分け、4〜5cm幅に切る。豚バラ薄切り200gはそのまま使う",
      "鍋に白菜の芯→豚肉→白菜の葉の順に重ねて交互に積み重ねる",
      "水大さじ3・顆粒だし小さじ1・酒大さじ1・塩小さじ1/4を鍋の縁から注ぐ",
      "ふたをして弱火で12〜15分、白菜がしんなりするまで蒸し煮にする",
      "醤油大さじ1を加えてひと混ぜし、ごま油を数滴たらして完成。ポン酢で食べても◎",
    ],
  },
  {
    id: 138, name: "鶏肉とじゃがいもの和風煮", kcal: 380, time: 25, moods: ["attaka", "jitan"],
    ingredients: [
      { name: "鶏肉", amount: 200 }, { name: "じゃがいも", amount: 2 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "顆粒だし"],
    steps: [
      "鶏肉200gは一口大、じゃがいも2個は一口大(水にさらしてアク抜き)、玉ねぎ1/2個はくし切りにする",
      "鍋に水400ml・顆粒だし小さじ2・醤油大さじ2・みりん大さじ1・砂糖大さじ1/2・酒大さじ1を合わせて沸かす",
      "鶏肉を加えてアクを取りながら3〜4分煮る",
      "じゃがいもと玉ねぎを加えて落としぶたをし、弱中火で15分煮る",
      "落としぶたを外して煮汁を少し飛ばしながら仕上げたら完成",
    ],
  },
  // ── おでん ──────────────────────────────────────
  {
    id: 139, name: "簡単おでん", kcal: 290, time: 40, moods: ["attaka"],
    ingredients: [
      { name: "大根", amount: 10 }, { name: "じゃがいも", amount: 2 },
      { name: "卵", amount: 4 }, { name: "ちくわ", amount: 3 },
    ],
    seasonings: ["顆粒だし", "醤油", "みりん", "砂糖", "酒"],
    steps: [
      "大根10cmは2〜3cm厚さの輪切りにして面取りし、水から下茹でしておく。卵4個を固ゆでにする",
      "じゃがいも2個は皮をむいて半分に切る。ちくわ3本はそのまま使う",
      "鍋に水1L・顆粒だし大さじ1・醤油大さじ2・みりん大さじ2・砂糖小さじ1・酒大さじ2を合わせて沸かす",
      "大根・じゃがいも・ゆで卵・ちくわを加えてふたをし、弱火で20〜25分煮込む",
      "具材に出汁が染み込んだら完成。からしを添えると◎",
    ],
  },
  // ── 和の定番おかず ───────────────────────────────
  {
    id: 140, name: "ほうれん草のおひたし", kcal: 60, time: 8, moods: ["sappari", "jitan"],
    ingredients: [{ name: "ほうれん草", amount: 1 }],
    seasonings: ["醤油", "みりん", "顆粒だし"],
    steps: [
      "鍋に湯を沸かし、塩少々を加えてほうれん草1袋を根元から入れて30秒、葉ごと1〜2分ゆでる",
      "冷水に取って色止めし、水気を固くしぼる",
      "3〜4cm幅に切る",
      "醤油大さじ1・みりん小さじ1・顆粒だし少々を混ぜてたれを作る",
      "ほうれん草にたれを振りかけて和え、器に盛ったら完成。かつお節をのせると◎",
    ],
  },
  {
    id: 141, name: "小松菜のおひたし", kcal: 55, time: 8, moods: ["sappari", "jitan"],
    ingredients: [{ name: "小松菜", amount: 1 }],
    seasonings: ["醤油", "みりん", "顆粒だし", "ごま油"],
    steps: [
      "鍋に湯を沸かし、塩少々を加えて小松菜1袋を茎から入れて1〜2分ゆでる",
      "冷水に取って水気をしぼる",
      "3〜4cm幅に切る",
      "醤油大さじ1・みりん小さじ1・顆粒だし少々を混ぜてたれを作る",
      "ごま油数滴を加えて小松菜と和え、器に盛って完成",
    ],
  },
  {
    id: 142, name: "白和え", kcal: 120, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "豆腐", amount: 1 }, { name: "ほうれん草", amount: 1 }],
    seasonings: ["砂糖", "醤油", "顆粒だし", "塩"],
    steps: [
      "豆腐1/2丁をキッチンペーパーで包んで電子レンジで2分加熱し、しっかり水気をきる",
      "ほうれん草1/2袋を塩ゆでして冷水に取り、水気をしぼって3cm幅に切る",
      "豆腐を滑らかになるまで手でよくつぶす",
      "砂糖大さじ1・醤油小さじ1・顆粒だし少々・塩少々を豆腐に混ぜて和え衣を作る",
      "ほうれん草を加えてよく和え、器に盛ったら完成。白ごまを振ると◎",
    ],
  },
  {
    id: 143, name: "大根なます", kcal: 60, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "大根", amount: 8 }, { name: "にんじん", amount: 1 }],
    seasonings: ["砂糖", "塩", "醤油", "みりん"],
    steps: [
      "大根8cmとにんじん1/3本をそれぞれ細切り(千切り)にする",
      "塩小さじ1/2をふって5分おき、しんなりしたら水気をしっかりしぼる",
      "酢大さじ2・砂糖大さじ1・塩少々・醤油少々を合わせてドレッシングを作る",
      "大根とにんじんにドレッシングを和える",
      "冷蔵庫で30分以上おいて味をなじませたら完成。酸っぱさは酢の量で調整",
    ],
  },
  {
    id: 144, name: "きゅうりの浅漬け", kcal: 50, time: 10, moods: ["sappari", "jitan"],
    ingredients: [{ name: "きゅうり", amount: 2 }],
    seasonings: ["塩", "砂糖", "醤油", "みりん"],
    steps: [
      "きゅうり2本を薄い輪切り(またはめん棒で叩いて割ってもOK)にする",
      "塩小さじ1/2をまぶして5〜10分おき、水気が出たら軽くしぼる",
      "醤油小さじ1・砂糖小さじ1・みりん小さじ1を混ぜてたれを作る",
      "きゅうりとたれを混ぜ合わせる",
      "冷蔵庫で30分以上漬けたら完成。しょうがやごまを添えても◎",
    ],
  },
  {
    id: 145, name: "揚げ出し豆腐", kcal: 220, time: 15, moods: ["jitan", "sappari"],
    ingredients: [{ name: "豆腐", amount: 1 }],
    seasonings: ["醤油", "みりん", "顆粒だし", "サラダ油"],
    steps: [
      "豆腐1丁をキッチンペーパーで包み15〜20分水切りし、6〜8等分に切る",
      "片栗粉を薄くまんべんなくまぶす",
      "フライパンにサラダ油を1cm深さに入れて中火で熱し、豆腐を全面こんがりきつね色に揚げる",
      "鍋に水150ml・顆粒だし小さじ1・醤油大さじ1・みりん大さじ1を合わせて沸かしてつゆを作る",
      "揚げた豆腐を器に盛り、熱々のつゆをかけ、ねぎやおろし大根をのせて完成",
    ],
  },
  {
    id: 146, name: "卵の醤油漬け", kcal: 110, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "卵", amount: 4 }],
    seasonings: ["醤油", "みりん", "砂糖"],
    steps: [
      "卵4個を沸騰した湯に入れ、7〜8分ゆでて半熟状にし、冷水で冷やして殻をむく",
      "醤油大さじ2・みりん大さじ1・砂糖小さじ1・水大さじ2を小鍋で沸かし、冷ます",
      "ビニール袋またはジッパー付き袋にゆで卵とたれを入れる",
      "冷蔵庫で最低4〜6時間(できれば一晩)漬け込む",
      "食べやすく半分に切って完成。ラーメンのトッピングにも◎",
    ],
  },
  {
    id: 147, name: "にんじんのきんぴら", kcal: 90, time: 10, moods: ["sappari", "jitan"],
    ingredients: [{ name: "にんじん", amount: 2 }],
    seasonings: ["醤油", "みりん", "砂糖", "ごま油"],
    steps: [
      "にんじん2本を細切り(千切り)にする",
      "フライパンにごま油大さじ1を熱し、にんじんを中火で2〜3分炒める",
      "醤油大さじ1・みりん大さじ1・砂糖小さじ1を加えて炒め合わせる",
      "汁気がなくなるまで2〜3分炒めて完成",
      "白ごまを振ると風味アップ。お弁当や常備菜に◎",
    ],
  },
  {
    id: 148, name: "ごぼうのごまみそあえ", kcal: 120, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "ごぼう", amount: 1 }],
    seasonings: ["味噌", "砂糖", "みりん", "ごま油"],
    steps: [
      "ごぼう1本を5〜6cm長さに切り、縦に細切りにして水にさらしてアクを抜く",
      "沸騰した湯で3〜4分ゆでてやや歯ごたえを残して湯をきる",
      "味噌大さじ1・砂糖大さじ1/2・みりん大さじ1・ごま油小さじ1を合わせてあえだれを作る",
      "ごぼうが温かいうちにあえだれと和える",
      "白ごまをたっぷりふって完成",
    ],
  },
  {
    id: 149, name: "ブロッコリーのおひたし", kcal: 80, time: 10, moods: ["sappari", "jitan"],
    ingredients: [{ name: "ブロッコリー", amount: 1 }],
    seasonings: ["醤油", "みりん", "顆粒だし"],
    steps: [
      "ブロッコリー1/2個を小房に分ける",
      "沸騰した湯に塩少々を加え、ブロッコリーを2〜3分ゆでる(電子レンジで3分でもOK)",
      "冷水に取って色止めし、水気をきる",
      "醤油大さじ1・みりん小さじ1・顆粒だし少々を混ぜてたれを作る",
      "ブロッコリーとたれをさっと和えて器に盛り、かつお節をのせて完成",
    ],
  },
  {
    id: 150, name: "豆腐の田楽", kcal: 200, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "豆腐", amount: 1 }],
    seasonings: ["味噌", "みりん", "砂糖", "ごま油", "サラダ油"],
    steps: [
      "豆腐1丁をキッチンペーパーで包んで10〜15分水切りし、2〜3cm厚さに切る",
      "味噌大さじ2・みりん大さじ1・砂糖大さじ1を合わせて田楽みそを作る",
      "フライパンにサラダ油大さじ1を熱し、豆腐を中火で両面2〜3分ずつ焼いて焼き色をつける",
      "豆腐の上面に田楽みそを塗る",
      "オーブントースターで2〜3分焼いてみそに軽く焼き色がついたら完成",
    ],
  },
  {
    id: 151, name: "油揚げの甘辛煮", kcal: 180, time: 12, moods: ["sappari", "jitan"],
    ingredients: [{ name: "油揚げ", amount: 3 }],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "顆粒だし"],
    steps: [
      "油揚げ3枚に熱湯をかけて油抜きし、1〜2cm幅の短冊切りにする",
      "小鍋に水100ml・顆粒だし小さじ1/2・醤油大さじ1・みりん大さじ1・砂糖小さじ1・酒大さじ1を合わせて沸かす",
      "油揚げを加えて中火で3〜4分、煮汁が半分以下になるまで煮る",
      "弱火にして汁気がほぼなくなるまで煮詰める",
      "冷ましながら味を含ませたら完成。うどんやそうめんのトッピングにも使える",
    ],
  },
  {
    id: 152, name: "鶏肉と大根の甘辛煮", kcal: 290, time: 25, moods: ["attaka", "sappari"],
    ingredients: [{ name: "鶏肉", amount: 200 }, { name: "大根", amount: 10 }],
    seasonings: ["醤油", "みりん", "砂糖", "酒", "顆粒だし", "しょうが(チューブ)"],
    steps: [
      "鶏肉200gは一口大、大根10cmは半月切りにして電子レンジで3〜4分加熱する",
      "フライパンで鶏肉を中火で2〜3分炒めて表面を焼き固める",
      "大根を加えてさっと炒め合わせる",
      "水200ml・顆粒だし小さじ1・醤油大さじ2・みりん大さじ1・砂糖大さじ1/2・酒大さじ1・しょうがチューブ1cmを加えて沸かす",
      "落としぶたをして弱火で12〜15分、煮汁がとろっとするまで煮たら完成",
    ],
  },
  {
    id: 153, name: "なすのみそ煮", kcal: 140, time: 15, moods: ["sappari", "jitan"],
    ingredients: [{ name: "なす", amount: 3 }],
    seasonings: ["味噌", "みりん", "砂糖", "サラダ油", "酒", "しょうが(チューブ)"],
    steps: [
      "なす3本を一口大の乱切りにし、水に5分さらしてアクを抜いて水気をきる",
      "フライパンにサラダ油大さじ1を熱し、なすを中火で3〜4分炒める",
      "なすが柔らかくなってきたら酒大さじ1・水大さじ2を加えて蒸し炒めにする",
      "味噌大さじ1と1/2・みりん大さじ1・砂糖小さじ1・しょうがチューブ1cmを合わせて加える",
      "なすにみそが絡まるように2〜3分炒め煮にしたら完成",
    ],
  },
  {
    id: 154, name: "ガパオライス", kcal: 490, time: 15, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "鶏肉", amount: 200 }, { name: "玉ねぎ", amount: 1 },
      { name: "ごはん", amount: 2 }, { name: "ピーマン", amount: 2 },
    ],
    seasonings: ["醤油", "ごま油", "砂糖", "にんにく(チューブ)", "しょうが(チューブ)", "サラダ油"],
    steps: [
      "鶏肉200gをひき肉状に細かく切る。玉ねぎ1個・ピーマン2個をみじん切りにする",
      "フライパンにサラダ油大さじ1・にんにくチューブ2cm・しょうがチューブ1cmを入れて中火で炒める",
      "鶏肉を加えて色が変わるまで炒め、玉ねぎ・ピーマンを加えてさらに炒める",
      "醤油大さじ2・ごま油小さじ1・砂糖小さじ1を加えて全体に絡める",
      "ごはんの上に盛り付け、目玉焼きをのせたら完成",
    ],
  },
  {
    id: 155, name: "グリーンカレー風スープ", kcal: 400, time: 20, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "鶏肉", amount: 200 }, { name: "玉ねぎ", amount: 1 }, { name: "牛乳", amount: 400 },
    ],
    seasonings: ["顆粒だし", "塩", "こしょう", "にんにく(チューブ)", "しょうが(チューブ)"],
    steps: [
      "鶏肉200gを一口大に切る。玉ねぎ1個を薄切りにする",
      "鍋にサラダ油を熱し、にんにくチューブ2cm・しょうがチューブ1cmを炒める",
      "玉ねぎを加えて透明になるまで炒め、鶏肉を加えて表面を焼く",
      "牛乳400ml・水200ml・顆粒だし小さじ1を加えて中火で10分煮る",
      "塩・こしょうで味を調えてカレー粉（あれば）を加えたら完成",
    ],
  },
  {
    id: 156, name: "フォー風スープ麺", kcal: 390, time: 15, moods: ["sappari", "attaka"],
    ingredients: [
      { name: "中華麺", amount: 2 }, { name: "鶏肉", amount: 150 },
      { name: "もやし", amount: 1 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["鶏ガラスープの素", "塩", "こしょう", "しょうが(チューブ)"],
    steps: [
      "鶏肉150gを細切りにし、水から入れて茹でる。茹で汁はスープに使う",
      "茹で汁に鶏ガラスープの素大さじ1・しょうがチューブ2cm・塩少々を加えてスープを作る",
      "もやしをスープに加えて1〜2分煮る",
      "別鍋で中華麺を表示通り茹でて器に盛る",
      "スープと具を注ぎ、ねぎの薄切りをのせたら完成",
    ],
  },
  {
    id: 157, name: "ビビンバ", kcal: 580, time: 20, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "ひき肉", amount: 150 }, { name: "ごはん", amount: 2 },
      { name: "にんじん", amount: 1 }, { name: "ほうれん草", amount: 1 }, { name: "卵", amount: 2 },
    ],
    seasonings: ["醤油", "ごま油", "砂糖", "酒", "塩", "こしょう"],
    steps: [
      "ひき肉150gを醤油大さじ1・砂糖小さじ1・酒大さじ1・ごま油小さじ1で炒める",
      "にんじん1本を千切りにし、ごま油で炒めて塩少々で味付けする",
      "ほうれん草を茹でて水気を絞り、醤油少々・ごま油少々で和える",
      "卵は目玉焼きにする",
      "丼にごはんを盛り、肉・野菜・目玉焼きをのせてごま油を回しかけたら完成",
    ],
  },
  {
    id: 158, name: "プルコギ", kcal: 410, time: 15, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "牛肉", amount: 200 }, { name: "玉ねぎ", amount: 1 }, { name: "にら", amount: 1 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "ごま油", "にんにく(チューブ)", "酒"],
    steps: [
      "牛肉200gを醤油大さじ2・みりん大さじ1・砂糖大さじ1・酒大さじ1・にんにくチューブ2cm・ごま油小さじ1に15分漬ける",
      "玉ねぎ1個を薄切り、にら1袋を4cm長さに切る",
      "フライパンを中火で熱し、玉ねぎを炒める",
      "牛肉をたれごと加えて炒め、火が通ったらにらを加えてさっと炒める",
      "全体に照りが出たら完成",
    ],
  },
  {
    id: 159, name: "ナシゴレン風炒飯", kcal: 500, time: 12, moods: ["jitan", "gatsuri"],
    ingredients: [
      { name: "ごはん", amount: 2 }, { name: "卵", amount: 2 },
      { name: "えび", amount: 100 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["醤油", "ごま油", "塩", "こしょう", "サラダ油", "にんにく(チューブ)"],
    steps: [
      "えび100gを下処理して食べやすい大きさに切る。玉ねぎ1個をみじん切りにする",
      "フライパンにサラダ油大さじ1・にんにくチューブ1cmを熱し、玉ねぎを炒める",
      "えびを加えて炒め、ごはんを加えてほぐしながら炒める",
      "卵を割り入れて全体に混ぜ込みながら炒める",
      "醤油大さじ1・塩少々・こしょう少々・ごま油小さじ1で味付けして完成",
    ],
  },
  {
    id: 160, name: "サムゲタン風スープ", kcal: 280, time: 30, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "鶏肉", amount: 300 }, { name: "ねぎ", amount: 1 }, { name: "にんじん", amount: 1 },
    ],
    seasonings: ["顆粒だし", "塩", "こしょう", "ごま油", "しょうが(チューブ)", "酒"],
    steps: [
      "鶏肉300gを一口大に切り、酒大さじ1・しょうがチューブ2cmで下味をつける",
      "鍋に水800ml・にんじん（乱切り）・鶏肉を入れて中火にかける",
      "アクを取りながら20分煮る",
      "顆粒だし小さじ1・塩小さじ1/2・こしょう少々で味を調える",
      "ごま油小さじ1を回しかけ、ねぎの薄切りをのせたら完成",
    ],
  },
  {
    id: 161, name: "回鍋肉", kcal: 420, time: 15, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "豚肉", amount: 200 }, { name: "キャベツ", amount: 300 }, { name: "ピーマン", amount: 3 },
    ],
    seasonings: ["味噌", "醤油", "みりん", "砂糖", "ごま油", "にんにく(チューブ)", "サラダ油"],
    steps: [
      "豚肉200gを食べやすい大きさに切る。キャベツ300gをざく切り、ピーマン3個を細切りにする",
      "タレを作る：味噌大さじ2・醤油大さじ1・みりん大さじ1・砂糖小さじ1を混ぜる",
      "フライパンにサラダ油大さじ1・にんにくチューブ2cmを熱し、豚肉を炒める",
      "キャベツ・ピーマンを加えてしんなりするまで炒める",
      "タレを加えて全体に絡め、ごま油小さじ1を回しかけたら完成",
    ],
  },
  {
    id: 162, name: "酢豚", kcal: 460, time: 25, moods: ["sappari", "gatsuri"],
    ingredients: [
      { name: "豚肉", amount: 200 }, { name: "玉ねぎ", amount: 1 }, { name: "にんじん", amount: 1 },
    ],
    seasonings: ["醤油", "砂糖", "サラダ油", "酒", "鶏ガラスープの素", "塩", "こしょう"],
    steps: [
      "豚肉200gを一口大に切り、醤油大さじ1・酒大さじ1・塩こしょうで下味をつけて片栗粉をまぶす",
      "玉ねぎ1個をくし切り、にんじん1本を乱切りにする",
      "豚肉を170℃の油で揚げる（または多めの油で揚げ焼きにする）",
      "甘酢ダレ：醤油大さじ2・砂糖大さじ3・酢大さじ3・鶏ガラスープの素小さじ1・水100mlを煮立てる",
      "炒めた野菜と揚げた豚肉をダレで絡めたら完成",
    ],
  },
  {
    id: 163, name: "牛肉とブロッコリーの中華炒め", kcal: 380, time: 15, moods: ["jitan", "gatsuri"],
    ingredients: [
      { name: "牛肉", amount: 200 }, { name: "ブロッコリー", amount: 1 },
    ],
    seasonings: ["醤油", "みりん", "砂糖", "ごま油", "にんにく(チューブ)", "酒", "鶏ガラスープの素"],
    steps: [
      "牛肉200gを食べやすく切り、醤油大さじ1・酒大さじ1で下味をつける",
      "ブロッコリー1個を小房に分けて2分茹でる",
      "フライパンにごま油大さじ1・にんにくチューブ2cmを熱し、牛肉を炒める",
      "ブロッコリーを加えて炒め、醤油大さじ1・みりん大さじ1・砂糖小さじ1・鶏ガラスープの素小さじ1を加える",
      "全体に絡めたら完成",
    ],
  },
  {
    id: 164, name: "えびの塩炒め", kcal: 190, time: 10, moods: ["sappari", "jitan"],
    ingredients: [
      { name: "えび", amount: 200 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["塩", "こしょう", "ごま油", "鶏ガラスープの素", "酒", "にんにく(チューブ)"],
    steps: [
      "えび200gを殻と背わたを取り除き、塩こしょう・酒少々で下味をつける",
      "ねぎ1本を斜め切りにする",
      "フライパンにごま油大さじ1・にんにくチューブ1cmを熱し、ねぎを炒める",
      "えびを加えて色が変わるまで炒める",
      "鶏ガラスープの素小さじ1・塩少々・こしょう少々で味を調えたら完成",
    ],
  },
  {
    id: 165, name: "豚肉のピリ辛みそ炒め", kcal: 400, time: 12, moods: ["gatsuri", "jitan"],
    ingredients: [
      { name: "豚肉", amount: 200 }, { name: "もやし", amount: 1 }, { name: "にら", amount: 1 },
    ],
    seasonings: ["味噌", "醤油", "ごま油", "砂糖", "にんにく(チューブ)", "サラダ油"],
    steps: [
      "豚肉200gを一口大に切る。にら1袋を4cm長さに切る",
      "タレを作る：味噌大さじ2・醤油大さじ1・砂糖小さじ1・豆板醤（あれば）小さじ1/2を混ぜる",
      "フライパンにサラダ油大さじ1・にんにくチューブ2cmを熱し、豚肉を炒める",
      "もやし1袋を加えて炒め、タレを加えて全体に絡める",
      "にらを加えてさっと炒め、ごま油小さじ1を回しかけたら完成",
    ],
  },
  {
    id: 166, name: "春雨と豚肉の中華スープ", kcal: 310, time: 15, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "春雨", amount: 50 }, { name: "豚肉", amount: 150 }, { name: "ねぎ", amount: 1 },
    ],
    seasonings: ["鶏ガラスープの素", "醤油", "塩", "こしょう", "ごま油"],
    steps: [
      "春雨50gを湯で戻して食べやすい長さに切る",
      "豚肉150gを食べやすい大きさに切る。ねぎ1本を斜め切りにする",
      "鍋に水800ml・鶏ガラスープの素大さじ1を入れて中火にかける",
      "豚肉を加えてアクを取りながら5分煮る",
      "春雨・ねぎを加えて2分煮て、醤油大さじ1・塩こしょうで味を調え、ごま油小さじ1を回したら完成",
    ],
  },
  {
    id: 167, name: "ロールキャベツ", kcal: 340, time: 35, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "キャベツ", amount: 300 }, { name: "ひき肉", amount: 200 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["コンソメ", "塩", "こしょう", "バター", "サラダ油"],
    steps: [
      "キャベツの大葉を湯通しして柔らかくする",
      "ひき肉200g・玉ねぎみじん切り・塩こしょうを混ぜてタネを作る",
      "キャベツの葉にタネを包んで楊枝で留める",
      "鍋にロールキャベツを並べ、水600ml・コンソメ2個を加えて中火で20分煮る",
      "塩こしょうで味を調え、バター10gを加えてとかしたら完成",
    ],
  },
  {
    id: 168, name: "チキンドリア", kcal: 500, time: 25, moods: ["attaka", "jitan"],
    ingredients: [
      { name: "ごはん", amount: 2 }, { name: "鶏肉", amount: 200 },
      { name: "玉ねぎ", amount: 1 }, { name: "牛乳", amount: 300 },
    ],
    seasonings: ["コンソメ", "バター", "塩", "こしょう"],
    steps: [
      "鶏肉200gを一口大に切り塩こしょうする。玉ねぎ1個を薄切りにする",
      "フライパンにバター15gを溶かし、玉ねぎ・鶏肉を炒める",
      "小麦粉大さじ2を振り入れて炒め、牛乳300mlを少しずつ加えながらとろみをつける",
      "コンソメ1個・塩こしょうで味を調えてホワイトソースを作る",
      "耐熱皿にごはんを敷き、ソースをかけてチーズをのせ、オーブントースターで焼き色をつけたら完成",
    ],
  },
  {
    id: 169, name: "ビーフシチュー", kcal: 480, time: 40, moods: ["attaka", "gatsuri"],
    ingredients: [
      { name: "牛肉", amount: 300 }, { name: "じゃがいも", amount: 2 },
      { name: "にんじん", amount: 1 }, { name: "玉ねぎ", amount: 1 },
    ],
    seasonings: ["コンソメ", "バター", "塩", "こしょう", "サラダ油", "醤油"],
    steps: [
      "牛肉300gを一口大に切り塩こしょうする。野菜は乱切りにする",
      "鍋にバター10gを溶かして牛肉を焼き色がつくまで炒める",
      "玉ねぎを加えて炒め、にんじん・じゃがいもを加える",
      "水600ml・コンソメ2個を加えて中火で25分煮る",
      "市販のデミグラスソース（またはケチャップ大さじ2・醤油大さじ1）を加えてさらに10分煮たら完成",
    ],
  },
  {
    id: 170, name: "ミートボールのトマト煮", kcal: 380, time: 30, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "ひき肉", amount: 300 }, { name: "玉ねぎ", amount: 1 }, { name: "トマト", amount: 2 },
    ],
    seasonings: ["コンソメ", "塩", "こしょう", "バター", "サラダ油", "にんにく(チューブ)"],
    steps: [
      "ひき肉300g・玉ねぎみじん切り1/2個・塩こしょうを混ぜて丸める",
      "フライパンにサラダ油を熱し、ミートボールを転がしながら焼く",
      "にんにくチューブ1cm・トマト2個（角切り）を加えて炒める",
      "水200ml・コンソメ1個を加えて10分煮る",
      "バター5g・塩こしょうで味を整えたら完成",
    ],
  },
  {
    id: 171, name: "タンドリーチキン風", kcal: 350, time: 25, moods: ["sappari", "gatsuri"],
    ingredients: [
      { name: "鶏肉", amount: 400 },
    ],
    seasonings: ["塩", "こしょう", "サラダ油", "にんにく(チューブ)", "しょうが(チューブ)"],
    steps: [
      "鶏肉400gにフォークで穴を開ける",
      "塩小さじ1・こしょう少々・にんにくチューブ2cm・しょうがチューブ2cm・カレー粉大さじ1（あれば）・サラダ油大さじ1を混ぜてヨーグルト（あれば）大さじ2と合わせる",
      "鶏肉をタレに漬けて冷蔵庫で15分以上置く",
      "フライパンに皮目を下にして中火で5〜6分焼く",
      "裏返してさらに4〜5分焼いたら完成",
    ],
  },
  {
    id: 172, name: "ラタトゥイユ", kcal: 180, time: 25, moods: ["sappari", "attaka"],
    ingredients: [
      { name: "トマト", amount: 2 }, { name: "玉ねぎ", amount: 1 }, { name: "なす", amount: 2 },
    ],
    seasonings: ["コンソメ", "サラダ油", "塩", "こしょう", "にんにく(チューブ)"],
    steps: [
      "なす2本・玉ねぎ1個を乱切り、トマト2個を角切りにする",
      "フライパンにサラダ油大さじ1・にんにくチューブ1cmを熱し、玉ねぎを炒める",
      "なすを加えて炒め、トマトを加える",
      "コンソメ1個・水100mlを加えて蓋をして弱火で15分煮る",
      "塩こしょうで味を調えたら完成（翌日が一層美味しい）",
    ],
  },
  {
    id: 173, name: "チキンのマカロニグラタン", kcal: 490, time: 30, moods: ["attaka", "jitan"],
    ingredients: [
      { name: "スパゲッティ", amount: 150 }, { name: "鶏肉", amount: 200 },
      { name: "玉ねぎ", amount: 1 }, { name: "牛乳", amount: 400 },
    ],
    seasonings: ["コンソメ", "バター", "塩", "こしょう"],
    steps: [
      "スパゲッティ150gを短く折って表示時間通り茹でる",
      "鶏肉200gを一口大に切り、玉ねぎ1個を薄切りにする",
      "フライパンにバター20gを溶かし、玉ねぎ・鶏肉を炒める",
      "小麦粉大さじ3を加えて炒め、牛乳400mlを少しずつ加えてとろみをつける",
      "コンソメ1個・塩こしょうで味付けし、茹でたパスタを混ぜて耐熱皿に入れ、チーズをのせてオーブントースターで焼いたら完成",
    ],
  },
  {
    id: 174, name: "ハッシュドポテト", kcal: 240, time: 20, moods: ["jitan", "sappari"],
    ingredients: [
      { name: "じゃがいも", amount: 3 },
    ],
    seasonings: ["塩", "こしょう", "バター", "サラダ油"],
    steps: [
      "じゃがいも3個を皮をむいてすりおろす（または細かく千切りにする）",
      "水気をよく絞り、塩少々・こしょう少々を混ぜる",
      "小判型に成形する",
      "フライパンにサラダ油大さじ1・バター5gを中火で熱し、両面を3〜4分ずつ焼く",
      "こんがり焼き色がついたら完成",
    ],
  },
  {
    id: 175, name: "鮭のクリーム煮", kcal: 350, time: 20, moods: ["attaka", "sappari"],
    ingredients: [
      { name: "鮭", amount: 2 }, { name: "玉ねぎ", amount: 1 }, { name: "牛乳", amount: 300 },
    ],
    seasonings: ["コンソメ", "バター", "塩", "こしょう", "醤油"],
    steps: [
      "鮭2切れに塩こしょうをして小麦粉を薄くまぶす",
      "玉ねぎ1個を薄切りにする",
      "フライパンにバター15gを溶かし、鮭を両面焼いて取り出す",
      "同じフライパンで玉ねぎを炒め、小麦粉大さじ1を振り入れて炒め、牛乳300mlを加える",
      "コンソメ1個・醤油小さじ1・塩こしょうでソースを作り、鮭を戻して2〜3分煮たら完成",
    ],
  },
];

const isQuantifiable = (name) => Object.prototype.hasOwnProperty.call(DEFAULT_QTY, name);

const formatDayKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

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
  { page: "history",  label: "履歴",          icon: History,      tab: "list" },
  { page: "history",  label: "カレンダー",    icon: CalendarDays, tab: "calendar" },
  { page: "data",     label: "データ管理",    icon: HardDrive },
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
  const [shoppingList, setShoppingList] = useState(() =>
    LS.get("shoppingList", []).map((item) =>
      typeof item === "string" ? { text: item, bought: false } : item
    )
  );
  const [shoppingInput, setShoppingInput] = useState("");
  const [shoppingMemo, setShoppingMemo] = useState(() => LS.get("shoppingMemo", ""));
  const [ratings, setRatings] = useState(() => LS.get("ratings", {}));
  const [currentPage, setCurrentPage] = useState("main");
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [mainMode, setMainMode] = useState("fridge");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTags, setSearchTags] = useState(new Set());
  const [recipeImages, setRecipeImages] = useState(() => {
    const cached = LS.get(UNSPLASH_CACHE_KEY, null);
    if (cached && Date.now() - cached.fetchedAt < UNSPLASH_CACHE_TTL) return cached.images;
    return {};
  });
  const [historyView, setHistoryView] = useState("list");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState(null);

  const fileInputRef = useRef(null);
  const pendingUidRef = useRef(null);
  const importFileRef = useRef(null);

  useEffect(() => { LS.set("fridge", fridge); }, [fridge]);
  useEffect(() => { LS.set("pantry", [...pantry]); }, [pantry]);
  useEffect(() => { LS.set("servings", servings); }, [servings]);
  useEffect(() => { LS.set("history", history.map((h) => ({ ...h, at: h.at.toISOString() }))); }, [history]);
  useEffect(() => { LS.set("shoppingList", shoppingList); }, [shoppingList]);
  useEffect(() => { LS.set("shoppingMemo", shoppingMemo); }, [shoppingMemo]);
  useEffect(() => { LS.set("ratings", ratings); }, [ratings]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!apiKey) return;
    const cached = LS.get(UNSPLASH_CACHE_KEY, null);
    if (cached && Date.now() - cached.fetchedAt < UNSPLASH_CACHE_TTL) return;

    const fetchAll = async () => {
      const pairs = await Promise.all(
        Object.entries(RECIPE_SEARCH_TERMS).map(async ([id, term]) => {
          try {
            const res = await fetch(
              `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=1&orientation=landscape&content_filter=high`,
              { headers: { Authorization: `Client-ID ${apiKey}` } }
            );
            if (!res.ok) return null;
            const data = await res.json();
            const photo = data.results?.[0];
            if (!photo?.urls?.small) return null;
            return [id, {
              url: photo.urls.small,
              photographer: photo.user.name,
              photographerUrl: `${photo.user.links.html}?utm_source=kyou_no_gohan&utm_medium=referral`,
              unsplashUrl: `${photo.links.html}?utm_source=kyou_no_gohan&utm_medium=referral`,
            }];
          } catch {
            return null;
          }
        })
      );
      const images = Object.fromEntries(pairs.filter(Boolean));
      setRecipeImages(images);
      LS.set(UNSPLASH_CACHE_KEY, { fetchedAt: Date.now(), images });
    };
    fetchAll();
  }, []);

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

  const addToShoppingList = (text) => {
    setShoppingList((prev) =>
      prev.some((i) => i.text === text) ? prev : [...prev, { text, bought: false }]
    );
  };

  const addAllMissingToShopping = (details) => {
    details.filter((d) => d.status !== "ok").forEach((d) => addToShoppingList(d.name));
  };

  const removeFromShoppingList = (text) => {
    setShoppingList((prev) => prev.filter((i) => i.text !== text));
  };

  const toggleBought = (text) => {
    setShoppingList((prev) =>
      prev.map((i) => i.text === text ? { ...i, bought: !i.bought } : i)
    );
  };

  const addShoppingItem = () => {
    const value = shoppingInput.trim();
    if (value && !shoppingList.some((i) => i.text === value)) {
      setShoppingList((prev) => [...prev, { text: value, bought: false }]);
    }
    setShoppingInput("");
  };

  const rateRecipe = (recipeId, type) => {
    setRatings((prev) => {
      if (prev[recipeId] === type) {
        const next = { ...prev };
        delete next[recipeId];
        return next;
      }
      return { ...prev, [recipeId]: type };
    });
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

  const navigate = (page, tab) => {
    setCurrentPage(page);
    if (tab) { setHistoryView(tab); setSelectedDay(null); }
    setSideMenuOpen(false);
  };

  const exportData = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      fridge,
      pantry: [...pantry],
      servings,
      history: history.map((h) => ({ ...h, at: h.at.toISOString() })),
      shoppingList,
      shoppingMemo,
      ratings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gohan-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!window.confirm("現在のデータをすべて上書きして復元しますか？")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.fridge !== undefined) setFridge(data.fridge);
        if (data.pantry !== undefined) setPantry(new Set(data.pantry));
        if (data.servings !== undefined) setServings(data.servings);
        if (data.history !== undefined) {
          let t = 0;
          setHistory(data.history.map((h) => ({ ...h, uid: h.uid ?? --t, at: new Date(h.at) })));
        }
        if (data.shoppingList !== undefined) {
          setShoppingList(data.shoppingList.map((item) =>
            typeof item === "string" ? { text: item, bought: false } : item
          ));
        }
        if (data.shoppingMemo !== undefined) setShoppingMemo(data.shoppingMemo);
        if (data.ratings !== undefined) setRatings(data.ratings);
        alert("復元が完了しました");
      } catch {
        alert("読み込みに失敗しました。正しいバックアップファイルか確認してください。");
      }
    };
    reader.readAsText(file);
  };

  const sortedRecipes = useMemo(() => {
    const factor = servings / 2;
    const karaito = moodFilter === "karaito";
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
      coverage += useSoonHit * (karaito ? 0.7 : 0.25);
      if (recentIds.has(r.id)) coverage *= 0.4;
      const myRating = ratings[r.id];
      coverage = Math.max(0, coverage + (myRating === "good" ? 0.1 : myRating === "bad" ? -0.1 : 0));
      const okCount = details.filter((d) => d.status === "ok").length;
      return { ...r, details, missingSeasonings, coverage, okCount, useSoonHit, displayKcal: Math.round(r.kcal * factor) };
    })
      .filter((r) => r.okCount > 0 || r.details.some((d) => d.status === "insufficient"))
      .filter((r) => (moodFilter && !karaito ? r.moods.includes(moodFilter) : true))
      .sort((a, b) => b.coverage - a.coverage || a.time - b.time);
  }, [fridge, pantry, servings, moodFilter, useSoon, history, ratings]);

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const factor = servings / 2;
    return RECIPES
      .filter((r) => {
        if (q) {
          const nameMatch = r.name.toLowerCase().includes(q);
          const ingMatch = r.ingredients.some((i) => i.name.toLowerCase().includes(q));
          if (!nameMatch && !ingMatch) return false;
        }
        if (searchTags.size > 0) {
          const ingNames = new Set(r.ingredients.map((i) => i.name));
          if (![...searchTags].some((t) => ingNames.has(t))) return false;
        }
        return true;
      })
      .map((r) => {
        const details = r.ingredients.map((ing) => {
          const required = Math.max(1, Math.round(ing.amount * factor));
          const have = fridge[ing.name] || 0;
          let status;
          if (have <= 0) status = "missing";
          else if (have >= required) status = "ok";
          else status = "insufficient";
          return { ...ing, have, required, status };
        });
        return { ...r, details, displayKcal: Math.round(r.kcal * factor) };
      });
  }, [searchQuery, searchTags, fridge, servings]);

  const historyByDay = useMemo(() => {
    const map = {};
    history.forEach((h) => {
      const key = formatDayKey(h.at);
      if (!map[key]) map[key] = [];
      map[key].push(h);
    });
    return map;
  }, [history]);

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

          {/* ホームへ戻る */}
          <button onClick={() => navigate("main")}
            className="chalk-btn w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-sm font-bold"
            style={{
              backgroundColor: currentPage === "main" ? COLORS.surfaceAlt : "transparent",
              color: currentPage === "main" ? COLORS.accent : COLORS.chalk,
              textAlign: "left",
            }}>
            <Home size={17} style={{ color: currentPage === "main" ? COLORS.accent : COLORS.muted, flexShrink: 0 }} />
            <span style={{ flex: 1 }}>ホーム</span>
          </button>
          <div style={{ height: "1px", backgroundColor: COLORS.border, margin: "0.5rem 0 0.75rem" }} />

          {NAV_ITEMS.map(({ page, label, icon: Icon, tab }) => {
            const badge =
              page === "pantry" ? `${pantry.size}種類` :
              page === "shopping" && shoppingList.length > 0 ? `${shoppingList.length}件` :
              page === "history" && tab === "list" && history.length > 0 ? `${history.length}件` : null;
            const active = currentPage === page && (!tab || historyView === tab);
            return (
              <button key={label} onClick={() => navigate(page, tab)}
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

      {/* Fixed top header bar — back button (left) + hamburger (right) */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 45,
        height: "3.5rem",
        backgroundColor: COLORS.bg,
        borderBottom: `1px solid ${COLORS.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1rem",
      }}>
        {/* Left: back button on sub-pages, empty spacer on main */}
        {currentPage !== "main" ? (
          <button onClick={() => setCurrentPage("main")}
            className="chalk-btn"
            aria-label="ホームに戻る"
            style={{
              height: "2.2rem", padding: "0 0.75rem",
              backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
              borderRadius: "0.5rem",
              display: "flex", alignItems: "center", gap: "0.2rem",
            }}>
            <ChevronLeft size={15} style={{ color: COLORS.chalk }} />
            <span style={{ fontSize: "0.8rem", color: COLORS.chalk, fontFamily: BODY_FONT }}>ホーム</span>
          </button>
        ) : (
          <div style={{ width: "2.2rem" }} />
        )}

        {/* Right: hamburger */}
        <button onClick={() => setSideMenuOpen(true)}
          className="chalk-btn"
          aria-label="メニューを開く"
          style={{
            width: "2.2rem", height: "2.2rem",
            backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: "0.5rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          <Menu size={17} style={{ color: COLORS.chalk }} />
        </button>
      </div>

      {/* Page content */}
      <div className="max-w-md mx-auto px-5" style={{ paddingTop: "5rem", paddingBottom: "3rem" }}>

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

            {/* モード切り替えトグル */}
            <div style={{ display: "flex", backgroundColor: COLORS.surface, borderRadius: "0.75rem", border: `1px solid ${COLORS.border}`, padding: "0.25rem", marginBottom: "1.5rem" }}>
              {[
                { mode: "fridge", icon: "🧊", label: "冷蔵庫モード" },
                { mode: "search", icon: "🔍", label: "レシピを探す" },
              ].map(({ mode, icon, label }) => (
                <button key={mode} onClick={() => setMainMode(mode)} className="chalk-btn flex-1"
                  style={{
                    padding: "0.6rem 0.5rem", borderRadius: "0.5rem",
                    backgroundColor: mainMode === mode ? COLORS.accent : "transparent",
                    color: mainMode === mode ? COLORS.bg : COLORS.muted,
                    fontWeight: mainMode === mode ? 700 : 400,
                    fontSize: "0.85rem",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                  }}>
                  {icon} {label}
                </button>
              ))}
            </div>

            {mainMode === "fridge" && (<>

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
              <div className="flex gap-2 mb-2">
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
              <button
                onClick={() => setMoodFilter(moodFilter === "karaito" ? null : "karaito")}
                className="chip chalk-btn w-full py-2 rounded-lg text-sm border"
                style={{
                  backgroundColor: moodFilter === "karaito" ? COLORS.surfaceAlt : "transparent",
                  color: moodFilter === "karaito" ? COLORS.accent : COLORS.muted,
                  borderColor: moodFilter === "karaito" ? COLORS.accent : COLORS.border,
                  borderStyle: "dashed",
                  fontWeight: moodFilter === "karaito" ? 700 : 400,
                }}>
                🧹 冷蔵庫を空にしたい（⏰食材を強く優先）
              </button>
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
                  const emoji = RECIPE_EMOJIS[recipe.id] || "🍽️";
                  const gradient = CARD_GRADIENTS[recipe.id % CARD_GRADIENTS.length];
                  const myRating = ratings[recipe.id];
                  const photo = recipeImages[String(recipe.id)];
                  return (
                    <section key={recipe.id} className="fade-up rounded-2xl overflow-hidden"
                      style={{
                        border: `2px solid ${isTop ? COLORS.accent : COLORS.border}`,
                        animationDelay: `${index * 0.08}s`,
                      }}>

                      {/* カラーヘッダー */}
                      <div style={{
                        background: photo ? `url(${photo.url}) center/cover no-repeat` : gradient,
                        padding: "1.25rem", position: "relative", overflow: "hidden",
                        minHeight: photo ? "170px" : undefined,
                      }}>
                        {photo && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.72) 100%)" }} />}
                        {!photo && (
                          <div aria-hidden="true" style={{
                            position: "absolute", right: "-0.25rem", top: "-0.75rem",
                            fontSize: "7rem", lineHeight: 1, opacity: 0.1,
                            pointerEvents: "none", userSelect: "none",
                          }}>{emoji}</div>
                        )}

                        {/* ラベル行 */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", position: "relative" }}>
                          <p style={{ color: isTop ? COLORS.accent : "rgba(255,255,255,0.75)", fontFamily: MONO_FONT, fontSize: "0.7rem", letterSpacing: "0.2em" }}>
                            {randomPick ? "★ 運命の一品" : isTop ? "★ 本日のおすすめ" : `候補 ${pageIndex * pageSize + index + 1}`}
                          </p>
                          {recipe.useSoonHit > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{ backgroundColor: COLORS.accent2, color: COLORS.bg }}>
                              <AlarmClock size={11} />使い切り
                            </span>
                          )}
                        </div>

                        {/* タイトル */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", position: "relative", marginBottom: "0.75rem" }}>
                          {!photo && <span style={{ fontSize: "3rem", lineHeight: 1, flexShrink: 0 }}>{emoji}</span>}
                          <h3 style={{
                            fontFamily: DISPLAY_FONT,
                            fontSize: isTop ? "1.85rem" : "1.5rem",
                            color: "#fff",
                            lineHeight: 1.2,
                            textShadow: photo ? "0 1px 4px rgba(0,0,0,0.7)" : "none",
                          }}>{recipe.name}</h3>
                        </div>

                        {/* メタ情報 */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative", marginBottom: "0.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <Flame size={14} style={{ color: COLORS.accent2 }} />
                            <span style={{ fontFamily: MONO_FONT, fontSize: "0.85rem", color: COLORS.accent2, fontWeight: 700 }}>約{recipe.displayKcal}kcal</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <Clock size={14} style={{ color: COLORS.accent }} />
                            <span style={{ fontFamily: MONO_FONT, fontSize: "0.85rem", color: COLORS.accent, fontWeight: 700 }}>約{recipe.time}分</span>
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>
                            {recipe.moods.map((m) => MOODS.find((x) => x.key === m)?.label).join("・")}
                          </span>
                        </div>

                        {photo && (
                          <p style={{ position: "relative", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem", textAlign: "right" }}>
                            Photo by{" "}
                            <a href={photo.photographerUrl} target="_blank" rel="noopener noreferrer"
                              style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline" }}>
                              {photo.photographer}
                            </a>{" "}on{" "}
                            <a href={`https://unsplash.com/?utm_source=kyou_no_gohan&utm_medium=referral`} target="_blank" rel="noopener noreferrer"
                              style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline" }}>
                              Unsplash
                            </a>
                          </p>
                        )}
                      </div>

                      {/* カードボディ */}
                      <div style={{ backgroundColor: COLORS.surface, padding: "1.25rem 1.25rem 1.5rem" }}>
                        <div className="mb-3">
                          <p className="text-xs mb-2" style={{ color: COLORS.muted }}>
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

                        {/* 評価ボタン */}
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.65rem" }}>
                          {[
                            { type: "good", icon: "👍", label: "おいしかった", activeColor: COLORS.accent, activeText: COLORS.bg },
                            { type: "bad",  icon: "👎", label: "微妙",         activeColor: COLORS.accent2, activeText: "#fff" },
                          ].map(({ type, icon, label, activeColor, activeText }) => {
                            const isSelected = myRating === type;
                            const isDisabled = !!myRating && !isSelected;
                            return (
                              <button key={type}
                                onClick={() => rateRecipe(recipe.id, type)}
                                disabled={isDisabled}
                                className="chalk-btn flex-1"
                                style={{
                                  padding: "0.45rem 0",
                                  borderRadius: "0.5rem",
                                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem",
                                  backgroundColor: isSelected ? activeColor : COLORS.surfaceAlt,
                                  color: isSelected ? activeText : isDisabled ? COLORS.border : COLORS.muted,
                                  border: isSelected ? "none" : `1px solid ${isDisabled ? "transparent" : COLORS.border}`,
                                  fontSize: "0.8rem",
                                  fontWeight: isSelected ? 700 : 400,
                                  opacity: isDisabled ? 0.4 : 1,
                                  cursor: isDisabled ? "not-allowed" : "pointer",
                                }}>
                                <span>{icon}</span>
                                <span>{label}</span>
                              </button>
                            );
                          })}
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
                      </div>
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
            </>)}

            {/* ── SEARCH MODE ── */}
            {mainMode === "search" && (
              <div className="mb-8">
                {/* 検索入力 */}
                <div className="mb-5">
                  <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="レシピ名・食材名で検索…"
                      className="w-full rounded-xl text-sm outline-none"
                      style={{
                        backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                        color: COLORS.chalk, fontFamily: BODY_FONT,
                        padding: "0.65rem 2.5rem 0.65rem 2.75rem",
                      }}
                    />
                    <Search size={15} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: COLORS.muted, pointerEvents: "none" }} />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="chalk-btn"
                        style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)" }}>
                        <X size={14} style={{ color: COLORS.muted }} />
                      </button>
                    )}
                  </div>

                  {/* 食材タグ */}
                  <p className="text-xs mb-2" style={{ color: COLORS.muted }}>食材で絞り込む</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_INGREDIENTS.map((ing) => {
                      const active = searchTags.has(ing);
                      return (
                        <button key={ing} onClick={() => setSearchTags((prev) => {
                          const next = new Set(prev);
                          if (next.has(ing)) next.delete(ing); else next.add(ing);
                          return next;
                        })}
                          className="chip chalk-btn px-3 py-1 rounded-full text-xs border"
                          style={{
                            backgroundColor: active ? COLORS.accent : "transparent",
                            color: active ? COLORS.bg : COLORS.chalk,
                            borderColor: active ? COLORS.accent : COLORS.border,
                            fontWeight: active ? 700 : 400,
                          }}>
                          {ing}
                        </button>
                      );
                    })}
                    {searchTags.size > 0 && (
                      <button onClick={() => setSearchTags(new Set())}
                        className="chip chalk-btn px-3 py-1 rounded-full text-xs border flex items-center gap-1"
                        style={{ color: COLORS.accent2, borderColor: COLORS.accent2 }}>
                        <X size={10} />クリア
                      </button>
                    )}
                  </div>
                </div>

                {/* 検索結果 */}
                {searchQuery === "" && searchTags.size === 0 ? (
                  <p className="text-sm text-center py-10" style={{ color: COLORS.muted }}>
                    検索ワードを入力するか、<br />上の食材タグを選んでください
                  </p>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-center py-10" style={{ color: COLORS.muted }}>
                    条件に合うレシピが見つかりませんでした
                  </p>
                ) : (
                  <>
                    <p className="text-xs mb-3" style={{ color: COLORS.muted }}>{searchResults.length}件のレシピ</p>
                    <div className="flex flex-col gap-4">
                      {searchResults.map((recipe) => {
                        const open = !!expandedSteps[recipe.id];
                        const made = history.some((h) => h.id === recipe.id);
                        const emoji = RECIPE_EMOJIS[recipe.id] || "🍽️";
                        const gradient = CARD_GRADIENTS[recipe.id % CARD_GRADIENTS.length];
                        const myRating = ratings[recipe.id];
                        const missingDetails = recipe.details.filter((d) => d.status !== "ok");
                        const photo = recipeImages[String(recipe.id)];
                        return (
                          <section key={recipe.id} className="fade-up rounded-2xl overflow-hidden"
                            style={{ border: `2px solid ${COLORS.border}` }}>

                            {/* カラーヘッダー */}
                            <div style={{
                              background: photo ? `url(${photo.url}) center/cover no-repeat` : gradient,
                              padding: "1.25rem", position: "relative", overflow: "hidden",
                              minHeight: photo ? "160px" : undefined,
                            }}>
                              {photo && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.72) 100%)" }} />}
                              {!photo && <div aria-hidden="true" style={{ position: "absolute", right: "-0.25rem", top: "-0.75rem", fontSize: "7rem", lineHeight: 1, opacity: 0.1, pointerEvents: "none", userSelect: "none" }}>{emoji}</div>}

                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", position: "relative", marginBottom: "0.75rem" }}>
                                {!photo && <span style={{ fontSize: "3rem", lineHeight: 1, flexShrink: 0 }}>{emoji}</span>}
                                <h3 style={{ fontFamily: DISPLAY_FONT, fontSize: "1.5rem", color: "#fff", lineHeight: 1.2, textShadow: photo ? "0 1px 4px rgba(0,0,0,0.7)" : "none" }}>{recipe.name}</h3>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative", marginBottom: "0.75rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                  <Flame size={14} style={{ color: COLORS.accent2 }} />
                                  <span style={{ fontFamily: MONO_FONT, fontSize: "0.85rem", color: COLORS.accent2, fontWeight: 700 }}>約{recipe.displayKcal}kcal</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                  <Clock size={14} style={{ color: COLORS.accent }} />
                                  <span style={{ fontFamily: MONO_FONT, fontSize: "0.85rem", color: COLORS.accent, fontWeight: 700 }}>約{recipe.time}分</span>
                                </div>
                                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>
                                  {recipe.moods.map((m) => MOODS.find((x) => x.key === m)?.label).join("・")}
                                </span>
                              </div>

                              {photo && (
                                <p style={{ position: "relative", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem", textAlign: "right" }}>
                                  Photo by{" "}
                                  <a href={photo.photographerUrl} target="_blank" rel="noopener noreferrer"
                                    style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline" }}>
                                    {photo.photographer}
                                  </a>{" "}on{" "}
                                  <a href={`https://unsplash.com/?utm_source=kyou_no_gohan&utm_medium=referral`} target="_blank" rel="noopener noreferrer"
                                    style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline" }}>
                                    Unsplash
                                  </a>
                                </p>
                              )}
                            </div>

                            {/* ボディ */}
                            <div style={{ backgroundColor: COLORS.surface, padding: "1rem 1.25rem 1.25rem" }}>
                              <div className="mb-2">
                                <p className="text-xs mb-1.5" style={{ color: COLORS.muted }}>必要な食材({servings}人前)</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {recipe.details.map((d) => {
                                    let bg = COLORS.surfaceAlt, color = COLORS.muted, border = "none";
                                    if (d.status === "ok") { bg = COLORS.accent; color = COLORS.bg; }
                                    else if (d.status === "insufficient") { bg = "transparent"; color = COLORS.accent2; border = `1px solid ${COLORS.accent2}`; }
                                    else { bg = "transparent"; color = COLORS.muted; border = `1px solid ${COLORS.border}`; }
                                    const unit = UNITS[d.name] || "";
                                    return (
                                      <span key={d.name} className="px-2.5 py-1 rounded-full text-xs"
                                        style={{ backgroundColor: bg, color, border, fontFamily: BODY_FONT }}>
                                        {d.name} {d.required}{unit}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>

                              {recipe.seasonings.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs mb-1.5" style={{ color: COLORS.muted }}>使う調味料</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {recipe.seasonings.map((s) => {
                                      const has = pantry.has(s);
                                      return (
                                        <span key={s} className="px-2.5 py-1 rounded-full text-xs"
                                          style={{ backgroundColor: has ? COLORS.surfaceAlt : "transparent", color: has ? COLORS.chalk : COLORS.accent2, border: has ? "none" : `1px solid ${COLORS.accent2}`, fontFamily: BODY_FONT }}>
                                          {has ? s : `${s} ✕なし`}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {missingDetails.length > 0 && (
                                <button onClick={() => addAllMissingToShopping(recipe.details)}
                                  className="chalk-btn w-full py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 mb-3"
                                  style={{ backgroundColor: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, color: COLORS.chalk }}>
                                  <ShoppingCart size={14} />
                                  足りない食材をまとめて買い物リストへ ({missingDetails.length}件)
                                </button>
                              )}

                              <div className="flex gap-2">
                                <button onClick={() => toggleSteps(recipe.id)}
                                  className="chalk-btn flex-1 py-2.5 rounded-lg text-sm font-bold"
                                  style={{ backgroundColor: COLORS.surfaceAlt, color: COLORS.chalk }}>
                                  {open ? "作り方を閉じる" : "作り方を見る"}
                                </button>
                                <button onClick={() => markAsMade(recipe)}
                                  className="chalk-btn flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5"
                                  style={{ backgroundColor: made ? COLORS.accent : "transparent", color: made ? COLORS.bg : COLORS.accent, border: made ? "none" : `1px solid ${COLORS.accent}` }}>
                                  <CheckCircle2 size={15} />
                                  {made ? "作った!" : "これ作った"}
                                </button>
                              </div>

                              {/* 評価ボタン */}
                              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.65rem" }}>
                                {[
                                  { type: "good", icon: "👍", label: "おいしかった", activeColor: COLORS.accent, activeText: COLORS.bg },
                                  { type: "bad",  icon: "👎", label: "微妙",         activeColor: COLORS.accent2, activeText: "#fff" },
                                ].map(({ type, icon, label, activeColor, activeText }) => {
                                  const isSelected = myRating === type;
                                  const isDisabled = !!myRating && !isSelected;
                                  return (
                                    <button key={type}
                                      onClick={() => rateRecipe(recipe.id, type)}
                                      disabled={isDisabled}
                                      className="chalk-btn flex-1"
                                      style={{
                                        padding: "0.45rem 0",
                                        borderRadius: "0.5rem",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem",
                                        backgroundColor: isSelected ? activeColor : COLORS.surfaceAlt,
                                        color: isSelected ? activeText : isDisabled ? COLORS.border : COLORS.muted,
                                        border: isSelected ? "none" : `1px solid ${isDisabled ? "transparent" : COLORS.border}`,
                                        fontSize: "0.8rem",
                                        fontWeight: isSelected ? 700 : 400,
                                        opacity: isDisabled ? 0.4 : 1,
                                        cursor: isDisabled ? "not-allowed" : "pointer",
                                      }}>
                                      <span>{icon}</span>
                                      <span>{label}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {open && (
                                <>
                                  <p className="text-xs mt-3 mb-2" style={{ color: COLORS.muted }}>※分量は2人前基準。人数に合わせて調整してね</p>
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
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
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
                  <div key={item.text} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: COLORS.surface,
                      border: `1px solid ${item.bought ? COLORS.border : COLORS.border}`,
                      opacity: item.bought ? 0.5 : 1,
                      transition: "opacity 0.2s ease",
                    }}>
                    <button onClick={() => toggleBought(item.text)}
                      className="chalk-btn flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{
                        width: "1.4rem", height: "1.4rem",
                        border: `2px solid ${item.bought ? COLORS.accent : COLORS.muted}`,
                        backgroundColor: item.bought ? COLORS.accent : "transparent",
                      }}
                      aria-label={item.bought ? "未購入に戻す" : "購入済みにする"}>
                      {item.bought && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke={COLORS.bg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <span className="text-sm flex-1"
                      style={{ textDecoration: item.bought ? "line-through" : "none", color: COLORS.chalk }}>
                      {item.text}
                    </span>
                    <button onClick={() => removeFromShoppingList(item.text)}
                      className="chalk-btn flex-shrink-0" aria-label={`${item.text}をリストから削除`}>
                      <X size={15} style={{ color: COLORS.muted }} />
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
            <div className="flex items-center gap-2 mb-4">
              <History size={20} style={{ color: COLORS.accent }} />
              <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: "2rem", color: COLORS.chalk }}>作ったごはんの記録</h1>
            </div>

            {/* 表示切り替えタブ */}
            <div style={{ display: "flex", backgroundColor: COLORS.surface, borderRadius: "0.75rem", border: `1px solid ${COLORS.border}`, padding: "0.25rem", marginBottom: "1.25rem" }}>
              {[
                { view: "list", label: "📋 リスト" },
                { view: "calendar", label: "📅 カレンダー" },
              ].map(({ view, label }) => (
                <button key={view}
                  onClick={() => { setHistoryView(view); setSelectedDay(null); }}
                  className="chalk-btn flex-1"
                  style={{
                    padding: "0.55rem 0.5rem",
                    borderRadius: "0.5rem",
                    backgroundColor: historyView === view ? COLORS.accent : "transparent",
                    color: historyView === view ? COLORS.bg : COLORS.muted,
                    fontWeight: historyView === view ? 700 : 400,
                    fontSize: "0.85rem",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── リスト表示 ── */}
            {historyView === "list" && (
              history.length === 0 ? (
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
              )
            )}

            {/* ── カレンダー表示 ── */}
            {historyView === "calendar" && (
              <>
                {/* 月ナビゲーション */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <button
                    onClick={() => { setCalendarMonth((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1)); setSelectedDay(null); }}
                    className="chalk-btn px-3 py-1 rounded-lg"
                    style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, fontSize: "0.85rem", color: COLORS.chalk }}>
                    ◀
                  </button>
                  <span style={{ fontFamily: DISPLAY_FONT, fontSize: "1.1rem", color: COLORS.chalk }}>
                    {calendarMonth.getFullYear()}年{calendarMonth.getMonth() + 1}月
                  </span>
                  <button
                    onClick={() => { setCalendarMonth((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1)); setSelectedDay(null); }}
                    className="chalk-btn px-3 py-1 rounded-lg"
                    style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, fontSize: "0.85rem", color: COLORS.chalk }}>
                    ▶
                  </button>
                </div>

                {/* 曜日ヘッダー */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px", marginBottom: "3px" }}>
                  {["日","月","火","水","木","金","土"].map((d, i) => (
                    <div key={d} style={{
                      textAlign: "center",
                      fontSize: "0.68rem",
                      fontFamily: MONO_FONT,
                      color: i === 0 ? "#E07070" : i === 6 ? "#7090E0" : COLORS.muted,
                      padding: "0.2rem 0",
                    }}>{d}</div>
                  ))}
                </div>

                {/* カレンダーグリッド */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px" }}>
                  {(() => {
                    const year = calendarMonth.getFullYear();
                    const month = calendarMonth.getMonth();
                    const firstDay = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const todayKey = formatDayKey(new Date());
                    const cells = [];

                    for (let i = 0; i < firstDay; i++) {
                      cells.push(<div key={`empty-${i}`} style={{ aspectRatio: "1" }} />);
                    }

                    for (let d = 1; d <= daysInMonth; d++) {
                      const dayKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                      const records = historyByDay[dayKey] || [];
                      const isToday = dayKey === todayKey;
                      const isSelected = dayKey === selectedDay;
                      const hasRecord = records.length > 0;
                      const thumb = records.find((r) => r.photo)?.photo;

                      cells.push(
                        <button key={dayKey}
                          onClick={() => hasRecord && setSelectedDay(isSelected ? null : dayKey)}
                          style={{
                            aspectRatio: "1",
                            borderRadius: "0.4rem",
                            position: "relative",
                            overflow: "hidden",
                            border: isSelected
                              ? `2px solid ${COLORS.accent}`
                              : isToday
                              ? `2px solid ${COLORS.accent2}`
                              : hasRecord
                              ? `1px solid ${COLORS.border}`
                              : `1px solid transparent`,
                            backgroundColor: hasRecord ? COLORS.surfaceAlt : "transparent",
                            cursor: hasRecord ? "pointer" : "default",
                          }}>

                          {thumb && (
                            <img src={thumb} alt=""
                              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                          )}
                          {thumb && (
                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.22)" }} />
                          )}
                          {hasRecord && !thumb && (
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                              🍽
                            </div>
                          )}

                          <span style={{
                            position: "absolute", top: "2px", left: "3px",
                            fontSize: "0.62rem",
                            fontFamily: MONO_FONT,
                            fontWeight: isToday ? 700 : 400,
                            color: thumb ? "#fff" : isToday ? COLORS.accent : COLORS.chalk,
                            lineHeight: 1,
                            textShadow: thumb ? "0 1px 3px rgba(0,0,0,0.9)" : "none",
                          }}>{d}</span>

                          {records.length > 1 && (
                            <span style={{
                              position: "absolute", bottom: "2px", right: "2px",
                              fontSize: "0.48rem",
                              backgroundColor: COLORS.accent2, color: COLORS.bg,
                              borderRadius: "999px", padding: "1px 3px",
                              fontFamily: MONO_FONT, lineHeight: 1.4,
                            }}>{records.length}</span>
                          )}
                        </button>
                      );
                    }
                    return cells;
                  })()}
                </div>

                {/* 選択した日の詳細パネル */}
                {selectedDay && historyByDay[selectedDay] && (
                  <div className="mt-4 p-4 rounded-2xl"
                    style={{ backgroundColor: COLORS.surface, border: `2px solid ${COLORS.accent}` }}>
                    <p className="text-sm font-bold mb-3" style={{ color: COLORS.accent }}>
                      {(() => {
                        const [y, m, d] = selectedDay.split("-");
                        return `${y}年${Number(m)}月${Number(d)}日`;
                      })()}
                    </p>
                    <div className="flex flex-col gap-2">
                      {historyByDay[selectedDay].map((h) => (
                        <div key={h.uid} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                          style={{ backgroundColor: COLORS.surfaceAlt }}>
                          {h.photo ? (
                            <button onClick={() => setLightboxPhoto(h.photo)} className="flex-shrink-0" aria-label="写真を拡大">
                              <img src={h.photo} alt={h.name}
                                style={{ width: "3rem", height: "3rem", objectFit: "cover", borderRadius: "0.4rem" }} />
                            </button>
                          ) : (
                            <div className="flex-shrink-0"
                              style={{ width: "3rem", height: "3rem", borderRadius: "0.4rem", backgroundColor: COLORS.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: "1.2rem" }}>🍽</span>
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p className="text-sm font-bold truncate">{h.name}</p>
                            <p className="text-xs" style={{ color: COLORS.muted, fontFamily: MONO_FONT }}>
                              {String(h.at.getHours()).padStart(2, "0")}:{String(h.at.getMinutes()).padStart(2, "0")}
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
                  </div>
                )}

                {history.length === 0 && (
                  <p className="text-sm text-center py-8" style={{ color: COLORS.muted }}>
                    まだ料理の記録がありません
                  </p>
                )}
              </>
            )}
          </>
        )}

        {/* ── DATA ── */}
        {currentPage === "data" && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <HardDrive size={20} style={{ color: COLORS.accent }} />
              <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: "2rem", color: COLORS.chalk }}>データ管理</h1>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                <h2 className="text-sm font-bold mb-1">バックアップ(書き出し)</h2>
                <p className="text-xs mb-4" style={{ color: COLORS.muted }}>
                  調味料棚・履歴(写真含む)・買い物リスト・メモをJSONファイルとして端末に保存します。
                </p>
                <button onClick={exportData}
                  className="chalk-btn w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{ backgroundColor: COLORS.accent, color: COLORS.bg }}>
                  <Download size={16} />
                  データをダウンロード
                </button>
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                <h2 className="text-sm font-bold mb-1">復元(読み込み)</h2>
                <p className="text-xs mb-4" style={{ color: COLORS.muted }}>
                  バックアップファイルを読み込んでデータを復元します。現在のデータはすべて上書きされます。
                </p>
                <button onClick={() => importFileRef.current?.click()}
                  className="chalk-btn w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{ backgroundColor: "transparent", color: COLORS.chalk, border: `1px solid ${COLORS.border}` }}>
                  <Upload size={16} />
                  ファイルから復元
                </button>
              </div>
            </div>

            <input ref={importFileRef} type="file" accept="application/json,.json"
              onChange={handleImport} style={{ display: "none" }} aria-hidden="true" />
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
