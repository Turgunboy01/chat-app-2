import React, { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import avatar from "../../../assets/avatar.png";
import { useUserStore } from "../../../utils/userStore";
import { useChatStore } from "../../../utils/chatStore";
import { db } from "../../../utils/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import AddUser from "./AddUser";

const ChatList = ({ clickSitebar }) => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");
  const { currentUser } = useUserStore();
  const { changeChat, chatId } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const item = res.data().chats;

        const promises = item.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });
        const chatrData = await Promise.all(promises);

        setChats(chatrData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  console.log(chats);
  return (
    <div className="">
      <div
        className={`${
          clickSitebar ? "flex" : "hidden"
        }  sm:flex gap-[20px] items-center py-3 px-5  border border-[#55545481] sm:border-0 rounded-lg mx-3`}
      >
        <div className="flex bg-[#10192899] overflow-hidden w-full  p-[10px] gap-3 rounded-xl">
          <FaSearch className="text-[20px]" />
          <input
            type="text"
            placeholder="Search Users..."
            className="  bg-transparent outline-0 border-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        {clickSitebar && (
          <BiPlus
            className="text-[40px] bg-[#10192899] p-[5px] rounded-xl"
            onClick={() => setAddMode(!addMode)}
          />
        )}
      </div>
      {filteredChats.map((chat) => (
        <div className="mt-2 sm:mt-5" onClick={() => handleSelect(chat)}>
          <div className="flex items-center gap-4 px-7 py-3 border-b border-[#74616181]">
            <img
              src={chat?.user?.avatar}
              className={` ${
                clickSitebar
                  ? "w-[50px] h-[50px] block"
                  : "w-[40px] h-[40px] hidden"
              }  rounded-full sm:block`}
              alt=""
            />
            <h1
              className={` ${
                clickSitebar
                  ? "block text-[16px] sm:text-[20px]"
                  : "hidden sm:text-[16px]"
              } font-semibold sm:block`}
            >
              {chat?.user?.username}
            </h1>
          </div>
        </div>
      ))}
      {addMode && <AddUser setAddMode={setAddMode} />}
    </div>
  );
};

export default ChatList;
