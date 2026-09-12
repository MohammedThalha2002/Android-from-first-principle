---
title: "Android Internals"
navTitle: "Internals"
tagline: "From the power button to a pixel on the screen."
summary: "Six chapters that explain what Android is doing underneath the APIs you already use, for an engineer about a year in. No device required."
group: "android"
status: "available"
planned:
  chapters: 6
  lessons: 31
---

You already build screens. You write Compose, you collect a `Flow`, you ship.
Then something happens that the documentation does not explain: a value is
empty when the user comes back, a release build crashes where debug did not, a
list stutters on a cheap phone. The answer is never in the API you were using.
It is one layer below it.

This course walks that layer once, in order, from the moment the phone powers
on to the moment your app's pixels reach the screen.

## Who it is for

An Android engineer about a year in. You write Kotlin and Compose daily. You
have typed `adb` when a tutorial told you to. You have never read the Android
source, and you have never needed to.

You do not need a device plugged in to read any of it. Every lesson has one
optional section where you can confirm the mechanism on a phone if you have one
in front of you, and the lesson works without it.

## What you can do at the end

Narrate what happens between the power button and your app's first frame, and
say which part of the system is responsible for each step. More usefully: when
something strange happens in your app, know which layer to suspect.

Concretely, you will be able to explain why a static resets while the screen
survives, why the first launch after install is the slowest, what a
`TransactionTooLargeException` really means, and which thread dropped a frame.

## The thread running through it

Your app is a guest. It does not own its process, its thread, its window or
its frame. Every layer below it makes decisions on your behalf, and every one
of those decisions can be explained.

Four facts the course keeps coming back to:

```text
the app does not own its process
the UI is one thread driven by a clock
every app is a separate Linux user
the device is short of memory, and acts on it
```

## What this course is not

It is not about building Android itself, writing a custom ROM, or kernel work.
It does not teach the Activity lifecycle in depth, Compose internals beyond an
overview, or performance tuning; those are courses of their own. It is not a
Kotlin course.

## How each lesson is built

One idea, fifteen to thirty minutes. It opens with a question you have
probably had and the answer most developers give, which is usually wrong. Then
the mechanism, then the same mechanism in the Kotlin you write, then the
symptoms it causes in real apps.

Every lesson ends with a one-screen summary built to be copied into your notes,
and five to eight interview questions with model answers, because being able to
say a thing out loud is a different skill from recognising it.
