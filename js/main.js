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
var commentList = document.querySelector('.social__comments');
var commentItem = document.querySelector('.social__comment');

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
      description: 'Описание фотографии',
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

var renderComment = function (comment) {
  var commentElement = commentItem.cloneNode(true);

  commentElement.querySelector('.social__picture').src = comment.avatar;
  commentElement.querySelector('.social__picture').alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;

  return commentElement;
};

var renderPhotos = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPhoto(photos[i]));
  }
  pictures.appendChild(fragment);
  return fragment;
};

renderPhotos();

var renderBigPhoto = function (photo) {
  var bigPicture = document.querySelector('.big-picture');
  bigPicture.classList.remove('hidden');

  bigPicture.querySelector('.big-picture__img img').src = photo.url;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photo.description;

  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');

  var photoComments = photo.comments;

  for (var i = 0; i < photoComments.length; i++) {
    var photoComment = renderComment(photoComments[i]);
    commentList.appendChild(photoComment);
  }

  return bigPicture;
};

renderBigPhoto(photos[0]);

document.querySelector('body').classList.add('modal-open');
