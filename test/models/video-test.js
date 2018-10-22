const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');
const Video = require('../../models/video');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');


describe('Video', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('#title', () => {
    it('is a string', () => {
      const titleAsInt = 1;
      const video = new Video({title: titleAsInt});
      assert.strictEqual(video.title, titleAsInt.toString());
    });
    it('is a requirement', () => {
      const video = new Video({title: null});
      video.validateSync();
      assert.equal(video.errors.title.message, 'title is required');
    });
  });


describe('#description', () => {
  it('is a String', () => {
    const descriptionAsInt = 1;
    const video = new Video({description: descriptionAsInt});
    assert.strictEqual(video.description, descriptionAsInt.toString());
    });
  });

  describe('#url', () => {
    it('is a String', () => {
      const urlAsInt = 1;
      const video = new Video({url: urlAsInt});
      assert.strictEqual(video.url, urlAsInt.toString());
      });
      it('is a requirement', () => {
        const video = new Video({url: null});
        video.validateSync();
        assert.equal(video.errors.url.message, 'a url is required');
      });
    });
});
