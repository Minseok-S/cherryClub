import { useState } from "react";

export function AuthForm({
  onSubmit,
  error,
}: {
  onSubmit: (password: string) => void;
  error?: string;
  loading?: boolean;
}) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded text-black"
          placeholder="관리자 인증 코드 입력"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          인증
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
    </div>
  );
}
