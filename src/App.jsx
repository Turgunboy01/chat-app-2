import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";
import Notification from "./notification/Notification";
import { useChatStore } from "./utils/chatStore";
import { useUserStore } from "./utils/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";

const App = () => {
  const [clickSitebar, setClickSitebar] = useState(true);
  const [clickDetail, setClickDetail] = useState(false);
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  const handleDetail = () => {
    setClickDetail(!clickDetail);
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  const handleSitebar = () => {
    setClickSitebar(!clickSitebar);
  };
  if (isLoading) return <div className="loading">Loading...</div>;
  return (
    <div className="flex w-full  h-[100vh]  justify-center items-center overflow-hidden">
      <div className="container mx-auto bgImg  h-[85vh] relative flex rounded-xl">
        {currentUser ? (
          <>
            <List clickSitebar={clickSitebar} handleSitebar={handleSitebar} />
            <div className="flex w-[100%]">
              {chatId && <Chat handleDetail={handleDetail} />}
              {chatId && (
                <Detail clickDetail={clickDetail} handleDetail={handleDetail} />
              )}
            </div>
          </>
        ) : (
          <Login />
        )}
        <Notification />
      </div>
    </div>
  );
};

export default App;
