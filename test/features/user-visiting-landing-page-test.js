const {assert} = require('chai');

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

describe('User visiting landing page', () => {
  describe('with no existing videos', () => {
    it('shows no videos', () => {
      browser.url('/');

      assert.equal(browser.getText('#videos-container'), '');
    });
  });
  describe('with an existing video', () => {
    it('renders the video', () => {
      const videoToSave = {
        title: 'My Test Video',
        description: 'This is a test video',
        url: generateRandomUrl('www.youtube.com')
      }

      browser.url('/videos/create');
      browser.setValue('#title-input', videoToSave.title);
      browser.setValue('#description-input', videoToSave.description);
      browser.setValue('#url-input', videoToSave.url);
      browser.click('#submit-button');
      browser.url('/');
      assert.equal(browser.getText('#videos-container'), videoToSave.title);
    });

    it('can click on a video', () => {
      const videoToSave = {
        title: 'My Test Video',
        description: 'This is a test video',
        url: generateRandomUrl('www.youtube.com')
      }

      browser.url('/videos/create');
      browser.setValue('#title-input', videoToSave.title);
      browser.setValue('#description-input', videoToSave.description);
      browser.setValue('#url-input', videoToSave.url);
      browser.click('#submit-button');
      browser.url('/');
      browser.click('#vides-container a');

      assert.include(browser.getText('body'), videoToSave.description);
    });
  });

  describe('user navigates to /videos/create', () => {
    it('contains the button to save a video', () => {
      browser.url('/');
      browser.click('a[href="/videos/create"]');
      assert.include(browser.getText('body'), 'Save a Video');
    });
  });
});
