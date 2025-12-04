import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Building2, Search, Plus, Info, CircleChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { currentUser } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // handleSubmit func
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    };
  }, [location.search]);

  return (
    <header className="sticky top-0 z-50 bg-slate-700 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto py-4 px-3">

        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-400">Winn</span>
            <span className="text-slate-200">Estate</span>
            <Building2 color="#e2e8f0" className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.25} />
          </h1>
        </Link>

        <form onSubmit={handleSubmit} className="bg-slate-100 px-3 py-2 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search.."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button>
            <Search className="text-slate-500 w-5 h-5" />
          </button>
        </form>

        <ul className="flex items-center gap-3">
          <Link to='/about'>
            <li className="hidden sm:inline-flex items-center gap-1 text-sm text-slate-200 hover:underline">About <Info className="w-4 h-4" /></li>
          </Link>

          <Link to='/create-listing'>
            <li className="hidden sm:inline-flex items-center gap-1 text-sm text-slate-200 hover:underline">Create Listing <Plus className="w-4 h-4" /></li>
          </Link>

          <Link to='/profile'>
            {
              currentUser ? (
                <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="profile" />
              ) :
                <li className="text-slate-200 hover:underline">Sign In</li>
            }
          </Link>

          {/* mobile dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CircleChevronDown color="#e2e8f0" className="cursor-pointer" strokeWidth={2.25} />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40 bg-slate-700 border border-slate-500 text-slate-200">
                <DropdownMenuItem className="hover:bg-red-100">
                  <Link to='/about' className="w-full py-1">
                    <li className="w-full flex items-center justify-between text-sm text-slate-200 hover:text-slate-300">About <Info className="w-4 h-4" /></li>
                  </Link>
                </DropdownMenuItem>

                <hr className="border-slate-500" />
                <DropdownMenuItem>
                  <Link to='/create-listing' className="w-full py-1">
                    <li className="w-full flex items-center justify-between text-sm text-slate-200 hover:text-slate-300">Create Listing <Plus className="w-5 h-5" /></li>
                  </Link>
                </DropdownMenuItem>

                <hr className="border-slate-500" />

                <DropdownMenuItem>
                  <p className="w-full flex items-center justify-between py-1 text-sm text-slate-200 hover:text-slate-300">
                    Logout <LogOut className="w-4 h-4" />
                  </p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ul>

      </div>
    </header>
  );
};

export default Header;
