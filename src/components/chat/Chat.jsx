import React, { useEffect, useRef, useState } from "react";
import avatar from "../../assets/avatar.png";
import { IoCall } from "react-icons/io5";
import {
  FaMicrophone,
  FaRegImage,
  FaRegSmileWink,
  FaSearch,
  FaVideo,
} from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaRegFaceSmile } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import { useChatStore } from "../../utils/chatStore";
import { useUserStore } from "../../utils/userStore";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import upload from "../../utils/upload";

const Chat = ({ handleDetail }) => {
  const [chat, setChat] = useState();
  const [search, setSearch] = useState("");
  const [sarchClick, setSarchClick] = useState(false);
  const [emojiClick, setEmojiClick] = useState(false);
  const [text, setText] = useState("");

  const endRef = useRef(null);
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setEmojiClick(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;
    setText("");

    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        message: arrayUnion({
          sender: currentUser.id,
          text,
          createAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIds = [currentUser.id, user.id];

      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updateAt = Data.now();
          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
    setImg({
      file: null,
      url: "",
    });
  };
  const res = chat?.message
    ? chat.message.filter((filter) =>
        filter.text.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="w-full flex flex-col">
      <div className=" border-b border-[#55545481]">
        <div className=" p-5 relative flex justify-between items-center ">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || avatar}
              onClick={handleDetail}
              alt="avatar"
              className="w-[40px] sm:w-[60px] h-[40px] sm:h-[60px] rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h1 className="text-[16px] sm:text-[20px] font-semibold ">
                {user?.username}
              </h1>
              <p className="text-[12px] sm:text-[14px]">Lorem ipsum</p>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-4 ">
            {/* <IoCall className="text-[16px] sm:text-[20px]" /> */}
            {/* <FaVideo className="text-[16px] sm:text-[20px]" /> */}
            <IoMdInformationCircleOutline
              className="text-[16px] sm:text-[20px]"
              onClick={handleDetail}
            />
            <FaSearch
              className="text-[16px] sm:text-[20px]"
              onClick={() => setSarchClick(!sarchClick)}
            />
          </div>
        </div>
        <div className="">
          {sarchClick && (
            <input
              type="text"
              placeholder="Search chat..."
              value={search}
              className="text-[#222] w-full p-4 rounded-lg outline-0 border-0"
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </div>
      </div>
      <div className="flex-[1] overflow-y-scroll flex flex-col  w-full scrollDiv ">
        {res &&
          res.map((message) => (
            <div
              className={`w-full flex ${
                message.sender === currentUser?.id ? " own" : ""
              }`}
              key={message?.createAt}
            >
              <div className=" border flex flex-col justify-end bg-[#1119284d]  border-[#55545481] p-3 w-[90%] sm:w-[70%] lg:w-[50%] m-3 rounded-lg">
                {message.img && (
                  <img
                    src={message.img}
                    alt=""
                    className="w-full h-[300px]  rounded-lg object-contain"
                  />
                )}
                <div className="p-[10px] ">
                  <p>{message.text}</p>
                </div>
                <div className="">
                  {/* <img src={currentUser.avatar} className="w-[50px]" alt="" /> */}
                </div>
              </div>
            </div>
          ))}
      </div>
      {img.url && (
        <div className="w-full flex ">
          <div className=" border flex flex-col justify-end  bg-[#1119284d]  border-[#55545481] p-3 w-[40%] m-3 rounded-lg">
            <img
              src={img.url}
              alt=""
              className="w-full h-[200px] object-contain"
            />
          </div>
        </div>
      )}

      <div ref={endRef}></div>
      <div className="flex gap-2 sm:gap-5 items-center px-7 py-4">
        <div className="">
          <label htmlFor="img">
            <FaRegImage className="text-[25px] cursor-pointer" />
          </label>
          <input
            type="file"
            id="img"
            onChange={handleImg}
            style={{ display: "none" }}
          />
        </div>
        {/* <FaMicrophone className="text-[20px] cursor-pointer" /> */}
        <input
          type="text"
          className="w-full p-4 bg-[#1019285e] rounded-xl outline-0 border-0"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="relative">
          {emojiClick ? (
            <FaRegSmileWink
              onClick={() => setEmojiClick(!emojiClick)}
              className="text-[25px] cursor-pointer"
            />
          ) : (
            <FaRegFaceSmile
              onClick={() => setEmojiClick(!emojiClick)}
              className="text-[25px] cursor-pointer"
            />
          )}
          <div className="absolute bottom-10">
            <EmojiPicker open={emojiClick} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="py-3 px-4 sm:px-7 bg-blue-500 rounded-xl hover:bg-blue-400 cursor-pointer"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
