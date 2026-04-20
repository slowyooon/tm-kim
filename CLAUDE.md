# TM-KIM Dashboard

끝판왕KIM(남자친구) 전자책 비즈니스용 내부 대시보드.

## 비즈니스 컨텍스트

- **브랜드**: 끝판왕KIM (Better Life Here)
- **자체몰**: https://betterlifehere.com (아임웹)
- **크몽 채널**: 크몽 TOP 판매자, 상품 6개 판매 중
- **자체몰 상품 3개** (우선순위순)
  1. 구글애드센스 블로그 노하우 (66,000원)
  2. 전자책 제작 노하우 (55,000원)
  3. 무의식 활용법 (33,000원)

## 기술 스택

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Vercel 배포
- DB 없음. ISR 캐시(6시간)로 외부 API 결과 저장
- 외부 API: 크몽 스크래핑(cheerio), 네이버 데이터랩, Anthropic Claude

## 디자인 시스템

- **디자인 톤**: archivepke.vercel.app 참고, 모노톤 + 블루 포인트
- **브랜드 컬러**
  - 블랙: `#0A1628`
  - 블루: `#2563EB`
  - 딥 블루: `#1E3A8A`
  - 라이트 블루: `#E6F1FB`, `#85B7EB`, `#B5D4F4`
- **상태 컬러**: 성공 `#16A34A`, 주의 `#EA580C`, 위험 `#DC2626`
- **폰트**: system-ui 또는 Pretendard (h1 22px, h2 18px, h3 16px, 본문 14~15px)
- **컴포넌트**: 플랫 디자인, 0.5px 보더, border-radius 8~12px, shadow 없음

## 대시보드 구조 (V3.5)

1. 헤더 (제목 + LIVE 시각)
2. **AI 인사이트** — 상단 블랙/블루 강조 박스
3. **3-카드** — RISK / WATCH / OPPORTUNITY
4. **KPI 자리** — 플레이스홀더 (끝판왕KIM 협의 후 추가)
5. **자체몰 상품 3개** — 테이블
6. **크몽 상품 6개** — 테이블 (순위, 리뷰, 평점)
7. **경쟁사 3명** — 테이블
8. **트렌드 키워드** — 네이버 데이터랩 주간 변동
9. **오늘 할 일** — Claude 자동 생성 액션 아이템

## 코드 컨벤션

- 코멘트·문서·커밋 메시지는 한국어 OK
- 컴포넌트 파일명은 PascalCase (예: `AIInsight.tsx`)
- 유틸 파일명은 camelCase (예: `kmong.ts`)
- 환경변수는 `.env.local` (git ignore). Vercel에 따로 등록
- ISR revalidate는 기본 21600(6시간), API route마다 명시

## 배포 & 갱신

- Vercel Hobby 플랜
- 자동 갱신: cron-job.org에서 하루 2회 API 엔드포인트 호출
- 도메인: 미정 (추후 `dashboard.betterlifehere.com` 검토)

## 커뮤니케이션 선호

- 한국어, 캐주얼 ~해/~야 register
- 코드 설명은 핵심만 간결하게
- 막혔을 때 "왜 안 되는지" 근거 포함 설명