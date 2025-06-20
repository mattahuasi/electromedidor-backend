export const dateFormat = (date) => {
  const d = new Date(date);
  const addCero = (number) => {
    return number < 10 ? `0${number}` : number;
  };
  const year = d.getFullYear();
  const month = addCero(d.getMonth() + 1);
  const day = addCero(d.getDate());
  return `${year}-${month}-${day}`;
};

export const fullDateFormat = (date) => {
  const d = new Date(date);
  const addCero = (number) => {
    return number < 10 ? `0${number}` : number;
  };
  const year = d.getFullYear();
  const month = addCero(d.getMonth() + 1);
  const day = addCero(d.getDate());
  const hour = addCero(d.getHours());
  const minute = addCero(d.getMinutes());
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

export const hourFormat = (date) => {
  const d = new Date(date);
  const addCero = (number) => {
    return number < 10 ? `0${number}` : number;
  };
  const hour = addCero(d.getHours());
  const minute = addCero(d.getMinutes());
  const second = addCero(d.getSeconds());
  return `${hour}:${minute}:${second}`;
};

export const getCurrentDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}/${month}/${day}`;
};

export const deleteRepiteDate = (dates) => {
  let array = [];
  dates.forEach((element) => {
    if (!array.includes(element)) array.push(element);
  });
  return array;
};
