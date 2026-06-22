---
layout: post
title: "머신러닝과 모델링: 2강 정리"
author: jeonseonghu
date: 2026-06-22 18:00:00 +0900
hidden: false
toc: true
comments: false
main_category: Education
sub_category: ML/DL Basics
categories:
  - Education
tags:
  - Machine Learning
  - Modeling
  - Study
excerpt: "데이터 표현, 샘플링과 모델링, 선형회귀 loss, MLE, gradient descent를 2강 슬라이드 순서대로 정리합니다."
---

## 머신러닝의 세 요소

머신러닝은 데이터를 사용해 모델을 만들고 task를 수행하는 방법입니다. 강의에서는 데이터, 모델, 학습으로 나누어 설명합니다.

데이터는 task에 필요한 특성과 관계를 담습니다. 모델은 관계를 표현하는 함수 또는 확률분포입니다. 학습은 모델 파라미터를 조정해 미리 정한 목표값을 낮추는 과정입니다. 학습 목표는 모델의 오차를 숫자로 재는 함수입니다.

## 데이터는 행렬입니다

하나의 데이터 샘플은 벡터로 표현합니다. 학생 한 명을 예로 들면 키, 몸무게, 나이, 공부 시간이 벡터 원소가 됩니다. 샘플을 여러 개 쌓으면 데이터셋은 행렬이 됩니다. 행은 샘플, 열은 특성입니다.

\[
X \in \mathbb{R}^{N \times d}
\]

여기서 \(N\)은 샘플 수, \(d\)는 특성 수입니다.

<figure class="paper-figure">
  <img src="/assets/images/posts/2026-06-22-machine-learning-modeling/data-as-matrix.svg" alt="하나의 학생 샘플 벡터와 학생 데이터 행렬">
</figure>

수치형 데이터는 그대로 벡터 원소로 쓸 수 있습니다. 키, 몸무게, 가격이 여기에 속합니다.

범주형 데이터에 숫자를 그대로 붙이면 안 됩니다. 사과를 1, 배를 2, 포도를 3으로 두면 모델은 포도가 배보다 크다고 해석할 수 있습니다. 범주 사이에는 순서나 크기가 없습니다. 이 경우 one-hot encoding을 사용합니다. 클래스 개수만큼 벡터를 만들고 맞는 항목만 1로 둡니다.

비정형 데이터도 모델 입력에서는 숫자 배열입니다. 흑백 이미지는 \(H \times W\) 행렬입니다. 컬러 이미지는 \(H \times W \times 3\) 텐서입니다. 비디오는 프레임 축이 붙어 \(F \times H \times W \times 3\) 텐서가 됩니다. 텍스트는 토큰화한 뒤 각 토큰을 embedding 벡터로 바꿉니다.

## 샘플링과 모델링

데이터는 관측 대상을 숫자나 문자로 기록한 값입니다. 전체 대상은 모집단이고 손에 있는 데이터는 표본입니다. 강의에서는 모집단이 숨겨진 확률분포를 따른다고 둡니다.

모집단의 정의역을 \(\chi\)라고 하면 한 번 샘플링했을 때 값이 \(x\)일 확률은 \(P(x)\)입니다.

\[
\{(x, P(x)) \mid x \in \chi\}
\]

실제로 관측하는 것은 분포 전체가 아니라 일부 샘플의 특성입니다.

<figure class="paper-figure">
  <img src="/assets/images/posts/2026-06-22-machine-learning-modeling/sampling-modeling.svg" alt="모집단의 숨겨진 분포와 샘플링, 모델링">
</figure>

샘플링은 모집단에서 관측치를 뽑는 일입니다. 모델링은 샘플로 모집단의 분포나 특성 사이의 관계를 추정하는 일입니다. 모델링 목표는 두 가지로 나뉩니다. 하나는 샘플만으로 모집단의 확률분포를 근사하는 일입니다. 다른 하나는 전체 분포를 직접 구하지 않고 특성 사이의 관계를 찾는 일입니다.

## 생성 모델링과 판별 모델링

생성 모델링은 샘플에서 모집단의 확률분포를 근사합니다. 강의에서는 \(P(X)\) 또는 \(P(X, Y)\)를 근사하는 문제로 설명합니다. 모델은 정규분포처럼 고정된 구조를 가질 수 있습니다. 평균과 표준편차 같은 파라미터 \(\theta\)가 분포를 정합니다.

같은 데이터셋을 설명하는 \(P_\theta\)는 하나로 정해지지 않습니다. 고정된 구조에서 파라미터가 바뀔 때 데이터가 얼마나 그럴듯한지를 likelihood라고 부릅니다.

\[
P(X \mid \theta)
\]

Likelihood를 최대화하는 파라미터를 찾는 방법이 MLE, Maximum Likelihood Estimation입니다.

판별 모델링은 전체 분포를 직접 근사하지 않습니다. 관심 있는 출력 \(Y\)를 입력 \(X\)에서 예측하는 조건부 분포를 구합니다.

\[
P(Y \mid X)
\]

예를 들어 키 \(X\)로 몸무게 \(Y\)를 예측하려면 \(P(X, Y)\) 전체를 알 필요가 없습니다. \(P(Y \mid X=165)\)처럼 특정 입력에서의 출력 분포만 알면 됩니다. 결합분포는 전체 확률값을 요구하지만 조건부 분포는 두 변수의 관계를 모델링합니다.

<figure class="paper-figure">
  <img src="/assets/images/posts/2026-06-22-machine-learning-modeling/modeling-types.svg" alt="생성 모델링의 P(X) 근사와 판별 모델링의 P(Y|X) 예측">
</figure>

