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
excerpt: "고등 수학과 선형대수 기초만으로 데이터 표현, 샘플링과 모델링, Generative/Discriminative Modeling을 연결해 설명합니다."
---

## 머신러닝의 세 요소

이 글의 요점은 하나입니다. 머신러닝은 **가진 표본으로 세상의 분포나 관계를 거꾸로 추정하는 일**입니다. 고등 수학과 선형대수 기초만 알고 있어도 이 문장은 충분히 따라갈 수 있습니다.

머신러닝을 세 부분으로 나누면 단순해집니다. **데이터**는 관측한 값을 숫자로 적어 놓은 것입니다. **모델**은 데이터 뒤에 있을 법한 규칙이나 확률분포를 표현합니다. **학습**은 모델의 파라미터를 바꾸면서 예측이 덜 틀리도록 만드는 과정입니다.

여기서 파라미터는 모델의 모양을 정하는 숫자입니다. 정규분포라면 평균과 표준편차가 파라미터입니다. 선형회귀라면 기울기와 절편이 파라미터입니다. 신경망에서는 weight와 bias가 그 역할을 합니다.

## 데이터는 행렬입니다

데이터란 무엇일까요? 보통은 “관측값”이라고 말하지만, 모델 입장에서는 조금 더 구체적입니다. 하나의 샘플은 하나의 벡터입니다. 학생 한 명을 예로 들면 키, 몸무게, 나이, 공부 시간이 벡터 원소가 됩니다.

샘플을 여러 개 쌓으면 데이터셋은 행렬이 됩니다. 행은 샘플, 열은 특성입니다.

$$
X \in \mathbb{R}^{N \times d}
$$

여기서 $N$은 샘플 수, $d$는 특성 수입니다.

<figure class="paper-figure">
  <img src="/assets/images/posts/2026-06-22-machine-learning-modeling/data-as-matrix.svg" alt="하나의 학생 샘플 벡터와 학생 데이터 행렬">
</figure>

데이터는 여러 꼴로 들어옵니다. **수치형 데이터**는 그대로 벡터 원소로 쓸 수 있습니다. 키, 몸무게, 가격이 여기에 속합니다.

**범주형 데이터**에는 조심할 점이 있습니다. 사과를 1, 배를 2, 포도를 3으로 두면 모델은 포도가 배보다 크다고 해석할 수 있습니다. 범주 사이에는 순서나 크기가 없습니다. 이 경우 one-hot encoding을 사용합니다. 클래스 개수만큼 벡터를 만들고 맞는 항목만 1로 둡니다.

**비정형 데이터**도 모델 입력에서는 숫자 배열입니다. 흑백 이미지는 $H \times W$ 행렬입니다. 컬러 이미지는 $H \times W \times 3$ 텐서입니다. 비디오는 프레임 축이 붙어 $F \times H \times W \times 3$ 텐서가 됩니다. 텍스트는 토큰화한 뒤 각 토큰을 embedding 벡터로 바꿉니다.

## 샘플링과 모델링

왜 갑자기 확률분포가 나올까요? 우리가 세상 전체를 들고 있지 않기 때문입니다. 전체 대상은 모집단이고, 손에 있는 데이터는 표본입니다. 학생의 키를 알고 싶다고 해도 모든 학생의 키를 알 수는 없습니다. 몇 명의 키만 관측합니다.

확률분포는 이 불완전함을 다루는 언어입니다. 모집단에서 한 사람을 뽑았을 때 키가 어떤 값 근처에 나올 가능성이 얼마나 되는지 숫자로 적습니다. 모집단의 정의역을 $\chi$라고 하면, 한 번 뽑았을 때 값이 $x$일 확률을 $P(x)$라고 씁니다.

$$
\{(x, P(x)) \mid x \in \chi\}
$$

여기서 중요한 방향이 있습니다. **샘플링은 분포에서 표본으로 가는 과정**입니다. 숨겨진 모집단 분포가 있고, 그 분포에서 몇 개의 관측값이 나옵니다.

