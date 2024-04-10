export type ApiResponseObject = {
  action: "error" | "none" | "showMessage" | "redirect";
  value: string;
  data?: any;
};
