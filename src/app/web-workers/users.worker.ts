/// <reference lib="webworker" />

import { GroupingCategories } from '../app.component';
import { User } from '../models/user.model';

addEventListener('message', ({ data }) => {
  const users: User[] = data.users;
  const category: GroupingCategories = data.category;

  // Split data in chunks of 400 to improve data process times.
  const CHUNK_SIZE = 400;

  let result: Record<string, User[]> = {};
  let currentIndex = 0;

  const processNextDataChunk = () => {
    const chunk = users.slice(currentIndex, currentIndex + CHUNK_SIZE);
    let newProcessedChunk: Record<string, User[]> = {};
    switch (category) {
      case 'ALPHABETICALLY':
        newProcessedChunk = groupAlphabetically(chunk);
        break;
      case 'AGE':
        newProcessedChunk = groupAge(chunk);
        break;
      case 'NATIONALITY':
        newProcessedChunk = groupNationality(chunk);
        break;
      default:
        result = {};
    }
    Object.keys(newProcessedChunk).forEach((key) => {
      if (result[key]) {
        result[key] = [...result[key], ...newProcessedChunk[key]];
      } else {
        result[key] = newProcessedChunk[key];
      }
    });

    currentIndex += CHUNK_SIZE;
    if (currentIndex < users.length) {
      // Schedule the next chunk
      requestAnimationFrame(processNextDataChunk);
    } else {
      // Processing complete
      postMessage(result);
    }
  };
  processNextDataChunk();
});

const groupAlphabetically = (data: User[]): Record<string, User[]> => {
  return data.reduce((acc: Record<string, User[]>, user: User) => {
    if (!user.firstname) {
      throw Error('User does not have firstname. It cant be grouped');
    }
    const firstLetter = user.firstname.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(user);
    return acc;
  }, {});
};

const groupNationality = (data: User[]): Record<string, User[]> => {
  const result: Record<string, User[]> = {};

  data.forEach((user) => {
    if (user.nat) {
      if (!result[user.nat]) {
        result[user.nat] = [];
      }
      result[user.nat].push(user);
    }
  });

  return result;
};
const groupAge = (data: User[]): Record<string, User[]> => {
  const result: Record<string, User[]> = {};
  data.forEach((user) => {
    if (user.age) {
      const age = user.age.toString();
      if (!result[age]) {
        result[age] = [];
      }
      result[age].push(user);
    }
  });

  return result;
};
