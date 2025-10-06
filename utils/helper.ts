export const getCurrentDate = () => {
    const currentDate = new Date();
    currentDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    return currentDate
  };

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }