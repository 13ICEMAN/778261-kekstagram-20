'use strict';

var MIN = 1;
var MESSAGE_MAX = 2;
var COMMENT_MAX = 13;
var AVATAR_MAX = 6;
var PHOTOS_MAX = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;

var comments = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var names = ['Алексей)', 'Богдан', 'Лиза', 'Света', 'Георгий', 'Серега', 'Ибрагим', 'Нурлан'];

var pictures = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture').content;

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generateMessage = function () {
  var textMessage = comments[getRandomNumber(0, comments.length - 1)];
  if (getRandomNumber(MIN, MESSAGE_MAX) === MESSAGE_MAX) {
    textMessage = comments[getRandomNumber(0, comments.length - 1)] + ' ' +
    comments[getRandomNumber(0, comments.length - 1)];
  }
  return textMessage;
};

var generateComments = function () {
  var reviews = [];
  for (var i = 0; i <= getRandomNumber(MIN, COMMENT_MAX); i++) {
    var comment = {
      avatar: 'img/avatar-' + getRandomNumber(MIN, AVATAR_MAX) + '.svg',
      message: generateMessage(),
      name: names[getRandomNumber(0, names.length - 1)]
    };
    reviews.push(comment);
  }
  return reviews;
};

var generatePhotos = function () {
  var images = [];
  for (var i = MIN; i <= PHOTOS_MAX; i++) {
    var photo = {
      url: 'photos/' + i + '.jpg',
      description: 'photoDescription',
      likes: getRandomNumber(LIKES_MIN, LIKES_MAX),
      comments: generateComments()
    };
    images.push(photo);
  }
  return images;
};

var renderPhoto = function (photo) {
  var photoElement = pictureTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return photoElement;
};

var photos = generatePhotos();

var createFragment = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPhoto(photos[i]));
  }
  pictures.appendChild(fragment);
  return fragment;
};

createFragment();
