import type { StatusCard, TrendKeyword, TodoItem, AIInsight } from './types';

export const mockAIInsight: AIInsight = {
    title: '"AI 부업" 키워드 주간 +53%, 지금이 애드센스 상품에 AI 섹션 보강할 타이밍',
    subtext:
        '네이버/구글 동시 급상승 + 경쟁 판매자 J의 AI 블로그 전자책이 3일 만에 리뷰 12건 누적. 상품 상세페이지에 "AI 활용 섹션" 추가 + 무료 칼럼 1편 발행으로 2주 내 유입 +20% 예상.',
};

export const mockStatusCards: StatusCard[] = [
    {
        type: 'risk',
        rank: 1,
        title: '애드센스 리뷰 부정 2건',
        subtext: '"주제 선정 가이드가 모호" · 실행 가능성 / 구체성 축',
        metric: '−2.3',
        metricLabel: '감성 스코어',
    },
    {
        type: 'watch',
        rank: 2,
        title: '경쟁 판매자 J 신상 출시',
        subtext: '"AI 자동 블로그 글쓰기" 전자책 · 3일 만에 리뷰 12건',
        metric: '+12',
        metricLabel: '신규 리뷰 · 3일',
    },
    {
        type: 'opportunity',
        rank: 3,
        title: '"AI 부업" 검색량 급상승',
        subtext: '네이버 주간 +53% · 애드센스와 궁합 좋음',
        metric: '+53%',
        metricLabel: '네이버 주간',
    },
];

export const mockTrendKeywords: TrendKeyword[] = [
    { category: 'N잡', keyword: 'AI 부업', weeklyChange: 53 },
    { category: '전자책', keyword: '전자책 자동화', weeklyChange: 38 },
    { category: '블로그', keyword: '애드센스 승인', weeklyChange: 24 },
    { category: 'N잡', keyword: '크몽 수익', weeklyChange: 17 },
    { category: '습관', keyword: '아침 루틴', weeklyChange: 9 },
    { category: '블로그', keyword: '블로그 부업', weeklyChange: 6 },
    { category: '전자책', keyword: '크몽 전자책', weeklyChange: -4 },
    { category: '습관', keyword: '무의식', weeklyChange: -8 },
    { category: 'N잡', keyword: 'N잡 추천', weeklyChange: -11 },
    { category: '블로그', keyword: '티스토리 수익', weeklyChange: -15 },
];

export const mockTodos: TodoItem[] = [
    {
        priority: 'high',
        title: '애드센스 노하우 부정 리뷰 2건 답글 달기',
        source: '리뷰 감성 · 실행 가능성/구체성 축',
        dept: 'CS · 오늘',
    },
    {
        priority: 'high',
        title: '애드센스 상세페이지 "AI 활용" 섹션 신설',
        source: '검색 트렌드 · "AI 부업" +53%',
        dept: '마케팅 · 이번주',
    },
    {
        priority: 'mid',
        title: '"AI 부업 + 애드센스" 무료 칼럼 1편 발행',
        source: '검색 트렌드 · 깔때기 유입',
        dept: '콘텐츠 · 3일',
    },
    {
        priority: 'mid',
        title: '판매자 J 전자책 리뷰 분석',
        source: '경쟁사 WATCH · 신상 3일 +12건',
        dept: '기획 · 이번주',
    },
];