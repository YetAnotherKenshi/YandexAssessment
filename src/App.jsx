import React, { useEffect, useState } from "react";
import TextArea from "./components/TextArea";
import Assesment from "./components/Assesment";
import ProgressBar from "./components/ProgressBar";
import { FiEdit2, FiInfo, FiPlus, FiSend, FiSkipForward } from "react-icons/fi";
import { ThreeDots } from "react-loader-spinner";
import InfoModal from "./components/InfoModal";
import Toggle from "react-toggle";
import { ToastContainer, toast } from "react-toastify";
import "react-toggle/style.css";

const App = () => {
  const [review, setReview] = useState({ text: "", id: "", count: 0 });
  const [fragments, setFragments] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [noReviews, setNoReviews] = useState(false);
  const [ownReviewsCount, setOwnReviewsCount] = useState(0);
  const [params, setParams] = useState(null);

  const API_ROOT = isDev ? "http://127.0.0.1:8000" : "";

  const initializeParams = () => {
    const savedParams = JSON.parse(localStorage.getItem("params")) || {
      intro: false,
      auto: false,
    };
    const ownReviewsCount =
      JSON.parse(localStorage.getItem("ownReviewsCount")) || 0;

    if (!savedParams.intro) {
      setShowModal(true);
      savedParams.intro = true;
    }
    localStorage.setItem("params", JSON.stringify(savedParams));
    localStorage.setItem("ownReviewsCount", JSON.stringify(ownReviewsCount));
    setOwnReviewsCount(ownReviewsCount);
    setParams(savedParams);
  };

  const fetchReviewData = async () => {
    try {
      const res = await fetch(`${API_ROOT}/api/v1/assessment`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!data.text) {
        setNoReviews(true);
        setReview((prev) => ({ ...prev, count: data.count }));
      } else {
        setReview(data);
      }
    } catch {
      toast.error("Ошибка при загрузке данных!", { theme: "colored" });
    }
  };

  const fetchAIFragments = async () => {
    if (!review.text) return;
    setIsWaiting(true);
    try {
      const res = await fetch(`${API_ROOT}/api/v1/ai_assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: review.text }),
      });

      if (res.status === 204) {
        console.log("No more reviews.");
        return;
      }

      const data = await res.json();
      const parsedFragments = JSON.parse(data.res.replace(/`|\n/g, ""));
      setFragments(parsedFragments);
    } catch {
      toast.error("Ошибка при запросе!", { theme: "colored" });
    } finally {
      setIsWaiting(false);
    }
  };

  const handleSendData = async () => {
    if (fragments.length === 0) {
      toast.error("Разметка пустая!", { theme: "colored" });
      return;
    }

    const isValid = fragments.every(
      ({ text, category, tone }) => text && category && tone
    );

    if (!isValid) {
      toast.error("Заполнены не все поля!", { theme: "colored" });
      return;
    }

    try {
      const res = await fetch(`${API_ROOT}/api/v1/assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: review.id,
          result: fragments,
        }),
      });

      await res.json();
      toast.success("Разметка отправлена!", { theme: "colored" });
      await fetchReviewData();
      localStorage.setItem(
        "ownReviewsCount",
        JSON.stringify(ownReviewsCount + 1)
      );
      setOwnReviewsCount((prevState) => prevState + 1);
      setFragments([]);
    } catch {
      toast.error("Ошибка при отправке!", { theme: "colored" });
    }
  };

  const toggleAutoMarking = () => {
    const updatedParams = { ...params, auto: !params.auto };
    localStorage.setItem("params", JSON.stringify(updatedParams));
    setParams(updatedParams);
  };

  const handleFragmentUpdate = (id, updatedFragment) => {
    const updatedFragments = fragments.map((fragment, index) =>
      index === id ? updatedFragment : fragment
    );
    setFragments(updatedFragments);
  };

  const handleFragmentDelete = (id) => {
    setFragments((prev) => prev.filter((_, index) => index !== id));
  };

  const getNounForm = (number) => {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "отзывов";
    if (lastDigit === 1) return "отзыв";
    if (lastDigit >= 2 && lastDigit <= 4) return "отзыва";
    return "отзывов";
  };

  useEffect(() => {
    initializeParams();
    fetchReviewData();
  }, []);

  useEffect(() => {
    if (params?.auto && review.text && fragments.length === 0) {
      fetchAIFragments();
    }
  }, [review, params]);

  return (
    params && (
      <div className="main">
        <div className="app-container">
          <p className="assessment-title">
            {/* Всего размечено отзывов: {review.count}/3000 (вы разметили{" "}
            {ownReviewsCount} {getNounForm(ownReviewsCount)}) */}
            {`Всего размечено отзывов: ${
              review.count
            }/3000 (вы разметили ${ownReviewsCount} ${getNounForm(
              ownReviewsCount
            )})`}
          </p>
          <ProgressBar progress={review.count} />

          <p className="assessment-title">Отзыв</p>
          <TextArea text={review.text} noReviews={noReviews} />

          <div className="assessment-sub-title">
            <p>Размеченные отрывки ({fragments.length})</p>
            <FiInfo onClick={() => setShowModal(true)} />
            <label>
              <span>Автоматическая разметка</span>
              <Toggle
                checked={params.auto}
                icons={false}
                className="assessment-toggle"
                onChange={toggleAutoMarking}
              />
            </label>
          </div>

          <div className="btn-container">
            <button
              className="ai-button"
              disabled={isWaiting}
              onClick={fetchAIFragments}
            >
              {isWaiting ? (
                <>
                  <ThreeDots
                    height="16"
                    width="16"
                    radius="10"
                    color="#404040"
                  />
                  Размечаем...
                </>
              ) : (
                <>
                  <FiEdit2 /> Разметить с помощью ИИ
                </>
              )}
            </button>
            <button
              className="add-button"
              disabled={isWaiting}
              onClick={() =>
                setFragments([
                  ...fragments,
                  { text: "", category: "", tone: "" },
                ])
              }
            >
              <FiPlus /> Добавить отрывок
            </button>

            {fragments.length > 0 ? (
              <button
                className="send-button"
                disabled={isWaiting}
                onClick={handleSendData}
              >
                <FiSend /> Сохранить разметку
              </button>
            ) : (
              <button
                className="skip-button"
                disabled={isWaiting}
                onClick={async () => {
                  toast.info("Отзыв пропущен", { theme: "colored" });
                  await fetchReviewData();
                  setFragments([]);
                }}
              >
                <FiSkipForward /> Пропустить отзыв
              </button>
            )}
          </div>

          <Assesment
            fragments={fragments}
            updateFragment={handleFragmentUpdate}
            deleteFragment={handleFragmentDelete}
          />

          <ToastContainer />
        </div>
        <InfoModal showModal={showModal} setShowModal={setShowModal} />
      </div>
    )
  );
};

export default App;
