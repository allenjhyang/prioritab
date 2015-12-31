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

function CheckDayCountdown() {
    if ($("#workday-checkbox").is(":checked")) {
        chrome.storage.sync.set({'user-use-workday': 'true'});
        CountdownWorkday();
    } else {
        chrome.storage.sync.set({'user-use-workday': 'false'});
        CountdownDay();
    }
}

function CountdownDay() {
    var now = new Date(),
        todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        progressMS = now - todayStart,
        totalDayMS = 24 * 60 * 60 * 1000,
        progressPCT = progressMS / totalDayMS * 100,
        prettyPCT = Math.round(progressPCT);

    $("#countdown-day .countdown-label").replaceWith("<div class='countdown-label'>...of the day</div>");
    document.getElementById('countdown-day-amount').innerHTML = prettyPCT + "%";
}

function CountdownWorkday() {

    var workdayStartString, workdayEndString, workdayStartHour, workdayStartMin, workdayEndHour, workdayEndMin, progressPCT;

    chrome.storage.sync.get(['user-workday-start', 'user-workday-end'], function(retrieved) {
        workdayStartString = retrieved['user-workday-start'] ? retrieved['user-workday-start'] : "09:00";
        workdayEndString = retrieved['user-workday-end'] ? retrieved['user-workday-end'] : "18:00";
        workdayStartHour = workdayStartString.split(":")[0];
        workdayStartMin = workdayStartString.split(":")[1];
        workdayEndHour = workdayEndString.split(":")[0];
        workdayEndMin = workdayEndString.split(":")[1];
        var now = new Date(),
            workdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(workdayStartHour), parseInt(workdayStartMin)),
            workdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(workdayEndHour), parseInt(workdayEndMin));

        if (now < workdayStart) {
            progressPCT = 0;
        } else if (now > workdayEnd) {
            progressPCT = 100;
        } else {
            var progressMS = now - workdayStart,
                totalDayMS = workdayEnd - workdayStart;
            progressPCT = progressMS / totalDayMS * 100;
        }
        var prettyPCT = Math.round(progressPCT);
        $("#countdown-day .countdown-label").replaceWith("<div class='countdown-label'>...of the workday</div>");
        document.getElementById('countdown-day-amount').innerHTML = prettyPCT + "%";
    });

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

// function ScrollMessage() {
//     $('.shown-items').each(function(index) {
//         if ($(this).height() > 1 && $(this).height() > ($(this).parent().height() - 55)) {
//             $(this).parent().parent().siblings('.scroll-message').show();
//         } else {
//             $(this).parent().parent().siblings('.scroll-message').fadeOut();
//         }
//     });
// }

$(document).click(function(event) {
    if(!$(event.target).closest('#customize-corner').length) {
        if($('#customize-corner').is(":visible")) {
            $('#customize-selectors').hide();
            $('#customize-button').fadeIn();
        }
    }

    if(!$(event.target).closest('#list-left').length) {
        if($('#list-left .edit-priorities').is(":visible")) {
            $('#list-left .edit-priorities').hide();
            $('#list-left .edit-priorities-link').show();
        }
    }

    if(!$(event.target).closest('#list-mid').length) {
        if($('#list-mid .edit-priorities').is(":visible")) {
            $('#list-mid .edit-priorities').hide();
            $('#list-mid .edit-priorities-link').show();
        }
    }

    if(!$(event.target).closest('#list-right').length) {
        if($('#list-right .edit-priorities').is(":visible")) {
            $('#list-right .edit-priorities').hide();
            $('#list-right .edit-priorities-link').show();
        }
    }
});

function SetColorProperty(classToChange, propToChange, newValue) {
    var style = $('<style>.' + classToChange + ' { ' + propToChange + ': ' + newValue + '; }</style>');
    $('html > head').append(style);
}

function SetColors() {
    chrome.storage.sync.get('user-background-color', function(result) {
        var bgcolor = (result['user-background-color']) ? result['user-background-color'] : '#333333';
        SetColorProperty('main-bgcolor', 'background-color', bgcolor);
    });

    chrome.storage.sync.get('user-font-color', function(result) {
        var fontColor = (result['user-font-color']) ? result['user-font-color'] : 'white';
        SetColorProperty('main-font-color', 'color', fontColor);
        SetColorProperty('main-border-color', 'color', fontColor);
    });

    chrome.storage.sync.get('user-shadow-color', function(result) {
        var shadowColor = (result['user-shadow-color']) ? result['user-shadow-color'] : 'grey';
        SetColorProperty('shadow-color', 'color', shadowColor);
        SetColorProperty('shadow-border-color', 'color', shadowColor);
    });
}

