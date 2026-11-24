---
title: Etonia Privacy Policy
---

# Etonia Privacy Policy

Last updated: 17 November 2026

Etonia is a handwriting notes and study app made by Mu-En Lee ("we"). This policy
explains what Etonia collects, why, and what stays on your device.

## Your notes stay yours

Your notes, drawings, PDFs, images, audio recordings, Study Desk chats, practice
flashcards, and test papers are stored on your device. We do not upload them to
our servers and we have no database of note content.

If you turn on **Google Drive backup**, Etonia copies your notes—along with your
Study Desk chats and classes, AI preferences, and handwriting calibration—into
your own Google Drive using the permission you grant. They are stored under your
Google account, not ours. You can turn backup off and delete those files at any
time.

On Apple devices you can choose **iCloud backup** instead. Etonia then copies
your notes and synced study settings into the app's private storage in your own
iCloud account, under the terms of your agreement with Apple. We have no access
to them. You can turn automatic backup off, and delete them under iCloud storage
in Settings.

If you choose a backup destination, Etonia backs up automatically when you leave
a note you have edited, and after the app has hit an unexpected error or closed
unexpectedly.

Importing from Goodnotes needs Google sign-in, even if you back up to iCloud.

## Account

You can write notes without signing in. Even then, the app registers a random
ID created for that installation (not a hardware ID) with our account service
(Supabase), so it knows you are on the free plan.

To use the AI assistant, Study Desk AI, or a subscription, you sign in with
Google or, on iPhone and iPad, with Apple. Our account service then also keeps:

- the email address of the account you signed in with (with Sign in with Apple,
  this can be a private relay address) and an account ID,
- the random installation ID associated with your account and whether that
  device or account has claimed the one-time 2-week free trial,
- your plan, its renewal and expiry dates, any gift code credit, and your AI
  token allowance balance.

Sign-in sessions are kept in your device's secure storage (Keychain on iOS).

## The AI assistant, Study Desk, and Practice Studio

What Etonia sends depends on the feature you use, and never includes your whole
library:

- **In the note editor:** Etonia sends your question, recent turns of that
  conversation, an image of only the part of the page you selected, and—for
  drawn answers or stroke citations—the selected strokes in page coordinates
  along with the page size and selection bounds. The whole note is never sent.
- **In the Study Desk:** Etonia retrieves only the relevant note or PDF excerpts
  and page crops needed for your question or practice items. When you use a
  larger model, Etonia may first use a fast vision model (Haiku or Luna) to
  turn a retrieved note crop into a text description before sending that
  description to the larger model. Descriptions are kept briefly in device
  memory only and are never saved on our servers.
- **In Practice Studio test grading:** When you submit a handwritten test paper
  for grading, Etonia sends the question, rubric or model answer, and a crop of
  your handwritten work for that item.
- **Auto routing:** When Auto model selection is used, our server runs a
  stateless routing check using your plan, enabled models, and request metadata
  to choose the model and reasoning effort.

Requests pass through our server (Supabase Edge Functions) in memory to the
selected AI provider: Anthropic (Claude Haiku, Sonnet, Opus), OpenAI (Luna,
Sol, Astra — with `store: false` enabled), or Google (Gemini Flash, Argon). Our
server does not store or log prompts, images, strokes, answers, or
conversations. Each provider handles the request under its own terms and
privacy policy.

We record only how much AI you used—the model, task category, reasoning effort,
numeric token counts, and cost—to keep your token allowance accurate, never what
you asked, wrote, or received.

## Smarter search in the Study Desk

So that the Study Desk can find the right pages by meaning as well as by words,
Etonia turns the notes and PDFs you have put on the desk into numbers (called
embeddings). To do that it sends text chunks and image crops of diagrams or
marked work (such as crosses, ticks, or circled steps) to Google's embedding
service through our server, up to sixteen chunks at a time. This happens once
per chunk, and again only when that chunk changes. It covers only the material
on your Study Desk, not your whole library, and you can turn it off—in which
case the Study Desk searches by words on your device alone.

Our server does not store or log what is sent or the numbers that come back.
The numbers are kept only on your device next to your notes and are deleted with
them. Embeddings count against your AI token allowance like other AI use, and we
record only their count and cost.

## Purchases

Subscriptions are sold and billed by Apple (on iOS and iPadOS) or Google Play
(on Android). We do not see your payment details. We receive and verify the
store's record of your purchase—storing an encrypted purchase token linked to
your account ID—so your plan and AI token allowance apply to your account and
renewals stay in sync.

## Usage statistics and website waitlist

Etonia sends a short, fixed list of categorical product events (such as opening
the app, signing in, creating, importing, or exporting a note, viewing plans,
starting a purchase, or enabling backup) linked to your install ID or account
ID. They never contain note titles, file names, note content, prompts, answers,
or images. We use them to understand which features are used and to keep the
service working.

If you enter your email address in the waitlist form on our website, we store
your email address and signup source to notify you about Etonia access and
launch updates.

We do not use advertising, tracking across other apps or websites, or data
brokers, and we do not sell your data.

## Microphone, camera, and photos

Etonia asks for the microphone to record audio synced with your notes and for
voice input, for speech recognition to turn spoken questions—and recordings you
choose to transcribe—into text, and for the camera and photo library to place
pictures in a note or import test papers. Recordings, transcripts, and pictures
stay in your notes on your device. Speech recognition is handled by your
device's speech service (such as Apple's on iPhone and iPad), on-device where
supported; otherwise that service may process the audio on its own servers
under its own privacy policy.

## Keeping and deleting data

Account, plan, token allowance, and usage records are kept while your account
exists. To delete your account, open **Account**, then **Profile**, and tap
**Delete account**. This deletes your account and its plan, trial, token, and
analytics records at once, and revokes Sign in with Apple if you used it. It does
not cancel an App Store or Google Play subscription; cancel that in your Apple
or Google Play account settings. Uninstalling the app removes the notes stored
on that device.

If you joined the website waitlist and want your email removed, write to
[limuen.allen@gmail.com](mailto:limuen.allen@gmail.com).

## Children

Etonia is not directed at children under 13, and we do not knowingly collect
data from them.

## Changes

We will update this page when these practices change and change the date above.

## Contact

Mu-En Lee — [limuen.allen@gmail.com](mailto:limuen.allen@gmail.com)

[Support](/support/) · [Terms of Use](/terms/)
