// ==UserScript==
// @name           Github UserScript
// @namespace      Jun HASHIMOTO
// @include        https://github.com/*
// @version        1.0.0
// @require http://code.jquery.com/jquery-2.1.1.min.js
// ==/UserScript==

var buttonArea = $('.pagehead-actions:first');

var makeDiffButton = function() {
    var diffButton = $('<li><a href="#" class="button minibutton showDiffLink">Show Diff</a></li>');
    diffButton.bind("click", showDiffLink);
    buttonArea.append(diffButton);
};

var makeRadioButtons = function() {
    var commitAreas = $('.commit-group-item');
    commitAreas.each(function(){
        var commitLink = $(this).find('.zeroclipboard-button:first');
        var commitHash = commitLink.attr('data-clipboard-text');
        var fromRadioButton = makeRadioButton('commitFrom', 'from', commitHash);
        var toRadioButton   = makeRadioButton('commitTo', 'to', commitHash);
        $(this).append(fromRadioButton);
        $(this).append(toRadioButton);
    });
};

var makeRadioButton = function(propertyName, textName, commitHash){
    return $('<span><input type="radio" name=' + propertyName + ' value=' + commitHash + '></input>' + textName + '</span>');
};

var showDiffLink = function() {
    var fromCommit = getCommitHash('commitFrom');
    var toCommit   = getCommitHash('commitTo');
    if (fromCommit && toCommit) {
        var currentUrl      = location.href;
        var commitUrlHeader = getCommitUrl(currentUrl);
        var commitUrl       = commitUrlHeader + fromCommit + '...' + toCommit;
        location.href       = commitUrl;
    }
};

var getCommitHash = function(className) {
    var radioButtonAttribute = 'input[name=' + className + ']:checked';
    return $(radioButtonAttribute).attr('value');
};

var getCommitUrl = function(currentUrl) {
    return currentUrl.replace(/commits\/(\S+)/, 'compare/');
};

var hasDiffButton = function() {
    var diffButton = document.getElementsByClassName('showDiffLink');
    return ( diffButton.length === 0 ) ? false : true;
};

var hasReviewButton = function() {
    var perlReviewButton = $('.showPerlCodeReviewLink');
    var JSReviewButton = $('.showJSCodeReviewLink');
    return ( perlReviewButton.size() && JSReviewButton.size() ) ? true : false;
};

var onLocationChange = function(callback) {
    var previous = '';
    setInterval(function(e) {
        if (previous != location.href) {
            previous = location.href;
            callback(location);
        }
    }, 1000);
};

// main function
onLocationChange( function(location) {
    if( location.pathname.match(/\/commits\//) && !hasDiffButton() ){
        makeDiffButton();
        makeRadioButtons();
    }
});
