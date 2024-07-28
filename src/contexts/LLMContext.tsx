import { createContext, useContext, useState, useRef } from "react";
import Anthropic from "@anthropic-ai/sdk";

interface LLMAPIContextValue {
  sendMessage: (provider: LLMPROVIDER, msg: string) => Promise<any>;
  apiKey: string;
  setApiKey: (k: string) => void;
}

const LLMAPIContext = createContext<LLMAPIContextValue>(
  {} as LLMAPIContextValue
);

export enum LLMPROVIDER {
  OPENAI,
  ANTHROPIC,
}

export function LLMAPIContextProvider(props: React.PropsWithChildren) {
  const [apiKey, setApiKey] = useState(""); //TODO: update to object to store apikeys for multiple providers; Set/Get from MainFlow apiKeyPanel

  const _anthropicRef = useRef(new Anthropic({ apiKey }));
  const anthropic = _anthropicRef.current;

  const sendMessage = async (provider: LLMPROVIDER, msg: string) => {
    //TODO: Add model options
    let msgText;
    switch (provider) {
      case LLMPROVIDER.OPENAI: {
        const response = await sendMessage_OpenAI(msg);
        msgText = response?.choices?.[0]?.message?.content;
        console.log(
          "sendMessage > response",
          response,
          " | msgText: ",
          msgText
        );
        break;
      }
    }

    return msgText;
  };

  async function sendMessage_OpenAI(msg: string) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: msg,
          },
        ],
      }),
    });

    console.log("Response: ", response);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${response.status} ${errorMessage}`);
    }

    const data = await response.json();
    console.log("response data: ", data);
    return data;
  }

  // async function sendMessage_Anthropic(msg: string) {
  //   //CALL ANTHROPIC; //! Cannot send from browser
  //   // return await anthropic.messages.create({
  //   //   model: "claude-3-5-sonnet-20240620",
  //   //   max_tokens: 256,
  //   //   messages: [{ role: "user", content: msg }],
  //   // });

  //   const response = await fetch("https://api.anthropic.com/v1/messages", {
  //     method: "POST",
  //     headers: {
  //       "x-api-key": `${import.meta.env.VITE_ANTHROPIC_API_KEY}`,
  //       "anthropic-version": "2023-06-01",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       model: "claude-3-5-sonnet-20240620",
  //       max_tokens: 1024,
  //       messages: [
  //         {
  //           role: "user",
  //           content: msg,
  //         },
  //       ],
  //     }),
  //   });

  //   if (!response.ok) {
  //     const errorMessage = await response.text();
  //     throw new Error(`Error: ${response.status} ${errorMessage}`);
  //   }

  //   const data = await response.json();
  //   console.log(data);
  //   return data;
  // }

  return (
    <LLMAPIContext.Provider value={{ sendMessage, apiKey, setApiKey }}>
      {props.children}
    </LLMAPIContext.Provider>
  );
}

export const useLLMContext = () => useContext(LLMAPIContext);
