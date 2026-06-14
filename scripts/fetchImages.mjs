// Unsplash画像URLを一括取得してrecipeImages.jsonに保存するスクリプト
// npm run fetch-images で実行。1時間50リクエスト制限のため複数回実行が必要な場合あり。

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(ROOT, "src", "recipeImages.json");

// .env から APIキー読み込み
const env = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
const API_KEY = env.match(/VITE_UNSPLASH_ACCESS_KEY=(.+)/)?.[1]?.trim();
if (!API_KEY) { console.error("APIキーが見つかりません"); process.exit(1); }

// レシピIDとUnsplash検索ワードの対応（全200件）
const SEARCH_TERMS = {
  1:"miso pork stir fry japanese",2:"omelette egg dish",3:"egg fried rice japanese",
  4:"tofu soup japanese",5:"teriyaki chicken japanese",6:"steamed pork cabbage",
  7:"natto rice bowl japanese",8:"bean sprouts pork stir fry",9:"tomato egg chinese stir fry",
  10:"potato onion soup",11:"grilled salmon japanese",12:"kimchi tofu stew korean",
  13:"tuna salad fresh",14:"eggplant stir fry miso",15:"fried rice egg green onion",
  16:"nikujaga beef potato carrot stew",17:"tonjiru pork miso soup japanese",
  18:"spinach sesame salad japanese side dish",19:"yellowtail teriyaki buri japanese",
  20:"chicken egg donburi rice bowl",21:"tamagoyaki japanese rolled egg",
  22:"gyudon beef rice bowl japanese",23:"pork donburi rice bowl japanese",
  24:"mapo tofu chinese spicy",25:"fried udon noodles japanese wok",
  26:"karaage japanese fried chicken",27:"hambagu japanese hamburger steak",
  28:"kinpira gobo burdock carrot japanese",29:"nira egg chive stir fry chinese",
  30:"cream stew japanese white",31:"chicken tomato stew italian",
  32:"hiyashi chuka cold noodles summer",33:"miso ramen noodle soup bowl",
  34:"somen thin noodles japanese summer",35:"spaghetti aglio olio garlic",
  36:"scrambled tofu japanese iridofu",37:"daikon radish pork stew japanese",
  38:"potato salad japanese creamy",39:"salmon miso butter vegetable",
  40:"carrot egg stir fry okinawa",41:"saba mackerel miso simmered japanese",
  42:"sukiyaki beef napa cabbage japanese hot pot",43:"atsuage thick tofu pork sweet soy",
  44:"komatsuna spinach mustard greens egg stir fry",45:"shogayaki ginger pork japanese",
  46:"buri daikon simmered fish japanese",47:"chicken miso yaki japanese grilled",
  48:"napa cabbage tofu chinese soup",49:"soboro don chicken minced rice bowl",
  50:"butakimchi pork kimchi rice bowl",51:"shrimp egg chinese stir fry donburi",
  52:"pot au feu french stew bacon vegetable",53:"soy milk hot pot nabe japanese",
  54:"happosai chinese stir fry shrimp",55:"ebi chili shrimp chili sauce chinese",
  56:"yakisoba stir fry noodles japanese",57:"tantanmen sesame miso noodle soup",
  58:"carbonara pasta egg bacon creamy",59:"minestrone vegetable tomato soup italian",
  60:"chicken piccata egg flour pan fried",61:"broccoli gratin white sauce baked",
  62:"sausage potato saute pan fried",63:"broccoli egg chinese stir fry",
  64:"tofu steak teriyaki sauce japanese",65:"komatsuna pork garlic stir fry",
  66:"mizutaki chicken hot pot japanese clear broth",
  67:"ishikari nabe salmon miso hot pot hokkaido",
  68:"pork nira garlic cabbage hot pot japanese",
  69:"tomato hot pot nabe chicken vegetable",70:"egg drop tofu nabe japanese clear soup",
  71:"curry hot pot nabe japanese pork potato",
  72:"kenchinjiru tofu vegetable miso soup japanese",
  73:"pumpkin potage soup creamy",74:"pork cabbage consomme soup",
  75:"french onion soup gratin baked",76:"spinach egg chinese soup",
  77:"chicken daikon japanese clear soup",78:"tamagoyaki sweet egg bento japanese",
  79:"tsukune chicken meatball skewer japanese",80:"renkon lotus root kinpira stir fry",
  81:"kabocha pumpkin simmered sweet soy japanese",
  82:"beef shigureni ginger sweet soy japanese",
  83:"salmon nanban pickled vinegar japanese",84:"chikuwa fish cake stir fry japanese",
  85:"tofu hamburger steak japanese",86:"broccoli sesame salad ohitashi japanese",
  87:"green pepper beef stir fry chinese",88:"curry udon noodle soup japanese",
  89:"nikomi udon simmered noodles japanese",90:"tsukimi udon egg noodle soup japanese",
  91:"kitsune udon tofu puff noodle soup",92:"zaru soba cold buckwheat noodles japanese",
  93:"tonkotsu ramen pork broth noodles japanese",94:"shio ramen salt broth noodles japanese clear",
  95:"shoyu ramen soy sauce broth noodles japanese",
  96:"napolitan spaghetti ketchup japanese pasta",97:"tuna tomato pasta spaghetti italian",
  98:"shrimp tomato cream pasta italian",99:"chicken butter soy sauce pasta japanese",
  100:"bolognese meat sauce spaghetti pasta",101:"takikomi gohan chicken rice japanese",
  102:"salmon takikomi gohan rice japanese",103:"shrimp pilaf fried rice butter",
  104:"tomato risotto italian parmesan rice",105:"bacon cream risotto butter",
  106:"pork fried rice chinese wok",107:"kimchi fried rice korean spicy",
  108:"shrimp fried rice chinese wok",109:"omurice japanese omelette ketchup rice",
  110:"shrimp fry breaded deep fried ebi furai",111:"chicken katsu breaded fried cutlet japanese",
  112:"pork katsu don rice bowl tonkatsu",113:"salmon fry breaded fish",
  114:"korokke croquette potato ground beef japanese",
  115:"kakiage mixed tempura shrimp onion",116:"tatsuta age marinated fried chicken japanese",
  117:"chawanmushi savory egg custard steamed japanese",
  118:"steamed chicken sesame sauce yodare",119:"pork roll steam vegetables japanese",
  120:"steamed tofu chinese sauce ginger scallion",121:"steamed tofu ground pork chinese",
  122:"grilled mackerel salt saba shioyaki japanese",
  123:"salmon butter soy sauce pan fried",124:"chicken honey mustard grilled",
  125:"pork miso marinated grilled yakitori",126:"eggplant dengaku miso grilled japanese",
  127:"atsuage teriyaki thick fried tofu pan",128:"roasted chicken potato onion oven baked",
  129:"shrimp broccoli ajillo garlic oil",130:"sausage potato carrot oven roasted",
  131:"pork saute pan fried simple butter garlic",132:"chikuzen ni chicken vegetable simmered japanese",
  133:"kiriboshi daikon dried radish carrot simmered",
  134:"hijiki seaweed carrot aburaage simmered japanese",
  135:"kakuni braised pork belly soy sauce ginger",
  136:"konnyaku konjac stir fried simmered soy sauce",
  137:"pork napa cabbage layered simmered japanese",
  138:"chicken potato japanese simmered stew",139:"oden japanese winter hot pot daikon egg",
  140:"spinach ohitashi blanched japanese side",141:"komatsuna greens ohitashi blanched japanese",
  142:"shiraae tofu spinach white sesame japanese",
  143:"daikon namasu carrot radish pickled vinegar",
  144:"cucumber asazuke quick pickled japanese",145:"agedashi tofu deep fried broth japanese",
  146:"ajitsuke tamago marinated soy sauce egg ramen",
  147:"carrot kinpira stir fried sweet soy japanese",
  148:"gobo burdock sesame miso dressed japanese",149:"broccoli ohitashi blanched soy japanese",
  150:"tofu dengaku miso grilled tofu japanese",151:"aburaage fried tofu sweet soy simmered",
  152:"chicken daikon sweet soy simmered japanese",
  153:"eggplant miso simmered nasu japanese",154:"pad kra pao thai basil chicken fried rice",
  155:"green curry thai coconut milk chicken",156:"pho vietnamese chicken noodle soup",
  157:"bibimbap korean rice bowl vegetables egg",158:"bulgogi korean marinated beef grilled",
  159:"nasi goreng indonesian fried rice shrimp",
  160:"samgyetang korean ginseng chicken soup",
  161:"twice cooked pork huiguorou cabbage pepper chinese",
  162:"sweet sour pork chinese vinegar karaage",163:"beef broccoli chinese stir fry",
  164:"shrimp salt stir fry chinese garlic",165:"pork miso spicy stir fry chinese",
  166:"harusame spring noodles pork soup chinese",
  167:"stuffed cabbage roll consomme western",168:"chicken doria rice gratin japanese",
  169:"beef stew brown sauce western",170:"meatball tomato sauce italian",
  171:"tandoori chicken indian spice yogurt",172:"ratatouille french vegetable tomato stew",
  173:"pasta chicken macaroni gratin white sauce",174:"hash brown potato pancake crispy",
  175:"salmon cream sauce white butter french",
  176:"japanese curry rice chicken potato vegetable",
  177:"hayashi rice beef tomato demi-glace japanese",
  178:"tenshinhan chinese egg omelette rice bowl",
  179:"dry curry keema ground meat rice japanese",
  180:"nikudofu beef tofu rice bowl japanese",181:"salmon flakes rice bowl japanese healthy",
  182:"zosui japanese rice porridge egg soup",183:"yaki onigiri grilled rice ball soy japanese",
  184:"udon noodle pork miso soup japanese",185:"vegetable egg rice bowl oyakodon japanese",
  186:"stuffed green pepper meat japanese",187:"agedashi eggplant japanese fried soaked dashi",
  188:"nira chijimi korean pancake garlic chive",
  189:"pork belly green onion salt grilled japanese",
  190:"ebi mayo shrimp mayonnaise japanese style",
  191:"atsuage tofu miso green onion grilled japanese",
  192:"daikon radish steak braised soy butter japanese",
  193:"okonomiyaki japanese pancake cabbage pork savory",
  194:"french toast egg milk butter breakfast",
  195:"garlic toast bread butter garlic herb crispy",
  196:"egg sandwich tamagosando japanese soft bread",
  197:"hot sandwich toasted club bacon egg cabbage",
  198:"tomato bacon open toast bruschetta bread",
  199:"tuna green onion japanese toast sesame",
  200:"natto toast fermented beans japanese breakfast",
};

