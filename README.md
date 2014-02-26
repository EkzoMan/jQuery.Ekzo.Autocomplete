jQuery.Ekzo.Autocomplete
========================

Simple jquery plugin that represents autocomplete options for input fields.

Plugin provides options:
-------------------------
><i>//Type of search match. Avalible options: 'startWith', 'contains'</i><br />
searchType      :  'startWith',   <br />
<i>//Chars minimum count to fire match checking. Default 0. It's means search start with any chars count.</i><br />
minCharsCount   :  0,              <br />
<i>//Autocomplete options source list. You can provide array of strings or function returning array of strings</i><br />
source          :  null,           <br />
<i>//Hilglight matched parts in autocomplete list</i><br />
highlightMatch  :  true,           <br />
<i>//Placeholder for input field to be displayed if value is empty</i><br />
emptyText       :  'Search...',    <br />
<i>//Ignore case on match check</i><br />
ignoreCase      :  true,           <br />
<i>//Add class for input field if there's no options matched</i><br />
highlightOnError:  false           <br />
