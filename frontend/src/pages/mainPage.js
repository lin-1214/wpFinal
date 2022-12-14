import ExpBar from "../components/expBar";
import MainDrawer from "../components/mainDrawer";
import MoneyBar from "../components/moneyBar";
import Profile from "../components/profile";
import TodoList from "../components/todoList";
import "./mainPage.css";
import "./popUp.css";
import Popup from "reactjs-popup";
import bgImg from "../assets/Background.png";
import chatBubbleImg from "../assets/thinking.png";
import { useState, useEffect } from "react";
import savemoney from "../images/savemoney.gif";
import banners from "../images/banners.gif";
import instance from "../hooks/api";
import { useInfo } from "../hooks/util";
import { height } from "@mui/system";
import axios from "../hooks/api";

const MainPage = ({ setPage }) => {
  const { userName, userId, monster } = useInfo();
  const [popup, setPopup] = useState(false);
  const [randomSeed, setRandomSeed] = useState(6);
  const [eventTime, setEventTime] = useState(0);
  const [exp, setExp] = useState(0);
  const [money, setMoney] = useState(0);
  const [studyTime, setStudyTime] = useState(0);
  const [level, setLevel] = useState(0);
  const chatContents = [
    "Good Job👍",
    "Well done!",
    "🤤🤤🤤",
    "YOLO😎",
    "Catch some Z's!",
    "WP is lit🔥",
    "Earn $" + level + "/min💰!",
  ];
  const textGenerator = () => {
    return <>{chatContents[randomSeed]}</>;
  };

  const getStudyTime = async () => {
    const {
      data: { msg, studyTime },
    } = await axios.get("getStudyTime/", {
      params: { userId: userId },
    });

    setStudyTime(studyTime);
  };

  const getMoneyandExp = async () => {
    const {
      data: { msg, MONEY, EXP, LEVEL },
    } = await axios.get("getMoneyandExp/", {
      params: { userId: userId },
    });
    return { EXP, MONEY, LEVEL };
  };

  const checkEventCounted = async () => {
    // check event's EXP counted or not
    let now = new Date();
    let threshold = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      17, // hours
      1, // minutes
      44 // seconds
    );
    const {
      data: { msg1, lastLoginTime },
    } = await axios.get("getDailyCheckInfo/", {
      params: { userId: userId },
    });
    let last = new Date(lastLoginTime);

    if (now > threshold && last < threshold) {
      let {
        data: { msg2, eventTotalTime },
      } = await axios.post("checkEventCounted/", {
        params: { id: userId },
      });
      setEventTime(eventTotalTime / 60);
      let EXP = 0;
      let MONEY = 0;
      let LEVEL = 0;
      await getMoneyandExp().then((Info) => {
        EXP = Info.EXP;
        MONEY = Info.MONEY;
        LEVEL = Info.LEVEL;
      });
      getStudyTime();

      let sum = 0;
      let level_count = 0;
      for (let i = 1; sum < (eventTotalTime + EXP) / 120; i++) {
        sum = Math.pow(2, i) - 1;
        level_count = i;
      }
      if (level_count == 0) level_count = 1;
      const {
        data: { msg4, MONEY_post, LEVEL_post, EXP_post },
      } = await axios.post("/updateMoneyandExp", {
        params: {
          studentId: userId,
          money: MONEY + eventTotalTime * LEVEL,
          exp: EXP + eventTotalTime,
          level: level_count,
        },
      });
      const {
        data: { msg5 },
      } = await axios.post("/updateStudyTime", {
        studentId: userId,
        studyTime: 0,
      });

      setExp(EXP_post);
      setMoney(MONEY_post);
      setLevel(LEVEL_post);
      setPopup(true);
    } else {
      let EXP = 0;
      let MONEY = 0;
      let LEVEL = 0;
      await getMoneyandExp().then((Info) => {
        EXP = Info.EXP;
        MONEY = Info.MONEY;
        LEVEL = Info.LEVEL;
      });
      setExp(EXP);
      setMoney(MONEY);
      setLevel(LEVEL);
    }
    const {
      data: { msg3 },
    } = await axios.post("/updateLoginTime", {
      params: { studentId: userId },
    });
  };

  useEffect(() => {
    checkEventCounted();
    setInterval(() => setRandomSeed(Math.floor(Math.random() * 6)), 6000);
  }, []);
  return (
    <div
      className="Background"
      style={{ backgroundImage: `url(${bgImg})`, backgroundSize: "cover" }}
    >
      <div className="header">
        <Profile></Profile>
        <ExpBar exp={exp} level={level}></ExpBar>
        <MoneyBar money={money}></MoneyBar>
      </div>
      <div className="body">
        <div className="sideBar">
          <div className="sideBar-child1">
            <div className="menuWrapper">
              <MainDrawer setPage={setPage}></MainDrawer>
              <div
                style={{
                  fontSize: "4vh",
                  fontWeight: "900",
                }}
              >
                Menu
              </div>
            </div>
          </div>
        </div>

        <div className="Monster">
          <div
            className="monsImg"
            style={{
              backgroundImage: `url(${monster})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              width: "100vw",
              height: "40vw",
            }}
          >
            <div
              className="ChatBubble"
              style={{
                backgroundImage: `url(${chatBubbleImg})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                display: `${true ? "" : "none"}`,
              }}
            >
              <div className="ChatContents">{textGenerator()}</div>
            </div>
          </div>
        </div>

        <div className="ToDo">
          <TodoList></TodoList>
        </div>
      </div>
      <div className="footer"></div>
      <Popup
        open={popup}
        contentStyle={{
          display: "flex",
          userSelect: "none",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0)",
          borderColor: "rgba(255,255,255,0)",
        }}
        closeOnDocumentClick={false}
      >
        <div
          style={{
            backgroundColor: "white",
            height: "35vw",
            width: "30vw",
            borderRadius: "2vw",
            border: "4px solid black",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <header style={{ display: "flex", justifyContent: "center" }}>
            <p className="popupTitle">WelCome Back !</p>
          </header>
          <header style={{ display: "flex", justifyContent: "center" }}>
            <img src={banners} style={{ width: "8vw" }}></img>
            <div style={{ width: "18vw" }}>
              <p className="popupsmallTitle">Congratulation!</p>
              <p className="popupwords">
                You worked for{" "}
                {parseFloat(eventTime) +
                  parseFloat(parseFloat(studyTime / 3600).toFixed(1))}{" "}
                hours yesterday
              </p>
            </div>
          </header>
          <header
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={savemoney} style={{ width: "8vw" }}></img>
            <div style={{ width: "18vw", height: "15vh" }}>
              <p className="popupsmallTitle">Money & Exp</p>

              <p className="popupwords">
                You won {Math.round(studyTime / 60) * level + money} $ and {exp}{" "}
                exp !
              </p>
            </div>
          </header>
          <header style={{ display: "flex", justifyContent: "center" }}>
            <button className="popupbtn" onClick={() => setPopup(false)}>
              Confirm
            </button>
          </header>
        </div>
      </Popup>
    </div>
  );
};

export default MainPage;
