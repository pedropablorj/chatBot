(function() {
  var $chatWindow = $(".chatbot-window");

  var BotWindow = function($chatWindow) {
    var self = this;
    self.$chatWindow = $chatWindow;
    self.$qInput = self.$chatWindow.find('#user-input-q');
    self.$qClear = self.$chatWindow.find('#clear-q');
    self.$conversationBubble = self.$chatWindow.find(".conversation-body");

    // Method to send message to the API
    self.sendMessage = function (queryMessage, cb) {
      var API_END_POINT = 'http://test.pedropablo.xyz/';

      $.ajax(API_END_POINT, {
        cache: false,
        dataType: 'json',
        data: {
          q : queryMessage
        },
        error: function(request, status, err) {
          var fakeResponse = {
            chat: "this is a fake response just for testing"
          }
          if (status == "timeout") {
            // send fake data
            cb(undefined, fakeResponse);
          } else {
            cb(status);
          }
        },
        success: function(response) {
          cb(undefined, response);
        },
        timeout: 5000,
      });
    }

    self.renderMessage = function(type, msg) {
      self.$conversationBubble.append('<div class="conversation-bubble '+ type +'-bubble"><p>'+ msg +'</p></div>');
      // Go to the latest message
      self.$conversationBubble.scrollTop(self.$conversationBubble.prop("scrollHeight"));
    };

    self.renderHotels = function(type, hotels) {
      hotels = [0,1,2]; // Hack: while we get the real data from the hotels
      var cards = [];
      $.each(hotels, function(idx, hotel) {
        var fakeData = {
          img: 'http://cdn.luxedb.com/wp-content/uploads/2013/06/Wonderful-Katikies-Hotel-in-Oia-Santorini-Greece-4.jpg',
          hotelName: 'Katikies Hotel in Oia',
          rating: '9.3',
          price: '60.00',
          currencySymbol:'$'
        }
        // FIXME: this should be a template instead of just be hardcoded
        cards.push(
        '<div class="card">' +
          '<figure class="card-thumbnail">' +
            '<img src="'+ fakeData.img +'" alt="hotel img">' +
            '<figcaption class="hotel-name">' +
              fakeData.hotelName +
            '</figcaption>' +
            '<span class="hotel-rating">'+ fakeData.rating +'</span>' +
          '</figure>' +
          '<span class="hotel-class">' +
            '<i class="fa fa-star"></i>' +
            '<i class="fa fa-star"></i>' +
            '<i class="fa fa-star"></i>' +
            '<i class="fa fa-star"></i>' +
            '<i class="fa fa-star"></i>' +
          '</span>' +
          '<button type="button" name="book" class="btn-book">Book now for '+ fakeData.currencySymbol + fakeData.price +'</button>' +
        '</div>'
      );
      });
      var cardsString = cards.join(''); // Convert the array into a sinlge string
      var $cardContainer = $('<div class="card-container">' + cardsString +' </div>')
      self.$conversationBubble.append($cardContainer);
      $cardContainer.slick(); // Slider plugin
    };

    // Initialize Listeners

    self.$qClear.on('click', function(e) {
      // Clear input
      self.$qInput.val('');
    });

    self.$qInput.keydown(function (e) {
      var $el = $(this);
      var msg = $el.val();
      // Get tne enter key press
      if(msg !== '' && e.keyCode == 13) {
        // clear Input
        $el.val('');
        // send message to the UI
        self.renderMessage('user', msg);
        // render the response
        // TODO: add class to show a response wating class
        self.sendMessage(msg, function(err, response) {
          if (err) throw new Error(err);
          // Send response message to the UI
          self.renderMessage('bot', response.chat);
          // Send the hotels message to the UI
          self.renderHotels('bot', response.hotels); // remove this comment and uncomment the sentence
          // if (response.hotels && response.hotels.length) {
          //   self.renderHotels('bot', response.hotels);
          // }
        });
      }
    });

    return self;
  }

  // Initialize botWindow
  var botWindow = new BotWindow($chatWindow);
})();
