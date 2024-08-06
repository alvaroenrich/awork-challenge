/// <reference lib="webworker" />

import { GroupingCategories } from '../app.component';
import { User } from '../models/user.model';

addEventListener('message', ({ data }) => {
  const usersData = groupResults(data.users, data.category);

  postMessage(usersData);
});

const groupResults = (
  data: User[],
  category: GroupingCategories,
): Record<string, User[]> => {
  switch (category) {
    case 'AGE':
      return groupAge(data);
    case 'ALPHABETICALLY':
      return groupAlphabetically(data);
    case 'NATIONALITY':
      return groupNationality(data);
  }
};

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
