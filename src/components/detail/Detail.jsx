import React, { useEffect, useState } from "react";
import { useUserStore } from "../../utils/userStore";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useChatStore } from "../../utils/chatStore";
import { auth, db } from "../../utils/firebase";
import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CgClose } from "react-icons/cg";

const Detail = ({ clickDetail, handleDetail }) => {
  const [downClick, setDownClick] = useState(false);
  const { currentUser } = useUserStore();
  const [chat, setChat] = useState();
  console.log(currentUser);
  const { user, chatId, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isCurrentUserBlocked
          ? arrayRemove(user.id)
          : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const res = chat?.message.filter((fil) => fil.img);
  console.log(res, "detils");

  return (
    <div
      className={`${
        clickDetail ? "w-[200px] md:w-[300px]" : "w-0 hidden "
      }  absolute right-0 h-full bg-[#101928fb] z-30  overflow-hidden p-5`}
    >
      <div className="flex justify-end my-[10px]">
        <CgClose size={23} onClick={handleDetail} />
      </div>
      <div className="flex justify-center items-center flex-col gap-5">
        <img
          src={user?.avatar}
          className=" w-full h-[150px] object-cover rounded-lg"
          alt=""
        />
        <h2 className="text-[23px] font-semibold">{user?.username}</h2>
      </div>

      <div
        className="flex justify-between items-center py-4"
        onClick={() => setDownClick(!downClick)}
      >
        <h3>Shared Photos</h3>
        {downClick ? <MdKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
      </div>
      <div
        className={`grid grid-cols-2 gap-5 ${
          downClick ? "max-h-[33vh]" : "h-0"
        } overflow-y-scroll transition-[.3s] transition-[ease-in-out ] scrollDiv `}
      >
        {res &&
          res.map((item) => (
            <img
              src={item.img}
              className="w-[120px] h-[100px] rounded-lg"
              alt="a"
            />
          ))}
      </div>
      <div className="flex flex-col gap-5 mt-4">
        <button
          onClick={handleBlock}
          className="px-5 py-3 bg-[#e64a6980] hover:bg-[#dc143ccc]"
        >
          {isCurrentUserBlocked
            ? "You are blocked"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button
          className=" px-5 py-3 bg-[#1a73e8] hover:bg-[#6fadff8c] "
          onClick={() => auth.signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
