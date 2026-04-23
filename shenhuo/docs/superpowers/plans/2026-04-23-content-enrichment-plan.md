# 神话录内容丰富与功能增强 实施计划

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 补充故事和人物数据至覆盖全部分类、增加全局搜索、阅读进度持久化、工具栏补全（返回/朗读/护眼）、人物详情丰富（法宝/关系）、中国风动画。

**Architecture:** 保持现有 Vite MPA + 数据驱动架构不变。扩展数据类型字段、增加 `src/utils/storage.ts` 统一 localStorage 管理、新增搜索组件和工具栏功能。动画用纯 CSS + 少量 JS 实现。

**Tech Stack:** Vite 6, TypeScript, Vanilla DOM API, Web Speech API (朗读), CSS Animations, localStorage

---

## File Map

### 新建文件

| 文件                       | 职责                                        |
| -------------------------- | ------------------------------------------- |
| `src/utils/storage.ts`     | localStorage 统一封装：已读进度、收藏、设置 |
| `src/components/search.ts` | 全局搜索组件：输入、结果面板、模糊匹配      |

### 修改文件

| 文件                      | 改动                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/types.ts`       | Story 增加 source/artifacts 字段；Character 增加 artifacts/relations/quotes 字段；Place 增加 relatedCharacters/relatedStories 字段 |
| `src/data/stories.ts`     | 新增 8 条故事（大禹治水、愚公移山、女娲造人、三打白骨精、火焰山、劈山救母、姜太公钓鱼、孟姜女哭长城）                              |
| `src/data/characters.ts`  | 新增 5 个人物（玉皇大帝、王母娘娘、猪八戒、沙僧、禹）；已有人物补充 artifacts/relations/quotes                                     |
| `src/data/places.ts`      | 新增 8 个地标（月宫、花果山、南天门、天河、雷峰塔、五行山、火焰山、五岳）；已有地标增加关联字段                                    |
| `src/main.ts`             | 初始化全局搜索、初始化 Toast 提示                                                                                                  |
| `src/pages/stories.ts`    | 工具栏增加返回列表/朗读/护眼模式；搜索集成；已读进度持久化；Toast 提示                                                             |
| `src/pages/characters.ts` | 详情区增加法宝列表、经典语录、关联故事可点击跳转                                                                                   |
| `src/pages/home.ts`       | 文化板块改为数据驱动渲染 4 张内容卡片                                                                                              |
| `src/styles/home.css`     | Hero 云雾飘移动画、花瓣粒子动画 keyframes                                                                                          |
| `src/styles/global.css`   | Toast 提示样式、搜索面板样式、护眼模式变量、卡片交错入场动画                                                                       |
| `stories.html`            | 工具栏增加 3 个按钮（返回/朗读/护眼）、搜索结果容器                                                                                |
| `worldmap.html`           | 新增 8 个 `.map-region`（对应新地标）                                                                                              |

---

### Task 1: 扩展数据类型

**Files:**

- Modify: `src/data/types.ts`

- [ ] **Step 1: 扩展 Story 接口**

在 `src/data/types.ts` 中，在 Story interface 的 `order: number;` 后添加：

```ts
export interface Story {
  id: string;
  title: string;
  summary: string;
  category: string;
  era: string;
  tags: string[];
  content?: string;
  discussion?: string[];
  readingTime: number;
  ageRange: string;
  gradient: string;
  order: number;
  source?: {
    book: string;
    chapter?: string;
    quote?: string;
  };
  coverArt?: string;
  artifacts?: string[];
}
```

- [ ] **Step 2: 扩展 Character 接口**

在 Character interface 末尾添加：

```ts
export interface Character {
  // ... 保留所有现有字段 ...
  artifacts?: {
    name: string;
    desc: string;
  }[];
  quotes?: {
    text: string;
    source?: string;
  }[];
  relations?: {
    targetId: string;
    relation: string;
  }[];
}
```

- [ ] **Step 3: 扩展 Place 接口**

在 Place interface 中添加关联字段：

```ts
export interface Place {
  name: string;
  realm: "heaven" | "mortal" | "underworld" | "sea";
  pos: { left: string; top: string };
  desc: string;
  relatedCharacters?: string[];
  relatedStories?: string[];
}
```

- [ ] **Step 4: 验证**

Run: `npm run build`
Expected: 0 errors（接口变更不影响现有代码，所有新字段都是 optional）

---

### Task 2: 补充 8 条故事

**Files:**

- Modify: `src/data/stories.ts`

每条故事需包含：id、title、summary、category、era、tags、readingTime、ageRange、gradient、order、content（7 段白话正文）、discussion（4 题）、source。

- [ ] **Step 1: 添加大禹治水**

在 stories 数组末尾（`change-benyue` 条目之后，`]` 之前），插入：

```ts
  {
    id: "dayu-zhishui",
    title: "大禹治水",
    summary: "帝尧之时，洪水滔天，怀山襄陵，下民其忧。禹受命治水，劳身焦思，居外十三年，过家门不入，终平水患。",
    category: "英雄传说",
    era: "上古神话",
    tags: ["英雄", "奉献", "经典必读"],
    readingTime: 8,
    ageRange: "5 岁以上",
    gradient: "linear-gradient(135deg, #1a3a2a, #2a5a4a, #4a8a6a)",
    order: 12,
    content: `<p>尧帝在位的时候，天下发了大洪水。黄河、长江、淮河……所有的河流都在泛滥，大片大片的田地和村庄都被水淹没了。百姓们失去了家园，只能爬到山上躲避，饿死、冻死的人不计其数。</p>

<p>尧帝派鲧去治水。鲧用堵的办法，筑起堤坝把水挡住。可是水越堵越高，堤坝一塌，更大的洪水冲出来，比以前更凶猛。鲧治了九年，洪水不但没治好，反而更严重了。</p>

<div class="scene-break">* * *</div>

<p>鲧因为治水失败被处死了。他的儿子<span class="emphasis">禹</span>继承了父亲未完成的事业，决心治好洪水。</p>

<p>禹吸取了父亲的教训，改用\"疏导\"的办法：挖渠引水，把洪水引导到大海里去。他带着工匠们翻山越岭，测量地形，哪里该挖渠、哪里该筑坝，事必躬亲。</p>

<p>传说禹治水的时候，变成一头巨大的熊来开山辟路。他的妻子涂山氏每天给他送饭，可禹太忙了，三次经过自己的家门都没有进去看一眼——这就是\"<span class="emphasis">三过家门而不入</span>\"的故事。</p>

<div class="scene-break">* * *</div>

<p>禹治了整整十三年，走遍了九州大地，疏通了九条大河，终于把洪水治好了。百姓们又可以回到家园，种庄稼、盖房子，过上了安定的日子。</p>

<p>因为治水有功，舜帝把帝位传给了禹。禹建立了中国历史上第一个王朝——夏朝。人们永远记住了这位为了百姓，三过家门而不入的伟大英雄。</p>`,
    discussion: [
      "禹为什么要用疏导的办法，而不是像他父亲鲧那样堵？",
      "\"三过家门而不入\"，你觉得禹心里在想什么？",
      "如果你是禹，治好洪水后最想做的一件事是什么？",
      "大禹治水和我们今天说的\"环境保护\"有什么相似之处？",
    ],
    source: { book: "山海经", quote: "洪水滔天，鲧窃帝之息壤以堙洪水" },
  },
