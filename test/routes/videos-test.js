const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Video = require('../../models/video');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {jsdom} = require('jsdom');

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

const queryHTML = (htmlAsString, selector) => {
  return jsdom(htmlAsString).querySelector(selector);
};

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = queryHTML(htmlAsString, selector);
  if(selectedElement !== null) {
    return selectedElement.textContent.trim();
  }
};

// GET TESTS
describe('GET /videos', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('renders existing videos', async () => {
    const videoToSave = {
      title: 'My Test Video',
      description: 'This is a test video',
      url: generateRandomUrl('www.youtube.com'),
    };

    const response = await request(app).get('/videos');

    const text = parseTextFromHTML(response.text, 'body');
    assert.include(text, videoToSave.title);
  });
});

describe('GET /videos/:id', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('renders the correct video', async () => {
    const videoToSave = {
      title: 'My Test Video',
      description: 'This is a test video',
      url: generateRandomUrl('www.youtube.com'),
    };

    const response = await request(app).get(`/videos/${videoToSave.id}`);

    const text = parseTextFromHTML(response.text, 'body');
    assert.include(text, videoToSave.title);
    assert.include(text, videoToSave.description);
  });
});

//POST TESTS
describe('POST /videos', () => {

  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('checks that a post to /videos returns a 302 status', async () => {
    const videoToSave = {
      title: 'My Test Video',
      description: 'This is a test video',
      url: generateRandomUrl('www.youtube.com')
    }

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToSave);
      assert.equal(response.status, 302);
  });

  it('saves the video', async () => {
    const videoToSave = {
      title: 'My Test Video',
      description: 'This is a test video',
      url: generateRandomUrl('www.youtube.com')
    }

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToSave);

      const video = await Video.findOne({});
      assert.include(video, videoToSave);
  });

  describe('when the title is missing', () => {
    it('does not save the video', async () => {
      const videoToSave = {
        title: '',
        description: 'This is a test video',
        url: generateRandomUrl('www.youtube.com')
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToSave);

        const video = await Video.find({});
        assert.equal(video.length, 0);
    });

    it('responds with a 400 error', async () =>{
      const videoToSave = {
        title: '',
        description: 'This is a test video',
        url: generateRandomUrl('www.youtube.com')
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToSave);

        const video = await Video.find({});
        assert.equal(response.status, 400);
    });

    it('renders the video form', async () => {
      const videoToSave = {
        title: '',
        description: 'This is a test video',
        url: generateRandomUrl('www.youtube.com')
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToSave);

        const title = queryHTML(response.text, '[name="title"]');
        assert.ok(title, 'could not find `title` input');
    });

    it('renders the validation error message', async () =>{
      const videoToSave = {
        title: '',
        description: 'This is a test video',
        url: generateRandomUrl('www.youtube.com')
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToSave);

        const text = parseTextFromHTML(response.text, 'body');
        assert.include(text, 'title is required');
    });

    it('preserves the rest of the fields', async () =>{
      const videoToSave = {
        title: '',
        description: 'This is a test video',
        url: generateRandomUrl('www.youtube.com')
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToSave);

      const description = queryHTML(response.text, '[name="description"]');
      const url = queryHTML(response.text, '[name="url"]');
      assert.equal(description.value, videoToSave.Description);
      assert.equal(url.value, videoToSave.url);
    });
  });

  describe('when the url is missing', () => {
    it('renders the validation erroe message', async () => {
      const videoToSave = {
        title: 'Some Title',
        description: 'This is a test video',
        url: ''
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToSave);

        const text = parseTextFromHTML(response.text, 'body');
        assert.include(text, 'a url is required');
    });
    it('preserves the rest of the fields', async () =>{
      const videoToSave = {
        title: 'Some Title',
        description: 'This is a test video',
        url: ''
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToSave);

      const title = queryHTML(response.text, '[name="title"]');
      const description = queryHTML(response.text, '[name="description"]');
      assert.equal(description.value, videoToSave.title);
      assert.equal(description.value, videoToSave.description);
    });
  });
});