**모델링은 그 반대 방향**입니다. 표본 몇 개만 보고 원래의 분포나 관계를 거꾸로 추정합니다. 우리가 실제로 아는 것은 샘플 몇 개의 특성뿐입니다. 알고 싶은 것은 그 샘플을 낳았을 법한 분포입니다.

<figure class="paper-figure">
  <img src="/assets/images/posts/2026-06-22-machine-learning-modeling/sampling-modeling.svg" alt="모집단의 숨겨진 분포와 샘플링, 모델링">
</figure>

모델링의 목표는 크게 두 가지입니다. 하나는 표본만으로 모집단의 확률분포를 근사하는 것입니다. 다른 하나는 전체 분포를 전부 알지 않고도 특성 사이의 관계만 찾는 것입니다. 여기서 Generative Modeling과 Discriminative Modeling이 갈라집니다.

## 생성 모델링과 판별 모델링

**Generative Modeling**은 표본을 만든 전체 확률분포를 근사합니다. 입력 특성이 하나라면 $P(X)$를, 키와 몸무게처럼 두 특성을 함께 본다면 $P(X,Y)$를 맞추려는 문제입니다. 분포를 알면 새 샘플을 그럴듯하게 만들어낼 수 있기 때문에 generative라는 이름이 붙습니다.

모델은 보통 구조와 파라미터로 나뉩니다. “정규분포 모양으로 보겠다”가 구조라면, 평균과 표준편차가 파라미터입니다. 같은 샘플도 여러 분포가 설명할 수 있습니다. 고정된 구조에서 파라미터 $\theta$가 바뀔 때 데이터가 얼마나 그럴듯한지를 likelihood라고 부릅니다.

$$
P(X \mid \theta)
$$

Likelihood를 크게 만드는 파라미터를 찾는 방법이 MLE, Maximum Likelihood Estimation입니다.

**Discriminative Modeling**은 전체 분포를 직접 근사하지 않습니다. 관심 있는 출력 $Y$를 입력 $X$에서 예측하는 조건부 분포를 구합니다.

$$
P(Y \mid X)
$$

예를 들어 키 $X$로 몸무게 $Y$를 예측하고 싶다고 합시다. 필요한 것은 전체 결합분포 $P(X,Y)$가 아닙니다. 키가 165cm로 고정되었을 때 몸무게가 어떻게 분포하는지, 즉 $P(Y \mid X=165)$를 알면 됩니다.

결합분포는 모든 키와 모든 몸무게 조합의 확률을 알아야 합니다. 조건부 분포는 입력값 하나를 고정한 뒤 출력 쪽 단면만 봅니다. 이쪽이 예측 문제에 더 직접적입니다.

<figure class="paper-figure">
  <img src="/assets/images/posts/2026-06-22-machine-learning-modeling/modeling-types.svg" alt="생성 모델링의 P(X) 근사와 판별 모델링의 P(Y|X) 예측">
</figure>

아래 3D plot은 같은 내용을 조금 더 직접 보여줍니다. 파란 표면은 $P(X,Y)$입니다. 슬라이더로 $X$ 값을 움직이면 빨간 단면과 조건부 곡선이 함께 움직입니다. 엄밀히는 이 단면을 정규화하면 $P(Y \mid X)$가 됩니다.

<div class="ml-modeling-plot-card">
  <div id="ml-discriminative-plot" class="ml-modeling-plot" aria-label="P(X,Y)와 P(Y given X=165)를 보여주는 3D interactive plot"></div>
  <p class="ml-modeling-plot-note">파란 표면은 joint distribution, 빨간 면과 곡선은 슬라이더의 X 값에서 자른 conditional distribution입니다. 예측에 필요한 것은 전체 표면이 아니라 입력값에서 잘라낸 출력 분포입니다.</p>
</div>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="/assets/js/posts/ml-modeling-discriminative.js?v=5"></script>

Bayesian note는 파라미터를 보는 관점의 차이를 다룹니다. 빈도주의 관점에서는 $\theta$를 찾아야 할 숨겨진 상수로 둡니다. 베이지안 관점에서는 prior $P(\theta)$를 두고 관측 $X$에 따라 믿음을 갱신합니다.

