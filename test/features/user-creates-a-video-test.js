const {assert} = require('chai');

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

describe('user visits the create page and saves a video', () => {
  it('can fill out the form and save', () => {
    const videoToSave = {
      title: 'My Test Video',
      description: 'This is a test video',
      url: generateRandomUrl('www.youtube.com')
    }
    browser.url('/');
    browser.click('#create-video');
    browser.setValue('#title-input', videoToSave.title);
    browser.setValue('#description-input', videoToSave.description);
    browser.setValue('#url-input', videoToSave.url);
    browser.click('#submit-button');
    assert.include(browser.getText('body'), videoToSave.title);
    assert.include(browser.getText('body'), videoToSave.description);
  });
});
