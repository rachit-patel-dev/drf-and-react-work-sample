import { useSelector } from "react-redux";

import { RootState } from "../Store/store";

import textResource from "../Resources/Languages/Language.json";

const useLanguage = () => {
  const language = useSelector(
    (state: RootState) => state.generalSettingsReducer.language
  );

  const convertText = (key: string) => {
    return textResource[`${key}${language}` as keyof typeof textResource];
  };

  return {
    convertText,
  };
};

export default useLanguage;
