"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const RECORDS_KEY = "moment-us-records-v3";
const INVITE_KEY = "moment-us-invite-code";
const HOME_KEY = "moment-us-home-v3";

const recordCategoryMap = {
  happy: {
    label: "开心",
    icon: "😄",
    bg: "bg-[#FFF6E8]",
    text: "text-[#D28A2E]",
  },
  touched: {
    label: "感动",
    icon: "🥹",
    bg: "bg-[#FFF1F4]",
    text: "text-[#C97C8A]",
  },
  miss: {
    label: "想念",
    icon: "💭",
    bg: "bg-[#F7F0FF]",
    text: "text-[#9B78C8]",
  },
  calm: {
    label: "平和",
    icon: "🌿",
    bg: "bg-[#EEF8F1]",
    text: "text-[#5E9B72]",
  },
  sad: {
    label: "难过",
    icon: "😔",
    bg: "bg-[#F4F1FF]",
    text: "text-[#8B79C9]",
  },
  disappointed: {
    label: "失望",
    icon: "🥀",
    bg: "bg-[#F7F3F0]",
    text: "text-[#9A7E74]",
  },
  angry: {
    label: "生气",
    icon: "😤",
    bg: "bg-[#FFF0F0]",
    text: "text-[#D26A6A]",
  },
};

function JellyButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-3xl shadow-md active:scale-95 transition-transform duration-150 ease-out ${className}`}
    >
      {children}
    </button>
  );
}

function formatDateInput(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getDaysTogether(startDate) {
  if (!startDate) return 0;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return 0;
  const now = new Date();
  const diff =
    now.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
}

function getDaysToDate(targetDate) {
  if (!targetDate) return null;
  const today = new Date();
  const target = new Date(targetDate);
  if (Number.isNaN(target.getTime())) return null;

  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diff = end - start;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function BottomNav({ page, setPage }) {
  const items = [
    { key: "home", label: "首页", icon: "🏠" },
    { key: "records", label: "记录", icon: "📝" },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2 rounded-full border border-[#F3DADF] bg-white/95 px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.10)] backdrop-blur">
      <div className="grid grid-cols-2 items-center">
        {items.map((item) => {
          const active = page === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`flex flex-col items-center gap-1 py-2 ${
                active ? "text-[#D97A8C]" : "text-[#9A8791]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function WelcomePage({ onStart, onInvite }) {
  return (
    <div className="min-h-screen bg-cheese px-6 py-10 flex flex-col justify-center items-center text-center">
      <div className="w-full max-w-md space-y-8">
        <div className="rounded-[32px] bg-gradient-to-br from-[#FDE2E4] via-[#FFF5F6] to-[#FFF8E8] p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="space-y-4">
            <div className="text-6xl">🧸💌</div>
            <h1 className="text-3xl font-bold text-roseBrown leading-snug">
              Moment Us
            </h1>
            <p className="text-base leading-7 text-[#6B5B57] px-2">
              一个只属于你们的空间，
              <br />
              用来记录那些值得被记住的时刻✨💗
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <JellyButton
            onClick={onStart}
            className="w-full bg-primary px-6 py-4 text-lg font-semibold text-white"
          >
            进入我们的小空间
          </JellyButton>

          <JellyButton
            onClick={onInvite}
            className="w-full bg-white px-6 py-4 text-lg font-semibold text-[#7D5A5A] border border-[#FFD4CF]"
          >
            邀请对方
          </JellyButton>
        </div>
      </div>
    </div>
  );
}

