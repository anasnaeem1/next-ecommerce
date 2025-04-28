"use client";
import { useRouter } from "next/navigation";

const Search = () => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchInput = new FormData(e.currentTarget);
    const name = searchInput.get("name") as string;
    if (name) {
      router.push(`/list?name=${name}`);
    }
  };
  return (
    <form onSubmit={handleSearch} className="flex items-center relative w-full">
      <svg
        className="absolute left-4 w-4 h-4 fill-[#9e9ea7]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.53 20.47l-4.8-4.8a7.5 7.5 0 1 0-1.06 1.06l4.8 4.8a.75.75 0 0 0 1.06-1.06ZM10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" />
      </svg>

      <input
        type="text"
        name="name"
        placeholder="Search..."
        className="w-full h-[40px] pl-10 pr-4 rounded-lg bg-[#f3f3f4] text-[#0d0c22] placeholder-[#9e9ea7] border-2 border-transparent outline-none transition-all duration-300 ease-in-out focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(247,127,0,0.1)] hover:border-orange-400 hover:bg-white hover:shadow-[0_0_0_4px_rgba(247,127,0,0.1)]"
      />
    </form>
  );
};
export default Search;
