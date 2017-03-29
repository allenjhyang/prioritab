// An editable, sortable list
// http://web.koesbong.com/2011/01/24/sortable-and-editable-to-do-list-using-html5s-localstorage/

$(function () {
  var il, im, ir,
    listCounters = ['todo-counter-left', 'todo-counter-mid', 'todo-counter-right', 'todo-dones'],
    j = 0,
    k,
    $formLeft = $('#todo-form-left'),
    $formMid = $('#todo-form-mid'),
    $formRight = $('#todo-form-right'),
    $removeLink = $('#shown-items-left li a'),
    $itemListLeft = $('#shown-items-left'),
    $itemListMid = $('#shown-items-mid'),
    $itemListRight = $('#shown-items-right'),
    $editable = $('.editable'),
    $sweepDone = $('.sweep-link'),
    $clearAll = $('.clear-all-link'),
    $newTodo = $('.todo'),
    order = [],
    orderList;

  chrome.storage.sync.get(listCounters, function (result) {
    il = (result['todo-counter-left']) ? result['todo-counter-left'] + 1 : 1;
    im = (result['todo-counter-mid']) ? result['todo-counter-mid'] + 1 : 1;
    ir = (result['todo-counter-right']) ? result['todo-counter-right'] + 1 : 1;
    dones = (result['todo-dones']) ? result['todo-dones'] : [];
  });

  var checkIfCompleted = function (toDoKey) {
    var done = (dones.indexOf(toDoKey) > -1);
    return done;
  };

  // Holds the HTML for a todo card (HTML might appear elsewhere as well)
  var constructToDoCard = function (toDoKey, toDoText) {
    var done = (checkIfCompleted(toDoKey)) ? 'checked' : '',
      fontColorToUse = (done === 'checked') ? 'shadow-color' : 'main-font-color',
      borderColorToUse = (done === 'checked') ? 'shadow-border-color' : 'main-border-color';
    return "<li class='todo-card main-bgcolor " + fontColorToUse + " " + borderColorToUse + "' id='" + toDoKey + "'>" +
      "<div class='squaredThree'>" +
      "<input id='" + toDoKey + "-check' type='checkbox' name='check' " + done + "/>" +
      "<label for='" + toDoKey + "-check'></label>" +
      "</div>" +
      "<div class='todo-text'>" + toDoText + "</div>" +
      "<div class='pull-right todo-card-right'><a href='#' class='main-font-color'><i class='fa fa-trash-o' title='Delete'></i></a></div>" +
      "</li>";
  };

  // Load todo list keys
  chrome.storage.sync.get('todo-orders', function (retrieved) {
    orderList = retrieved['todo-orders'];
    orderList = orderList ? orderList.split(',') : [];

    // Sort todo list keys into their component lists
    var orderListLeft = [],
      orderListMid = [],
      orderListRight = [];
    for (ll = 0; ll < orderList.length; ll++) {
      if (orderList[ll].indexOf('left') >= 0) {
        orderListLeft.push(orderList[ll]);
      } else if (orderList[ll].indexOf('mid') >= 0) {
        orderListMid.push(orderList[ll]);
      } else if (orderList[ll].indexOf('right') >= 0) {
        orderListRight.push(orderList[ll]);
      }
    }

    // Render existing todo items into the three separate lists
    chrome.storage.sync.get(orderListLeft, function (result) {
      orderListLeft.forEach(function (key) {
        $('#shown-items-left').append(constructToDoCard(key, result[key]));
        if (checkIfCompleted(key)) {
          $('#' + key).find('.todo-text').addClass('todo-card-done');
        }
      });
      $('li a').fadeOut();
    });

    chrome.storage.sync.get(orderListMid, function (result) {
      orderListMid.forEach(function (key) {
        $('#shown-items-mid').append(constructToDoCard(key, result[key]));
        if (checkIfCompleted(key)) {
          $('#' + key).find('.todo-text').addClass('todo-card-done');
        }
      });
      $('li a').fadeOut();
    });

    chrome.storage.sync.get(orderListRight, function (result) {
      orderListRight.forEach(function (key) {
        $('#shown-items-right').append(constructToDoCard(key, result[key]));
        if (checkIfCompleted(key)) {
          $('#' + key).find('.todo-text').addClass('todo-card-done');
        }
      });
      $('li a').fadeOut();
      // ScrollMessage();
    });

  });

  // What happens when you check the checkbox...
  $('.shown-items').on('change', 'input[type=checkbox]', function () {
    var toDoKey = $(this).parent().parent().attr('id');
    if ($(this).is(':checked') === true) {
      $(this).parent().parent().addClass('shadow-color').addClass('shadow-border-color').removeClass('main-font-color').removeClass('main-border-color');
      $(this).parent().parent().find('.todo-text').addClass('todo-card-done');
      dones.push(toDoKey);
    } else {
      $(this).parent().parent().addClass('main-font-color').addClass('main-border-color').removeClass('shadow-color').removeClass('shadow-border-color');
      $(this).parent().parent().find('.todo-text').removeClass('todo-card-done');
      if (checkIfCompleted(toDoKey)) {
        dones.splice(dones.indexOf(toDoKey), 1);
      }
    }
    chrome.storage.sync.set({
      'todo-dones': dones
    });
  });

  // Add todo
  $formLeft.submit(function (e) {
    e.preventDefault();
    $.publish('/add/', []);
  });

  $formMid.submit(function (e) {
    e.preventDefault();
    $.publish('/add/', []);
  });

  $formRight.submit(function (e) {
    e.preventDefault();
    $.publish('/add/', []);
  });

  // Remove todo
  $itemListLeft.delegate('a', 'click', function (e) {
    var $this = $(this);
    e.preventDefault();
    $.publish('/remove/', [$this]);
  });

  $itemListMid.delegate('a', 'click', function (e) {
    var $this = $(this);
    e.preventDefault();
    $.publish('/remove/', [$this]);
  });

  $itemListRight.delegate('a', 'click', function (e) {
    var $this = $(this);

    e.preventDefault();
    $.publish('/remove/', [$this]);
  });

  // Sort todo
  $itemListLeft.sortable({
    revert: true,
    connectWith: ['#shown-items-mid, #shown-items-right'],
    stop: function () {
      $.publish('/regenerate-list/', []);
    }
  });

  $itemListMid.sortable({
    revert: true,
    connectWith: ['#shown-items-left, #shown-items-right'],
    stop: function () {
      $.publish('/regenerate-list/', []);
    }
  });

  $itemListRight.sortable({
    revert: true,
    connectWith: ['#shown-items-left, #shown-items-mid'],
    stop: function () {
      $.publish('/regenerate-list/', []);
    }
  });

  // Edit and save todo
  $(".todo-text").inlineEdit({
    buttons: '',
    cancelOnBlur: true,
    save: function (e, data) {
      var newTodoID = $(this).parent().attr('id'),
        objToSave = {};
      objToSave[newTodoID] = data.value;
      chrome.storage.sync.set(objToSave);
    }
  });

  // Sweep done
  $sweepDone.click(function (e) {
    e.preventDefault();
    var listToImpact = e.originalEvent.srcElement.getAttribute('data-list');
    $.publish('/clear-all/', [listToImpact, false]);
  });

  // Clear all
  $clearAll.click(function (e) {
    e.preventDefault();
    var listToImpact = e.originalEvent.srcElement.getAttribute('data-list');
    $.publish('/clear-all/', [listToImpact, true]);
  });

  // Fade In and Fade Out the Remove link on hover
  $itemListLeft.delegate('li', 'mouseover mouseout', function (event) {
    var $this = $(this).find('a');

    if (event.type === 'mouseover') {
      $this.stop(true, true).fadeIn();
    } else {
      $this.stop(true, true).fadeOut();
    }
  });

  $itemListMid.delegate('li', 'mouseover mouseout', function (event) {
    var $this = $(this).find('a');

    if (event.type === 'mouseover') {
      $this.stop(true, true).fadeIn();
    } else {
      $this.stop(true, true).fadeOut();
    }
  });

  $itemListRight.delegate('li', 'mouseover mouseout', function (event) {
    var $this = $(this).find('a');

    if (event.type === 'mouseover') {
      $this.stop(true, true).fadeIn();
    } else {
      $this.stop(true, true).fadeOut();
    }
  });

  // Subscribes
  $.subscribe('/add/', function () {
    var todoToAdd = null;
    for (ind = 0; ind < $newTodo.length; ind++) {
      var todoBox = $newTodo[ind];
      if (todoBox.value !== "") {
        todoToAdd = $newTodo[ind];
      }
    }
    if (todoToAdd) {

      // Figure out which list it's in
      var listID = todoToAdd.getAttribute('data-list'),
        listToImpact,
        listCounter;

      switch (listID) {
        case 'left':
          listToImpact = $itemListLeft;
          listCounter = il;
          break;
        case 'mid':
          listToImpact = $itemListMid;
          listCounter = im;
          break;
        case 'right':
          listToImpact = $itemListRight;
          listCounter = ir;
          break;
      }

      // Take the value of the input field and save it to localStorage
      var newTodoID = "todo-" + listID + '-' + listCounter;

      var objToSave = {};
      objToSave[newTodoID] = todoToAdd.value;
      chrome.storage.sync.set(objToSave);

      // Set the to-do max counter so on page refresh it keeps going up instead of reset
      var counterToSave = {},
        counterKey = "todo-counter-" + listID;
      counterToSave[counterKey] = listCounter;
      chrome.storage.sync.set(counterToSave);

      // Append a new list item with the value of the new todo list
      chrome.storage.sync.get(newTodoID, function (result) {
        listToImpact.append(constructToDoCard(newTodoID, result[newTodoID]));
        $('li a:visible').fadeOut();

        $.publish('/regenerate-list/', []);
      });

      // Hide the new list, then fade it in for effects
      $("#todo-" + listID + '-' + listCounter).css('display', 'none').fadeIn();

      // Empty the input field
      todoToAdd.value = "";

      switch (listID) {
        case 'left':
          il++;
          chrome.storage.sync.set({
            'todo-counter-left': il
          });
          break;
        case 'mid':
          im++;
          chrome.storage.sync.set({
            'todo-counter-mid': im
          });
          break;
        case 'right':
          ir++;
          chrome.storage.sync.set({
            'todo-counter-right': ir
          });
          break;
      }
      // ScrollMessage();
    }
  });

  $.subscribe('/remove/', function ($this) {
    var parentId = $this.parent().parent().attr('id');

    // Remove todo list from localStorage based on the id of the clicked parent element
    chrome.storage.sync.remove(parentId);

    // Remove todo from the dones list, in case it was there
    if (checkIfCompleted(parentId)) {
      dones.splice(dones.indexOf(parentId), 1);
      chrome.storage.sync.set({
        'todo-dones': dones
      });
    }

    // Fade out the list item then remove from DOM
    $this.parent().fadeOut(function () {
      $this.parent().parent().remove();

      $.publish('/regenerate-list/', []);
    });

    // ScrollMessage();
  });

  var reassignToList = function (inputDict) {
    var target = inputDict['target'],
      items = inputDict['items'];

    switch (target) {
      case 'left':
        listCounter = il;
        break;
      case 'mid':
        listCounter = im;
        break;
      case 'right':
        listCounter = ir;
        break;
    }

    items.each(function () {
      if (this.id.indexOf(target) < 0) {
        // Reassign ID
        var oldID = this.id,
          oldValue;
        newID = "todo-" + target + "-" + listCounter;
        this.id = newID;

        switch (target) {
          case 'left':
            il++;
            chrome.storage.sync.set({
              'todo-counter-left': il
            });
            break;
          case 'mid':
            im++;
            chrome.storage.sync.set({
              'todo-counter-mid': im
            });
            break;
          case 'right':
            ir++;
            chrome.storage.sync.set({
              'todo-counter-right': ir
            });
            break;
        }

        // Store todo item under new key
        chrome.storage.sync.get(oldID, function (retrieved) {
          oldValue = retrieved[oldID];
          var objToSave = {};
          objToSave[newID] = oldValue;
          chrome.storage.sync.set(objToSave);
        });

        if (checkIfCompleted(oldID)) { // If the todo was already done
          dones.splice(dones.indexOf(oldID), 1); // Remove the old todo ID from the dones list
          dones.push(newID); // and push in the new one
          chrome.storage.sync.set({
            'todo-dones': dones
          });
        }

      }
    });
    // ScrollMessage();
  };

  $.subscribe('/regenerate-list/', function () {
    var $todoItemsLeft = $('#shown-items-left li'),
      $todoItemsMid = $('#shown-items-mid li');
    $todoItemsRight = $('#shown-items-right li');


    // Make sure all items in the respective lists have the right 'tag'
    // (in event of cross-list movement)
    reassignToList({
      'target': 'left',
      'items': $todoItemsLeft
    });
    reassignToList({
      'target': 'mid',
      'items': $todoItemsMid
    });
    reassignToList({
      'target': 'right',
      'items': $todoItemsRight
    });

    // Empty the order array
    order.length = 0;

    // Go through the list item, grab the ID then push into the array
    $todoItemsLeft.each(function () {
      var id = $(this).attr('id');
      order.push(id);
    });

    $todoItemsMid.each(function () {
      var id = $(this).attr('id');
      order.push(id);
    });

    $todoItemsRight.each(function () {
      var id = $(this).attr('id');
      order.push(id);
    });

    // Convert the array into string and save to localStorage
    chrome.storage.sync.set({
      'todo-orders': order.join(',')
    });
  });

  $.subscribe('/clear-all/', function (listToImpactName, clearAll) {

    var $todoListLi = $('#shown-items-left li'),
      listToImpact;

    switch (listToImpactName) {
      case 'left':
        itemsToImpact = $('#shown-items-left li a');
        break;
      case 'mid':
        itemsToImpact = $('#shown-items-mid li a');
        break;
      case 'right':
        itemsToImpact = $('#shown-items-right li a');
        break;
    }

    itemsToImpact.each(function (index) {
      var parentId = $(this).parent().parent().attr('id');
      if (clearAll || (!clearAll && checkIfCompleted(parentId))) {
        $.publish('/remove/', [$(this)]);
      }
    });
  });
});
