[Sitemap](https://medium.com/sitemap/sitemap.xml)

[Open in app](https://play.google.com/store/apps/details?id=com.medium.reader&referrer=utm_source%3DmobileNavBar&source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](https://medium.com/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2F%40salvinodsa%2Foptimizing-react-builds-with-vite-practical-techniques-for-faster-apps-063d4952e67d&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](https://medium.com/?source=post_page---top_nav_layout_nav-----------------------------------------)

Get app

[Write](https://medium.com/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[Search](https://medium.com/search?source=post_page---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](https://medium.com/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2F%40salvinodsa%2Foptimizing-react-builds-with-vite-practical-techniques-for-faster-apps-063d4952e67d&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![](https://miro.medium.com/v2/resize:fill:32:32/1*dmbNkD5D-u45r44go_cf0g.png)

Member-only story

# **Optimizing React Builds with Vite: Practical Techniques for Faster Apps**

[![General Zod](https://miro.medium.com/v2/resize:fill:32:32/1*e6d1VUbJmo5o6lmJU2EDIw.jpeg)](https://medium.com/@salvinodsa?source=post_page---byline--063d4952e67d---------------------------------------)

[General Zod](https://medium.com/@salvinodsa?source=post_page---byline--063d4952e67d---------------------------------------)

Follow

6 min read

·

Feb 1, 2026

9

[Listen](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2Fplans%3Fdimension%3Dpost_audio_button%26postId%3D063d4952e67d&operation=register&redirect=https%3A%2F%2Fmedium.com%2F%40salvinodsa%2Foptimizing-react-builds-with-vite-practical-techniques-for-faster-apps-063d4952e67d&source=---header_actions--063d4952e67d---------------------post_audio_button------------------)

Share

## Introduction

Modern React applications are powerful — but without the right optimizations, they can easily become bloated, slow to load, and expensive to run at scale. While Vite already gives us a fast development experience out of the box, **production performance still depends heavily on how we configure, analyze, and optimize our builds**.

In this article, we’ll walk through **practical and battle-tested techniques** to optimize React applications built with Vite. From analyzing bundle size and enabling smarter code splitting, to leveraging the React Compiler and virtualizing long lists — this guide focuses on **real-world improvements you can apply today**.

Whether you’re working on a startup MVP or a large-scale production app, these optimizations will help you ship **leaner bundles, faster load times, and smoother user experiences**.

## Optimizing React Builds Using Vite

### **1\. Install Vite Bundle Analyzer**

Before optimizing anything, you need **clear visibility into your bundle**. Optimizing blindly often leads to wasted effort or premature changes that don’t actually move the needle.

This is where `vite-bundle-analyzer` comes in.

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:700/0*15IAxhgDdv-Chu4O)

Vite Bundle Analyzer

**It helps you understand:**

- What exactly ends up in your production bundle
- Which dependencies contribute the most to bundle size
- Whether code splitting is actually working as expected

Use the following npm command to install the vite-bundle-analyzer:

```
$ npm i -D vite-bundle-analyzer
```

Next, just update your `vite.config.ts`:

```
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { analyzer } from 'vite-bundle-analyzer'; // Import the analyzer

export default defineConfig({
  plugins: [\
    react(),\
\
    // setup the analyzer\
    analyzer({\
      analyzerMode: 'static',\
      openAnalyzer: true,\
    }),\
  ],
});
```

Now run:

```
$ npm run build
```

## Create an account to read the full story.

The author made this story available to Medium members only.

If you’re new to Medium, create a new account to read this story on us.

[Continue in app](https://play.google.com/store/apps/details?id=com.medium.reader&referrer=utm_source%3Dregwall&source=-----063d4952e67d---------------------post_regwall------------------)

Or, continue in mobile web

[Sign up with Google](https://medium.com/m/connect/google?state=google-%7Chttps%3A%2F%2Fmedium.com%2F%40salvinodsa%2Foptimizing-react-builds-with-vite-practical-techniques-for-faster-apps-063d4952e67d%3Fsource%3D-----063d4952e67d---------------------post_regwall------------------%26skipOnboarding%3D1%7Cregister%7Cremember_me&source=-----063d4952e67d---------------------post_regwall------------------)

[Sign up with Facebook](https://medium.com/m/connect/facebook?state=facebook-%7Chttps%3A%2F%2Fmedium.com%2F%40salvinodsa%2Foptimizing-react-builds-with-vite-practical-techniques-for-faster-apps-063d4952e67d%3Fsource%3D-----063d4952e67d---------------------post_regwall------------------%26skipOnboarding%3D1%7Cregister%7Cremember_me&source=-----063d4952e67d---------------------post_regwall------------------)

Sign up with email

Already have an account? [Sign in](https://medium.com/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2F%40salvinodsa%2Foptimizing-react-builds-with-vite-practical-techniques-for-faster-apps-063d4952e67d&source=-----063d4952e67d---------------------post_regwall------------------)

9

9

[![General Zod](https://miro.medium.com/v2/resize:fill:48:48/1*e6d1VUbJmo5o6lmJU2EDIw.jpeg)](https://medium.com/@salvinodsa?source=post_page---post_author_info--063d4952e67d---------------------------------------)

[![General Zod](https://miro.medium.com/v2/resize:fill:64:64/1*e6d1VUbJmo5o6lmJU2EDIw.jpeg)](https://medium.com/@salvinodsa?source=post_page---post_author_info--063d4952e67d---------------------------------------)

Follow

[**Written by General Zod**](https://medium.com/@salvinodsa?source=post_page---post_author_info--063d4952e67d---------------------------------------)

[8 followers](https://medium.com/@salvinodsa/followers?source=post_page---post_author_info--063d4952e67d---------------------------------------)

· [5 following](https://medium.com/@salvinodsa/following?source=post_page---post_author_info--063d4952e67d---------------------------------------)

Follow

## No responses yet

![](https://miro.medium.com/v2/resize:fill:32:32/1*dmbNkD5D-u45r44go_cf0g.png)

Write a response

[What are your thoughts?](https://medium.com/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2F%40salvinodsa%2Foptimizing-react-builds-with-vite-practical-techniques-for-faster-apps-063d4952e67d&source=---post_responses--063d4952e67d---------------------respond_sidebar------------------)

Cancel

Respond

## More from General Zod

![Importing Massive CSV datasets in NestJS using TypeORM & Readable Streams](https://miro.medium.com/v2/resize:fit:679/format:webp/0*RU5t5e57-EDnNd24.png)

[![General Zod](https://miro.medium.com/v2/resize:fill:20:20/1*e6d1VUbJmo5o6lmJU2EDIw.jpeg)](https://medium.com/@salvinodsa?source=post_page---author_recirc--063d4952e67d----0---------------------dfc4058a_85df_42c1_b55b_bd8d618f620f--------------)

[General Zod](https://medium.com/@salvinodsa?source=post_page---author_recirc--063d4952e67d----0---------------------dfc4058a_85df_42c1_b55b_bd8d618f620f--------------)

[**Importing Massive CSV datasets in NestJS using TypeORM & Readable Streams**\\
\\
**When dealing with large-scale datasets, particularly CSV files, many traditional CSV parsers can pose significant challenges. A common…**](https://medium.com/@salvinodsa/importing-massive-csv-datasets-in-nestjs-using-typeorm-readable-streams-05c64919abad?source=post_page---author_recirc--063d4952e67d----0---------------------dfc4058a_85df_42c1_b55b_bd8d618f620f--------------)

Sep 12, 2024

[A clap icon67](https://medium.com/@salvinodsa/importing-massive-csv-datasets-in-nestjs-using-typeorm-readable-streams-05c64919abad?source=post_page---author_recirc--063d4952e67d----0---------------------dfc4058a_85df_42c1_b55b_bd8d618f620f--------------)

![TypeORM to MikroORM: My Journey Through the Migration Process](https://miro.medium.com/v2/resize:fit:679/format:webp/0*-_LPrHIIVdW7GOBa)

[![General Zod](https://miro.medium.com/v2/resize:fill:20:20/1*e6d1VUbJmo5o6lmJU2EDIw.jpeg)](https://medium.com/@salvinodsa?source=post_page---author_recirc--063d4952e67d----1---------------------dfc4058a_85df_42c1_b55b_bd8d618f620f--------------)

[General Zod](https://medium.com/@salvinodsa?source=post_page---author_recirc--063d4952e67d----1---------------------dfc4058a_85df_42c1_b55b_bd8d618f620f--------------)

[**TypeORM to MikroORM: My Journey Through the Migration Process**\\
\\
**Migrating from TypeORM to MikroORM was a challenging yet rewarding experience — here’s a look at my journey and the lessons learned.**](https://medium.com/@salvinodsa/typeorm-to-mikroorm-my-journey-through-the-migration-process-3d7b57a9c481?source=post_page---author_recirc--063d4952e67d----1---------------------dfc4058a_85df_42c1_b55b_bd8d618f620f--------------)

Feb 22, 2025

![Automated Changelogs in NestJS using Conventional Commits & GitHub Actions](https://miro.medium.com/v2/resize:fit:679/format:webp/1*Kw5VIjDp9i2J8XAyCOkg0g.png)

[![General Zod](https://miro.medium.com/v2/resize:fill:20:20/1*e6d1VUbJmo5o6lmJU2EDIw.jpeg)](https://medium.com/@salvinodsa?source=post_page---author_recirc--063d4952e67d----2---------------------dfc4058a_85df_42c1_b55b_bd8d618f620f--------------)

[General Zod](https://medium.com/@salvinodsa?source=post_page---author_recirc--063d4952e67d----2---------------------dfc4058a_85df_42c1_b55b_bd8d618f620f--------------)

[**Automated Changelogs in NestJS using Conventional Commits & GitHub Actions**\\
\\
**Master Code Change Tracking via automated Changelog Generation using Semantic Versioning, Conventional Commits, and GitHub Workflows in…**](https://medium.com/@salvinodsa/automated-changelogs-in-nestjs-using-conventional-commits-github-actions-61e93f6268f8?source=post_page---author_recirc--063d4952e67d----2---------------------dfc4058a_85df_42c1_b55b_bd8d618f620f--------------)

Nov 16, 2024

[A clap icon3](https://medium.com/@salvinodsa/automated-changelogs-in-nestjs-using-conventional-commits-github-actions-61e93f6268f8?source=post_page---author_recirc--063d4952e67d----2---------------------dfc4058a_85df_42c1_b55b_bd8d618f620f--------------)

[See all from General Zod](https://medium.com/@salvinodsa?source=post_page---author_recirc--063d4952e67d---------------------------------------)

## Recommended from Medium

![Claude Code Ultraplan Launched: I Just Tested It (And It’s Better Than It Looks)](https://miro.medium.com/v2/resize:fit:679/format:webp/1*W5hbs5lyrNhL9Jzij7k4xg.png)

[![Joe Njenga](https://miro.medium.com/v2/resize:fill:20:20/1*0Hoc7r7_ybnOvk1t8yR3_A.jpeg)](https://medium.com/@joe.njenga?source=post_page---read_next_recirc--063d4952e67d----0---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[Joe Njenga](https://medium.com/@joe.njenga?source=post_page---read_next_recirc--063d4952e67d----0---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[**Claude Code Ultraplan Launched: I Just Tested It (And It’s Better Than It Looks)**\\
\\
**Anthropic has added Claude Code ultraplan, and I was quick to test it. You might like it or hate it for one reason — I’ll talk about that…**](https://medium.com/@joe.njenga/claude-code-ultraplan-launched-i-just-tested-it-and-its-better-than-it-looks-21a628332e97?source=post_page---read_next_recirc--063d4952e67d----0---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

Apr 4

[A clap icon757\\
\\
A response icon24](https://medium.com/@joe.njenga/claude-code-ultraplan-launched-i-just-tested-it-and-its-better-than-it-looks-21a628332e97?source=post_page---read_next_recirc--063d4952e67d----0---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

![Vibe Coding is Over illustration of three ai generated landing pages with the words IT’S OVER written at the top in large text](https://miro.medium.com/v2/resize:fit:679/format:webp/1*1OGKfKCooEZbKCSoSXXY8g.png)

[![Michal Malewicz](https://miro.medium.com/v2/resize:fill:20:20/1*149zXrb2FXvS_mctL4NKSg.png)](https://medium.com/@michalmalewicz?source=post_page---read_next_recirc--063d4952e67d----1---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[Michal Malewicz](https://medium.com/@michalmalewicz?source=post_page---read_next_recirc--063d4952e67d----1---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[**Vibe Coding is OVER.**\\
\\
**Here’s What Comes Next.**](https://medium.com/@michalmalewicz/vibe-coding-is-over-5a84da799e0d?source=post_page---read_next_recirc--063d4952e67d----1---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

Mar 24

[A clap icon5.5K\\
\\
A response icon203](https://medium.com/@michalmalewicz/vibe-coding-is-over-5a84da799e0d?source=post_page---read_next_recirc--063d4952e67d----1---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

![Building a Scalable Next.js Frontend: Why I Chose shadcn/ui, Zustand, and Zod](https://miro.medium.com/v2/resize:fit:679/format:webp/1*Fak6t55St1tKLyS1tqJ06g.png)

[![Sandy Zhang](https://miro.medium.com/v2/resize:fill:20:20/1*uBDb0zLTl8ld1MnpjPxIUA.jpeg)](https://medium.com/@srachel27?source=post_page---read_next_recirc--063d4952e67d----0---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[Sandy Zhang](https://medium.com/@srachel27?source=post_page---read_next_recirc--063d4952e67d----0---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[**Building a Scalable Next.js Frontend: Why I Chose shadcn/ui, Zustand, and Zod**\\
\\
**In my previous post, I talked about structuring a Next.js app using a layered approach: Domains + Features + Core.**](https://medium.com/@srachel27/building-a-scalable-next-js-frontend-why-i-chose-shadcn-ui-zustand-and-zod-c8ebfecb6b49?source=post_page---read_next_recirc--063d4952e67d----0---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

Mar 19

[A clap icon6\\
\\
A response icon1](https://medium.com/@srachel27/building-a-scalable-next-js-frontend-why-i-chose-shadcn-ui-zustand-and-zod-c8ebfecb6b49?source=post_page---read_next_recirc--063d4952e67d----0---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

![React Hooks Are Getting a Major Upgrade — Here’s What Every Developer Needs to Know in 2026](https://miro.medium.com/v2/resize:fit:679/format:webp/1*gdT-A2oHJY8UirkT488Ejw.png)

[![Kevin - MERN Stack Developer](https://miro.medium.com/v2/resize:fill:20:20/1*aUGBohBB1VAnsoGAdjEZoQ.png)](https://medium.com/@mernstackdevbykevin?source=post_page---read_next_recirc--063d4952e67d----1---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[Kevin - MERN Stack Developer](https://medium.com/@mernstackdevbykevin?source=post_page---read_next_recirc--063d4952e67d----1---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[**React Hooks Are Getting a Major Upgrade — Here’s What Every Developer Needs to Know in 2026**\\
\\
**The rules of React development just changed. Again. And this time, the shift is bigger than you think.**](https://medium.com/@mernstackdevbykevin/react-hooks-are-getting-a-major-upgrade-heres-what-every-developer-needs-to-know-in-2026-9f2a14158793?source=post_page---read_next_recirc--063d4952e67d----1---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

Apr 2

[A clap icon129\\
\\
A response icon3](https://medium.com/@mernstackdevbykevin/react-hooks-are-getting-a-major-upgrade-heres-what-every-developer-needs-to-know-in-2026-9f2a14158793?source=post_page---read_next_recirc--063d4952e67d----1---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

![JavaScript Event Loop Explained Simply (With Diagram)](https://miro.medium.com/v2/resize:fit:679/format:webp/1*Kisz1tFe7kjc1c6GwolWBQ.jpeg)

[![SHASHI BHUSHAN KUMAR](https://miro.medium.com/v2/resize:fill:20:20/1*TzIdT5-0Q8amHg5GNHzOBw.jpeg)](https://medium.com/@maibhushan?source=post_page---read_next_recirc--063d4952e67d----2---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[SHASHI BHUSHAN KUMAR](https://medium.com/@maibhushan?source=post_page---read_next_recirc--063d4952e67d----2---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[**JavaScript Event Loop Explained Simply (With Diagram)**\\
\\
**Understanding JavaScript Event Loop (With Simple Explanation + Diagram)**](https://medium.com/@maibhushan/javascript-event-loop-explained-simply-with-diagram-d695ba37bc27?source=post_page---read_next_recirc--063d4952e67d----2---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

Apr 6

[A clap icon1](https://medium.com/@maibhushan/javascript-event-loop-explained-simply-with-diagram-d695ba37bc27?source=post_page---read_next_recirc--063d4952e67d----2---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

![I Built a Matching Engine — and It Completely Changed How I Think About Backend Systems](https://miro.medium.com/v2/resize:fit:679/format:webp/1*w7ns1Y50EJVAIzCFAWDDeg.png)

[![Mehdi Shariati](https://miro.medium.com/v2/resize:fill:20:20/1*fmxANyrt6bf2JZb-uU6K8Q.jpeg)](https://medium.com/@mehdishariati?source=post_page---read_next_recirc--063d4952e67d----3---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[Mehdi Shariati](https://medium.com/@mehdishariati?source=post_page---read_next_recirc--063d4952e67d----3---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[**I Built a Matching Engine — and It Completely Changed How I Think About Backend Systems**\\
\\
**Most backend systems are easy to reason about.**](https://medium.com/@mehdishariati/i-built-a-matching-engine-and-it-completely-changed-how-i-think-about-backend-systems-36d64d6a4d49?source=post_page---read_next_recirc--063d4952e67d----3---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

Apr 6

[A clap icon8\\
\\
A response icon1](https://medium.com/@mehdishariati/i-built-a-matching-engine-and-it-completely-changed-how-i-think-about-backend-systems-36d64d6a4d49?source=post_page---read_next_recirc--063d4952e67d----3---------------------adafc53f_0e10_43b0_84d5_bb6babd6faee--------------)

[See more recommendations](https://medium.com/?source=post_page---read_next_recirc--063d4952e67d---------------------------------------)

[Help](https://help.medium.com/hc/en-us?source=post_page-----063d4952e67d---------------------------------------)

[Status](https://status.medium.com/?source=post_page-----063d4952e67d---------------------------------------)

[About](https://medium.com/about?autoplay=1&source=post_page-----063d4952e67d---------------------------------------)

[Careers](https://medium.com/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----063d4952e67d---------------------------------------)

[Press](mailto:pressinquiries@medium.com)

[Blog](https://blog.medium.com/?source=post_page-----063d4952e67d---------------------------------------)

[Privacy](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----063d4952e67d---------------------------------------)

[Rules](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----063d4952e67d---------------------------------------)

[Terms](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----063d4952e67d---------------------------------------)

[Text to speech](https://speechify.com/medium?source=post_page-----063d4952e67d---------------------------------------)

reCAPTCHA

Recaptcha requires verification.

protected by **reCAPTCHA**