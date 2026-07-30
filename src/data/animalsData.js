export const animalsData = [
  {
    id: "cat",
    sortOrder: 1,
    status: "published",
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-23T14:00:00Z",
    publishedAt: "2026-07-22T08:00:00Z",
    names: {
      zh: "貓",
      en: "Cat"
    },
    postureType: "digitigrade", // digitigrade | unguligrade | plantigrade
    wikiUrl: "https://zh.wikipedia.org/wiki/貓",
    scientificClassification: {
      kingdom: "動物界（Animalia）",
      phylum: "脊索動物門（Chordata）",
      class: "哺乳綱（Mammalia）",
      order: "食肉目（Carnivora）",
      family: "貓科（Felidae）",
      genus: "貓屬（Felis）",
      species: "斑貓（Felis catus）"
    },
    briefDescription: "貓是敏捷的小型食肉動物，以極具彈性的脊椎、快速反射與可伸縮爪聞名。牠們在控制囓齒動物與情感陪伴上，與人類建立了悠久的互利共生關係。",
    coverImage: {
      url: "/assets/animals/cat/cover.jpg",      // 本地路徑，前端顯示用
      sourceUrl: "https://unsplash.com/photos/russian-blue-cat-on-brown-textile-rDbA71Ds0xw", // 授權宣告
      sourceImage: "https://images.unsplash.com/photo-1629624466945-3999c586a130", // 原始圖檔，素材管理用
      sourceName: "Unsplash",
      uploader: {
        name: "Frederic Christian",
        profileUrl: "https://unsplash.com/@freddyfromcgn"
      }
    },
    breeds: [],
    angles: {
      front: {
        skeleton: "/assets/animals/cat/front_skeleton.png", // 通用正視角骨骼（含英文標記）
        photos: []
      },
      side: {
        skeleton: "/assets/animals/cat/side_skeleton.png", // 通用側面骨骼（含英文標記）
        photos: []
      },
      threeQuarter: {
        skeleton: "/assets/animals/cat/threequarter_skeleton.png", // 通用3/4面骨骼（含英文標記）
        photos: []
      }
    },
    funFacts: [
      "貓具有「漂浮鎖骨」，鎖骨未與其他骨骼直接相連，這使牠們能穿過任何頭部能擠過的狹窄空間。",
      "貓的每隻耳朵擁有32塊獨立肌肉，能靈活旋轉180度，以極高精度定位微弱的聲音來源。"
    ],
    similarAnimalIds: ["dog"]
  },
  {
    id: "dog",
    sortOrder: 2,
    status: "published",
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-23T14:00:00Z",
    publishedAt: "2026-07-22T08:00:00Z",
    names: {
      zh: "狗",
      en: "Dog"
    },
    postureType: "digitigrade",
    wikiUrl: "https://zh.wikipedia.org/wiki/狗",
    scientificClassification: {
      kingdom: "動物界（Animalia）",
      phylum: "脊索動物門（Chordata）",
      class: "哺乳綱（Mammalia）",
      order: "食肉目（Carnivora）",
      family: "犬科（Canidae）",
      genus: "犬屬（Canis）",
      species: "家犬（Canis familiaris）"
    },
    briefDescription: "狗是適應長途奔跑的群居性肉食動物，具有強壯直立的趾骨與靈敏嗅覺。作為首個被馴化的動物，犬隻在生理與情感上與人類建立了深厚的共生紐帶。",
    coverImage: {
      url: "/assets/animals/dog/cover.jpg",      // 本地路徑，前端顯示用
      sourceUrl: "https://unsplash.com/photos/smiling-golden-retriever-dog-among-yellow-flowers-F99ck4IlmjA", // 授權宣告
      sourceImage: "https://images.unsplash.com/photo-1783441286539-e5a70da0b805", // 原始圖檔，素材管理用
      sourceName: "Unsplash",
      uploader: {
        name: "Wojciech Wyszkowski",
        profileUrl: "https://unsplash.com/@fotodruk"
      }
    }
    ,
    breeds: [
      {
        id: "golden_retriever",
        names: {
          zh: "黃金獵犬",
          en: "Golden Retriever"
        },
        sizeCategory: "large"
      },
      {
        id: "labrador_retriever",
        names: {
          zh: "拉不拉多犬",
          en: "Labrador Retriever"
        },
        sizeCategory: "large"
      },
      {
        id: "husky",
        names: {
          zh: "哈士奇",
          en: "Siberian Husky"
        },
        sizeCategory: "large"
      },
      {
        id: "welsh_corgi",
        names: {
          zh: "柯基犬",
          en: "Welsh Corgi"
        },
        sizeCategory: "medium"
      },
      {
        id: "border_collie",
        names: {
          zh: "邊境牧羊犬",
          en: "Border Collie"
        },
        sizeCategory: "medium"
      },
      {
        id: "beagle",
        names: {
          "zh": "米格魯",
          "en": "Beagle"
        },
        sizeCategory: "medium"
      },
      {
        id: "shiba_inu",
        names: {
          zh: "柴犬",
          en: "Shiba Inu"
        },
        sizeCategory: "medium"
      },
      {
        id: "taiwan_dog",
        names: {
          zh: "台灣犬",
          en: "Taiwan Dog"
        },
        sizeCategory: "medium"
      },
      {
        id: "dachshund",
        names: {
          zh: "臘腸犬",
          en: "Dachshund"
        },
        sizeCategory: "small"
      },
      {
        id: "west_highland_white_terrier",
        names: {
          zh: "西高地白㹴",
          en: "West Highland White Terrier"
        },
        sizeCategory: "small"
      }
    ],
    angles: {
      front: {
        skeleton: "/assets/animals/dog/front_skeleton.png",
        photos: [
          {
            id: "dog_front_ref2",
            status: "published",
            url: "/assets/animals/dog/front/front_ref_a3f8c2.jpg",
            skeleton: "/assets/animals/dog/front/front_ref_a3f8c2_skeleton.png",
            breedId: "labrador_retriever",
            sourceName: "Unsplash",
            sourceUrl: "https://unsplash.com/photos/black-labrador-retriever-on-green-grass-field-during-daytime-zdAnSVYBi7M",
            sourceImage: "https://images.unsplash.com/photo-1621956829988-a458f4c3916e",
            uploader: {
              name: "Rachel Alexis",
              profileUrl: "https://unsplash.com/@rachalexis"
            },
            createdAt: "2026-07-26T17:30:00Z",
            updatedAt: "2026-07-26T17:30:00Z",
            publishedAt: "2026-07-26T17:30:00Z"
          },
          {
            id: "dog_front_ref1",
            status: "published",
            url: "/assets/animals/dog/front/front_ref_d1e98f.jpg",
            skeleton: "/assets/animals/dog/front/front_ref_d1e98f_skeleton.png",
            breedId: "golden_retriever",
            sourceName: "Unsplash",
            sourceUrl: "https://unsplash.com/photos/yellow-labrador-retriever-biting-yellow-tulip-flower-Sg3XwuEpybU",
            sourceImage: "https://images.unsplash.com/photo-1552053831-71594a27632d",
            uploader: {
              name: "Richard Brutyo",
              profileUrl: "https://unsplash.com/@richardbrutyo"
            },
            createdAt: "2026-07-26T17:30:00Z",
            updatedAt: "2026-07-26T17:30:00Z",
            publishedAt: "2026-07-26T17:30:00Z"
          }
        ]
      },
      side: {
        skeleton: "/assets/animals/dog/side_skeleton.png",
        photos: [
          {
            id: "dog_side_ref2",
            status: "published",
            url: "/assets/animals/dog/side/side_ref_f5d4e1.jpg",
            skeleton: "/assets/animals/dog/side/side_ref_f5d4e1_skeleton.png",
            breedId: "SBorder Collie",
            sourceName: "Unsplash",
            sourceUrl: "https://unsplash.com/photos/long-coated-black-and-white-dog-standing-on-grass-field-ngNS-wXxLMc",
            sourceImage: "https://images.unsplash.com/photo-1511732782465-412b656f2291",
            uploader: {
              name: "Lukas Ruzicka",
              profileUrl: "https://unsplash.com/@sodalite"
            },
            createdAt: "2026-07-27T14:00:00Z",
            updatedAt: "2026-07-27T14:00:00Z",
            publishedAt: "2026-07-27T14:00:00Z"
          },
          {
            id: "dog_side_ref1",
            status: "published",
            url: "/assets/animals/dog/side/side_ref_c7b2e9.jpg",
            skeleton: "/assets/animals/dog/side/side_ref_c7b2e9_skeleton.png",
            breedId: "Siberian Husky",
            sourceName: "Unsplash",
            sourceUrl: "https://unsplash.com/photos/white-and-black-siberian-husky-on-green-grass-during-daytime-UJr_TCSObWY",
            sourceImage: "https://images.unsplash.com/photo-1584653059740-fb6fb91eeeff",
            uploader: {
              name: "Loo Cypher",
              profileUrl: "https://unsplash.com/@l00_cyph3r"
            },
            createdAt: "2026-07-26T18:30:00Z",
            updatedAt: "2026-07-26T18:30:00Z",
            publishedAt: "2026-07-26T18:30:00Z"
          }
        ]
      },
      threeQuarter: {
        skeleton: "/assets/animals/dog/threequarter_skeleton.png",
        photos: [
          {
            id: "dog_threequarter_002",
            status: "published",
            url: "/assets/animals/dog/threequarter/threequarter_ref_e4e8d2.jpg",
            skeleton: "/assets/animals/dog/threequarter/threequarter_ref_e4e8d2_skeleton.png",
            breedId: "Beagle",
            sourceName: "Unsplash",
            sourceUrl: "https://unsplash.com/photos/tricolor-beagle-on-white-sand-during-daytime-eG5psJQbH-Q",
            sourceImage: "https://images.unsplash.com/photo-1586117571391-596af19dff89",
            uploader: {
              name: "Artem Beliaikin",
              profileUrl: "https://unsplash.com/@belart84"
            },
            createdAt: "2026-07-26T14:30:00Z",
            updatedAt: "2026-07-26T14:30:00Z",
            publishedAt: "2026-07-26T14:30:00Z"
          },
          {
            id: "dog_threequarter_001",
            status: "published",
            url: "/assets/animals/dog/threequarter/threequarter_ref_b9a2b5.jpg",
            skeleton: "/assets/animals/dog/threequarter/threequarter_ref_b9a2b5_skeleton.png",
            breedId: "dachshund",
            sourceName: "Unsplash",
            sourceUrl: "https://unsplash.com/photos/brown-dachshund-on-green-grass-during-daytime-LI9M-6aWgXg",
            sourceImage: "https://images.unsplash.com/photo-1614292981468-8a1577f7eb85",
            uploader: {
              name: "Bonnie Hawkins",
              profileUrl: "https://unsplash.com/@dios4me"
            },
            createdAt: "2026-07-26T14:30:00Z",
            updatedAt: "2026-07-26T14:30:00Z",
            publishedAt: "2026-07-26T14:30:00Z"
          }
        ]
      }
    },
    funFacts: [
      "狗的肩胛骨與身體其餘骨骼呈分離狀態，這為長途奔跑提供了更大的前肢跨步幅度與彈性。",
      "每隻狗的鼻子紋路（鼻紋）都是獨一無二的，就像人類的指紋一樣，可用於精確識別身份。"
    ],
    similarAnimalIds: ["cat"]
  },
  {
    id: "horse",
    sortOrder: 3,
    status: "published",
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-23T14:00:00Z",
    publishedAt: "2026-07-22T08:00:00Z",
    names: {
      zh: "馬",
      en: "Horse"
    },
    postureType: "unguligrade",
    wikiUrl: "https://zh.wikipedia.org/wiki/馬",
    scientificClassification: {
      kingdom: "動物界（Animalia）",
      phylum: "脊索動物門（Chordata）",
      class: "哺乳綱（Mammalia）",
      order: "奇蹄目（Perissodactyla）",
      family: "馬科（Equidae）",
      genus: "馬屬（Equus）",
      species: "野馬（Equus caballus）"
    },
    briefDescription: "馬是大型的單蹄草食性哺乳動物，適應於高速奔跑與長途遷徙。牠們長有極度延伸的四肢長骨與巨大的胸腔，其流線型的骨骼架構是速度與力量的象徵。",
    coverImage: {
      url: "/assets/animals/horse/cover.jpg",
      sourceUrl: "https://unsplash.com/photos/a-brown-horse-with-a-white-blaze-on-its-face-StSo9Zkx9Ys",
      sourceImage: "https://images.unsplash.com/photo-1770059659810-a2d73574f135",
      sourceName: "Unsplash",
      uploader: {
        name: "Alfonso Betancourt",
        profileUrl: "https://unsplash.com/@tigredemar"
      }
    },
    breeds: [],
    angles: {
      front: {
        skeleton: "/assets/animals/horse/front_skeleton.png",
        photos: []
      },
      side: {
        skeleton: "/assets/animals/horse/side_skeleton.png",
        photos: []
      },
      threeQuarter: {
        skeleton: "/assets/animals/horse/threequarter_skeleton.png",
        photos: []
      }
    },
    funFacts: [
      "馬其實是用「一根中指」來站立與奔跑的，其餘腳趾皆已退化，外層長有硬蹄保護趾關節。",
      "馬擁有一套「站立鎖定機制」，能鎖定腿部關節與韌帶，使其在站立睡眠時不會跌倒或疲勞。"
    ],
    similarAnimalIds: ["reddeer"]
  },
  {
    id: "reddeer",
    sortOrder: 4,
    status: "published",
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-23T14:00:00Z",
    publishedAt: "2026-07-22T08:00:00Z",
    names: {
      zh: "紅鹿",
      en: "Red Deer"
    },
    postureType: "unguligrade",
    wikiUrl: "https://zh.wikipedia.org/wiki/赤鹿",
    scientificClassification: {
      kingdom: "動物界（Animalia）",
      phylum: "脊索動物門（Chordata）",
      class: "哺乳綱（Mammalia）",
      order: "偶蹄目（Artiodactyla）",
      family: "鹿科（Cervidae）",
      genus: "鹿屬（Cervus）",
      species: "紅鹿（Cervus elaphus）"
    },
    briefDescription: "紅鹿是偶蹄類草食動物，體型僅次於駝鹿，以纖細優雅的四肢比例、高聳的背脊和分叉鹿角聞名。牠們輕盈且極具彈性的骨骼結構，使牠們能在複雜的林地間敏捷穿梭。",
    coverImage: {
      url: "/assets/animals/reddeer/cover.jpg",
      sourceUrl: "https://unsplash.com/photos/selective-focus-photography-of-brown-deer-during-daytime-Y7mzlRgkF4I",
      sourceImage: "https://images.unsplash.com/photo-1543756605-a90da919605a",
      sourceName: "Unsplash",
      uploader: {
        name: "Diana Parkhouse",
        profileUrl: "https://unsplash.com/@ditakesphotos"
      }
    },
    breeds: [],
    angles: {
      front: {
        skeleton: "/assets/animals/reddeer/front_skeleton.png",
        photos: []
      },
      side: {
        skeleton: "/assets/animals/reddeer/side_skeleton.png",
        photos: []
      },
      threeQuarter: {
        skeleton: "/assets/animals/reddeer/threequarter_skeleton.png",
        photos: []
      }
    },
    funFacts: [
      "雄鹿的鹿角是真實骨質，生長旺季每天可長長2.5公分，是哺乳動物中生長最快的骨骼組織。",
      "紅鹿走路時，主要是用第三與第四個腳趾的趾尖（蹄甲）著地，來承受並支撐龐大的體重。"
    ],
    similarAnimalIds: ["horse"]
  },
  {
    id: "brownbear",
    sortOrder: 5,
    status: "published",
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-23T14:00:00Z",
    publishedAt: "2026-07-22T08:00:00Z",
    names: {
      zh: "棕熊",
      en: "Brown Bear"
    },
    postureType: "plantigrade",
    wikiUrl: "https://zh.wikipedia.org/wiki/棕熊",
    scientificClassification: {
      kingdom: "動物界（Animalia）",
      phylum: "脊索動物門（Chordata）",
      class: "哺乳綱（Mammalia）",
      order: "食肉目（Carnivora）",
      family: "熊科（Ursidae）",
      genus: "熊屬（Ursus）",
      species: "棕熊（Ursus arctos）"
    },
    briefDescription: "棕熊是大型雜食性食肉動物，走路時整個腳掌踏在地上（與人類相似）。牠們擁有寬大強壯的骨盆與結實的四肢，其粗壯骨骼為站立與奔跑提供強力支撐。",
    coverImage: {
      url: "/assets/animals/brownbear/cover.jpg",
      sourceUrl: "https://unsplash.com/photos/brown-bear-sitting-on-grass-field-y421kXlUOQk",
      sourceImage: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d",
      sourceName: "Unsplash",
      uploader: {
        name: "Mark Basarab",
        profileUrl: "https://unsplash.com/@markbasarabvisualsk"
      }
    },
    breeds: [],
    angles: {
      front: {
        skeleton: "/assets/animals/brownbear/front_skeleton.png",
        photos: []
      },
      side: {
        skeleton: "/assets/animals/brownbear/side_skeleton.png",
        photos: []
      },
      threeQuarter: {
        skeleton: "/assets/animals/brownbear/threequarter_skeleton.png",
        photos: []
      }
    },
    funFacts: [
      "熊在冬眠期間能保持骨骼密度不變，牠們透過荷爾蒙循環重新吸收鈣質，防止骨質流失。",
      "熊肩膀上的隆起並非骨頭突起，而是強壯的肌肉群，為前爪挖掘動作提供巨大的力量。"
    ],
    similarAnimalIds: ["squirrel"]
  },
  {
    id: "squirrel",
    sortOrder: 6,
    status: "published",
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-23T14:00:00Z",
    publishedAt: "2026-07-22T08:00:00Z",
    names: {
      zh: "松鼠",
      en: "Squirrel"
    },
    postureType: "plantigrade",
    wikiUrl: "https://zh.wikipedia.org/wiki/松鼠",
    scientificClassification: {
      kingdom: "動物界（Animalia）",
      phylum: "脊索動物門（Chordata）",
      class: "哺乳綱（Mammalia）",
      order: "囓齒目（Rodentia）",
      family: "松鼠科（Sciuridae）",
      genus: "松鼠屬（Sciurus）",
      species: "歐亞紅松鼠（Sciurus vulgaris）"
    },
    briefDescription: "松鼠是小型樹棲囓齒動物，具有極度靈活的四肢關節與細長抓地力強的指爪。其骨骼結構與重心分佈經過高度演化，能完美適應高空的立體攀爬與樹冠間的跳躍運動。",
    coverImage: {
      url: "/assets/animals/squirrel/cover.jpg",
      sourceUrl: "https://unsplash.com/photos/a-red-squirrel-holds-a-nut-amidst-colorful-autumn-leaves-Hy8HbYSDscs",
      sourceImage: "https://images.unsplash.com/photo-1783445366687-9021cc6b2d84",
      sourceName: "Unsplash",
      uploader: {
        name: "Wojciech Wyszkowski",
        profileUrl: "https://unsplash.com/@fotodruk"
      }
    },
    breeds: [],
    angles: {
      front: {
        skeleton: "/assets/animals/squirrel/front_skeleton.png",
        photos: []
      },
      side: {
        skeleton: "/assets/animals/squirrel/side_skeleton.png",
        photos: []
      },
      threeQuarter: {
        skeleton: "/assets/animals/squirrel/threequarter_skeleton.png",
        photos: []
      }
    },
    funFacts: [
      "松鼠後肢的踝關節可旋轉180度，使牠們能雙腳緊扣樹皮，以頭朝下的姿勢垂直爬下樹幹。",
      "松鼠的前門牙終其一生都在不停生長，因此牠們必須藉由不斷啃咬磨牙，防止門牙過長。"
    ],
    similarAnimalIds: ["brownbear"]
  }
];
