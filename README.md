jQuery.Ekzo.Autocomplete
========================

Simple jquery plugin that represents autocomplete options for input fields.

Plugin have some options:
-------------------------
searchType      :  'startWith',    //Type of search match.
                                   //Avalible options: startWith, contains
minCharsCount   :  0,              //Chars minimum count to fire match checking.
                                   //Default 0. It's means search start with any chars count.
source          :  null,           //Autocomplete options source list. You can provide array of strings or function returning array of strings
highlightMatch  :  true,           //Hilglight matched parts in autocomplete list
emptyText       :  'Search...',    //Placeholder for input field to be displayed if value is empty
ignoreCase      :  true,           //Ignore case on match check
highlightOnError:  false           //Add class for input field if there's no options matched
