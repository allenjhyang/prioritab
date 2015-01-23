// Other Prioritab scripts

function GetTime() {
    var prettyTime = moment().format("h:mm:ss A");
    document.getElementById('clockbox').innerHTML = prettyTime;
}

function GetDate() {
    var dayOfWeek = moment().format('dddd'),
        prettyDate = moment().format("MMM D, YYYY");

    document.getElementById('daybox').innerHTML = dayOfWeek;
    document.getElementById('datebox').innerHTML = prettyDate;
}

function CountdownDay() {
    var now = new Date(),
        todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        progressMS = now - todayStart,
        totalDayMS = 24 * 60 * 60 * 1000,
        progressPCT = progressMS / totalDayMS * 100,
        prettyPCT = Math.round(progressPCT);

    document.getElementById('countdown-day-amount').innerHTML = prettyPCT + "%";
}

function CountdownMonthYear() {
    var now = new Date(),
        monthStart = new Date(now.getFullYear(), now.getMonth(), 1),
        progressMonthMS = now - monthStart,
        totalMonthMS = moment().daysInMonth() * 24 * 60 * 60 * 1000,
        monthProgressPCT = progressMonthMS / totalMonthMS * 100,
        prettyMonthPCT = Math.round(monthProgressPCT),
        yearStart = new Date(now.getFullYear(), 0, 1),
        progressYearMS = now - yearStart,
        totalYearMS = 365 * 24 * 60 * 60 * 1000,
        yearProgressPCT = progressYearMS / totalYearMS * 100,
        prettyYearPCT = Math.floor(yearProgressPCT);

    document.getElementById('countdown-month-amount').innerHTML = prettyMonthPCT + "%";
    document.getElementById('countdown-year-amount').innerHTML = prettyYearPCT + "%";
}

function ScrollMessage() {
    $('.shown-items').each(function(index) {
        if ($(this).height() > 1 && $(this).height() > ($(this).parent().height() - 40)) {
            $(this).parent().parent().siblings('.scroll-message').show();
        } else {
            $(this).parent().parent().siblings('.scroll-message').fadeOut();
        }
    });
}

window.onload = function() {
    GetTime();
    GetDate();
    CountdownDay();
    CountdownMonthYear();
    setInterval(GetTime, 1000);
    setInterval(CountdownDay, 900000);

    chrome.storage.sync.get('user-background-color', function(result) {
        $('body').css('background-color', (result['user-background-color']) ? result['user-background-color'] : '#333333');
    });

    chrome.storage.sync.get('user-font-color', function(result) {
        $('body').css('color', (result['user-font-color']) ? result['user-font-color'] : 'white');
    });

    chrome.storage.sync.get('user-shadow-color', function(result) {
        $('.shadow-color').css('color', (result['user-shadow-color']) ? result['user-shadow-color'] : 'grey');
    });

    $('.edit-priorities-link').click(function(e) {
        $('.edit-priorities').each(function(index) {
            $(this).hide();
            $(this).siblings('.edit-priorities-link').fadeIn();
        });
        $(this).hide();
        prioritiesList = $(this).siblings('.edit-priorities')[0];
        $(prioritiesList).fadeIn();
        $(prioritiesList).find('input.todo').focus();
    });

    $('.hide-edit').click(function(e) {
        $(this).parent().hide();
        $(this).parent().siblings('.edit-priorities-link').show();
    });

    $('#info-corner').hover(function() {
        $(this).children('#info-button').hide();
        $(this).children('#info').fadeIn();
    }, function() {
        $(this).children('#info').hide();
        $(this).children('#info-button').fadeIn();
    });

    $('#color-button').click(function() {
        $('#color-button').hide();
        $('#color-selectors').fadeIn();
    });

    $('#hide-color-selectors').click(function() {
        $('#color-selectors').hide();
        $('#color-button').fadeIn();
    });

    $('#background-color-selector').colpick({
        layout: 'full',
        submit: false,
        colorScheme: 'dark',
        onChange: function(hsb,hex,rgb,el,bySetColor) {
            $('body').css('background-color', '#' + hex);
            chrome.storage.sync.set({'user-background-color': '#' + hex});
        },
        onHide: function(cpobj) {
            $('.color-selector-label').css('visibility', 'visible');
            $('.color-selector-label').css('font-weight', 'normal');
        }
    });

    $('#font-color-selector').colpick({
        layout: 'full',
        submit: false,
        colorScheme: 'dark',
        onChange: function(hsb,hex,rgb,el,bySetColor) {
            $('body').css('color', '#' + hex);
            chrome.storage.sync.set({'user-font-color': '#' + hex});
        },
        onHide: function(cpobj) {
            $('.color-selector-label').css('visibility', 'visible');
            $('.color-selector-label').css('font-weight', 'normal');
        }
    });

    $('#shadow-color-selector').colpick({
        layout: 'full',
        submit: false,
        colorScheme: 'dark',
        onChange: function(hsb,hex,rgb,el,bySetColor) {
            $('.shadow-color').css('color', '#' + hex);
            chrome.storage.sync.set({'user-shadow-color': '#' + hex});
        },
        onHide: function(cpobj) {
            $('.color-selector-label').css('visibility', 'visible');
            $('.color-selector-label').css('font-weight', 'normal');
        }
    });

    $('.color-selector-label').click(function(e) {
        $(this).siblings('.color-selector-label').css('visibility', 'hidden');
        $(this).show();
        $(this).css('font-weight', 'bold');
    });

    $('#restore-default-colors').click(function(e) {
        $('body').css('background-color', '#333333');
        chrome.storage.sync.set({'user-background-color': '#333333'});
        $('body').css('color', 'white');
        chrome.storage.sync.set({'user-font-color': 'white'});
        $('.shadow-color').css('color', 'gray');
        chrome.storage.sync.set({'user-shadow-color': 'gray'});
    });

    ScrollMessage();
};