```

- [ ] **Step 2: 添加愚公移山**

```ts
  {
    id: "yugong-yishan",
    title: "愚公移山",
    summary: "太行、王屋二山，方七百里，高万仞。北山愚公者，年且九十，面山而居，惩山北之塞，出入之迂也，聚室而谋曰。",
    category: "民间故事",
    era: "民间传说",
    tags: ["坚韧", "经典必读", "适合讨论"],
    readingTime: 6,
    ageRange: "5 岁以上",
    gradient: "linear-gradient(135deg, #3a3020, #5a5030, #8a8060)",
    order: 13,
    content: `<p>很久以前，在北山的南面住着一位九十岁的老人，人们都叫他<span class="emphasis">愚公</span>。愚公家门口有两座大山——太行山和王屋山，又高又大，挡住了出行的道路。每次出门都要绕很远的路，实在太不方便了。</p>

<p>有一天，愚公把全家人召集起来，说："咱们把这两座山挖平，好不好？"大家都觉得这是不可能的事，可愚公的老伴儿却支持他，说："就算死了，还有儿子接着干；儿子死了还有孙子，子子孙孙没有穷尽，山又不会长高，还怕挖不平吗？"</p>

<div class="scene-break">* * *</div>

<p>全家人说干就干，每天挖山不止。隔壁村有个叫智叟的老头儿笑话他们："你们都九十岁了，连一棵草都拔不动，还想搬山？"</p>

<p>愚公回答："你这个人啊，连个寡妇和一个小孩儿都比不过！寡妇的儿子每年还能搬走几筐土，小孩儿的力量虽然小，可也能搬几块石头。我死了还有儿子，儿子死了还有孙子——子子孙孙无穷无尽，而山不会再长高，有什么挖不平的？"</p>

<div class="scene-break">* * *</div>

<p>智叟被说得无话可说。山神害怕愚公真的会把山挖走，赶紧报告了天帝。天帝被愚公的精神感动了，派了两个大力神把两座山搬走了。</p>

<p>从此，愚公家门口再也没有大山挡路了，出行变得十分方便。这个故事告诉我们：<span class="emphasis">只要坚持不放弃，再难的事情也能做到。</span></p>`,
    discussion: [
      "你觉得愚公\"愚\"在哪里？他真的很笨吗？",
      "智叟和愚公，你更愿意做哪一种人？",
      "愚公的妻子说\"子子孙孙无穷尽\"，这个想法对吗？",
      "在你的生活中，有没有什么事情是你坚持做下来并成功的？",
    ],
    source: { book: "列子·汤问", quote: "子子孙孙无穷匮也，而山不加增" },
  },
```

- [ ] **Step 3: 添加女娲造人**

```ts
  {
    id: "nuwa-zaoren",
    title: "女娲造人",
    summary: "天地开辟，未有人民。女娲抟黄土作人，剧务力不暇，乃引绳于泥中，举以为人。",
    category: "创世神话",
    era: "上古神话",
    tags: ["创世", "经典必读"],
    readingTime: 6,
    ageRange: "4 岁以上",
    gradient: "linear-gradient(135deg, #e8d0c0, #d8b8a0, #c8a080)",
    order: 1.5,
    content: `<p>盘古开天辟地之后，天地间有了山川河流、花草树木、飞禽走兽，可是空荡荡的大地上没有一个能说话、能思考、能创造的生灵。世界虽然美丽，却缺少了一份灵气。</p>

<p>有一位名叫<span class="emphasis">女娲</span>的女神，每天在天地间巡视。她看到大地这么广阔却空无一人，心里觉得寂寞极了。</p>

<div class="scene-break">* * *</div>

<p>有一天，女娲来到一条大河边，蹲下来，捧起一把柔软的黄土。她仔仔细细地捏啊捏，捏出了一个像自己模样的泥人——有圆圆的脑袋、灵活的手脚，还有一张会笑的脸。</p>

<p>女娲对着泥人吹了一口仙气，小泥人竟然活了！它蹦蹦跳跳地围着女娲转圈，嘴里叫着"妈妈、妈妈"。女娲高兴极了，又捏了很多很多。</p>

<p>可是捏得太累了，速度太慢。女娲想了个聪明的办法：她找来一根长长的藤条，蘸上泥浆用力一甩——泥点飞出去，落到地上就变成了一个个活蹦乱跳的小人。不一会儿，大地上就布满了欢笑的人群。</p>

<div class="scene-break">* * *</div>

<p>女娲把人分成了男人和女人，让他们配对成家，自己则飞回了天上。从此，大地上有了人类，人们耕种捕鱼、繁衍生息，世界变得热闹而充满生机。</p>

<p>所以中国人常说自己是\"女娲的后代\"，把女娲尊为\"大地之母\"——因为正是她，赋予了这片土地上第一个会思考的生命。</p>`,
    discussion: [
      "女娲为什么用黄土造人？你觉得这有什么特别的意义吗？",
      "后来她用藤条甩泥浆的办法加快速度，你觉得这个办法聪明在哪里？",
      "如果让你来创造一种新的动物，你会创造什么？",
      "\"大地之母\"这个称号，你觉得女娲当得起吗？",
    ],
    source: { book: "风俗通义", quote: "女娲抟黄土作人" },
  },
```

- [ ] **Step 4: 添加三打白骨精**

```ts
  {
    id: "xiyou-san-baigujing",
    title: "三打白骨精",
    summary: "唐僧师徒西行至白虎岭，白骨精三变村姑、老妇、老翁，欲取唐僧肉。孙悟空火眼金睛识破妖术，三棒打死妖魔。",
    category: "英雄传说",
    era: "西游记",
    tags: ["西游记", "经典必读", "机智"],
    readingTime: 8,
    ageRange: "5 岁以上",
    gradient: "linear-gradient(135deg, #3a3a1a, #5a5a3a, #8a8060)",
    order: 14,
    content: `<p>唐僧带着三个徒弟——孙悟空、猪八戒、沙和尚，一路向西走去取经。这一天，他们来到了一座名叫白虎岭的大山。</p>

<p>山里住着一个白骨精，已经修炼了千年，听说吃了唐僧肉就能长生不老。她可不想错过这个好机会！</p>

<div class="scene-break">* * *</div>

<p>白骨精先变成了一个美丽的<span class="emphasis">年轻村姑</span>，提着饭篮来给唐僧送饭。孙悟空的火眼金睛一下子就看出了妖气，举起金箍棒一棒打下去——可白骨精使了个\"解尸法\"，留下一个假身子，真身化作一阵清风逃走了。</p>

<p>第二天，白骨精又变成了一个白发苍苍的<span class="emphasis">老太婆</span>，拄着拐杖来寻亲。孙悟空又是一棒——白骨精又用同样的办法逃走了。唐僧责怪悟空打死好人，念起了紧箍咒，疼得悟空满地打滚。</p>

<div class="scene-break">* * *</div>

<p>第三天，白骨精变成了一个<span class="emphasis">白发老头</span>，说是来请唐僧到家中做客。悟空这次动了脑筋，没有马上打，而是等妖怪现出原形后再下手。果然，白骨精又故技重施，这次悟空一棒把它的真身打了个粉碎。</p>

<p>唐僧亲眼看到一堆碎骨头骷髅，这才相信师父是对的。从那以后，唐僧对悟空更加信任了。</p>`,
    discussion: [
      "白骨精为什么要变成三种不同的样子来骗唐僧？",
      "孙悟空前两次都打了假身，第三次才成功，他学到了什么？",
      "唐僧为什么念紧箍咒惩罚悟空？你觉得他做得对吗？",
      "如果你是孙悟空，第三次你会怎么做才能让唐僧相信你？",
    ],
    source: { book: "西游记", chapter: "第二十七回" },
  },
```

- [ ] **Step 5: 添加火焰山**

```ts
  {
    id: "xiyou-huoyanshan",
    title: "三借芭蕉扇 · 火焰山",
    summary: "西方路上有火焰山，八百里火焰寸草不生。行者赴翠云山借芭蕉扇，三调三借，终扇灭火，师徒安然过山。",
    category: "英雄传说",
    era: "西游记",
    tags: ["西游记", "机智", "团队合作"],
    readingTime: 9,
    ageRange: "5 岁以上",
    gradient: "linear-gradient(135deg, #3a1a0a, #6a2a0a, #e85828)",
    order: 15,
    content: `<p>唐僧师徒一路西行，遇到了一座巨大的<span class="emphasis">火焰山</span>。这座山方圆八百里，到处都是熊熊烈火，连一株草都找不到，根本无法通过。</p>

<p>听说翠云山芭蕉洞的铁扇公主有一把芭蕉扇，一扇就能灭火。孙悟空便飞去借扇。可铁扇公主是牛魔王的妻子，因为孙悟空降服了她的儿子红孩儿，恨透了悟空，一扇子把他扇到了五万四千里外！</p>

<div class="scene-break">* * *</div>

<p>悟空不服气，又去了两次。第二次变小虫子钻进铁扇公主肚子里折腾，逼得她交出了假扇子。结果用假扇子一扇，火反而更大了！</p>

<p>第三次，悟空想了个妙计。他变成牛魔王的模样去找铁扇公主，成功骗到了真扇子。扇灭了火焰山的火，师徒四人终于顺利通过了这座大山。</p>`,
    discussion: [
      "孙悟空三次借扇，每次失败的原因一样吗？",
      "铁扇公主为什么恨孙悟空？你觉得她有道理吗？",
      "如果你是孙悟空，你会用什么办法借到扇子？",
      "火焰山让你想到了什么生活中的\"难关\"？",
    ],
    source: { book: "西游记", chapter: "第五十九至六十一回" },
  },
```

- [ ] **Step 6: 添加劈山救母**

```ts
  {
    id: "erlang-poshan",
    title: "二郎神劈山救母",
    summary: "二郎神杨戬之母瑶姬，因思凡下嫁凡人，被玉帝压于桃山之下。杨戬学成神通，持三尖两刃刀劈开桃山，救出母亲。",
    category: "封神演义",
    era: "封神演义",
    tags: ["封神", "孝道", "母子情深"],
    readingTime: 7,
    ageRange: "6 岁以上",
    gradient: "linear-gradient(135deg, #1a2a4a, #3a5a7a, #80a0d0)",
    order: 16,
    content: `<p>天上有位美丽的仙女叫<span class="emphasis">瑶姬</span>，她是玉皇大帝的妹妹。有一天，瑶姬偷偷来到人间游玩，看到了一个勤劳善良的凡人杨天佑。瑶姬被他的善良打动，决定留在人间，和他成了亲。</p>

<p>不久，瑶姬生下了一个大胖小子，取名<span class="emphasis">杨戬</span>。杨戬从小就与众不同——力大无穷，跑得比风还快，而且额头上有第三只眼睛，能看穿一切妖魔鬼怪的伪装。</p>

<div class="scene-break">* * *</div>

<p>可是玉皇大帝知道妹妹私自下凡，勃然大怒，派天兵天将把瑶姬抓了回去，压在桃山底下，永远不许出来。</p>

<p>杨戬长大后拜玉鼎真人学艺，学得一身本领。他手持三尖两刃刀，脚踩风火轮，背上哮天犬，来到桃山前。他使出全部力气，一刀劈开了桃山，救出了母亲。</p>

<div class="scene-break">* * *</div>

<p>劈山时山石崩裂，震动了天庭。玉帝派十万天兵天将来捉拿，可杨戬武艺高强，加上哮天犬和七十二变，天兵天将谁也奈何不了他。</p>

<p>最后观音菩萨出面调解，玉帝只好承认了既成事实，封杨戬为\"显圣二郎真君\"。杨戬从此成为天庭最厉害的神将之一。</p>`,
    discussion: [
      "瑶姬为什么要留在人间？你觉得凡间有什么值得她放弃天上的生活？",
      "杨戬劈山的时候不怕压坏母亲吗？他是怎么做到的？",
      "玉皇大帝把自己的亲妹妹压在山下，你觉得他做得对吗？",
      "这个故事里，你觉得谁最勇敢？为什么？",
    ],
    source: { book: "宝莲灯" },
  },
```

- [ ] **Step 7: 添加姜太公钓鱼**

```ts
  {
    id: "jiangtaigong-diaoyu",
    title: "姜太公钓鱼，愿者上钩",
    summary: "姜尚年老穷困，钓于渭水之滨。直钩钓于水面，无饵无弯，曰：愿者上钩。",
    category: "封神演义",
    era: "封神演义",
    tags: ["封神", "耐心", "大器晚成"],
    readingTime: 7,
    ageRange: "6 岁以上",
    gradient: "linear-gradient(135deg, #2a3a4a, #4a5a6a, #8aa0d0)",
    order: 17,
    content: `<p>商朝末年，有一位叫<span class="emphasis">姜尚</span>的老人，大家都叫他姜太公。他年轻时饱读诗书，精通兵法谋略，可惜一直怀才不遇，到七十岁了还是个穷困的老头儿。</p>

<p>姜太公来到渭水边，每天坐在石头上钓鱼。可他的钓鱼方式很奇怪——鱼钩是直的，上面没有鱼饵，而且鱼钩悬在水面上三寸高的地方，根本碰不到水。过路的人都笑话他："老头儿，你这样能钓到鱼？"</p>

<div class="scene-break">* * *</div>

<p>姜太公笑着说：\"我钓的不是鱼，是王侯将相！\"</p>

<p>他就这样在渭水边等了整整十年。终于有一天，一位叫姬昌的人——也就是后来的<span class="emphasis">周文王</span>——来这里打猎，遇到了姜太公。两人一聊，姬昌发现这个老头儿满腹经纶、通晓天下大势，正是自己苦苦寻找的人才。</p>

<div class="scene-break">* * *</div>

<p>姬昌恭敬地请姜太公出山相助。姜太公辅佐姬昌发展壮大，最终帮助周推翻了商朝的暴政，建立了周朝。姜太公被封为齐太公，成为开国第一功臣。</p>

<p>这就是\"<span class="emphasis">姜太公钓鱼——愿者上钩</span>\"的故事。它告诉我们：真正有才华的人，总会等到欣赏自己的人，哪怕要等很久很久。</p>`,
    discussion: [
      "姜太公为什么用直钩钓鱼？他是在做什么？",
      "姜太公等了十年才遇到周文王，这十年你觉得他过得苦吗？",
      "如果你的努力很长时间看不到效果，你会像姜太公一样坚持吗？",
      "\"愿者上钩\"这句话在今天还有什么含义？",
    ],
    source: { book: "封神演义", quote: "宁在直中取，不在曲中求" },
  },
```

- [ ] **Step 8: 添加孟姜女哭长城**

```ts
  {
    id: "mengjiannv-chulancheng",
    title: "孟姜女哭长城",
    summary: "齐庄公时，有杞梁之妻者，夫死，乃就其夫之尸哭于城下，十日而城为之崩。",
    category: "民间故事",
    era: "民间传说",
    tags: ["忠贞", "感情", "经典必读"],
    readingTime: 7,
    ageRange: "5 岁以上",
    gradient: "linear-gradient(135deg, #3a2a20, #6a5a30, #a09050)",
    order: 18,
    content: `<p>秦朝的时候，有一位美丽善良的姑娘叫<span class="emphasis">孟姜女</span>。她和新婚丈夫范杞梁十分恩爱。可结婚才三天，官府就强行把范杞梁抓走，派去修筑万里长城。</p>

<p>冬天到了，天气越来越冷。孟姜女想念丈夫，亲手做了棉衣棉鞋，千里迢迢赶到长城。可到了那里，却打听到一个噩耗：范杞梁因为劳累过度，已经死了，尸骨就被埋在了长城下面。</p>

<div class="scene-break">* * *</div>

<p>孟姜女抱着棉衣，趴在长城上痛哭。她哭了三天三夜，哭声凄惨得连天上的乌云都忍不住落泪。忽然\"轰隆\"一声巨响，一段八百里长的长城竟然被她哭塌了！</p>

<p>这就是\"<span class="emphasis">孟姜女哭长城</span>\"的故事。虽然传说中有些夸张，但它真实地反映了古代劳苦百姓的苦难。</p>`,
    discussion: [
      "长城为什么会塌？你觉得这个故事是真的发生过的事吗？",
      "孟姜女一个人走了多远的路去找丈夫？你觉得她为什么这么坚持？",
      "这个故事让你想到了什么？",
      "我们身边有没有像长城一样\"又长又难\"的事情？",
    ],
    source: { book: "列女传", quote: "杞梁之妻，哭之城崩" },
  },
```

- [ ] **Step 9: 更新 FEATURED_IDS**

将 `FEATURED_IDS` 替换为包含新故事的精选组合：

```ts
export const FEATURED_IDS = [
  "nuwa-butian",
  "houyi-sheri",
  "xiyou-san-baigujing",
];
```

- [ ] **Step 10: 验证**

Run: `npm run build`
Expected: 0 errors, stories 数组 20 条

---

### Task 3: 补充 5 个人物 + 已有人物扩展

**Files:**

- Modify: `src/data/characters.ts`

- [ ] **Step 1: 添加玉皇大帝**

在 characters 数组末尾（`jiuweihu` 条目之后，`]` 之前），插入：

```ts
  {
    id: "yuhuangdadi",
    name: "玉皇大帝",
    altName: "张百忍 · 昊天上帝",
    title: "三界之主 · 统御万天",
    desc: "天庭最高统治者，居凌霄宝殿。统御三界十方、四生六道，掌管天地万物。从凡人张百忍修行成道，历经一千七百五十劫才登帝位。",
    fullDesc:
      "玉皇大帝是中国神话中天庭的最高统治者。他本名张百忍，原是一个凡间的国王。经过一千七百五十劫的修行，终于得道成仙。\n\n玉帝居住在凌霄宝殿，统御三界十方、四生六道，掌管天地万物、日月星辰。天庭上的各路神仙——太上老君、托塔天王、四大天王——都要听从他的号令。\n\n玉帝既威严又公正，在民间信仰中，他是\"老天爷\"的化身，人们遇到不平之事时常说\"老天有眼\"，就是相信玉帝能主持公道。",
    era: "西游记",
    tags: ["天庭", "至尊"],
    relatedStories: ["大闹天宫"],
    color: "#b8964e",
    brushColor: "#b8964e",
    avatarBg: "linear-gradient(135deg, #e8e0c8, #d0c8a0, #b8a878)",
    avatarChar: "玉帝",
    elementIcon: `<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="4" r="2.5" fill="currentColor"/><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="16" x2="16" y2="16" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="16" x2="10" y2="18" stroke="currentColor" stroke-width="1"/></svg>`,
    tagClass: "tag--gold",
    artifacts: [
      { name: "昊天镜", desc: "可照看三界一切动静" },
    ],
    quotes: [
      { text: "天高皇帝远，民贱反贼近", source: "西游记" },
    ],
  },
