/// <reference lib="webworker" />

import { GroupingCategories } from '../app.component';
import { User } from '../models/user.model';

addEventListener('message', ({ data }) => {
  const users: User[] = data.users;
  const category: GroupingCategories = data.category;

  // Split data in chunks of 100 to improve data process times.
  const CHUNK_SIZE = 100;

  let result = {};
  let currentIndex = 0;

  const processNextDataChunk = () => {
    const chunk = users.slice(currentIndex, currentIndex + CHUNK_SIZE);
    switch (category) {
      case 'ALPHABETICALLY':
        result = { ...result, ...groupAlphabetically(chunk) };
        break;
      case 'AGE':
        result = { ...result, ...groupAge(chunk) };
        break;
      case 'NATIONALITY':
        result = { ...result, ...groupNationality(chunk) };
        break;
      default:
        result = {};
    }

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
  const result: Record<string, User[]> = {};
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i); // Generate letters from A to Z
    result[letter] = [];
  }

  data.forEach((user) => {
    if (user.firstname) {
      const letter = user.firstname.charAt(0).toUpperCase();
      if (result[letter]) {
        result[letter].push(user);
      }
    }
  });

  for (const letter in result) {
    if (result[letter].length === 0) {
      delete result[letter];
    }
  }

  return result;
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
