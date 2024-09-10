/* eslint-disable  @typescript-eslint/no-explicit-any */
// We disable the any check because the fetch handlers are hard to type
// TODO: Type the fetch handlers
import { v4 as uuidv4 } from "uuid";

export type AcknowledgementType = "AUTO" | "MANUAL";
export interface Acknowledgement {
  id: string;
  type: AcknowledgementType;
  created_at: string;
}
export type AcknowledgementMap = {
  [id: string]: Acknowledgement;
};

type RequestResult = "ERROR" | "SUCCESS" | "FAILURE";
export interface Message {
  id: string;
  type: RequestResult;
  base_url: string;
  path: string; // To identify the source of the message
  method: string;
  created_at: string;
  status: number;
  payload: any;
  body: string | null;
  headers?: any;
}

export const fetchTransformer = (request: any): Message => {
  const requestMessage: Message = {
    id: uuidv4(),
    type: request.error ? "ERROR" : request.response.ok ? "SUCCESS" : "FAILURE",
    base_url: request.options.baseURL,
    path: "/" + request.request.replace(request.options.baseURL, ""),
    method: request.options.method,
    body: request.options?.body ? request.options.body : null,
    status: request.error
      ? 403
      : request.response.status === undefined
        ? "undefined"
        : request.response.status,
    payload: request.error
      ? request.error.message
      : request.response._data === undefined
        ? "undefined"
        : request.response._data,
    created_at: new Date().toISOString(),
  };
  return requestMessage;
};

export const acknowledgementCreator = (
  message: Message,
  type: AcknowledgementType,
): Acknowledgement => {
  return {
    id: message.id,
    type,
    created_at: new Date().toISOString(),
  };
};