// 既存の結果ファイルを読み込む（再実行時に継続できるよう）
let existing = {};
if (fs.existsSync(OUT)) {
  try { existing = JSON.parse(fs.readFileSync(OUT, "utf8")); } catch {}
}

const missing = Object.keys(SEARCH_TERMS).filter(id => !existing[id]);
console.log(`既存: ${Object.keys(existing).length}件, 未取得: ${missing.length}件`);

if (missing.length === 0) {
  console.log("すべて取得済みです！");
  process.exit(0);
}

const images = { ...existing };
let fetched = 0, rateLimited = false;

for (const id of missing) {
  const term = SEARCH_TERMS[id];
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=1&content_filter=high`,
      { headers: { Authorization: `Client-ID ${API_KEY}` } }
    );
    const remaining = res.headers.get("X-Ratelimit-Remaining");
    // Unsplash は 429 または 403 でレート制限を通知する
    if (res.status === 429 || res.status === 403) {
      console.log(`⚠ レート制限に達しました (ID ${id})。1時間後に再実行してください。`);
      rateLimited = true;
      break;
    }
    if (res.ok) {
      const data = await res.json();
      const photo = data.results?.[0];
      if (photo?.urls?.small) {
        images[id] = {
          url: photo.urls.small,
          photographer: photo.user.name,
          photographerUrl: `${photo.user.links.html}?utm_source=kyou_no_gohan&utm_medium=referral`,
          unsplashUrl: `${photo.links.html}?utm_source=kyou_no_gohan&utm_medium=referral`,
        };
        fetched++;
        process.stdout.write(`✓ ID ${id.padStart(3)} (残り${remaining})  \r`);
      } else {
        console.log(`✗ ID ${id}: 結果なし (${term})`);
      }
      // 進捗を保存（途中でCtrl+Cしても無駄にならない）
      fs.writeFileSync(OUT, JSON.stringify(images, null, 2));
    }
  } catch (e) {
    console.log(`✗ ID ${id}: エラー - ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 400)); // 短い間隔で連続取得
}

console.log(`\n取得完了: ${fetched}件追加 (計 ${Object.keys(images).length}/200件)`);
if (rateLimited) {
  console.log("残り未取得分は1時間後に再実行してください: node scripts/fetchImages.mjs");
}
