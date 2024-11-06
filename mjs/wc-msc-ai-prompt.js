import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';
import { buttons as _fujiButtons } from './fuji-css.js';

/*
 reference:
 - Built-in AI: https://developer.chrome.com/docs/ai/built-in
 - Built-in AI Early Preview Program: https://docs.google.com/document/d/18otm-D9xhn_XyObbQrc1v7SI-7lBX3ynZkjEpiS1V04/edit?tab=t.0
 - Prompt API: https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0#heading=h.drihdh1gpv8p
 - MDN text-wrap: https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap
 */

const defaults = {
  config: {
    // systemPrompt, temperature, topK
  },
  prompts: '',
  disabled: false,
  l10n: {
    subject: 'Gemini',
    introduction: 'Here comes your prompt result.',
    apply: 'APPLY',
    triggerlabel: 'prompt'
  }
};

const booleanAttrs = ['disabled']; // booleanAttrs default should be false
const objectAttrs = ['config', 'l10n'];
const custumEvents = {
  apply: 'msc-ai-prompt-apply',
  error: 'msc-ai-prompt-error',
  process: 'msc-ai-prompt-process',
  processEnd: 'msc-ai-prompt-process-end'
};
const NS = window.ai?.languageModel ? 'languageModel' : 'assistant';

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}
${_fujiButtons}

:host {
  --block-size: auto;

  position: relative;
  display: block;
}

:host(.align-container-size) {
  --block-size: 100%;

  block-size: 100%;
}

:host([disabled]) {
  .btn-prompt {
    --btn-scale: var(--btn-scale-hide);
    --btn-pointer-events: none;
  }
}

.main {
  --trigger-size: var(--msc-ai-prompt-trigger-size, 40px);
  --trigger-z-index: var(--msc-ai-prompt-trigger-z-index, 1);
  --trigger-inset: var(--msc-ai-prompt-trigger-inset, 8px 8px auto auto);
  --trigger-icon: var(--msc-ai-prompt-trigger-icon, path('M7.2,13.2c0-1.5-0.5-2.8-1.6-3.8C4.6,8.3,3.3,7.8,1.8,7.8c1.5,0,2.8-0.5,3.8-1.6c1.1-1.1,1.6-2.3,1.6-3.8 c0,1.5,0.5,2.8,1.6,3.8c1.1,1.1,2.3,1.6,3.8,1.6c-1.5,0-2.8,0.5-3.8,1.6C7.7,10.4,7.2,11.7,7.2,13.2z M7.2,19.8h1.3l9.4-9.4 l-0.7-0.7l-0.6-0.6l-9.4,9.4V19.8z M5.4,21.6v-3.8L17.9,5.3c0.4-0.4,0.8-0.5,1.3-0.5s0.9,0.2,1.3,0.5l1.3,1.3 c0.4,0.4,0.5,0.8,0.5,1.3s-0.2,0.9-0.5,1.3L9.2,21.6H5.4z M20.4,7.8l-1.3-1.2L20.4,7.8z M17.9,10.4l-0.7-0.7l-0.6-0.6L17.9,10.4z'));
  --trigger-icon-scale: var(--msc-ai-prompt-trigger-icon-scale, 1);
  --trigger-icon-color: var(--msc-ai-prompt-trigger-icon-color, rgba(35 42 49));

  block-size: var(--block-size);

  .main__slot {
    position: relative;
    inline-size: 100%;
    block-size: var(--block-size);
    display: block;

    &::slotted(*) {
      max-inline-size: 100%;
    }
  }
}

