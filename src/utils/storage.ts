import SecureLS from "secure-ls";

const secureLs = new SecureLS();

const setItem = (key: string, value: any) => {
  value = JSON.stringify(value);
  secureLs.set(key, value);
};

const getItem = (key: string) => {
  const value = secureLs.get(key);

  return value;
};

const clearStorage = () => {
  localStorage.clear();
};

export { setItem, getItem, clearStorage };