```

- [ ] **Step 2: 添加王母娘娘**

```ts
  {
    id: "wangmu",
    name: "王母娘娘",
    altName: "西王母 · 金母元君",
    title: "瑶池之主 · 掌管蟠桃",
    desc: "天庭女仙之首，居昆仑山瑶池。掌管蟠桃盛会、不死药和修炼资源。三千年一熟的蟠桃，食之长生不老。",
    fullDesc:
      "王母娘娘是中国神话中地位最高的女仙。传说她居住在西方昆仑山上的瑶池，掌管着天庭最珍贵的宝物——三千年一熟的蟠桃，吃一颗就能长生不老。\n\n每年蟠桃成熟时，王母娘娘都会举办盛大的蟠桃会，邀请各路神仙前来赴宴，品桃论道。这是天庭最隆重的盛会。\n\n王母娘娘还掌管着不死药。后羿射日后曾向她求取不死药，结果引发了嫦娥奔月的故事。她还拥有昆仑山上的不死药泉，是修仙者梦寐以求的宝地。",
    era: "西游记",
    tags: ["天庭", "女仙之首"],
    relatedStories: ["嫦娥奔月"],
    color: "#c8646a",
    brushColor: "#c8646a",
    avatarBg: "linear-gradient(135deg, #f8e0e8, #e8c8d0, #d0a8b0)",
    avatarChar: "王母",
    elementIcon: `<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="6" r="3" fill="currentColor"/><path d="M6 14 Q10 10 14 14 Q14 18 10 18 Q6 18 6 14Z" fill="currentColor"/></svg>`,
    tagClass: "tag--cinnabar",
    artifacts: [
      { name: "蟠桃", desc: "三千年一熟，食之长生不老" },
    ],
    quotes: [
      { text: "蟠桃盛会，群仙毕至", source: "西游记" },
    ],
    relations: [
      { targetId: "change", relation: "赠不死药" },
      { targetId: "yuhuangdadi", relation: "同列仙班" },
    ],
  },
```

- [ ] **Step 3: 添加猪八戒**

```ts
  {
    id: "zhubajie",
    name: "猪八戒",
    altName: "天蓬元帅 · 净戒",
    title: "天蓬元帅下凡 · 贪吃好睡",
    desc: "原为天庭天蓬元帅，掌管天河八万水兵。因醉酒调戏嫦娥被贬下凡，错投猪胎。后随唐僧西天取经。",
    fullDesc:
      "猪八戒原是天庭的天蓬元帅，掌管天河八万水兵，威风八面。一天醉酒后闯入广寒宫调戏嫦娥，被玉帝贬下凡间。投胎时出了差错，错投了猪胎，长了一副猪的模样。\n\n在高老庄娶了媳妇翠兰，日子过得有滋有味。后来遇到取经的唐僧和孙悟空，被收为二徒弟，赐法号\"悟能\"。\n\n猪八戒虽然贪吃好睡，经常打退堂鼓想回高老庄，但在关键时刻总能挺身而出。他的九齿钉耙十分厉害，是一员得力的大将。",
    era: "西游记",
    tags: ["西游记", "贪吃", "搞笑"],
    relatedStories: ["大闹天宫", "西天取经"],
    color: "#6a5a2a",
    brushColor: "#6a5a2a",
    avatarBg: "linear-gradient(135deg, #d8d0c0, #c8b8a0, #a89880)",
    avatarChar: "八戒",
    elementIcon: `<svg width="20" height="20" viewBox="0 0 20 20"><rect x="4" y="8" width="12" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="12" x2="10" y2="4" stroke="currentColor" stroke-width="2"/></svg>`,
    tagClass: "",
    customBadgeStyle: "background: rgba(180,170,160,0.15); color: #8a8070",
    artifacts: [
      { name: "九齿钉耙", desc: "重达六千零七十二斤" },
    ],
    quotes: [
      { text: "师父被妖怪抓走了，我回高老庄去！", source: "西游记" },
    ],
    relations: [
      { targetId: "wukong", relation: "师兄弟" },
      { targetId: "shaSeng", relation: "师兄弟" },
    ],
  },
```

- [ ] **Step 4: 添加沙僧**

```ts
  {
    id: "shaseng",
    name: "沙悟净",
    altName: "卷帘大将 · 沙和尚",
    title: "流沙河妖 · 任劳任怨",
    desc: "原为天庭卷帘大将，因蟠桃会上失手打碎琉璃盏被贬下凡，落入流沙河为妖。后随唐僧取经，任劳任怨，忠诚不二。",
    fullDesc:
      "沙僧原是天庭的卷帘大将，负责在蟠桃盛会上为各路神仙卷起珠帘。有一次他失手打碎了一只琉璃盏，玉帝大怒，将他贬下凡间。\n\n沙僧落入流沙河，成了一个红发蓝脸的妖怪，脖子上挂着一串骷髅念珠。他在流沙河里苦苦等待取经人。唐僧路过时收他为徒，赐法号\"悟净\"。\n\n沙僧是三个徒弟中最老实的一个。他话不多，但做事踏实，从不偷懒，每天挑着沉重的行李走在队伍最后面。他的武器是降妖宝杖，一根可以自由伸缩的禅杖。",
    era: "西游记",
    tags: ["西游记", "老实", "忠诚"],
    relatedStories: ["西天取经"],
    color: "#4a5a3a",
    brushColor: "#4a5a3a",
    avatarBg: "linear-gradient(135deg, #c8d0c0, #a8b8a0, #88a080)",
    avatarChar: "沙僧",
    elementIcon: `<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="1"/></svg>`,
    tagClass: "tag--gold",
    artifacts: [
      { name: "降妖宝杖", desc: "可大可小的禅杖" },
    ],
    quotes: [
      { text: "师父！大师兄去哪儿了？", source: "西游记" },
    ],
    relations: [
      { targetId: "wukong", relation: "师兄" },
      { targetId: "zhubajie", relation: "师兄" },
    ],
  },
```

- [ ] **Step 5: 添加禹**

```ts
  {
    id: "dayu",
    name: "大禹",
    altName: "禹 · 夏后氏",
    title: "治水英雄 · 三过家门",
    desc: "鲧之子，受命治理天下洪水。改堵为疏，凿龙门、通九河，十三年功成，受禅让继位，开夏朝。",
    fullDesc:
      "大禹是中国历史上最伟大的治水英雄。他的父亲鲧用\"堵\"的办法治水失败，被天帝处死。禹继承了父亲的遗志，决心完成治水大业。\n\n禹改用\"疏导\"的办法：开凿河道，让洪水顺着河道流入大海。他带领百姓疏通了九条大河，凿开了龙门峡，修建了堤坝沟渠。治水的十三年间，他三次经过自己的家门都没有进去看一眼，留下了\"三过家门而不入\"的千古佳话。\n\n治水成功后，舜帝因禹的功绩，将天下传给了他。禹建立了中国历史上第一个王朝——夏朝，开创了中国的新纪元。",
    era: "上古大神",
    tags: ["治水", "奉献", "经典必读"],
    relatedStories: ["大禹治水"],
    color: "#2a5a4a",
    brushColor: "#2a5a4a",
    avatarBg: "linear-gradient(135deg, #c0d8e0, #90c8b0, #70b090)",
    avatarChar: "大禹",
    elementIcon: `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M4 16 Q10 8 16 4 Q16 8 10 16Z" fill="currentColor"/><line x1="2" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="1"/></svg>`,
    tagClass: "tag--jade",
    artifacts: [
      { name: "息壤", desc: "能自动生长的神土" },
    ],
    quotes: [
      { text: "三过家门而不入", source: "孟子·滕文公上" },
    ],
  },
