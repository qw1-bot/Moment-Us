"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const RECORDS_KEY = "moment-us-records-v2";
const TIMELINE_KEY = "moment-us-timeline-v2";
const INVITE_KEY = "moment-us-invite-code";
const HOME_KEY = "moment-us-home-v2";

const recordCategoryMap = {
  happy: {
    label: "幸福",
    icon: "💗",
    bg: "bg-[#FFF1F4]",
    border: "border-[#F7D6DE]",
    text: "text-[#C97C8A]",
  },
  sad: {
    label: "难过",
    icon: "☁️",
    bg: "bg-[#F4F1FF]",
    border: "border-[#DDD5FF]",
    text: "text-[#8B79C9]",
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
  const diff = now.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
}

function getDaysToAnniversary(anniversaryDate) {
  if (!anniversaryDate) return null;
  const today = new Date();
  const target = new Date(anniversaryDate);

  if (Number.isNaN(target.getTime())) return null;

  const currentYearTarget = new Date(
    today.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  let next = currentYearTarget;
  if (next.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
    next = new Date(today.getFullYear() + 1, target.getMonth(), target.getDate());
  }

  const diff = next.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function BottomNav({ page, setPage }) {
  const items = [
    { key: "home", label: "首页", icon: "🏠" },
    { key: "records", label: "记录", icon: "📖" },
    { key: "timeline", label: "时间轴", icon: "🗺️" },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2 rounded-full border border-[#F3DADF] bg-white/95 px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.10)] backdrop-blur">
      <div className="grid grid-cols-3 items-center">
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
              用来记录那些值得被记住的瞬间
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
              把邀请码分享给对方，一起进入同一个空间。
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
              输入后，就能进入你们的共同空间。
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

function HomePage({
  homeData,
  setHomeData,
  onGoPair,
}) {
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  const daysTogether = getDaysTogether(homeData.togetherDate);
  const daysToAnniversary = getDaysToAnniversary(homeData.anniversaryDate);

  const previewWishes = homeData.wishes.filter(Boolean).slice(0, 2);

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

  return (
    <div className="min-h-screen bg-cheese px-5 pt-6 pb-28">
      <div className="max-w-md mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={onGoPair} className="text-sm text-[#8B7470]">
            邀请
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
                  记录那些值得被珍藏的小事～
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight">
                  在一起第 {daysTogether || 0} 天
                </h1>
                <p className="mt-2 text-sm text-white/85">
                  每一天都在慢慢积攒属于我们的回忆
                </p>
              </div>
            </div>
          </div>
        </div>

        {editing ? (
          <div className="rounded-[24px] border border-[#F7E3E7] bg-white p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] space-y-4">
            <h3 className="text-lg font-semibold text-[#5E4B56]">编辑首页内容</h3>

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

            <div className="space-y-2">
              <label className="text-sm text-[#7B6A75]">纪念日日期</label>
              <input
                type="date"
                value={formatDateInput(homeData.anniversaryDate)}
                onChange={(e) =>
                  setHomeData((prev) => ({
                    ...prev,
                    anniversaryDate: e.target.value,
                  }))
                }
                className="w-full rounded-3xl border border-[#F3DADF] bg-[#FFFDFC] px-4 py-3 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#7B6A75]">
                愿望清单（每行写一条）
              </label>
              <textarea
                rows={4}
                value={homeData.wishes.join("\n")}
                onChange={(e) =>
                  setHomeData((prev) => ({
                    ...prev,
                    wishes: e.target.value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="一起去看海&#10;一起做一顿饭"
                className="w-full rounded-3xl border border-[#F3DADF] bg-[#FFFDFC] px-4 py-3 outline-none resize-none text-[15px] leading-7 text-[#5F514E]"
              />
            </div>
          </div>
        ) : null}

        <div className="rounded-[24px] border border-[#F7E3E7] bg-white p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1F4] text-xl">
              📅
            </div>
            <div>
              <p className="text-sm text-[#8B7A84]">距离下一次纪念日还有</p>
              <h2 className="text-2xl font-semibold text-[#5E4B56]">
                {daysToAnniversary ?? 0} 天
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#F7E3E7] bg-white p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#5E4B56]">
                想一起完成的小事
              </h3>
              <p className="mt-1 text-sm text-[#8B7A84]">
                把未来的小期待，也轻轻放进这里
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF1F4] text-lg">
              💞
            </div>
          </div>

          {previewWishes.length === 0 ? (
            <div className="rounded-3xl bg-[#FFF8FA] px-4 py-5 text-sm text-[#8B7A84] text-center leading-6">
              这里还没有愿望清单。
              <br />
              先写下一件你们想一起完成的小事吧。
            </div>
          ) : (
            <div className="space-y-3">
              {previewWishes.map((wish, index) => (
                <div
                  key={`${wish}-${index}`}
                  className="rounded-2xl bg-[#FFF8FA] px-4 py-3 text-sm text-[#6F5D67]"
                >
                  ✨ {wish}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecordsPage({ records, filter, setFilter, onDelete, onAdd }) {
  const filterTabs = [
    { key: "all", label: "全部" },
    { key: "happy", label: "幸福" },
    { key: "sad", label: "难过" },
  ];

  return (
    <div className="min-h-screen bg-cheese px-5 pt-6 pb-28 relative">
      <div className="max-w-md mx-auto">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#7D5A5A]">记录</h2>
          <p className="text-sm text-[#8B7470] mt-1">
            把那些值得记住的瞬间，轻轻收好。
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {filterTabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm border ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-[#7D5A5A] border-[#F3DADF]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="rounded-[28px] border border-[#F5D6DC] bg-white/85 p-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF1F4] text-3xl">
                📖
              </div>
              <h3 className="text-lg font-semibold text-[#5E4B56]">
                这里还没有记录
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#8B7A84]">
                去写下一个让你心软、开心，或者有点委屈的瞬间吧。
              </p>
            </div>
          ) : (
            records.map((record) => {
              const meta = recordCategoryMap[record.type];
              return (
                <article
                  key={record.id}
                  className="rounded-[24px] border border-[#F7E3E7] bg-white p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${meta.bg} ${meta.text}`}
                    >
                      {meta.icon} {meta.label}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#AA98A2]">{record.date}</span>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="text-xs text-[#B07D78]"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-[#5E4B56]">
                    {record.title || "没有标题的小瞬间"}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#7C6C76] whitespace-pre-wrap">
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

function TimelinePage({ timelineItems, onAdd, onDelete }) {
  const placesCount = new Set(
    timelineItems.map((item) => item.place.trim()).filter(Boolean)
  ).size;

  return (
    <div className="min-h-screen bg-cheese px-5 pt-6 pb-28 relative">
      <div className="max-w-md mx-auto">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#7D5A5A]">时间轴</h2>
          <p className="text-sm text-[#8B7470] mt-1">
            把我们一起走过的地方和时刻，慢慢串起来。
          </p>
        </div>

        <div className="mb-5 rounded-[24px] border border-[#F7E3E7] bg-white p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1F4] text-xl">
              🗺️
            </div>
            <div>
              <p className="text-sm text-[#8B7A84]">我们一起去过</p>
              <h2 className="text-2xl font-semibold text-[#5E4B56]">
                {placesCount} 个地方
              </h2>
            </div>
          </div>
        </div>

        <div className="relative pl-6">
          <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-[#F1D7DE]" />

          <div className="space-y-6">
            {timelineItems.length === 0 ? (
              <div className="rounded-[28px] border border-[#F5D6DC] bg-white/85 p-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF1F4] text-3xl">
                  📍
                </div>
                <h3 className="text-lg font-semibold text-[#5E4B56]">
                  时间轴还是空的
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#8B7A84]">
                  去记下你们一起去过的地方，或者一个特别的日子吧。
                </p>
              </div>
            ) : (
              timelineItems.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[20px] top-5 h-4 w-4 rounded-full border-4 border-[#FFFDF2] bg-[#EBA2B1]" />

                  <article className="rounded-[24px] border border-[#F7E3E7] bg-white p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="text-xs text-[#AA98A2]">{item.date}</div>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-xs text-[#B07D78]"
                      >
                        删除
                      </button>
                    </div>

                    <div className="mb-2 inline-block rounded-full bg-[#FFF1F4] px-3 py-1 text-xs text-[#C97C8A]">
                      {item.place}
                    </div>

                    <h3 className="text-base font-semibold text-[#5E4B56]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#7C6C76] whitespace-pre-wrap">
                      {item.description}
                    </p>
                  </article>
                </div>
              ))
            )}
          </div>
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

  const [timelineDate, setTimelineDate] = useState("");
  const [timelinePlace, setTimelinePlace] = useState("");
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineDescription, setTimelineDescription] = useState("");

  const remaining = 200 - content.length;

  const recordOptions = [
    { key: "happy", icon: "💗", label: "幸福" },
    { key: "sad", icon: "☁️", label: "难过" },
  ];

  const submitRecord = () => {
    if (!content.trim()) return;

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

  const submitTimeline = () => {
    if (!timelinePlace.trim() || !timelineTitle.trim()) return;

    onSave({
      id: Date.now().toString(),
      date:
        timelineDate ||
        new Date().toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      place: timelinePlace.trim(),
      title: timelineTitle.trim(),
      description: timelineDescription.trim(),
      createdAt: Date.now(),
    });
  };

  return (
    <div className="min-h-screen bg-cheese px-5 py-8">
      <div className="max-w-md mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-sm text-[#8B7470]">
            ← 返回
          </button>
          <h2 className="text-xl font-bold text-[#7D5A5A]">
            {addMode === "record" ? "添加记录" : "添加时间轴"}
          </h2>
          <div className="w-10" />
        </div>

        {addMode === "record" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              {recordOptions.map((item) => {
                const active = recordType === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setRecordType(item.key)}
                    className={`rounded-3xl px-3 py-4 shadow-md transition-all active:scale-95 ${
                      active
                        ? "bg-primary text-white"
                        : "bg-white text-[#7D5A5A]"
                    }`}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-sm font-medium">{item.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-[30px] border-2 border-dashed border-[#F2C9D2] bg-white p-4 shadow-md space-y-4 relative">
              <div className="absolute -right-3 -top-3 rotate-12 rounded-full bg-[#FFD9A8] px-3 py-1 text-xs text-[#8C6A3C] shadow-sm">
                today
              </div>
              <div className="absolute -left-3 top-14 -rotate-12 rounded-full bg-[#FAD1DC] px-3 py-1 text-xs text-[#B16478] shadow-sm">
                sweet note
              </div>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给这一刻起个小标题"
                className="w-full rounded-3xl border border-[#F3DADF] bg-[#FFFDFC] px-4 py-3 outline-none"
              />

              <div className="rounded-3xl bg-[#FFFDFC] border border-[#F3DADF] p-4">
                <textarea
                  value={content}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) setContent(e.target.value);
                  }}
                  rows={7}
                  placeholder="不需要写得完美，真实就好"
                  className="w-full resize-none bg-transparent outline-none text-[15px] leading-7 text-[#5F514E] placeholder:text-[#B7A6A2]"
                />

                <div className="text-right text-xs text-[#A2908D] mt-2">
                  {remaining}/200
                </div>
              </div>
            </div>

            <JellyButton
              onClick={submitRecord}
              className="w-full bg-primary py-4 text-white font-semibold text-lg"
            >
              存下这一刻
            </JellyButton>
          </>
        ) : (
          <>
            <div className="rounded-[30px] border-2 border-dashed border-[#F2C9D2] bg-white p-4 shadow-md space-y-4 relative">
              <div className="absolute -right-3 -top-3 rotate-12 rounded-full bg-[#FFD9A8] px-3 py-1 text-xs text-[#8C6A3C] shadow-sm">
                place
              </div>
              <div className="absolute -left-3 top-14 -rotate-12 rounded-full bg-[#FAD1DC] px-3 py-1 text-xs text-[#B16478] shadow-sm">
                memory
              </div>

              <input
                type="date"
                value={timelineDate}
                onChange={(e) => setTimelineDate(e.target.value)}
                className="w-full rounded-3xl border border-[#F3DADF] bg-[#FFFDFC] px-4 py-3 outline-none"
              />

              <input
                value={timelinePlace}
                onChange={(e) => setTimelinePlace(e.target.value)}
                placeholder="一起去过的地方"
                className="w-full rounded-3xl border border-[#F3DADF] bg-[#FFFDFC] px-4 py-3 outline-none"
              />

              <input
                value={timelineTitle}
                onChange={(e) => setTimelineTitle(e.target.value)}
                placeholder="给这一天起个名字"
                className="w-full rounded-3xl border border-[#F3DADF] bg-[#FFFDFC] px-4 py-3 outline-none"
              />

              <textarea
                value={timelineDescription}
                onChange={(e) => setTimelineDescription(e.target.value)}
                rows={5}
                placeholder="写下这一天发生了什么"
                className="w-full rounded-3xl border border-[#F3DADF] bg-[#FFFDFC] px-4 py-3 outline-none resize-none text-[15px] leading-7 text-[#5F514E]"
              />
            </div>

            <JellyButton
              onClick={submitTimeline}
              className="w-full bg-primary py-4 text-white font-semibold text-lg"
            >
              存进时间轴
            </JellyButton>
          </>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const [page, setPage] = useState("welcome");

  const [records, setRecords] = useState([]);
  const [timelineItems, setTimelineItems] = useState([]);

  const [inviteCode, setInviteCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [message, setMessage] = useState("");

  const [filter, setFilter] = useState("all");

  const [addMode, setAddMode] = useState("record");
  const [returnPage, setReturnPage] = useState("records");

  const [homeData, setHomeData] = useState({
    togetherDate: "2025-04-15",
    anniversaryDate: "2025-04-15",
    coverImage: "",
    wishes: ["一起去看海", "一起做一顿饭"],
  });

  useEffect(() => {
    const savedRecords = localStorage.getItem(RECORDS_KEY);
    const savedTimeline = localStorage.getItem(TIMELINE_KEY);
    const savedInvite = localStorage.getItem(INVITE_KEY);
    const savedHome = localStorage.getItem(HOME_KEY);

    if (savedRecords) {
      try {
        const parsed = JSON.parse(savedRecords);

        const migrated = parsed.map((item) => {
          if (item.type === "moved") {
            return { ...item, type: "happy" };
          }
          if (item.type === "conflict") {
            return { ...item, type: "sad" };
          }
          if (item.type === "daily") {
            return { ...item, type: "happy" };
          }
          return item;
        });

        setRecords(migrated);
      } catch (e) {
        console.error("Failed to parse records", e);
      }
    }

    if (savedTimeline) {
      try {
        setTimelineItems(JSON.parse(savedTimeline));
      } catch (e) {
        console.error("Failed to parse timeline", e);
      }
    }

    if (savedInvite) setInviteCode(savedInvite);

    if (savedHome) {
      try {
        setHomeData(JSON.parse(savedHome));
      } catch (e) {
        console.error("Failed to parse home data", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(TIMELINE_KEY, JSON.stringify(timelineItems));
  }, [timelineItems]);

  useEffect(() => {
    localStorage.setItem(HOME_KEY, JSON.stringify(homeData));
  }, [homeData]);

  const filteredRecords = useMemo(() => {
    const sorted = [...records].sort((a, b) => b.createdAt - a.createdAt);
    if (filter === "all") return sorted;
    return sorted.filter((item) => item.type === filter);
  }, [records, filter]);

  const sortedTimeline = useMemo(() => {
    return [...timelineItems].sort((a, b) => b.createdAt - a.createdAt);
  }, [timelineItems]);

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
    if (addMode === "record") {
      setRecords((prev) => [item, ...prev]);
    } else {
      setTimelineItems((prev) => [item, ...prev]);
    }
    setPage(returnPage);
  };

  const handleDeleteRecord = (id) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteTimeline = (id) => {
    setTimelineItems((prev) => prev.filter((item) => item.id !== id));
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

      {page === "timeline" && (
        <TimelinePage
          timelineItems={sortedTimeline}
          onDelete={handleDeleteTimeline}
          onAdd={() => {
            setAddMode("timeline");
            setReturnPage("timeline");
            setPage("add");
          }}
        />
      )}

      <BottomNav page={page} setPage={setPage} />
    </>
  );
}
