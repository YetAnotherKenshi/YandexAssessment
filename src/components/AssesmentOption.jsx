import React, { useEffect, useState } from "react";
import Select from "react-select";
import { GoTrash } from "react-icons/go";

const AssesmentOption = ({ fragment, fid, updateFragment, deleteFragment }) => {
  const toneOptions = [
    { value: "positive", label: "Позитивная" },
    { value: "negative", label: "Негативная" },
  ];

  const categoryOptions = [
    { value: "tickets", label: "Билеты" },
    { value: "cost", label: "Стоимость" },
    { value: "benefits", label: "Льготы" },
    { value: "cashiers", label: "Кассы" },
    { value: "queue", label: "Очередь" },
    { value: "organization", label: "Организация" },
    { value: "waiting_time", label: "Время ожидания" },
    { value: "entry", label: "Вход" },
    { value: "staff", label: "Персонал" },
    { value: "administration", label: "Администрация" },
    { value: "food", label: "Еда" },
    { value: "toilet", label: "Туалет" },
    { value: "souvenirs", label: "Сувениры" },
    { value: "shops", label: "Магазины" },
    { value: "excursions", label: "Экскурсии" },
    { value: "audioguide", label: "Аудиогид" },
    { value: "transport", label: "Транспорт" },
    { value: "parking", label: "Парковка" },
    { value: "working_hours", label: "График работы" },
    { value: "location", label: "Расположение" },
    { value: "navigation", label: "Навигация" },
    { value: "appearance", label: "Внешний вид" },
    { value: "children", label: "Дети" },
    { value: "accessibility", label: "Доступность" },
    { value: "planning", label: "Планирование" },
    { value: "information", label: "Информирование" },
    { value: "visit", label: "Посещение" },
    { value: "interest", label: "Интерес" },
    { value: "impression", label: "Впечатление" },
    { value: "comfort", label: "Комфорт" },
  ].toSorted((a, b) => a.label.localeCompare(b.label));

  const handleChange = (field, value) => {
    updateFragment(fid, {
      ...fragment,
      [field]: value,
    });
  };

  useEffect(() => {
    if (
      categoryOptions.filter((cat) => cat.value === fragment.category).length ==
      0
    ) {
      handleChange("category", "");
    }
    if (
      toneOptions.filter((tone) => tone.value === fragment.tone).length == 0
    ) {
      handleChange("tone", "");
    }
  }, [fragment.category, fragment.tone]);

  return (
    <div className="assessment-option">
      <textarea
        className="assessment-text"
        value={fragment.text}
        onChange={(e) => handleChange("text", e.target.value)}
        placeholder="Текст отрывка"
      ></textarea>
      <div className="select-container">
        <Select
          value={categoryOptions.find((c) => c.value === fragment.category)}
          options={categoryOptions}
          className="assessment-select"
          onChange={(selected) => handleChange("category", selected?.value)}
          placeholder="Категория"
        />
      </div>
      <div className="select-container">
        <Select
          value={toneOptions.find((t) => t.value === fragment.tone)}
          options={toneOptions}
          className="assessment-select"
          onChange={(selected) => handleChange("tone", selected?.value)}
          placeholder="Тональность"
        />
      </div>
      <button
        className="delete-button"
        onClick={() => deleteFragment(fid)}
        aria-label="Удалить отрывок"
      >
        <GoTrash />
      </button>
    </div>
  );
};

export default AssesmentOption;