```

- [ ] **Step 6: 为现有人物补充 artifacts、relations、quotes**

为以下 6 个人物补充字段（在已有数据中追加，不是新建条目）：

**女娲** — 在 `tagClass: "tag--cinnabar",` 之后添加：

```ts
    artifacts: [
      { name: "五彩石", desc: "炼石补天的神石" },
      { name: "神鞭", desc: "积芦灰成的打神鞭" },
    ],
    quotes: [
      { text: "炼五色石以补苍天，断鳌足以立四极" },
    ],
    relations: [
      { targetId: "houyi", relation: "同时代" },
    ],
```

**后羿** — 在 `tagClass: "tag--cinnabar",` 之后添加：

```ts
    artifacts: [
      { name: "神弓", desc: "后羿射日用的红色神弓" },
      { name: "神箭", desc: "白色神箭，射落九个太阳" },
    ],
    quotes: [
      { text: "仰射十日，中其九日", source: "淮南子" },
    ],
    relations: [
      { targetId: "change", relation: "夫妻" },
      { targetId: "erlang", relation: "同时代" },
    ],
```

**哪吒** — 在 `tagClass: "tag--jade",` 之后添加：

```ts
    artifacts: [
      { name: "乾坤圈", desc: "能大能小的金圈" },
      { name: "混天绫", desc: "搅动海水震龙宫" },
      { name: "风火轮", desc: "脚踏风火，日行千里" },
      { name: "火尖枪", desc: "莲花重生后得此神兵" },
    ],
    quotes: [
      { text: "削骨还父，削肉还母", source: "封神演义" },
    ],
    relations: [
      { targetId: "erlang", relation: "对手后成朋友" },
    ],
```

**孙悟空** — 在 `tagClass: "tag--gold",` 之后添加：

```ts
    artifacts: [
      { name: "如意金箍棒", desc: "一万三千五百斤，可大可小的神铁棒" },
      { name: "七十二变", desc: "能变万物形态" },
      { name: "筋斗云", desc: "一个跟头十万八千里" },
    ],
    quotes: [
      { text: "皇帝轮流做，明年到我家", source: "西游记" },
      { text: "俺老孙去也", source: "西游记" },
    ],
    relations: [
      { targetId: "zhubajie", relation: "师弟" },
      { targetId: "shaseng", relation: "师弟" },
    ],
```

- [ ] **Step 7: 验证**

Run: `npm run build`
Expected: 0 errors, characters 数组 17 条

---

### Task 4: 补充 8 个地标

**Files:**

- Modify: `src/data/places.ts`
- Modify: `worldmap.html` (新增 8 个 `.map-region`)

- [ ] **Step 1: 在 places.ts 中添加 8 个新地标**

在 `六道轮回` 条目之后、`]` 之前，插入：

```ts
  {
    name: "月宫",
    realm: "heaven",
    pos: { left: "60%", top: "12%" },
    desc: "嫦娥居住的广寒宫所在地，位于月亮之上。常年清冷，只有玉兔和吴桂相伴。",
    relatedCharacters: ["change"],
    relatedStories: ["嫦娥奔月"],
  },
  {
    name: "花果山",
    realm: "mortal",
    pos: { left: "2%", top: "45%" },
    desc: "东胜神洲傲来国境内的仙山，孙悟空的诞生地。山顶有一处水帘洞，孙悟空被众猴推为美猴王。",
    relatedCharacters: ["wukong"],
    relatedStories: ["大闹天宫"],
  },
  {
    name: "南天门",
    realm: "heaven",
    pos: { left: "50%", top: "3%" },
    desc: "天庭的正门，由四大天王把守。凡间修成正果者从此门飞升上天。孙悟空大闹天宫时曾在此与天王激战。",
    relatedCharacters: ["wukong", "erlang"],
    relatedStories: ["大闹天宫"],
  },
  {
    name: "天河",
    realm: "heaven",
    pos: { left: "25%", top: "30%" },
    desc: "天上的一条银河，由无数星辰汇聚而成。牛郎织女被天河隔开，每年七夕借鹊桥相会。",
    relatedCharacters: ["jingwei"],
    relatedStories: ["niulang-zhinv"],
  },
  {
    name: "雷峰塔",
    realm: "mortal",
    pos: { left: "80%", top: "60%" },
    desc: "杭州西湖边的古塔，法海和尚将白素贞镇压于此。塔倒之日，就是白蛇重见天日之时。",
    relatedCharacters: ["bainiangzi"],
    relatedStories: ["baishe-zhuan"],
  },
  {
    name: "五行山",
    realm: "mortal",
    pos: { left: "15%", top: "70%" },
    desc: "如来佛祖用五行山镇压孙悟空的大山。山下贴有六字真言：唵嘛呢叭咪。五百年后唐僧揭帖放出悟空。",
    relatedCharacters: ["wukong"],
    relatedStories: ["大闹天宫"],
  },
  {
    name: "火焰山",
    realm: "mortal",
    pos: { left: "70%", top: "75%" },
    desc: "八百里火焰，寸草不生。孙悟空三调芭蕉扇才扇灭大火，师徒四人方得通过。",
    relatedCharacters: ["wukong"],
    relatedStories: ["xiyou-huoyanshan"],
  },
  {
    name: "五岳之首·泰山",
    realm: "mortal",
    pos: { left: "40%", top: "62%" },
    desc: "东岳泰山，五岳之首，帝王封禅之地。泰山神东岳大帝主管人间生死，是民间最重要的山神。",
  },
  {
    name: "陈塘关",
    realm: "mortal",
    pos: { left: "88%", top: "45%" },
    desc: "哪吒的故乡，李靖镇守的关口。哪吒在此闹海引发大战，最终削骨还父、莲花重生。",
    relatedCharacters: ["nezha"],
    relatedStories: ["nezha-naohai"],
  },
```

同时为已有 11 个地标补充 `relatedCharacters` 和 `relatedStories`：

**昆仑山** — 添加：

```ts
    relatedCharacters: ["wangmu"],
    relatedStories: ["shennong-changbaicao"],
```

**天庭** — 添加：

```ts
    relatedCharacters: ["yuhuangdadi"],
    relatedStories: ["xiyou-san-baigujing"],
```

**瑶池** — 添加：

```ts
    relatedCharacters: ["wangmu"],
    relatedStories: ["xiyou-san-baigujing"],
```

**蓬莱仙岛** — 添加：

```ts
    relatedCharacters: ["lvdongbin"],
    relatedStories: ["baxian-guohai"],
```

**东胜神洲** — 添加：

```ts
    relatedCharacters: ["wukong"],
    relatedStories: ["xiyou-san-baigujing"],
```

**不周山** — 添加：

```ts
    relatedCharacters: ["nuwa"],
    relatedStories: ["nuwa-butian"],
```

**东海之滨** — 添加：

```ts
    relatedCharacters: ["nezha", "jingwei"],
    relatedStories: ["nezha-naohai", "jingwei-tianhai"],
```

**龙宫** — 添加：

```ts
    relatedCharacters: ["nezha"],
    relatedStories: ["nezha-naohai"],
```

**丰都鬼城** — 添加：

```ts
    relatedStories: [],
```

**忘川河** — 添加：

```ts
    relatedStories: [],
```

**六道轮回** — 添加：

```ts
    relatedStories: [],
```

- [ ] **Step 2: 在 worldmap.html 中添加 8 个新 .map-region**

在 worldmap.html 的 SVG 中，找到最后的 `<!-- 分界线 -->` 之后、`</svg>` 之前，在人间和冥界区域各添加新地标。具体 HTML 需要读取 worldmap.html 确认坐标位置，然后插入新的 `.map-region` 元素。每个地标格式参照现有结构：

```html
<g class="map-region" style="left: XX%; top: YY%">
  <circle class="map-region__dot" />
  <text class="map-region__label">地名</text>
</g>
```

新地标坐标：

- 月宫: `left: 60%; top: 12%` (天界区域)
- 花果山: `left: 2%; top: 45%` (人间左侧)
- 南天门: `left: 50%; top: 3%` (天界顶部)
- 天河: `left: 25%; top: 30%` (天界中偏左)
- 雷峰塔: `left: 80%; top: 60%` (人间右侧)
- 五行山: `left: 15%; top: 70%` (人间下方)
- 火焰山: `left: 70%; top: 75%` (人间最下方)
- 陈塘关: `left: 88%; top: 45%` (人间最右侧)
- 五岳: `left: 40%; top: 62%` (人间中部)

- [ ] **Step 3: 验证**

Run: `npm run build`
Expected: 0 errors

---

### Task 5: 创建 localStorage 统一管理

**Files:**

- Create: `src/utils/storage.ts`

- [ ] **Step 1: 创建 storage.ts**

```ts
const STORAGE_KEYS = {
  favorites: "myth-favorites",
  readProgress: "myth-read-progress",
  settings: "myth-settings",
} as const;