$$
P(\theta \mid X) \propto P(X \mid \theta) P(\theta)
$$

## 선형회귀의 가정

선형회귀는 Discriminative Modeling의 가장 작은 예입니다. 목표는 $P(Y \mid X)$를 모델링하는 일입니다. $X$가 주어졌을 때 $Y$가 정규분포를 따른다고 가정하면 예측값은 그 분포의 평균으로 둘 수 있습니다.

평균이 직선 위에 놓인다고 가정하면 linear hypothesis가 됩니다.

$$
y = H(x) = ax + b
$$

확률분포로는 이렇게 씁니다.

$$
P(Y \mid X) \sim \mathcal{N}(aX + b, \sigma^2)
$$

Notation은 이렇게 둡니다. 데이터 포인트는 $(x_n, y_n)$입니다. 실제 underlying function은 $f$, 모델이 예측한 함수는 $f_W$, 찾아야 하는 파라미터는 $W$입니다. 입력이 하나인 univariate linear regression에서는 $W = (w_0, w_1)$로 볼 수 있습니다.

회귀와 분류의 차이도 여기서 나옵니다. 회귀는 집값, 성적, 주가처럼 연속값을 예측합니다. 분류는 남성/여성, 양성/음성처럼 이산값을 예측합니다.

## Loss function

학습 목표는 더 좋은 파라미터 $W$를 찾는 일입니다. 이를 계산하려면 성능을 숫자로 표현해야 합니다. 선형회귀에서는 예측값 $f_W(x_n)$과 정답 $y_n$의 차이를 씁니다.

가장 단순하게는 절댓값 오차를 둘 수 있습니다.

$$
L(W) = \sum_n |y_n - f_W(x_n)|
$$

파라미터가 바뀌면 각 샘플의 오차와 전체 loss가 함께 바뀝니다. 이 함수를 loss function, cost function, objective function이라고 부릅니다.

<figure class="paper-figure">
  <img src="/assets/images/posts/2026-06-22-machine-learning-modeling/linear-regression-loss.svg" alt="두 선형회귀 후보 직선과 오차 합산, loss 변화">
</figure>

Loss 정의에 따라 최적 파라미터가 달라집니다. 데이터셋이 달라져도 최적 파라미터가 달라집니다. 모델 학습은 loss function의 최솟값을 찾는 문제입니다.

## MAE, MSE, MLE

MAE는 오차의 절댓값을 평균냅니다.

$$
L(W) = \frac{1}{N}\sum_n |y_n - f_W(x_n)|
$$

MSE는 오차를 제곱해서 평균냅니다.

$$
L(W) = \frac{1}{N}\sum_n (y_n - f_W(x_n))^2
$$

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

$$
w \leftarrow w - \alpha \frac{\partial L}{\partial w}
$$

모델 학습은 보통 같은 계산을 반복합니다. 현재 모델로 output을 계산하고 output과 label로 loss를 계산합니다. 이후 loss를 모델 파라미터에 대해 편미분해 gradient를 얻고 gradient 반대 방향으로 파라미터를 업데이트합니다.

<figure class="paper-figure">
  <img src="/assets/images/posts/2026-06-22-machine-learning-modeling/optimization-backprop.svg" alt="gradient descent와 computational graph의 backpropagation">
</figure>

모든 파라미터에 대해 gradient를 따로 계산하면 비효율적입니다. Backpropagation은 chain rule을 써서 중간 변수의 미분값을 재사용합니다. 계산 그래프에서 forward pass로 loss를 만들고 backward pass로 gradient를 뒤로 보냅니다.

PyTorch의 training loop도 같은 구조입니다. Dataset과 model을 정의하고 loss와 optimizer를 정합니다. 학습 루프에서는 forward pass로 예측값을 만들고 loss를 계산합니다. 이후 `optimizer.zero_grad()`, `loss.backward()`, `optimizer.step()` 순서로 gradient 초기화, 역전파, 파라미터 업데이트를 실행합니다.
