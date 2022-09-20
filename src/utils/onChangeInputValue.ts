import { ChangeEvent } from "react";

export const onChangeInputValue = (
  e: ChangeEvent<HTMLInputElement> | undefined
) => {
  let newFormValues: any = {};

  if (e) {
    const { id, value } = e.currentTarget;
    newFormValues = { ...newFormValues, [id]: value };
  }

  return newFormValues;
};
