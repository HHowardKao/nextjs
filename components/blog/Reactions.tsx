import { PiHandsClapping } from "react-icons/pi";
import { FaRegBookmark, FaRegComment } from "react-icons/fa";
const Reactions = () => {
  return (
    <div className="flex justify-between items-center w-full text-sm">
      <div className="flex items-center gap-4">
        <span className="mr-4 flex items-center gap-1 cursor-pointer">
          <PiHandsClapping size={20} />
          {7}
        </span>
        <span className="flex items-center gap-1 cursor-pointer">
          <FaRegComment size={18} />
          {3}
        </span>
      </div>
      <div>
        <FaRegBookmark size={18} />
      </div>
    </div>
  );
};

export default Reactions;
