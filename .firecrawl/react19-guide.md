[Skip to content](https://dev.to/vishwark/react-19-the-complete-practical-guide-2025-2l73#main-content)

Navigation menu[![DEV Community](https://media2.dev.to/dynamic/image/quality=100/https://dev-to-uploads.s3.amazonaws.com/uploads/logos/resized_logo_UQww2soKuUsjaOGNB38o.png)](https://dev.to/)

Search[Powered by Algolia\\
Search](https://www.algolia.com/developers/?utm_source=devto&utm_medium=referral)

[Log in](https://dev.to/enter?signup_subforem=1)[Create account](https://dev.to/enter?signup_subforem=1&state=new-user)

## DEV Community

Close

![](https://assets.dev.to/assets/heart-plus-active-9ea3b22f2bc311281db911d416166c5f430636e76b15cd5df6b3b841d830eefa.svg)3
Add reaction


![](https://assets.dev.to/assets/sparkle-heart-5f9bee3767e18deb1bb725290cb151c25234768a0e9a2bd39370c382d02920cf.svg)2
Like
![](https://assets.dev.to/assets/multi-unicorn-b44d6f8c23cdd00964192bedc38af3e82463978aa611b4365bd33a0f1f4f3e97.svg)1
Unicorn
![](https://assets.dev.to/assets/exploding-head-daceb38d627e6ae9b730f36a1e390fca556a4289d5a41abb2c35068ad3e2c4b5.svg)0
Exploding Head
![](https://assets.dev.to/assets/raised-hands-74b2099fd66a39f2d7eed9305ee0f4553df0eb7b4f11b01b6b1b499973048fe5.svg)0
Raised Hands
![](https://assets.dev.to/assets/fire-f60e7a582391810302117f987b22a8ef04a2fe0df7e3258a5f49332df1cec71e.svg)0
Fire


0
Jump to Comments
0
Save

Boost


More...

Copy linkCopy link

Copied to Clipboard

[Share to X](https://twitter.com/intent/tweet?text=%22%F0%9F%9A%80%20React%2019%20%E2%80%94%20All%20new%20features%20%282025%29%22%20by%20Vishwark%20%23DEVCommunity%20https%3A%2F%2Fdev.to%2Fvishwark%2Freact-19-the-complete-practical-guide-2025-2l73) [Share to LinkedIn](https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fdev.to%2Fvishwark%2Freact-19-the-complete-practical-guide-2025-2l73&title=%F0%9F%9A%80%20React%2019%20%E2%80%94%20All%20new%20features%20%282025%29&summary=React%2019%20is%20the%20biggest%20upgrade%20after%20React%2018%20and%20officially%20completes%20React%E2%80%99s%20shift%20toward%20an...&source=DEV%20Community) [Share to Facebook](https://www.facebook.com/sharer.php?u=https%3A%2F%2Fdev.to%2Fvishwark%2Freact-19-the-complete-practical-guide-2025-2l73) [Share to Mastodon](https://s2f.kytta.dev/?text=https%3A%2F%2Fdev.to%2Fvishwark%2Freact-19-the-complete-practical-guide-2025-2l73)

[Share Post via...](about:blank#) [Report Abuse](https://dev.to/report-abuse)

![Cover image for 🚀 React 19 — All new features (2025)](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fxsk47dsjya4tmv5iyrjr.png)

[![Vishwark](https://media2.dev.to/dynamic/image/width=50,height=50,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fuser%2Fprofile_image%2F3116261%2F7660d70c-7d62-47b0-b862-83d53e492293.png)](https://dev.to/vishwark)

[Vishwark](https://dev.to/vishwark)

Posted on Nov 17, 2025

![](https://assets.dev.to/assets/sparkle-heart-5f9bee3767e18deb1bb725290cb151c25234768a0e9a2bd39370c382d02920cf.svg)2![](https://assets.dev.to/assets/multi-unicorn-b44d6f8c23cdd00964192bedc38af3e82463978aa611b4365bd33a0f1f4f3e97.svg)1![](https://assets.dev.to/assets/exploding-head-daceb38d627e6ae9b730f36a1e390fca556a4289d5a41abb2c35068ad3e2c4b5.svg)![](https://assets.dev.to/assets/raised-hands-74b2099fd66a39f2d7eed9305ee0f4553df0eb7b4f11b01b6b1b499973048fe5.svg)![](https://assets.dev.to/assets/fire-f60e7a582391810302117f987b22a8ef04a2fe0df7e3258a5f49332df1cec71e.svg)

# 🚀 React 19 — All new features (2025)

[#react](https://dev.to/t/react) [#nextjs](https://dev.to/t/nextjs) [#frontend](https://dev.to/t/frontend) [#webdev](https://dev.to/t/webdev)

React 19 is the biggest upgrade after React 18 and officially completes React’s shift toward an **async-first architecture**.

This release introduces:

- New async hooks
- Unified actions for mutations
- Optimistic UI
- Native `<form>` async workflows
- Better streaming & asset loading
- React Compiler (auto memoization)
- Strict Mode improvements
- Server Component upgrades

This guide goes **section by section**, with examples and real-world usage patterns.

* * *

## 🟦 A. New Hooks & Async Behaviors

* * *

## 1️⃣ `use()` — Consume Promises Directly Inside Components

React 19 allows you to directly “await” a Promise inside a component using the `use()` hook.

This eliminates the need for:

- `useEffect()`
- `useState()`
- manual loading state
- manual error state

Instead, React suspends the component until the Promise resolves.

* * *

### 🔹 Complete `use()` Example — With Component + Suspense Wrapper

#### Async function

```
async function fetchUser() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}
```

Enter fullscreen modeExit fullscreen mode

#### Component using `use()`

```
import { use } from "react";

function UserDetails() {
  const user = use(fetchUser()); // Suspends until resolved

  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Company: {user.company.name}</p>
    </div>
  );
}
```

Enter fullscreen modeExit fullscreen mode

#### Suspense wrapper

```
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <h1>User Profile</h1>

      <Suspense fallback={<p>Loading user...</p>}>
        <UserDetails />
      </Suspense>
    </div>
  );
}
```

Enter fullscreen modeExit fullscreen mode

### ✔️ Why this matters

- Cleaner async code → no effect handlers
- Works with SSR + streaming
- Integrates natively with Suspense

* * *

## 2️⃣ `useFormStatus()` — Automatic Pending State for Forms

Tracks submission and pending/error states of the nearest form.

Example:

```
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Saving..." : "Save"}</button>;
}
```

Enter fullscreen modeExit fullscreen mode

- Works with Server Actions
- Works with Client Actions
- No manual loading states

* * *

## 3️⃣ `useOptimistic()` — Instant UI Updates

For optimistic experiences (chat apps, todos, comments, likes).

```
const [optimisticTodos, addOptimistic] = useOptimistic(
  todos,
  (current, newTodo) => [...current, { text: newTodo, optimistic: true }]
);
```

Enter fullscreen modeExit fullscreen mode

This updates the UI immediately while the real async action runs.

* * *

## 🟦 B. Actions (Server + Client)

Actions unify how React handles **mutations**.

* * *

## 4️⃣ Server Actions (Framework Feature)

Run backend code securely from UI — no API routes required.

```
"use server";
async function savePost(formData) {
  await db.post.create({ title: formData.get("title") });
}
```

Enter fullscreen modeExit fullscreen mode

```
<form action={savePost}>
  <input name="title" />
  <button>Save</button>
</form>
```

Enter fullscreen modeExit fullscreen mode

Features:

- Secure (never sent to client)
- Automatic revalidation of components
- Streaming-friendly
- Pending + error states handled automatically

* * *

## 5️⃣ Client Actions (React Core Feature)

For React apps without a framework (Vite, CRA, etc).

```
const [state, action] = useActionState(async (prev, fd) => {
  return { message: "Saved!" };
}, {});
```

Enter fullscreen modeExit fullscreen mode

```
<form action={action}>
  <input name="name" />
  <SubmitButton />
</form>
```

Enter fullscreen modeExit fullscreen mode

React handles:

- pending
- result
- errors

All automatically.

* * *

## 🟦 C. Rendering Improvements

* * *

## 6️⃣ Native `<form>` Handling (Action-Based Forms)

React 19 lets you submit forms via:

```
<form action={myActionFunction}>
```

Enter fullscreen modeExit fullscreen mode

Meaning:

- No `onSubmit`
- No `e.preventDefault()`
- No `useState()` for loading
- Fully async-aware
- Automatically tracks pending/error states

* * *

## 7️⃣ Built-In Pending, Error, Success States

React attaches these states to actions:

- `pending`
- `error`
- `result`

Works with:

- `useFormStatus()`
- `useActionState()`
- Suspense

* * *

## 8️⃣ Native Navigation Transitions (Experimental)

Aligns client navigation with async transitions:

```
startTransition(() => {
  navigate("/dashboard");
});
```

Enter fullscreen modeExit fullscreen mode

This is the direction React is moving for future routing.

* * *

## 🟦 D. Asset Loading Improvements

* * *

## 9️⃣ Component-Level `<link>` and `<script>` Ownership

You can now include assets inside components:

```
<link rel="stylesheet" href="/profile.css" />
```

Enter fullscreen modeExit fullscreen mode

React:

- preloads assets
- hoists them safely
- deduplicates
- improves SSR + hydration timing

* * *

## 🔟 Improved Style/Script Ordering

React ensures:

- CSS is loaded before hydration to prevent layout shifts
- Scripts execute in correct order
- Suspense boundaries hydrate correctly

This significantly improves SSR and streaming performance.

* * *

## 🟦 E. React Compiler (React Forget) & Performance Upgrades

The **React Compiler** is now production-ready and automates most performance optimizations.

* * *

## 1️⃣1️⃣ React Compiler — What It Does

Removes the need for:

- `useMemo`
- `useCallback`
- `React.memo`

The compiler analyzes your component and automatically memoizes where needed.

### Before

```
const handleClick = useCallback(() => {
  console.log(user.name);
}, [user]);
```

Enter fullscreen modeExit fullscreen mode

### After

```
function handleClick() {
  console.log(user.name);
}
```

Enter fullscreen modeExit fullscreen mode

The compiler stabilizes function identity automatically.

* * *

## 🔥 How to Enable the React Compiler

### ✔️ Next.js 15 → Enabled by default

Check `next.config.js`:

```
module.exports = {
  reactCompiler: true,
};
```

Enter fullscreen modeExit fullscreen mode

* * *

### ✔️ Vite + React

```
npm install @vitejs/plugin-react
```

Enter fullscreen modeExit fullscreen mode

```
import react from '@vitejs/plugin-react';

export default {
  plugins: [\
    react({\
      babel: {\
        plugins: ["react-compiler"]\
      }\
    })\
  ]
};
```

Enter fullscreen modeExit fullscreen mode

* * *

### ✔️ Webpack / Babel / SWC

SWC config:

```
{
  "jsc": {
    "experimental": {
      "reactCompiler": true
    }
  }
}
```

Enter fullscreen modeExit fullscreen mode

Babel config:

```
{
  "plugins": ["react-compiler"]
}
```

Enter fullscreen modeExit fullscreen mode

* * *

## 1️⃣2️⃣ Transition Tracing (DevTools)

New DevTools features let you inspect:

- which transition triggered a render
- why async components re-rendered
- which actions caused state updates
- suspense wake-ups

Critical for debugging async-heavy apps.

* * *

## 🟦 F. Strict Mode & Ref Improvements

* * *

## 1️⃣3️⃣ New Stable Ref Behavior

Before React 19, refs were:

- unset during updates
- recreated unnecessarily
- sometimes temporarily `null`

React 19 fixes this:

- refs are now **set once per commit**
- no flicker
- stable across transitions
- safer with async rendering

This is big for:

- editors (CodeMirror, Monaco)
- charts
- canvas apps
- imperative handles

* * *

## 1️⃣4️⃣ Strict Mode Improvements

Strict Mode now:

- simulates async transitions
- aligns with compiler behavior
- improves safety for auto-memoization
- reduces double-invocation quirks

* * *

## 🟦 G. Ecosystem & Server Components

* * *

## 1️⃣5️⃣ Unified Actions API Across Ecosystem

React 19 standardizes the mutation model across:

- React
- Next.js
- Remix
- Hydrogen
- Waku

All now use:

```
<form action={myAction}>
```

Enter fullscreen modeExit fullscreen mode

This unifies client/server mutation patterns.

* * *

## 1️⃣6️⃣ Server Component Enhancements

Not officially part of React 19 but released alongside:

- better RSC streaming
- no waterfalls
- improved Suspense boundary matching
- more predictable hydration

This improves all full-stack React apps.

* * *

## 🟪 Final Summary

| Category | Feature | Solves |
| --- | --- | --- |
| Async | `use()` | Direct Promise usage + Suspense |
| UI | `useOptimistic()` | Instant optimistic UI |
| Forms | `useFormStatus()` | Auto pending/error |
| Mutations | Actions | Unified client/server mutations |
| Rendering | New form handling | Native async submit |
| Performance | React Compiler | Auto memoization |
| SSR | Asset Ownership | Faster hydration |
| Stability | New refs | Predictable, stable refs |

* * *

## 🎉 Final Thoughts

React 19 is a milestone release.

It transforms React into:

- async-native
- streaming-first
- mutation-unified
- compiler-optimized
- form-driven
- suspense-secure

If React 18 was the foundation, React 19 is the **completion of that vision**.

* * *

[![profile](https://media2.dev.to/dynamic/image/width=64,height=64,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Forganization%2Fprofile_image%2F8431%2F57ccd88f-6269-4347-893f-a0d3f8c5527a.jpg)\\
Bright Data](https://dev.to/bright-data) Promoted

Dropdown menu

- [What's a billboard?](https://dev.to/billboards)
- [Manage preferences](https://dev.to/settings/customization#sponsors)

* * *

- [Report billboard](https://dev.to/report-abuse?billboard=246463)

[![Image of Bright Data and n8n Challenge](https://media2.dev.to/dynamic/image/width=775%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fnj7dcejr2oq7h1cljch4.png)](https://dev.to/prema_ananda/building-a-multi-agent-ai-brand-monitoring-system-with-n8n-and-brightdata-oe0?bb=246463)

## [Building a Multi-Agent AI Brand Monitoring System with n8n and Bright Data](https://dev.to/prema_ananda/building-a-multi-agent-ai-brand-monitoring-system-with-n8n-and-brightdata-oe0?bb=246463)

Check out this submission for the [AI Agents Challenge powered by n8n and Bright Data](https://dev.to/challenges/brightdata-n8n-2025-08-13?bb=246463).

[Read more →](https://dev.to/prema_ananda/building-a-multi-agent-ai-brand-monitoring-system-with-n8n-and-brightdata-oe0?bb=246463)

Read More


## Top comments (0)

Subscribe

![pic](https://media2.dev.to/dynamic/image/width=256,height=,fit=scale-down,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F8j7kvp660rqzt99zui8e.png)

PersonalTrusted User

[Create template](https://dev.to/settings/response-templates)

Templates let you quickly answer FAQs or store snippets for re-use.

SubmitPreview [Dismiss](https://dev.to/404.html)

[Code of Conduct](https://dev.to/code-of-conduct)• [Report abuse](https://dev.to/report-abuse)

Are you sure you want to hide this comment? It will become hidden in your post, but will still be visible via the comment's [permalink](https://dev.to/vishwark/react-19-the-complete-practical-guide-2025-2l73#).


Hide child comments as well

Confirm


For further actions, you may consider blocking this person and/or [reporting abuse](https://dev.to/report-abuse)

DEV Community

Dropdown menu

- [What's a billboard?](https://dev.to/billboards)
- [Manage preferences](https://dev.to/settings/customization#sponsors)

* * *

- [Report billboard](https://dev.to/report-abuse?billboard=238783)

[![Google AI Education track image](https://media2.dev.to/dynamic/image/width=775%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fu09y9fffqrb2one15j3g.png)](https://dev.to/deved/build-apps-with-google-ai-studio?bb=238783)

## [Work through these 3 parts to earn the exclusive Google AI Studio Builder badge!](https://dev.to/deved/build-apps-with-google-ai-studio?bb=238783)

This track will guide you through Google AI Studio's new "Build apps with Gemini" feature, where you can turn a simple text prompt into a fully functional, deployed web application in minutes.

[Read more →](https://dev.to/deved/build-apps-with-google-ai-studio?bb=238783)

[![](https://media2.dev.to/dynamic/image/width=90,height=90,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fuser%2Fprofile_image%2F3116261%2F7660d70c-7d62-47b0-b862-83d53e492293.png)\\
Vishwark](https://dev.to/vishwark)

Follow

Senior software engineer @Kuvera


- Joined


May 2, 2025


### More from [Vishwark](https://dev.to/vishwark)

[The Senior Engineer’s Guide to Frontend CI/CD Architecture\\
\\
#cicd#frontend#gitlab#jenkins](https://dev.to/vishwark/the-senior-engineers-guide-to-frontend-cicd-architecture-3b47) [🚀 Realtime Communication in Frontend (Polling vs WebSocket vs SSE)\\
\\
#webdev#webocket#sse#frontend](https://dev.to/vishwark/realtime-communication-in-frontend-polling-vs-websocket-vs-sse-566l) [🚀 Frontend Form Validation Made Simple (React Hook Form + Zod)\\
\\
#webdev#formvalidation#react#schemavalidation](https://dev.to/vishwark/frontend-form-validation-made-simple-react-hook-form-zod-3m9j)

[![profile](https://media2.dev.to/dynamic/image/width=64,height=64,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Forganization%2Fprofile_image%2F140%2F9639a040-3c27-4b99-b65a-85e100016d3c.png)\\
MongoDB](https://dev.to/mongodb) Promoted

Dropdown menu

- [What's a billboard?](https://dev.to/billboards)
- [Manage preferences](https://dev.to/settings/customization#sponsors)

* * *

- [Report billboard](https://dev.to/report-abuse?billboard=238071)

[![Build gen AI apps that run anywhere with MongoDB Atlas](https://media2.dev.to/dynamic/image/width=350%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fi.imgur.com%2FUi4OKnX.png)](https://www.mongodb.com/cloud/atlas/lp/try3?utm_campaign=display_devto-webdev_pl_flighted_atlas_tryatlaslp_prosp_gic-null_ww-all_dev_dv-all_eng_leadgen&utm_source=devto&utm_medium=display&utm_content=aipowered-v1&bb=238071)

## [Build gen AI apps that run anywhere with MongoDB Atlas](https://www.mongodb.com/cloud/atlas/lp/try3?utm_campaign=display_devto-webdev_pl_flighted_atlas_tryatlaslp_prosp_gic-null_ww-all_dev_dv-all_eng_leadgen&utm_source=devto&utm_medium=display&utm_content=aipowered-v1&bb=238071)

MongoDB Atlas bundles vector search and a flexible document model so developers can build, scale, and run gen AI apps without juggling multiple databases. From LLM to semantic search, Atlas streamlines AI architecture. Start free today.

[Start Free](https://www.mongodb.com/cloud/atlas/lp/try3?utm_campaign=display_devto-webdev_pl_flighted_atlas_tryatlaslp_prosp_gic-null_ww-all_dev_dv-all_eng_leadgen&utm_source=devto&utm_medium=display&utm_content=aipowered-v1&bb=238071)

👋 Kindness is contagious

Dropdown menu

- [What's a billboard?](https://dev.to/billboards)
- [Manage preferences](https://dev.to/settings/customization#sponsors)

* * *

- [Report billboard](https://dev.to/report-abuse?billboard=236603)

x

Sign in to DEV to enjoy its full potential—unlock a **customized** interface with dark mode, personal reading preferences, and more.

## [Okay](https://dev.to/enter?state=new-user&bb=236603)

💎 DEV Diamond Sponsors


Thank you to our Diamond Sponsors for supporting the DEV Community


[![Google AI - Official AI Model and Platform Partner](https://media2.dev.to/dynamic/image/width=880%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fxjlyhbdqehj3akhz166w.png)](https://aistudio.google.com/?utm_source=partner&utm_medium=partner&utm_campaign=FY25-Global-DEVpartnership-sponsorship-AIS&utm_content=-&utm_term=-&bb=146443)

Google AI is the official AI Model and Platform Partner of DEV

[![Neon - Official Database Partner](https://media2.dev.to/dynamic/image/width=880%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fbnl88cil6afxzmgwrgtt.png)](https://neon.tech/?ref=devto&bb=146443)

Neon is the official database partner of DEV

[![Algolia - Official Search Partner](https://media2.dev.to/dynamic/image/width=880%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fv30ephnolfvnlwgwm0yz.png)](https://www.algolia.com/developers/?utm_source=devto&utm_medium=referral&bb=146443)

Algolia is the official search partner of DEV

[DEV Community](https://dev.to/) — A space to discuss and keep up software development and manage your software career


- [Home](https://dev.to/)
- [DEV++](https://dev.to/++)
- [Videos](https://dev.to/videos)
- [DEV Education Tracks](https://dev.to/deved)
- [DEV Challenges](https://dev.to/challenges)
- [DEV Help](https://dev.to/help)
- [Advertise on DEV](https://dev.to/advertise)
- [Organization Accounts](https://dev.to/organizations)
- [DEV Showcase](https://dev.to/showcase)
- [About](https://dev.to/about)
- [Contact](https://dev.to/contact)
- [Free Postgres Database](https://dev.to/free-postgres-database-tier)
- [Forem Shop](https://shop.forem.com/)
- [MLH](https://mlh.io/)

- [Code of Conduct](https://dev.to/code-of-conduct)
- [Privacy Policy](https://dev.to/privacy)
- [Terms of Use](https://dev.to/terms)

Built on [Forem](https://www.forem.com/) — the [open source](https://dev.to/t/opensource) software that powers [DEV](https://dev.to/) and other inclusive communities.

Made with love and [Ruby on Rails](https://dev.to/t/rails). DEV Community © 2016 - 2026.

![DEV Community](https://media2.dev.to/dynamic/image/width=190,height=,fit=scale-down,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F8j7kvp660rqzt99zui8e.png)

We're a place where coders share, stay up-to-date and grow their careers.


[Log in](https://dev.to/enter?signup_subforem=1) [Create account](https://dev.to/enter?signup_subforem=1&state=new-user)

![](https://assets.dev.to/assets/sparkle-heart-5f9bee3767e18deb1bb725290cb151c25234768a0e9a2bd39370c382d02920cf.svg)![](https://assets.dev.to/assets/multi-unicorn-b44d6f8c23cdd00964192bedc38af3e82463978aa611b4365bd33a0f1f4f3e97.svg)![](https://assets.dev.to/assets/exploding-head-daceb38d627e6ae9b730f36a1e390fca556a4289d5a41abb2c35068ad3e2c4b5.svg)![](https://assets.dev.to/assets/raised-hands-74b2099fd66a39f2d7eed9305ee0f4553df0eb7b4f11b01b6b1b499973048fe5.svg)![](https://assets.dev.to/assets/fire-f60e7a582391810302117f987b22a8ef04a2fe0df7e3258a5f49332df1cec71e.svg)