function PairPage({
  inviteCode,
  onGenerateCode,
  onEnterSpace,
  inputCode,
  setInputCode,
  onBack,
  message,
}) {
  return (
    <div className="min-h-screen bg-cheese px-5 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between pt-2">
          <button onClick={onBack} className="text-sm text-[#8B7470]">
            ← 返回
          </button>
          <div className="w-10" />
        </div>

        <div className="pt-2">
          <h2 className="text-2xl font-bold text-[#7D5A5A]">建立你们的空间</h2>
          <p className="text-sm text-[#8B7470] mt-2 leading-6">
            一起拥有一个能安心记录彼此故事的小角落。
          </p>
        </div>

        <div className="rounded-3xl bg-[#FFF7E8] border border-[#F5D8A8] p-4 text-sm leading-6 text-[#8A6A45] shadow-sm">
          当前是演示版：邀请码只在本浏览器有效。
          <br />
          想让两个人在不同手机上都能用，需要接 Firebase。
        </div>

        <div className="rounded-3xl bg-white shadow-md p-5 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-[#7D5A5A]">生成邀请码</h3>
            <p className="text-sm text-[#8B7470] mt-1">
              把邀请码分享给对方，进入你们的共同空间。
            </p>
          </div>

          <div className="rounded-3xl bg-[#FFF7F6] border border-[#FFD9D3] px-4 py-4 text-center text-xl font-bold tracking-[0.2em] text-[#D97D73]">
            {inviteCode || "点击生成"}
          </div>

          <JellyButton
            onClick={onGenerateCode}
            className="w-full bg-primary py-3 text-white font-semibold"
          >
            生成邀请码
          </JellyButton>
        </div>

        <div className="rounded-3xl bg-white shadow-md p-5 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-[#7D5A5A]">输入邀请码</h3>
            <p className="text-sm text-[#8B7470] mt-1">
              输入后，就能进入你们的共同空间啦～
            </p>
          </div>

          <input
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="输入邀请码"
            className="w-full rounded-3xl border border-[#F3D2CC] bg-[#FFFDFC] px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
          />

          {message ? (
            <div className="rounded-2xl bg-[#FFF5F4] px-4 py-3 text-sm text-[#B25D54]">
              {message}
            </div>
          ) : null}

          <JellyButton
            onClick={onEnterSpace}
            className="w-full bg-[#FFE3DF] py-3 text-[#7D5A5A] font-semibold"
          >
            进入我们的小空间
          </JellyButton>
        </div>
      </div>
    </div>
  );
}

