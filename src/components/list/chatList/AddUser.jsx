import React, { useState } from "react";
import avatar from "../../../assets/avatar.png";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { useUserStore } from "../../../utils/userStore";
const AddUser = ({ setAddMode }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    try {
      const useRef = collection(db, "users");
      const q = query(useRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (error) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          update: Date.now(),
        }),
      });
      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          update: Date.now(),
        }),
      });
      setAddMode(false);
      console.log(newChatRef.id);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(user, "user");
  return (
    <div className="addUser p-[30px] w-max h-max rounded-lg absolute top-0 right-0 left-0 bottom-0  m-auto bg-[#111928cc]">
      <form onSubmit={handleSubmit} className="flex gap-5">
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="p-5 rounded-xl border-0 outline-0 text-[#333]"
        />
        <button className="p-5 bg-[#1a73e8] rounded-xl">Search</button>
      </form>
      {user && (
        <div className="mt-[50px] flex justify-between items-center">
          <div className="flex items-center gap-[20px]">
            <img
              src={user.avatar || avatar}
              alt="avatar"
              className="w-[50px] h-[50px] object-cover rounded-full"
            />
            <span>{user.username}</span>
          </div>
          <button
            onClick={handleAdd}
            className="p-[10px] rounded-[10px] bg-[#1a73e8] border-[0]"
          >
            Add User
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
