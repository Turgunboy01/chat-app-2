import React from "react";
import avatar from "../../../assets/avatar.png";
import { MdMoreHoriz } from "react-icons/md";
import { useUserStore } from "../../../utils/userStore";

const UserInfo = ({ handleSitebar, clickSitebar }) => {
  const { currentUser } = useUserStore();

  return (
    <div className="flex justify-between items-center p-7">
      <div className="flex items-center gap-5">
        <img
          src={currentUser.avatar || avatar}
          className={`${
            clickSitebar ? "block" : "hidden"
          } sm:block w-[40px] h-[40px] rounded-full`}
          alt="avatar"
        />
        <h1
          className={` ${
            clickSitebar
              ? " text-[18px] sm:text-[25px]"
              : "text-[0] sm:text-[16px]"
          } font-semibold`}
        >
          {currentUser.username}
        </h1>
      </div>
      <MdMoreHoriz
        onClick={() => handleSitebar()}
        className="text-white text-[25px]"
      />
    </div>
  );
};

export default UserInfo;
