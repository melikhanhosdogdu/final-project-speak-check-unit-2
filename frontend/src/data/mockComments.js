// Mock data for comments
import MeticulousAudio from "../assets/audios/english/Meticulous.mp3";
import AdvocateAudio from "../assets/audios/english/Advocate.mp3";

export const mockComments = {
  1: [
    // Meticulous
    {
      id: 101,
      userName: "Alice C.",
      text: "Here is my voice comment",
      audioURL: MeticulousAudio,
      commentCount: 0,
      likeCount: 9,
      isLikedByCurrentUser: false,
    },
    {
      id: 102,
      userName: "Bob W.",
      text: "Here is my text comment",
      audioURL: null,
      commentCount: 0,
      likeCount: 12,
      isLikedByCurrentUser: false,
    },
  ],
  2: [
    // Advocate
    {
      id: 201,
      userName: "Charlie B.",
      text: "Great pronunciation!",
      audioURL: null,
      commentCount: 0,
      likeCount: 5,
      isLikedByCurrentUser: false,
    },
    {
      id: 202,
      userName: "Diana P.",
      text: "My attempt at this word",
      audioURL: AdvocateAudio,
      commentCount: 0,
      likeCount: 8,
      isLikedByCurrentUser: false,
    },
  ],
  3: [
    // Profound
    {
      id: 301,
      userName: "Ethan H.",
      text: "This is helpful, thank you!",
      audioURL: null,
      commentCount: 0,
      likeCount: 6,
      isLikedByCurrentUser: false,
    },
  ],
};