window.onload = function() {
    GetTime();
    GetDate();
    chrome.storage.sync.get('user-use-workday', function(result) {
        if (result['user-use-workday'] === "true") {
            CountdownWorkday();
            $("#workday-checkbox").prop("checked", true);
        } else {
            CountdownDay();
        }
    });
    CountdownMonthYear();
    setInterval(GetTime, 1000);
    setInterval(CountdownDay, 900000);

    SetColors();

    // Show update message?
    chrome.storage.sync.get('update-20150510', function(result) {
        if (!result['update-20150510']) {
            $("#update-footer").fadeIn(500).fadeOut(500).fadeIn(500);
            chrome.storage.sync.set({'update-20150510': true});
        }
    });

    $("#update-hide").click(function(e) {
        $("#update-footer").hide();
        chrome.storage.sync.set({'update-20150510': true});
    });

    chrome.storage.sync.get(['user-workday-start', 'user-workday-end'], function(retrieved) {
        workdayStart = retrieved['user-workday-start'] ? retrieved['user-workday-start'] : "09:00";
        workdayEnd = retrieved['user-workday-end'] ? retrieved['user-workday-end'] : "18:00";
        $("#workday-start-timeinput")[0].value = workdayStart;
        $("#workday-end-timeinput")[0].value = workdayEnd;
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

    $('#customize-button').click(function() {
        $('#customize-button').hide();
        $('#customize-selectors').fadeIn();
    });

    $('#hide-customize-selectors').click(function() {
        $('#customize-selectors').hide();
        $('#customize-button').fadeIn();
    });

    $('#background-color-selector').colpick({
        layout: 'full',
        submit: false,
        colorScheme: 'dark',
        color: '#333333',
        onChange: function(hsb,hex,rgb,el,bySetColor) {
            SetColorProperty('main-bgcolor', 'background-color', '#' + hex);
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
        color: '#FFFFFF',
        onChange: function(hsb,hex,rgb,el,bySetColor) {
            SetColorProperty('main-font-color', 'color', '#' + hex);
            SetColorProperty('main-border-color', 'color', '#' + hex);
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
        color: '#808080',
        onChange: function(hsb,hex,rgb,el,bySetColor) {
            SetColorProperty('shadow-color', 'color', '#' + hex);
            SetColorProperty('shadow-border-color', 'color', '#' + hex);
            chrome.storage.sync.set({'user-shadow-color': '#' + hex});
        },
        onHide: function(cpobj) {
            $('.color-selector-label').css('visibility', 'visible');
            $('.color-selector-label').css('font-weight', 'normal');
        }
    });

    $('.customize-selector-label').click(function(e) {
        $(this).siblings('.color-selector-label').css('visibility', 'hidden');
        $(this).show();
        $(this).css('font-weight', 'bold');
    });

    $('#restore-default-colors').click(function(e) {
        SetColorProperty('main-bgcolor', 'background-color', '#333333');
        chrome.storage.sync.set({'user-background-color': '#333333'});
        SetColorProperty('main-font-color', 'color', 'white');
        SetColorProperty('main-border-color', 'color', 'white');
        chrome.storage.sync.set({'user-font-color': 'white'});
        SetColorProperty('shadow-color', 'color', 'gray');
        SetColorProperty('shadow-border-color', 'color', 'gray');
        chrome.storage.sync.set({'user-shadow-color': 'gray'});
    });

    $('#workday-checkbox').click(function(e) {
        CheckDayCountdown();
    });

    $("#workday-time-save").click(function(e) {
        var workdayStart = $("#workday-start-timeinput")[0].value,
            workdayEnd = $("#workday-end-timeinput")[0].value;
        chrome.storage.sync.set({'user-workday-start': workdayStart, 'user-workday-end': workdayEnd});
        CheckDayCountdown();
    });

    // ScrollMessage();
};
