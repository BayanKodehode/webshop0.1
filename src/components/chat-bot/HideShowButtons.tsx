import * as React from "react";
import { Bot } from "./bot";

export type ButtonsProps = {
  visibility: boolean;
  onRiddleRequest: () => void;
  onJokeRequest: () => void;
};

export const HideShowButtons = (props: ButtonsProps) => {
  if (!props.visibility) {
    return null;
  }
  return (
    <div>
      <button
        className="text-white p-4 m-2 bg-gradient-to-r from-gray-500 to-indigo-600 rounded-xl"
        onClick={() => props.onRiddleRequest()}
      >
        Riddle
      </button>
      <button
        className="text-white p-4 m-2 bg-gradient-to-r from-gray-500 to-indigo-600 rounded-xl"
        onClick={() => props.onJokeRequest()}
      >
        Joke
      </button>
    </div>
  );
};
