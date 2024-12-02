import { ButtonProps } from "antd";

export interface IButtonProps extends ButtonProps {
  buttonLabel: string;
  isLoading?: boolean;
}
