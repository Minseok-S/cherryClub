import { useState } from "react";

export function AuthForm({
  onSubmit,
  error,
  loading,
}: {
  onSubmit: (name: string, password: string) => void;
  error?: string;
  loading?: boolean;
}) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, password);
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-xl font-bold text-center">관리자 로그인</h1>
        <input
          type="tel"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 text-black"
          placeholder="이름 (예: 송민석)"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded border border-gray-300  text-black"
          placeholder="비밀번호"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "처리 중..." : "로그인"}
        </button>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </form>
    </div>
  );
}
