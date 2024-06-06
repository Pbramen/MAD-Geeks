const { generateTime } = require('./stub_jwt.js');

const date = 'July 1, 1999, 12:00:00';
test('Add 10 hours to the current time', () => {
    expect(generateTime(date)).toBe(930884400000);
});


