---
title: "The Linux underneath your app"
navTitle: "The process"
proves: "Your app is a process with an invented address space, several threads, a handful of cores to share, one door to the outside world, a parent it was copied from, and a signal that ends it."
---

Android is Linux underneath. That sentence gets repeated until it stops meaning
anything, so this chapter makes it concrete: seven mechanisms you can point at,
in the order they build on each other.

Your app is a **process**, and the process is not your app. Its memory is an
**address space** the kernel invented, which is what isolation actually is. It
has several **threads** and you created none of them. They share a small number
of **cores**, and who runs is decided by the kernel. Anything outside its own
memory needs a **system call**, which is the only door. The process itself was
**copied** from a parent rather than built. And when the system is finished
with it, a **signal** ends it and none of your code runs.

Read them in order. Each one is used by the next, and the last two are only
explainable because of the second.

Nothing here needs a device. Each lesson has an optional section at the end if
you want to watch it happen on a phone.

## The round

Ten questions that mix the seven lessons. Four of them need two lessons to
answer, which is what an interview does. Say each answer out loud before you
open it.

**1.** A user leaves your app, comes back twenty minutes later, and the screen
is exactly as they left it, but a value you set at login is null. What happened?

<details>
<summary>Model answer</summary>

**Hit these points**

- The system reclaimed the process while the app was in the background.
- Everything in memory went with it, including any singleton.
- The screen came back because the system had saved a description of it outside
  the process.
- A new process was created on return, with new memory and nothing set.

**A weak answer** says the app restarted, which describes what the user saw and
not what the machine did.
</details>

**2.** What is process isolation actually made of?

<details>
<summary>Model answer</summary>

**Hit these points**

- Every process has its own page table, written by the kernel.
- Every address the app uses is virtual and is translated through that table on
  every access.
- The table has no entry reaching another process's memory.
- So it is not that access is refused. There is no address that would express
  the request.

**A weak answer** describes a permission check, which implies a request that
could be made and denied.
</details>

**3.** Two threads in one process. What do they share, and what is private?

<details>
<summary>Model answer</summary>

**Hit these points**

- They share the address space, so the same objects at the same addresses.
- Each has its own stack, holding its locals and its call chain.
- That is why a stack trace belongs to exactly one thread.
- Sharing the heap is what makes coordination cheap and mistakes easy.

**A weak answer** says threads run in parallel and stops there.
</details>

**4.** A phone has eight cores. How many threads are running at this instant,
across the whole device?

<details>
<summary>Model answer</summary>

**Hit these points**

- Eight, one per core.
- Every other ready thread on the device is waiting for a turn.
- The scheduler keeps one list of ready threads from every process and picks.
- Anything that looks like more is switching fast enough to be invisible.

**A weak answer** answers per app, which misses that the budget is shared by
everything running.
</details>

**5.** Your app has no permissions at all. What stops its code reading the
storage chip directly?

<details>
<summary>Model answer</summary>

**Hit these points**

- The processor runs app code in user mode, where those instructions and that
  memory do not work.
- The only way out is a system call, which switches modes at an address the
  kernel chose.
- The kernel then checks which Linux user is asking before doing anything.
- Permissions are code, and code that could be bypassed would protect nothing.

**A weak answer** credits the permission system, which sits above this and
depends on it.
</details>

**6.** Needs two lessons. Walk me through copy-on-write.

<details>
<summary>Model answer</summary>

**Hit these points**

- A fork gives the child its own page table whose entries point at the parent's
  physical pages.
- Every one of those entries is marked read-only in both tables.
- A write hits the mark and traps into the kernel.
- The kernel copies that one page, repoints the writer's entry and makes it
  writable.
- Everything nobody writes stays shared for the life of the processes.

**A weak answer** says memory is copied when it changes, without the table or
the trap, which is naming the behaviour rather than explaining it.
</details>

**7.** Needs two lessons. Why does switching between two processes cost more
than switching between two threads?

<details>
<summary>Model answer</summary>

**Hit these points**

- Either way the kernel saves and restores registers, the program counter and
  the stack pointer.
- Two threads in one process share an address space, so the page table is
  untouched.
- Two threads in different processes need the page table swapped as well.
- The processor's cached address translations stop being useful, so the first
  accesses afterwards are slower.

**A weak answer** says processes are heavier without naming the page table,
which is the entire difference.
</details>

**8.** Needs two lessons. Coroutines run on threads. So why is a coroutine
lighter than a thread?

<details>
<summary>Model answer</summary>

**Hit these points**

- A thread is an operating system object: it reserves a stack and joins the
  scheduler's list.
- A coroutine is an object on the heap, and the scheduler has never heard of
  it.
- When it suspends, its state stays in that object and it holds no thread at
  all.
- A dispatcher runs many of them over a small pool of real threads, and the
  kernel only ever sees the pool.

**A weak answer** says coroutines are not threads, which is true and is not the
mechanism.
</details>

**9.** Needs two lessons. Your crash-free rate is 99.9 percent and users lose
data daily. Reconcile those.

<details>
<summary>Model answer</summary>

**Hit these points**

- Process death is not a crash: no exception is thrown, so nothing reaches the
  crash reporter.
- The data was in memory, and memory goes with the process.
- The signal that ends it cannot be caught, so no cleanup code runs either.
- To see any of it you have to read the system's record of why recent processes
  ended, and report it yourself.

**A weak answer** doubts the crash reporter, which is right about what it
measures and measuring a different thing.
</details>

**10.** A teammate says "Android kills apps at random, there's nothing we can
do". Correct them.

<details>
<summary>Model answer</summary>

**Hit these points**

- It is not random. The system ranks processes by how much the user would
  notice losing them, and reclaims from the bottom.
- An app the user is not looking at is near the bottom, so this happens several
  times a day to a healthy app.
- It is not a failure either: the platform trades your process for the
  responsiveness of whatever the user is doing now.
- What we can do is hold nothing important only in memory, and restore from
  what was written outside the process.

**A weak answer** accepts the premise. The correction is that the behaviour is
policy, and policy is predictable enough to design against.
</details>
