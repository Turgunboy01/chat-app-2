import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import avatarImg from "../../assets/avatar.png";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import upload from "../../utils/upload";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";

const Login = () => {
  const [eyeClick, setEyeClick] = useState(true);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    // console.log(username, email, password);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      toast.success("Account created! You can now login");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }

    toast.warn("Please site refresh you auto login");
  };

  return (
    <div>
      <h2 className=" w-full mt-6 text-center text-[23px]  md:text-[30px]">
        To register on the site, Step 1 is to create a new account. Step 2 is to
        enter it on the login page, it should automatically go to the next page,
        if not, please refresh.
      </h2>
      <div className="flex items-center w-full h-full mt-[-100px]">
        <div className="w-full flex-[1] flex flex-col items-center">
          <h1 className="text-[30px] mb-9">Login Page</h1>
          <form
            className="flex flex-col justify-center items-center gap-5"
            onSubmit={handleLogin}
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="px-7 py-5  border-0 outline-0 bg-[#11192899]"
            />
            <div className="flex p-5  bg-[#11192899]">
              <input
                type={!eyeClick ? "text" : "password"}
                name="password"
                className="border-0 outline-0  bg-transparent "
                placeholder="Password"
              />
              {eyeClick ? (
                <FaEye onClick={() => setEyeClick(!eyeClick)} />
              ) : (
                <FaEyeSlash onClick={() => setEyeClick(!eyeClick)} />
              )}
            </div>
            <button
              disabled={loading}
              className="p-5 bg-[#1f8ef1] border-0 rounded-md font-semibold"
            >
              {loading ? "loading" : "Sign In"}
            </button>
          </form>
        </div>
        <div className="h-[40%] sm:h-[50%] w-[2px] bg-[#dddddd35]"></div>

        <div className="w-full flex-[1] flex flex-col items-center">
          <h1 className="text-[30px] mb-9">Create New Account</h1>
          <form
            className="flex flex-col justify-center items-center gap-5"
            onSubmit={handleRegister}
          >
            <label htmlFor="file" className="flex items-center gap-4">
              <img
                src={avatar.url || avatarImg}
                alt=""
                className="w-[50px] h-[50px]"
              />{" "}
              Upload a file
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <input
              type="text"
              placeholder="Username"
              name="username"
              className="px-7 py-5  border-0 outline-0 bg-[#11192899]"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="px-7 py-5  border-0 outline-0 bg-[#11192899]"
            />
            <div className="flex p-5  bg-[#11192899]">
              <input
                type={!eyeClick ? "text" : "password"}
                name="password"
                className="border-0 outline-0  bg-transparent "
                placeholder="Password"
              />
              {eyeClick ? (
                <FaEye onClick={() => setEyeClick(!eyeClick)} />
              ) : (
                <FaEyeSlash onClick={() => setEyeClick(!eyeClick)} />
              )}
            </div>
            <button
              disabled={loading}
              className="p-5 bg-[#1f8ef1] border-0 rounded-md font-semibold"
            >
              {loading ? "loading" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
