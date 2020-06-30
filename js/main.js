'use strict';

var MIN = 1;
var MESSAGE_MAX = 2;
var COMMENT_MAX = 13;
var AVATAR_MAX = 6;
var PHOTOS_MAX = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var SCALE_STEP = 25;
var VALUE_MIN = 25;
var VALUE_MAX = 100;
var FULL_PERCENT = 100;
var PHOBOS_MAX = 3;
var HEAT_MAX = 2;
var HASHTAG_MIN = 2;
var HASHTAG_MAX = 20;
var HASHTAGS_MAX = 5;

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
var bigPicture = document.querySelector('.big-picture');
var bigPictureClose = bigPicture.querySelector('#picture-cancel');

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var modalOpen = function () {
  document.querySelector('body').classList.add('modal-open');
};

var modalClose = function () {
  document.querySelector('body').classList.remove('modal-open');
};

var closePopup = function (popup, popupClose) {
  popupClose.addEventListener('click', function () {
    popup.classList.add('hidden');
    modalClose();
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      popup.classList.add('hidden');
      modalClose();
    }
  });

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

  modalOpen();

  return bigPicture;
};

renderBigPhoto(photos[0]);

closePopup(bigPicture, bigPictureClose);

var loader = document.querySelector('#upload-file');
var loaderClose = document.querySelector('#upload-cancel');
var imgOverlay = document.querySelector('.img-upload__overlay');

loader.addEventListener('change', function () {
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
  modalOpen();
});

closePopup(imgOverlay, loaderClose);
imgOverlay.value = '';

// document.querySelector('.img-upload__overlay').classList.remove('hidden');

var scaleControlSmaller = document.querySelector('.scale__control--smaller');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var scaleControlValue = document.querySelector('.scale__control--value');
var imgPreview = document.querySelector('.img-upload__preview img');

scaleControlSmaller.addEventListener('click', function () {
  var scaleValue = Number(scaleControlValue.value.slice(0, -1));
  var newValue = scaleValue - SCALE_STEP;
  scaleControlValue.value = newValue + '%';
  imgPreview.style.transform = 'scale(' + newValue / FULL_PERCENT + ')';
  scaleControlBigger.removeAttribute('disabled', 'disabled');
  if (newValue < VALUE_MIN) {
    scaleControlValue.value = VALUE_MIN + '%';
    scaleControlSmaller.setAttribute('disabled', 'disabled');
    imgPreview.style.transform = 'scale(' + VALUE_MIN / FULL_PERCENT + ')';
  }
});

scaleControlBigger.addEventListener('click', function () {
  var scaleValue = Number(scaleControlValue.value.slice(0, -1));
  var newValue = scaleValue + SCALE_STEP;
  scaleControlValue.value = newValue + '%';
  imgPreview.style.transform = 'scale(' + newValue / FULL_PERCENT + ')';
  scaleControlSmaller.removeAttribute('disabled', 'disabled');
  if (newValue > VALUE_MAX) {
    scaleControlValue.value = VALUE_MAX + '%';
    scaleControlBigger.setAttribute('disabled', 'disabled');
    imgPreview.style.transform = 'scale(' + VALUE_MAX / FULL_PERCENT + ')';
  }
});

var effectLevelPin = document.querySelector('.effect-level__pin');
var effectLevelValue = document.querySelector('.effect-level__value');
var effectsRadio = document.querySelectorAll('.effects__radio');

effectLevelPin.addEventListener('mouseup', function () {
  var selectedEffect = '';
  for (var i = 0; i < effectsRadio.length; i++) {
    if (effectsRadio[i].checked) {
      selectedEffect = effectsRadio[i].value;
    }
  }

  var initialSaturation = Number(effectLevelValue.value);
  switch (selectedEffect) {
    case 'none':
      imgPreview.className = '';
      imgPreview.style.filter = '';
      break;

    case 'chrome':
      imgPreview.className = '';
      imgPreview.style.filter = '';
      imgPreview.className = 'effects__preview--chrome';
      imgPreview.style.filter = 'grayscale(' + initialSaturation / FULL_PERCENT + ')';
      break;

    case 'sepia':
      imgPreview.className = '';
      imgPreview.style.filter = '';
      imgPreview.className = 'effects__preview--sepia';
      imgPreview.style.filter = 'sepia(' + initialSaturation / FULL_PERCENT + ')';
      break;

    case 'marvin':
      imgPreview.className = '';
      imgPreview.style.filter = '';
      imgPreview.className = 'effects__preview--marvin';
      imgPreview.style.filter = 'invert(' + initialSaturation + '%)';
      break;

    case 'phobos':
      imgPreview.className = '';
      imgPreview.style.filter = '';
      imgPreview.className = 'effects__preview--phobos';
      imgPreview.style.filter = 'blur(' + Math.round(initialSaturation / FULL_PERCENT * PHOBOS_MAX) + 'px)';
      break;

    case 'heat':
      imgPreview.className = '';
      imgPreview.style.filter = '';
      imgPreview.className = 'effects__preview--heat';
      imgPreview.style.filter = 'brightness(' + (MIN + initialSaturation / FULL_PERCENT * HEAT_MAX) + ')';
      break;

    default:
      imgPreview.className = '';
      imgPreview.style.filter = '';
  }
});

