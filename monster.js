/**
   _____                             __                         _____
  /     \    ____    ____    _______/  |_   ____  _______      /     \    ____
 /  \ /  \  /  _ \  /    \  /  ___/\   __\_/ __ \ \_  __ \    /  \ /  \ _/ __ \
/    Y    \(  <_> )|   |  \ \___ \  |  |  \  ___/  |  | \/   /    Y    \\  ___/
\____|__  / \____/ |___|  //____  > |__|   \___  > |__|      \____|__  / \___  >
        \/              \/      \/             \/                    \/      \/

*/

// Collection is shared between client and server
Monsters = new Meteor.Collection();

if (Meteor.isClient) {
  
  // Non-reactive, plain old array.
  var straps = [
    "If I were a monster...",
    "A face a monster could love",
    "What are you looking at?",
    "The mirror"
  ]
  
  // Store a random strapline in the reactive Session object on the client.
  Session.set('strapline', randomStrapLine());

  // Add a helper to retrieve a strapline
  Template.header.strapline = function () {
    // Meteor notices this templates is dependant on the Session's strapline value, and will re-render when it chages.
    return Session.get('strapline');
  };

  // on click: pick another random strapline and set it on the Session
  Template.header.events({
    click: function (evt) {
      Session.set('strapline', randomStrapLine());
    },
  });

  Template.monsters.isEmpty = function () {
    return Monsters.find().count() < 1;
  }  

  Template.monsters.allOfThem = function () {
    return Monsters.find({}, {sort:[['createdDate','desc']]});
  };

  Template.search.events({
    submit: function (evt) {
      evt.preventDefault();
    
      var term = $('#searchInput').val()
    
      console.log($('#searchInput').val())

      var id = Monsters.insert({createdDate: Date.now(), name: term});

      findImg(term, function (url) {
        Monsters.update(id, {$set: {img: url}});
      });
    }
  });  
}

// ---- Helper function, ignore for now ---------------------------------------

// TRY ME LATER: Replace this with http://docs.meteor.com/#random
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomStrapLine () {
  return straps[getRandomInt(0, straps.length - 1)]
} 

// Search google for an image url...
function findImg(search, cb) {
  var hash = CryptoJS.MD5(search).toString()
  var imgUrl = 'http://www.gravatar.com/avatar/' + hash + '?d=monsterid&s=400'

  setTimeout(function(){
    cb(imgUrl)
  }, 2000)
}
