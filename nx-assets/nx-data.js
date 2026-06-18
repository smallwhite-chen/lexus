/* ============================================================
   NX 車款介紹 Wireframe · 內容資料層
   結構性標籤 = 英文 mono；內容 = 繁中。皆為線框示意文字。
   ============================================================ */
window.NXData = (function () {

  // 區段文章（第二層詳細）共用產生器
  const art = (lead, paras) => ({ lead, paras });

  // ── 車款亮點（跨類別 3–5）──
  const highlights = [
    { en: 'PERFORMANCE', cat: '性能', title: '2.5L 雙動力', value: '309 PS', bigHtml: '<b>2.5</b><span>升 L4引擎</span><b>309</b><span>PS</span>', note: '最大綜效馬力 · HEV / PHEV 雙選擇' },
    { en: 'SAFETY', cat: '安全', title: 'Lexus Safety System', value: '+3.0', note: '智能主動安全科技全面進化' },
    { en: 'DESIGN', cat: '外觀', title: 'Spindle Grille', value: '紡錘', note: '無邊際紡錘形水箱護罩' },
    { en: 'INTERIOR', cat: '內裝', title: 'Tazuna 座艙', value: '14"', note: '以駕駛者為中心的人機介面' },
  ];

  // ── 360 賞車：兩層切換 ──
  const threeSixty = {
    views: [
      { id: 'ext', label: '外觀', en: 'EXTERIOR' },
      { id: 'int', label: '內裝', en: 'INTERIOR' },
    ],
    colors: {
      ext: [
        { hex: '#e9eaec', name: '雪松白' }, { hex: '#c7ccd2', name: '銀河鋁' },
        { hex: '#8d949c', name: '冷鋼灰' }, { hex: '#3b4654', name: '深藍灰' },
        { hex: '#21262b', name: '曜石黑' }, { hex: '#2b3b50', name: '極光藍' },
        { hex: '#6b3a3a', name: '緋焰紅' }, { hex: '#c7b79b', name: '砂岩棕' },
      ],
      int: [
        { hex: '#1c1f24', name: '曜黑真皮' }, { hex: '#3a3f47', name: '岩灰真皮' },
        { hex: '#6b3a3a', name: '勃艮地' }, { hex: '#c7b79b', name: '亞麻白' },
      ],
    },
    frames: 24,
  };

  // ── 特色：六大分類（外觀 / 內裝 / 性能 / 安全 / 充電 / Lexus Link）──
  // optional: 充電、link 為條件顯示
  const features = [
    {
      id: 'ext', cat: '外觀', en: 'Design', sub: 'THE NEXT',
      cn: '全進化休旅',
      items: [
        { t: '紡錘形水箱護罩', en: 'SPINDLE GRILLE', d: '無邊際格柵設計，立體層次強化前臉辨識度。',
          a: art('NX 以無邊際紡錘形水箱護罩，重新定義家族識別。', ['立體鑽石格柵由疏至密漸變，營造深邃光影。', '與兩側鏡頭式燈組一氣呵成，視覺重心更低伏。']) },
        { t: '鏡頭式 LED 頭燈', en: 'LED HEADLAMP', d: '三眼鏡頭式投射，搭配箭矢型日行燈。',
          a: art('鏡頭式 LED 頭燈，照明效率與辨識度兼具。', ['箭矢型日行燈呼應 L 型家族語彙。', '自動遠近光與轉向輔助照明，夜間行車更安心。']) },
        { t: '貫穿式 LED 尾燈', en: 'TAIL LAMP', d: '橫貫車尾的一體燈條，點亮 LEXUS 字標。',
          a: art('貫穿式尾燈以單一線條串聯車尾。', ['點亮時呈現完整 LEXUS 字標。', '低伏燈型強化寬體視覺。']) },
        { t: '21 吋鋁合金輪圈', en: '21" ALLOY WHEEL', d: 'F SPORT 專屬切削雙色輪圈。',
          a: art('21 吋切削雙色輪圈，強化跑格姿態。', ['輪拱填滿度提升，視覺更具張力。']) },
        { t: '全景式電動天窗', en: 'PANORAMIC ROOF', d: '大面積採光，前段可電動開閉。',
          a: art('全景天窗引入充足自然光。', ['電動遮陽簾一鍵控制。']) },
        { t: '雙色對比車頂', en: 'BI-TONE ROOF', d: '黑化車頂與車身形成漂浮視覺。',
          a: art('雙色車頂營造漂浮車頂視覺。', ['可依車色搭配對比配置。']) },
        { t: '感應式電動尾門', en: 'POWER TAILGATE', d: '腳踢感應開啟，高度可記憶。',
          a: art('感應式電動尾門，雙手提物也從容。', ['開啟高度可記憶，適應不同車庫。']) },
      ],
    },
    {
      id: 'int', cat: '內裝', en: 'INTERIOR', sub: 'TAZUNA COCKPIT PLEASURE',
      cn: '全環繞駕駛座艙 完美實現駕馭渴望',
      items: [
        { t: 'Tazuna 駕馭座艙', en: 'TAZUNA', d: '控制集中於方向盤，視線無需離開路面。',
          a: art('Tazuna 概念取自「韁繩」，人車合一。', ['核心控制集中於方向盤周圍。', '降低視線移動，專注駕馭。']) },
        { t: '14 吋觸控螢幕', en: '14" TOUCHSCREEN', d: '高解析中控螢幕，整合多媒體與空調。',
          a: art('14 吋觸控螢幕為座艙資訊核心。', ['支援無線 Apple CarPlay / Android Auto。']) },
        { t: '全數位儀表', en: 'DIGITAL CLUSTER', d: '可自訂顯示資訊的全數位儀表。',
          a: art('全數位儀表依駕駛模式切換樣式。', ['可顯示導航、能量流與駕駛輔助資訊。']) },
        { t: '抬頭顯示器 HUD', en: 'HEAD-UP DISPLAY', d: '將車速與導航投影於前擋風玻璃。',
          a: art('彩色抬頭顯示器讓資訊就在視線前方。', ['整合導航轉向與輔助系統提示。']) },
        { t: 'Mark Levinson 音響', en: 'MARK LEVINSON', d: '17 支揚聲器環繞，重現現場聆聽。',
          a: art('Mark Levinson 環場音響系統。', ['17 支揚聲器精準調校，層次分明。']) },
        { t: '無線充電座', en: 'WIRELESS CHARGE', d: '中央鞍座無線充電，置物即充。',
          a: art('無線充電座放置即充。', ['搭配多組 USB-C 供電。']) },
        { t: '64 色環艙氣氛燈', en: 'AMBIENT LIGHT', d: '可調 64 色，營造夜間氛圍。',
          a: art('64 色環艙氣氛燈點綴座艙。', ['可隨駕駛模式聯動變化。']) },
      ],
    },
    {
      id: 'perf', cat: '性能', en: 'PERFORMANCE', sub: 'DRIVING SIGNATURE',
      cn: '為您打造更多元的動力選擇',
      items: [
        { t: '2.5L Dynamic Force', en: 'ENGINE', d: '高熱效率引擎，平順且充沛。',
          a: art('2.5L Dynamic Force 引擎兼顧效率與動力。', ['高壓縮比設計，熱效率領先同級。']) },
        { t: 'E-FOUR 電子四驅', en: 'E-FOUR AWD', d: '後軸獨立電動馬達，即時分配動力。',
          a: art('E-FOUR 電子四驅提升濕滑路面循跡。', ['後軸馬達即時介入，無須傳動軸。']) },
        { t: 'PHEV 插電動力', en: 'PLUG-IN HYBRID', d: '純電續航與油電彈性兼得。',
          a: art('NX 450h+ 搭載 PHEV 插電動力。', ['可純電通勤，長途則切換油電。']) },
        { t: 'Direct Shift 變速', en: 'TRANSMISSION', d: '低速齒比銜接，起步更線性。',
          a: art('Direct Shift 設計兼顧反應與順暢。', ['低速段以實體齒比帶來直接感。']) },
        { t: 'Drive Mode 駕駛模式', en: 'DRIVE MODE', d: 'ECO / NORMAL / SPORT 一鍵切換。',
          a: art('多種駕駛模式對應不同情境。', ['SPORT 模式收緊油門與轉向手感。']) },
        { t: '主動式可變懸吊', en: 'AVS', d: '即時調整阻尼，兼顧舒適與支撐。',
          a: art('AVS 主動懸吊隨路況調整阻尼。', ['過彎更穩定，巡航更舒適。']) },
      ],
    },
    {
      id: 'safety', cat: '安全', en: 'SAFETY', sub: 'LEXUS SAFETY SYSTEM +3.0',
      cn: '主動安全科技 全面守護',
      items: [
        { t: '預警式碰撞警示 PCS', en: 'PCS', d: '偵測前方車輛、行人與自行車並輔助煞停。',
          a: art('PCS 預警式防護系統偵測潛在碰撞。', ['可辨識行人、自行車與路口來車。', '必要時主動煞車輔助，降低事故風險。']) },
        { t: '車道偏離警示 LDA', en: 'LDA', d: '偵測車道線，偏移時提出警示。',
          a: art('LDA 監測車道標線。', ['無預警偏移時以方向盤震動提醒。']) },
        { t: '車道循跡輔助 LTA', en: 'LTA', d: '輔助維持車道置中，減輕長途疲勞。',
          a: art('LTA 協助車輛保持於車道中央。', ['搭配 DRCC 提供半自動巡航體驗。']) },
        { t: '動態雷達定速 DRCC', en: 'DRCC', d: '全速域跟車，自動維持安全車距。',
          a: art('DRCC 全速域跟車巡航。', ['前車減速自動跟隨，停車後可再起步。']) },
        { t: '盲點偵測 BSM', en: 'BSM', d: '後視鏡警示後方死角來車。',
          a: art('BSM 盲點偵測提醒側後方車輛。', ['變換車道更安心。']) },
        { t: '後方車側警示 RCTA', en: 'RCTA', d: '倒車時偵測左右橫向來車。',
          a: art('RCTA 倒車時警示橫向來車。', ['停車場出車更安全。']) },
        { t: '全景影像 PVM', en: 'PANORAMIC VIEW', d: '環景監控，狹窄空間零死角。',
          a: art('全景影像系統提供環車視野。', ['狹窄停車格也能輕鬆判斷。']) },
      ],
    },
    {
      id: 'charge', cat: '充電', en: 'CHARGING', sub: 'PLUG-IN CHARGING', optional: true,
      cn: '便利充電體驗',
      items: [
        { t: '普通充電 AC', en: 'AC CHARGING', d: '家用充電樁夜間滿電，日常通勤無虞。',
          a: art('AC 普通充電適合居家夜間補電。', ['約數小時可充滿，清晨即可純電出發。']) },
        { t: '純電行駛 EV Mode', en: 'EV MODE', d: '市區短程可全程純電，安靜零排放。',
          a: art('EV 模式下以純電行駛。', ['市區通勤幾乎免進加油站。']) },
        { t: '智慧充電排程', en: 'SMART CHARGE', d: '透過 App 預約離峰時段充電。',
          a: art('智慧充電排程善用離峰電價。', ['可遠端設定充電時段與上限。']) },
        { t: '外部供電 V2L', en: 'V2L', d: '化身行動電源，戶外供電 110V。',
          a: art('V2L 讓車輛成為行動電源。', ['露營、戶外活動皆可供電。']) },
        { t: '能量流顯示', en: 'ENERGY FLOW', d: '儀表即時呈現電能與油耗流向。',
          a: art('能量流畫面讓駕駛掌握動力分配。', ['協助養成更省能的駕駛習慣。']) },
      ],
    },
    {
      id: 'link', cat: 'Lexus Link', en: 'LEXUS LINK +', sub: '全新智能車載系統', optional: true,
      cn: '車聯生活 隨時相連',
      items: [
        { t: 'Lexus Link+ App', en: 'APP', d: '手機掌握車況、油電量與保養提醒。',
          a: art('Lexus Link+ App 是您的隨身車鑰。', ['查看車況、續航與保養時程。']) },
        { t: '遠端遙控空調', en: 'REMOTE A/C', d: '上車前先行調節車內溫度。',
          a: art('遠端啟動空調，上車即享舒適。', ['夏季先降溫、冬季先暖房。']) },
        { t: '車輛定位', en: 'VEHICLE FINDER', d: '地圖標記停車位置，免找車。',
          a: art('車輛定位協助於大型停車場尋車。', ['同步導航步行路線。']) },
        { t: '緊急救援 SOS', en: 'SOS', d: '事故自動通報，一鍵專人協助。',
          a: art('SOS 緊急救援於事故時自動通報。', ['專人即時聯繫，必要時派遣救援。']) },
        { t: 'OTA 軟體更新', en: 'OTA', d: '系統功能隨時保持最新。',
          a: art('OTA 線上更新車載系統。', ['無須進廠即可獲得新功能。']) },
      ],
    },
  ];

  // ── 重點比較（各等級）──
  const compare = [
    { grade: 'NX 450h', power: 'PHEV', price: '237.5', diff: ['插電式油電混合動力', '純電續航最長', '三區恆溫空調', '64 色氣氛燈'] },
    { grade: 'NX 350h', power: 'HEV', price: '184.0', diff: ['油電混合動力', 'E-Four 電子四驅', '電動記憶座椅', '抬頭顯示器'] },
    { grade: 'NX 200', power: '汽油', price: '142.0', diff: ['2.0L 自然進氣', '前輪驅動', '入門價格帶'] },
  ];

  // ── 規格表（RWD：手機單欄／平板桌機三欄比較）──
  const grades = ['NX 450h+ F SPORT', 'NX 450h+ 旗艦版', 'NX 350h 旗艦版'];
  const spec = {
    model: 'NX 350h 旗艦版',
    price: ['284.5', '237.5', '257.5'],
    groups: [
      { group: '尺寸重量', rows: [
        { k: '年式', v: ['2026', '2026', '2026'] },
        { k: '車長（mm）', v: ['4,660', '4,660', '4,660'] },
        { k: '車寬（mm）', v: ['1,865', '1,865', '1,865'] },
        { k: '車高（mm）', v: ['1,670', '1,670', '1,670'] },
        { k: '軸距（mm）', v: ['2,690', '2,690', '2,690'] },
        { k: '前輪距（mm）', v: ['1,610', '1,605', '1,605'] },
        { k: '後輪距（mm）', v: ['1,630', '1,625', '1,625'] },
        { k: '車輛空重（kg）', v: ['2,010', '2,000', '1,805'] },
        { k: '最低離地高（mm）', v: ['185', '195', '195'] },
        { k: '進坡角（°）', v: ['15°', '15°', '15°'] },
        { k: '離坡角（°）', v: ['25°', '25°', '25°'] },
        { k: '最小迴轉半徑（m）', v: ['6.0', '5.8', '5.8'] },
        { k: '油箱容量（L）', v: ['55', '55', '55'] },
        { k: '行李廂空間（L）', v: ['437–1,141', '437–1,141', '520–1,411'] },
        { k: '輪胎尺寸', v: ['235 / 50 R20', '235 / 60 R18', '235 / 50 R20'] },
        { k: '輪圈型式', v: ['20 吋鋁圈', '18 吋鋁圈', '20 吋鋁圈'] },
        { k: '最大乘載人數', v: ['5', '5', '5'] },
      ]},
      { group: '引擎規格', rows: [
        { k: '引擎型式', v: ['A25A-FXS 2.5 升 L4 引擎', 'A25A-FXS 2.5 升 L4 引擎', 'A25A-FXS 2.5 升 L4 引擎'] },
        { k: 'VVT-iE 電子式進氣閥門正時控制系統', v: ['●', '●', '●'] },
        { k: '可變汽門正時控制系統', v: ['VVT-iE（進氣閥）/ VVT-i（排氣閥）', 'VVT-iE（進氣閥）/ VVT-i（排氣閥）', 'VVT-iE（進氣閥）/ VVT-i（排氣閥）'] },
        { k: '燃油系統', v: ['D-4S 多重燃油噴射（缸內直噴及多點燃油噴射）', 'D-4S 多重燃油噴射（缸內直噴及多點燃油噴射）', 'D-4S 多重燃油噴射（缸內直噴及多點燃油噴射）'] },
        { k: '排氣量（c.c.）', v: ['2,487', '2,487', '2,487'] },
      ]},
      { group: '動力性能數據', rows: [
        { k: '最大馬力（EEC-NET）', v: ['185 PS / 6,000 rpm', '185 PS / 6,000 rpm', '190 PS / 6,000 rpm'] },
        { k: '最大扭力（EEC-NET）', v: ['22.9 kg-m / 3,200–3,700 rpm', '22.9 kg-m / 3,200–3,700 rpm', '24.4 kg-m / 4,300–4,500 rpm'] },
        { k: '加速性能（0–100 km/h）', v: ['6.3 秒', '6.3 秒', '8.7 秒'] },
        { k: '安全極速（km/h）', v: ['200', '200', '200'] },
      ]},
      { group: 'Hybrid 系統規格', rows: [
        { k: 'Hybrid 永磁電動馬達規格 MG 1（Motor / Generator）', v: ['650 V，啟動引擎', '650 V，啟動引擎', '650 V，啟動引擎'] },
        { k: 'Hybrid 永磁電動馬達規格 MG 2（Motor / Generator）', v: ['650 V，前軸 182 PS / 27.5 kg-m', '650 V，前軸 182 PS / 27.5 kg-m', '650 V，驅動前輪，182 PS / 27.5 kg-m'] },
        { k: 'HV 電池型式', v: ['鋰離子電池', '鋰離子電池', '鋰離子電池'] },
        { k: 'HV 電池數量', v: ['96', '96', '70'] },
        { k: 'HV 電池電壓', v: ['355 V', '355 V', '259 V'] },
        { k: 'Hybrid 系統性能最大輸出', v: ['309 PS', '309 PS', '243 PS'] },
      ]},
      { group: '油耗表現', rows: [
        { k: '市區型態（km / L）*1', v: ['16.5', '16.5', '18.31'] },
        { k: '非市區型態（km / L）*1', v: ['18.0', '18.0', '20.6'] },
        { k: '測試值（平均）（km / L）*1', v: ['16.8', '16.8', '19.7'] },
        { k: '年耗油量（L）*2', v: ['893', '893', '761'] },
        { k: '能源效率等級 *3', v: ['1', '1', '1'] },
        { k: '測試方法 *4', v: ['歐盟 1999/100/EC（NEDC）', '歐盟 1999/100/EC（NEDC）', '歐盟 1999/100/EC（NEDC）'] },
      ]},
      { group: '變速箱 / 行駛模式 / 驅動方式', rows: [
        { k: '變速箱', v: ['Hybrid ECVT 電子無段變速系統（附 6 速手自排功能）', 'Hybrid ECVT 電子無段變速系統（附 6 速手自排功能）', 'Hybrid ECVT 電子無段變速系統（附 6 速手自排功能）'] },
        { k: '智能多重駕馭模式', v: ['EV / ECO / NORMAL / SPORT', 'EV / ECO / NORMAL / SPORT', 'EV / ECO / NORMAL / SPORT'] },
        { k: '驅動方式', v: ['E-Four 電子四驅', 'E-Four 電子四驅', 'FF 前輪驅動'] },
      ]},
      { group: '轉向系統', rows: [
        { k: 'EPS 電子動力方向盤（Electric Power Steering）', v: ['●', '●', '●'] },
      ]},
      { group: '懸吊系統', rows: [
        { k: '前懸吊', v: ['獨立麥花臣（AVS）', '獨立麥花臣', '獨立麥花臣'] },
        { k: '後懸吊', v: ['獨立雙 A 臂', '獨立雙 A 臂', '獨立雙 A 臂'] },
      ]},
      { group: '煞車系統', rows: [
        { k: '前輪', v: ['通風碟', '通風碟', '通風碟'] },
        { k: '後輪', v: ['通風碟', '通風碟', '通風碟'] },
      ]},
    ],
    notes: [
      '*1 油耗值資料來源：經濟部能源署公布資訊。',
      '*2 以年平均行駛 15,000 公里除以油耗測試值計算。',
      '*3 排氣量等級：NX 450h、NX 350h 為超過 2,400 c.c. 至 3,000 c.c.；NX 350、NX 200 為超過 1,800 c.c. 至 2,400 c.c.。',
      '*4 車輛實際油耗會因駕駛習慣、路況、載重與配備條件等因素而有所不同，測試值僅供參考。',
      '本型錄所載之規格配備以實車為準，LEXUS 保留隨時變更之權利，不另行通知。',
    ],
  };

  // ── 配備表（分類 accordion → 項目可展開：圖片輪播 + 說明 + 配備車型）──
  // eq(名稱, 說明, 圖片張數, 配備此項的車型)
  const GRADES = ['NX 200', 'NX 350', 'NX 350h 旗艦', 'NX 450h+ F SPORT'];
  const equip = [
    { cat: '外觀配備', items: [
      '日間行車燈',
      '頭燈型式（近燈／遠燈）',
      '頭燈清洗器',
      '前／後霧燈',
      '尾燈型式',
      'Smart Access 智慧型車門啟閉控制系統',
      '電動開闔附自動吸附式尾門',
      '感應式電動開闔附自動吸附式尾門',
      '全景式天窗（附電動遮陽板）',
      '後擋、後車窗暗色玻璃',
      '電動調整收納車外後視鏡（附 R 檔自動向下調整）',
      '自動防眩車外後視鏡（附電熱除霧功能）',
      '車頂置物架',
      '後導流尾翼',
      '排氣尾管樣式',
    ]},
    { cat: '內裝配備', items: [
      'Push Start 引擎觸控啟動開關',
      '多功能資訊整合系統',
      '資訊整合系統操控介面',
      'LEXUS 原廠中文衛星導航系統（附 3D 顯示功能）',
      '藍牙通訊系統',
      '方向盤材質',
      '方向盤調整功能（附音響、藍牙通訊、定速、旅程資訊控制鍵）',
      '方向盤換檔撥片',
      'HUD 多功能抬頭顯示幕（Heads-up Display）',
      '內裝飾板',
      '室內環景 LED 燈光組',
      '智慧型手機無線充電介面',
      '前座觸控式閱讀燈',
      '自動防眩車內後視鏡',
      '數位式車內後視鏡',
      '鍍鉻門檻',
      'e-Latch 電子式門把',
    ]},
    { cat: '座椅', items: [
      '座椅材質',
      '駕駛座電動調整座椅',
      '前乘客座電動調整座椅',
      '駕駛座腰背扶力調整',
      '雙前座通風座椅',
      '雙前座電熱座椅',
      '駕駛座椅記憶功能（附方向盤、車外後視鏡角度連動記憶）',
      '後座調整座椅',
      '後座電熱座椅',
      '後座 60：40 分離座椅',
    ]},
    { cat: '空調', items: [
      '智慧型空調管家',
      '獨立式恆溫控制空調系統',
      '花粉過濾裝置',
      'nanoe™ X 空氣清淨系統',
      '後座空調出風口',
    ]},
    { cat: '音響', items: [
      '音響系統',
      '揚聲器數量',
      'USB／AUX-IN 外接式音源高速傳輸介面',
      '支援 Apple CarPlay & Android Auto 智慧型手機連結',
    ]},
    { cat: '主動安全配備', items: [
      'Lexus Safety System 3.0 智動駕駛輔助系統',
      'PCS 預警式防護系統（自動煞車輔助）（Pre-Crash Safety System with Pre-Crash Brake）',
      'PCS 預警式防護系統（支援路口辨識）（PCS Intersection Assistance）',
      'ESA 緊急閃避輔助（Emergency Steering Assist）',
      '低速限速輔助（Acceleration Suppression at Low Speed）',
      'DRCC 全速域雷達感應式車距維持定速系統（Dynamic Radar Cruise Control System）',
      'LDA 車道偏離警示系統（Lane Departure Alert）',
      'LTA 車道循跡輔助系統（Lane Tracing Assist）',
      'AHS 智慧型遠光燈自動遮蔽系統（Adaptive High-beam System）',
      'AHB 智慧型遠光燈自動切換系統（Automatic High Beam）',
      'RSA 速限辨識輔助（Road Sign Assist）',
      'DSC 檔位誤入動力限制系統（Drive-start Control）',
      'ECB 電子式煞車控制系統（Electronically Controlled Brake）',
      'ACA 主動式轉向輔助系統（Active Cornering Assist）',
      'VSC 車輛穩定控制系統（Vehicle Stability Control）',
      'TRC 循跡防滑控制系統（Traction Control）',
      'ABS 防鎖定煞車系統（Anti-lock Brake System）',
      'BAS 煞車力道輔助系統（Brake Assist System）',
      'EBD 電子煞車力道分配系統（Electronic Brake Force Distribution）',
      'HAC 上坡起步輔助系統（Hill-start Assist Control）',
      'EPB 電子駐車煞車系統（Electric Parking Brake）',
      'HOLD 定車煞車輔助系統',
      'BSM 盲點偵測警示系統（Blind Spot Monitor）',
      'SEA 安全離座輔助含車門鎖連動（Safe Exit Assist）',
      'RCTA 後方車側警示系統（Rear Cross Traffic Alert）',
      'RCTB 後方車流煞車輔助系統（Rear Cross Traffic Brake）',
      '轉向輔助燈（Cornering Lamps）',
      '頭燈照射角度水平調整',
      '頭尾燈自動啟閉系統',
      '車速／雨滴感應式雨刷',
      '後擋風玻璃間歇式雨刷',
      '停車輔助系統',
      'ICS 智慧停車輔助系統（Intelligent Clearance Sonar）',
      'AP 自動停車輔助系統（Advanced Park）',
      '倒車影像輔助系統',
      '360 度環景影像輔助系統（Panoramic View Monitor）',
      '煞車燈緊急煞車閃爍功能',
      'TPWS 胎壓偵測警示系統（Tire Pressure Warning System）',
      '車輛接近警示系統',
    ]},
    { cat: '被動安全配備', items: [
      '雙前座智慧型 SRS 氣囊',
      '駕駛座膝部 SRS 氣囊',
      '雙前座椅側內置式 SRS 氣囊',
      '雙車側簾式 SRS 氣囊',
      '前座中央防碰撞 SRS 氣囊',
      '前乘客座乘員重量感知裝置',
      '預縮式束力限制安全帶',
      '高剛性車體',
      'WIL 頸椎傷害緩和座椅（Whiplash Injury Lessening）',
      'HIP 頭部衝擊緩和結構（Head Impact Protection）',
      'ISOFIX 兒童安全座椅固定裝置',
    ]},
    { cat: '保全系統', items: [
      '引擎禁制啟動防盜系統',
      '侵入感知器',
    ]},
    { cat: '保固', items: [
      '基本保固',
      '生鏽與漆面不良保固',
      '車身鏽蝕穿孔保固',
      '電瓶保固',
      'Hybrid 系統保固（轉換器含變壓器、電池控制模組、馬達控制模組、HV 控制模組、MG 永磁電動馬達）',
      'Hybrid 系統保固（HV 電池）',
    ]},
  ];

  // ── FAQ（分類切換 + accordion）──
  const faq = [
    { cat: '購車', items: [
      { q: 'NX 目前有哪些車型可選？', a: '提供 450h+（PHEV）、350h（HEV）、350 與 200（汽油）等動力，並有 F SPORT 與旗艦等不同等級。' },
      { q: '可以線上預約試駕嗎？', a: '可透過官網或 Lexus Link App 選擇據點與時段預約，專人將與您聯繫確認。' },
      { q: '是否提供購車優惠或分期方案？', a: '不定期推出購車優惠與彈性分期方案，詳情以各據點公告為準。' },
    ]},
    { cat: '充電 / 動力', items: [
      { q: 'PHEV 純電可以跑多遠？', a: 'NX 450h+ 於滿電狀態下純電續航約 76 公里，足以涵蓋多數市區通勤。' },
      { q: '家裡需要安裝充電樁嗎？', a: '建議安裝家用 AC 充電樁以利夜間補電；亦可使用公共充電站。' },
      { q: 'HEV 與 PHEV 差別是什麼？', a: 'HEV 無須外部充電、以油電自動切換；PHEV 可外接充電並具備較長純電行駛能力。' },
    ]},
    { cat: '保養 / 保固', items: [
      { q: '保養週期多久一次？', a: '建議每 1 萬公里或半年進廠保養一次，實際依儀表保養提示為準。' },
      { q: '混合動力電池保固多久？', a: '混合動力電池享有原廠延長保固，詳細條件請洽授權經銷商。' },
    ]},
  ];

  return { highlights, threeSixty, features, compare, grades, spec, equip, equipGrades: GRADES, faq };
})();
