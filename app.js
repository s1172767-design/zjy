(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const header = $("#siteHeader");
  const navLinks = $$(".nav-link");
  const railLinks = $$(".section-rail a");
  const sectionIds = ["home", "about", "system", "journey", "courses", "assessment", "implementation"];
  const mobileNav = $("#mobileNav");
  const menuToggle = $("#menuToggle");
  const scrollProgress = $("#scrollProgress");
  const backToTop = $("#backToTop");
  const toast = $("#toast");
  const toastText = $("#toastText");
  let toastTimer;
  let activeSection = "home";

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toastText.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function closeMobileMenu() {
    mobileNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "打开导航菜单");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "关闭导航菜单" : "打开导航菜单");
    document.body.classList.toggle("menu-open", isOpen);
  });

  $$("a", mobileNav).forEach((link) => link.addEventListener("click", closeMobileMenu));

  function updateNavigation() {
    const fromTop = window.scrollY + Math.max(130, window.innerHeight * 0.28);
    let current = "home";

    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= fromTop) current = id;
    }

    if (current !== activeSection) {
      activeSection = current;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${current}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
      railLinks.forEach((link) => {
        const isActive = link.dataset.rail === current;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    header.classList.toggle("is-scrolled", window.scrollY > 28);
    backToTop.classList.toggle("is-visible", window.scrollY > 700);
  }

  let scrollQueued = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollQueued) return;
      scrollQueued = true;
      window.requestAnimationFrame(() => {
        updateNavigation();
        scrollQueued = false;
      });
    },
    { passive: true },
  );

  window.addEventListener("resize", updateNavigation);
  updateNavigation();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" },
  );

  $$(".reveal").forEach((element) => revealObserver.observe(element));

  const accordionItems = $$(".accordion-item");
  accordionItems.forEach((item) => {
    const trigger = $(".accordion-trigger", item);
    trigger.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      accordionItems.forEach((other) => {
        other.classList.remove("is-open");
        $(".accordion-trigger", other).setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  const phaseCards = $$(".phase-card");
  phaseCards.forEach((card) => {
    const trigger = $(".phase-trigger", card);
    trigger.addEventListener("click", () => {
      const willOpen = !card.classList.contains("is-active");
      phaseCards.forEach((other) => {
        other.classList.remove("is-active");
        $(".phase-trigger", other).setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        card.classList.add("is-active");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  $$(".course-filter button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".course-filter button").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      const filter = button.dataset.filter;
      $$(".course-card").forEach((card) => {
        card.classList.toggle("is-filtered", filter !== "all" && card.dataset.category !== filter);
      });
    });
  });

  const journeyData = [
    {
      title: "护理员登录系统",
      english: "IDENTITY & LEARNING PROFILE",
      description:
        "护理员完成身份验证，进入个人学习空间。系统调取已有知识基础与训练记录，为本次学习建立清晰起点。",
      points: ["身份与权限验证", "同步个人能力档案", "生成今日训练任务"],
      tip: "原型说明：学员姓名、进度和任务均为模拟演示。",
      label: "LEARNING PROFILE",
      screen: `
        <div class="screen-app-header">
          <h4>下午好，林同学</h4><span>2026.11.13 · 14:30</span>
        </div>
        <div class="profile-panel">
          <span class="profile-big-avatar"><img src="./assets/avatar-learner.jpg" alt="" /></span>
          <div><h5>养老护理员 · 智慧照护进阶班</h5><p>学习档案编号 SCV-DEMO-0086</p></div>
          <span class="profile-current">档案已同步</span>
        </div>
        <div class="screen-progress-group">
          <div class="screen-mini-card"><small>综合学习进度</small><strong>76%</strong><i><b style="width:76%"></b></i></div>
          <div class="screen-mini-card"><small>已完成课程</small><strong>3 / 5</strong><i><b style="width:60%"></b></i></div>
          <div class="screen-mini-card"><small>本周学习时长</small><strong>4.8h</strong><i><b style="width:72%"></b></i></div>
        </div>
        <div class="screen-module-list">
          <div class="screen-module-row"><span>01</span><div><h5>今日任务 · 跌倒应急处置</h5><p>预计 35 分钟 · VR 场景练习</p></div><em>待开始</em></div>
        </div>`,
    },
    {
      title: "AI 导师提供个性化课程",
      english: "PERSONALIZED LEARNING PATH",
      description:
        "AI 导师根据护理员的薄弱项推荐护理知识、微课与练习任务，让每个人带着明确问题进入沉浸式训练。",
      points: ["识别个人薄弱环节", "生成个性化课程路径", "完成训练前知识准备"],
      tip: "原型说明：知识推荐使用预设规则与示范内容。",
      label: "SMART MENTOR",
      screen: `
        <div class="screen-app-header">
          <h4>为你定制的今日学习</h4><span>AI MENTOR · 模拟</span>
        </div>
        <div class="screen-ai-note">
          <span class="screen-mentor-photo"><img src="./assets/avatar-mentor.jpg" alt="" /></span>
          <p><strong>建议先复习“跌倒后评估”知识。</strong><br>你上次在“是否立即扶起老人”的判断上出现犹豫，今天将通过情境练习巩固这一流程。</p>
        </div>
        <div class="screen-module-list">
          <div class="screen-module-row"><span>01</span><div><h5>跌倒后的初步观察</h5><p>图文微课 · 6 分钟</p></div><em>已完成</em></div>
          <div class="screen-module-row"><span>02</span><div><h5>意识、呼吸与疼痛评估</h5><p>互动问答 · 8 分钟</p></div><em>学习中</em></div>
          <div class="screen-module-row"><span>03</span><div><h5>呼救与信息准确传递</h5><p>情境练习 · 7 分钟</p></div><em>待开始</em></div>
        </div>`,
    },
    {
      title: "护理员进入 VR 虚拟养老院",
      english: "IMMERSIVE TRAINING ENTRY",
      description:
        "护理员进入虚拟养老院，熟悉房间、设备与照护空间。系统同步校准视角，并给出本次训练的安全边界。",
      points: ["进入沉浸式养老场景", "完成视角与设备校准", "接收安全提示和任务目标"],
      tip: "网页原型用场景画面模拟 VR 头显中的视角。",
      label: "VR ORIENTATION",
      screen: `
        <div class="screen-app-header">
          <h4>虚拟养老院 · 二层生活区</h4><span>VR PROTOTYPE</span>
        </div>
        <div class="vr-world-preview">
          <span class="vr-world-label">ROOM B-207 · LOW RISK</span>
          <i class="vr-room-object"></i><i class="vr-room-object"></i><i class="vr-room-object"></i>
          <i class="vr-crosshair"></i>
        </div>
        <div class="screen-progress-group">
          <div class="screen-mini-card"><small>视角校准</small><strong>完成</strong><i><b style="width:100%"></b></i></div>
          <div class="screen-mini-card"><small>任务提示</small><strong>已接收</strong><i><b style="width:100%"></b></i></div>
          <div class="screen-mini-card"><small>训练安全状态</small><strong>正常</strong><i><b style="width:100%"></b></i></div>
        </div>`,
    },
    {
      title: "AI 生成虚拟老人并开始互动",
      english: "PERSON-CENTERED DIALOGUE",
      description:
        "AI 依据训练目标生成具有不同健康、性格和沟通特点的虚拟老人。护理员通过对话识别情绪、需求与潜在风险。",
      points: ["建立尊重式沟通连接", "识别情绪和未满足需求", "形成清晰的照护判断"],
      tip: "原型说明：对话使用预设分支，并非真实 AI 模型生成。",
      label: "AI DIALOGUE",
      screen: `
        <div class="screen-app-header">
          <h4>与王奶奶的对话</h4><span>情绪识别 · 模拟</span>
        </div>
        <div class="dialogue-screen">
          <div class="dialogue-elder-row">
            <span class="mini-avatar">王</span>
            <div class="bubble">“我已经吃过饭了，怎么又要吃？你们是不是不想管我了？”</div>
          </div>
          <div class="bubble caregiver">“王奶奶，我先陪您坐一会儿。您现在最担心的是什么？”</div>
          <div class="dialogue-elder-row">
            <span class="mini-avatar">王</span>
            <div class="bubble">“我记不清了……我就是心里不踏实。”</div>
          </div>
        </div>
        <div class="emotion-meter">情绪紧张度 <i><b></b></i><span>68% → 42%</span></div>`,
    },
    {
      title: "护理员完成 VR 模拟护理任务",
      english: "HANDS-ON SIMULATION",
      description:
        "护理员在跌倒处理、失智症沟通、日常照护等任务中完成实际操作。系统持续记录操作顺序、沟通表达与风险判断。",
      points: ["执行标准应急处置流程", "在情境中调整沟通方式", "完成关键操作与记录"],
      tip: "本页用任务面板模拟 VR 训练中的操作进程。",
      label: "VR TASK IN PROGRESS",
      screen: `
        <div class="screen-app-header">
          <h4>任务：老人跌倒应急处理</h4><span>进度 3 / 5</span>
        </div>
        <div class="task-screen">
          <div class="task-media">
            <svg viewBox="0 0 310 240" aria-hidden="true">
              <defs><linearGradient id="taskSky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#17445e"/><stop offset="1" stop-color="#0a2c48"/></linearGradient></defs>
              <rect width="310" height="240" fill="url(#taskSky)"/>
              <path d="M0 188h310v52H0z" fill="#0b2239" opacity=".9"/>
              <path d="M0 205h310M45 188v52M108 188v52M172 188v52M237 188v52" stroke="#3d6f82" stroke-width="1" opacity=".35"/>
              <rect x="17" y="68" width="88" height="70" rx="8" fill="#1a526c"/>
              <rect x="211" y="58" width="80" height="92" rx="10" fill="#124357"/>
              <circle cx="133" cy="109" r="22" fill="#f1c7aa"/>
              <path d="M111 110c1-17 12-27 27-24 10 2 17 11 17 20-11-3-20-8-25-16-4 8-11 16-19 20Z" fill="#dce9ee"/>
              <path d="M98 191c3-43 18-64 35-64 16 0 33 20 38 64" fill="#7fdbc9"/>
              <path d="m132 143 45 30" stroke="#f1c7aa" stroke-width="11" stroke-linecap="round"/>
              <path d="m144 158 32 9" stroke="#12687d" stroke-width="5" stroke-linecap="round"/>
              <circle cx="197" cy="130" r="18" fill="#f1c7aa"/>
              <path d="M178 125c3-16 13-23 25-19 8 3 12 10 12 18-9-2-16-7-20-13-3 7-9 12-17 14Z" fill="#d9e7ed"/>
              <path d="M170 184c1-28 13-43 29-43 16 0 26 15 28 43" fill="#2677a8"/>
              <rect x="89" y="174" width="136" height="7" rx="3.5" fill="#6be0cf" opacity=".68"/>
              <text x="19" y="39" fill="#8fe9dc" font-family="Arial" font-size="8" letter-spacing="1.2">SIMULATION VIEW · B-207</text>
              <circle cx="157" cy="120" r="37" fill="none" stroke="#8fe9dc" stroke-width="1" stroke-dasharray="2 5" opacity=".35"/>
            </svg>
          </div>
          <div class="task-side">
            <div class="task-step done"><i>✓</i> 确认环境安全</div>
            <div class="task-step done"><i>✓</i> 判断意识与呼吸</div>
            <div class="task-step active"><i>03</i> 询问疼痛部位</div>
            <div class="task-step"><i>04</i> 呼叫支援并记录</div>
            <div class="task-step"><i>05</i> 复盘操作流程</div>
          </div>
        </div>`,
    },
    {
      title: "AI 分析表现并生成能力评估报告",
      english: "REFLECTION & GROWTH",
      description:
        "AI 汇聚知识、操作与沟通表现，生成能力画像和后续学习建议，让每一次模拟都成为下一次真实照护的准备。",
      points: ["获得可理解的即时反馈", "形成多维能力评估报告", "连接后续课程与职业成长"],
      tip: "所有分数与生成内容均用于界面演示。",
      label: "AI FEEDBACK REPORT",
      screen: `
        <div class="screen-app-header">
          <h4>本次训练表现反馈</h4><span>DEMO REPORT</span>
        </div>
        <div class="feedback-screen">
          <div class="feedback-score"><strong>82</strong><span>综合得分</span></div>
          <div class="feedback-list">
            <div class="feedback-row"><span>应急判断</span><i><b style="width:86%"></b></i></div>
            <div class="feedback-row"><span>沟通关怀</span><i><b style="width:78%"></b></i></div>
            <div class="feedback-row"><span>操作规范</span><i><b style="width:83%"></b></i></div>
            <div class="feedback-row"><span>复盘能力</span><i><b style="width:74%"></b></i></div>
          </div>
        </div>
        <div class="feedback-note">做得很好：先观察再处置，避免了二次伤害。<br>下一步：加强呼救信息完整度，并练习与家属沟通。</div>`,
    },
  ];

  let journeyIndex = 0;
  let journeyPlaying = false;
  let journeyTimer = null;
  const journeySteps = $$(".journey-step");
  const journeyRoleItems = $$(".journey-role-path span");
  const journeyShell = $(".journey-shell");
  const journeyPlay = $("#journeyPlay");
  const journeyPause = $("#journeyPause");
  const journeyReplay = $("#journeyReplay");
  const journeyStatus = $("#journeyStatus");
  const journeyProgressBar = $("#journeyProgressBar");
  const currentStepNumber = $("#currentStepNumber");
  const currentStepPercent = $("#currentStepPercent");
  const detailStep = $("#detailStep");
  const detailEnglish = $("#detailEnglish");
  const detailTitle = $("#detailTitle");
  const detailDescription = $("#detailDescription");
  const detailPoints = $("#detailPoints");
  const detailTip = $("#detailTip");
  const screenLabel = $("#screenLabel");
  const screenContent = $("#screenContent");

  function renderJourney(index) {
    journeyIndex = Math.max(0, Math.min(index, journeyData.length - 1));
    const data = journeyData[journeyIndex];

    journeySteps.forEach((step, stepIndex) => {
      step.classList.toggle("is-active", stepIndex === journeyIndex);
      step.classList.toggle("is-complete", stepIndex < journeyIndex);
      step.setAttribute("aria-pressed", String(stepIndex === journeyIndex));
    });
    journeyRoleItems.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === journeyIndex);
      item.classList.toggle("is-complete", itemIndex < journeyIndex);
    });

    detailStep.textContent = String(journeyIndex + 1).padStart(2, "0");
    detailEnglish.textContent = data.english;
    detailTitle.textContent = data.title;
    detailDescription.textContent = data.description;
    detailPoints.innerHTML = data.points.map((point) => `<li>${point}</li>`).join("");
    detailTip.textContent = data.tip;
    screenLabel.textContent = data.label;
    screenContent.classList.remove("is-entering");
    screenContent.innerHTML = data.screen;
    void screenContent.offsetWidth;
    screenContent.classList.add("is-entering");
    currentStepNumber.textContent = String(journeyIndex + 1).padStart(2, "0");

    const percent = Math.round(((journeyIndex + 1) / journeyData.length) * 100);
    journeyProgressBar.style.width = `${percent}%`;
    currentStepPercent.textContent = `${percent}%`;
  }

  function clearJourneyTimer() {
    window.clearTimeout(journeyTimer);
    journeyTimer = null;
  }

  function setJourneyPlaying(state) {
    journeyPlaying = state;
    journeyShell.classList.toggle("is-playing", state);
    journeyPause.disabled = !state;
    journeyPlay.classList.toggle("is-playing", state);
    journeyPlay.querySelector("span").textContent =
      state ? "播放中..." : journeyIndex === 0 ? "开始播放" : "继续播放";
    if (state) {
      journeyStatus.textContent = "自动演示中";
    } else if (!journeyTimer) {
      journeyStatus.textContent = journeyIndex === journeyData.length - 1 ? "演示已完成" : "已暂停";
    }
  }

  function advanceJourney() {
    clearJourneyTimer();
    if (!journeyPlaying) return;

    if (journeyIndex >= journeyData.length - 1) {
      setJourneyPlaying(false);
      journeyStatus.textContent = "演示已完成";
      journeyPlay.querySelector("span").textContent = "再次播放";
      journeyPlay.disabled = false;
      journeyPause.disabled = true;
      return;
    }

    renderJourney(journeyIndex + 1);
    journeyTimer = window.setTimeout(advanceJourney, 3800);
  }

  function startJourney(fromBeginning = false) {
    clearJourneyTimer();
    if (fromBeginning || journeyIndex >= journeyData.length - 1) renderJourney(0);
    setJourneyPlaying(true);
    journeyPlay.disabled = true;
    advanceJourney();
  }

  journeyPlay.addEventListener("click", () => startJourney(false));

  journeyPause.addEventListener("click", () => {
    clearJourneyTimer();
    setJourneyPlaying(false);
    journeyStatus.textContent = "已暂停";
    journeyPlay.disabled = false;
    journeyPlay.querySelector("span").textContent = "继续播放";
  });

  journeyReplay.addEventListener("click", () => {
    startJourney(true);
  });

  journeySteps.forEach((step) => {
    step.addEventListener("click", () => {
      clearJourneyTimer();
      setJourneyPlaying(false);
      renderJourney(Number(step.dataset.step));
      journeyStatus.textContent = "手动浏览";
      journeyPlay.disabled = false;
      journeyPlay.querySelector("span").textContent = "从当前继续";
    });
  });

  renderJourney(0);
  journeyStatus.textContent = "准备就绪";

  const modal = $("#modal");
  const modalWindow = $(".modal-window", modal);
  const modalContent = $("#modalContent");
  let lastFocusedElement = null;
  let vrDemoTimer = null;
  let activeDialogScenario = "dementia";
  let dialogStep = 0;
  let dialogScore = 58;

  function openModal(content) {
    lastFocusedElement = document.activeElement;
    modalContent.innerHTML = content;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => {
      modal.classList.add("is-visible");
      modalWindow.focus();
    });
  }

  function closeModal() {
    window.clearInterval(vrDemoTimer);
    vrDemoTimer = null;
    modal.classList.remove("is-visible");
    document.body.classList.remove("modal-open");
    window.setTimeout(() => {
      modal.hidden = true;
      modalContent.innerHTML = "";
      if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
    }, 220);
  }

  $$("[data-close-modal]").forEach((element) => element.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!modal.hidden) closeModal();
      closeMobileMenu();
    }

    if (event.key === "Tab" && !modal.hidden) {
      const focusable = $$(
        'button:not(:disabled), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        modalWindow,
      ).filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const dialogScenarios = {
    dementia: {
      tab: "失智症重复提问",
      name: "王奶奶",
      meta: "78 岁 · 轻度失智 · 入住第 2 年",
      avatar: "王",
      emotion: "焦虑 · 重复确认",
      initial: "我已经吃过饭了，怎么又要吃？你们是不是不想管我了？",
      steps: [
        {
          options: [
            {
              label: "“您已经吃过了，墙上写着时间呢，别担心。”",
              response: "可是我真的不记得……你是不是嫌我麻烦？",
              feedback: "直接强调事实容易让老人感到被质疑。先回应情绪，再温和确认，会更有利于建立信任。",
              delta: -7,
            },
            {
              label: "“王奶奶，我先陪您坐一会儿。您现在最担心的是什么？”",
              response: "我记不清了……我就是心里不踏实。",
              feedback: "很好。你先回应了老人的感受，而不是急于纠正事实，紧张情绪开始下降。",
              delta: 9,
            },
          ],
        },
        {
          options: [
            {
              label: "“那我们从现在开始，一起把今天吃过的事情记下来。”",
              response: "好……你陪我写，我就安心一点。",
              feedback: "用共同行动替代争辩，既维护了老人的尊严，也为她提供了可感知的安全感。",
              delta: 8,
            },
            {
              label: "“您怎么又忘了？刚刚明明吃过。”",
              response: "我是不是越来越没用了……",
              feedback: "责备会强化挫败感。失智症照护中应避免考验记忆，更多使用确认、陪伴与引导。",
              delta: -10,
            },
          ],
        },
        {
          options: [
            {
              label: "与老人一起确认下一餐时间，并记录当前需求。",
              response: "好，那我们下午再一起吃饭。谢谢你没有嫌我烦。",
              feedback: "你完成了情绪安抚、信息确认和后续安排。照护不仅解决当下的问题，也在建立持续的安全感。",
              delta: 7,
            },
            {
              label: "结束对话，直接进入下一项护理任务。",
              response: "……好吧，你先去忙吧。",
              feedback: "老人仍然存在不安。结束前应再次确认需求和情绪状态，避免留下未解决的照护问题。",
              delta: -4,
            },
          ],
        },
      ],
    },
    refusal: {
      tab: "老人拒绝进食",
      name: "李爷爷",
      meta: "82 岁 · 中风后康复 · 食欲下降",
      avatar: "李",
      emotion: "低落 · 拒绝进食",
      initial: "我不想吃，端走吧。每次都吃这些，没胃口。",
      steps: [
        {
          options: [
            {
              label: "“不吃怎么行？您必须把这些吃完。”",
              response: "我说了不吃！你们别逼我。",
              feedback: "命令式表达会增加对抗。先了解不愿意进食的原因，比单纯要求完成进食更有效。",
              delta: -8,
            },
            {
              label: "“李爷爷，是饭菜不合口，还是身体哪里不舒服？”",
              response: "嘴里没味道，咽东西也有点费劲。",
              feedback: "你开始识别拒绝进食背后可能的口味、吞咽或身体原因，这是安全照护的重要一步。",
              delta: 9,
            },
          ],
        },
        {
          options: [
            {
              label: "检查吞咽情况，调整食物形态并少量尝试。",
              response: "小口一点，好像能咽下去。",
              feedback: "做法恰当。调整食物质地、少量尝试并观察吞咽，有助于降低误吸风险。",
              delta: 8,
            },
            {
              label: "先劝他多喝水，忽略刚才说的吞咽困难。",
              response: "喝水也有点呛……我还是不吃了。",
              feedback: "已出现吞咽困难线索时需要优先评估，不能简单归因于情绪或挑食。",
              delta: -9,
            },
          ],
        },
        {
          options: [
            {
              label: "记录进食与吞咽情况，并向护士或专业人员报告。",
              response: "你们考虑得挺细，那我先吃几口试试。",
              feedback: "你完成了风险识别与团队协作。发现进食异常时，应及时记录、报告并进行专业评估。",
              delta: 7,
            },
            {
              label: "认为老人只是心情不好，催促其尽快吃完。",
              response: "我还是不想吃……算了。",
              feedback: "拒绝进食可能涉及身体、心理与环境因素，应避免单一判断，进一步沟通和观察。",
              delta: -5,
            },
          ],
        },
      ],
    },
    anxiety: {
      tab: "老人情绪焦虑",
      name: "周奶奶",
      meta: "76 岁 · 新入住 · 对环境陌生",
      avatar: "周",
      emotion: "焦虑 · 想回家",
      initial: "我想回家。这里不是我的家，我晚上睡不着。",
      steps: [
        {
          options: [
            {
              label: "“这里就是您的家，您别乱想了。”",
              response: "这里根本不是我家，你们都不懂。",
              feedback: "直接否定感受会让老人更加孤立。先承认焦虑，再提供具体、可感知的安抚。",
              delta: -6,
            },
            {
              label: "“第一次住在这里确实会不习惯，我陪您看看房间好吗？”",
              response: "你能陪我一会儿吗？我总觉得这里很陌生。",
              feedback: "你承认了老人的感受，并给出陪伴和可执行的行动，焦虑有了被接纳的出口。",
              delta: 9,
            },
          ],
        },
        {
          options: [
            {
              label: "一起整理熟悉的物品，介绍夜间照护安排。",
              response: "把我的照片放在床边，我会安心一点。",
              feedback: "使用熟悉物品建立环境连续性，能帮助新入住老人获得安全感与掌控感。",
              delta: 8,
            },
            {
              label: "告诉老人“适应几天就好了”，然后离开。",
              response: "可是我现在就很难受。",
              feedback: "情绪需要被具体回应，简单淡化问题会错过建立信任和发现需求的机会。",
              delta: -7,
            },
          ],
        },
        {
          options: [
            {
              label: "记录焦虑表现并安排后续巡访，确认睡眠情况。",
              response: "有你记得来看我，我心里踏实多了。",
              feedback: "完成记录和后续跟进，能让情绪支持变成持续照护，而不是一次性的安慰。",
              delta: 7,
            },
            {
              label: "当前安抚成功，便不再持续关注老人状态。",
              response: "晚上一个人的时候，可能还是会害怕。",
              feedback: "情绪问题可能反复出现，应持续观察并记录触发因素，及时与团队沟通。",
              delta: -4,
            },
          ],
        },
      ],
    },
  };

  function renderDialogScenario() {
    const scenario = dialogScenarios[activeDialogScenario];
    const history = [
      {
        role: "elder",
        speaker: scenario.avatar,
        text: scenario.initial,
      },
    ];

    for (let index = 0; index < dialogStep; index += 1) {
      const step = scenario.steps[index];
      const chosen = step.chosen;
      const option = step.options[chosen];
      history.push({ role: "caregiver", speaker: "我", text: option.label.replace(/[“”]/g, "") });
      history.push({ role: "elder", speaker: scenario.avatar, text: option.response });
      history.push({ role: "feedback", speaker: "AI", text: option.feedback });
    }

    const currentStep = scenario.steps[dialogStep];
    const isComplete = !currentStep;

    return `
      <div class="modal-hero">
        <div class="modal-kicker">AI VIRTUAL ELDERLY · INTERACTIVE PROTOTYPE</div>
        <h2 id="modalTitle">AI 智能虚拟老人 · 对话演示</h2>
        <p>选择一个回应，体验预设情境中的动态反馈。界面中的对话与评价均为课堂演示内容。</p>
      </div>
      <div class="modal-body">
        <div class="modal-tabs">
          ${Object.entries(dialogScenarios)
            .map(
              ([key, item]) =>
                `<button type="button" data-dialog-scenario="${key}" class="${
                  key === activeDialogScenario ? "is-active" : ""
                }">${item.tab}</button>`,
            )
            .join("")}
        </div>
        <div class="dialog-stage">
          <aside class="dialog-elder-side">
            <div class="dialog-elder-portrait">${scenario.avatar}</div>
            <h3>${scenario.name}</h3>
            <p>${scenario.meta}</p>
            <span class="emotion-badge">${scenario.emotion}</span>
          </aside>
          <div class="dialog-main">
            <div class="dialog-history">
              ${history
                .map(
                  (message) => `
                    <div class="chat-message ${message.role}">
                      <span>${message.speaker}</span>
                      <div>${message.text}</div>
                    </div>`,
                )
                .join("")}
            </div>
            <div class="chat-options">
              ${
                isComplete
                  ? `<small>本次模拟对话已完成</small>
                    <button type="button" data-restart-dialog>重新体验该情景</button>`
                  : `<small>请选择你的回应 · 第 ${dialogStep + 1} / ${scenario.steps.length} 轮</small>
                    ${currentStep.options
                      .map(
                        (option, index) =>
                          `<button type="button" data-dialog-option="${index}">${option.label}</button>`,
                      )
                      .join("")}`
              }
            </div>
            <div class="dialog-progress">
              <span>情境反馈评分 · 模拟指标</span>
              <span>${Math.max(0, Math.min(100, dialogScore))} / 100</span>
            </div>
          </div>
        </div>
        <div class="prototype-callout">
          <svg><use href="#icon-info"></use></svg>
          原型说明：本功能使用本地预设对话分支展示 AI 虚拟老人的交互效果，未连接真实 AI 模型或商业 API。
        </div>
      </div>`;
  }

  function refreshDialogModal() {
    modalContent.innerHTML = renderDialogScenario();
    bindDialogEvents();
  }

  function bindDialogEvents() {
    $$("[data-dialog-scenario]", modalContent).forEach((button) => {
      button.addEventListener("click", () => {
        activeDialogScenario = button.dataset.dialogScenario;
        dialogStep = 0;
        dialogScore = 58;
        refreshDialogModal();
      });
    });

    $$("[data-dialog-option]", modalContent).forEach((button) => {
      button.addEventListener("click", () => {
        const scenario = dialogScenarios[activeDialogScenario];
        const step = scenario.steps[dialogStep];
        const optionIndex = Number(button.dataset.dialogOption);
        step.chosen = optionIndex;
        dialogScore += step.options[optionIndex].delta;
        dialogStep += 1;
        refreshDialogModal();
      });
    });

    const restartButton = $("[data-restart-dialog]", modalContent);
    if (restartButton) {
      restartButton.addEventListener("click", () => {
        dialogStep = 0;
        dialogScore = 58;
        refreshDialogModal();
      });
    }
  }

  $$("[data-open-dialogue]").forEach((button) => {
    button.addEventListener("click", () => {
      activeDialogScenario = "dementia";
      dialogStep = 0;
      dialogScore = 58;
      Object.values(dialogScenarios).forEach((scenario) => {
        scenario.steps.forEach((step) => delete step.chosen);
      });
      openModal(renderDialogScenario());
      bindDialogEvents();
    });
  });

  function openMentorModal() {
    const mentorFeatures = [
      ["01", "护理知识问答", "围绕基础护理、失智症照护、应急流程与职业伦理提供知识提示。"],
      ["02", "个性化学习建议", "依据学员的薄弱环节，推荐复习内容和下一项训练任务。"],
      ["03", "操作错误提醒", "在模拟任务中提示遗漏的关键步骤，帮助学员建立安全操作习惯。"],
      ["04", "学习报告生成", "汇总知识、操作与沟通表现，生成可讨论的训练反馈报告。"],
    ];
    openModal(`
      <div class="modal-hero">
        <div class="modal-kicker">AI SMART MENTOR · GUIDANCE PROTOTYPE</div>
        <h2 id="modalTitle">AI 智能导师</h2>
        <p>把专业知识、情境提醒与个性反馈带到每一次训练中。以下功能均为课程项目的界面与内容原型。</p>
      </div>
      <div class="modal-body">
        <div class="mentor-modal-grid">
          ${mentorFeatures
            .map(
              ([index, title, copy]) => `
                <article class="mentor-feature">
                  <span>${index}</span>
                  <h4>${title}</h4>
                  <p>${copy}</p>
                </article>`,
            )
            .join("")}
        </div>
        <div class="mentor-demo-question">
          <span>AI</span>
          <div>
            <h4>示例提问：老人跌倒后，应该先扶起来吗？</h4>
            <p>不建议立即扶起。先确认环境安全，观察老人意识、呼吸和疼痛部位，询问跌倒经过，并按机构流程呼叫支援。未经评估的搬动可能造成二次伤害。</p>
          </div>
        </div>
        <div class="prototype-callout">
          <svg><use href="#icon-info"></use></svg>
          原型说明：导师内容使用本地预设知识示例，用于展示产品交互方式，未接入真实 AI 模型。
        </div>
      </div>`);
  }

  $$("[data-open-mentor]").forEach((button) => button.addEventListener("click", openMentorModal));

  const fallSimulationSteps = [
    {
      title: "老人突然跌倒",
      subtitle: "请观察现场，并作出你的第一步判断。",
      elderLine: "我刚才不小心摔倒了，现在感觉有点疼……",
      vital: ["意识清醒", "呼吸平稳", "诉右髋疼痛"],
      question: "看到老人倒在地上，你会先做什么？",
      options: [
        {
          label: "马上把老人扶起来，尽快回到房间",
          delta: -10,
          feedback: "暂不建议立即搬动。老人跌倒后可能存在骨折或隐匿损伤，未经评估的移动可能造成二次伤害。",
          tip: "先保持现场安全，观察意识、呼吸和疼痛部位。",
        },
        {
          label: "蹲下询问感受，观察意识与呼吸，保持老人当前体位",
          delta: 20,
          feedback: "判断正确。你先确认了老人状态，并没有急于搬动。老人意识清醒、呼吸平稳，但右髋疼痛需要继续关注。",
          tip: "跌倒处置顺序：确认环境安全 → 判断意识呼吸 → 询问疼痛 → 呼叫支援。",
        },
        {
          label: "先去找同事，让老人独自在原地等待",
          delta: -8,
          feedback: "不建议让老人长时间独处。跌倒后状态可能变化，护理员应留在身边持续观察，同时通过呼叫设备或附近同事请求支援。",
          tip: "安抚、观察与呼救可以同时进行，不要让老人失去陪伴。",
        },
      ],
    },
    {
      title: "进一步确认伤情",
      subtitle: "老人表示右侧髋部疼痛，不愿尝试起身。",
      elderLine: "右腿一用力就疼，我有点害怕，是不是以后走不了了？",
      vital: ["右髋疼痛", "拒绝起身", "情绪紧张"],
      question: "接下来，哪一种处理更合适？",
      options: [
        {
          label: "把老人抱到床上休息，避免一直躺在地上",
          delta: -10,
          feedback: "不建议自行抱起老人。髋部疼痛可能涉及骨折，应保持体位并等待专业评估，避免搬运造成进一步损伤。",
          tip: "疑似骨折时，不随意改变体位，按机构流程等待专业支援。",
        },
        {
          label: "保持体位、安抚老人，呼叫护理团队并记录现场信息",
          delta: 20,
          feedback: "处理得当。你同时完成了安全保护、情绪安抚和团队协作，也让后续评估拥有清晰的现场信息。",
          tip: "记录跌倒时间、地点、意识、疼痛部位与现场环境，便于后续判断。",
        },
        {
          label: "扶着老人慢慢站起来，活动一下确认有没有事",
          delta: -12,
          feedback: "不建议让有明显髋部疼痛的老人自行站起或活动。这个动作可能加重潜在损伤，也会增加再次跌倒风险。",
          tip: "疼痛部位不明确或怀疑骨折时，应先固定、安抚并请求支援。",
        },
      ],
    },
    {
      title: "陪伴与持续观察",
      subtitle: "支援正在赶来，老人仍然紧张，需要你的沟通与陪伴。",
      elderLine: "会不会很严重？我是不是给你们添麻烦了……",
      vital: ["状态暂时稳定", "持续观察中", "等待团队评估"],
      question: "在等待支援时，你会怎样回应？",
      options: [
        {
          label: "告诉老人“没事，站起来就好了”，让他不要多想",
          delta: -5,
          feedback: "过度保证可能让老人误以为风险已经解除。此时更合适的是承认他的担心，并清楚说明接下来会怎样帮助他。",
          tip: "不夸大、不淡化，用具体行动让老人感到安全。",
        },
        {
          label: "陪在身边，说明会持续关注，并记录意识、疼痛和情绪变化",
          delta: 20,
          feedback: "沟通与观察都很完整。你没有只说“别担心”，而是用明确行动让老人知道自己会被照顾，也留下了后续评估信息。",
          tip: "等待支援期间应持续观察状态变化，并避免让老人独自留下。",
        },
        {
          label: "支援已经在路上，先离开去完成其他护理任务",
          delta: -10,
          feedback: "不建议让老人在等待期间独处。焦虑、疼痛和身体状态都可能变化，护理员应陪伴观察，直到交接完成。",
          tip: "交接前持续陪伴，是跌倒后照护安全的重要环节。",
        },
      ],
    },
  ];

  const fallSimulation = {
    step: 0,
    score: 35,
    selected: null,
    answers: [],
    completed: false,
  };

  function resetFallSimulation() {
    fallSimulation.step = 0;
    fallSimulation.score = 35;
    fallSimulation.selected = null;
    fallSimulation.answers = [];
    fallSimulation.completed = false;
  }

  function renderFallSimulation() {
    const stepData = fallSimulationSteps[fallSimulation.step];
    const selectedOption =
      fallSimulation.selected === null ? null : stepData.options[fallSimulation.selected];
    const progress = ((fallSimulation.step + 1) / fallSimulationSteps.length) * 100;

    if (fallSimulation.completed) {
      const finalScore = Math.max(0, Math.min(100, fallSimulation.score));
      const level = finalScore >= 90 ? "处置稳健 · 关怀到位" : finalScore >= 75 ? "判断清晰 · 继续巩固" : "需要复习 · 建议重练";
      return `
        <div class="modal-hero case-modal-hero">
          <div class="modal-kicker">SIMULATION REPORT · DEMO DATA</div>
          <h2 id="modalTitle">跌倒情景训练评价</h2>
          <p>这是基于三次选择生成的课堂模拟反馈，不替代真实护理考核或专业医疗判断。</p>
        </div>
        <div class="modal-body">
          <div class="case-result">
            <div class="result-score">
              <span>本次模拟得分</span>
              <strong>${finalScore}</strong>
              <em>${level}</em>
            </div>
            <div class="result-feedback">
              <span class="result-badge">AI 模拟反馈</span>
              <h3>${finalScore >= 75 ? "你守住了安全，也照顾到了老人的感受。" : "安全意识已经建立，下一步需要巩固处置顺序。"}</h3>
              <p>跌倒后先观察、再评估，是避免二次伤害的关键。面对老人的担心，清楚说明接下来会做什么，往往比简单地说“没事”更能带来安全感。</p>
              <div class="result-skill-grid">
                <div><span>风险判断</span><i><b style="width:${Math.min(100, 48 + fallSimulation.answers.filter((x) => x > 0).length * 15)}%"></b></i></div>
                <div><span>流程规范</span><i><b style="width:${Math.min(100, 52 + fallSimulation.answers.filter((x) => x > 0).length * 14)}%"></b></i></div>
                <div><span>沟通关怀</span><i><b style="width:${Math.min(100, 60 + fallSimulation.answers.filter((x) => x > 0).length * 12)}%"></b></i></div>
              </div>
            </div>
          </div>
          <div class="result-takeaway">
            <span><svg aria-hidden="true"><use href="#icon-spark"></use></svg></span>
            <div><strong>下一次可以做得更好</strong><p>继续练习“观察—评估—呼救—记录—陪伴”，并注意不同伤情下的体位管理。</p></div>
          </div>
          <div class="case-result-actions">
            <button class="button button-primary" type="button" data-restart-case>重新体验</button>
            <button class="button button-outline-warm" type="button" data-go-journey>观看完整培训流程</button>
            <button class="text-button dark-button" type="button" data-close-modal>完成体验</button>
          </div>
          <p class="modal-demo-note">Demo Data / 模拟数据：本评价用于展示交互流程，不代表真实医疗建议或学习结果。</p>
        </div>`;
    }

    return `
      <div class="modal-hero case-modal-hero">
        <div class="modal-kicker">POST-FALL ASSESSMENT · INTERACTIVE DEMO</div>
        <h2 id="modalTitle">老人跌倒 · 应急处置模拟</h2>
        <p>请以护理员视角作出选择。每一步都会得到 AI 情境反馈和专业提示。</p>
      </div>
      <div class="modal-body case-modal-body">
        <div class="case-progress-head">
          <span>情景 ${fallSimulation.step + 1} / ${fallSimulationSteps.length}</span>
          <i><b style="width:${progress}%"></b></i>
          <em>模拟数据</em>
        </div>
        <div class="case-experience">
          <div class="case-photo-panel">
            <img src="./assets/scenario-fall-photo.jpg" alt="老人跌倒后，护理人员立即查看意识与生命体征的应急处理场景" />
            <span class="case-scene-label"><i></i> 养老院 · 跌倒现场</span>
            <div class="elder-speech">
              <span class="elder-speech-avatar">王</span>
              <div><small>AI 虚拟老人 · 王爷爷</small><p>“${stepData.elderLine}”</p></div>
            </div>
            <div class="case-vitals">
              ${stepData.vital.map((item) => `<span><i></i>${item}</span>`).join("")}
            </div>
          </div>
          <div class="case-decision-panel">
            ${
              selectedOption
                ? `
                  <span class="case-step-label">YOUR RESPONSE · 你的选择</span>
                  <h3>${stepData.title}</h3>
                  <div class="case-choice-made">${selectedOption.label}</div>
                  <div class="case-feedback-card ${selectedOption.delta > 0 ? "is-positive" : "needs-improvement"}">
                    <span>${selectedOption.delta > 0 ? "AI 反馈 · 做得很好" : "AI 反馈 · 需要调整"}</span>
                    <p>${selectedOption.feedback}</p>
                    <h4>专业护理提示</h4>
                    <em>${selectedOption.tip}</em>
                  </div>
                  <button class="button button-primary case-next" type="button" data-next-case>
                    ${fallSimulation.step === fallSimulationSteps.length - 1 ? "查看模拟评价" : "继续下一步"}
                    <svg aria-hidden="true"><use href="#icon-arrow"></use></svg>
                  </button>`
                : `
                  <span class="case-step-label">DECISION ${String(fallSimulation.step + 1).padStart(2, "0")}</span>
                  <h3>${stepData.title}</h3>
                  <p class="case-question">${stepData.question}</p>
                  <div class="case-options">
                    ${stepData.options
                      .map(
                        (option, index) => `
                          <button type="button" data-case-option="${index}">
                            <i>${String.fromCharCode(65 + index)}</i>
                            <span>${option.label}</span>
                            <svg aria-hidden="true"><use href="#icon-arrow"></use></svg>
                          </button>`,
                      )
                      .join("")}
                  </div>
                  <div class="case-guidance">
                    <svg aria-hidden="true"><use href="#icon-info"></use></svg>
                    先考虑安全与尊严，再选择你认为合适的处理方式。
                  </div>`
            }
          </div>
        </div>
        <div class="prototype-callout">
          <svg><use href="#icon-info"></use></svg>
          原型说明：本情景使用预设分支模拟 AI 虚拟老人和专业反馈，不连接真实 AI API，也不能替代真实护理培训。
        </div>
      </div>`;
  }

  function bindFallSimulation() {
    $$("[data-case-option]", modalContent).forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.caseOption);
        const option = fallSimulationSteps[fallSimulation.step].options[index];
        fallSimulation.selected = index;
        fallSimulation.score += option.delta;
        fallSimulation.answers.push(option.delta);
        modalContent.innerHTML = renderFallSimulation();
        bindFallSimulation();
      });
    });

    $("[data-next-case]", modalContent)?.addEventListener("click", () => {
      if (fallSimulation.step >= fallSimulationSteps.length - 1) {
        fallSimulation.completed = true;
      } else {
        fallSimulation.step += 1;
        fallSimulation.selected = null;
      }
      modalContent.innerHTML = renderFallSimulation();
      bindFallSimulation();
    });

    $("[data-restart-case]", modalContent)?.addEventListener("click", () => {
      resetFallSimulation();
      modalContent.innerHTML = renderFallSimulation();
      bindFallSimulation();
    });

    $("[data-go-journey]", modalContent)?.addEventListener("click", () => {
      closeModal();
      window.setTimeout(() => {
        $("#journey").scrollIntoView({ behavior: "smooth", block: "start" });
      }, 240);
    });

    $("[data-close-modal]", modalContent)?.addEventListener("click", closeModal);
  }

  function openFallSimulation() {
    resetFallSimulation();
    openModal(renderFallSimulation());
    bindFallSimulation();
  }

  $$("[data-start-scenario]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openFallSimulation();
    });
  });

  const vrScenarios = {
    fall: {
      english: "EMERGENCY RESPONSE · SCENE A",
      title: "老人跌倒处理",
      description:
        "在虚拟养老院房间内识别跌倒情况，按照观察、评估、呼救和记录的顺序完成应急处置。",
      image: "./assets/scenario-fall-photo.jpg",
      tasks: ["确认环境安全，避免二次伤害", "观察意识、呼吸与疼痛部位", "呼叫支援并准确传递信息", "完成事件记录与后续观察"],
    },
    dementia: {
      english: "DEMENTIA CARE · SCENE B",
      title: "失智症情绪沟通",
      description:
        "面对重复提问、焦虑和拒绝配合的失智症老人，使用共情、确认与陪伴进行沟通。",
      image: "./assets/scenario-dementia.svg",
      tasks: ["识别情绪背后的未满足需求", "使用简短、清晰、尊重式表达", "避免争辩与考验记忆", "确认需求并完成照护记录"],
    },
    daily: {
      english: "DAILY CARE · SCENE C",
      title: "老人日常生活照护",
      description:
        "围绕进食、移动和洗漱完成日常照护，在安全操作中尊重老人的习惯、隐私与自主选择。",
      image: "./assets/scenario-daily.svg",
      tasks: ["沟通当日照护安排与偏好", "检查环境与辅助器具安全", "安全完成移动和洗漱协助", "记录进食、活动与身体状态"],
    },
  };

  function openVrScenario(key) {
    const scenario = vrScenarios[key];
    openModal(`
      <div class="modal-hero">
        <div class="modal-kicker">${scenario.english}</div>
        <h2 id="modalTitle">VR 模拟 · ${scenario.title}</h2>
        <p>这是以网页形式展示的 VR 训练原型。点击开始后，可观察模拟任务的推进方式。</p>
      </div>
      <div class="modal-body">
        <div class="vr-modal">
          <div class="vr-modal-stage">
            <img src="${scenario.image}" alt="${scenario.title}场景插画" />
            <div class="vr-hud"><span class="vr-hud-label">VR VIEW · PROTOTYPE</span><i class="vr-reticle"></i></div>
          </div>
          <div class="vr-modal-panel">
            <small>TRAINING OBJECTIVES</small>
            <h3>${scenario.title}</h3>
            <p>${scenario.description}</p>
            <div class="vr-task-list">
              ${scenario.tasks
                .map((task, index) => `<div><i>${String(index + 1).padStart(2, "0")}</i><span>${task}</span></div>`)
                .join("")}
            </div>
            <div class="vr-start-state" id="vrStartState">
              <button class="button button-primary" type="button" id="vrStartDemo">
                <svg><use href="#icon-play"></use></svg>开始模拟演示
              </button>
            </div>
          </div>
        </div>
        <div class="prototype-callout">
          <svg><use href="#icon-info"></use></svg>
          原型说明：本交互不连接真实 VR 头显或三维引擎，而是用场景画面和任务进度展示训练流程。
        </div>
      </div>`);

    $("#vrStartDemo").addEventListener("click", runVrDemo);
  }

  function runVrDemo() {
    const startState = $("#vrStartState");
    if (!startState) return;
    let progress = 0;
    window.clearInterval(vrDemoTimer);
    startState.innerHTML = `
      <div class="vr-running">
        <h4>模拟训练进行中</h4>
        <p id="vrRunLabel">正在载入虚拟养老院场景…</p>
        <div class="vr-running-bar"><i id="vrRunBar"></i></div>
      </div>`;
    const labels = ["载入完成，识别当前任务…", "正在执行第 1 个任务步骤…", "过程反馈已记录，准备评估…"];
    vrDemoTimer = window.setInterval(() => {
      progress += 1;
      const bar = $("#vrRunBar");
      const label = $("#vrRunLabel");
      if (bar) bar.style.width = `${Math.min(progress * 4, 100)}%`;
      if (label) label.textContent = labels[Math.min(Math.floor(progress / 10), labels.length - 1)];
      if (progress >= 25) {
        window.clearInterval(vrDemoTimer);
        vrDemoTimer = null;
        startState.innerHTML = `
          <div class="vr-running">
            <h4>演示完成 · 模拟任务已通过</h4>
            <p>系统已生成过程记录，可在学习成果页面查看能力画像。</p>
            <div class="vr-running-bar"><i style="width:100%"></i></div>
            <button class="course-complete-button is-done" type="button" id="vrReplayDemo">重新体验</button>
          </div>`;
        $("#vrReplayDemo").addEventListener("click", runVrDemo);
        showToast("模拟训练完成，已生成演示反馈");
      }
    }, 100);
  }

  $$("[data-open-vr]").forEach((button) => {
    button.addEventListener("click", () => openVrScenario(button.dataset.openVr));
  });

  const courseData = {
    basic: {
      english: "BASIC ELDERLY CARE",
      title: "老人基础护理",
      description: "从日常照护细节出发，学习进食、移动、洗漱与基础观察，建立安全、尊重、规范的护理习惯。",
      color: "linear-gradient(135deg, #0c344e, #17647a)",
      goals: ["掌握老人日常照护的标准流程", "识别移动、进食和洗漱中的风险", "在操作中尊重老人习惯与隐私"],
      modules: [
        ["01", "认识高质量基础照护", "护理原则与尊重式沟通", "18 分钟"],
        ["02", "安全移动与辅助器具", "转移、行走和防跌倒要点", "35 分钟"],
        ["03", "进食辅助与吞咽观察", "姿势、速度与异常识别", "28 分钟"],
        ["04", "洗漱与个人卫生照护", "隐私保护与协助技巧", "26 分钟"],
        ["05", "基础护理情境练习", "AI 互动与操作复盘", "40 分钟"],
      ],
    },
    dementia: {
      english: "DEMENTIA CARE",
      title: "失智症照护",
      description: "理解失智症老人的行为与情绪，学习用共情、确认和陪伴回应重复提问、拒绝配合与焦虑。",
      color: "linear-gradient(135deg, #312d72, #5c5aac)",
      goals: ["识别常见失智症行为与潜在需求", "掌握不争辩、不考验记忆的沟通原则", "练习焦虑情绪安抚与活动引导"],
      modules: [
        ["01", "理解失智症与行为表达", "从症状到人的需求", "24 分钟"],
        ["02", "重复提问与记忆挫败", "确认、陪伴与共同行动", "32 分钟"],
        ["03", "拒绝照护时的沟通", "建立信任与选择空间", "30 分钟"],
        ["04", "焦虑和激越情绪支持", "环境、语言与身体安抚", "36 分钟"],
        ["05", "AI 虚拟老人对话练习", "三组预设情境互动", "45 分钟"],
      ],
    },
    emergency: {
      english: "EMERGENCY RESPONSE",
      title: "应急处理",
      description: "通过标准流程与 VR 情境练习，提升对跌倒、突发不适等情况的识别、处置和协作能力。",
      color: "linear-gradient(135deg, #5b302d, #9a5750)",
      goals: ["建立先评估后处置的安全意识", "按顺序完成常见应急处理流程", "练习准确呼救、信息传递与记录"],
      modules: [
        ["01", "应急处理原则与风险意识", "观察、评估、呼救、记录", "22 分钟"],
        ["02", "老人跌倒后的初步处置", "避免二次伤害", "35 分钟"],
        ["03", "突发不适的识别与报告", "症状观察与团队协作", "31 分钟"],
        ["04", "VR 跌倒场景任务", "沉浸式情境决策练习", "45 分钟"],
        ["05", "应急过程复盘", "关键节点与错误操作分析", "24 分钟"],
      ],
    },
    ai: {
      english: "AI DIGITAL SKILLS",
      title: "AI 数字技能",
      description: "面向非技术背景护理人员，理解 AI 与智能护理设备的辅助价值、适用边界及隐私风险。",
      color: "linear-gradient(135deg, #0b3b46, #147a72)",
      goals: ["理解 AI 工具在护理中的辅助作用", "掌握智能护理设备的基础使用", "识别隐私、偏见与人机协作风险"],
      modules: [
        ["01", "生成式 AI 与智慧养老", "概念、能力与边界", "24 分钟"],
        ["02", "智能护理设备初识", "常见设备与使用场景", "28 分钟"],
        ["03", "AI 辅助记录与沟通", "效率提升与人工复核", "30 分钟"],
        ["04", "隐私保护与算法风险", "数据、偏见与责任", "26 分钟"],
        ["05", "人机协作情境练习", "判断何时使用 AI", "32 分钟"],
      ],
    },
    communication: {
      english: "COMMUNICATION & ETHICS",
      title: "沟通与职业伦理",
      description: "学习同理心表达、困难沟通与隐私保护，在人机协作的新场景中守住护理专业的温度。",
      color: "linear-gradient(135deg, #16436c, #347cb4)",
      goals: ["掌握倾听、复述与共情表达", "处理拒绝、焦虑等困难沟通情境", "理解隐私保护和职业伦理边界"],
      modules: [
        ["01", "以人为中心的沟通", "倾听、共情与确认", "24 分钟"],
        ["02", "困难情境中的表达", "拒绝、焦虑与冲突", "34 分钟"],
        ["03", "家属沟通与信息边界", "透明、准确与尊重", "28 分钟"],
        ["04", "隐私保护与职业伦理", "数据与照护责任", "25 分钟"],
        ["05", "人机协作中的伦理判断", "AI 建议与专业决策", "33 分钟"],
      ],
    },
  };

  function openCourseModal(key) {
    const course = courseData[key];
    openModal(`
      <div class="course-modal-hero" style="background:${course.color}">
        <div>
          <small>${course.english} · COURSE PROTOTYPE</small>
          <h2 id="modalTitle">${course.title}</h2>
          <p>${course.description}</p>
        </div>
        <span class="course-progress-ring">0%</span>
      </div>
      <div class="modal-body">
        <div class="course-modal-grid">
          <div>
            <div class="subheading"><span>COURSE MODULES</span><h3>课程学习路径</h3></div>
            <div class="course-module-list">
              ${course.modules
                .map(
                  ([index, title, copy, duration]) => `
                    <div class="course-module-item">
                      <span>${index}</span>
                      <div><h4>${title}</h4><p>${copy}</p></div>
                      <em>${duration}</em>
                    </div>`,
                )
                .join("")}
            </div>
          </div>
          <aside class="course-info-side">
            <h4>学习目标</h4>
            <ul>${course.goals.map((goal) => `<li>${goal}</li>`).join("")}</ul>
            <div class="prototype-callout">
              <svg><use href="#icon-info"></use></svg>
              该课程界面为演示原型，暂不记录真实学习数据。
            </div>
            <button class="course-complete-button" type="button" id="courseComplete" data-course-key="${key}">
              标记本节演示为已完成
            </button>
          </aside>
        </div>
      </div>`);

    $("#courseComplete").addEventListener("click", (event) => {
      const button = event.currentTarget;
      button.classList.add("is-done");
      button.textContent = "已记录本次模拟学习";
      button.disabled = true;
      const ring = $(".course-progress-ring", modalContent);
      if (ring) ring.textContent = "20%";
      showToast(`${course.title}：已记录演示学习进度`);
    });
  }

  $$("[data-open-course]").forEach((button) => {
    button.addEventListener("click", () => openCourseModal(button.dataset.openCourse));
  });

  $$("[data-open-report]").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(`
        <div class="report-modal-head">
          <div>
            <small>PERSONAL TRAINING REPORT · DEMO DATA</small>
            <h2 id="modalTitle">个人培训能力报告</h2>
            <span style="font-size:9px;color:rgba(255,255,255,.4)">学员：林同学 · 第 8 周 · 养老护理员初级班</span>
          </div>
          <div><b>82</b><span>综合能力</span></div>
        </div>
        <div class="modal-body">
          <div class="report-summary">
            <div><small>护理知识测试</small><strong>86 <em style="font-size:8px;color:#7f909c">/ 100</em></strong></div>
            <div><small>VR 情景完成率</small><strong>72%</strong></div>
            <div><small>沟通能力评估</small><strong>82 <em style="font-size:8px;color:#7f909c">/ 100</em></strong></div>
          </div>
          <div class="report-text">
            <h4>本阶段综合反馈</h4>
            <p>学员在护理知识掌握和沟通关怀维度表现稳定。应急场景中能够先观察老人状态，再采取后续措施；在失智症沟通练习中，逐步减少了直接纠正与争辩。下一步重点提升呼救信息完整度、复杂任务的复盘能力，以及智能护理设备的规范使用。</p>
          </div>
          <div class="report-recommendations">
            <div><strong>推荐强化 01</strong><span>应急处理 · 跌倒场景复盘，建议 30 分钟。</span></div>
            <div><strong>推荐强化 02</strong><span>AI 数字技能 · 辅助记录与人工复核，建议 25 分钟。</span></div>
          </div>
          <p class="modal-demo-note">Demo Data / 模拟数据：本报告仅用于展示界面设计，不代表真实学员评价。</p>
        </div>`);
    });
  });

  $$("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.matches("[data-start-scenario]")) return;
      if (modal.hidden === false) closeModal();
      closeMobileMenu();
    });
  });

  $$("[data-start-journey]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const journeySection = $("#journey");
      journeySection.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => startJourney(true), 650);
    });
  });
})();
