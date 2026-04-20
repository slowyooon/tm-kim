import type { TodoItem } from '@/lib/types';

const priorityStyles = {
    high: 'bg-red-50 text-red-700',
    mid: 'bg-orange-50 text-orange-700',
};

export default function TodoList({ todos }: { todos: TodoItem[] }) {
    return (
        <section className="mb-8">
            <h2 className="text-[18px] font-medium mb-3.5">
                오늘 할 일
                <span className="text-[13px] text-neutral-500 font-normal ml-2">
                    {todos.length}건 · AI 자동 생성
                </span>
            </h2>
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                {todos.map((t, i) => (
                    <div
                        key={i}
                        className={`grid grid-cols-[60px_1fr_120px] gap-3.5 px-4 py-3.5 items-center ${i < todos.length - 1 ? 'border-b border-neutral-200' : ''
                            }`}
                    >
                        <div
                            className={`text-[11px] font-medium px-2 py-1 rounded-full text-center ${priorityStyles[t.priority]}`}
                        >
                            {t.priority.toUpperCase()}
                        </div>
                        <div>
                            <div className="text-[14px] font-medium mb-0.5">{t.title}</div>
                            <div className="text-[12px] text-neutral-500">{t.source}</div>
                        </div>
                        <div className="text-[12px] text-neutral-500 text-right">{t.dept}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}