확실한 근거 없이 **"아마 필요하겠지" 하고 미리 짐작하는** 것입니다. 컴퓨팅에서 *speculative execution* 은 결과가 필요할지 확정되기 전에 작업을 미리 실행해 두는 기법을 말합니다.

## 문제 속 쓰임
> Implement **speculative** execution that automatically calls likely-needed tools alongside any requested tool.
> 요청된 도구와 함께 필요할 것 같은 도구까지 자동으로 호출하는 **추측** 실행을 구현한다.

## 함께 쓰는 표현
- **speculative execution** : 추측 실행
- **speculate** (동) 추측하다 · **speculation** (명) 추측; 투기
- **purely speculative** : 순전히 추측에 불과한

## 시험 포인트
"필요할지도 모르니 미리 호출한다"는 방식은 불필요한 호출로 **비용과 부작용 위험**을 키워 오답이 되기 쉽습니다. 실제로 필요한 요청을 한 번에 정확히 보내게 하는 쪽이 정답 방향입니다.
