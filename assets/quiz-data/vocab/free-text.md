정해진 칸·선택지·스키마 없이 **마음대로 쓴 글**입니다. 구조화된 데이터(JSON, enum)와 대비되는 말로, 명사 앞에서 *free-text invoice*(자유 형식 송장)처럼 씁니다.

## 문제 속 쓰임
> A data pipeline needs to extract structured invoice data (vendor, line items, totals) from **free-text** invoice PDFs.
> 데이터 파이프라인이 **자유 텍스트 형태의** 송장 PDF에서 구조화된 송장 데이터(공급업체, 품목, 합계)를 추출해야 한다.

## 함께 쓰는 표현
- **free-text field / string** : 자유 입력 필드 / 문자열
- **free-form** : 형식이 자유로운 (비슷한 말)

## 반대말
- **structured** — 구조화된 · **enum** — 정해진 값 중 하나만 고르는

## 시험 포인트
enum 에 없는 유형이 나온다고 **enum 을 없애고 자유 텍스트를 허용**하는 보기는 오답입니다. enum 은 유지하고 `"other"` + 상세 문자열 필드를 더하는 것이 정답입니다.
