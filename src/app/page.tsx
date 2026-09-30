"use client";

import { useRef, useState } from "react";

const MENUS: Record<string, string[]> = {
  한식: ["김치찌개", "된장찌개", "비빔밥", "제육볶음", "삼겹살", "떡볶이", "순두부찌개", "불고기"],
  중식: ["짜장면", "짬뽕", "탕수육", "마라탕", "마파두부", "양장피", "볶음밥"],
  일식: ["초밥", "라멘", "돈카츠", "우동", "오니기리", "규동", "가라아게"],
  양식: ["파스타", "피자", "스테이크", "리조또", "햄버거", "샐러드"],
  분식: ["떡볶이", "순대", "김밥", "라면", "튀김", "핫도그"],
};

const CATEGORIES = ["전체", ...Object.keys(MENUS)];

function getMenuPool(category: string): string[] {
  if (category === "전체") {
    return Object.values(MENUS).flat();
  }
  return MENUS[category] ?? [];
}

export default function Home() {
  const [category, setCategory] = useState("전체");
  const [displayed, setDisplayed] = useState("?");
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pool = getMenuPool(category);

  function handleSpin() {
    if (spinning || pool.length === 0) return;

    setSpinning(true);
    setResult(null);

    const spinDurationMs = 1400;
    const tickMs = 80;
    const startedAt = Date.now();

    intervalRef.current = setInterval(() => {
      const random = pool[Math.floor(Math.random() * pool.length)];
      setDisplayed(random);

      if (Date.now() - startedAt >= spinDurationMs) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const finalPick = pool[Math.floor(Math.random() * pool.length)];
        setDisplayed(finalPick);
        setResult(finalPick);
        setSpinning(false);
      }
    }, tickMs);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans">
      <main className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            오늘 뭐 먹지?
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            카테고리를 고르고 버튼을 눌러 오늘의 메뉴를 뽑아보세요
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                if (spinning) return;
                setCategory(c);
                setResult(null);
                setDisplayed("?");
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === c
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
          <span
            className={`text-3xl font-bold tracking-tight ${
              result ? "text-zinc-900" : "text-zinc-400"
            }`}
          >
            {displayed}
          </span>
        </div>

        <button
          onClick={handleSpin}
          disabled={spinning}
          className="w-full rounded-full bg-zinc-900 px-6 py-4 text-base font-semibold text-white transition-transform hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {spinning ? "뽑는 중..." : "오늘의 메뉴 뽑기"}
        </button>

        {result && (
          <p className="text-sm text-zinc-500">
            오늘의 메뉴는 <span className="font-semibold text-zinc-900">{result}</span> 입니다!
          </p>
        )}
      </main>
    </div>
  );
}
