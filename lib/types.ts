// 크몽 관련 타입은 lib/kmong.ts에 정의됨. re-export로 접근 통일.
export type { KmongProduct, KmongReview } from './kmong';

// 3-카드 상태
export type StatusType = 'risk' | 'watch' | 'opportunity';

export interface StatusCard {
    type: StatusType;
    rank: 1 | 2 | 3;
    title: string;
    subtext: string;
    metric: string;
    metricLabel: string;
}

// 트렌드 키워드
export interface TrendKeyword {
    category: string;
    keyword: string;
    weeklyChange: number; // %
}

// 오늘 할 일
export interface TodoItem {
    priority: 'high' | 'mid';
    title: string;
    source: string;
    dept: string;
}

// AI 인사이트
export interface AIInsight {
    title: string;
    subtext: string;
}