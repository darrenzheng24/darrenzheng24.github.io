---
title: "DRP 2023 Spring Recap"
date: "2025-10-10T00:21:47Z"
draft: true
summary: "Second DRP experience studying generating functions with Xinxuan Zhang, exploring combinatorial sequences and their polynomial representations"
description: null
tags:
  - "DRP"
  - "Math"
  - "test"
series: "Directed Reading Program"
categories: ""
featuredImage: ""
readingtime: true
---

This is the second post in my series about my DRP experience. At the start of my sophomore year, I started to take more topology, real analysis, and abstract algebra classes, so I decided to curate my DRP experience to focus on a different topic. I was paired with Xin (Jennifer) Zhang, a combinatorialist and we decided to study generating functions. We followed the great text "generatingfunctionology" by the late Herbert Wilf, a professor at UPenn. 

Generating functions refer to polynomials used to encode particular combinatorial sequences. For example, let's use the Fibonacci sequence defined as 
\[F_{n} = \begin{cases}
1 &\text{ if } n = 0, 1 \\
a_{n-1} + a_{n -2} &\text{ if } n \geq 2
\end{cases}\]

Then, we can define a polynomial $f(x) = \sum_{i = 0}^{\infty}{F_{i}z^{i}} = 1 + z + 2z^{2} + 3x^{3} + 5z^{4} + \dots$.
