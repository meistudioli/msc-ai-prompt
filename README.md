# msc-ai-prompt

[![DeepScan grade](https://deepscan.io/api/teams/16372/projects/28232/branches/909145/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=28232&bid=909145)

&lt;msc-ai-prompt /> is a web component based on Chrome Built-in AI Prompt API. Web developers could use &lt;msc-ai-prompt /> wrap form element and give it prompt feature support.

![<yahoo-x-bv-player />](https://blog.lalacube.com/mei/img/preview/msc-ai-prompt.png)

## Basic Usage

&lt;msc-ai-prompt /> is a web component. All we need to do is put the required script into your HTML document. Then follow <&lt;msc-ai-prompt />'s html structure and everything will be all set.

- Required Script

```html
<script
  type="module"
  src="https://unpkg.com/yahoo-x-bv-player/mjs/wc-msc-ai-prompt.js">        
</script>
```

- Structure

Put &lt;msc-ai-prompt /> into HTML document. It will have different functions and looks with attribute mutation.

```html
<msc-ai-prompt>
  <script type="application/json">
    {
      "config": {
        "systemPrompt": "",
        "temperature": 0.8,
        "topK": 3
      },
      "prompts": "Rewrite the following article and make it more vivid.\n\n{{replacement}}",
      "l10n": {
        "subject": "Gemini",
        "introduction": "Here comes your product description rewrite result.",
        "apply": "APPLY",
        "triggerlabel": "make product description more vivid"
      }
    }
  </script>
  
  <textarea name="product-description" placeholder="input some description.">
    With iPhone Mirroring, you can view your iPhone screen on your Mac and control it without picking up your phone. Continuity features also let you answer calls or messages right from your Mac. You can even copy images, video, or text from your iPhone and paste it all into a different app on your Mac. And with iCloud, you can access your files from either device.
  </textarea>
</msc-ai-prompt>
```

Otherwise, developers could also choose remoteconfig to fetch config for <msc-ai-prompt />.

```html
<msc-ai-prompt
  remoteconfig="https://your-domain/api-path"
>
  ...
</msc-ai-prompt>
```

## JavaScript Instantiation

&lt;msc-ai-prompt /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscAiPrompt } from 'https://unpkg.com/msc-ai-prompt/mjs/wc-msc-ai-prompt.js';

const formElementTemplate = document.querySelector('.my-form-element-template');

// use DOM api
const nodeA = document.createElement('msc-ai-prompt');
document.body.appendChild(nodeA);
nodeA.appendChild(formElementTemplate.content.cloneNode(true));
nodeA.config = {
  systemPrompt: '',
  temperature: .8,
  topK: 3
};
nodeA.loop = true;

// new instance with Class
const nodeB = new MscAiPrompt();
document.body.appendChild(nodeB);
nodeB.appendChild(formElementTemplate.content.cloneNode(true));
nodeB.config = {
  systemPrompt: '',
  temperature: .8,
  topK: 3
};
nideB.disabed = true;

// new instance with Class & default config
const config = {
  config: {
    systemPrompt: '',
    temperature: .8,
    topK: 3
  }
};
const nodeC = new MscAiPrompt(config);
document.body.appendChild(nodeC);
nodeC.appendChild(formElementTemplate.content.cloneNode(true));
</script>
```

## Style Customization

Developers could apply styles to decorate &lt;msc-ai-prompt />'s looking.

```html
<style>
msc-ai-prompt {
  /* trigger */
  --msc-ai-prompt-trigger-size: 40px;
  --msc-ai-prompt-trigger-inset: 8px 8px auto auto;
  --msc-ai-prompt-trigger-z-index: 1;
  --msc-ai-prompt-trigger-icon: path('M7.2,13.2c0-1.5-0.5-2.8-1.6-3.8C4.6,8.3,3.3,7.8,1.8,7.8c1.5,0,2.8-0.5,3.8-1.6c1.1-1.1,1.6-2.3,1.6-3.8 c0,1.5,0.5,2.8,1.6,3.8c1.1,1.1,2.3,1.6,3.8,1.6c-1.5,0-2.8,0.5-3.8,1.6C7.7,10.4,7.2,11.7,7.2,13.2z M7.2,19.8h1.3l9.4-9.4 l-0.7-0.7l-0.6-0.6l-9.4,9.4V19.8z M5.4,21.6v-3.8L17.9,5.3c0.4-0.4,0.8-0.5,1.3-0.5s0.9,0.2,1.3,0.5l1.3,1.3 c0.4,0.4,0.5,0.8,0.5,1.3s-0.2,0.9-0.5,1.3L9.2,21.6H5.4z M20.4,7.8l-1.3-1.2L20.4,7.8z M17.9,10.4l-0.7-0.7l-0.6-0.6L17.9,10.4z');
  --msc-ai-prompt-trigger-icon-color: rgba(35 42 49);
  --msc-ai-prompt-trigger-icon-scale: 1;
  
  /* dialog */
  --msc-ai-prompt-dialog-background-color: rgba(255 255 255);
  --msc-ai-prompt-dialog-backdrop-color: rgba(35 42 49/.6);
  --msc-ai-prompt-dialog-head-text-color: rgba(35 42 49);
  --msc-ai-prompt-dialog-line-color: rgba(199 205 210);
  --msc-ai-prompt-dialog-close-icon-color: rgba(95 99 104);
  --msc-ai-prompt-dialog-close-hover-background-color: rgba(245 248 250);
  --msc-ai-prompt-dialog-apply-background-color: rgba(0 99 235);
  --msc-ai-prompt-dialog-introduction-color: rgba(35 42 49);
  --msc-ai-prompt-dialog-result-color: rgba(44 54 63);
  --msc-ai-prompt-dialog-result-background-color: rgba(245 248 250);
}
</style>
```

Otherwise delevelopers could also add className - align-container-size to make &lt;msc-ai-prompt />'s size same as container's size.（default is inline-size: 100% only）

```html
<msc-ai-prompt class="align-container-size">
  ...
</msc-ai-prompt>
```

## Attributes

&lt;msc-ai-prompt /> supports some attributes to let it become more convenience & useful.

- **config**

Set [Prompt API](https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0) create config.

`systemPrompt`：Set systemPrompt. Default is empty string.\
`temperature`：Set temperature. Default is `0.8`.\
`topK`：Set topK. Default is `3`.

```html
<msc-ai-prompt config='{"systemPrompt":"","temperature":0.8,"topK":3}'>
  ...
</msc-ai-prompt>
```

- **prompts**

Set prompts. Web developer could add keyword `{{replacement}}` in prompt sentence, &lt;msc-ai-prompt /> will use first form element's (input[type=text], textarea) value and do replace action. Default is empty string.

```html
<msc-ai-prompt prompts="Rewrite the following article and make it more vivid.\n\n{{replacement}}">
  ...
</msc-ai-prompt>
```

- **disabled**

Hides the prompt trigger button once set. It is `false` by default (not set).

```html
<msc-ai-prompt disabled>
  ...
</msc-ai-prompt>
```

- **l10n**

Set localization for title or action buttons.

`subject`：Set dialog subject.\
`introduction`：Set Set dialog result title.\
`apply`：Set prompt trigger button's content.\
`triggerlabel`：Set prompt trigger button's label.

```html
<msc-ai-prompt l10n='{"subject":"Gemini","introduction":"Here comes your prompt result.","apply":"APPLY","triggerlabel":"prompt"}'>
  ...
</msc-ai-prompt>
```

## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| config | Object | Getter / Setter Prompt API create config. Developers could set `systemPrompt`、`temperature` and `topK` here. |
| prompts | String | Getter / Setter prompts. Web developer could add keyword `{{replacement}}` in prompt sentence, <msc-ai-prompt /> will use first form element's (input[type=text], textarea) value and do replace action. Default is empty string. |
| disabled | Boolean | Getter / Setter disabled. Hides the prompt trigger button once set. It is false by default. |
| l10n | Object | Getter / Setter localization for title or action buttons. Developers could set `subject`、`introduction`、`apply` and `triggerlabel` here. |
| available | String | Getter available. Web developers will get "`no`" if current browser doesn't support Build-in AI. |

## Mathod

| Mathod Signature | Description |
| ----------- | ----------- |
| prompt(prompt = <msc-ai-prompt />'s prompts) | Go prompt. This is an async function. Default will take &lt;msc-ai-prompt />'s `prompts` value. |

## Events
| Event Signature | Description |
| ----------- | ----------- |
| msc-ai-prompt-apply | Fired when result dialog's apply button pressed. Developers could gather `result` information through event.detail. |
| msc-ai-prompt-error | Fired when prompt process error occured. Developers could gather `message` information through event.detail. |
| msc-ai-prompt-process | Fired when prompt processing. |
| msc-ai-prompt-process-end | Fired when prompt process end. |

## Reference
- [AI on Chrome > Built-in AI](https://developer.chrome.com/docs/ai/built-in)
- [Join the early preview program
](https://docs.google.com/forms/d/e/1FAIpQLSfZXeiwj9KO9jMctffHPym88ln12xNWCrVkMY_u06WfSTulQg/viewform)
- [Built-in AI > Prompt API](https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0)
- [&lt;msc-ai-prompt /> demo](https://blog.lalacube.com/mei/webComponent_msc-ai-prompt.html)
- [YouTube tutorial](https://www.youtube.com/shorts/C8v8gRr6cSQ)
- [WEBCOMPONENTS.ORG](https://www.webcomponents.org/element/msc-ai-prompt)
