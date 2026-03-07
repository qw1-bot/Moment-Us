"use client";

import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "moment-us-records";
const INVITE_KEY = "moment-us-invite-code";

const categoryMap = {
  moved: {
    label: "感动",
    icon: "💛",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  conflict: {
    label: "冲突",
    icon: "🌧️",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  daily: {
    label: "日常",
    icon: "🌱",
    bg: "bg-green-50",
    border: "border-green-200",
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

function WelcomePage({ onStart, onInvite }) {
  return (
    <div className="min-h-screen bg-cheese px-6 py-10 flex flex-col justify-center items-center text-center">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4">
          <div className="text-6xl">🧸💌</div>
          <h1 className="text-3xl font-bold text-roseBrown leading-snug">
            Moment Us
          </h1>
          <p className="text-base leading-7 text-[#6B5B57] px-2">
            一个只属于你们的空间，用来记录那些值得被记住的瞬间
          </p>
        </div>

        <div className="space-y-4">
          <JellyButton
            onClick={onStart}
            className="w-full bg-primary px-6 py-4 text-lg font-semibold text-white"
          >
            开始记录
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
            不是绑定账号，而是一起拥有一个能安心记录彼此故事的小角落。
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
              输入后，就能建立属于你们的共同空间。
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
            进入我们的空间
          </JellyButton>
        </div>
      </div>
    </div>
  );
}

function TimelinePage({ records, onAdd, onGoPair, filter, setFilter, onDelete }) {
  const filterTabs = [
    { key: "all", label: "全部" },
    { key: "moved", label: "感动" },
    { key: "conflict", label: "冲突" },
    { key: "daily", label: "日常" },
  ];

  return (
    <div className="min-h-screen bg-cheese px-5 pt-8 pb-24 relative">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="w-16" />
          <h2 className="text-2xl font-bold text-center text-[#7D5A5A]">
            我们的记录
          </h2>
          <button onClick={onGoPair} className="text-sm text-[#8B7470]">
            邀请
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {filterTabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${
                  active
                    ? "bg-primary text-white"
                    : "bg-white text-[#7D5A5A]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative pl-6">
          <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-[#F3C8C3]" />

          <div className="space-y-5">
            {records.length === 0 ? (
              <div className="rounded-3xl bg-white shadow-md p-6 text-center text-[#8B7470] leading-7">
                这里还没有记录。
                <br />
                从一个小小的瞬间开始吧。
              </div>
            ) : (
              records.map((record) => {
                const meta = categoryMap[record.type];
                return (
                  <div key={record.id} className="relative">
                    <div className="absolute -left-6 top-6 h-4 w-4 rounded-full bg-primary border-4 border-[#FFFDF2]" />

                    <div
                      className={`rounded-3xl border ${meta.border} ${meta.bg} shadow-md p-4 ml-2`}
                    >
                      <div className="flex items-center justify-between mb-2 gap-3">
                        <span className="text-sm font-semibold text-[#7D5A5A]">
                          {meta.icon} {meta.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#9B8884]">
                            {record.date}
                          </span>
                          <button
                            onClick={() => onDelete(record.id)}
                            className="text-xs text-[#B07D78]"
                          >
                            删除
                          </button>
                        </div>
                      </div>

                      <p className="text-[15px] leading-7 text-[#5F514E] whitespace-pre-wrap">
                        {record.content}
                      </p>

                      {record.type === "conflict" && record.repair ? (
                        <div className="mt-4 rounded-3xl bg-white/80 px-4 py-3">
                          <p className="text-xs font-semibold text-[#A0817D] mb-1">
                            后来我们怎么走出来的？
                          </p>
                          <p className="text-sm leading-6 text-[#6D5D59] whitespace-pre-wrap">
                            {record.repair}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <JellyButton
        onClick={onAdd}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 h-16 w-16 bg-primary text-white text-3xl font-bold flex items-center justify-center shadow-lg"
      >
        +
      </JellyButton>
    </div>
  );
}

function AddRecordPage({ onSave, onBack }) {
  const [type, setType] = useState("moved");
  const [content, setContent] = useState("");
  const [showRepair, setShowRepair] = useState(false);
  const [repair, setRepair] = useState("");

  useEffect(() => {
    if (type !== "conflict") {
      setShowRepair(false);
      setRepair("");
    }
  }, [type]);

  const remaining = 200 - content.length;

  const submit = () => {
    if (!content.trim()) return;

    onSave({
      id: Date.now().toString(),
      type,
      content: content.trim(),
      repair: type === "conflict" ? repair.trim() : "",
      date: new Date().toLocaleDateString("zh-CN", {
        month: "long",
        day: "numeric",
      }),
      createdAt: Date.now(),
    });
  };

  const options = [
    { key: "moved", icon: "💛", label: "感动" },
    { key: "conflict", icon: "🌧️", label: "冲突" },
    { key: "daily", icon: "🌱", label: "日常" },
  ];

  return (
    <div className="min-h-screen bg-cheese px-5 py-8">
      <div className="max-w-md mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-sm text-[#8B7470]">
            ← 返回
          </button>
          <h2 className="text-xl font-bold text-[#7D5A5A]">添加记录</h2>
          <div className="w-10" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {options.map((item) => {
            const active = type === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setType(item.key)}
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

        <div className="rounded-3xl bg-white shadow-md p-4">
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

        {type === "conflict" && (
          <div className="space-y-3">
            <JellyButton
              onClick={() => setShowRepair((prev) => !prev)}
              className="w-full bg-[#EAF4FF] py-3 text-[#5E7388] font-semibold"
            >
              后来我们怎么走出来的？
            </JellyButton>

            {showRepair && (
              <div className="rounded-3xl bg-white shadow-md p-4">
                <textarea
                  value={repair}
                  onChange={(e) => setRepair(e.target.value)}
                  rows={4}
                  placeholder="可以写下理解、道歉、拥抱，或某个让关系变柔软的瞬间"
                  className="w-full resize-none bg-transparent outline-none text-[14px] leading-7 text-[#5F514E] placeholder:text-[#B7A6A2]"
                />
              </div>
            )}
          </div>
        )}

        <JellyButton
          onClick={submit}
          className="w-full bg-primary py-4 text-white font-semibold text-lg"
        >
          存下这一刻
        </JellyButton>
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

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedInvite = localStorage.getItem(INVITE_KEY);

    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse records", e);
      }
    }

    if (savedInvite) setInviteCode(savedInvite);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

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
    setPage("timeline");
  };

  const handleSaveRecord = (record) => {
    setRecords((prev) => [record, ...prev]);
    setPage("timeline");
  };

  const handleDeleteRecord = (id) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
  };

  if (page === "welcome") {
    return (
      <WelcomePage
        onStart={() => setPage("timeline")}
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
        onBack={() => setPage("welcome")}
        message={message}
      />
    );
  }

  if (page === "add") {
    return (
      <AddRecordPage
        onSave={handleSaveRecord}
        onBack={() => setPage("timeline")}
      />
    );
  }

  return (
    <TimelinePage
      records={filteredRecords}
      onAdd={() => setPage("add")}
      onGoPair={() => {
        setMessage("");
        setPage("pair");
      }}
      filter={filter}
      setFilter={setFilter}
      onDelete={handleDeleteRecord}
    />
  );
}