.btn-prompt {
  --btn-scale-show: 1;
  --btn-scale-hide: .001;
  --btn-scale: var(--btn-scale-show);
  --btn-pointer-events: auto;

  position: absolute;
  inset: var(--trigger-inset);
  inline-size: var(--trigger-size);
  aspect-ratio: 1/1;
  font-size: 0;
  color: transparent;
  border-radius: var(--trigger-size);
  padding: 0;
  margin: 0;
  appearance: none;
  border: 0 none;
  box-shadow: none;
  display: grid;
  place-content: center;
  outline: 0 none;
  overflow: hidden;
  pointer-events: var(--btn-pointer-events);
  z-index: var(--trigger-z-index);
  transition: scale 200ms ease;
  will-change: scale;
  scale: var(--btn-scale);

  &:active {
    scale: .8;
    transition-duration: 0ms;
  }

  &:focus-visible,
  &[inert] {
    &::before {
      animation: smart-draft-gradient 2100ms infinite linear;
    }
  }

  &::before {
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: 0;
    content: '';
    inline-size: 100%;
    aspect-ratio: 1/1;
    background: linear-gradient(135deg,#d3e3fd,#d0f8ff,#a8c7fa,#99f0ff,#d3e3fd,#d3e3fd,#d0f8ff,#a8c7fa,#99f0ff,#d3e3fd);
    background-size: 800% 800%;
    display: block;
  }

  &::after {
    content: '';
    inline-size: 24px;
    aspect-ratio: 1/1;
    clip-path: var(--trigger-icon);
    display: block;
    background-color: var(--trigger-icon-color);
    scale: var(--trigger-icon-scale);
  }

  @media (hover: hover) {
    &:hover::before {
      animation: smart-draft-gradient 2100ms infinite linear;
    }
  }
}

@keyframes smart-draft-gradient {
  0% { background-position:bottom right; }
  to { background-position:top 37.5% left 37.5%; }
}

/* dialog */
.fuji-alerts {
  --background: var(--msc-ai-prompt-dialog-background-color, rgba(255 255 255));
  --backdrop-color: var(--msc-ai-prompt-dialog-backdrop-color, rgba(35 42 49/.6));
  --head-text-color: var(--msc-ai-prompt-dialog-head-text-color, rgba(35 42 49));
  --line-color: var(--msc-ai-prompt-dialog-line-color, rgba(199 205 210));
  --close-icon-color: var(--msc-ai-prompt-dialog-close-icon-color, rgba(95 99 104));
  --close-hover-background-color: var(--msc-ai-prompt-dialog-close-hover-background-color, rgba(245 248 250));
  --apply-background-color: var(--msc-ai-prompt-dialog-apply-background-color, rgba(0 99 235));
  --introduction-color: var(--msc-ai-prompt-dialog-introduction-color, rgba(35 42 49));
  --result-color: var(--msc-ai-prompt-dialog-result-color, rgba(44 54 63));
  --result-background-color: var(--msc-ai-prompt-dialog-result-background-color, rgba(245 248 250));

  --padding-inline: 20px;
  --padding-block-start: 6px;
  --padding-block-end: var(--padding-inline);
  --margin: 24px;

  --content-inline-size: 600px;
  --content-max-inline-size: calc(100dvi - var(--padding-inline) * 2 - var(--margin) * 2);
  --content-max-block-size: calc(100dvb - var(--padding-block-start) - var(--padding-block-end) - var(--margin) * 2);

  --close-size: 40;
  --close-size-with-unit: calc(var(--close-size) * 1px);
  --close-mask: path('M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
  --close-icon-scale: calc((var(--close-size) * .6) / 24);

  --main-max-block-size: calc(80dvb - var(--padding-block-start) - var(--padding-block-end) - (var(--close-size) * 1px + 4px + 1px)); /* fuji-alerts__form__head's padding-bottom + border size */

  background-color: var(--background);
  border-radius: 0.5em;
  border: 0 none;
  padding: var(--padding-block-start) var(--padding-inline) var(--padding-block-end);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.05);
  outline: 0 none;

  &::backdrop {
    background-color: var(--backdrop-color);
  }

  &[open],
  &[open]::backdrop {
    animation: fuji-alerts-open 400ms cubic-bezier(0.4, 0, 0.2, 1) normal;
  }

  &[close],
  &[close]::backdrop {
    animation: fuji-alerts-close 400ms cubic-bezier(0, 0, 0.2, 1) normal;
  }

  .fuji-alerts__form {
    --head-font-size: 1.125em;

    inline-size: var(--content-inline-size);
    block-size: fit-content;
    max-inline-size: var(--content-max-inline-size);
    max-block-size: var(--content-max-block-size);
    outline: 0 none;
    display: block;

    @media screen and (width <= 767px) {
      --head-font-size: 1em;
    }

    .fuji-alerts__form__head {
      block-size: var(--close-size);
      padding-block-end: 4px;
      border-block-end: 1px solid var(--line-color);

      display: flex;
      align-items: center;
      justify-content: space-between;

      .fuji-alerts__form__head__p {
        font-size: var(--head-font-size);
        color: var(--head-text-color);
      }
    }

    .fuji-alerts__form__main {
      --gap: 1em;
      --mask-vertical-size: var(--gap);
      --mask-vertical: linear-gradient(
        to bottom,
        transparent 0%,
        black calc(0% + var(--mask-vertical-size)),
        black calc(100% - var(--mask-vertical-size)),
        transparent 100%
      );

      /* scroll */
      --scrollbar-inline-size: 2px;
      --scrollbar-block-size: 2px;
      --scrollbar-background: transparent;
      --scrollbar-thumb-color: rgba(0 0 0/.2);
      --scrollbar-thumb: var(--scrollbar-thumb-color);

      inline-size: 100%;
      min-block-size: 100px;
      max-block-size: var(--main-max-block-size);
      overflow: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      box-sizing: border-box;
      mask-image: var(--mask-vertical);
      -webkit-mask-image: var(--mask-vertical);
      padding-block: var(--gap);

      &::-webkit-scrollbar {
        inline-size: var(--scrollbar-inline-size);
        block-size: var(--scrollbar-block-size);
      }

      &::-webkit-scrollbar-track {
        background: var(--scrollbar-background);
      }

      &::-webkit-scrollbar-thumb {
        border-radius: var(--scrollbar-block-size);
        background: var(--scrollbar-thumb);
      }
    }
  }

  .fuji-alerts__close {
    --background-color-normal: rgba(255 255 255/0);
    --background-color-active: var(--close-hover-background-color);
    --background-color: var(--background-color-normal);

    font-size: 0;
    position: relative;
    inline-size: var(--close-size-with-unit);
    aspect-ratio: 1/1;
    appearance: none;
    border: 0 none;
    border-radius: var(--close-size-with-unit);
    outline: 0 none;
    background-color: var(--background-color);
    transition: background-color 200ms ease;
    will-change: background-color;
    z-index: 1;

    &::before {
      position: absolute;
      inset-inline: 0 0;
      inset-block: 0 0;
      margin: auto;
      inline-size: 24px;
      block-size: 24px;
      content: '';
      background-color: var(--close-icon-color);
      clip-path: var(--close-mask);
      scale: var(--close-icon-scale);
    }

    &:active {
      scale: .8;
    }

    &:focus {
      --background-color: var(--background-color-active);
    }

    @media (hover: hover) {
      &:hover {
        --background-color: var(--background-color-active);
      }
    }
  }

  @media screen and (width <= 767px) {
    --padding-inline: 12px;
    --padding-block-start: 4px;
    --margin: 0px;

    --close-size: 32;
    --content-inline-size: 100dvi;

    border-end-start-radius: 0;
    border-end-end-radius: 0;

    &[open],
    &[close] {
      animation: revert;
    }

    &[open]:modal {
      animation: fuji-alerts-open-dock 400ms cubic-bezier(0.4, 0, 0.2, 1) normal;
    }

    &[close]:modal {
      animation: fuji-alerts-close-dock 400ms cubic-bezier(0, 0, 0.2, 1) normal;
    }

    &:modal {
      inline-size: 100%;
      max-inline-size: 100%;
      box-sizing: border-box;
      inset-block: auto 0;
    }
  }
}

@keyframes fuji-alerts-open {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fuji-alerts-close {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fuji-alerts-open-dock {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
}

@keyframes fuji-alerts-close-dock {
  from {
    transform: translateY(0%);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

.prompt-result {
  position:relative;

  .pretty-paragraph {
    word-break: break-word;
    hyphens: auto;
    text-wrap: pretty;
    white-space: pre-wrap;
  }

  .prompt-result__title {
    --sparkle-size: 28px;

    min-block-size: var(--sparkle-size);
    color: var(--introduction-color);
    line-height: 1.3;
    padding-block-start: .225em;
    padding-inline-start: calc(var(--sparkle-size) + .5em);
    background: 0% 0% / var(--sparkle-size) var(--sparkle-size) no-repeat url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0IDI4QzE0IDI2LjA2MzMgMTMuNjI2NyAyNC4yNDMzIDEyLjg4IDIyLjU0QzEyLjE1NjcgMjAuODM2NyAxMS4xNjUgMTkuMzU1IDkuOTA1IDE4LjA5NUM4LjY0NSAxNi44MzUgNy4xNjMzMyAxNS44NDMzIDUuNDYgMTUuMTJDMy43NTY2NyAxNC4zNzMzIDEuOTM2NjcgMTQgMCAxNEMxLjkzNjY3IDE0IDMuNzU2NjcgMTMuNjM4MyA1LjQ2IDEyLjkxNUM3LjE2MzMzIDEyLjE2ODMgOC42NDUgMTEuMTY1IDkuOTA1IDkuOTA1QzExLjE2NSA4LjY0NSAxMi4xNTY3IDcuMTYzMzMgMTIuODggNS40NkMxMy42MjY3IDMuNzU2NjcgMTQgMS45MzY2NyAxNCAwQzE0IDEuOTM2NjcgMTQuMzYxNyAzLjc1NjY3IDE1LjA4NSA1LjQ2QzE1LjgzMTcgNy4xNjMzMyAxNi44MzUgOC42NDUgMTguMDk1IDkuOTA1QzE5LjM1NSAxMS4xNjUgMjAuODM2NyAxMi4xNjgzIDIyLjU0IDEyLjkxNUMyNC4yNDMzIDEzLjYzODMgMjYuMDYzMyAxNCAyOCAxNEMyNi4wNjMzIDE0IDI0LjI0MzMgMTQuMzczMyAyMi41NCAxNS4xMkMyMC44MzY3IDE1Ljg0MzMgMTkuMzU1IDE2LjgzNSAxOC4wOTUgMTguMDk1QzE2LjgzNSAxOS4zNTUgMTUuODMxNyAyMC44MzY3IDE1LjA4NSAyMi41NEMxNC4zNjE3IDI0LjI0MzMgMTQgMjYuMDYzMyAxNCAyOFoiIGZpbGw9InVybCgjcGFpbnQwX3JhZGlhbF8xNjc3MV81MzIxMikiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8xNjc3MV81MzIxMiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgyLjc3ODc2IDExLjM3OTUpIHJvdGF0ZSgxOC42ODMyKSBzY2FsZSgyOS44MDI1IDIzOC43MzcpIj4KPHN0b3Agb2Zmc2V0PSIwLjA2NzEyNDYiIHN0b3AtY29sb3I9IiM5MTY4QzAiLz4KPHN0b3Agb2Zmc2V0PSIwLjM0MjU1MSIgc3RvcC1jb2xvcj0iIzU2ODREMSIvPgo8c3RvcCBvZmZzZXQ9IjAuNjcyMDc2IiBzdG9wLWNvbG9yPSIjMUJBMUUzIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==");
    box-sizing: border-box;
  }

  .prompt-result__content {
    color: var(--result-color);
    line-height: 1.3;
    inline-size: 100%;
    box-sizing: border-box;
    padding: .75em;
    border: 1px solid var(--line-color);
    border-radius: .5em;
    margin-block-start: 1em;
    background-color: var(--result-background-color);
  }

  .prompt-result__action {
    position: sticky;

    inset-inline-start: 0;
    inset-block-end: -1em;

    inline-size: 100%;
    padding-block: 1em;
    box-sizing: border-box;

    backdrop-filter: blur(3px);

    .buttons[data-type=primary] {
      --default-background-color: var(--apply-background-color);
      
      inline-size: 100%;
    }
  }
}
</style>

<div class="main" ontouchstart="" tabindex="0">
  <slot class="main__slot"></slot>
  <button class="btn-prompt" type="button" title="${defaults.l10n.triggerlabel}" aria-label="${defaults.l10n.triggerlabel}">prompt</button>
</div>

<dialog class="fuji-alerts">
  <form class="fuji-alerts__form dialog-content">
    <div class="fuji-alerts__form__head">
      <p class="fuji-alerts__form__head__p">${defaults.l10n.subject}</p>
      <button
        type="button"
        class="fuji-alerts__close"
        data-action="close"
      >
        cancel
      </button>
    </div>

    <div class="fuji-alerts__form__main">
      <div class="prompt-result">
        <p class="prompt-result__title pretty-paragraph">${defaults.l10n.introduction}</p>
        <p class="prompt-result__content pretty-paragraph"></p>
      
        <div class="prompt-result__action">
          <button
            type="button"
            class="buttons"
            data-type="primary"
            data-size="medium"
            data-action="apply"
          >
            ${defaults.l10n.apply}
          </button>
        </div>
      </div>
    </div>
  </form>
</dialog>
`;

// Houdini Props and Vals, https://web.dev/at-property/
if (CSS?.registerProperty) {
  try {
    CSS.registerProperty({
      name: '--msc-ai-prompt-dialog-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(255 255 255)'
    });

    CSS.registerProperty({
      name: '--msc-ai-prompt-dialog-backdrop-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49/.6)'
    });

    CSS.registerProperty({
      name: '--msc-ai-prompt-dialog-head-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });

    CSS.registerProperty({
      name: '--msc-ai-prompt-dialog-line-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(199 205 210)'
    });

    CSS.registerProperty({
      name: '--msc-ai-prompt-dialog-close-icon-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(95 99 104)'
    });

    CSS.registerProperty({
      name: '--msc-ai-prompt-dialog-close-hover-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(245 248 250)'
    });

    CSS.registerProperty({
      name: '--msc-ai-prompt-dialog-apply-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(0 99 235)'
    });

    CSS.registerProperty({
      name: '--msc-ai-prompt-dialog-introduction-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });

    CSS.registerProperty({
      name: '--msc-ai-prompt-dialog-result-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(44 54 63)'
    });

    CSS.registerProperty({
      name: '--msc-ai-prompt-dialog-result-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(245 248 250)'
    });

    CSS.registerProperty({
      name: '--msc-ai-prompt-trigger-size',
      syntax: '<length>',
      inherits: true,
      initialValue: '40px'
    });

    CSS.registerProperty({
      name: '--msc-ai-prompt-trigger-icon-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });
  } catch(err) {
    console.warn(`msc-ai-prompt: ${err.message}`);
  }
}

let available = 'no';
if (window.ai?.[NS]) {
  const {
    available: A,
    defaultTemperature,
    defaultTopK
  } = await window.ai[NS].capabilities();

  available = A;
  defaults.config = {
    systemPrompt: '',
    temperature: defaultTemperature,
    topK: defaultTopK
  };
}

export class MscAiPrompt extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: '',
      session: '',
      sessionController: ''
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      trigger: this.shadowRoot.querySelector('.btn-prompt'),
      dialog: this.shadowRoot.querySelector('dialog'),
      btnClose: this.shadowRoot.querySelector('.fuji-alerts__close'),
      btnApply: this.shadowRoot.querySelector('button[data-action="apply"]'),
      dialogSubject: this.shadowRoot.querySelector('.fuji-alerts__form__head__p'),
      dialogResultIntroduction: this.shadowRoot.querySelector('.prompt-result__title'),
      dialogResultContent: this.shadowRoot.querySelector('.prompt-result__content')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscAiPrompt(config)
    };

    // evts
    this._onClick = this._onClick.bind(this);
    this._onDialogCancel = this._onDialogCancel.bind(this);
    this._onDialogButtonsClick = this._onDialogButtonsClick.bind(this);

  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);
   const { trigger, dialog } = this.#nodes;

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // feature detect
    if (available === 'no') {
      trigger.remove();
      return;
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this.#upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    trigger.addEventListener('click', this._onClick, { signal });
    dialog.addEventListener('cancel', this._onDialogCancel, { signal });
    dialog.addEventListener('click', this._onDialogButtonsClick, { signal });
  }

  disconnectedCallback() {
    const { dialog } = this.#nodes;

    if (dialog.open) {
      dialog.close();
    }

    if (this.#data.controller?.abort) {
      this.#data.controller.abort();
    }

    if (this.#data.sessionController?.abort) {
      this.#data.sessionController.abort();
    }

    if (this.#data.session?.destroy) {
      this.#data.session.destroy();
    }
  }

  #format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'l10n':
        case 'config': {
          let values;

          try {
            values = JSON.parse(newValue);
          } catch(err) {
            console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
            values = { ...defaults[attrName] };
          }

          if (attrName === 'l10n') {
            values = { ...defaults.l10n, ...values };
          }

          this.#config[attrName] = values;
          break;
        }

        case 'prompts': {
          this.#config[attrName] = newValue || defaults[attrName];
          break;
        }

        case 'disabled':
          this.#config[attrName] = true;
          break;
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscAiPrompt.observedAttributes.includes(attrName)) {
      return;
    }

    this.#format(attrName, oldValue, newValue);

    switch (attrName) {
      case 'l10n': {
        const { subject, introduction, apply, triggerlabel } = this.l10n;
        const { dialogSubject, dialogResultIntroduction, btnApply, trigger } = this.#nodes;

        dialogSubject.textContent = subject;
        dialogResultIntroduction.textContent = introduction;
        btnApply.textContent = apply;
        trigger.title = triggerlabel;
        trigger.ariaLabel = triggerlabel;
        break;
      }
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscAiPrompt.observedAttributes
  }

  static get supportedEvents() {
    return Object.keys(custumEvents).map(
      (key) => {
        return custumEvents[key];
      }
    );
  }

  #upgradeProperty(prop) {
    let value;

    if (MscAiPrompt.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set config(value) {
    if (value) {
      const newValue = {
        ...defaults.config,
        ...this.config,
        ...(typeof value === 'string' ? JSON.parse(value) : value)
      };
      this.setAttribute('config', JSON.stringify(newValue));
    } else {
      this.removeAttribute('config');
    }
  }

  get config() {
    return this.#config.config;
  }

  set prompts(value) {
    if (value) {
      this.setAttribute('prompts', value);
    } else {
      this.removeAttribute('prompts');
    }
  }

  get prompts() {
    return this.#config.prompts;
  }

  set disabled(value) {
    this.toggleAttribute('disabled', Boolean(value));
  }

  get disabled() {
    return this.#config.disabled;
  }

  set l10n(value) {
    if (value) {
      const newValue = {
        ...defaults.l10n,
        ...this.l10n,
        ...(typeof value === 'string' ? JSON.parse(value) : value)
      };
      this.setAttribute('l10n', JSON.stringify(newValue));
    } else {
      this.removeAttribute('l10n');
    }
  }

  get l10n() {
    return this.#config.l10n;
  }

  get available() {
    return available;
  }

  #fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  #prepareDialogClose() {
    const { dialog } = this.#nodes;

    if (!dialog.open) {
      return;
    }

    dialog.addEventListener(
      'animationend',
      () => {
        dialog.removeAttribute('close');
        dialog.close();
      },
      { once: true }
    );

    dialog.toggleAttribute('close', true);
  }

  _onDialogCancel(evt) {
    evt.preventDefault();

    this.#prepareDialogClose();
  }

  _onDialogButtonsClick(evt) {
    const button = evt.target.closest('button');

    if (!button) {
      return;
    }

    const action = button.dataset.action;

    switch (action) {
      case 'close': {
        this.#prepareDialogClose();
        break;
      }

      case 'apply': {
        this.#prepareDialogClose();
        this.#fireEvent(custumEvents.apply, { result: this.#data.result });
        break;
      }
    }
  }

  #getPrompts() {
    let prompts = this.prompts;
    const target = this.querySelector('input[type=text],textarea');

    if (target && target.value) {
      prompts = prompts.replace(/\{\{replacement\}\}/gm, target.value);
    }

    return prompts;
  }

  async _onClick() {
    const result = await this.prompt();

    if (result) {
      const { dialog, dialogResultContent } = this.#nodes;

      this.#data.result = result;

      if (dialog.open) {
        dialog.close();
      }

      dialogResultContent.textContent = result;
      this.#nodes.dialog.showModal();
    }
  }

  async #getSession() {
    // abort
    if (this.#data.sessionController?.abort) {
      this.#data.sessionController.abort();
    }

    if (this.#data.session?.destroy) {
      this.#data.session.destroy();
    }

    this.#data.sessionController = new AbortController();
    this.#data.session = await window.ai[NS].create(this.config);

    return this.#data.session;
  }

  async prompt(prompts = '') {
    let result = '';

    if (!prompts) {
      prompts = this.#getPrompts();
    }

    if (!prompts || available === 'no') {
      return result;
    }

    const { trigger } = this.#nodes;
    const session = await this.#getSession();
    const signal = this.#data.sessionController.signal;

    trigger.inert = true;
    this.#fireEvent(custumEvents.process);

    try {
      result = await session.prompt(prompts, { signal });
    } catch(err) {
      const { message } = err;

      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${message}`);
      this.#fireEvent(custumEvents.error, { message });
    }

    trigger.inert = false;
    this.#fireEvent(custumEvents.processEnd);

    return result;
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscAiPrompt');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscAiPrompt'), MscAiPrompt);
}