interface ReadProgress {
  [storyId: string]: number; // 0-100 百分比
}

interface AppSettings {
  fontSize: number;
  eyeCare: boolean;
}

function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// 收藏
export function getFavorites(): Record<string, boolean> {
  return getItem<Record<string, boolean>>(STORAGE_KEYS.favorites) || {};
}

export function toggleFavorite(storyId: string): boolean {
  const favs = getFavorites();
  favs[storyId] = !favs[storyId];
  setItem(STORAGE_KEYS.favorites, favs);
  return favs[storyId];
}

// 阅读进度
export function getReadProgress(): ReadProgress {
  return getItem<ReadProgress>(STORAGE_KEYS.readProgress) || {};
}

export function setReadProgress(storyId: string, percent: number): void {
  const progress = getReadProgress();
  progress[storyId] = percent;
  setItem(STORAGE_KEYS.readProgress, progress);
}

export function getReadPercent(storyId: string): number {
  return getReadProgress()[storyId] || 0;
}

// 设置
export function getSettings(): AppSettings {
  return (
    getItem<AppSettings>(STORAGE_KEYS.settings) || {
      fontSize: 17,
      eyeCare: false,
    }
  );
}

export function setSettings(settings: AppSettings): void {
  setItem(STORAGE_KEYS.settings, settings);
}
```

- [ ] **Step 2: 验证**

Run: `npm run build`
Expected: 0 errors

---

### Task 6: 全局搜索功能

**Files:**

- Create: `src/components/search.ts`
- Modify: `src/main.ts`
- Modify: `src/styles/global.css`
- Modify: `index.html` / `characters.html` / `stories.html` / `worldmap.html` (搜索框 HTML)

- [ ] **Step 1: 创建搜索组件**

```ts
import { stories } from "../data/stories";
import { characters } from "../data/characters";
import { places } from "../data/places";

interface SearchResult {
  type: "story" | "character" | "place";
  id: string;
  title: string;
  desc: string;
  url: string;
}

function search(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  stories.forEach((s) => {
    if (
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q)
    ) {
      results.push({
        type: "story",
        id: s.id,
        title: s.title,
        desc: s.summary.slice(0, 60) + "...",
        url: `stories.html?id=${s.id}`,
      });
    }
  });

  characters.forEach((c) => {
    const searchable =
      `${c.name} ${c.altName} ${c.title} ${c.desc} ${c.era}`.toLowerCase();
    if (searchable.includes(q)) {
      results.push({
        type: "character",
        id: c.id,
        title: c.name,
        desc: c.title + " - " + c.desc.slice(0, 40) + "...",
        url: `characters.html#${c.id}`,
      });
    }
  });

  places.forEach((p) => {
    if (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) {
      results.push({
        type: "place",
        id: p.name,
        title: p.name,
        desc: p.desc,
        url: "worldmap.html",
      });
    }
  });

  return results.slice(0, 12);
}

let panel: HTMLDivElement | null = null;

export function initSearch() {
  panel = document.createElement("div");
  panel.className = "search-panel hidden";
  panel.id = "search-panel";
  document.body.appendChild(panel);

  document.addEventListener("keydown", (e) => {
    if ((e.key === "k" || e.key === "/") && !e.ctrlKey && !e.metaKey) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      e.preventDefault();
      showSearch();
    }
    if (e.key === "Escape") hideSearch();
  });

  window.addEventListener("scroll", () => {
    if (panel && !panel.classList.contains("hidden")) hideSearch();
  });
}

export function showSearch() {
  if (!panel) return;
  panel.classList.remove("hidden");
  const input = panel.querySelector<HTMLInputElement>(".search-panel__input");
  if (input) input.focus();
}

export function hideSearch() {
  if (!panel) return;
  panel.classList.add("hidden");
  const input = panel.querySelector<HTMLInputElement>(".search-panel__input");
  if (input) input.value = "";
}

function renderResults(results: SearchResult[]) {
  if (!panel) return;
  if (results.length === 0) {
    panel.innerHTML = `<div class="search-panel__empty">未找到相关结果</div>`;
    return;
  }

  panel.innerHTML = results
    .map((r) => {
      const typeLabel =
        r.type === "story" ? "故事" : r.type === "character" ? "人物" : "地标";
      const typeClass =
        r.type === "story"
          ? "search-result__type--story"
          : r.type === "character"
            ? "search-result__type--char"
            : "search-result__type--place";
      return `
      <a href="${r.url}" class="search-result" onclick="hideSearch()">
        <span class="search-result__type ${typeClass}">${typeLabel}</span>
        <div class="search-result__text">
          <span class="search-result__title">${r.title}</span>
          <span class="search-result__desc">${r.desc}</span>
        </div>
      </a>`;
    })
    .join("");
}
```

- [ ] **Step 2: 在 main.ts 中初始化搜索**

在 `src/main.ts` 中，在现有 import 之后添加：

```ts
import { initSearch, showSearch, hideSearch } from "./components/search";
```

在 `DOMContentLoaded` 回调中添加 `initSearch();`：

```ts
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  initMobileMenu();
  initSearch();
});
```

- [ ] **Step 3: 在 4 个 HTML 的导航栏中添加搜索按钮**

在每个 HTML 的 `nav` 中，`<ul class="nav__links">` 前添加：

```html
<button class="nav__search-btn" aria-label="搜索" onclick="showSearch()">
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
  >
    <circle cx="8" cy="8" r="6" />
    <line x1="12.5" y1="5.5" x2="15.5" y2="8.5" />
    <line x1="15.5" y1="12.5" x2="12.5" y2="15.5" />
  </svg>
</button>
```

用 Python 批量处理 4 个文件（`index.html`, `characters.html`, `stories.html`, `worldmap.html`），在每个 `<ul class="nav__links">` 之前插入搜索按钮 HTML。

- [ ] **Step 4: 添加搜索面板样式**

在 `src/styles/global.css` 末尾 `</style>` 前添加：

```css
/* === 全局搜索 === */
.nav__search-btn {
  background: none;
  border: none;
  color: var(--ink-muted);
  cursor: pointer;
  padding: 4px 8px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm);
  transition: all var(--duration) var(--ease-out);
}

.nav__search-btn:hover {
  color: var(--ink);
  background: var(--paper);
}

.search-panel {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: min(90%, 420px);
  max-height: calc(100vh - 120px);
  background: var(--paper);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 16px;
  z-index: 1000;
  overflow-y: auto;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s var(--ease-out);
}

.search-panel.visible {
  opacity: 1;
  pointer-events: auto;
}

.search-panel.hidden {
  display: none;
}

.search-panel.hidden.visible {
  display: block;
}

.search-panel__input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--mountain-far);
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: 15px;
  outline: none;
  background: var(--paper-deep);
}

.search-panel__input:focus {
  border-color: var(--cinnabar);
}

.search-panel__empty {
  text-align: center;
  color: var(--ink-muted);
  padding: 20px 0;
}

.search-result {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--ink);
  transition: background var(--duration) var(--ease-out);
}

.search-result:hover {
  background: var(--paper-deep);
}

.search-result__type {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  flex-shrink: 0;
}

.search-result__type--story {
  background: rgba(196, 62, 62, 0.08);
  color: var(--cinnabar);
}

.search-result__type--char {
  background: rgba(90, 138, 106, 0.08);
  color: var(--jade);
}

.search-result__type--place {
  background: rgba(184, 150, 78, 0.08);
  color: var(--gold);
}

.search-result__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.search-result__title {
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
}

