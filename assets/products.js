const productCopy = {
  zh: {
    navDocs: "文档", navProducts: "产品", navContact: "联系我们",
    heroEyebrow: "产品体系", heroTitle: "从量子性能声明，<br />到决策级证据。", heroLead: "Qriterion 为量子硬件建立独立的测量、验证与数据基础设施，让每一项性能主张都可追溯、可审查、可比较。", heroCta: "探索产品体系 <span aria-hidden=\"true\">↓</span>", heroContact: "与我们联系",
    mapEyebrow: "从证据到行动", mapTitle: "一条证据链，四项产品。", mapIntro: "每一层都建立在上一层可追溯的数据之上：先统一测量，再独立验证，进而形成决策数据；智能路由是这套证据网络成熟后的长期能力。",
    gaugeStatus: "开放源代码", gaugeFamily: "开放基准套件", gaugeSubtitle: "量子硬件开放基准测试套件", gaugeCopy: "用 vendor-neutral、可复现的协议，降低跨平台 QPU 测试与横向比较的门槛。", gaugeItem1: "标准化 workload 与测试协议", gaugeItem2: "自动化执行与统一数据格式", gaugeItem3: "覆盖硬件、circuit 与 algorithm 层表现", gaugeFor: "开发者、研究机构与 QPU 厂商",
    verificationStatus: "验证服务", verificationFamily: "独立评估", verificationSubtitle: "第三方独立 QPU 验证", verificationCopy: "将 QPU 性能声明转化为可审计、可追溯、可引用的第三方性能证据。", verificationItem1: "指定设备或云端 QPU 的独立测试", verificationItem2: "原始数据、统计分析与测试环境记录", verificationItem3: "标准化的验证报告与证据状态", verificationFor: "QPU 厂商、采购方与投资机构",
    atlasStatus: "数据服务", atlasFamily: "性能情报", atlasSubtitle: "商业量子性能数据服务", atlasCopy: "把跨厂商、跨硬件路线与跨时间积累的 benchmark 结果，转化为可用于技术与商业决策的数据资产。", atlasItem1: "历史性能、代际变化与任务表现", atlasItem2: "成本、稳定性与证据状态的结构化视图", atlasItem3: "订阅数据库、报告、API 与定制分析", atlasFor: "投资、采购、政府与产业研究机构",
    routerStatus: "长期目标", routerFamily: "智能调度", routerSubtitle: "基于证据的量子算力路由", routerCopy: "在充分积累 benchmark 与真实 workload 数据后，为每项任务匹配最合适的 QPU、云平台与执行路径。", routerItem1: "结合任务、精度、预算与时间约束", routerItem2: "预测执行表现、成本、排队与成功率", routerItem3: "推荐 QPU、编译策略与执行方案", routerFor: "企业用户、量子云平台与开发者",
    forLabel: "面向", chainOne: "统一测量", chainTwo: "独立验证", chainThree: "决策数据", chainFour: "智能路由", contactEyebrow: "共同建立评测标准", contactTitle: "更好的量子决策，始于更可靠的证据。", contactText: "无论是使用 Gauge、开展独立验证，还是探索 Atlas 数据服务，欢迎与我们交流。", contactCta: "开始交流 <span aria-hidden=\"true\">→</span>", footer: "© 2026 Qriterion。独立量子性能评测与决策基础设施。", footerLink: "浏览 QPU Cards →"
  },
  en: {
    navDocs: "Docs", navProducts: "Products", navContact: "Contact",
    heroEyebrow: "Product system", heroTitle: "From quantum claims,<br />to decision-grade evidence.", heroLead: "Qriterion builds independent measurement, verification and data infrastructure for quantum hardware—so every performance claim is traceable, auditable and comparable.", heroCta: "Explore the product system <span aria-hidden=\"true\">↓</span>", heroContact: "Contact us",
    mapEyebrow: "From evidence to action", mapTitle: "One evidence chain. Four products.", mapIntro: "Each layer builds on traceable data from the last: standardize measurement, verify independently, build decision-grade intelligence, then enable routing as the evidence network matures.",
    gaugeStatus: "Open source", gaugeFamily: "Open benchmarking suite", gaugeSubtitle: "Open benchmarking suite for quantum hardware", gaugeCopy: "Vendor-neutral, reproducible protocols that lower the barrier to testing and comparing QPUs across platforms.", gaugeItem1: "Standard workloads and test protocols", gaugeItem2: "Automated execution and unified data formats", gaugeItem3: "Hardware-, circuit- and algorithm-level performance", gaugeFor: "Developers, research institutions and QPU vendors",
    verificationStatus: "Verification service", verificationFamily: "Independent assessment", verificationSubtitle: "Independent third-party QPU verification", verificationCopy: "Turn QPU performance claims into independent evidence that is auditable, traceable and citable.", verificationItem1: "Independent tests of specified devices or cloud QPUs", verificationItem2: "Raw data, statistical analysis and test-environment records", verificationItem3: "Standardized verification reports and evidence status", verificationFor: "QPU vendors, buyers and investment institutions",
    atlasStatus: "Data service", atlasFamily: "Performance intelligence", atlasSubtitle: "Commercial quantum performance data service", atlasCopy: "Transform benchmark results accumulated across vendors, modalities and time into decision-ready data assets.", atlasItem1: "Historical performance, generation change and workload behavior", atlasItem2: "Structured views of cost, stability and evidence status", atlasItem3: "Subscription database, reports, API and custom analysis", atlasFor: "Investors, procurement teams, governments and industry researchers",
    routerStatus: "Future capability", routerFamily: "Intelligent orchestration", routerSubtitle: "Evidence-based quantum compute routing", routerCopy: "As benchmark and real-workload evidence accumulates, match each task to the QPU, cloud platform and execution path best suited to it.", routerItem1: "Incorporate task, accuracy, budget and timing constraints", routerItem2: "Predict performance, cost, queue time and success rate", routerItem3: "Recommend QPUs, compilation strategies and execution plans", routerFor: "Enterprise users, quantum cloud platforms and developers",
    forLabel: "For", chainOne: "Standardize measurement", chainTwo: "Verify independently", chainThree: "Build decision data", chainFour: "Route intelligently", contactEyebrow: "Build the standard with us", contactTitle: "Better quantum decisions start with better evidence.", contactText: "Whether you want to use Gauge, commission independent verification or explore Atlas data services, we would like to hear from you.", contactCta: "Start a conversation <span aria-hidden=\"true\">→</span>", footer: "© 2026 Qriterion. Independent quantum performance intelligence.", footerLink: "Explore QPU Cards →"
  }
};

function setProductLanguage(language) {
  const dictionary = productCopy[language];
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.innerHTML = dictionary[element.dataset.i18n]; });
  document.querySelectorAll("[data-language]").forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => setProductLanguage(button.dataset.language)));
setProductLanguage("zh");
