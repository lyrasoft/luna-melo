import { defineComponent, createElementBlock, openBlock, createElementVNode, createTextVNode, Fragment, renderList, toDisplayString, withModifiers, computed, ref, onMounted, renderSlot, createCommentVNode, mergeModels, useModel, watch, createVNode, withCtx, withDirectives, vModelText, vModelSelect, onErrorCaptured, normalizeClass, createApp } from "vue";
import { uid, sleep, useHttpClient, simpleAlert, data, route } from "@windwalker-io/unicorn-next";
import { numberFormat } from "@lyrasoft/ts-toolkit/generic";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
import { g as getDefaultExportFromCjs } from "./_commonjsHelpers.js";
import { u as useCurrentElement } from "./index.js";
function formatPrice(price, scale = 0, prefix = "NT $") {
  if (!price && price !== 0) {
    return "";
  }
  return prefix + numberFormat(price, scale);
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CartItems",
  props: {
    items: {}
  },
  emits: ["delete-item"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const emits = __emit;
    function deleteItem(item, i) {
      emits("delete-item", item, i);
    }
    const __returned__ = { emits, deleteItem, get formatPrice() {
      return formatPrice;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$3 = { class: "l-cart-items table table-bordered" };
const _hoisted_2$3 = { class: "bg-white" };
const _hoisted_3$3 = ["i"];
const _hoisted_4$3 = { class: "text-center align-middle text-nowrap border-0" };
const _hoisted_5$2 = { class: "border-0" };
const _hoisted_6$2 = { class: "d-flex align-items-center" };
const _hoisted_7$2 = ["src"];
const _hoisted_8$2 = { style: { "min-width": "150px" } };
const _hoisted_9$2 = { class: "text-nowrap text-center border-0 align-middle" };
const _hoisted_10$2 = { class: "text-center text-nowrap border-0 align-middle" };
const _hoisted_11$2 = ["onClick"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("table", _hoisted_1$3, [
    _cache[5] || (_cache[5] = createElementVNode("thead", { class: "bg-light" }, [
      createElementVNode("tr", { class: "b" }, [
        createElementVNode("th", {
          width: "5%",
          class: "text-center text-nowrap border-0"
        }, "\n        編號\n      "),
        createTextVNode(),
        createElementVNode("th", { class: "text-nowrap border-0" }, "\n        課程名稱\n      "),
        createTextVNode(),
        createElementVNode("th", { class: "text-center text-nowrap border-0" }, "\n        售價\n      "),
        createTextVNode(),
        createElementVNode("th", {
          width: "5%",
          class: "text-center text-nowrap border-0"
        }, "\n        刪除\n      ")
      ])
    ], -1)),
    _cache[6] || (_cache[6] = createTextVNode()),
    createElementVNode("tbody", _hoisted_2$3, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.items, (item, i) => {
        return openBlock(), createElementBlock("tr", {
          key: item.uid,
          i
        }, [
          createElementVNode("td", _hoisted_4$3, toDisplayString(i + 1), 1),
          _cache[2] || (_cache[2] = createTextVNode()),
          createElementVNode("td", _hoisted_5$2, [
            createElementVNode("div", _hoisted_6$2, [
              createElementVNode("img", {
                src: item.image,
                alt: "Image",
                class: "me-2",
                width: "100px"
              }, null, 8, _hoisted_7$2),
              _cache[0] || (_cache[0] = createTextVNode()),
              createElementVNode("span", _hoisted_8$2, toDisplayString(item.title), 1)
            ])
          ]),
          _cache[3] || (_cache[3] = createTextVNode()),
          createElementVNode("td", _hoisted_9$2, toDisplayString($setup.formatPrice(item?.prices?.final?.price || "")), 1),
          _cache[4] || (_cache[4] = createTextVNode()),
          createElementVNode("td", _hoisted_10$2, [
            createElementVNode("a", {
              href: "javascript://",
              onClick: withModifiers(($event) => $setup.deleteItem(item, i), ["prevent"])
            }, [..._cache[1] || (_cache[1] = [
              createElementVNode("i", { class: "fas fa-trash fa-fw" }, null, -1)
            ])], 8, _hoisted_11$2)
          ])
        ], 8, _hoisted_3$3);
      }), 128))
    ])
  ]);
}
const CartItems = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "CartItems.vue"]]);
var twCitySelector = { exports: {} };
var hasRequiredTwCitySelector;
function requireTwCitySelector() {
  if (hasRequiredTwCitySelector) return twCitySelector.exports;
  hasRequiredTwCitySelector = 1;
  (function(module, exports$1) {
    !(function(i, t) {
      module.exports = t();
    })(window, (function() {
      return (function(i) {
        var t = {};
        function n(s) {
          if (t[s]) return t[s].exports;
          var o = t[s] = { i: s, l: false, exports: {} };
          return i[s].call(o.exports, o, o.exports, n), o.l = true, o.exports;
        }
        return n.m = i, n.c = t, n.d = function(i2, t2, s) {
          n.o(i2, t2) || Object.defineProperty(i2, t2, { enumerable: true, get: s });
        }, n.r = function(i2) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(i2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(i2, "__esModule", { value: true });
        }, n.t = function(i2, t2) {
          if (1 & t2 && (i2 = n(i2)), 8 & t2) return i2;
          if (4 & t2 && "object" == typeof i2 && i2 && i2.__esModule) return i2;
          var s = /* @__PURE__ */ Object.create(null);
          if (n.r(s), Object.defineProperty(s, "default", { enumerable: true, value: i2 }), 2 & t2 && "string" != typeof i2) for (var o in i2) n.d(s, o, (function(t3) {
            return i2[t3];
          }).bind(null, o));
          return s;
        }, n.n = function(i2) {
          var t2 = i2 && i2.__esModule ? function() {
            return i2.default;
          } : function() {
            return i2;
          };
          return n.d(t2, "a", t2), t2;
        }, n.o = function(i2, t2) {
          return Object.prototype.hasOwnProperty.call(i2, t2);
        }, n.p = "", n(n.s = 0);
      })([function(i, t, n) {
        n.r(t);
        var s = { counties: ["台北市", "基隆市", "新北市", "宜蘭縣", "桃園市", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "嘉義市", "嘉義縣", "雲林縣", "台南市", "高雄市", "澎湖縣", "金門縣", "屏東縣", "台東縣", "花蓮縣", "連江縣"], districts: [[["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"], ["100", "103", "104", "105", "106", "108", "110", "111", "112", "114", "115", "116"]], [["仁愛區", "信義區", "中正區", "中山區", "安樂區", "暖暖區", "七堵區"], ["200", "201", "202", "203", "204", "205", "206"]], [["萬里區", "金山區", "板橋區", "汐止區", "深坑區", "石碇區", "瑞芳區", "平溪區", "雙溪區", "貢寮區", "新店區", "坪林區", "烏來區", "永和區", "中和區", "土城區", "三峽區", "樹林區", "鶯歌區", "三重區", "新莊區", "泰山區", "林口區", "蘆洲區", "五股區", "八里區", "淡水區", "三芝區", "石門區"], ["207", "208", "220", "221", "222", "223", "224", "226", "227", "228", "231", "232", "233", "234", "235", "236", "237", "238", "239", "241", "242", "243", "244", "247", "248", "249", "251", "252", "253"]], [["宜蘭市", "頭城鎮", "礁溪鄉", "壯圍鄉", "員山鄉", "羅東鎮", "三星鄉", "大同鄉", "五結鄉", "冬山鄉", "蘇澳鎮", "南澳鄉", "釣魚台列嶼"], ["260", "261", "262", "263", "264", "265", "266", "267", "268", "269", "270", "272", "290"]], [["中壢區", "平鎮區", "龍潭區", "楊梅區", "新屋區", "觀音區", "桃園區", "龜山區", "八德區", "大溪區", "復興區", "大園區", "蘆竹區"], ["320", "324", "325", "326", "327", "328", "330", "333", "334", "335", "336", "337", "338"]], [["東區", "北區", "香山區"], ["300", "300", "300"]], [["竹北市", "湖口鄉", "新豐鄉", "新埔鎮", "關西鎮", "芎林鄉", "寶山鄉", "竹東鎮", "五峰鄉", "橫山鄉", "尖石鄉", "北埔鄉", "峨眉鄉"], ["302", "303", "304", "305", "306", "307", "308", "310", "311", "312", "313", "314", "315"]], [["竹南鎮", "頭份市", "三灣鄉", "南庄鄉", "獅潭鄉", "後龍鎮", "通霄鎮", "苑裡鎮", "苗栗市", "造橋鄉", "頭屋鄉", "公館鄉", "大湖鄉", "泰安鄉", "銅鑼鄉", "三義鄉", "西湖鄉", "卓蘭鎮"], ["350", "351", "352", "353", "354", "356", "357", "358", "360", "361", "362", "363", "364", "365", "366", "367", "368", "369"]], [["中區", "東區", "南區", "西區", "北區", "北屯區", "西屯區", "南屯區", "太平區", "大里區", "霧峰區", "烏日區", "豐原區", "后里區", "石岡區", "東勢區", "和平區", "新社區", "潭子區", "大雅區", "神岡區", "大肚區", "沙鹿區", "龍井區", "梧棲區", "清水區", "大甲區", "外埔區", "大安區"], ["400", "401", "402", "403", "404", "406", "407", "408", "411", "412", "413", "414", "420", "421", "422", "423", "424", "426", "427", "428", "429", "432", "433", "434", "435", "436", "437", "438", "439"]], [["彰化市", "芬園鄉", "花壇鄉", "秀水鄉", "鹿港鎮", "福興鄉", "線西鄉", "和美鎮", "伸港鄉", "員林市", "社頭鄉", "永靖鄉", "埔心鄉", "溪湖鎮", "大村鄉", "埔鹽鄉", "田中鎮", "北斗鎮", "田尾鄉", "埤頭鄉", "溪州鄉", "竹塘鄉", "二林鎮", "大城鄉", "芳苑鄉", "二水鄉"], ["500", "502", "503", "504", "505", "506", "507", "508", "509", "510", "511", "512", "513", "514", "515", "516", "520", "521", "522", "523", "524", "525", "526", "527", "528", "530"]], [["南投市", "中寮鄉", "草屯鎮", "國姓鄉", "埔里鎮", "仁愛鄉", "名間鄉", "集集鎮", "水里鄉", "魚池鄉", "信義鄉", "竹山鎮", "鹿谷鄉"], ["540", "541", "542", "544", "545", "546", "551", "552", "553", "555", "556", "557", "558"]], [["東區", "西區"], ["600", "600"]], [["番路鄉", "梅山鄉", "竹崎鄉", "阿里山", "中埔鄉", "大埔鄉", "水上鄉", "鹿草鄉", "太保市", "朴子市", "東石鄉", "六腳鄉", "新港鄉", "民雄鄉", "大林鎮", "溪口鄉", "義竹鄉", "布袋鎮"], ["602", "603", "604", "605", "606", "607", "608", "611", "612", "613", "614", "615", "616", "621", "622", "623", "624", "625"]], [["斗南鎮", "大埤鄉", "虎尾鎮", "土庫鎮", "褒忠鄉", "東勢鄉", "台西鄉", "崙背鄉", "麥寮鄉", "斗六市", "林內鄉", "古坑鄉", "莿桐鄉", "西螺鎮", "二崙鄉", "北港鎮", "水林鄉", "口湖鄉", "四湖鄉", "元長鄉"], ["630", "631", "632", "633", "634", "635", "636", "637", "638", "640", "643", "646", "647", "648", "649", "651", "652", "653", "654", "655"]], [["中西區", "東區", "南區", "北區", "安平區", "安南區", "永康區", "歸仁區", "新化區", "左鎮區", "玉井區", "楠西區", "南化區", "仁德區", "關廟區", "龍崎區", "官田區", "麻豆區", "佳里區", "西港區", "七股區", "將軍區", "學甲區", "北門區", "新營區", "後壁區", "白河區", "東山區", "六甲區", "下營區", "柳營區", "鹽水區", "善化區", "大內區", "山上區", "新市區", "安定區"], ["700", "701", "702", "704", "708", "709", "710", "711", "712", "713", "714", "715", "716", "717", "718", "719", "720", "721", "722", "723", "724", "725", "726", "727", "730", "731", "732", "733", "734", "735", "736", "737", "741", "742", "743", "744", "745"]], [["新興區", "前金區", "苓雅區", "鹽埕區", "鼓山區", "旗津區", "前鎮區", "三民區", "楠梓區", "小港區", "左營區", "仁武區", "大社區", "東沙群島", "南沙群島", "岡山區", "路竹區", "阿蓮區", "田寮區", "燕巢區", "橋頭區", "梓官區", "彌陀區", "永安區", "湖內區", "鳳山區", "大寮區", "林園區", "鳥松區", "大樹區", "旗山區", "美濃區", "六龜區", "內門區", "杉林區", "甲仙區", "桃源區", "那瑪夏區", "茂林區", "茄萣區"], ["800", "801", "802", "803", "804", "805", "806", "807", "811", "812", "813", "814", "815", "817", "819", "820", "821", "822", "823", "824", "825", "826", "827", "828", "829", "830", "831", "832", "833", "840", "842", "843", "844", "845", "846", "847", "848", "849", "851", "852"]], [["馬公市", "西嶼鄉", "望安鄉", "七美鄉", "白沙鄉", "湖西鄉"], ["880", "881", "882", "883", "884", "885"]], [["金沙鎮", "金湖鎮", "金寧鄉", "金城鎮", "烈嶼鄉", "烏坵鄉"], ["890", "891", "892", "893", "894", "896"]], [["屏東市", "三地門鄉", "霧台鄉", "瑪家鄉", "九如鄉", "里港鄉", "高樹鄉", "鹽埔鄉", "長治鄉", "麟洛鄉", "竹田鄉", "內埔鄉", "萬丹鄉", "潮州鎮", "泰武鄉", "來義鄉", "萬巒鄉", "崁頂鄉", "新埤鄉", "南州鄉", "林邊鄉", "東港鎮", "琉球鄉", "佳冬鄉", "新園鄉", "枋寮鄉", "枋山鄉", "春日鄉", "獅子鄉", "車城鄉", "牡丹鄉", "恆春鎮", "滿州鄉"], ["900", "901", "902", "903", "904", "905", "906", "907", "908", "909", "911", "912", "913", "920", "921", "922", "923", "924", "925", "926", "927", "928", "929", "931", "932", "940", "941", "942", "943", "944", "945", "946", "947"]], [["台東市", "綠島鄉", "蘭嶼鄉", "延平鄉", "卑南鄉", "鹿野鄉", "關山鎮", "海端鄉", "池上鄉", "東河鄉", "成功鎮", "長濱鄉", "太麻里鄉", "金峰鄉", "大武鄉", "達仁鄉"], ["950", "951", "952", "953", "954", "955", "956", "957", "958", "959", "961", "962", "963", "964", "965", "966"]], [["花蓮市", "新城鄉", "秀林鄉", "吉安鄉", "壽豐鄉", "鳳林鎮", "光復鄉", "豐濱鄉", "瑞穗鄉", "萬榮鄉", "玉里鎮", "卓溪鄉", "富里鄉"], ["970", "971", "972", "973", "974", "975", "976", "977", "978", "979", "981", "982", "983"]], [["南竿鄉", "北竿鄉", "莒光鄉", "東引鄉"], ["209", "210", "211", "212"]]] }, o = { counties: ["Taipei City", "Keelung City", "New Taipei City", "Yilan County", "Taoyuan City", "Hsinchu City", "Hsinchu County", "Miaoli County", "Taichung City", "Changhua County", "Nantou County", "Chiayi City", "Chiayi County", "Yunlin County", "Tainan City", "Kaohsiung City", "Penghu County", "Kinmen County", "Pingtung County", "Taitung County", "Hualien County", "Lienchiang County"], districts: [[["Zhongzheng District", "Datong District", "Zhongshan District", "Songshan District", "Da’an District", "Wanhua District", "Xinyi District", "Shilin District", "Beitou District", "Neihu District", "Nangang District", "Wenshan District"], ["100", "103", "104", "105", "106", "108", "110", "111", "112", "114", "115", "116"]], [["Ren’ai District", "Xinyi District", "Zhongzheng District", "Zhongshan District", "Anle District", "Nuannuan District", "Qidu District"], ["200", "201", "202", "203", "204", "205", "206"]], [["Wanli District", "Jinshan District", "Banqiao District", "Xizhi District", "Shenkeng District", "Shiding District", "Ruifang District", "Pingxi District", "Shuangxi District", "Gongliao District", "Xindian District", "Pinglin District", "Wulai District", "Yonghe District", "Zhonghe District", "Tucheng District", "Sanxia District", "Shulin District", "Yingge District", "Sanchong District", "Xinzhuang District", "Taishan District", "Linkou District", "LuzhouDistrict", "Wugu District", "Bali District", "Tamsui District", "Sanzhi District", "Shimen District"], ["207", "208", "220", "221", "222", "223", "224", "226", "227", "228", "231", "232", "233", "234", "235", "236", "237", "238", "239", "241", "242", "243", "244", "247", "248", "249", "251", "252", "253"]], [["Yilan City", "Toucheng Township", "Jiaoxi Township", "Zhuangwei Township", "Yuanshan Township", "Luodong Township", "Sanxing Township", "Datong Township", "Wujie Township", "Dongshan Township", "Su’ao Township", "Nan’ao Township", "Diauyutai"], ["260", "261", "262", "263", "264", "265", "266", "267", "268", "269", "270", "272", "290"]], [["Zhongli District", "Pingzhen District", "Longtan District", "Yangmei District", "Xinwu District", "Guanyin District", "Taoyuan District", "Guishan District", "Bade District", "Daxi District", "Fuxing District", "Dayuan District", "Luzhu District"], ["320", "324", "325", "326", "327", "328", "330", "333", "334", "335", "336", "337", "338"]], [["East District", "North District", "Xiangshan District"], ["300", "300", "300"]], [["Zhubei City", "Hukou Township", "Xinfeng Township", "Xinpu Township", "Guanxi Township", "Qionglin Township", "Baoshan Township", "Zhudong Township", "Wufeng Township", "Hengshan Township", "Jianshi Township", "Beipu Township", "Emei Township"], ["302", "303", "304", "305", "306", "307", "308", "310", "311", "312", "313", "314", "315"]], [["Zhunan Township", "Toufen Township", "Sanwan Township", "Nanzhuang Township", "Shitan Township", "Houlong Township", "Tongxiao Township", "Yuanli Township", "Miaoli City", "Zaoqiao Township", "Touwu Township", "Gongguan Township", "Dahu Township", "Tai’an Township", "Tongluo Township", "Sanyi Township", "Xihu Township", "Zhuolan Township"], ["350", "351", "352", "353", "354", "356", "357", "358", "360", "361", "362", "363", "364", "365", "366", "367", "368", "369"]], [["Central District", "East District", "South District", "West District", "North District", "Beitun District", "Xitun District", "Nantun District", "Taiping District", "Dali District", "Wufeng District", "Wuri District", "Fengyuan District", "Houli District", "Shigang District", "Dongshi District", "Heping District", "Xinshe District", "Tanzi District", "Daya District", "Shengang District", "Dadu District", "ShaluDistrict", "Longjing District", "Wuqi District", "Qingshui District", "Dajia District", "Waipu District", "Da’an District"], ["400", "401", "402", "403", "404", "406", "407", "408", "411", "412", "413", "414", "420", "421", "422", "423", "424", "426", "427", "428", "429", "432", "433", "434", "435", "436", "437", "438", "439"]], [["Changhua City", "Fenyuan Township", "Huatan Township", "Xiushui Township", "Lukang Township", "Fuxing Township", "Xianxi Township", "Hemei Township", "Shengang Township", "Yuanlin Township", "Shetou Township", "Yongjing Township", "Puxin Township", "Xihu Township", "Dacun Township", "Puyan Township", "Tianzhong Township", "Beidou Township", "Tianwei Township", "Pitou Township", "Xizhou Township", "Zhutang Township", "Erlin Township", "Dacheng Township", "Fangyuan Township", "Ershui Township"], ["500", "502", "503", "504", "505", "506", "507", "508", "509", "510", "511", "512", "513", "514", "515", "516", "520", "521", "522", "523", "524", "525", "526", "527", "528", "530"]], [["Nantou City", "Zhongliao Township", "Caotun Township", "Guoxing Township", "Puli Township", "Ren’ai Township", "Mingjian Township", "Jiji Township", "Shuili Township", "Yuchi Township", "Xinyi Township", "Zhushan Township", "Lugu Township"], ["540", "541", "542", "544", "545", "546", "551", "552", "553", "555", "556", "557", "558"]], [["East District", "West District"], ["600", "600"]], [["FanluTownship", "Meishan Township", "Zhuqi Township", "Alishan Township", "Zhongpu Township", "Dapu Township", "Shuishang Township", "Lucao Township", "Taibao City", "Puzi City", "Dongshi Township", "Liujiao Township", "Xingang Township", "Minxiong Township", "Dalin Township", "Xikou Township", "Yizhu Township", "Budai Township"], ["602", "603", "604", "605", "606", "607", "608", "611", "612", "613", "614", "615", "616", "621", "622", "623", "624", "625"]], [["Dounan Township", "Dapi Township", "Huwei Township", "Tuku Township", "Baozhong Township", "Dongshi Township", "Taixi Township", "Lunbei Township", "Mailiao Township", "Douliu City", "Linnei Township", "Gukeng Township", "Citong Township", "Xiluo Township", "Erlun Township", "Beigang Township", "Shuilin Township", "Kouhu Township", "Sihu Township", "Yuanchang Township"], ["630", "631", "632", "633", "634", "635", "636", "637", "638", "640", "643", "646", "647", "648", "649", "651", "652", "653", "654", "655"]], [["West Central District", "East District", "South District", "North District", "Anping District", "Annan District", "Yongkang District", "Guiren District", "Xinhua District", "Zuozhen District", "Yujing District", "Nanxi District", "Nanhua District", "Rende District", "Guanmiao District", "Longqi District", "Guantian District", "Madou District", "Jiali District", "Xigang District", "Qigu District", "Jiangjun District", "Xuejia District", "Beimen District", "Xinying District", "Houbi District", "Baihe District", "Dongshan District", "Liujia District", "Xiaying District", "Liuying District", "Yanshui District", "Shanhua District", "Danei District", "Shanshang District", "Xinshi District", "Anding District"], ["700", "701", "702", "704", "708", "709", "710", "711", "712", "713", "714", "715", "716", "717", "718", "719", "720", "721", "722", "723", "724", "725", "726", "727", "730", "731", "732", "733", "734", "735", "736", "737", "741", "742", "743", "744", "745"]], [["Xinxing District", "Qianjin District", "Lingya District", "Yancheng District", "Gushan District", "Qijin District", "Qianzhen District", "Sanmin District", "Nanzi District", "Xiaogang District", "Zuoying District", "Renwu District", "Dashe District", "Dongsha Islands", "Nansha Islands", "Gangshan District", "Luzhu District", "Alian District", "Tianliao District", "Yanchao District", "Qiaotou District", "Ziguan District", "Mituo District", "Yong’an District", "Hunei District", "Fengshan District", "Daliao District", "Linyuan District", "Niaosong District", "Dashu District", "Qishan District", "Meinong District", "Liugui District", "Neimen District", "Shanlin District", "Jiaxian District", "Taoyuan District", "Namaxia District", "Maolin District", "Qieding District"], ["800", "801", "802", "803", "804", "805", "806", "807", "811", "812", "813", "814", "815", "817", "819", "820", "821", "822", "823", "824", "825", "826", "827", "828", "829", "830", "831", "832", "833", "840", "842", "843", "844", "845", "846", "847", "848", "849", "851", "852"]], [["Magong City", "Xiyu Township", "Wang’an Township", "Qimei Township", "Baisha Township", "Huxi Township"], ["880", "881", "882", "883", "884", "885"]], [["Jinsha Township", "Jinhu Township", "Jinning Township", "Jincheng Township", "Lieyu Township", "Wuqiu Township"], ["890", "891", "892", "893", "894", "896"]], [["Pingtung City", "Sandimen Township", "Wutai Township", "Majia Township", "Jiuru Township", "Ligang Township", "Gaoshu Township", "Yanpu Township", "Changzhi Township", "Linluo Township", "Zhutian Township", "Neipu Township", "Wandan Township", "Chaozhou Township", "Taiwu Township", "Laiyi Township", "Wanluan Township", "Kanding Township", "Xinpi Township", "Nanzhou Township", "Linbian Township", "Donggang Township", "Liuqiu Township", "Jiadong Township", "Xinyuan Township", "Fangliao Township", "Fangshan Township", "Chunri Township", "Shizi Township", "Checheng Township", "Mudan Township", "Hengchun Township", "Manzhou Township"], ["900", "901", "902", "903", "904", "905", "906", "907", "908", "909", "911", "912", "913", "920", "921", "922", "923", "924", "925", "926", "927", "928", "929", "931", "932", "940", "941", "942", "943", "944", "945", "946", "947"]], [["Taitung City", "Ludao Township", "Lanyu Township", "Yanping Township", "Beinan Township", "Luye Township", "Guanshan Township", "Haiduan Township", "Chishang Township", "Donghe Township", "Chenggong Township", "Changbin Township", "Taimali Township", "Jinfeng Township", "Dawu Township", "Daren Township"], ["950", "951", "952", "953", "954", "955", "956", "957", "958", "959", "961", "962", "963", "964", "965", "966"]], [["Hualien City", "Xincheng Township", "Xiulin Township", "Ji’an Township", "Shoufeng Township", "Fenglin Township", "Guangfu Township", "Fengbin Township", "Ruisui Township", "Wanrong Township", "Yuli Township", "Zhuoxi Township", "Fuli Township"], ["970", "971", "972", "973", "974", "975", "976", "977", "978", "979", "981", "982", "983"]], [["Nangan Township", "Beigan Township", "Juguang Township", "Dongyin Township"], ["209", "210", "211", "212"]]] };
        function e(i2) {
          return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(i3) {
            return typeof i3;
          } : function(i3) {
            return i3 && "function" == typeof Symbol && i3.constructor === Symbol && i3 !== Symbol.prototype ? "symbol" : typeof i3;
          })(i2);
        }
        function a(i2, t2) {
          if (!(i2 instanceof t2)) throw new TypeError("Cannot call a class as a function");
        }
        function h(i2, t2) {
          for (var n2 = 0; n2 < t2.length; n2++) {
            var s2 = t2[n2];
            s2.enumerable = s2.enumerable || false, s2.configurable = true, "value" in s2 && (s2.writable = true), Object.defineProperty(i2, r(s2.key), s2);
          }
        }
        function r(i2) {
          var t2 = (function(i3, t3) {
            if ("object" != e(i3) || !i3) return i3;
            var n2 = i3[Symbol.toPrimitive];
            if (void 0 !== n2) {
              var s2 = n2.call(i3, t3);
              if ("object" != e(s2)) return s2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return String(i3);
          })(i2, "string");
          return "symbol" == e(t2) ? t2 : t2 + "";
        }
        var u = (function() {
          return i2 = function i3() {
            var t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [], s2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
            return a(this, i3), n2.length && this.checkOptionsRequired(t3, n2), this.setOptionsExtend(t3, s2);
          }, (t2 = [{ key: "checkOptionsRequired", value: function(i3, t3) {
            var n2 = "";
            if (i3 = i3 || {}, Object.keys(t3).forEach((function(t4) {
              i3.hasOwnProperty(t4) || (n2 += t4 + ",");
            })), n2) throw "缺少參數: " + n2;
          } }, { key: "setOptionsExtend", value: function(i3, t3) {
            if (!i3) return t3;
            var n2;
            for (n2 in i3) t3[n2] = i3[n2];
            return t3;
          } }]) && h(i2.prototype, t2), Object.defineProperty(i2, "prototype", { writable: false }), i2;
          var i2, t2;
        })();
        t.default = c;
        function c() {
          var i2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          this.VERSION = "2.0.0", this.ROLE_ATTR_NAME = "tw-city-selector";
          var t2 = { el: null, elCounty: null, elDistrict: null, elZipcode: null, only: null, except: null, disabled: false, hasZipcode: false, hiddenZipcode: false, countyValue: null, districtValue: null, countyClassName: "county", countyFieldName: "county", districtClassName: "district", districtFieldName: "district", zipcodeClassName: "zipcode", zipcodeFieldName: "zipcode", lang: "zh-tw", standardWords: false, bootstrapStyle: false }, n2 = i2.length ? ["el"] : [];
          return this.options = new u(i2, n2, t2), setTimeout((function() {
            l.call(this);
          }).bind(this), 0), this;
        }
        function l() {
          if (this.options.el) return this.el = g(this.options.el), this.elCounty = g(this.options.elCounty, this.el), this.elDistrict = g(this.options.elDistrict, this.el), this.elZipcode = g(this.options.elZipcode, this.el), this.elCounty && this.elCounty.dataset.value && (this.options.countyValue = this.elCounty.dataset.value, this.options.districtValue = this.elDistrict.dataset.value), d.call(this);
          var i2 = document.querySelectorAll("[role=" + this.ROLE_ATTR_NAME + "]");
          return Array.prototype.forEach.call(i2, (function(i3) {
            var t2 = JSON.parse(JSON.stringify(this));
            return t2.el = i3, t2.elCounty = null, t2.elDistrict = null, t2.elZipcode = null, t2 = p.call(t2), d.call(t2);
          }), this), i2;
        }
        function p() {
          return this.options.only = this.el.getAttribute("data-only") ? this.el.getAttribute("data-only").replace(/\s/g, "").split(",") : null, this.options.except = this.el.getAttribute("data-except") ? this.el.getAttribute("data-except").replace(/\s/g, "").split(",") : null, this.options.countyValue = this.el.getAttribute("data-county-value"), this.options.districtValue = this.el.getAttribute("data-district-value"), this.options.hasZipcode = null != this.el.getAttribute("data-has-zipcode"), this.options.hiddenZipcode = null != this.el.getAttribute("data-hidden-zipcode"), this.options.disabled = null != this.el.getAttribute("data-disabled"), this.options.standardWords = null != this.el.getAttribute("data-standard-words"), this.options.bootstrapStyle = null != this.el.getAttribute("data-bootstrap-style"), this;
        }
        function d() {
          return this.options.lang && "en-us" === this.options.lang ? this.data = o : this.data = s, x.call(this, this.options.standardWords), T.call(this), this.options.bootstrapStyle && N.call(this), m.call(this), b.call(this), S.call(this, this.options.countyValue, this.options.districtValue), this;
        }
        function g(i2, t2) {
          return i2 ? i2 && t2 ? t2.querySelector(i2) : document.querySelector(i2) : null;
        }
        function T() {
          var i2 = document.createDocumentFragment();
          if (!this.elCounty) {
            var t2 = document.createElement("select");
            this.elCounty = t2, i2.appendChild(this.elCounty);
          }
          if (this.elCounty.classList.add(this.options.countyClassName), this.elCounty.name = this.options.countyFieldName, this.options.disabled && this.elCounty.setAttribute("disabled", true), D.call(this), !this.elDistrict) {
            var n2 = document.createElement("select");
            this.elDistrict = n2, i2.appendChild(this.elDistrict);
          }
          if (this.elDistrict.classList.add(this.options.districtClassName), this.elDistrict.name = this.options.districtFieldName, this.options.disabled && this.elDistrict.setAttribute("disabled", true), w.call(this), !this.elZipcode && this.options.hasZipcode) {
            var s2 = document.createElement("input");
            this.elZipcode = s2, i2.appendChild(this.elZipcode), this.elZipcode.type = this.options.hiddenZipcode ? "hidden" : "text", this.elZipcode.name = this.options.zipcodeFieldName, this.elZipcode.classList.add(this.options.zipcodeClassName), this.elZipcode.readOnly = true, this.options.lang && "en-us" === this.options.lang ? this.elZipcode.placeholder = "ZIP code" : this.elZipcode.placeholder = "郵遞區號", this.elZipcode.size = 3, this.elZipcode.autocomplete = "off", this.options.disabled && this.elZipcode.setAttribute("disabled", true);
          }
          this.el.appendChild(i2);
        }
        function D() {
          var i2 = this.elCounty;
          this.options.lang && "en-us" === this.options.lang ? i2.options.add(new Option("Select County/City", "")) : i2.options.add(new Option("選擇縣市", ""));
          for (var t2 = y.call(this), n2 = f.call(this), s2 = 0, o2 = this.data.counties.length; s2 < o2; s2++) if (!(t2 && -1 === t2.indexOf(this.data.counties[s2]) || n2 && -1 !== n2.indexOf(this.data.counties[s2]))) {
            var e2 = new Option(this.data.counties[s2], this.data.counties[s2]);
            e2.dataset.index = s2, i2.options.add(e2);
          }
          return true;
        }
        function w() {
          for (var i2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, t2 = this.elDistrict; t2.firstChild; ) t2.removeChild(t2.firstChild);
          if (this.options.lang && "en-us" === this.options.lang ? t2.options.add(new Option("Select District", "")) : t2.options.add(new Option("選擇區域", "")), !i2) return true;
          for (var n2 = C.call(this, this.elCounty.value), s2 = v.call(this, this.elCounty.value), o2 = 0, e2 = this.data.districts[i2][0].length - 1; o2 <= e2; o2++) if (!(n2 && -1 === n2.indexOf(this.data.districts[i2][0][o2]) || s2 && -1 !== s2.indexOf(this.data.districts[i2][0][o2]))) {
            var a2 = new Option(this.data.districts[i2][0][o2], this.data.districts[i2][0][o2]);
            a2.dataset.zipcode = this.data.districts[i2][1][o2], t2.options.add(a2);
          }
          return true;
        }
        function y() {
          var i2 = this.options.only;
          return "string" == typeof i2 ? i2 : Array.isArray(i2) ? i2.map((function(i3) {
            var t2 = i3.indexOf("@");
            return -1 === t2 ? i3 : i3.substring(0, t2);
          })) : null;
        }
        function f() {
          var i2 = this.options.except;
          return "string" == typeof i2 ? i2 : Array.isArray(i2) ? i2.filter((function(i3) {
            return -1 === i3.indexOf("@");
          })) : null;
        }
        function C(i2) {
          var t2 = this.options.only, n2 = "string" == typeof t2;
          if (!n2 && !Array.isArray(t2)) return null;
          n2 && (t2 = [t2]);
          var s2 = null;
          return t2.forEach((function(t3) {
            if (-1 !== t3.indexOf(i2)) {
              var n3 = t3.lastIndexOf("@");
              return -1 !== n3 ? s2 = t3.substring(n3 + 1).split("|") : void 0;
            }
          })), s2;
        }
        function v(i2) {
          var t2 = this.options.except, n2 = "string" == typeof t2;
          if (!n2 && !Array.isArray(t2)) return null;
          n2 && (t2 = [t2]);
          var s2 = null;
          return t2.forEach((function(t3) {
            if (-1 !== t3.indexOf(i2)) {
              var n3 = t3.lastIndexOf("@");
              return -1 !== n3 ? s2 = t3.substring(n3 + 1).split("|") : void 0;
            }
          })), s2;
        }
        function m() {
          var i2 = (function() {
            var i3 = this.elCounty.querySelector("option:checked").getAttribute("data-index");
            w.call(this, i3), this.options.hasZipcode && (this.elZipcode.value = "");
          }).bind(this);
          this.elCounty.onchange = i2;
        }
        function b() {
          var i2 = (function() {
            var i3 = this.elDistrict.querySelector("option:checked").dataset.zipcode || "";
            (this.options.hasZipcode || this.elZipcode) && (this.elZipcode.value = i3);
          }).bind(this);
          this.elDistrict.onchange = i2;
        }
        function S() {
          var i2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, n2 = document.createEvent("Event");
          n2.initEvent("change", true, true), i2 && (this.elCounty.value = i2, this.elCounty.dispatchEvent(n2)), t2 && (this.elDistrict.value = t2, this.elDistrict.dispatchEvent(n2));
        }
        function Z() {
          return this.elCounty.selectedIndex = 0, w.call(this), this.options.hasZipcode && (this.elZipcode.value = ""), this;
        }
        function x() {
          var i2 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], t2 = i2 ? "台" : "臺", n2 = i2 ? "臺" : "台";
          this.data.counties = this.data.counties.map((function(i3) {
            return i3.includes(t2) ? i3.replace(t2, n2) : i3;
          })), this.data.districts.forEach((function(i3, s2, o2) {
            o2[s2][0] = i3[0].map((function(i4) {
              return i4.includes(t2) ? i4.replace(t2, n2) : i4;
            }));
          }));
        }
        function N() {
          var i2 = document.createDocumentFragment();
          this.elCounty.setAttribute("class", "form-control"), this.elDistrict.setAttribute("class", "form-control"), this.options.hasZipcode && this.elZipcode.setAttribute("class", "form-control");
          var t2 = document.createElement("div");
          t2.setAttribute("class", "form-group");
          var n2 = t2.cloneNode();
          n2.appendChild(this.elCounty), i2.appendChild(n2);
          var s2 = t2.cloneNode();
          if (s2.appendChild(this.elDistrict), i2.appendChild(s2), this.options.hasZipcode) {
            var o2 = t2.cloneNode();
            o2.appendChild(this.elZipcode), i2.appendChild(o2);
          }
          this.el.appendChild(i2);
        }
        c.prototype.getVersion = function() {
          return console.log("Your tw-city-selector.js is v" + this.VERSION), this;
        }, c.prototype.setValue = function() {
          var i2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
          return S.call(this, i2, t2), this;
        }, c.prototype.reset = function() {
          return Z.call(this), this;
        }, String.prototype.includes || (String.prototype.includes = function(i2, t2) {
          if (i2 instanceof RegExp) throw TypeError("first argument must not be a RegExp");
          return void 0 === t2 && (t2 = 0), -1 !== this.indexOf(i2, t2);
        });
      }]).default;
    }));
  })(twCitySelector);
  return twCitySelector.exports;
}
var twCitySelectorExports = requireTwCitySelector();
const TwCitySelector = /* @__PURE__ */ getDefaultExportFromCjs(twCitySelectorExports);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "FormGroup",
  props: {
    id: {},
    label: {},
    description: {},
    feedback: {},
    invalid: { type: Boolean }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const el = useCurrentElement();
    const id = computed(() => props.id || "input-" + uid());
    const input = ref();
    onMounted(() => {
      if (el.value) {
        updateInput();
      }
    });
    function updateInput() {
      const inputEl = el.value.querySelector("input, textarea, select");
      if (inputEl) {
        input.value = inputEl;
        inputEl.id = id.value;
        updateInvalid();
      }
    }
    function updateInvalid() {
      if (props.invalid) {
        input.value?.classList.add("is-invalid");
      } else {
        input.value?.classList.remove("is-invalid");
      }
    }
    const __returned__ = { props, el, id, input, updateInput, updateInvalid };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$2 = { class: "form-group d-flex flex-column gap-1" };
const _hoisted_2$2 = ["for"];
const _hoisted_3$2 = {
  key: 0,
  class: "invalid-tooltip"
};
const _hoisted_4$2 = {
  key: 1,
  class: "form-text text-muted"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    renderSlot(_ctx.$slots, "label", {}, () => [
      $props.label ? (openBlock(), createElementBlock("label", {
        key: 0,
        for: $setup.id
      }, toDisplayString($props.label), 9, _hoisted_2$2)) : createCommentVNode("", true)
    ]),
    _cache[0] || (_cache[0] = createTextVNode()),
    renderSlot(_ctx.$slots, "default"),
    _cache[1] || (_cache[1] = createTextVNode()),
    $props.feedback ? (openBlock(), createElementBlock("div", _hoisted_3$2, toDisplayString($props.feedback), 1)) : createCommentVNode("", true),
    _cache[2] || (_cache[2] = createTextVNode()),
    $props.description ? (openBlock(), createElementBlock("div", _hoisted_4$2, toDisplayString($props.description), 1)) : createCommentVNode("", true)
  ]);
}
const FormGroup = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "FormGroup.vue"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "InvoiceForm",
  props: /* @__PURE__ */ mergeModels({
    formSelector: { default: "#checkout-form" }
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const invoice = useModel(__props, "modelValue");
    onMounted(() => {
      new TwCitySelector({
        el: props.formSelector,
        elCounty: "[data-city]",
        elDistrict: "[data-dist]",
        elZipcode: "[data-zip]",
        countyFieldName: "item[address][city]",
        districtFieldName: "item[address][dist]",
        zipcodeFieldName: "item[address][zip]"
      });
    });
    watch(() => [invoice.value.address.city, invoice.value.address.dist], async () => {
      await sleep(100);
      invoice.value.address.zip = document.querySelector(`${props.formSelector} [data-zip]`)?.value || "";
    });
    const __returned__ = { props, invoice, FormGroup };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = { class: "row gy-4" };
const _hoisted_2$1 = { class: "col-lg-6" };
const _hoisted_3$1 = { class: "col-lg-6" };
const _hoisted_4$1 = { class: "col-lg-6" };
const _hoisted_5$1 = { class: "col-lg-6" };
const _hoisted_6$1 = { class: "col-lg-12" };
const _hoisted_7$1 = { class: "row gy-3" };
const _hoisted_8$1 = { class: "col-lg-4" };
const _hoisted_9$1 = { class: "col-lg-4" };
const _hoisted_10$1 = { class: "col-lg-4" };
const _hoisted_11$1 = { class: "col-lg-12" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    _cache[15] || (_cache[15] = createElementVNode("div", { class: "mb-3" }, "\n      以下資訊只用於開立發票，並不會在其他頁面顯示。發票一經開立後不可更改，請確認資訊是否都填寫正確喔！\n\n    ", -1)),
    _cache[16] || (_cache[16] = createTextVNode()),
    createElementVNode("div", _hoisted_1$1, [
      createElementVNode("div", _hoisted_2$1, [
        createVNode($setup["FormGroup"], { label: "統一編號" }, {
          default: withCtx(() => [
            withDirectives(createElementVNode("input", {
              type: "text",
              class: "form-control",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.invoice.vat = $event),
              name: "checkout[invoice_vat]",
              placeholder: "請填寫統一編號"
            }, null, 512), [
              [vModelText, $setup.invoice.vat]
            ])
          ]),
          _: 1
        })
      ]),
      _cache[11] || (_cache[11] = createTextVNode()),
      createElementVNode("div", _hoisted_3$1, [
        createVNode($setup["FormGroup"], { label: "發票抬頭" }, {
          default: withCtx(() => [
            withDirectives(createElementVNode("input", {
              type: "text",
              class: "form-control",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.invoice.title = $event),
              name: "checkout[invoice_title]",
              placeholder: "請填寫發票抬頭"
            }, null, 512), [
              [vModelText, $setup.invoice.title]
            ])
          ]),
          _: 1
        })
      ]),
      _cache[12] || (_cache[12] = createTextVNode()),
      createElementVNode("div", _hoisted_4$1, [
        createVNode($setup["FormGroup"], { label: "收件人" }, {
          default: withCtx(() => [
            withDirectives(createElementVNode("input", {
              type: "text",
              class: "form-control",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.invoice.name = $event),
              name: "checkout[invoice_name]",
              placeholder: "請填寫真實姓名"
            }, null, 512), [
              [vModelText, $setup.invoice.name]
            ])
          ]),
          _: 1
        })
      ]),
      _cache[13] || (_cache[13] = createTextVNode()),
      createElementVNode("div", _hoisted_5$1, [
        createVNode($setup["FormGroup"], { label: "電子發票載具" }, {
          default: withCtx(() => [
            withDirectives(createElementVNode("input", {
              type: "text",
              class: "form-control",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.invoice.carrier = $event),
              name: "checkout[invoice_carrier]",
              placeholder: "請填寫電子發票載具"
            }, null, 512), [
              [vModelText, $setup.invoice.carrier]
            ])
          ]),
          _: 1
        })
      ]),
      _cache[14] || (_cache[14] = createTextVNode()),
      createElementVNode("div", _hoisted_6$1, [
        createVNode($setup["FormGroup"], { label: "地址" }, {
          default: withCtx(() => [
            createElementVNode("div", _hoisted_7$1, [
              createElementVNode("div", _hoisted_8$1, [
                createVNode($setup["FormGroup"], { label: "" }, {
                  default: withCtx(() => [
                    withDirectives(createElementVNode("select", {
                      class: "form-select",
                      "data-city": "",
                      name: "checkout[address][city]",
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.invoice.address.city = $event)
                    }, null, 512), [
                      [vModelSelect, $setup.invoice.address.city]
                    ])
                  ]),
                  _: 1
                })
              ]),
              _cache[8] || (_cache[8] = createTextVNode()),
              createElementVNode("div", _hoisted_9$1, [
                createVNode($setup["FormGroup"], { label: "" }, {
                  default: withCtx(() => [
                    withDirectives(createElementVNode("select", {
                      class: "form-select",
                      "data-dist": "",
                      name: "checkout[address][dist]",
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.invoice.address.dist = $event)
                    }, null, 512), [
                      [vModelSelect, $setup.invoice.address.dist]
                    ])
                  ]),
                  _: 1
                })
              ]),
              _cache[9] || (_cache[9] = createTextVNode()),
              createElementVNode("div", _hoisted_10$1, [
                createVNode($setup["FormGroup"], { label: "" }, {
                  default: withCtx(() => [
                    withDirectives(createElementVNode("input", {
                      type: "text",
                      class: "form-control",
                      placeholder: "郵遞區號",
                      readonly: "",
                      "data-zip": "",
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.invoice.address.zip = $event),
                      name: "checkout[address][zip]"
                    }, null, 512), [
                      [
                        vModelText,
                        $setup.invoice.address.zip,
                        void 0,
                        { lazy: true }
                      ]
                    ])
                  ]),
                  _: 1
                })
              ]),
              _cache[10] || (_cache[10] = createTextVNode()),
              createElementVNode("div", _hoisted_11$1, [
                createVNode($setup["FormGroup"], null, {
                  default: withCtx(() => [
                    withDirectives(createElementVNode("input", {
                      type: "text",
                      class: "form-control",
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.invoice.address.address = $event),
                      name: "checkout[address][address]",
                      placeholder: "請填寫地址"
                    }, null, 512), [
                      [vModelText, $setup.invoice.address.address]
                    ])
                  ]),
                  _: 1
                })
              ])
            ])
          ]),
          _: 1
        })
      ])
    ])
  ]);
}
const InvoiceForm = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "InvoiceForm.vue"]]);
const formSelector = "#checkout-form";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MeloCartApp",
  props: {
    user: {},
    payments: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    onErrorCaptured((e) => {
      useHttpClient().then(({ isAxiosError }) => {
        if (isAxiosError(e)) {
          simpleAlert(e.response?.statusText ?? "錯誤發生", e.response?.data.message || e.message, "", "error");
        } else {
          simpleAlert(e.message, "", "error");
        }
      });
    });
    const items = ref([]);
    const invoice = ref({
      vat: "",
      title: "",
      name: "",
      carrier: "",
      address: {
        city: "",
        dist: "",
        zip: "",
        address: ""
      }
    });
    const payment = ref(Object.keys(props.payments)[0] ?? "");
    const totals = ref();
    const count = computed(() => items.value.length);
    const csrf = data("csrf-token");
    loadItems();
    const checkoutLink = route("checkoutLink");
    const lessonLink = route("search");
    async function loadItems() {
      const { get } = await useHttpClient();
      await get("@cart_ajax/getData").then((res) => {
        let data2 = res.data.data;
        items.value = data2.items;
        totals.value = data2.totals;
      }).catch((e) => {
        swal(e.statusText || "", e.message || "", "warning");
      });
    }
    async function deleteItem(item, i) {
      const { delete: del } = await useHttpClient();
      let hash = items.value[i].hash;
      items.value.splice(i, 1);
      await del(
        "@cart_ajax/deleteItem",
        { hash }
      );
      loadItems();
    }
    const __returned__ = { props, items, invoice, payment, totals, count, csrf, checkoutLink, lessonLink, loadItems, deleteItem, formSelector, CartItems, InvoiceForm, get formatPrice() {
      return formatPrice;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["action"];
const _hoisted_2 = { class: "row" };
const _hoisted_3 = { class: "col-md-8 d-flex flex-column gap-5" };
const _hoisted_4 = { class: "card" };
const _hoisted_5 = { class: "card-body" };
const _hoisted_6 = {
  key: 0,
  class: "position-relative c-cart-card__invalid"
};
const _hoisted_7 = { class: "c-cart-card__invalid-text text-center" };
const _hoisted_8 = ["href"];
const _hoisted_9 = {
  key: 0,
  class: "table-responsive bg-light"
};
const _hoisted_10 = { class: "card" };
const _hoisted_11 = { class: "card" };
const _hoisted_12 = { class: "card-body" };
const _hoisted_13 = { class: "row" };
const _hoisted_14 = { class: "col-md-7" };
const _hoisted_15 = ["value"];
const _hoisted_16 = { class: "col-md-4" };
const _hoisted_17 = {
  class: "card std-card c-cart-card position-sticky",
  style: { "top": "var(--melo-cart-sticky-top, 75px)" }
};
const _hoisted_18 = { class: "card-body" };
const _hoisted_19 = {
  key: 0,
  class: "d-flex justify-content-between mb-2"
};
const _hoisted_20 = { class: "text-base m-0" };
const _hoisted_21 = { class: "d-flex justify-content-between mb-2" };
const _hoisted_22 = { class: "text-base m-0" };
const _hoisted_23 = { class: "text-end mb-3" };
const _hoisted_24 = { class: "text-primary" };
const _hoisted_25 = { class: "d-grid gap-2" };
const _hoisted_26 = { class: "d-none" };
const _hoisted_27 = ["value"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("form", {
    id: "checkout-form",
    action: $setup.checkoutLink,
    method: "POST",
    enctype: "multipart/form-data"
  }, [
    createElementVNode("div", _hoisted_2, [
      createElementVNode("div", _hoisted_3, [
        createElementVNode("div", _hoisted_4, [
          createElementVNode("div", _hoisted_5, [
            _cache[4] || (_cache[4] = createElementVNode("h4", { class: "text-secondary mb-0" }, "\n              購物車\n            ", -1)),
            _cache[5] || (_cache[5] = createTextVNode()),
            !$setup.count ? (openBlock(), createElementBlock("div", _hoisted_6, [
              createElementVNode("div", _hoisted_7, [
                _cache[2] || (_cache[2] = createElementVNode("div", { class: "mb-4" }, "\n                  您的購物車是空的，來去逛逛！\n                ", -1)),
                _cache[3] || (_cache[3] = createTextVNode()),
                createElementVNode("a", {
                  href: $setup.lessonLink,
                  class: "btn btn-lg btn-primary h-btn px-4"
                }, "\n                  探索課程\n                ", 8, _hoisted_8)
              ])
            ])) : createCommentVNode("", true)
          ]),
          _cache[6] || (_cache[6] = createTextVNode()),
          $setup.count ? (openBlock(), createElementBlock("div", _hoisted_9, [
            createVNode($setup["CartItems"], {
              items: $setup.items,
              onDeleteItem: $setup.deleteItem
            }, null, 8, ["items"])
          ])) : createCommentVNode("", true)
        ]),
        _cache[11] || (_cache[11] = createTextVNode()),
        createElementVNode("div", _hoisted_10, [
          _cache[7] || (_cache[7] = createElementVNode("div", { class: "card-body border-bottom" }, [
            createElementVNode("h4", { class: "text-secondary m-0" }, "\n              電子發票開立資訊\n            ")
          ], -1)),
          _cache[8] || (_cache[8] = createTextVNode()),
          createVNode($setup["InvoiceForm"], {
            class: "card-body",
            modelValue: $setup.invoice,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.invoice = $event),
            formSelector: $setup.formSelector
          }, null, 8, ["modelValue"])
        ]),
        _cache[12] || (_cache[12] = createTextVNode()),
        createElementVNode("div", _hoisted_11, [
          _cache[9] || (_cache[9] = createElementVNode("div", { class: "card-body border-bottom" }, [
            createElementVNode("h4", { class: "text-secondary m-0" }, "\n              付款方式\n            ")
          ], -1)),
          _cache[10] || (_cache[10] = createTextVNode()),
          createElementVNode("div", _hoisted_12, [
            createElementVNode("div", _hoisted_13, [
              createElementVNode("div", _hoisted_14, [
                withDirectives(createElementVNode("select", {
                  class: "form-select",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.payment = $event),
                  name: "checkout[payment]"
                }, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList($props.payments, (payment, key) => {
                    return openBlock(), createElementBlock("option", {
                      key,
                      value: key
                    }, toDisplayString(payment.title), 9, _hoisted_15);
                  }), 128))
                ], 512), [
                  [vModelSelect, $setup.payment]
                ])
              ])
            ])
          ])
        ])
      ]),
      _cache[22] || (_cache[22] = createTextVNode()),
      createElementVNode("div", _hoisted_16, [
        createElementVNode("div", _hoisted_17, [
          _cache[20] || (_cache[20] = createElementVNode("div", { class: "card-body border-bottom" }, [
            createElementVNode("h4", { class: "text-secondary m-0" }, "\n              訂單明細\n            ")
          ], -1)),
          _cache[21] || (_cache[21] = createTextVNode()),
          createElementVNode("div", _hoisted_18, [
            $setup.count ? (openBlock(), createElementBlock("div", _hoisted_19, [
              _cache[13] || (_cache[13] = createElementVNode("div", { class: "text-base" }, "\n                總計\n              ", -1)),
              _cache[14] || (_cache[14] = createTextVNode()),
              createElementVNode("h5", _hoisted_20, toDisplayString($setup.count) + " 堂課\n              ", 1)
            ])) : createCommentVNode("", true),
            _cache[17] || (_cache[17] = createTextVNode()),
            createElementVNode("div", _hoisted_21, [
              _cache[15] || (_cache[15] = createElementVNode("div", { class: "text-base" }, "\n                小計\n              ", -1)),
              _cache[16] || (_cache[16] = createTextVNode()),
              createElementVNode("h5", _hoisted_22, toDisplayString($setup.formatPrice($setup.totals?.lesson_total?.price)), 1)
            ]),
            _cache[18] || (_cache[18] = createTextVNode()),
            createElementVNode("div", _hoisted_23, [
              createElementVNode("h3", _hoisted_24, toDisplayString($setup.formatPrice($setup.totals?.grand_total?.price)), 1)
            ]),
            _cache[19] || (_cache[19] = createTextVNode()),
            createElementVNode("div", _hoisted_25, [
              createElementVNode("button", {
                type: "submit",
                class: normalizeClass(["btn disable-on-submit", $setup.count ? "btn-primary" : "btn-outline-base disabled"])
              }, "\n                確定結賬\n              ", 2)
            ])
          ])
        ])
      ])
    ]),
    _cache[23] || (_cache[23] = createTextVNode()),
    createElementVNode("div", _hoisted_26, [
      createElementVNode("input", {
        name: "anticsrf",
        type: "hidden",
        value: $setup.csrf
      }, null, 8, _hoisted_27)
    ])
  ], 8, _hoisted_1);
}
const MeloCartApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "MeloCartApp.vue"]]);
function createMeloCartApp(props = {}) {
  const app = createApp(
    MeloCartApp,
    props
  );
  app.component("CartItems");
  return app;
}
export {
  createMeloCartApp
};
//# sourceMappingURL=melo-cart.js.map