.search-result__desc {
  font-size: 13px;
  color: var(--ink-muted);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
}
```

同时在 `.search-panel.visible` 样式中添加 `display: block`：

```css
.search-panel.visible {
  opacity: 1;
  pointer-events: auto;
}
```

- [ ] **Step 5: 绑定搜索输入事件**

在 `src/components/search.ts` 中，在 `showSearch` 函数内，`input.focus()` 之后添加输入监听：

```ts
export function showSearch() {
  if (!panel) return;
  panel.classList.remove("hidden");
  const input = panel.querySelector<HTMLInputElement>(".search-panel__input");
  if (input) {
    input.value = "";
    input.focus();

    let debounceTimer: ReturnType<typeof setTimeout>;
    input.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const results = search(input.value);
        renderResults(results);
        panel.classList.add("visible");
      }, 200);
    });
  }
}
```

- [ ] **Step 6: 验证**

Run: `npm run build`
Expected: 0 errors

---

### Task 7: 阅读工具栏补全

**Files:**

- Modify: `stories.html` (工具栏 HTML)
- Modify: `src/pages/stories.ts`

- [ ] **Step 1: 在 stories.html 工具栏增加 3 个按钮**

将 `stories.html` 中的 reader-toolbar 替换为（保留进度条位置）：

```html
<div class="reader-toolbar">
  <button title="返回列表">← 列表</button>
  <button title="缩小字号">A<span style="font-size: 10px">-</span></button>
  <button title="放大字号">A<span style="font-size: 16px">+</span></button>
  <div class="reader-toolbar__progress">
    <div class="reader-toolbar__progress-bar"></div>
  </div>
  <button title="上一章">←</button>
  <button title="下一章">→</button>
  <button title="朗读" id="btn-read-aloud">朗读</button>
  <button title="收藏">☆</button>
  <button title="护眼模式" id="btn-eye-care">🌙</button>
</div>
```

- [ ] **Step 2: 在 stories.ts 中添加返回列表功能**

在 `initReaderToolbar` 函数中，`// 返回列表按钮` 注释后添加：

```ts
const backBtn = buttons[0];
if (backBtn) {
  backBtn.addEventListener("click", () => {
    const storyText = document.querySelector<HTMLElement>(".story-text");
    if (storyText) storyText.style.fontSize = "";
    currentStoryId = null;
    const container = document.getElementById("story-reader-content");
    if (container) container.innerHTML = "";
    history.pushState(null, "", location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
```

- [ ] **Step 3: 在 stories.ts 中添加全文朗读功能**

在 `// 收藏` 注释后、`// 进度条` 注释前添加：

```ts
// 全文朗读
const readAloudBtn = buttons[5];
if (readAloudBtn) {
  readAloudBtn.addEventListener("click", () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const storyText = document.querySelector<HTMLElement>(".story-text");
    if (!storyText) return;

    if (synth.speaking) {
      synth.cancel();
    } else {
      const utterance = new SpeechSynthesisUtterance(
        storyText.textContent || "",
        "zh-CN",
      );
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synth.speak(utterance);
      readAloudBtn.textContent = "停止";
      return;
    }

    const paragraphs = storyText.querySelectorAll<HTMLElement>("p");
    const fullText = Array.from(paragraphs)
      .map((p) => p.textContent || "")
      .join("");
    const utterance = new SpeechSynthesisUtterance(fullText, "zh-CN");
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => {
      readAloudBtn.textContent = "朗读";
      synth.cancel();
    };

    synth.speak(utterance);
    readAloudBtn.textContent = "停止";
  });
}
```

- [ ] **Step 4: 在 stories.ts 中添加护眼模式**

在朗读功能后添加：

```ts
  // 护眼模式
  const eyeCareBtn = buttons[6];
  if (eyeCareBtn) {
    eyeCareBtn.addEventListener("click", () => {
      const settings = getSettings();
      settings.eyeCare = !settings.eyeCare;
      setSettings(settings);
      updateEyeCareMode();
    });
  }
}

function updateEyeCareMode() {
  const settings = getSettings();
  const isEyeCare = settings.eyeCare;
  document.body.classList.toggle("eye-care", isEyeCare);
  if (eyeCareBtn) {
    eyeCareBtn.textContent = isEyeCare ? "☀️" : "🌙";
  }
}
```

- [ ] **Step 5: 添加护眼模式 CSS**

在 `src/styles/global.css` 中添加（在上一步添加的搜索样式之前）：

```css
/* === 护眼模式 === */
body.eye-care {
  --paper: #1a1a1a;
  --paper-deep: #111111;
  --ink: #c8c8c8;
  --ink-light: #a0a0a0;
  --ink-muted: #666;
  --mountain-far: #3a3a3a;
  --mountain-mid: #2a2a2a;
  --mountain-near: #1a1a1a;
  --sky-dawn: #1a1a2a;
  background: #111;
  color: #c8c8c8;
}

body.eye-care .story-text,
body.eye-care .discussion-box {
  background: #1a1a1a;
}

body.eye-care .story-reader__header h1,
body.eye-care .story-reader__title {
  color: #e0d0c0;
}

body.eye-care .story-reader__category,
body.eye-care .story-reader__divider {
  color: #888;
}

body.eye-care .tag {
  background: rgba(255, 255, 255, 0.08);
  color: #bbb;
}
```

- [ ] **Step 6: 验证**

Run: `npm run build`
Expected: 0 errors

---

### Task 8: 阅读进度持久化 + 已读标记

**Files:**

- Modify: `src/pages/stories.ts`

- [ ] **Step 1: 在 loadStory 中保存进度**

在 `loadStory` 函数中，`updateToolbarState()` 调用之前添加：

```ts
function saveProgress() {
  const storyText = document.querySelector<HTMLElement>(".story-text");
  if (!storyText || !currentStoryId) return;
  const total = storyText.scrollHeight - storyText.clientHeight;
  if (total <= 0) return;
  const scrolled = -storyText.getBoundingClientRect().top;
  const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
  setReadProgress(currentStoryId, pct);
}
```

在 `updateToolbarState()` 函数开头调用 `saveProgress();`。

- [ ] **Step 2: 恢复已保存进度**

在 `loadStory` 函数中，填充阅读内容之后添加恢复进度逻辑：

```ts
// 恢复已保存的阅读进度
const savedPercent = getReadPercent(storyId);
if (savedPercent > 0 && savedPercent < 100) {
  requestAnimationFrame(() => {
    const storyText = document.querySelector<HTMLElement>(".story-text");
    if (!storyText) return;
    const total = storyText.scrollHeight - storyText.clientHeight;
    if (total <= 0) return;
    const targetScroll = (savedPercent / 100) * total;
    window.scrollTo({
      top:
        storyText.getBoundingClientRect().top +
        targetScroll -
        window.innerHeight / 2,
      behavior: "auto",
    });
  });
}
```

- [ ] **Step 3: 在故事卡片上显示已读标记**

在 `renderStoryRowCard` 函数中，在 `</div>` 之前（故事卡片内容区关闭标签前），如果故事已读完 80%+ 则添加已读角标：

```ts
function renderStoryRowCard(story: Story): string {
  const isRead = getReadPercent(story.id) >= 80;
  const readBadge = isRead
    ? `<span class="story-row-card__read-badge">已读</span>`
    : "";
  // ... 在 .story-row-card__content 的 </div> 前 插入 readBadge
  return `
  <div class="story-row-card" data-id="${story.id}">
    ...
    <div class="story-row-card__content">
      ${tagHtml}
      ${readBadge}
      <span>阅读约 ${story.readingTime} 分钟</span>
      <span>适合 ${story.ageRange}</span>
    </div>
  </div>`;
}
```

- [ ] **Step 4: 添加已读角标样式**

在 `src/styles/stories.css` 中添加：

```css
.story-row-card__read-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--jade);
  color: white;
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  z-index: 1;
}
```

同时给 `.story-row-card__content` 添加 `position: relative;`：

```css
.story-row-card__content {
  ...
  position: relative;
  overflow: hidden;
}
```

- [ ] **Step 5: 验证**

Run: `npm run build`
Expected: 0 errors

---

### Task 9: 人物详情丰富

**Files:**

- Modify: `src/pages/characters.ts`
- Modify: `src/styles/characters.css`

- [ ] **Step 1: 丰富 renderCharDetail 添加法宝列表**

在 `renderCharDetail` 函数的 `${descParagraphs}` 之后，`</div>` 之前添加法宝列表渲染：

```ts
const artifactsHtml =
  char.artifacts && char.artifacts.length > 0
    ? `<div class="char-artifacts">
        <h4>法宝与技能</h4>
        ${char.artifacts
          .map(
            (a) => `
            <div class="char-artifact">
              <span class="char-artifact__name">${a.name}</span>
              <span class="char-artifact__desc">${a.desc}</span>
            </div>
          `,
          )
          .join("")}
      </div>`
    : "";
```

在 `${descParagraphs}` 之后、`</div>` 之前插入 `${artifactsHtml}`。

- [ ] **Step 2: 丰富 renderCharDetail 添加经典语录**

在法宝列表之后添加：

```ts
const quotesHtml =
  char.quotes && char.quotes.length > 0
    ? `<div class="char-quotes">
        <h4>经典语录</h4>
        ${char.quotes
          .map(
            (q) => `
            <blockquote class="char-quote">
              <p>"${q.text}"</p>
              ${q.source ? `<cite>—— ${q.source}</cite>` : ""}
            </blockquote>
          `,
          )
          .join("")}
      </div>`
    : "";
```