function HomePage({ homeData, setHomeData, onGoPair }) {
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  const daysTogether = getDaysTogether(homeData.togetherDate);

  const countdownItems = (homeData.countdowns || [])
    .slice(0, 3)
    .filter((item) => item.title || item.date);

  const previewWishes = (homeData.wishes || []).slice(0, 3).filter(Boolean);

  const handleUploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setHomeData((prev) => ({
        ...prev,
        coverImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const updateCountdown = (index, field, value) => {
    setHomeData((prev) => {
      const next = [...(prev.countdowns || [])];
      while (next.length < 3) next.push({ title: "", date: "" });
      next[index] = {
        ...next[index],
        [field]: value,
      };
      return {
        ...prev,
        countdowns: next.slice(0, 3),
      };
    });
  };

  const updateWish = (index, value) => {
    setHomeData((prev) => {
      const next = [...(prev.wishes || [])];
      while (next.length < 3) next.push("");
      next[index] = value;
      return {
        ...prev,
        wishes: next.slice(0, 3),
      };
    });
  };

  return (
    <div className="min-h-screen bg-cheese px-5 pt-6 pb-28">
      <div className="max-w-md mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={onGoPair} className="text-sm text-[#8B7470]">
            邀请TA
          </button>
          <button
            onClick={() => setEditing((prev) => !prev)}
            className="text-sm text-[#8B7470]"
          >
            {editing ? "收起编辑" : "编辑首页"}
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[32px] shadow-[0_12px_30px_rgba(0,0,0,0.10)]">
          <div
            className="min-h-[340px] bg-cover bg-center"
            style={{
              backgroundImage: homeData.coverImage
                ? `url(${homeData.coverImage})`
                : "linear-gradient(135deg, #FDE2E4 0%, #FFF5F6 55%, #FFF8E8 100%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/55" />
            <div className="relative min-h-[340px] flex flex-col justify-between p-6 text-white">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                ✨ 我们的小空间
              </div>

              <div>
                <p className="text-sm text-white/90">
                  记录那些值得被珍藏的小事～📝
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight">
                  相爱的第 {daysTogether || 0} 天🥰
                </h1>
                <p className="mt-2 text-sm text-white/85">
                  每天都在慢慢积攒属于我们的回忆🧩
                </p>
              </div>
            </div>
          </div>
        </div>

        {editing ? (
          <div className="rounded-[24px] border border-[#F7E3E7] bg-white p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] space-y-5">
            <h3 className="text-[15px] font-semibold text-[#5E4B56]">
              编辑首页内容
            </h3>

            <div className="space-y-2">
              <label className="text-sm text-[#7B6A75]">上传首页背景照片</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                className="block w-full text-sm text-[#7D5A5A]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#7B6A75]">在一起开始日期</label>
              <input
                type="date"
                value={formatDateInput(homeData.togetherDate)}
                onChange={(e) =>
                  setHomeData((prev) => ({
                    ...prev,
                    togetherDate: e.target.value,
                  }))
                }
                className="w-full rounded-3xl border border-[#F3DADF] bg-[#FFFDFC] px-4 py-3 outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm text-[#7B6A75]">爱的沙漏⏳（最多 3 个）</label>

              {[0, 1, 2].map((index) => (
                <div key={index} className="grid grid-cols-1 gap-3">
                  <input
                    value={homeData.countdowns?.[index]?.title || ""}
                    onChange={(e) =>
                      updateCountdown(index, "title", e.target.value)
                    }
                    placeholder={`标题 ${index + 1}（例如：下一次见面）`}
                    className="w-full rounded-3xl border border-[#F3DADF] bg-[#FFFDFC] px-4 py-3 outline-none"
                  />

                  <input
                    type="date"
                    value={formatDateInput(homeData.countdowns?.[index]?.date)}
                    onChange={(e) =>
                      updateCountdown(index, "date", e.target.value)
                    }
                    className="w-full rounded-3xl border border-[#F3DADF] bg-[#FFFDFC] px-4 py-3 outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-sm text-[#7B6A75]">愿望清单💗（最多 3 个）</label>

              {[0, 1, 2].map((index) => (
                <input
                  key={index}
                  value={homeData.wishes?.[index] || ""}
                  onChange={(e) => updateWish(index, e.target.value)}
                  placeholder={`愿望 ${index + 1}`}
                  className="w-full rounded-3xl border border-[#F3DADF] bg-[#FFFDFC] px-4 py-3 outline-none"
                />
              ))}
            </div>
          </div>
        ) : null}

    <div className="relative overflow-hidden rounded-[26px] border border-[#F7E3E7] bg-[#FFF8FA] px-5 py-5 shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
  <div
    className="pointer-events-none absolute inset-0 opacity-40"
    style={{
      backgroundImage:
        "radial-gradient(circle at 12px 12px, rgba(235,162,177,0.18) 1.2px, transparent 1.2px)",
      backgroundSize: "22px 22px",
    }}
  />

  <div className="relative flex items-start justify-between gap-3">
    <div>
      <h3 className="text-[15px] font-semibold text-[#5E4B56]">
        爱的沙漏⏳
      </h3>
      <p className="mt-1 text-[12px] text-[#9C8A93]">
        把想见面的日子，告诉给未来
      </p>
    </div>

    <div className="rounded-full bg-[#FFDCE6] px-2.5 py-1 text-[12px] text-[#D97A8C] shadow-sm">
      🧸
    </div>
  </div>

  <div className="relative mt-4 space-y-3">
    {countdownItems.length === 0 ? (
      <div className="rounded-2xl bg-white/75 px-4 py-3 text-[13px] text-[#8B7A84]">
        还没有设置倒计时
      </div>
    ) : (
      countdownItems.map((item, index) => {
        const days = getDaysToDate(item.date);

        return (
          <div
            key={`${item.title}-${index}`}
            className="flex items-center justify-between gap-4 rounded-2xl bg-white/75 px-4 py-3"
          >
            <span className="text-[14px] text-[#5E4B56]">
              {item.title || `倒计时 ${index + 1}`}
            </span>
            <span className="text-[13px] text-[#8B7A84] whitespace-nowrap">
              {days === null
                ? "未设置日期"
                : days > 0
                ? `还有 ${days} 天`
                : days === 0
                ? "就是今天"
                : `已过去 ${Math.abs(days)} 天`}
            </span>
          </div>
        );
      })
    )}
  </div>
</div>

 <div className="relative overflow-hidden rounded-[26px] border border-[#EEE5FA] bg-[#FAF7FF] px-5 py-5 shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
  <div
    className="pointer-events-none absolute inset-0 opacity-35"
    style={{
      backgroundImage:
        "radial-gradient(circle at 12px 12px, rgba(205,182,255,0.18) 1.2px, transparent 1.2px)",
      backgroundSize: "22px 22px",
    }}
  />

  <div className="relative flex items-start justify-between gap-3">
    <div>
      <h3 className="text-[15px] font-semibold text-[#5E4B56]">
        愿望清单💗
      </h3>
      <p className="mt-1 text-[12px] text-[#9C8A93]">
        把想一起做的小事，悄悄存起来
      </p>
    </div>

    <div className="rounded-full bg-[#FFDCE6] px-2.5 py-1 text-[12px] text-[#D97A8C] shadow-sm">
      🎀
    </div>
  </div>

  <div className="relative mt-4 space-y-3">
    {previewWishes.length === 0 ? (
      <div className="rounded-2xl bg-white/75 px-4 py-3 text-[13px] text-[#8B7A84]">
        还没有写下愿望
      </div>
    ) : (
      previewWishes.map((wish, index) => (
        <div
          key={`${wish}-${index}`}
          className="rounded-2xl bg-white/75 px-4 py-3 text-[14px] text-[#5E4B56]"
        >
          {wish}
        </div>
      ))
    )}
  </div>
</div>
      </div>
    </div>
  );
}
function RecordsPage({ records, filter, setFilter, onDelete, onAdd }) {
const filterTabs = [
  { key: "all", label: "全部", icon: "🗂️" },
  { key: "happy", label: "开心", icon: "😄" },
  { key: "touched", label: "感动", icon: "🥹" },
  { key: "miss", label: "想念", icon: "💭" },
  { key: "calm", label: "平和", icon: "🌿" },
  { key: "sad", label: "难过", icon: "😔" },
  { key: "disappointed", label: "失望", icon: "🥀" },
  { key: "angry", label: "生气", icon: "😤" },
];

  return (
    <div className="min-h-screen bg-cheese px-5 pt-6 pb-28 relative">
      <div className="max-w-xl mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#7D5A5A]">MOMENT</h2>
          <p className="text-[13px] text-[#8B7470] mt-1">
            把那些值得珍藏的时刻，安放在这里。
          </p>
        </div>

<div className="mb-5 overflow-x-auto">
  <div className="flex gap-2 pb-1 min-w-max">
    {filterTabs.map((tab) => {
      const active = filter === tab.key;
      return (
        <button
          key={tab.key}
          onClick={() => setFilter(tab.key)}
          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] transition inline-flex items-center gap-1.5 ${
            active
              ? "bg-primary text-white"
              : "bg-transparent text-[#8B7470]"
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      );
    })}
  </div>
</div>

        <div className="space-y-5">
          {records.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="text-base font-semibold text-[#5E4B56]">
                这里还没有记录
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-[13px] leading-6 text-[#8B7A84]">
                写下今天的开心、难过，或者一个平淡的小瞬间吧～
              </p>
            </div>
          ) : (
            records.map((record) => {
              const meta = recordCategoryMap[record.type];
              return (
                <article
                  key={record.id}
                  className="border-b border-[#F1E4E1] pb-5"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] ${meta.bg} ${meta.text}`}
                    >
                      {meta.icon} {meta.label}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#AA98A2]">
                        {record.date}
                      </span>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="text-[11px] text-[#B07D78]"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  {record.title ? (
                    <h3 className="text-[15px] font-semibold text-[#5E4B56] leading-6">
                      {record.title}
                    </h3>
                  ) : null}

                  <p className="mt-1 text-[14px] leading-7 text-[#6B5B57] whitespace-pre-wrap">
                    {record.content}
                  </p>
                </article>
              );
            })
          )}
        </div>
      </div>

      <JellyButton
        onClick={onAdd}
        className="fixed bottom-24 right-5 h-14 w-14 bg-primary text-white text-3xl font-bold flex items-center justify-center shadow-lg rounded-full"
      >
        +
      </JellyButton>
    </div>
  );
}


function AddPage({ addMode, onSave, onBack }) {
  const [recordType, setRecordType] = useState("happy");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const remaining = 300 - content.length;

  const recordOptions = [
    { key: "happy", label: "开心", icon: "😄" },
    { key: "touched", label: "感动", icon: "🥹" },
    { key: "miss", label: "想念", icon: "💭" },
    { key: "calm", label: "平和", icon: "🌿" },
    { key: "sad", label: "难过", icon: "😔" },
    { key: "disappointed", label: "失望", icon: "🥀" },
    { key: "angry", label: "生气", icon: "😤" },
  ];

  useEffect(() => {
    if (addMode === "record" && titleRef.current) {
      titleRef.current.focus();
    }
  }, [addMode]);

  const submitRecord = () => {
    if (!title.trim() && !content.trim()) return;

    onSave({
      id: Date.now().toString(),
      type: recordType,
      title: title.trim(),
      content: content.trim(),
      date: new Date().toLocaleDateString("zh-CN", {
        month: "long",
        day: "numeric",
      }),
      createdAt: Date.now(),
    });
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-cheese px-5 pt-6 pb-10">
      <div className="max-w-md mx-auto">
        <div className="mb-5 flex items-center justify-between">
          <button onClick={onBack} className="text-sm text-[#8B7470]">
            ← 返回
          </button>

          <div className="text-sm text-[#8B7470]">
            {recordCategoryMap[recordType]?.label}
          </div>

          <button
            onClick={submitRecord}
            className="text-sm font-medium text-[#D97A8C]"
          >
            保存
          </button>
        </div>

        <div className="mb-5 overflow-x-auto">
          <div className="flex gap-2 pb-1 min-w-max">
            {recordOptions.map((item) => {
              const active = recordType === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setRecordType(item.key)}
                  className={`rounded-full px-3 py-1.5 text-[13px] transition ${
                    active
                      ? "bg-primary text-white"
                      : "bg-transparent text-[#8B7470]"
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            placeholder="标题"
            className="w-full bg-transparent text-[22px] font-semibold text-[#5E4B56] placeholder:text-[#B7A6A2] outline-none"
          />

          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= 300) setContent(e.target.value);
            }}
            rows={12}
            placeholder="写下这一刻的感受……"
            className="mt-4 w-full resize-none bg-transparent outline-none text-[14px] leading-8 text-[#5F514E] placeholder:text-[#B7A6A2]"
          />

          <div className="mt-4 text-right text-[11px] text-[#A2908D]">
            {remaining}/300
          </div>
        </div>
      </div>
    </div>
  );
}
export default function Page() {
  const [page, setPage] = useState("welcome");

  const [records, setRecords] = useState([]);

  const [inviteCode, setInviteCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [message, setMessage] = useState("");

  const [filter, setFilter] = useState("all");

  const [addMode, setAddMode] = useState("record");
  const [returnPage, setReturnPage] = useState("records");

const [homeData, setHomeData] = useState({
  togetherDate: "2025-04-15",
  coverImage: "",
  countdowns: [
    { title: "下一次见面🥰", date: "2026-03-20" },
    { title: "意大利之旅✈️", date: "2026-06-20" },
    { title: "Coldplay演唱会🎵", date: "2027-04-20" },
  ],
  wishes: ["一起去意大利🇮🇹", "一起做一顿饭😋", "一起去看一场NBA🏀"],
});

  useEffect(() => {
    const savedRecords = localStorage.getItem(RECORDS_KEY);
    const savedInvite = localStorage.getItem(INVITE_KEY);
    const savedHome = localStorage.getItem(HOME_KEY);

    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (e) {
        console.error("Failed to parse records", e);
      }
    }

    if (savedInvite) setInviteCode(savedInvite);

if (savedHome) {
  try {
    const parsedHome = JSON.parse(savedHome);

    const migratedCountdowns = parsedHome.countdowns
      ? parsedHome.countdowns
      : [
          {
            title: parsedHome.countdownTitle || "下一次见面",
            date: parsedHome.countdownDate || parsedHome.anniversaryDate || "",
          },
          { title: "", date: "" },
          { title: "", date: "" },
        ];

    const migratedWishes = parsedHome.wishes
      ? [...parsedHome.wishes, "", "", ""].slice(0, 3)
      : ["", "", ""];

    setHomeData((prev) => ({
      ...prev,
      ...parsedHome,
      countdowns: migratedCountdowns,
      wishes: migratedWishes,
    }));
  } catch (e) {
    console.error("Failed to parse home data", e);
  }
}
  }, []);

  useEffect(() => {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  }, [records]);


  useEffect(() => {
    localStorage.setItem(HOME_KEY, JSON.stringify(homeData));
  }, [homeData]);

  const filteredRecords = useMemo(() => {
    const sorted = [...records].sort((a, b) => b.createdAt - a.createdAt);
    if (filter === "all") return sorted;
    return sorted.filter((item) => item.type === filter);
  }, [records, filter]);


  const handleGenerateCode = () => {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setInviteCode(code);
    localStorage.setItem(INVITE_KEY, code);
    setMessage("邀请码已生成。当前仅支持本浏览器内测试。");
  };

  const handleEnterSpace = () => {
    const cleanInput = inputCode.trim().toUpperCase();

    if (!inviteCode) {
      setMessage("还没有生成邀请码，请先点击“生成邀请码”。");
      return;
    }

    if (!cleanInput) {
      setMessage("请输入邀请码。");
      return;
    }

    if (cleanInput !== inviteCode) {
      setMessage("邀请码不正确，或者这不是生成邀请码的那个浏览器。");
      return;
    }

    setMessage("");
    setPage("home");
  };

const handleSave = (item) => {
  setRecords((prev) => [item, ...prev]);
  setPage(returnPage);
};

  const handleDeleteRecord = (id) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
  };


  if (page === "welcome") {
    return (
      <WelcomePage
        onStart={() => setPage("home")}
        onInvite={() => {
          setMessage("");
          setPage("pair");
        }}
      />
    );
  }

  if (page === "pair") {
    return (
      <PairPage
        inviteCode={inviteCode}
        onGenerateCode={handleGenerateCode}
        onEnterSpace={handleEnterSpace}
        inputCode={inputCode}
        setInputCode={setInputCode}
        onBack={() => setPage("home")}
        message={message}
      />
    );
  }

  if (page === "add") {
    return (
      <AddPage
        addMode={addMode}
        onSave={handleSave}
        onBack={() => setPage(returnPage)}
      />
    );
  }

  return (
    <>
      {page === "home" && (
        <HomePage
          homeData={homeData}
          setHomeData={setHomeData}
          onGoPair={() => {
            setMessage("");
            setPage("pair");
          }}
        />
      )}

      {page === "records" && (
        <RecordsPage
          records={filteredRecords}
          filter={filter}
          setFilter={setFilter}
          onDelete={handleDeleteRecord}
          onAdd={() => {
            setAddMode("record");
            setReturnPage("records");
            setPage("add");
          }}
        />
      )}


      <BottomNav page={page} setPage={setPage} />
    </>
  );
}