var imgForm = document.querySelector('#upload-select-image');
imgForm.action = 'https://javascript.pages.academy/kekstagram';

var hashtagInput = document.querySelector('.text__hashtags');

// hashtagInput.addEventListener('input', function () {
//   var hashtags = hashtagInput.split(' ');
//   var hashtag = hashtags[i];
//   var re = /^#[а-яА-Яa-zA-Z0-9]+$/;
//   for (var i = 0; i < hashtags.length; i++) {
//     var hashtagLetters = hashtags[i].split('');
//     for (var j = 0; j < hashtagLetters.length; j++) {
//       if (hashtagLetters[0] !== '#') {
//         hashtagInput.setCustomValidity('Хэштег должен начинаться с #');
//       } else {
//         hashtagInput.setCustomValidity('');
//       }
//     }
//     if (re.exec(hashtag)) {
//       hashtagInput.setCustomValidity('Хэштег должен содержать только буквы и цифры');
//     } else if (hashtags[i].length < HASHTAG_MIN) {
//       hashtagInput.setCustomValidity('Хэштег должен состоять минимум из 2-х символов');
//     } else if (hashtags[i].length > HASHTAG_MAX) {
//       hashtagInput.setCustomValidity('Удалите лишние ' + (hashtags[i].length - HASHTAG_MAX) + ' символы в хэштеге');
//     } else if (hashtags.length > HASHTAGS_MAX) {
//       hashtagInput.setCustomValidity('Максимально допустимое количество хэштегов - 5 шт.');
//     } else if (hashtag === hashtags[i] && hashtag.toLowerCase() === hashtags[i].toLowerCase()) {
//       hashtagInput.setCustomValidity('Один и тот же хэштег не может быть использован дважды');
//     } else {
//       hashtagInput.setCustomValidity('');
//     }
//   }
// });

hashtagInput.addEventListener('input', function () {
  var errorMessage = '';
  var lastHashtag = null;
  var hashtags = hashtagInput.value.split(' ');
  var tagsWithOwtLastElement = hashtags.slice();
  for (var j = 0; j < tagsWithOwtLastElement.length; j++) {
    tagsWithOwtLastElement[j].toLowerCase();
  }
  var re = /^#[а-яА-Яa-zA-Z0-9]*$/;
  for (var i = 0; i < hashtags.length; i++) {
    lastHashtag = hashtags[hashtags.length - 1];
    var hashtagLetters = hashtags[i].split('');

    if (hashtagLetters[0] !== '#') {
      errorMessage = 'Хэштег должен начинаться с #';
    } else if (hashtagLetters.length < HASHTAG_MIN) {
      errorMessage = 'Хэштег должен состоять минимум из 2-х символов';
    } else if (hashtags[i].length > HASHTAG_MAX) {
      errorMessage = 'Удалите лишние ' + (hashtags[i].length - HASHTAG_MAX) + ' символы в хэштеге';
    } else if (hashtags.length > HASHTAGS_MAX) {
      errorMessage = 'Максимально допустимое количество хэштегов - 5 шт.';
    } else if (tagsWithOwtLastElement.includes(lastHashtag)) {
      errorMessage = 'Один и тот же хэштег не может быть использован дважды';
    } else if (re.exec(hashtagLetters.shift())) {
      errorMessage = 'Хэштег должен содержать только буквы и цифры';
    } else {
      errorMessage = '';
    }

    hashtagInput.setCustomValidity(errorMessage);
  }
});