- [ ] **Step 3: 丰富 renderCharDetail 关联故事可点击**

将 `relatedStories` 的渲染改为可点击链接。替换 renderCharDetail 函数末尾附近，在 `</div>` 前的相关故事部分。

- [ ] **Step 4: 添加法宝列表和语录样式**

在 `src/styles/characters.css` 中添加：

```css
.char-artifacts {
  margin-top: 16px;
}

.char-artifacts h4 {
  font-family: var(--font-serif);
  font-size: 14px;
  color: var(--ink);
  margin-bottom: 10px;
}

.char-artifact {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  background: var(--paper-deep);
  border-radius: var(--radius-sm);
}

.char-artifact__name {
  font-family: var(--font-serif);
  font-size: 13px;
  font-weight: 600;
  color: var(--cinnabar);
}

.char-artifact__desc {
  font-size: 12px;
  color: var(--ink-muted);
}

.char-quotes {
  margin-top: 16px;
}

.char-quotes h4 {
  font-family: var(--font-serif);
  font-size: 14px;
  color: var(--ink);
  margin-bottom: 10px;
}

.char-quote {
  margin: 8px 0;
 12px 16px;
  border-left: 3px solid var(--gold);
  padding-left: 12px;
  color: var(--ink-light);
  font-style: italic;
}

.char-quote cite {
  display: block;
  font-size: 11px;
  color: var(--ink-muted);
  margin-top: 4px;
  font-style: normal;
}
```

- [ ] **Step 5: 验证**

Run: `npm run build`
Expected: 0 errors

---

### Task 10: 首页文化板块数据驱动

**Files:**

- Modify: `index.html` (精简文化板块 HTML)
- Modify: `src/data/culture.ts` (新建)
- Modify: `src/pages/home.ts` (渲染文化卡片)

- [ ] **Step 1: 创建文化数据文件**

```ts
// src/data/culture.ts
export interface CultureItem {
  id: string;
  title: string;
  icon: string;
  dotColor: string;
  content: string;
}

export const cultureItems: CultureItem[] = [
  {
    id: "festivals",
    title: "节日与神话",
    icon: "节",
    dotColor: "var(--gold)",
    content:
      "中国的每一个传统节日背后几乎都有一个神话故事。春节赶年兽、清明祭祖、端午赛龙舟、七夕鹊桥、中秋赏月——这些流传千年的习俗，都是神话在现代生活中的延续。了解这些故事，让孩子过节时更有仪式感。",
  },
  {
    id: "folklore",
    title: "民俗溯源",
    icon: "俗",
    dotColor: "var(--cinnabar)",
    content:
      "从剪纸到糖画，从龙舟到舞狮，中国丰富的民间艺术形式都源于神话传说。门神是驱邪的，灶王爷保灶台的，财神管财运——这些民间信仰的背后，都有一个神话原型。",
  },
  {
    id: "symbolism",
    title: "象征与寓意",
    icon: "寓",
    dotColor: "var(--jade)",
    content:
      "龙是中华文明的象征，凤代表祥瑞，莲花象征高洁，松柏代表坚韧。这些符号遍布建筑、服饰和日常生活中，每个背后都有一段神话传说。",
  },
  {
    id: "geography",
    title: "地理与传说",
    icon: "地",
    dotColor: "var(--mountain-mid)",
    content:
      "昆仑山、蓬莱仙岛、不周山、桃花源——中国大地上的许多山川都有对应的神话传说。三山五岳、四海八荒，每处山水都有一段传奇。",
  },
];
```

- [ ] **Step 2: 精简 index.html 文化板块**

将 index.html 中 `<div class="culture-links">` 及其全部 4 个 `.culture-link-item` 子元素替换为：

```html
<div id="culture-links" class="culture-links"></div>
```

- [ ] **Step 3: 在 home.ts 中渲染文化卡片**

在 `home.ts` 中导入并添加渲染函数：

```ts
import { cultureItems } from "../data/culture";

function renderCultureCard(item: CultureItem): string {
  return `
  <div class="culture-link-item">
    <span class="dot" style="background: ${item.dotColor}"></span>
    ${item.title}
    <p class="culture-link-item__desc">${item.content}</p>
  </div>`;
}
```

在 `DOMContentLoaded` 中渲染：

```ts
const cultureLinks = document.getElementById("culture-links");
if (cultureLinks) {
  cultureLinks.innerHTML = cultureItems.map(renderCultureCard).join("");
}
```

- [ ] **Step 4: 添加文化卡片描述样式**

在 `src/styles/home.css` 中添加：

```css
.culture-link-item__desc {
  display: none;
  font-size: 12px;
  color: var(--ink-light);
  line-height: 1.5;
  margin-top: 4px;
}

.culture-link-item:hover .culture-link-item__desc {
  display: block;
}
```

- [ ] **Step 5: 验证**

Run: `npm run build`
Expected: 0 errors

---

### Task 11: 中国风动画

**Files:**

- Modify: `src/styles/home.css`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Hero 云雾飘移动画**

在 `src/styles/home.css` 的 `.hero__mountains` 样式之后添加：

```css
.hero__mountains {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  opacity: 0.12;
  animation: cloud-drift 30s linear infinite;
}

@keyframes cloud-drift {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50px);
  }
}
```

- [ ] **Step 2: 花瓣飘落动画**

在 global.css 中添加（护眼模式样式之前）：

```css
@keyframes petal-fall {
  0% {
    transform: translateY(-20px) rotate(0deg) translateX(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg) translateX(100px);
    opacity: 0;
  }
}

.petal {
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 50% 0 50%;
 50% 50%;
 0;
 0;
  background: rgba(196, 62, 62, 0.3);
  pointer-events: none;
  z-index: 0;
  animation: petal-fall linear infinite;
}
```

- [ ] **Step 3: 在 home.ts 中生成花瓣**

在 `home.ts` 的 `initScrollHint()` 函数之后添加：

```ts
function initPetals() {
  const container = document.querySelector(".hero");
  if (!container) return;
  for (let i = 0; i < 8; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.animationDelay = `${Math.random() * 15}s`;
    petal.style.left = `${Math.random() * 100}%`;
    container.appendChild(petal);
  }
}
```

在 `DOMContentLoaded` 中调用 `initPetals();`。

- [ ] **Step 4: 卡片交错入场动画**

在 global.css 的 `.fade-in-up` 样式之后添加：

```css
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out);
}

.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 卡片交错入场 */
.stagger-enter > * {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.4s var(--ease-out),
    transform 0.4s var(--ease-out);
}

.stagger-enter > *.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 5: 在 stories.ts 和 characters.ts 中启用交错入场**

在 `renderStoriesList` 函数中，渲染完 `container.innerHTML = ...` 之后添加：

```ts
container
  .querySelectorAll<HTMLElement>(".story-row-card, .stories-list__group-title")
  .forEach((el, i) => {
    el.classList.add("stagger-enter");
    setTimeout(() => el.classList.add("visible"), i * 60);
  });
```

在 `renderCharGrid` 函数中渲染完 `grid.innerHTML = ...` 之后添加类似逻辑：

```ts
grid.querySelectorAll<HTMLElement>(".char-detail-card").forEach((el, i) => {
  el.classList.add("stagger-enter");
  setTimeout(() => el.classList.add("visible"), i * 60);
});
```

- [ ] **Step 6: 验证**

Run: `npm run build`
Expected: 0 errors

---

### Task 12: 构建验证与提交

- [ ] **Step 1: 完整构建验证**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 2: 逐页检查**

Run: `npm run dev`，验证清单：

- [ ] 首页：3 故事卡 + 4 个人物卡 + 文化板块 4 张卡片 + 花瓣飘落动画 + 云雾飘移
- [ ] 故事页：20 篇故事 + 分类 chip 筛选生效 + 搜索面板 (Ctrl+K) + 阅读器加载 + 朗读/停止 + 护眼切换 + 返回列表 + 上一章/下一章 + 收藏 + 进度条 + 已读标记
- [ ] 人物页：17 个人物 + 筛选按钮生效 + 详情区法宝+语录+关联故事 + 卡片交错入场
- [ ] 世界地图：19 个地标 + tooltip 显示关联人物和故事
- [ ] 4 个页面搜索面板正常弹出和关闭

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: 数据扩展至20故事17人物19地标，增加搜索/朗读/护眼/进度/动画"
```
