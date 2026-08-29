import * as migration_20260820_011932_initial from './20260820_011932_initial';
import * as migration_20260825_003736_add_store_mockup_mobile_image from './20260825_003736_add_store_mockup_mobile_image';
import * as migration_20260826_180924_add_service_landing_page_fields from './20260826_180924_add_service_landing_page_fields';

export const migrations = [
  {
    up: migration_20260820_011932_initial.up,
    down: migration_20260820_011932_initial.down,
    name: '20260820_011932_initial',
  },
  {
    up: migration_20260825_003736_add_store_mockup_mobile_image.up,
    down: migration_20260825_003736_add_store_mockup_mobile_image.down,
    name: '20260825_003736_add_store_mockup_mobile_image',
  },
  {
    up: migration_20260826_180924_add_service_landing_page_fields.up,
    down: migration_20260826_180924_add_service_landing_page_fields.down,
    name: '20260826_180924_add_service_landing_page_fields'
  },
];
