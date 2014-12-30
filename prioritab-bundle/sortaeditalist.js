// An editable, sortable list
// http://web.koesbong.com/2011/01/24/sortable-and-editable-to-do-list-using-html5s-localstorage/

$(function() {
    var i = Number(localStorage.getItem('todo-counter-left')) + 1,
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
        $clearAll = $('.clear-all-link'),
        $newTodo = $('.todo'),
        order = [],
        orderList;

    // Load todo list keys
    orderList = localStorage.getItem('todo-orders');
    orderList = orderList ? orderList.split(',') : [];

    // Sort todo list keys into their component lists
    var orderListLeft = [],
        orderListMid = [],
        orderListRight = [];
    for (ll = 0; ll < orderList.length; ll++) {
        if (orderList[ll].indexOf('left') >= 0) {
            orderListLeft.push(orderList[ll]);
        }
        else if (orderList[ll].indexOf('mid') >= 0) {
            orderListMid.push(orderList[ll]);
        }
        else if (orderList[ll].indexOf('right') >= 0) {
            orderListRight.push(orderList[ll]);
        }
    }

    // Render existing todo items into the three separate lists
    for (j = 0, k = orderListLeft.length; j < k; j++) {
        $itemListLeft.append(
            // "<li id='" + orderListLeft[j] + "'>" + "<span class='editable'>" + localStorage.getItem(orderListLeft[j]) + "</span> <a href='#'>X</a></li>"
            "<li id='" + orderListLeft[j] + "'>" + localStorage.getItem(orderListLeft[j]) + "&nbsp;&nbsp;&nbsp;<a href='#'>X</a></li>"
        );
    }
    for (j = 0, k = orderListMid.length; j < k; j++) {
        $itemListMid.append(
            // "<li id='" + orderListMid[j] + "'>" + "<span class='editable'>" + localStorage.getItem(orderListMid[j]) + "</span> <a href='#'>X</a></li>"
            "<li id='" + orderListMid[j] + "'>" + localStorage.getItem(orderListMid[j]) + "&nbsp;&nbsp;&nbsp;<a href='#'>X</a></li>"
        );
    }
    for (j = 0, k = orderListRight.length; j < k; j++) {
        $itemListRight.append(
            // "<li id='" + orderListMid[j] + "'>" + "<span class='editable'>" + localStorage.getItem(orderListMid[j]) + "</span> <a href='#'>X</a></li>"
            "<li id='" + orderListRight[j] + "'>" + localStorage.getItem(orderListRight[j]) + "&nbsp;&nbsp;&nbsp;<a href='#'>X</a></li>"
        );
    }

    $('li a').fadeOut();

    // Add todo
    $formLeft.submit(function(e) {
        e.preventDefault();
        $.publish('/add/', []);
    });

    $formMid.submit(function(e) {
        e.preventDefault();
        $.publish('/add/', []);
    });

    $formRight.submit(function(e) {
        e.preventDefault();
        $.publish('/add/', []);
    });

    // Remove todo
    $itemListLeft.delegate('a', 'click', function(e) {
        var $this = $(this);

        e.preventDefault();
        $.publish('/remove/', [$this]);
    });

    $itemListMid.delegate('a', 'click', function(e) {
        var $this = $(this);

        e.preventDefault();
        $.publish('/remove/', [$this]);
    });

    $itemListRight.delegate('a', 'click', function(e) {
        var $this = $(this);

        e.preventDefault();
        $.publish('/remove/', [$this]);
    });

    // Sort todo
    $itemListLeft.sortable({
        revert: true,
        stop: function() {
            $.publish('/regenerate-list/', []);
        }
    });

    $itemListMid.sortable({
        revert: true,
        stop: function() {
            $.publish('/regenerate-list/', []);
        }
    });

    $itemListRight.sortable({
        revert: true,
        stop: function() {
            $.publish('/regenerate-list/', []);
        }
    });

    // Edit and save todo
    // $editable.inlineEdit({
    //     save: function(e, data) {
    //             var $this = $(this);
    //             localStorage.setItem(
    //                 $this.parent().attr("id"), data.value
    //             );
    //         }
    // });

    // Clear all
    $clearAll.click(function(e) {
        e.preventDefault();
        var listToImpact = e.originalEvent.srcElement.getAttribute('data-list');
        $.publish('/clear-all/', [listToImpact]);
    });

    // Fade In and Fade Out the Remove link on hover
    $itemListLeft.delegate('li', 'mouseover mouseout', function(event) {
        var $this = $(this).find('a');

        if (event.type === 'mouseover') {
            $this.stop(true, true).fadeIn();
        } else {
            $this.stop(true, true).fadeOut();
        }
    });

    $itemListMid.delegate('li', 'mouseover mouseout', function(event) {
        var $this = $(this).find('a');

        if(event.type === 'mouseover') {
            $this.stop(true, true).fadeIn();
        } else {
            $this.stop(true, true).fadeOut();
        }
    });

    $itemListRight.delegate('li', 'mouseover mouseout', function(event) {
        var $this = $(this).find('a');

        if(event.type === 'mouseover') {
            $this.stop(true, true).fadeIn();
        } else {
            $this.stop(true, true).fadeOut();
        }
    });

    // Subscribes
    $.subscribe('/add/', function() {
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
                listToImpact;

            // Take the value of the input field and save it to localStorage
            localStorage.setItem(
                "todo-" + listID + '-' + i, todoToAdd.value
            );

            // Set the to-do max counter so on page refresh it keeps going up instead of reset
            localStorage.setItem('todo-counter-' + listID, i);

            switch (listID) {
                case 'left':
                    listToImpact = $itemListLeft;
                    break;
                case 'mid':
                    listToImpact = $itemListMid;
                    break;
                case 'right':
                    listToImpact = $itemListRight;
                    break;
            }
            // Append a new list item with the value of the new todo list
            listToImpact.append(
                // "<li id='todo-" + listID + '-' + i + "'>" + "<span class='editable'>" + localStorage.getItem("todo-" + listID + '-' + i) + " </span><a href='#'>x</a></li>"
                "<li id='todo-" + listID + '-' + i + "'>" + localStorage.getItem("todo-" + listID + '-' + i) + "&nbsp;&nbsp;&nbsp;<a href='#'>x</a></li>"
            );
            $('li a:visible').fadeOut();

            $.publish('/regenerate-list/', []);

            // Hide the new list, then fade it in for effects
            $("#todo-" + listID + '-' + i).css('display', 'none').fadeIn();

            // Empty the input field
            todoToAdd.value = "";

            i++;
        }
    });

    $.subscribe('/remove/', function($this) {
        var parentId = $this.parent().attr('id');

        // Remove todo list from localStorage based on the id of the clicked parent element
        localStorage.removeItem(
            "'" + parentId + "'"
        );

        // Fade out the list item then remove from DOM
        $this.parent().fadeOut(function() {
            $this.parent().remove();

            $.publish('/regenerate-list/', []);
        });
    });

    $.subscribe('/regenerate-list/', function() {
        var $todoItemsLeft = $('#shown-items-left li'),
            $todoItemsMid = $('#shown-items-mid li');
            $todoItemsRight = $('#shown-items-right li');
        // Empty the order array
        order.length = 0;

        // Go through the list item, grab the ID then push into the array
        $todoItemsLeft.each(function() {
            var id = $(this).attr('id');
            order.push(id);
        });

        $todoItemsMid.each(function() {
            var id = $(this).attr('id');
            order.push(id);
        });

        $todoItemsRight.each(function() {
            var id = $(this).attr('id');
            order.push(id);
        });

        // Convert the array into string and save to localStorage
        localStorage.setItem(
            'todo-orders', order.join(',')
        );
    });

    $.subscribe('/clear-all/', function(listToImpactName) {
        var $todoListLi = $('#shown-items-left li'),
            listToImpact;

        switch (listToImpactName) {
            case 'left':
                listToImpact = $('#shown-items-left li');
                break;
            case 'mid':
                listToImpact = $('#shown-items-mid li');
                break;
            case 'right':
                listToImpact = $('#shown-items-right li');
                break;
        }

        orderList = localStorage.getItem('todo-orders');
        orderList = orderList ? orderList.split(',') : [];
        var newOrderList = [];
        for (ind = 0; ind < orderList.length; ind++) {
            if (orderList[ind].indexOf(listToImpactName) < 0) {
                newOrderList.push(orderList[ind]);
            } else {
                localStorage.removeItem(orderList[ind]);
            }
        }
        localStorage.setItem('todo-orders', newOrderList);
        listToImpact.remove();
    });
});
