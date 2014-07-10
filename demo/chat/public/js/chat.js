$(function () {
  var me = null,
    socket = io.connect();

  // Call this method when you are ready to send a message to the server.
  function share() {
    var status = $.trim($('#status').val()),
        target = $('#target').val();

    // Nothing to share
    if(status === '') {
      return;
    }

    // When messaging an individual user, update the target to be the user
    // that is being messaged.
    if(target === 'user') {
      target = $('#target_user').val();
    }

    // Dispatch the message to the server.
    socket.emit('post', status, target);

    // Clear the status input for the next message.
    $('#status').val('');
  }

  // Call this method to set this user's username
  function setName() {
    me = $('#name').val();
    socket.emit('set name', $('#name').val());
  }

  /**
   * Socket Event Handlers
   */
  socket.on('connect', function () {
    $('#connection').removeClass('disconnected').addClass('connected').html('connected').show();
    $('#update').hide();
    $('#login').show();
  });

  socket.on('disconnect', function () {
    $('#connection').removeClass('connected').addClass('disconnected').html('disconnected').show();
  });

  socket.on('set name', function (msg) {
    if (me === msg.content()) {
      $('#error').hide();
      $('#login').hide();
      $('#update').show();
      $('#status').focus();
    }
    $('#messages').prepend(
      $('<li>')
      .append($('<div>').addClass('user-box').addClass('you').append(message.content()))
        .append($('<div>').addClass('message-container').append(
          $('<div>').addClass('bubble').append('just joined!'),
          $('<div>').addClass('message-summary').append(
            'To:',
            $('<span>').addClass('italic').append(message.target()),
            'At:',
            $('<span>').addClass('italic').append(message.created())
          )
        ))
    );
  });

  socket.on('left', function (msg) {
    $('#messages').prepend(
      $('<li>')
      .append($('<div>').addClass('user-box').addClass('you').append(msg.actor()))
        .append($('<div>').addClass('message-container').append(
          $('<div>').addClass('bubble').append('just left!'),
          $('<div>').addClass('message-summary').append(
            'To:',
            $('<span>').addClass('italic').append(msg.target()),
            'At:',
            $('<span>').addClass('italic').append(msg.created())
          )
        ))
    );
  });

  socket.on('post', function (msg) {
    var userClass = msg.actor() === me ? '' : 'you', to = msg.target();

    if (msg.target() === me) {
      to = 'you';
    }

    $('#messages').prepend(
      $('<li>')
      .append($('<div>').addClass('user-box').addClass(userClass).append(msg.actor()))
        .append($('<div>').addClass('message-container').append(
            $('<div>').addClass('bubble').append(msg.content()),
          $('<div>').addClass('message-summary').append(
            'To:',
            $('<span>').addClass('italic').append(msg.target()),
            'At:',
            $('<span>').addClass('italic').append(msg.created())
          )
        ))
    );
  });

  /**
   * DOM Event Handlers
   */
  $('#go').click(setName);
  $('#name').keypress(function(e) {
    if(e.keyCode === 13) {
      setName();
    }
  });

  $('#share').click(share);
  $('#status').keypress(function(e) {
    if(e.keyCode === 13) {
      share();
    }
  });

  $('#target').change(function () {
    if ($(this).val() === 'user') {
      $('#target_user').show();
    }
    else {
      $('#target_user').hide();
    }
  });

});
