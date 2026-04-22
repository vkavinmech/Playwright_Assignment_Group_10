function env(key, fallback = '') {
  const v = process.env[key];
  return v !== undefined && v !== '' ? v : fallback;
}

/** Demo user and registration fields. Override with env vars (e.g. BANK_USERNAME). */
export const testData = {
  username: env('BANK_USERNAME', 'john'),
  password: env('BANK_PASSWORD', 'demo'),

  registerBeforeSuite: env('REGISTER_BEFORE_SUITE', 'false').toLowerCase() === 'true',

  registerFirstName: env('REGISTER_FIRST_NAME', 'Playwright'),
  registerLastName: env('REGISTER_LAST_NAME', 'Parabank'),
  registerStreet: env('REGISTER_ADDRESS_STREET', '1 Test Lane'),
  registerCity: env('REGISTER_ADDRESS_CITY', 'Los Angeles'),
  registerState: env('REGISTER_ADDRESS_STATE', 'CA'),
  registerZip: env('REGISTER_ZIP', '90001'),
  registerPhone: env('REGISTER_PHONE', '3105550100'),
  registerSsn: env('REGISTER_SSN', '123456789'),
};
