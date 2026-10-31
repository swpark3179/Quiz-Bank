복잡한 세부 동작을 감추고 "이것만 호출하면 된다"는 **단순한 겉면**을 제공하는 것입니다. 편리하지만, 그 안에서 **실제로 무슨 일이 일어나는지 보이지 않게 된다**는 대가가 따릅니다.

## 문제 속 쓰임
> Some answers ignore an instruction the team is sure it supplied, but the framework's **abstractions** make it hard to see the exact prompt the model received.
> 일부 답변이 팀이 분명히 넣었다고 생각하는 지시를 무시하는데, 프레임워크의 **추상화** 때문에 모델이 실제로 받은 프롬프트를 확인하기 어렵다.

## 함께 쓰는 표현
- **abstraction layer** : 추상화 계층
- **abstract away** ~ : (세부를) 감추다, 추상화하다

## 시험 포인트
Anthropic은 프레임워크의 추상화 층이 실제 프롬프트와 응답을 가려 디버깅을 어렵게 한다고 경고합니다. "모델이 무엇을 받았는지 안 보인다"는 문항의 정답은 **직접 API 호출로 재현해 확인**하는 것이고, 프레임워크 층을 하나 더 얹는 보기는 오답입니다.
