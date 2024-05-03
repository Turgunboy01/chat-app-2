import React from "react";
import UserInfo from "./userInfo/UserInfo";
import ChatList from "./chatList/ChatList";

const List = ({ clickSitebar, handleSitebar }) => {
  return (
    <div
      className={`${
        clickSitebar
          ? " max-w-[350px] lg:max-w-[450px] absolute h-full bg-[#101928fb]  md:bg-transparent "
          : "max-w-[80px] sm:max-w-[250px] bg-[#101928fb]"
      } w-full flex flex-col border-r border-[#55545481] transition-all z-30 sm:relative bg-[#101928fb]  `}
    >
      <UserInfo handleSitebar={handleSitebar} clickSitebar={clickSitebar} />
      <ChatList clickSitebar={clickSitebar} />
    </div>
  );
};

export default List;
