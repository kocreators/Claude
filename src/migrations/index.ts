import * as migration_20260820_011932_initial from './20260820_011932_initial';

export const migrations = [
  {
    up: migration_20260820_011932_initial.up,
    down: migration_20260820_011932_initial.down,
    name: '20260820_011932_initial'
  },
];