슬라이드의 Bayesian note는 파라미터를 보는 관점의 차이를 다룹니다. 빈도주의 관점에서는 \(\theta\)를 찾아야 할 숨겨진 상수로 둡니다. 베이지안 관점에서는 prior \(P(\theta)\)를 두고 관측 \(X\)에 따라 믿음을 갱신합니다.

\[
P(\theta \mid X) \propto P(X \mid \theta) P(\theta)
\]

## 선형회귀의 가정

선형회귀는 판별 모델링의 예입니다. 목표는 \(P(Y \mid X)\)를 모델링하는 일입니다. \(X\)가 주어졌을 때 \(Y\)가 정규분포를 따른다고 가정하면 예측값은 그 분포의 평균으로 둘 수 있습니다.

평균이 직선 위에 놓인다고 가정하면 linear hypothesis가 됩니다.

\[
y = H(x) = ax + b
\]

확률분포로는 이렇게 씁니다.

\[
P(Y \mid X) \sim \mathcal{N}(aX + b, \sigma^2)
\]

Notation은 이렇게 둡니다. 데이터 포인트는 \((x_n, y_n)\)입니다. 실제 underlying function은 \(f\), 모델이 예측한 함수는 \(f_W\), 찾아야 하는 파라미터는 \(W\)입니다. 입력이 하나인 univariate linear regression에서는 \(W = (w_0, w_1)\)로 볼 수 있습니다.

회귀와 분류의 차이도 여기서 나옵니다. 회귀는 집값, 성적, 주가처럼 연속값을 예측합니다. 분류는 남성/여성, 양성/음성처럼 이산값을 예측합니다.

## Loss function

학습 목표는 더 좋은 파라미터 \(W\)를 찾는 일입니다. 이를 계산하려면 성능을 숫자로 표현해야 합니다. 선형회귀에서는 예측값 \(f_W(x_n)\)과 정답 \(y_n\)의 차이를 씁니다.

강의에서는 먼저 절댓값 오차를 둡니다.

\[
L(W) = \sum_n |y_n - f_W(x_n)|
\]

파라미터가 바뀌면 각 샘플의 오차와 전체 loss가 함께 바뀝니다. 이 함수를 loss function, cost function, objective function이라고 부릅니다.

<figure class="paper-figure">
  <img src="/assets/images/posts/2026-06-22-machine-learning-modeling/linear-regression-loss.svg" alt="두 선형회귀 후보 직선과 오차 합산, loss 변화">
</figure>

Loss 정의에 따라 최적 파라미터가 달라집니다. 데이터셋이 달라져도 최적 파라미터가 달라집니다. 모델 학습은 loss function의 최솟값을 찾는 문제입니다.

## MAE, MSE, MLE

MAE는 오차의 절댓값을 평균냅니다.

\[
L(W) = \frac{1}{N}\sum_n |y_n - f_W(x_n)|
\]

MSE는 오차를 제곱해서 평균냅니다.

\[
L(W) = \frac{1}{N}\sum_n (y_n - f_W(x_n))^2
\]

두 식은 단순한 선택지가 아닙니다. 오차 분포에 대한 가정이 다릅니다.

오차가 정규분포를 따른다고 두면 likelihood를 최대화하는 일은 MSE를 최소화하는 일과 같아집니다. 확률식의 지수에 들어가는 음수 항을 줄이는 문제가 제곱오차를 줄이는 문제로 바뀌기 때문입니다.

오차가 라플라스분포를 따른다고 두면 MAE와 연결됩니다. 라플라스분포는 sharp peak를 갖고 꼬리가 상대적으로 두껍습니다. 그래서 MAE는 outlier에 MSE보다 덜 민감합니다.

<figure class="paper-figure">
  <img src="/assets/images/posts/2026-06-22-machine-learning-modeling/loss-mle.svg" alt="정규분포 가정과 MSE, 라플라스분포 가정과 MAE">
</figure>

Loss function은 데이터의 noise를 어떻게 볼지에 대한 가정입니다.

## Optimization

선형회귀는 closed-form 해를 구할 수 있습니다. 딥러닝 모델은 파라미터가 많고 구조가 복잡해서 해석적으로 풀기 어렵습니다. 그래서 loss function의 최솟값을 반복적으로 찾습니다.

Gradient는 함수가 가장 크게 증가하는 방향입니다. Loss를 줄이려면 gradient의 반대 방향으로 이동합니다.

\[
w \leftarrow w - \alpha \frac{\partial L}{\partial w}
\]

모델 학습은 보통 같은 계산을 반복합니다. 현재 모델로 output을 계산하고 output과 label로 loss를 계산합니다. 이후 loss를 모델 파라미터에 대해 편미분해 gradient를 얻고 gradient 반대 방향으로 파라미터를 업데이트합니다.

<figure class="paper-figure">
  <img src="/assets/images/posts/2026-06-22-machine-learning-modeling/optimization-backprop.svg" alt="gradient descent와 computational graph의 backpropagation">
</figure>

모든 파라미터에 대해 gradient를 따로 계산하면 비효율적입니다. Backpropagation은 chain rule을 써서 중간 변수의 미분값을 재사용합니다. 계산 그래프에서 forward pass로 loss를 만들고 backward pass로 gradient를 뒤로 보냅니다.

PyTorch의 training loop도 같은 구조입니다. Dataset과 model을 정의하고 loss와 optimizer를 정합니다. 학습 루프에서는 forward pass로 예측값을 만들고 loss를 계산합니다. 이후 `optimizer.zero_grad()`, `loss.backward()`, `optimizer.step()` 순서로 gradient 초기화, 역전파, 파라미터 업데이트를 실행합니다.
